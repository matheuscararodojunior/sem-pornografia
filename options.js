'use strict';
const api = globalThis.browser ?? globalThis.chrome;
const { DEFAULT_SETTINGS, DEFAULT_TERMS } = globalThis.SemPorno;
const $ = (id) => document.getElementById(id);
const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const domain = (s) => s.toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').replace(/[/:].*$/, '');
const CHECKS = ['enabled', 'blockDomains', 'safeSearch', 'blockPages'];
const LISTS = ['extraTerms', 'allowTerms', 'allowSites'];

const terms = [
  ...DEFAULT_TERMS.STRONG,
  ...DEFAULT_TERMS.STRONG_SUBSTRINGS.map((t) => `*${t}*`),
  ...DEFAULT_TERMS.WEAK.map((t) => `(${t})`),
];
$('termCount').textContent = new Set(terms).size;
$('termList').textContent = 'Fortes: 1 já bloqueia. *pedaço*: casa dentro de palavras. (fraco): precisa de 2.\n\n' + [...new Set(terms)].join(', ');
$('domainCount').textContent = '~48 mil';

async function load() {
  const s = await api.storage.sync.get(DEFAULT_SETTINGS);
  for (const k of CHECKS) $(k).checked = s[k];
  for (const k of LISTS) $(k).value = s[k].join('\n');
}

// Liga/desliga as regras de rede (lista de sites + SafeSearch) e libera os sites da lista branca.
async function applyNetworkRules(s) {
  const on = (flag) => s.enabled && s[flag];
  await api.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: [on('blockDomains') && 'block', on('safeSearch') && 'safesearch'].filter(Boolean),
    disableRulesetIds: [!on('blockDomains') && 'block', !on('safeSearch') && 'safesearch'].filter(Boolean),
  });
  const old = await api.declarativeNetRequest.getDynamicRules();
  await api.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: old.map((r) => r.id),
    addRules: s.allowSites.length
      ? [{ id: 1, priority: 100, action: { type: 'allow' }, condition: { requestDomains: s.allowSites, resourceTypes: ['main_frame', 'sub_frame', 'image', 'media', 'script', 'xmlhttprequest'] } }]
      : [],
  });
}

let saveTimer = 0;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const s = Object.fromEntries(CHECKS.map((k) => [k, $(k).checked]));
    s.extraTerms = lines($('extraTerms').value);
    s.allowTerms = lines($('allowTerms').value);
    s.allowSites = [...new Set(lines($('allowSites').value).map(domain).filter(Boolean))];
    await api.storage.sync.set(s);
    await applyNetworkRules(s);
    $('status').textContent = 'Salvo ✓';
    setTimeout(showCount, 700);
  }, 300);
}

async function showCount() {
  try {
    const [tab] = await api.tabs.query({ active: true, currentWindow: true });
    const n = await api.tabs.sendMessage(tab.id, { type: 'spx:count' });
    $('count').textContent = `${n} ${n === 1 ? 'item bloqueado' : 'itens bloqueados'} nesta aba`;
  } catch {
    $('count').textContent = '';
  }
}

document.addEventListener('input', save);
load().then(showCount);
