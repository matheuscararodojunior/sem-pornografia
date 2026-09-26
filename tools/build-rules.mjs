// Gera rules/*.json (declarativeNetRequest). Rodar: node tools/build-rules.mjs
// Atualizar a lista: curl -sL https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts -o data/porn-hosts.txt
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const hosts = readFileSync(new URL('data/porn-hosts.txt', root), 'utf8');

const all = new Set();
for (const line of hosts.split('\n')) {
  const m = /^0\.0\.0\.0\s+([a-z0-9.-]+\.[a-z0-9-]+)\s*$/i.exec(line.trim());
  if (m && m[1] !== '0.0.0.0') all.add(m[1].toLowerCase().replace(/^www\./, ''));
}
// requestDomains já cobre subdomínios: tira o que tem pai na lista.
const domains = [...all]
  .filter((d) => {
    const p = d.split('.');
    for (let i = 1; i < p.length - 1; i++) if (all.has(p.slice(i).join('.'))) return false;
    return true;
  })
  .sort();

// Domínio com palavra-chave (pega sites fora da lista). Regex do DNR tem limite de memória (~2 KB):
// vários regex pequenos, sensíveis a maiúsculas (o host já chega minúsculo).
const KEYWORDS = [
  'porn', 'xxx', 'hentai', 'xvideo', 'xnxx', 'xhamster', 'redtube', 'youporn', 'brazzers', 'onlyfans', 'fansly',
  'chaturbate', 'stripchat', 'bongacams', 'livejasmin', 'camsoda', 'spankbang', 'eporner', 'rule34', 'nhentai',
  'hanime', 'sexcam', 'camgirl', 'nsfw', 'javhd', 'missav', 'erome', 'fapello', 'coomer',
];
const chunks = [];
for (let i = 0; i < KEYWORDS.length; i += 4) chunks.push(KEYWORDS.slice(i, i + 4).join('|'));

const block = [
  {
    id: 1,
    priority: 1,
    action: { type: 'redirect', redirect: { extensionPath: '/blocked.html' } },
    condition: { requestDomains: domains, resourceTypes: ['main_frame'] },
  },
  {
    id: 2,
    priority: 1,
    action: { type: 'block' },
    condition: { requestDomains: domains, resourceTypes: ['sub_frame', 'image', 'media', 'script', 'xmlhttprequest'] },
  },
  ...chunks.map((k, i) => ({
    id: 3 + i,
    priority: 1,
    action: { type: 'redirect', redirect: { extensionPath: '/blocked.html' } },
    condition: { regexFilter: `^https?://[^/]*(${k})`, isUrlFilterCaseSensitive: true, resourceTypes: ['main_frame'] },
  })),
];

const GOOGLE = [
  'google.com', 'google.com.br', 'google.pt', 'google.es', 'google.com.mx', 'google.com.ar', 'google.cl', 'google.com.co',
  'google.com.pe', 'google.co.jp', 'google.co.kr', 'google.co.uk', 'google.ca', 'google.de', 'google.fr', 'google.it',
];
const searchTypes = ['main_frame'];
const safe = [
  // Já tem o parâmetro → deixa passar (evita loop de redirect).
  { id: 1, priority: 2, action: { type: 'allow' }, condition: { urlFilter: 'safe=active', requestDomains: GOOGLE, resourceTypes: searchTypes } },
  {
    id: 2,
    priority: 1,
    action: { type: 'redirect', redirect: { transform: { queryTransform: { addOrReplaceParams: [{ key: 'safe', value: 'active' }] } } } },
    condition: { regexFilter: '^https://[^/]+/(search|images|webhp)', requestDomains: GOOGLE, resourceTypes: searchTypes },
  },
  { id: 3, priority: 2, action: { type: 'allow' }, condition: { urlFilter: 'adlt=strict', requestDomains: ['bing.com'], resourceTypes: searchTypes } },
  {
    id: 4,
    priority: 1,
    action: { type: 'redirect', redirect: { transform: { queryTransform: { addOrReplaceParams: [{ key: 'adlt', value: 'strict' }] } } } },
    condition: { regexFilter: '^https://[^/]+/(search|images/search|videos/search)', requestDomains: ['bing.com'], resourceTypes: searchTypes },
  },
  { id: 5, priority: 2, action: { type: 'allow' }, condition: { urlFilter: 'kp=1', requestDomains: ['duckduckgo.com'], resourceTypes: searchTypes } },
  {
    id: 6,
    priority: 1,
    action: { type: 'redirect', redirect: { transform: { queryTransform: { addOrReplaceParams: [{ key: 'kp', value: '1' }] } } } },
    condition: { regexFilter: '^https://duckduckgo\\.com/\\?', requestDomains: ['duckduckgo.com'], resourceTypes: searchTypes },
  },
  {
    // Modo Restrito do YouTube (cabeçalho oficial usado por escolas/empresas).
    id: 7,
    priority: 1,
    action: { type: 'modifyHeaders', requestHeaders: [{ header: 'YouTube-Restrict', operation: 'set', value: 'Moderate' }] },
    condition: {
      requestDomains: ['youtube.com', 'youtubei.googleapis.com', 'youtube-nocookie.com'],
      resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'],
    },
  },
];

writeFileSync(new URL('rules/block.json', root), JSON.stringify(block));
writeFileSync(new URL('rules/safesearch.json', root), JSON.stringify(safe, null, 1));
console.log(`${domains.length} domínios (de ${all.size}) → rules/block.json`);
