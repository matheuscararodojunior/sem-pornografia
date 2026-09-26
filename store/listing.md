# Sem Pornografia — texto da loja (Chrome Web Store / Firefox AMO)

Copie e cole nos campos da loja. Ajuste o que quiser.

## Nome
Sem Pornografia

## Descrição curta (máx. 132 caracteres)
Bloqueia pornografia e hentai: ~48 mil sites, SafeSearch forçado e filtro em 5 idiomas.

## Descrição detalhada

O **Sem Pornografia** bloqueia conteúdo adulto em qualquer site, com três camadas de proteção:

1. **Lista de sites** — mais de 48 mil sites pornôs conhecidos são bloqueados na raiz (antes mesmo de carregar). Sites fora da lista, mas com nome suspeito, também são pegos por regras de palavra-chave.
2. **SafeSearch forçado** — mantém a busca segura sempre ligada no Google, Bing e DuckDuckGo, e ativa o Modo Restrito no YouTube.
3. **Filtro de conteúdo** — lê o texto da página e esconde vídeos, posts e resultados adultos. Se a própria página for pornográfica, ela é bloqueada e substituída por uma tela de aviso.

**Onde funciona:**
- **Qualquer site** — página pornográfica é bloqueada.
- **YouTube** — vídeos, Shorts e canais adultos somem; vídeo aberto fica coberto e pausado.
- **Google / Bing / DuckDuckGo** — resultados, imagens e vídeos adultos somem.
- **Instagram** — posts, miniaturas e Reels adultos somem (lê a legenda inteira).
- **Reddit** — posts NSFW somem.
- **X / Twitter** — conteúdo sensível some.
- **TikTok** — vídeos adultos ficam cobertos e pausados.

**Idiomas:** a lista de mais de 1.000 termos cobre português, inglês, espanhol, japonês e coreano — com proteção contra falsos positivos (ex.: "cum laude", "blue tits", "cocktail", "pelada de futebol", "sex education").

**No popup você controla tudo:**
- Liga e desliga cada camada (lista de sites, SafeSearch, filtro de conteúdo).
- Termos extras e exceções.
- Lista branca de sites liberados.
- Contador de itens bloqueados na aba atual.

**Privacidade:** tudo roda localmente no seu navegador. O texto das páginas é analisado no seu computador e **nunca** é enviado para lugar nenhum. Nenhum dado é coletado, transmitido ou vendido.

## Categoria
Produtividade (ou "Família e Segurança")

## Permissões usadas (justificativa para a revisão)
- **declarativeNetRequest** — aplicar as regras de bloqueio (lista de ~48 mil domínios, SafeSearch e Modo Restrito). As regras são estáticas e ficam embutidas na extensão; não há servidor remoto.
- **Acesso a todos os sites (`<all_urls>`)** — necessário para (1) bloquear qualquer site pornográfico conhecido, (2) forçar SafeSearch em todos os domínios do Google (google.com, google.com.br, google.co.jp…), e (3) detectar e bloquear páginas pornográficas em sites desconhecidos.
- **storage** — guardar suas configurações.

**Não** há coleta de dados, análise remota, rede de terceiros nem "remote code". O código é 100% aberto: https://github.com/matheuscararodojunior/sem-pornografia

## Idioma
Português (Brasil) — o filtro entende também inglês, espanhol, japonês e coreano.

## Tópicos sugeridos
pornografia, hentai, controle parental, família, safe search, bloqueio, foco, produtividade

## Nota sobre a lista de domínios
A lista de sites bloqueados vem do projeto [StevenBlack/hosts](https://github.com/StevenBlack/hosts), com licença própria do projeto (MIT). O restante do código é MIT.
