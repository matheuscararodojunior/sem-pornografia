# 🚫 Sem Pornografia

Extensão de navegador que bloqueia pornografia e hentai em qualquer site, com termos em **português, inglês, espanhol, japonês e coreano**. Funciona no Chrome, Chromium, Brave, Edge e Firefox.

Três camadas de proteção:

1. **~48 mil sites pornôs conhecidos** bloqueados na raiz (regras de rede).
2. **SafeSearch forçado** no Google, Bing e DuckDuckGo + **Modo Restrito** no YouTube.
3. **Filtro de conteúdo** que lê o texto e esconde vídeos/posts/resultados adultos, ou bloqueia a página inteira se o conteúdo for pornográfico.

## ✨ O que ela faz

| Onde | O que bloqueia |
|---|---|
| **Qualquer site** | Se a página em si for pornográfica (título, descrição e texto do corpo), redireciona pra uma tela de bloqueio. |
| **YouTube** | Vídeos, Shorts e canais adultos somem. Vídeo aberto fica coberto e pausado. |
| **Google / Bing / DuckDuckGo** | Resultados, imagens, vídeos e "as pessoas também perguntam" adultos somem. SafeSearch fica sempre ligado. |
| **Instagram** | Posts, miniaturas e Reels adultos somem (lê a legenda inteira, inclusive atrás do "... mais"). |
| **Reddit** | Posts marcados como NSFW somem (além do filtro de texto). |
| **X / Twitter** | Tweets e perfis com conteúdo sensível somem. |
| **TikTok** | Vídeos adultos ficam cobertos e pausados. |

## 🌍 Idiomas

A lista de termos (~1.000) cobre:

- **Português**: putaria, novinha safada, vazou vídeo íntimo, buceta…
- **Inglês**: porn, mia khalifa, onlyfans leaks, creampie…
- **Espanhol**: follando, tetonas, porno gratis, pack filtrado…
- **Japonês**: ポルノ, エロ, 無修正, 巨乳, エロ漫画…
- **Coreano**: 야동, 국산야동, 19금, 벗방…

Com proteção contra falsos positivos: *"cum laude"*, *"blue tits"* (pássaros), *"cocktail"*, *"pelada de futebol"*, *"São Paulo"*, *"sex education"*, *"보지 마세요"* ("não olhe") e *"자위대"* (Forças de Autodefesa do Japão).

## 🛠 Instalar

### Chrome / Chromium / Brave / Edge
1. Abre `chrome://extensions`.
2. Liga o **Modo do desenvolvedor**.
3. Clica em **Carregar sem compactação** e escolhe esta pasta.

### Firefox
1. Abre `about:debugging#/runtime/this-firefox`.
2. Clica em **Carregar extensão temporária** e escolhe o `manifest.json`.

> No Firefox a extensão some quando o navegador fecha. Pra ficar permanente, precisa assinar no [Firefox Add-ons](https://addons.mozilla.org).

## ⚙️ Opções (ícone da extensão)

- Liga/desliga cada proteção (lista de sites, SafeSearch, filtro de conteúdo).
- Termos extras e exceções (um por linha).
- **Sites liberados** (lista branca): domínios que nunca são bloqueados.
- Contador de itens bloqueados na aba atual.

## 🧱 Como funciona por dentro

```
src/terms.js          lista de termos + matcher (PT/EN/ES/JA/KO)
src/content.js        acha e esconde cards, ou bloqueia a página inteira
src/content.css       estilos de esconder/cobrir
rules/block.json      regras de rede: ~48 mil domínios + regex de domínio
rules/safesearch.json SafeSearch (Google/Bing/DDG) + Modo Restrito (YouTube)
tools/build-rules.mjs regenera rules/block.json a partir de data/porn-hosts.txt
blocked.{html,js}     tela de bloqueio
options.{html,js,css} popup/opções
```

- O bloqueio de domínios usa `declarativeNetRequest` (regras estáticas): ~48 mil domínios num `requestDomains` só, mais regex curtos pra pegar sites fora da lista.
- O SafeSearch força `safe=active` (Google), `adlt=strict` (Bing) e `kp=1` (DuckDuckGo), e o header `YouTube-Restrict` no YouTube.
- O filtro de conteúdo usa `MutationObserver`: qualquer card que ganhe texto adulto é escondido, mesmo em páginas que carregam tudo dinamicamente.

## 👷 Contribuindo

- **Falso positivo?** Adicione em `ALLOW` ou remova o termo de `STRONG`/`STRONG_SUBSTRINGS`/`WEAK` em `src/terms.js`.
- **Termo faltando (qualquer idioma)?** Adicione em `src/terms.js`. Termos em japonês/coreano/chinês casam como pedaço de palavra (não têm espaço entre palavras).
- **Site fora da lista de domínios?** Ele deve ser pego pelo regex de palavra-chave; senão, adicione o domínio em `data/porn-hosts.txt` e rode `node tools/build-rules.mjs`.
- **Site mudou o HTML?** Ajuste `RULES` em `src/content.js`.

## Atualizar a lista de domínios

```bash
curl -sL https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts -o data/porn-hosts.txt
node tools/build-rules.mjs
```

## 📄 Licença

[MIT](LICENSE) — o código. A lista de domínios vem do projeto [StevenBlack/hosts](https://github.com/StevenBlack/hosts) (licença própria do projeto).
