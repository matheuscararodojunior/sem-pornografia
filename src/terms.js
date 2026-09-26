/* Sem Pornografia — termos (PT / EN / ES / JA / KO + um pouco de ZH) e matcher. */
(() => {
  'use strict';

  // FORTES latinos: 1 ocorrência basta. Sem acento, sem diferenciar maiúsculas, com limite de palavra.
  const STRONG = [
    // --- inglês ---
    'porno', 'pornography', 'pornographic', 'porn video', 'porn videos', 'porn star', 'pornstar', 'pornstars',
    'sex video', 'sex videos', 'sex tape', 'sextape', 'sex scene', 'sex scenes', 'sex chat', 'sexchat', 'live sex',
    'sex cam', 'sex cams', 'free sex', 'hot sex', 'rough sex', 'public sex', 'sex toy', 'sex toys', 'sex doll',
    'sex dolls', 'sexting', 'sext', 'sexts', 'hardcore sex', 'softcore', 'adult video', 'adult videos', 'adult content',
    'adult film', 'adult films', 'adult movie', 'adult movies', 'adult site', 'adult entertainment', 'xxx video',
    'xxx videos', 'xxx movie', 'x-rated', 'x rated', 'rated x', '18+ only', 'nsfw content',
    'fuck video', 'fucking hard', 'fucked hard', 'fuckmachine', 'fuck machine', 'milf', 'milfs', 'gilf', 'dilf',
    'stepmom', 'step mom', 'stepmother fucks', 'stepsister', 'step sister', 'stepsis', 'step sis', 'stepbro',
    'step bro', 'stepdaughter', 'stepson fucks', 'blowjob', 'blowjobs', 'blow job', 'handjob', 'handjobs', 'hand job',
    'footjob', 'rimjob', 'rimming', 'titjob', 'titfuck', 'titty fuck', 'boobjob', 'deepthroat', 'deep throat',
    'throatfuck', 'face fuck', 'facefuck', 'gagging', 'cumshot', 'cumshots', 'cum shot', 'cum', 'cumming', 'cums',
    'cumslut', 'cum slut', 'cum inside', 'creampie', 'creampies', 'cream pie', 'bukkake', 'gangbang', 'gang bang',
    'gangbanged', 'foursome', 'orgy', 'orgies', 'anal sex', 'anal', 'buttfuck', 'double penetration', 'fisting',
    'pussy licking', 'pussy', 'pussies', 'wet pussy', 'tight pussy', 'cock', 'cocks', 'big cock', 'huge cock',
    'dick pic', 'dick pics', 'dickpic', 'cock sucking', 'cocksucker', 'cocksucking', 'clit', 'clitoris', 'labia',
    'tits', 'titties', 'titty', 'big tits', 'huge tits', 'bigtits', 'boobies', 'nip slip', 'nipslip', 'nipple slip',
    'busty', 'pawg', 'bbw', 'big booty', 'phat ass', 'nudes', 'send nudes', 'leaked nudes', 'nude pics', 'nude photos',
    'nude video', 'naked girls', 'naked women', 'naked woman', 'nude girls', 'nude women', 'full nude', 'fully nude',
    'onlyfans leak', 'onlyfans leaks', 'of leaks', 'leaked onlyfans', 'camgirl', 'camgirls', 'cam girl', 'cam girls',
    'camboy', 'cam model', 'cam models', 'webcam girl', 'webcam model', 'cam show', 'private show', 'strip show',
    'striptease', 'strip tease', 'lap dance', 'lapdance', 'hooker', 'hookers', 'call girl', 'call girls',
    'escort service', 'escort services', 'erotic', 'erotica', 'erotic massage', 'happy ending massage', 'lewd',
    'lewds', 'horny', 'hornypost', 'masturbate', 'masturbates', 'masturbating', 'masturbation', 'jerk off',
    'jerking off', 'jerkoff', 'jack off', 'jacking off', 'fap', 'fapping', 'fappening', 'orgasm', 'orgasms',
    'orgasmic', 'squirt', 'squirting', 'dildo', 'dildos', 'sex toy', 'fleshlight', 'buttplug', 'butt plug',
    'strap-on', 'strapon', 'fetish', 'fetishes', 'bdsm', 'bondage', 'dominatrix', 'femdom', 'maledom', 'spanking',
    'feet pics', 'foot fetish', 'footfetish', 'cuckold', 'cuck porn', 'hotwife', 'swinger', 'swingers', 'voyeur',
    'upskirt', 'upskirts', 'downblouse', 'hidden cam', 'spycam', 'spy cam', 'peeping tom', 'exhibitionist',
    'exhibitionism', 'incest', 'taboo porn', 'jailbait', 'lolicon', 'loli', 'lolis', 'shotacon', 'pthc',
    'bestiality', 'zoophilia', 'hentai', 'ecchi', 'ahegao', 'futanari', 'futa', 'paizuri', 'oppai', 'tentacle porn',
    'tentacle hentai', 'netorare', 'doujinshi hentai', 'hentai manga', 'hentai anime', 'rule 34', 'rule34', 'r34',
    'e621', 'gelbooru', 'danbooru', 'sankaku', 'sankakucomplex', 'yiff', 'yiffy', 'hentai haven', 'uncensored jav',
    'jav uncensored', 'jav hd', 'av idol', 'av actress', 'gravure idol nude', 'nsfw art', 'nsfw video', 'nsfw pics',
    'nsfw twitter', 'porn twitter', 'lewd art', 'sugar daddy', 'sugar babies', 'sugarbaby', 'thot', 'thots',
    'slutty', 'slut', 'sluts', 'whore', 'whores', 'booty call', 'booty pics', 'hot milf', 'mature porn', 'teen porn',
    'amateur porn', 'homemade porn', 'porn hub', 'porn site', 'porn sites', 'pornsite', 'porno site', 'sexy nude',
    'nudity', 'full frontal', 'fully naked', 'wardrobe malfunction', 'playboy', 'hustler magazine',
    'brazzers', 'bangbros', 'realitykings', 'reality kings', 'naughty america', 'tushy',
    'fake taxi', 'faketaxi', 'public agent', 'mofos', 'digital playground', 'evil angel', 'kink.com', 'team skeet',
    'teamskeet', 'mylf', 'nubiles', 'deeper.com', 'sexy teen', 'nude teen', 'barely legal', 'deepfake porn',
    'deepnude', 'nudify', 'undress ai', 'ai nudes', 'ai porn', 'ai girlfriend nsfw', 'potentially sensitive content',
    'sensitive content nudity', 'content warning nudity',
    // pornstars / criadores +18 muito buscados
    'mia khalifa', 'riley reid', 'lana rhoades', 'johnny sins', 'sasha grey', 'abella danger', 'angela white',
    'kendra lust', 'lisa ann', 'brandi love', 'eva elfie', 'violet myers', 'sweetie fox', 'mia malkova',
    'adriana chechik', 'dani daniels', 'kimmy granger', 'elsa jean', 'lena paul', 'valentina nappi',
    'rocco siffredi', 'manuel ferrara', 'keiran lee', 'danny d', 'james deen', 'nicole aniston', 'alexis texas',
    'asa akira', 'tori black', 'jenna jameson', 'jynx maze', 'gianna michaels', 'autumn falls', 'emily willis',
    'gabbie carter', 'blake blossom', 'lily phillips', 'bonnie blue', 'sophie rain', 'alina lopez', 'kenzie reeves',
    'little caprice', 'leah gotti', 'aidra fox', 'dillion harper', 'madison ivy', 'lexi belle', 'august ames',
    'nicole doshi', 'skylar vox', 'savannah bond', 'lulu chu', 'vina sky', 'coco lovelock', 'kali roses',
    'piper perri', 'elena koshka', 'lana smalls', 'jia lissa', 'lottie magne', 'sky bri', 'angela alvarez',
    'jordi el nino polla', 'jordi el nino', 'kid bengala', 'elisa sanches', 'mulher melao', 'mulher melancia',
    'belle delphine', 'amouranth onlyfans', 'corinna kopf onlyfans',
    // --- português ---
    'pornografia', 'pornografico', 'pornografica', 'video porno', 'videos porno', 'filme porno', 'filmes porno',
    'site porno', 'sites porno', 'ator porno', 'atriz porno', 'putaria', 'putarias', 'safadeza', 'sacanagem pesada',
    'foder', 'fodendo', 'fodeu gostoso', 'fodida', 'fodido', 'meteu gostoso', 'transando', 'transar gostoso',
    'transa gostosa', 'sexo explicito', 'sexo anal', 'sexo oral', 'sexo a tres', 'sexo grupal', 'video de sexo',
    'videos de sexo', 'cena de sexo', 'buceta', 'bucetas', 'bucetinha', 'boceta', 'xota', 'xotas', 'xoxota',
    'xoxotas', 'xereca', 'xerequinha', 'piroca', 'pirocudo', 'pauzudo', 'pauzao', 'rola grande', 'punheta', 'punhetas',
    'punheteiro', 'bater punheta', 'siririca', 'gozando', 'gozada', 'gozou dentro', 'gozar dentro',     'boquete', 'boquetes', 'mamada', 'mamando rola', 'chupando rola', 'chupando pau', 'cuzinho', 'cuzao arrombado',
    'arrombada', 'arrombado', 'peituda', 'peitudas', 'peitao', 'peitoes', 'rabuda', 'rabudas', 'bundao gostoso',
    'bunduda', 'popozuda', 'gostosona', 'gostosas peladas', 'mulher pelada', 'mulheres peladas', 'mulher nua',
    'mulheres nuas', 'fotos nuas', 'foto nua', 'nudes vazados', 'nudes vazadas', 'vazou nudes', 'vazaram nudes',
    'ninfeta', 'ninfetas', 'ninfetinha', 'putinha', 'putinhas', 'vagabunda gostosa', 'garota de programa',
    'garotas de programa', 'acompanhante de luxo', 'casa de swing', 'casa de prostituicao',
    'puteiro', 'suruba', 'surubas', 'orgia', 'orgias', 'menage', 'corno manso', 'corninho',
    'esposa liberal', 'hotwife', 'sentando gostoso', 'sentadinha', 'sentando no pau', 'de quatro gostoso',
    'gemidos de prazer', 'conteudo adulto', 'conteudo +18', 'conteudo 18+', 'mais de 18', 'somente maiores',
    'apenas maiores de 18', 'sexshop', 'sex shop', 'vibrador', 'vibradores', 'dildo', 'consolo de borracha',
    'strip tease', 'camera escondida', 'flagra sexo', 'flagrou transando', 'video intimo', 'videos intimos',
    'vazou video intimo', 'privacy vazado', 'privacy vazados', 'onlyfans vazado', 'onlyfans vazados', 'pack do pezinho',
    'pack de nudes', 'vendo pack', 'venda de pack', 'packs vazados', 'novinha pelada', 'novinha safada', 'novinhas safadas',
    'safada gostosa', 'safadinha', 'safadinhas', 'tesao', 'tesuda', 'tesudo', 'excitada', 'brotheragem',
    'exibicionista', 'incesto', 'zoofilia', 'hentais', 'manhwa hentai', 'manhwa +18', 'manhwa 18', 'anime hentai',
    'desenho porno', 'quadrinhos eroticos', 'quadrinho erotico', 'hq erotica', 'conto erotico', 'contos eroticos',
    'massagem erotica', 'massagem tantrica', 'sexo virtual', 'webcam sexo', 'camgirl brasileira', 'modelo webcam',
    'funk putaria', 'proibidao putaria',
    // --- espanhol ---
    'pornografia', 'pornografico', 'video porno', 'videos porno', 'pelicula porno', 'peliculas porno', 'porno gratis',
    'actriz porno', 'actor porno', 'follar', 'follando', 'follada', 'folladas', 'follame', 'culear', 'culeando',
    'culiando', 'cogiendo rico', 'cogida', 'cogidas', 'verga', 'vergas', 'vergota', 'pinga grande', 'pija grande',
    'polla grande', 'pollon', 'cono mojado', 'chocha', 'panocha', 'concha mojada', 'mamada', 'mamadas',
    'chupando verga', 'chupapollas', 'mamando verga', 'corrida en la cara', 'corridas', 'correrse dentro',
    'se corre', 'lefa', 'tetona', 'tetonas', 'tetas grandes', 'tetas', 'culona', 'culonas', 'nalgona',
    'nalgonas', 'chichona', 'desnuda', 'desnudas', 'encuerada', 'encueradas', 'mujeres desnudas', 'chicas desnudas',
    'fotos desnudas', 'fotos intimas', 'video intimo', 'videos intimos', 'packs filtrados', 'pack filtrado',
    'nudes filtrados', 'onlyfans filtrado', 'onlyfans filtrados', 'vendo pack', 'cachonda', 'cachondas', 'calenturienta',
    'caliente desnuda', 'putita', 'putitas', 'zorrita', 'perrita', 'puta madre follando',     'prostibulo', 'burdel', 'scort', 'damas de compania', 'chica webcam', 'modelo webcam', 'sexo en vivo',
    'sexo gratis', 'sexo anal', 'sexo oral', 'sexo duro', 'sexo casero', 'sexo explicito', 'video de sexo',
    'videos de sexo', 'escena de sexo', 'pajear', 'pajeandose', 'pajillero', 'hacerse una paja', 'masturbacion',
    'masturbarse', 'masturbandose', 'orgia', 'orgias', 'trio sexual', 'lesbianas follando', 'squirt',     'juguetes sexuales', 'cornudo', 'cornudos', 'esposa infiel follando', 'incesto', 'zoofilia', 'manga hentai',
    'hentai en espanol', 'hentai sub espanol', 'anime porno', 'comic porno', 'comics porno', 'relatos eroticos',
    'masaje erotico', 'masajes eroticos', 'contenido adulto', 'contenido +18', 'solo mayores de edad', 'solo adultos',
    'contenido potencialmente sensible',
  ];

  // FORTES como pedaço de palavra (pega domínios, hashtags e palavras compostas).
  const STRONG_SUBSTRINGS = [
    'porn', 'xxx', 'hentai', 'xvideo', 'xnxx', 'xhamster', 'redtube', 'youporn', 'pornhub', 'brazzers',
    'onlyfans', 'fansly', 'chaturbate', 'stripchat', 'bongacams', 'livejasmin', 'camsoda', 'myfreecams',
    'spankbang', 'eporner', 'tnaflix', 'txxx', 'hclips', 'beeg.com', 'tube8', 'motherless', 'nhentai', 'hanime',
    'exhentai', 'e-hentai', 'hitomi.la', 'imhentai', 'hentai2read', 'multporn', '8muses', 'luscious.net',
    'manhwa18', 'rule34', 'gelbooru', 'sankakucomplex', 'javhd', 'javlibrary', 'missav', 'jable.tv', 'supjav',
    'javmost', 'nsfw', 'onlyfan', 'fapello', 'thothub', 'coomer', 'kemono.su', 'erome', 'camwhore', 'sexcam',
    'webcamsex', 'livesex', 'sexting', 'nudes4', 'deepnude', 'nudify', 'putaria', 'bucetinha', 'novinhasafada',
    'cornomanso', 'xvideos', 'xnxx', 'pornô', 'milfs', 'milfy', 'bangbros', 'realitykings', 'naughtyamerica',
    'fakehub', 'faketaxi', 'mofos', 'teamskeet', 'nubiles', 'blowjob', 'handjob', 'creampie', 'cumshot', 'gangbang',
    'bukkake', 'deepthroat', 'titfuck', 'ahegao', 'futanari', 'lolicon', 'shotacon', 'jailbait', 'fleshlight',
    'follando', 'xvideosbrasil', 'sexolandia',     // --- japonês ---
    'ポルノ', 'エロ', '無修正', 'むしゅうせい', 'アダルト', 'AV女優', 'ＡＶ女優', 'AV男優', '中出し', 'なかだし',
    '巨乳', '爆乳', '痴漢', '痴女', '寝取られ', '寝取り', '輪姦', '強姦', 'レイプ', '援交', '援助交際', 'セックス',
    'せっくす', 'フェラ', 'ふぇら', '手コキ', 'パイズリ', 'ぱいずり', '潮吹き', '乱交', 'オナニー', 'おなにー', '自慰',
    '陰毛', 'ちんこ', 'チンコ', 'ちんぽ', 'チンポ', 'まんこ', 'マンコ', 'おまんこ', '性交', '性行為', '成人向け',
    '18禁', '１８禁', 'アヘ顔', '淫乱', '淫語', '媚薬', '緊縛', '盗撮', 'ソープランド', 'デリヘル',
    'エロ動画', 'エロ漫画', 'エロアニメ', 'エロ同人', '全裸', 'ヌード', 'ハメ撮り', '素人ナンパ', '熟女', '人妻 エロ',
    'ロリコン', 'ショタコン', 'ふたなり', 'フタナリ', 'えっち動画', 'エッチ動画', 'エッチな', 'スケベ', 'すけべ',
    'ヘンタイ', '露出狂', '乳首', 'おっぱい', 'ちくび', 'ぶっかけ', 'ザーメン', '精液', '射精', '顔射',
    '孕ませ', '種付け', '犯され', '凌辱', '陵辱', '肉便器', 'エロ垢', 'パパ活', '売春', '買春',
    'グラドル 乳首', '無碼', '無码',
    // --- coreano ---
    '야동', '포르노', '섹스', '성인물', '성인영상', '성인 영상', '성인사이트', '성인 사이트', '성인방송', '야한', '음란',
    '딸딸이', '유두', '야짤', '몰카', '도촬', '원조교제', '조건만남', '풀싸롱',
    '룸살롱', '안마방', '키스방', '오피녀', '벗방', '19금', '에로', '헨타이', '야애니', '야겜', '야설', '누드',
    '알몸', '성관계', '성행위', '강간', '윤간', '질내사정', '펠라', '애널', '창녀', '매춘', '성매매',     '국산야동', '일본야동', '서양야동', '망가 19', '19 망가', '성인웹툰', '성인 웹툰', '레즈 야동', '야한 동영상',
    '야한동영상', '노출 사진', '노출사진', '육덕', '빨통', '찌찌', '섹시 노출', '떡방',     '사까시', '오랄', '딥페이크 성', '딥페이크성',
    // --- chinês (sites de hentai/JAV costumam usar) ---
    '色情', '成人影片', '做爱', '做愛', '黄片', '黃片', '无码', '裸体', '裸體', '自慰', '口交', '肛交', '乱伦', '亂倫',
    '巨乳', '强奸', '強姦', '约炮', '約炮', '援交', '福利姬', '成人视频', '成人視頻', '里番', '裏番', '工口',
  ];

  // Siglas sensíveis a maiúsculas.
  const ACRONYMS = ['JAV', 'NTR', 'R18', 'R-18', 'R18\\+', 'PTHC', 'NSFW', 'OnlyFans', 'OF\\s+leaks?', 'XXX', 'AV\\s+idol'];

  // FRACOS: sozinhos não bloqueiam; 2+ diferentes no mesmo item bloqueiam (ou 1 fraco + contexto).
  const WEAK = [
    // en
    'sex', 'sexy', 'sexual', 'seductive', 'sensual', 'hot girl', 'hot girls', 'hottie', 'lingerie', 'bikini', 'thong',
    'panties', 'nude', 'naked', 'topless', 'boobs', 'booty', 'twerk', 'twerking', 'nipple', 'nipples', 'cleavage',
    'stripper', 'strippers', 'strip club', 'escort', 'prostitute', 'prostitution', 'brothel', 'hookup',
    'one night stand', 'threesome', 'kinky', 'naughty', 'uncensored', 'penis', 'vagina', 'dick', 'moaning',
    'see-through', 'yaoi', 'yuri', 'doujin', 'waifu', 'gravure', 'leaked', 'sugar baby', 'spicy content', '18+', '+18',
    // pt
    'sexo', 'gostosa', 'gostosas', 'gostoso', 'bunda', 'bundinha', 'peitos', 'peitinhos', 'seios', 'mamilo', 'mamilos',
    'calcinha', 'sutia', 'biquini', 'fio dental', 'pelada', 'peladas', 'nua', 'nuas', 'safada', 'safadas', 'safado',
    'novinha', 'novinhas', 'puta', 'putas', 'vadia', 'prostituta', 'prostitutas', 'acompanhante', 'swing', 'corno',
    'cornos', 'tesao', 'excitada', 'provocante', 'rebolando', 'gemendo', 'gemidos', 'vazado', 'vazados', 'privacy',
    'pack', 'bem dotado', 'transar', 'transou', 'sacanagem', 'popozao', 'raba', 'rabao', 'sentando',
    // es
    'caliente', 'culo', 'nalgas', 'pechos', 'chichis', 'pezones', 'bragas', 'tanga', 'lenceria', 'desnudo', 'zorra',
    'mamacita', 'buenota', 'cogiendo', 'coger', 'polla', 'pija', 'venirse', 'filtrado', 'filtrada', 'filtrados',
    'cachondo', 'lesbianas',
    // ja / ko (ambíguos)
    'エッチ', 'えっち', 'セクシー', 'グラビア', '下着', '水着', '裸', 'おしり', '人妻', '素人', '同人誌', '変態', '風俗',
    '調教', '触手', '裏垢', 'ハレンチ', '섹시', '노출', '성인', '엉덩이', '속옷', '비키니', '몸매', '야해', '벗은', '오피',
    '딥페이크',
  ];

  // Trechos que nunca contam (falsos positivos conhecidos).
  const ALLOW = [
    'cum laude', 'summa cum laude', 'magna cum laude', 'blue tits', 'great tits', 'blue tit', 'coal tit',
    'cock-a-doodle', 'cocktail', 'cocktails', 'cockpit', 'peacock', 'shuttlecock', 'woodcock', 'hancock',
    'sex education', 'educacao sexual', 'educacion sexual', 'sexo masculino', 'sexo feminino', 'sexo biologico',
    'escort mission', 'ford escort', 'bra size', 'hot dog', 'hot dogs', 'hot wheels', 'hot sauce', 'dirty dancing',
    'pelada de futebol', 'jogar pelada', 'pau brasil', 'pau-brasil',     'pinto da costa', 'porra de maconha', 'caralho de asas', 'arrombada de agua', 'essex', 'sussex', 'middlesex',
    'rabo de cavalo', 'rabo de peixe', 'rabo de galo', 'fio dental escova', 'model 3', 'model y', 'model s',
    'hot topic', 'teen titans', 'teen wolf', 'dick vigarista', 'moby dick', 'philip k. dick', 'cocker spaniel',
    'porn-free', 'squirt gun', 'mamada do bebe', 'la maja desnuda',
  ];

  const DEFAULT_SETTINGS = {
    enabled: true,
    safeSearch: true, // SafeSearch forçado (Google, Bing, DuckDuckGo) + Modo Restrito do YouTube
    blockDomains: true, // bloqueia ~77 mil sites pornôs conhecidos
    blockPages: true, // bloqueia qualquer página cujo conteúdo seja pornográfico
    extraTerms: [],
    allowTerms: [],
    allowSites: [],
  };

  const strip = (s) => s.normalize('NFD').replace(/\p{M}+/gu, '').normalize('NFC');
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const phrase = (t) => esc(strip(t).toLowerCase().trim()).replace(/\s+/g, '\\s+');
  const clean = (list) => [...new Set(list.map((t) => t.trim()).filter(Boolean))];
  const B = '(?<![\\p{L}\\p{N}])';
  const E = '(?![\\p{L}\\p{N}])';
  const CJK = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\uff00-\uffef]/;
  const bounded = (list) => (list.length ? new RegExp(`${B}(?:${list.join('|')})${E}`, 'gu') : null);
  const loose = (list) => (list.length ? new RegExp(list.join('|'), 'gu') : null);

  // Coreano/japonês não têm espaço entre palavras: termos CJK casam como pedaço de palavra.
  function split(list) {
    const latin = [];
    const cjk = [];
    for (const t of clean(list)) (CJK.test(t) ? cjk : latin).push(phrase(t));
    return { latin, cjk };
  }

  function buildMatcher(s) {
    const strong = split([...STRONG, ...(s.extraTerms || [])]);
    const subs = split(STRONG_SUBSTRINGS);
    const weak = split(WEAK);
    const allow = clean([...ALLOW, ...(s.allowTerms || [])]).map(phrase);
    const res = {
      strong: [bounded(strong.latin), loose([...strong.cjk, ...subs.latin, ...subs.cjk])],
      acr: [new RegExp(`${B}(?:${ACRONYMS.join('|')})${E}`, 'gu')],
      weak: [bounded(weak.latin), loose(weak.cjk)],
    };
    const allowRe = allow.length ? new RegExp(`${B}(?:${allow.join('|')})${E}`, 'giu') : null;

    const collect = (regs, text, into) => {
      for (const r of regs) if (r) for (const m of text.matchAll(r)) into.add(m[0].toLowerCase());
    };

    // → { strong: Set, weak: Set }
    return function scan(text) {
      const strongHits = new Set();
      const weakHits = new Set();
      if (text) {
        let t = strip(text);
        if (allowRe) t = t.replace(allowRe, ' ');
        collect(res.acr, t, strongHits);
        t = t.toLowerCase();
        collect(res.strong, t, strongHits);
        collect(res.weak, t, weakHits);
      }
      return { strong: strongHits, weak: weakHits };
    };
  }

  // Item (card/post/vídeo): 1 forte, ou 2 fracos diferentes.
  const itemHit = (r) => (r.strong.size ? [...r.strong][0] : r.weak.size >= 2 ? [...r.weak].slice(0, 2).join(' + ') : null);

  globalThis.SemPorno = {
    DEFAULT_SETTINGS,
    DEFAULT_TERMS: { STRONG, STRONG_SUBSTRINGS, ACRONYMS, WEAK, ALLOW },
    buildMatcher,
    itemHit,
  };
})();
