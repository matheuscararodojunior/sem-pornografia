/* Sem Pornografia — content script.
 * Sites conhecidos: esconde cada card/post/vídeo com conteúdo adulto.
 * Qualquer outro site: se a página em si for pornográfica, redireciona pra tela de bloqueio. */
(() => {
  'use strict';
  const api = globalThis.browser ?? globalThis.chrome;
  const { DEFAULT_SETTINGS, buildMatcher, itemHit } = globalThis.SemPorno;

  const host = location.hostname;
  const is = (re) => re.test(host);
  const SITE = is(/(^|\.)youtube\.com$/) ? 'youtube'
    : is(/(^|\.)instagram\.com$/) ? 'instagram'
    : host === 'news.google.com' ? 'gnews'
    : is(/(^|\.)google\.[a-z.]+$/) ? 'google'
    : is(/(^|\.)bing\.com$/) ? 'bing'
    : is(/(^|\.)duckduckgo\.com$/) ? 'duckduckgo'
    : is(/(^|\.)reddit\.com$/) ? 'reddit'
    : is(/(^|\.)(x|twitter)\.com$/) ? 'x'
    : is(/(^|\.)tiktok\.com$/) ? 'tiktok'
    : 'generic';

  const ATTR = 'data-spx'; // hide | cover
  const MARKED = `[${ATTR}]`;
  const SUGGESTIONS = '[role="listbox"] [role="option"]';

  // pick: 'outer' ignora candidato dentro de outro; 'leaf' só o mais interno. force: esconde sem olhar o texto.
  const RULES = {
    youtube: [
      {
        s: [
          'ytd-rich-item-renderer', 'ytd-video-renderer', 'ytd-compact-video-renderer', 'ytd-grid-video-renderer',
          'ytd-playlist-renderer', 'ytd-compact-playlist-renderer', 'ytd-radio-renderer', 'ytd-compact-radio-renderer',
          'ytd-channel-renderer', 'ytd-reel-item-renderer', 'ytd-backstage-post-thread-renderer', 'ytd-post-renderer',
          'ytd-movie-renderer', 'ytd-universal-watch-card-renderer', 'ytd-notification-renderer',
          'yt-lockup-view-model', 'ytm-shorts-lockup-view-model', 'ytm-shorts-lockup-view-model-v2',
        ].join(','),
        action: 'hide',
      },
      { s: 'ytd-reel-video-renderer', action: 'cover' },
      { s: SUGGESTIONS, action: 'hide' },
    ],
    google: [
      {
        s: '.MjjYud, .g, .SoaBEf, g-inner-card, .WlydOe, .JJZKK, .related-question-pair, div[data-ri], .isv-r, ' +
          'div[jsname="dTDiAc"], .eA0Zlc, [data-vid], .RzdJxc',
        action: 'hide',
        pick: 'leaf',
      },
      { s: SUGGESTIONS, action: 'hide' },
    ],
    gnews: [
      { s: 'c-wiz', action: 'hide', pick: 'leaf', exclude: 'header, nav, [role="navigation"], [role="tablist"]' },
    ],
    bing: [{ s: 'li.b_algo, .dg_u, .imgpt, .mc_vtvc, .b_ans, .mmComponent_images li', action: 'hide' }, { s: SUGGESTIONS, action: 'hide' }],
    duckduckgo: [
      {
        s: 'article[data-testid="result"], li[data-layout="organic"], .tile--img, [data-testid="image-result"], ' +
          '[data-testid="video-result"], [data-testid="news-result"]',
        action: 'hide',
      },
      { s: SUGGESTIONS, action: 'hide' },
    ],
    reddit: [
      { s: 'shreddit-post[nsfw], shreddit-post[over18], [data-nsfw="true"], shreddit-post[content-rating="nsfw"]', action: 'hide', force: 'nsfw' },
      { s: 'shreddit-post, article, [data-testid="search-post-unit"], faceplate-tracker[noun="community"]', action: 'hide' },
    ],
    x: [
      { s: 'article[data-testid="tweet"], [data-testid="UserCell"], [data-testid="trend"], [data-testid="cellInnerDiv"] [role="link"][href*="/status/"]', action: 'hide' },
    ],
    tiktok: [
      { s: '[data-e2e="recommend-list-item-container"], article[data-scroll-index]', action: 'cover' },
      { s: '[data-e2e="user-post-item"], [data-e2e="search_top-item"], [data-e2e="search-card-desc"], [data-e2e="explore-item"]', action: 'hide' },
    ],
    instagram: [
      { s: 'article', action: 'hide' },
      { s: 'a[href*="/p/"], a[href*="/reel/"]', skipInside: 'article, a[href*="/p/"], a[href*="/reel/"]', action: 'hide' },
    ],
    generic: [],
  };
  const RULESET = RULES[SITE];

  const IGNORE_MUTATIONS = SITE === 'youtube' ? '.html5-video-player, yt-live-chat-renderer, #chat' : null;

  const LIKE = 'svg[aria-label="Curtir"], svg[aria-label="Like"], svg[aria-label="Me gusta"]';
  const MORE = /^[\s….]*(mais|more|más|ver más|もっと見る|続きを読む|더 보기)$/i;
  let expanding = false;

  const EXTRA = {
    youtube(out) {
      if (location.pathname !== '/watch') return;
      const player = document.querySelector('#movie_player');
      const meta = document.querySelector('ytd-watch-metadata');
      if (!player || !meta) return;
      const text = ['#title', 'ytd-channel-name'].map((q) => meta.querySelector(q)?.textContent || '').join(' ');
      out.set(player, { action: 'cover', text });
      out.set(meta, { action: 'hide', text });
    },
    instagram(out) {
      expandCaptions();
      for (const like of document.querySelectorAll(LIKE)) {
        if (like.closest('article')) continue;
        const post = postBox(like);
        if (post && !out.has(post)) out.set(post, { action: 'hide', text: null });
      }
      for (const v of document.querySelectorAll('video')) {
        if (v.closest('article') || [...out.keys()].some((p) => p.contains(v))) continue;
        const box = videoBox(v);
        if (box && !out.has(box)) out.set(box, { action: 'cover', text: null });
      }
    },
  };

  // Legenda cortada ("... mais"): o texto completo só entra no DOM depois do clique.
  function expandCaptions() {
    for (const b of document.querySelectorAll('span[role="button"], div[role="button"], span[tabindex], button')) {
      if (b.hasAttribute('data-spx-more') || b.closest('a') || b.textContent.length > 20 || !MORE.test(b.textContent)) continue;
      b.setAttribute('data-spx-more', '');
      expanding = true;
      try {
        b.click();
      } finally {
        expanding = false;
      }
    }
  }

  function postBox(like) {
    let best = null;
    for (let el = like.parentElement, d = 0; el && d < 25; el = el.parentElement, d++) {
      if (el === document.body || el.matches('main, [role="main"], [role="dialog"]')) break;
      if (el.querySelectorAll(LIKE).length > 1) break;
      if (el.querySelector('video, img')) best = el;
    }
    return best;
  }

  function videoBox(v) {
    const maxH = innerHeight * 1.15;
    let best = null;
    for (let el = v.parentElement, d = 0; el && d < 20; el = el.parentElement, d++) {
      if (el === document.body || el.matches('main, [role="main"], [role="dialog"]')) break;
      if (el.querySelectorAll('video').length > 1) break;
      if (el.getBoundingClientRect().height > maxH) break;
      best = el;
    }
    return best;
  }

  const SKIP_TEXT = new Set(['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEMPLATE']);
  const textFilter = {
    acceptNode: (n) => (SKIP_TEXT.has(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  };

  // Texto do elemento (nós separados por espaço) + alt/aria-label/title. limit: corta textos gigantes.
  function blob(el, limit = Infinity) {
    const parts = [];
    let len = 0;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, textFilter);
    for (let n; len < limit && (n = w.nextNode()); ) {
      parts.push(n.data);
      len += n.data.length;
    }
    const own = el.getAttribute?.('aria-label');
    if (own) parts.push(own);
    for (const n of el.querySelectorAll('img[alt], [aria-label], [title]')) {
      for (const a of ['alt', 'aria-label', 'title']) {
        const v = n.getAttribute(a);
        if (v) parts.push(v);
      }
      if (parts.length > 5000) break;
    }
    return parts.join(' ');
  }

  function collect() {
    const out = new Map(); // el -> { action, text, force }
    for (const r of RULESET) {
      for (const el of document.querySelectorAll(r.s)) {
        const skip = r.pick === 'leaf' ? el.querySelector(r.s) : el.parentElement?.closest(r.skipInside || r.s);
        if (skip || out.has(el) || (r.exclude && el.closest(r.exclude))) continue;
        out.set(el, { action: r.action, text: null, force: r.force });
      }
    }
    EXTRA[SITE]?.(out);
    return out;
  }

  let settings = DEFAULT_SETTINGS;
  let scanText = () => ({ strong: new Set(), weak: new Set() });
  let cache = new WeakMap(); // el -> { text, hit }
  let allowed = false;

  function mark(el, state, term) {
    if (state === 'cover' && getComputedStyle(el).position === 'static') {
      el.style.setProperty('position', 'relative');
      el.setAttribute('data-spx-pos', '');
    }
    el.setAttribute('data-spx-term', term);
    el.setAttribute(ATTR, state);
  }

  function unmark(el) {
    if (el.hasAttribute('data-spx-pos')) {
      el.style.removeProperty('position');
      el.removeAttribute('data-spx-pos');
    }
    el.removeAttribute('data-spx-term');
    el.removeAttribute(ATTR);
  }

  function scanItems() {
    const keep = new Set();
    for (const [el, { action, text, force }] of collect()) {
      let c = cache.get(el);
      const t = force ? '' : text ?? blob(el);
      if (!c || c.text !== t) {
        c = { text: t, hit: force || itemHit(scanText(t)) };
        cache.set(el, c);
      }
      if (!c.hit) continue;
      keep.add(el);
      if (el.getAttribute(ATTR) !== action) mark(el, action, c.hit);
      if (action === 'cover') for (const v of el.querySelectorAll('video')) if (!v.paused) v.pause();
    }
    for (const el of document.querySelectorAll(MARKED)) if (!keep.has(el)) unmark(el);
  }

  // ---------- página inteira (sites desconhecidos) ----------
  const meta = (sel) => document.querySelector(sel)?.getAttribute('content') || '';
  let lastPageKey = '';

  function checkPage() {
    if (SITE !== 'generic' || !settings.blockPages || !document.body) return;
    const key = location.href + '|' + document.title;
    if (key === lastPageKey) return;
    lastPageKey = key;
    const head = scanText(
      [
        document.title,
        meta('meta[name="description"]'),
        meta('meta[name="keywords"]'),
        meta('meta[property="og:title"]'),
        meta('meta[property="og:description"]'),
        meta('meta[name="rating"]'),
        location.hostname,
        decodeURIComponent(location.pathname).replace(/[-_/.+]/g, ' '),
      ].join(' '),
    );
    const body = scanText(blob(document.body, 40000));
    const weak = new Set([...head.weak, ...body.weak]);
    const rating = /adult|mature|rta-5042/i.test(meta('meta[name="rating"]'));
    const reason = rating ? 'site marcado como adulto'
      : head.strong.size ? [...head.strong][0]
      : body.strong.size >= 3 ? [...body.strong].slice(0, 3).join(', ')
      : body.strong.size >= 1 && weak.size >= 4 ? [...body.strong][0]
      : null;
    if (reason) {
      const u = new URL(api.runtime.getURL('blocked.html'));
      u.searchParams.set('r', reason);
      u.searchParams.set('h', location.hostname);
      location.replace(u.href);
    }
  }

  function scan() {
    if (!settings.enabled || allowed) {
      for (const el of document.querySelectorAll(MARKED)) unmark(el);
      return;
    }
    if (SITE === 'generic') checkPage();
    else scanItems();
  }

  let timer = 0;
  let lastRun = 0;
  function schedule() {
    if (timer || document.hidden) return;
    // Em site genérico só precisa rechecar quando muda título/URL; menos agressivo.
    const gap = SITE === 'generic' ? 1500 : 300;
    const wait = Math.max(0, gap - (performance.now() - lastRun));
    timer = setTimeout(() => {
      timer = 0;
      lastRun = performance.now();
      scan();
    }, wait);
  }

  function onMutations(records) {
    if (!IGNORE_MUTATIONS) return schedule();
    for (const r of records) {
      const node = r.target.nodeType === Node.ELEMENT_NODE ? r.target : r.target.parentElement;
      if (!node?.closest(IGNORE_MUTATIONS)) return schedule();
    }
  }

  const onList = (list, h) => list.some((d) => h === d || h.endsWith('.' + d));

  async function load() {
    settings = await api.storage.sync.get(DEFAULT_SETTINGS);
    scanText = buildMatcher(settings);
    cache = new WeakMap();
    lastPageKey = '';
    allowed = onList(settings.allowSites.map((d) => d.toLowerCase().replace(/^www\./, '')), host.replace(/^www\./, ''));
    schedule();
  }

  // Sem "clique pra ver": só bloqueia cliques que tentariam abrir algo coberto.
  document.addEventListener(
    'click',
    (e) => {
      if (expanding) return;
      if (e.target.closest?.(`[${ATTR}="cover"]`)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true,
  );
  // Conteúdo que chega depois (SPA/lazy load) com o mesmo título: checa mais uma vez.
  addEventListener('load', () =>
    setTimeout(() => {
      lastPageKey = '';
      schedule();
    }, 2500),
  );

  document.addEventListener(
    'play',
    (e) => {
      const v = e.target;
      if (v instanceof HTMLMediaElement && v.closest(MARKED)) v.pause();
    },
    true,
  );

  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('DOMContentLoaded', schedule);
  new MutationObserver(onMutations).observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  api.storage.onChanged.addListener((_c, area) => {
    if (area === 'sync') load();
  });

  api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === 'spx:count') sendResponse(document.querySelectorAll(MARKED).length);
  });

  load();
})();
