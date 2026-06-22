
// ================================= \\
// ESSE bot está sendo continuado pelo Matheus & Daniel! Ainda está em fases de testes para a fase da V2 e depois ser disponibilizada, não VAZE por enquanto!
// ================================= \\

// Consts 
const validarKey = require('./keycheck');
(async () => {
    await validarKey(); // se travar aqui, nem roda o bot
   
})()


function lerKeys() {
    if (!fs.existsSync(KEY_PATH)) fs.writeFileSync(KEY_PATH, '[]')
    return JSON.parse(fs.readFileSync(KEY_PATH))
}
function salvarKeys(data) {
    fs.writeFileSync(KEY_PATH, JSON.stringify(data, null, 2))
}
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, jidDecode, generateWAMessageFromContent, proto, prepareWAMessageMedia, downloadMediaMessage } = require('baileys-pro');
const moment = require('moment-timezone');
const baileysVer = require("baileys-pro/package.json").version;
const nickTemp = {};
const fetchJson = require('./assets/functions/fetchJson.js');
const UPDATE_URL =
"https://raw.githubusercontent.com/matheus09dasilvahenrique-wq/Toshiruz-Bot/main/version.json";
const REPO_RAW =
"https://github.com/matheus09dasilvahenrique-wq/Toshiruz-Bot/archive/refs/heads/main.zip";
const fs = require('fs');

// ==========================
// OTIMIZACAO DE PERFORMANCE
// ==========================
// Cache leve para reduzir leituras repetidas de JSON e consultas caras de metadata.
const __jsonCache = new Map();
const __groupMetadataCache = new Map();

function readJsonFast(filePath, fallback = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            writeJsonFast(filePath, fallback);
            return fallback;
        }

        const stat = fs.statSync(filePath);
        const cached = __jsonCache.get(filePath);

        if (cached && cached.mtimeMs === stat.mtimeMs) {
            return cached.data;
        }

        const raw = fs.readFileSync(filePath, 'utf8');
        const data = raw.trim() ? JSON.parse(raw) : fallback;

        __jsonCache.set(filePath, {
            mtimeMs: stat.mtimeMs,
            data
        });

        return data;
    } catch (e) {
        console.log(`Erro ao ler JSON ${filePath}:`, e.message);
        return fallback;
    }
}

function writeJsonFast(filePath, data, pretty = true) {
    try {
        const dir = require('path').dirname(filePath);
        if (dir && dir !== '.' && !fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(
            filePath,
            JSON.stringify(data, null, pretty ? 2 : 0)
        );

        const stat = fs.statSync(filePath);
        __jsonCache.set(filePath, {
            mtimeMs: stat.mtimeMs,
            data
        });
    } catch (e) {
        console.log(`Erro ao salvar JSON ${filePath}:`, e.message);
    }
}

async function getGroupMetadataFast(sock, groupId, ttlMs = 60000) {
    if (!groupId || !groupId.endsWith('@g.us')) return {};

    const cached = __groupMetadataCache.get(groupId);
    const now = Date.now();

    if (cached && now - cached.time < ttlMs) {
        return cached.data;
    }

    const data = await sock.groupMetadata(groupId);
    __groupMetadataCache.set(groupId, {
        time: now,
        data
    });

    return data;
}

function clearGroupMetadataFast(groupId) {
    if (groupId) __groupMetadataCache.delete(groupId);
}

function isUserVipFast(vipData, sender) {
    if (!sender || !vipData) return false;

    if (Array.isArray(vipData)) {
        return vipData.some(v => String(v).includes(sender) || sender.includes(String(v)));
    }

    if (typeof vipData === 'object') {
        return Boolean(vipData[sender] || vipData[sender?.split('@')[0]]);
    }

    return sender.includes(String(vipData));
}

const FormData = require('form-data');
const AdmZip = require("adm-zip");
const { chavepix, versao } = require('./dono/configs.json');
const { exec } = require('child_process');
const { gerarAttp } = require('./assets/functions/attp.js');
const advPath = './assets/advertencias.json';
const { apitoken: TOKEN } = require('./dono/configs.json'); 
const TOKEN_API = 'TOKEN-API-MATH'
const API_TOSHI = 'https://bubbly-dedication-production-5925.up.railway.app'
global.batalhas = global.batalhas || {};
const path = require('path');
const os = require('os');
const yts = require('yt-search');
const play = require('play-dl');
const petsPath = path.join(__dirname, './assets/pet.json');
const userPetsPath = path.join(__dirname, './assets/userpets.json');
const goldsPath = path.join(__dirname, './assets/golds.json');
const cacaPalavras = {};
const jogoPalavras = {};
const pasta = './assets/horarios';
const enviar = {
msg: {
adm: '❗ Você precisa ser admin do grupo para usar este comando',
dono: '❗ Apenas meu dono pode usar este comando!',
group: '❗ Este comando só pode ser usado em grupos!',
vip: '❗ Comando é apenas para os VIPs...',
botadm: '❗ Eu preciso ser admin do grupo',
    bn: '❗ Modo brincadeira desativado, use modobn'
}
};
//Funcoes daqui pra baixo
function carregarModos() {
    return readJsonFast('./assets/modos.json', {});
}

function isBotBn(grupo) {

    const modos =
        carregarModos();

    return modos[grupo]?.brincadeira === true;
}
const horariosPath = './assets/horarios_gp.json';

if (!fs.existsSync(pasta)) {
    fs.mkdirSync(pasta, { recursive: true });
}

setInterval(async () => {

    try {

        if (!fs.existsSync(horariosPath))
            return;

        const horarios = JSON.parse(
            fs.readFileSync(horariosPath, 'utf8')
        );

        const horaAtual = moment()
            .tz("America/Sao_Paulo")
            .format("HH:mm");

        for (const grupo in horarios) {

            const config = horarios[grupo];

            // FECHAR
            if (config.fechar === horaAtual) {

                console.log(`🔒 Fechando grupo ${grupo}`);

                await sock.groupSettingUpdate(
                    grupo,
                    "announcement"
                );

                if (
                    config.imagemFechar &&
                    fs.existsSync(config.imagemFechar)
                ) {

                    await sock.sendMessage(grupo, {
                        image: fs.readFileSync(
                            config.imagemFechar
                        ),
                        caption:
                            config.mensagemFechar ||
                            "🔒 𝙶𝚛𝚞𝚙𝚘 𝚏𝚎𝚌𝚑𝚊𝚍𝚘 𝚊𝚞𝚝𝚘𝚖𝚊𝚝𝚒𝚌𝚊𝚖𝚎𝚗𝚝𝚎."
                    });

                } else {

                    await sock.sendMessage(grupo, {
                        text:
                            config.mensagemFechar ||
                            "🔒 𝙶𝚛𝚞𝚙𝚘 𝚏𝚎𝚌𝚑𝚊𝚍𝚘 𝚊𝚞𝚝𝚘𝚖𝚊𝚝𝚒𝚌𝚊𝚖𝚎𝚗𝚝𝚎."
                    });

                }

            }

            // ABRIR
            if (config.abrir === horaAtual) {

                console.log(`🔓 Abrindo grupo ${grupo}`);

                await sock.groupSettingUpdate(
                    grupo,
                    "not_announcement"
                );

                if (
                    config.imagemAbrir &&
                    fs.existsSync(config.imagemAbrir)
                ) {

                    await sock.sendMessage(grupo, {
                        image: fs.readFileSync(
                            config.imagemAbrir
                        ),
                        caption:
                            config.mensagemAbrir ||
                            "🔓 𝙶𝚛𝚞𝚙𝚘 𝚊𝚋𝚎𝚛𝚝𝚘 𝚊𝚞𝚝𝚘𝚖𝚊𝚝𝚒𝚌𝚊𝚖𝚎𝚗𝚝𝚎."
                    });

                } else {

                    await sock.sendMessage(grupo, {
                        text:
                            config.mensagemAbrir ||
                            "🔓 𝙶𝚛𝚞𝚙𝚘 𝚊𝚋𝚎𝚛𝚝𝚘 𝚊𝚞𝚝𝚘𝚖𝚊𝚝𝚒𝚌𝚊𝚖𝚎𝚗𝚝𝚎."
                    });

                }

            }

        }

    } catch (e) {

        console.log(
            "❌ 𝙴𝚛𝚛𝚘 𝚗𝚘 𝚜𝚒𝚜𝚝𝚎𝚖𝚊 𝚍𝚎 𝚑𝚘𝚛á𝚛𝚒𝚘𝚜:",
            e
        );

    }

}, 30000); // verifica a cada 30 segundos
function carregarPets() {
    return readJsonFast(userPetsPath, {});
}

function salvarPets(data) {
    writeJsonFast(userPetsPath, data);
}

function carregarGold() {
    return readJsonFast(goldsPath, {});
}

function salvarGold(data) {
    writeJsonFast(goldsPath, data);
}
function getDB() {
    return readJsonFast('./assets/userpets.json', {});
}
let pets = JSON.parse(fs.readFileSync(petsPath));

let userPets = fs.existsSync(userPetsPath)
    ? JSON.parse(fs.readFileSync(userPetsPath))
    : {};
function getPetsDB() {
    return readJsonFast('./assets/userpets.json', {});
}
async function getBuffer(url) {
    const response = await axios({
        method: 'get',
        url,
        responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
}
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

async function salvarImagem(message, caminho) {
    const stream = await downloadContentFromMessage(
        message,
        'image'
    )

    let buffer = Buffer.from([])

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    fs.writeFileSync(caminho, buffer)

    return caminho
}
let sock;
function carregarGold() {
    return readJsonFast('./assets/golds.json', {});
}

function salvarGold(db) {
    writeJsonFast('./assets/golds.json', db);
}

function addGold(user, quantidade) {
    let db = carregarGold();

    if (!db[user]) {
        db[user] = {
            gold: 0
        };
    }

    db[user].gold += quantidade;

    salvarGold(db);
}

function getGold(user) {
    let db = carregarGold();

    if (!db[user]) {
        db[user] = {
            gold: 0
        };
        salvarGold(db);
    }

    return db[user].gold;
}
const palavras = [
"cachorro","gato","cavalo","elefante","girafa",
"leão","tigre","urso","macaco","coelho",
"banana","maçã","laranja","abacaxi","uva",
"carro","moto","avião","ônibus","bicicleta",
"computador","teclado","mouse","celular","internet",
"futebol","basquete","vôlei","natação","corrida",
"escola","professor","aluno","caderno","caneta",
"sol","lua","estrela","planeta","galáxia",
"praia","montanha","rio","floresta","deserto",
"pizza","hambúrguer","lasanha","sorvete","chocolate"
];
const palavrasCaca = [
"abacate","abelha","abismo","academia","acordeao","adesivo","advogado","aeroporto","agenda","agulha",
"alface","algodao","alicate","almofada","amarelo","amendoim","amizade","anel","animal","antena",
"apartamento","apito","aranha","arco","areia","armario","arvore","asa","atleta","aviador",
"bacalhau","bala","banana","bandeira","barco","batata","bebida","beijaflor","bicicleta","biblioteca",
"blusa","borboleta","bosque","brasil","brinquedo","cabelo","cabide","cachorro","cadeira","caderno",
"cafeteira","caixa","calendario","camelo","caminhao","camisa","caneta","canhao","capivara","caracol",
"carro","cartao","castelo","cavalo","cebola","celular","cenoura","chave","chinelo","chocolate",
"chuva","cidade","cimento","cinema","circo","computador","coracao","corrida","cortina","cozinha",
"crianca","cristal","crocodilo","cultura","dado","danca","deserto","diamante","dinossauro","diretor",
"doce","dragao","elefante","energia","escada","escola","escova","espelho","estrela","fantasia",
"farol","fazenda","ferramenta","figura","floresta","fogueira","folha","formiga","foguete","framboesa",
"fruta","futebol","galaxia","garfo","geladeira","girafa","guitarra","hamburguer","helicoptero","hospital",
"igreja","ilha","impressora","internet","janela","jardim","joaninha","jornal","jumento","laranja",
"leao","livro","locomotiva","lua","macaco","madeira","maleta","manga","mapa","marte",
"martelo","melancia","mesa","microfone","milho","montanha","morango","moto","museu","navio",
"neve","nuvem","oculos","oceano","onibus","orquestra","ovelha","palhaco","panela","papagaio",
"parque","passaro","peixe","pente","perfume","piano","pipoca","planeta","porta","praia",
"presente","professor","queijo","quintal","radar","rainha","relogio","revista","rio","robô",
"sabonete","sacola","sapato","satelite","semente","sereia","sino","sorvete","submarino","suco",
"telefone","teclado","telescopio","tesoura","tigre","tomate","tornado","trator","trem","tubarão",
"universo","urso","uva","vassoura","vela","violao","vulcao","xadrez","xicara","zebra",
"abacaxi","acerola","aguia","almoco","amora","anelado","aranha","ave","azeitona","balanca",
"bambu","berinjela","boi","bolacha","boneca","cacto","canario","canivete","capa","cereja",
"cofre","colher","coruja","couve","cravo","diametro","escorpiao","esquilo","faisao","foca",
"garrafa","golfinho","hortela","jabuti","jacare","kiwi","lagarto","lampada","limao","lontra",
"mamute","maracuja","mexerica","nariz","ouriço","pato","pera","pessego","pinguim","raposa"
];

async function limparBancoPorGrupos(sock, arquivos) {

    const grupos = await sock.groupFetchAllParticipating();

    const membros = new Set();

    for (const idGrupo in grupos) {
        grupos[idGrupo].participants.forEach(p => {
            membros.add(p.id);
        });
    }

    let removidos = 0;

    for (const arquivo of arquivos) {

        const banco = JSON.parse(fs.readFileSync(arquivo));

        let alterado = false;

        for (const usuario in banco) {

            if (
                usuario.endsWith('@newsletter') ||
                usuario.endsWith('@g.us') ||
                usuario.endsWith('@lid')
            ) continue;

            if (!membros.has(usuario)) {
                delete banco[usuario];
                removidos++;
                alterado = true;
            }
        }

        if (alterado) {
            fs.writeFileSync(
                arquivo,
                JSON.stringify(banco, null, 2)
            );
        }
    }

    return removidos;
}
const caminhoAluguel = './assets/aluguel.json';

function carregarAluguel() {
    return readJsonFast(caminhoAluguel, []);
}

function salvarAluguel(db) {
    writeJsonFast(caminhoAluguel, db);
}

function grupoAlugado(id) {
    let db = carregarAluguel();

    let grupo = db.find(g => g.id === id);

    if (!grupo) return false;

    if (Date.now() > grupo.expira) {
        db = db.filter(g => g.id !== id);
        salvarAluguel(db);
        return false;
    }

    return grupo;
}
async function atualizarSistema() {

    const dados =
        (await axios.get(UPDATE_URL)).data;

    const arquivos =
        dados.files || [];

    let atualizados = 0;

    for (const arquivo of arquivos) {

        try {

            const url =
                `${REPO_RAW}/${arquivo}`;

            const resposta =
                await axios.get(url);

            const pasta =
                path.dirname(arquivo);

            if (
                pasta !== "." &&
                !fs.existsSync(pasta)
            ) {

                fs.mkdirSync(
                    pasta,
                    { recursive: true }
                );

            }

            fs.writeFileSync(
                arquivo,
                resposta.data
            );

            atualizados++;

        } catch (e) {

            console.log(
                `Erro em ${arquivo}`
            );

        }

    }

    const configs =
        JSON.parse(
            fs.readFileSync(
                './dono/configs.json'
            )
        );

    configs.version =
        dados.version;

    fs.writeFileSync(
        './dono/configs.json',
        JSON.stringify(
            configs,
            null,
            2
        )
    );

    return {
        version: dados.version,
        arquivos: atualizados,
        mensagem:
            dados.mensagem
    };

}
// Pega data de hoje como "2025-11-26"
function dataHoje() {
    return new Date().toISOString().slice(0, 10);
}
// Outras consts - 2
const horaAtual = moment()
    .tz("America/Sao_Paulo")
    .format("HH:mm");
const ffmpeg = require('fluent-ffmpeg');
const { tmpdir } = require('os');
const axios = require('axios');
const cheerio = require('cheerio');
let welcome = JSON.parse(fs.readFileSync('./assets/welcome.json')); 
const now = moment().tz("America/Sao_Paulo");
const dia = now.format("DD");
const mes = now.format("MM");
const ano = now.format("YYYY");
const horas = now.format("HH");
const minutos = now.format("mm");
const segundos = now.format("ss");
const dataFormatada = `${dia}/${mes}/${ano}`;
const horaFormatada = `${horas}:${minutos}:${segundos}`;
const pino = require('pino');
const colors = require('colors');
const readline = require('readline');
const qrcode = require('qrcode-terminal');
const fileConfig = './dono/configs.json';
let { prefix, NomeDoBot, NickDono, numerodono, numerosub, key} = JSON.parse(
  fs.readFileSync(fileConfig, 'utf-8')
);

// ==========================
// CONFIGURAÇÃO DO BOTÃO DE CANAL
// ==========================
const CHANNEL_PADRAO_JID = '120363407261218149@newsletter';
let configCacheBot = null;
let configCacheMtime = 0;

function carregarConfigsBot(force = false) {
    try {
        const stat = fs.existsSync(fileConfig) ? fs.statSync(fileConfig) : null;
        const mtime = stat ? stat.mtimeMs : 0;

        if (!force && configCacheBot && configCacheMtime === mtime) {
            return configCacheBot;
        }

        const cfg = fs.existsSync(fileConfig)
            ? JSON.parse(fs.readFileSync(fileConfig, 'utf-8'))
            : {};

        configCacheBot = cfg;
        configCacheMtime = mtime;
        return cfg;
    } catch (e) {
        console.log('Erro ao carregar configs.json:', e.message);
        return configCacheBot || {};
    }
}

function salvarConfigsBot(cfg) {
    fs.writeFileSync(fileConfig, JSON.stringify(cfg, null, 2));
    configCacheBot = cfg;
    configCacheMtime = fs.existsSync(fileConfig) ? fs.statSync(fileConfig).mtimeMs : Date.now();
}

function garantirConfigChannel() {
    const cfg = carregarConfigsBot(true);

    if (!cfg.channel || typeof cfg.channel !== 'object') {
        cfg.channel = {};
    }

    let alterado = false;

    if (typeof cfg.channel.ativo !== 'boolean') {
        cfg.channel.ativo = true;
        alterado = true;
    }

    if (!cfg.channel.jid && !cfg.channel.url) {
        cfg.channel.jid = CHANNEL_PADRAO_JID;
        alterado = true;
    }

    if (!cfg.channel.nome) {
        cfg.channel.nome = cfg.NomeDoBot || NomeDoBot || 'Canal';
        alterado = true;
    }

    if (alterado) salvarConfigsBot(cfg);
}

garantirConfigChannel();

function normalizarChannelJid(valor) {
    if (!valor) return '';

    const texto = String(valor).trim();

    if (!texto) return '';
    if (texto.includes('@newsletter')) return texto;

    // Aceita colar apenas o número do canal, ex: 120363407261218149
    const matchNumero = texto.match(/(120\d{8,})/);
    if (matchNumero) return `${matchNumero[1]}@newsletter`;

    // Observação: links públicos do tipo https://whatsapp.com/channel/XXXX nem sempre expõem o JID real.
    // Se o botão não abrir com URL pública, use o JID do canal terminado em @newsletter.
    return texto;
}

function getChannelConfig() {
    const cfg = carregarConfigsBot();
    const channel = cfg.channel || {};

    return {
        ativo: channel.ativo !== false,
        jid: normalizarChannelJid(channel.jid || channel.url || cfg.channelJid || cfg.channelUrl || CHANNEL_PADRAO_JID),
        nome: channel.nome || cfg.channelName || cfg.NomeDoBot || NomeDoBot || 'Canal'
    };
}

function getForwardContext(extra = {}) {
    const canal = getChannelConfig();

    const contextInfo = {
        forwardingScore: 999,
        isForwarded: true,
        ...extra
    };

    if (canal.ativo && canal.jid) {
        contextInfo.forwardedNewsletterMessageInfo = {
            newsletterJid: canal.jid,
            newsletterName: canal.nome
        };
    }

    return contextInfo;
}

async function safeSendMessage(jid, payload, options = {}) {
    try {
        return await sock.sendMessage(jid, payload, options);
    } catch (erroComOpcoes) {
        if (options && options.quoted) {
            try {
                return await sock.sendMessage(jid, payload);
            } catch (erroSemQuoted) {
                console.error('Erro ao enviar mensagem mesmo sem quoted:', erroSemQuoted?.message || erroSemQuoted);
                return null;
            }
        }

        console.error('Erro ao enviar mensagem:', erroComOpcoes?.message || erroComOpcoes);
        return null;
    }
}

function setChannelAtivo(status) {
    const cfg = carregarConfigsBot(true);

    if (!cfg.channel || typeof cfg.channel !== 'object') {
        cfg.channel = {};
    }

    cfg.channel.ativo = Boolean(status);
    if (!cfg.channel.jid && !cfg.channel.url) cfg.channel.jid = CHANNEL_PADRAO_JID;
    if (!cfg.channel.nome) cfg.channel.nome = cfg.NomeDoBot || NomeDoBot || 'Canal';

    salvarConfigsBot(cfg);
    return cfg.channel;
}

// ==========================
// HELPERS DE ADMINISTRAÇÃO
// ==========================
const TMP_BACKUP_DIR = path.join(__dirname, 'tmp_backups');
const sugestoesPath = './assets/sugestoes.json';
const suportePath = './assets/suporte.json';
const commandStatsPath = './assets/command_stats.json';

function normalizarWhatsAppJid(valor) {
    const raw = String(valor || '').trim();
    if (!raw) return '';
    if (raw.includes('@')) return raw;
    const numero = raw.replace(/\D/g, '');
    return numero ? `${numero}@s.whatsapp.net` : raw;
}

function extrairNumeroWhatsApp(valor) {
    let raw = String(valor || '').trim();
    if (!raw) return '';
    if (raw.includes('@')) raw = raw.split('@')[0];
    if (raw.includes(':')) raw = raw.split(':')[0];
    return raw.replace(/\D/g, '');
}

function listaDonosConfigurados() {
    const cfg = carregarConfigsBot(true);
    return [cfg.numerodono, cfg.numerosub, numerodono, numerosub]
        .map(v => String(v || '').trim())
        .filter(Boolean);
}

function getSenderCandidates(info, from) {
    const key = info?.key || {};
    return [
        key.participantAlt,
        key.participantPn,
        key.participant,
        key.remoteJid,
        from
    ]
        .map(v => String(v || '').trim())
        .filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i);
}

function isDonoMensagem(info, from) {
    const donos = listaDonosConfigurados();
    if (!donos.length) return false;

    const candidatos = getSenderCandidates(info, from);

    return candidatos.some(candidato => {
        const candidatoRaw = String(candidato || '').trim().toLowerCase();
        const candidatoJid = normalizarWhatsAppJid(candidatoRaw).toLowerCase();
        const candidatoNumero = extrairNumeroWhatsApp(candidatoRaw);

        return donos.some(dono => {
            const donoRaw = String(dono || '').trim().toLowerCase();
            const donoJid = normalizarWhatsAppJid(donoRaw).toLowerCase();
            const donoNumero = extrairNumeroWhatsApp(donoRaw);

            if (!donoRaw && !donoNumero) return false;
            if (candidatoRaw === donoRaw) return true;
            if (candidatoJid === donoJid) return true;
            if (candidatoNumero && donoNumero && candidatoNumero === donoNumero) return true;

            return false;
        });
    });
}

function getDonoPrincipalJid() {
    const cfg = carregarConfigsBot();
    return normalizarWhatsAppJid(cfg.numerodono || numerodono);
}

function getConfigAtualizada() {
    const cfg = carregarConfigsBot(true);
    prefix = cfg.prefix || prefix;
    NomeDoBot = cfg.NomeDoBot || NomeDoBot;
    NickDono = cfg.NickDono || NickDono;
    numerodono = cfg.numerodono || numerodono;
    numerosub = cfg.numerosub || numerosub;
    key = cfg.key || key;
    return cfg;
}

function formatBytes(bytes = 0) {
    const n = Number(bytes) || 0;
    if (n < 1024) return `${n} B`;
    if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
    return `${(n / 1024 ** 3).toFixed(2)} GB`;
}

function formatUptime(ms = process.uptime() * 1000) {
    const total = Math.floor(ms / 1000);
    const dias = Math.floor(total / 86400);
    const horas = Math.floor((total % 86400) / 3600);
    const minutos = Math.floor((total % 3600) / 60);
    const segundos = total % 60;
    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}

function obterTextoMarcado(quoted, fallback = '') {
    return quoted?.conversation ||
        quoted?.extendedTextMessage?.text ||
        quoted?.imageMessage?.caption ||
        quoted?.videoMessage?.caption ||
        quoted?.documentMessage?.caption ||
        quoted?.text ||
        fallback || '';
}

function registrarUsoComando(cmd) {
    try {
        if (!cmd) return;
        const db = readJsonFast(commandStatsPath, { total: 0, comandos: {} });
        db.total = (db.total || 0) + 1;
        db.comandos = db.comandos || {};
        db.comandos[cmd] = (db.comandos[cmd] || 0) + 1;
        db.ultimoUso = new Date().toISOString();
        writeJsonFast(commandStatsPath, db);
    } catch (e) {
        console.log('Erro ao registrar estatística de comando:', e.message);
    }
}

function criarBackupZip() {
    if (!fs.existsSync(TMP_BACKUP_DIR)) fs.mkdirSync(TMP_BACKUP_DIR, { recursive: true });

    const zip = new AdmZip();
    const ignorar = new Set([
        'node_modules', '.git', 'media/qr-code', 'tmp_backups', 'backups', '.cache'
    ]);

    const ignorarExt = ['.zip', '.tar', '.gz', '.7z', '.rar'];
    const raiz = __dirname;

    function deveIgnorar(rel) {
        const normalized = rel.replace(/\\/g, '/');
        if (!normalized) return false;
        if (ignorar.has(normalized)) return true;
        if ([...ignorar].some(item => normalized === item || normalized.startsWith(item + '/'))) return true;
        if (ignorarExt.some(ext => normalized.toLowerCase().endsWith(ext))) return true;
        if (normalized.includes('session') && normalized.includes('qr-code')) return true;
        return false;
    }

    function adicionar(caminhoAbs, rel = '') {
        if (!fs.existsSync(caminhoAbs)) return;
        const stat = fs.statSync(caminhoAbs);
        const normalizedRel = rel.replace(/\\/g, '/');
        if (deveIgnorar(normalizedRel)) return;

        if (stat.isDirectory()) {
            for (const item of fs.readdirSync(caminhoAbs)) {
                adicionar(path.join(caminhoAbs, item), path.join(normalizedRel, item));
            }
            return;
        }

        if (stat.isFile()) {
            zip.addLocalFile(caminhoAbs, path.dirname(normalizedRel) === '.' ? '' : path.dirname(normalizedRel));
        }
    }

    adicionar(raiz, '');

    const nome = `backup_${NomeDoBot || 'bot'}_${moment().tz('America/Sao_Paulo').format('YYYY-MM-DD_HH-mm-ss')}.zip`
        .replace(/[^a-zA-Z0-9_.-]/g, '_');
    const destino = path.join(TMP_BACKUP_DIR, nome);
    zip.writeZip(destino);
    return destino;
}

async function enviarParaDonoPrincipal(payload, options = {}) {
    const donoJid = getDonoPrincipalJid();
    if (!donoJid) throw new Error('numerodono não configurado em dono/configs.json');
    return safeSendMessage(donoJid, payload, options);
}
const fotomenu = './media/menu/menu.jpg';
function Saudacoes() {
    const hora = new Date().getHours();

    if (hora >= 0 && hora < 5) {
        return '🌑 𝙱𝙾𝙰 𝙼𝙰𝙳𝚁𝚄𝙶𝙰𝙳𝙰!';
    } else if (hora >= 5 && hora < 12) {
        return '☀️ 𝙱𝙾𝙼 𝙳𝙸𝙰!';
    } else if (hora >= 12 && hora < 18) {
        return '⛅ 𝙱𝙾𝙰 𝚃𝙰𝚁𝙳𝙴!';
    } else {
        return '🌙 𝙱𝙾𝙰 𝙽𝙾𝙸𝚃𝙴!';
    }
}
const saudacao = Saudacoes();
function gerarCPF() {
    const random = () => Math.floor(Math.random() * 9);

    let n = [];

    // primeiros 9 dígitos
    for (let i = 0; i < 9; i++) n.push(random());

    // calcula dígito 1
    let d1 = n.reduce((acc, val, idx) => acc + val * (10 - idx), 0);
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;

    // calcula dígito 2
    let d2 = n.reduce((acc, val, idx) => acc + val * (11 - idx), 0);
    d2 += d1 * 2;
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;

    return `${n[0]}${n[1]}${n[2]}.${n[3]}${n[4]}${n[5]}.${n[6]}${n[7]}${n[8]}-${d1}${d2}`;
}
const antiLinkBetPath = "./assets/antilinkbet.json";

let antiLinkBet = fs.existsSync(antiLinkBetPath)
    ? JSON.parse(fs.readFileSync(antiLinkBetPath))
    : {};

function saveAntiLinkBet() {
    fs.writeFileSync(antiLinkBetPath, JSON.stringify(antiLinkBet, null, 2));
}
const antiLinkGpFile = './assets/antilinkgp.json';
let antiLinkGp = JSON.parse(fs.readFileSync(antiLinkGpFile, 'utf8'));

const saveAntiLinkGp = () => {
    fs.writeFileSync(antiLinkGpFile, JSON.stringify(antiLinkGp, null, 2));
};
let antiLink = {};
try {
    antiLink = JSON.parse(fs.readFileSync('./assets/antilink.json'));
} catch {
    antiLink = {};
}

// Função para salvar
const saveAntiLink = () => {
    fs.writeFileSync('./assets/antilink.json', JSON.stringify(antiLink, null, 2));
};
function menu(pushname, NickDono, dataFormatada, prefix, NomeDoBot) {
    const gerarMenu = require("./dono/menus/menu.js");
    return gerarMenu(pushname, NickDono, dataFormatada, prefix, NomeDoBot ); 
}
function menufig(prefix, NomeDoBot) {
const menuFIG = require("./dono/menus/menufig.js");
return menuFIG(prefix, NomeDoBot);
}
function menuRPG(prefix) {
const menuRpg = require("./dono/menus/menurpg.js");
return menuRpg(prefix);
}
function menudown(prefix) {
const menuDown = require("./dono/menus/menudown.js");
return menuDown(prefix);
}
function menulogos(prefix, NomeDoBot) {
const menuLOGOS = require("./dono/menus/menulogos.js");
return menuLOGOS(prefix, NomeDoBot);
const menubuttons = require('./dono/menus/menubuttons.js');
return menubuttons(prefix, sender, baileysVer, saudacao, NomeDoBot, horaFormatada, dataFormatada)
}
function menuadm(prefix) {
const menuadmin = require("./dono/menus/menuadm.js");
return menuadmin(prefix);
}
function typewriter(texto, cor = "\x1b[0m", velocidade = 5) {
    let i = 0;

    return new Promise(resolve => {
        const intervalo = setInterval(() => {
            process.stdout.write(cor + texto.charAt(i) + "\x1b[0m");
            i++;

            if (i >= texto.length) {
                clearInterval(intervalo);
                process.stdout.write("\n");
                resolve();
            }
        }, velocidade);
    });
}

async function startBot() {
  try {
    const authFolder = './media/qr-code';

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const { version } = await fetchLatestBaileysVersion();

if (sock) {
    try {
        sock.ev.removeAllListeners();
        if (sock.ws && sock.ws.close) {
            sock.ws.close();
        }
        if (sock.end) {
            await sock.end();
        }
    } catch (e) {
        console.log("Erro ao encerrar sessão antiga:", e);
    }
}

    sock = makeWASocket({
      logger: pino({ level: 'silent' }),
      auth: state,
      browser: ["Linux", "Chrome", "2.3000.1023223821"],
      version
    });

    sock.ev.on('creds.update', saveCreds);

    // **Somente pede o número se não houver sessão salva**
    function delay(ms) {
    if (existsSync(dirPath)) {
        readdirSync(dirPath).forEach((file) => {
            const currentPath = path.join(dirPath, file);

            if (lstatSync(currentPath).isDirectory()) {
                rmdir(currentPath);
            } else {
                unlinkSync(currentPath);
            }
        });
        rmdirSync(dirPath);
    }
}
    // Conexão
sock.ev.on('connection.update', async (update) => {
    try {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            qrcode.generate(qr, { small: true });
            console.log(
  colors.bold.blue('\n[ TOSHIRUZ ] Informa:'),
  '📱 Escaneie o QR-Code gerado acima...'
);
        }
        if (connection === 'connecting') {
        console.log(
  colors.bold.red('\n[ TOSHIRUZ ] Informa:'),
  '\n 😎🪄 Fazendo a magia acontecer...'
);
        }
if (connection === 'close') {
    sock.ev.removeAllListeners();
    console.log(
  colors.bold.yellow('\n[ TOSHIRUZ ] Informa:'),
  '\n 🔒 Conexão encerrada, tentando reconectar...'
);
setTimeout(() => {
    startBot();
  }, 5000);
}

        if (connection === 'open') {
        const bannerain = require('./dono/rainbow/banner2.js');
        bannerain();
            console.log(
  colors.bold.green('\n[ TOSHIRUZ ] Informa:'),
  '\n ✅ Estou conectado no seu número! Viu como foi super fácil de eu ser conectado?! Agora pode desfrutar de todos os meus comandos...'
);
        }

    } catch (e) {
        console.error("❌ Erro no connection.update:", e);
    }
});
sock.ev.on('group-participants.update', async (update) => {
    clearGroupMetadataFast(update.id);
    const fs = require('fs');

const path = './assets/bemvindo.json';

if (!fs.existsSync(path)) return;

const db = JSON.parse(fs.readFileSync(path));

if (!db[update.id]) return;
if (!db[update.id].ativo) return;

if (update.action !== 'add') return;

const metadata =
await getGroupMetadataFast(sock, update.id, 0);

for (const membro of update.participants) {

let texto = db[update.id].legenda;

texto = texto.replace(
/{membro}/g,
`@${membro.split('@')[0]}`
);

texto = texto.replace(
/{grupo}/g,
metadata.subject
);

texto = texto.replace(
/{total}/g,
String(metadata.participants.length)
);

texto = texto.replace(
/{hora}/g,
new Date().toLocaleTimeString('pt-BR')
);

texto = texto.replace(
/{data}/g,
new Date().toLocaleDateString('pt-BR')
);

await sock.sendMessage(
update.id,
{
text: texto,
mentions: [membro]
}
);

}
    const groupId = update.id;
    let groupMetadata = await getGroupMetadataFast(sock, groupId, 0);
    const nomegp = groupMetadata.subject;

    // Se não estiver ativado → ignorar
    if (!welcome[groupId]) return;

    // helper para extrair o jid como string
function getJid(u) {
  if (!u) return '';
  if (typeof u === 'string') return u;
  // alguns formatos comuns: { id: 'xxx@s.whatsapp.net' }, { jid: '...' }, array ['xxx@...']
  if (typeof u === 'object') {
    if (u.id) return u.id;
    if (u.jid) return u.jid;
    if (Array.isArray(u) && u[0]) return String(u[0]);
    // fallback: stringify para debugging
    return String(u);
  }
  return String(u);
}

const pathLegenda = './assets/legendas.json';

let legendas = {};
if (fs.existsSync(pathLegenda)) {
    legendas = JSON.parse(fs.readFileSync(pathLegenda));
}

const legenda = legendas[groupId] || "👋 Olá @user, seja bem-vindo ao grupo!";

for (let user of update.participants) {
    const jid = typeof user === 'string' ? user : user.id;
    const short = jid.split('@')[0];

    if (update.action === 'add') {
        const mensagem = legenda.replace(/@user/g, `@${short}`);

        await sock.sendMessage(groupId, {
            text: mensagem,
            mentions: [jid]
        });
    }

    if (update.action === 'remove') {
        await sock.sendMessage(groupId, {
            text: `👋 O membro @${short} saiu do grupo.`,
            mentions: [jid]
        });
    }
}
});
    // Recebendo mensagens
    sock.ev.on('messages.upsert', async (msgupsrt) => {
  try {
    const pushname = msgupsrt.messages[0].pushName;
    const user = pushname;
    const info = msgupsrt.messages[0];

    if (!info.message || info.key.fromMe) return;

    // Marca como lida imediatamente, sem bloquear o processamento do comando.
    sock.readMessages([info.key]).catch(() => {});

    const m = info;
    let context = m.message?.extendedTextMessage?.contextInfo || {};
    let mentionedJid = context.mentionedJid || [];
    const quotedUser = m.message?.extendedTextMessage?.contextInfo?.participant;

    const from = info.key.remoteJid;
    const isGroup = from.endsWith('@g.us');

    const messageType = Object.keys(info.message)[0];

    var body =
      info.message?.conversation ||
      info.message?.viewOnceMessageV2?.message?.imageMessage?.caption ||
      info.message?.viewOnceMessageV2?.message?.videoMessage?.caption ||
      info.message?.imageMessage?.caption ||
      info.message?.videoMessage?.caption ||
      info.message?.extendedTextMessage?.text ||
      info.message?.viewOnceMessage?.message?.videoMessage?.caption ||
      info.message?.viewOnceMessage?.message?.imageMessage?.caption ||
      info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption ||
      info.message?.buttonsResponseMessage?.selectedButtonId ||
      info.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
      info.message?.templateButtonReplyMessage?.selectedId ||
      JSON.parse(
        info.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || "{}"
      )?.id ||
      info?.text ||
      "";

    const sendere2 = info.key.participant?.includes('@lid')
      ? info.key.participant
      : info.key.participantAlt || info.key.participantPn;

    const sendere = info.key.participantAlt?.includes('@s.whatsapp.net')
      ? info.key.participantAlt
      : info.key.participant || info.key.participantPn;

    const sender2 = sendere2 || from;
    const sender = sendere || from;

    const numberSelo = sender.split("@")[0];

    const isDono = isDonoMensagem(info, from);

    const metaData = isGroup
      ? await getGroupMetadataFast(sock, from)
      : {};

    const participants = isGroup
      ? metaData.participants
      : [];

    const groupMetadata = metaData;

    const botNumber = sock.user.id.split(":")[0];

    const isBotAdmin = isGroup
      ? participants.some(
          p =>
            p.id?.split("@")[0] === botNumber &&
            (p.admin === "admin" || p.admin === "superadmin")
        )
      : false;

    const admins = isGroup
      ? participants
          .filter(
            p =>
              p.admin === "admin" ||
              p.admin === "superadmin"
          )
          .map(p => p.id)
      : [];

    const isAdmin = admins.includes(info.key.participant);

    const selometa = {
      key: {
        participant: sender,
        remoteJid: "status@broadcast",
        fromMe: false
      },
      message: {
        contactMessage: {
          displayName: info.pushName,
          vcard: `BEGIN:VCARD
VERSION:3.0
N:;${info.pushName};;;
FN:${info.pushName}
item1.TEL;waid=${numberSelo}:${numberSelo}
item1.X-ABLabel:Celular
END:VCARD`,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true
          }
        }
      }
    };

    const reply = async (texto, opts = {}) => {
      const payload = {
        text: String(texto ?? ''),
        contextInfo: getForwardContext({ forwardingScore: 100000 }),
        mentions: opts.mentions || (sender ? [sender] : [])
      };

      return safeSendMessage(from, payload, { quoted: selometa });
    };
    // ==========================
    // SISTEMA DE ALUGUEL
    // ==========================
    if (isGroup && !grupoAlugado(from)) {
    const cmd = body.trim().split(/ +/)[0].toLowerCase().replace(prefix, "");

    const comandosAluguel = [
        "rg_aluguel",
        "rm_aluguel",
        "veraluguel",
        "listaaluguel",
        "aluguelglobal"
    ];

    if (!(isDono && comandosAluguel.includes(cmd))) {
        return;
    }
}

    const budy = body;
  const nameGroup = metaData.subject;
  // Função que retorna a saudação de acordo com o horário
  const args = body.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
const q = body.slice((prefix + command).length).trim();
const text = q;     
if(budy.startsWith('>')){
if(!isDono) return;
try {
console.log('[', colors.cyan('EVAL'),']', colors.yellow(moment(info.messageTimestamp * 1000).format('DD/MM HH:mm:ss')), colors.green(budy))
return sock.sendMessage(from, {text: JSON.stringify(eval(budy.slice(2)),null,'\t')}, { quoted: selometa }).catch(e => {
return sock.sendMessage(from, { text: String(e)}, { quoted: selometa });
})
} catch (e){
return reply(String(e))
}
}
if (body.startsWith('$')) {
  if (!isDono) return;
  if (info.key.fromMe) return
  const qq = body.slice(1)
  exec(qq, { timeout: 1000 }, (err, stdout, stderr) => {
    if (err) return reply(String(err))
    if (stderr) return reply(String(stderr))
    if (stdout) reply(stdout)
  })
}
function decode(from) {
  try {
    const res = jidDecode(from) || {};
    return (res.user && res.server) ? `${res.user}@${res.server}` : from;
  } catch (err) {
    return from;
  }
}

const numberUser = sender?.split('@')[0]
  const isCmd = body.startsWith(prefix);
  const msgBody = m.message.conversation || m.message.extendedTextMessage?.text;
  const msgBodyLower = msgBody?.toLowerCase();
  if (body === 'Prefixo') {
  await sock.sendMessage(from, { text: `╔ׄ╴ᩞ֮┮ᩙׅ᩼┯̈ ⵿ׅׄ┄࣮ׄ┅ᮬ̼ׄ͜ᰰᩫ╗۫۫۫۫⸧⃘࣮ׄ⸦ᜒ֧ׄ꒰⵿💢ᜒ⵿᮫ׄᩙ꒱⸧⃘ׂ໋ׅ⸦࣮۫۫۫۫╔͜ᰰᩫ┅֔ᮬ̼┄⵿ׄ┮ᩧׅ᩼┯ׅׄ╴֓ᩞ╗\n┃╼ٜ፝֟͜🌹ּ ̈֠͜⡷ׅׄ 𝙱𝙾𝚃 𝙾𝙽, 𝙾𝙻𝙰́ ${pushname}!\n┃╼ٜ፝֟͜🌹ּ ̈֠͜⡷ׅׄ ${saudacao}\n┃╼ٜ፝֟͜🌹ּ ̈֠͜⡷ׅׄ 𝙿𝚁𝙴𝙵𝙸𝚇𝙾: ${prefix}\n┃╼ٜ፝֟͜🌹ּ ̈֠͜⡷ׅׄ 𝙷𝙾𝚁𝙰́𝚁𝙸𝙾: ${horaFormatada}\n┃╼ٜ፝֟͜🌹ּ ̈֠͜⡷ׅׄ 𝚅𝙰𝙼𝙾𝚂 𝚀𝚄𝙴 𝚅𝙰𝙼𝙾𝚂! 🚀\n╚╴ᩞ֮┮ᩙׅ᩼┯̈ ⵿ׅׄ┄࣮ׄ┅ᮬ̼ׄ͜ᰰᩫ╗۫۫۫۫⸧⃘࣮ׄ⸦ᜒ֧ׄ꒰⵿💢ᜒ⵿᮫ׄᩙ꒱⸧⃘ׂ໋ׅ⸦࣮۫۫۫۫╔͜ᰰᩫ┅֔ᮬ̼┄⵿ׄ┮ᩧׅ᩼┯ׅׄ╴֓ᩞ╝`}, { quoted: selometa });
}
  const reagir = async (arg1, arg2) => {
  const emojinn = arg2 || arg1;
  if (!emojinn) return null;
  return sock.sendMessage(from, {
  react: {
  text: emojinn,
  key: info.key
  }
  }).catch(() => null);
  };
const vipPath = "./assets/vip.json";
let vipData = readJsonFast(vipPath, []);
function saveVip() {
    writeJsonFast(vipPath, vipData);
}
const isVip = isUserVipFast(vipData, sender);
  if (isGroup && antiLinkGp[from]?.status) {

    // Link de grupo
    const regexGp = /chat\.whatsapp\.com\/[A-Za-z0-9]+/i;

    if (regexGp.test(body)) {

        if (!isAdmin && !isDono) {
            try {

                await sock.groupParticipantsUpdate(from, [sender], "remove");

                await sock.sendMessage(from, {
                    text: `🚫 *Link de grupo detectado!*  
@${sender.split("@")[0]} foi removido.`,
                    mentions: [sender]
                });

            } catch (err) {
                console.error(err);
                reply("❌ Erro ao tentar remover o membro. Verifique se tenho permissão de admin.");
            }
        }
    }
}
// DETECÇÃO DE ANTI-LINK
// REGEX de links de apostas
const regexApostas = /(betano|bet365|blaze|tigrinho|tiger|pixbet|jkbet|bet|bet777|333bet|1xbet|bet7k|esportesbet|milbets|f12\.bet|betmaster|apostas)/i;

if (isGroup && antiLinkBet[from]) {

    if (regexApostas.test(body)) {

        if (!isAdmin && !isDono) {
            try {
                await sock.groupParticipantsUpdate(from, [sender], 'remove');

                await sock.sendMessage(from, {
                    text: `🚫 *Link de apostas detectado!*\n@${sender.split('@')[0]} foi removido.`,
                    mentions: [sender]
                });

            } catch (e) {
                console.error(e);
                reply("❗ Não consegui remover o usuário (erro ou sem permissão).");
            }
        }
    }
}
if (!info.key.fromMe && isGroup) {
    const grupoId = from;
    const statusData = require('./assets/simihStatus.json');
    const simihData = require('./assets/simih.json');

    if (statusData[grupoId]) { // só responde se ativo no grupo
        const texto = info.message.conversation || info.message.extendedTextMessage?.text;
        if (!texto) return;

        const resposta = simihData[texto];
        if (resposta) {
            sock.sendMessage(grupoId, { text: resposta }, { quoted: selometa });
        }
    }
}
if (isGroup) {
    // verifica se o grupo tem antilink ativado
    if (antiLink[from]) {

        const regex = /(?:https?:\/\/|www\.|chat\.whatsapp\.com\/)[^\s]+/i;

        if (regex.test(body)) {

            if (!isAdmin && !isDono) {
                try {
                    await sock.groupParticipantsUpdate(from, [sender], 'remove');

                    await sock.sendMessage(from, {
                        text: `🚫 Link detectado! @${sender.split('@')[0]} foi removido.`,
                        mentions: [sender]
                    });

                } catch (e) {
                    console.error(e);
                    await reply('❗ Não consegui remover o usuário (sem perms ou erro do servidor).');
                }
            }
        }
    }
}
        if (messageType === 'conversation') body = info.message.conversation;
        else if (messageType === 'extendedTextMessage') body = info.message.extendedTextMessage.text;

        // Mostrar log da mensagem
        mostrarLogMsg(sock, info, pushname, nameGroup)
        
        if (!isCmd) return;
        registrarUsoComando(command);

        // Inicializa o saldo apenas para quem usa comandos. Antes isso rodava em toda mensagem do grupo.
        let db = carregarGold();
        if (!db[sender]) {
            db[sender] = { gold: 0 };
            salvarGold(db);
        }

        const pc = `${prefix + command}`;
        
const quoted =
    info.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
    info.message?.imageMessage?.contextInfo?.quotedMessage ||
    info.message?.videoMessage?.contextInfo?.quotedMessage ||
    info.message?.audioMessage?.contextInfo?.quotedMessage ||
    info.message?.stickerMessage?.contextInfo?.quotedMessage ||
    null;

        // Compatibilidade com comandos importados de bases que usam m.chat, m.reply, m.quoted e text.
        m.chat = from;
        m.key = info.key;
        m.reply = reply;
        m.quoted = quoted ? {
            text: quoted.conversation || quoted.extendedTextMessage?.text || quoted.imageMessage?.caption || quoted.videoMessage?.caption || '',
            conversation: quoted.conversation,
            caption: quoted.imageMessage?.caption || quoted.videoMessage?.caption || ''
        } : null;
    
        // ==========================
        // COMANDOS
        // ==========================
        switch (command) {
                
                case 'brincadeira':
            case 'modobn': {
const fs = require('fs');
    if (!isGroup)
        return reply(enviar.msg.group);

    if (!isAdmin)
        return reply(enviar.msg.adm);

    const modos =
        carregarModos();

    if (!modos[from])
        modos[from] = {};

    modos[from].brincadeira =
        !modos[from].brincadeira;

    fs.writeFileSync(
        './assets/modos.json',
        JSON.stringify(modos, null, 2)
    );

    reply(
        modos[from].brincadeira
        ? '🎮 𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰 𝙰𝚃𝙸𝚅𝙰𝙳𝙾.'
        : '🚫 𝙼𝙾𝙳𝙾 𝙱𝚁𝙸𝙽𝙲𝙰𝙳𝙴𝙸𝚁𝙰 𝙳𝙴𝚂𝙰𝚃𝙸𝚅𝙰𝙳𝙾.'
    );

}
break;
          case 'channel':
          case 'canal': {

if (!isDono) return reply(enviar.msg.dono);

const opcao = (args[0] || '').toLowerCase();
const canalAtual = getChannelConfig();

if (['on', 'ativar', 'ligar'].includes(opcao)) {
    const canal = setChannelAtivo(true);
    return reply(`✅ Botão de canal ativado.\n\n📌 Canal atual: ${canal.nome || NomeDoBot}\n🔗 JID/URL: ${canal.jid || canal.url || CHANNEL_PADRAO_JID}`);
}

if (['off', 'desativar', 'desligar'].includes(opcao)) {
    setChannelAtivo(false);
    return reply(`🚫 Botão de canal desativado.\n\nQuando estiver desativado, as mensagens continuam funcionando, mas sem o botão/encaminhamento do canal.`);
}

if (['jid', 'setjid'].includes(opcao)) {
    const novoJid = args.slice(1).join(' ').trim();
    if (!novoJid) return reply(`❌ Use: ${prefix}channel jid 120363XXXXXXXX@newsletter`);
    const cfg = carregarConfigsBot(true);
    cfg.channel = cfg.channel || {};
    cfg.channel.jid = normalizarChannelJid(novoJid);
    salvarConfigsBot(cfg);
    return reply(`✅ JID do canal atualizado.\n\nNovo JID: ${cfg.channel.jid}`);
}

if (['url', 'seturl', 'link'].includes(opcao)) {
    const novaUrl = args.slice(1).join(' ').trim();
    if (!novaUrl) return reply(`❌ Use: ${prefix}channel url https://whatsapp.com/channel/SEU_CANAL`);
    const cfg = carregarConfigsBot(true);
    cfg.channel = cfg.channel || {};
    cfg.channel.url = novaUrl;
    salvarConfigsBot(cfg);
    return reply(`✅ URL do canal atualizada.\n\nNova URL: ${cfg.channel.url}\n\nObservação: o botão usa melhor o JID terminado em @newsletter. A URL fica salva no configs.json para referência.`);
}

if (['nome', 'name', 'setnome'].includes(opcao)) {
    const novoNome = args.slice(1).join(' ').trim();
    if (!novoNome) return reply(`❌ Use: ${prefix}channel nome ${NomeDoBot}`);
    const cfg = carregarConfigsBot(true);
    cfg.channel = cfg.channel || {};
    cfg.channel.nome = novoNome;
    salvarConfigsBot(cfg);
    return reply(`✅ Nome do canal atualizado.\n\nNovo nome: ${cfg.channel.nome}`);
}

return reply(`⚙️ *Configuração do botão de canal*\n\nStatus: ${canalAtual.ativo ? 'ATIVADO' : 'DESATIVADO'}\nNome: ${canalAtual.nome}\nJID/URL: ${canalAtual.jid || 'não definido'}\n\nComandos:\n${prefix}channel on\n${prefix}channel off\n${prefix}channel jid 120363XXXXXXXX@newsletter\n${prefix}channel url https://whatsapp.com/channel/SEU_CANAL\n${prefix}channel nome Nome Do Canal\n\nTambém pode editar direto em:\n./dono/configs.json\n\nExemplo:\n"channel": {\n  "ativo": true,\n  "nome": "${NomeDoBot}",\n  "jid": "120363407261218149@newsletter",\n  "url": "https://whatsapp.com/channel/SEU_CANAL"\n}`);

}
break;

          case 'suporte':
          case 'support': {

if (!q) return reply(`🛟 Escreva sua mensagem de suporte.\n\nExemplo:\n${prefix}suporte meu bot não está respondendo o menu`);

try {
    const protocolo = `SUP-${Date.now().toString(36).toUpperCase()}`;
    const dbSup = readJsonFast(suportePath, []);

    if (Array.isArray(dbSup)) {
        dbSup.push({
            protocolo,
            usuario: sender,
            nome: info.pushName || pushname || 'Sem nome',
            grupo: isGroup ? from : null,
            nomeGrupo: isGroup ? nameGroup : 'Privado',
            texto: q,
            data: new Date().toISOString()
        });
        while (dbSup.length > 200) dbSup.shift();
        writeJsonFast(suportePath, dbSup);
    }

    const textoSuporte = `🛟 *NOVO PEDIDO DE SUPORTE*\n\n🧾 *Protocolo:* ${protocolo}\n👤 *Usuário:* ${info.pushName || pushname || 'Sem nome'}\n🔢 *Número:* ${sender.split('@')[0]}\n👥 *Grupo:* ${isGroup ? nameGroup : 'Privado'}\n🆔 *Chat:* ${from}\n🕒 *Data:* ${moment().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss')}\n\n📩 *Mensagem:*\n${q}`;

    await enviarParaDonoPrincipal({
        text: textoSuporte,
        contextInfo: getForwardContext({ forwardingScore: 999 })
    }, { quoted: selometa });

    reply(`✅ *Suporte enviado ao dono principal!*\n🧾 Protocolo: *${protocolo}*`);
} catch (e) {
    console.error('Erro suporte:', e);
    reply('❌ Erro ao enviar suporte ao dono principal.');
}

}
break;

          case 'relatorio':
          case 'relatório': {

if (isGroup && !isAdmin && !isDono) return reply(enviar.msg.adm);

try {
    const cfg = getConfigAtualizada();
    const canal = getChannelConfig();
    const stats = readJsonFast(commandStatsPath, { total: 0, comandos: {} });
    const mem = process.memoryUsage();
    const aluguel = isGroup ? grupoAlugado(from) : null;
    const topCmds = Object.entries(stats.comandos || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cmd, total], i) => `${i + 1}. ${prefix}${cmd} — ${total}x`)
        .join('\n') || 'Sem dados ainda';

    const protecoes = isGroup
        ? [
            `AntiLink: ${antiLink[from] ? 'ON' : 'OFF'}`,
            `AntiLink GP: ${antiLinkGp[from]?.status ? 'ON' : 'OFF'}`,
            `AntiBet: ${antiLinkBet[from] ? 'ON' : 'OFF'}`,
            `Modo brincadeira: ${isBotBn(from) ? 'ON' : 'OFF'}`
        ].join('\n')
        : 'Relatório aberto em chat privado';

    const textoRelatorio = `📊 *RELATÓRIO DO BOT*\n\n🤖 *Bot:* ${NomeDoBot}\n🔣 *Prefixo:* ${prefix}\n⏱️ *Online há:* ${formatUptime()}\n🧠 *Memória RSS:* ${formatBytes(mem.rss)}\n📦 *Heap usado:* ${formatBytes(mem.heapUsed)}\n🧩 *Node:* ${process.version}\n\n👥 *Grupo:* ${isGroup ? nameGroup : 'Privado'}\n🆔 *ID:* ${from}\n👤 *Membros:* ${isGroup ? participants.length : '—'}\n🛡️ *Admins:* ${isGroup ? admins.length : '—'}\n🤖 *Bot admin:* ${isGroup ? (isBotAdmin ? 'SIM' : 'NÃO') : '—'}\n💰 *Aluguel:* ${isGroup ? (aluguel ? `ATIVO até ${new Date(aluguel.expira).toLocaleString('pt-BR')}` : 'INATIVO') : '—'}\n\n📌 *Canal:* ${canal.ativo ? 'ON' : 'OFF'}\n📛 *Nome do canal:* ${canal.nome}\n🔗 *JID:* ${canal.jid || 'não definido'}\n\n🛡️ *Proteções:*\n${protecoes}\n\n📈 *Comandos processados:* ${stats.total || 0}\n🏆 *Top comandos:*\n${topCmds}`;

    reply(textoRelatorio);
} catch (e) {
    console.error('Erro relatório:', e);
    reply('❌ Erro ao gerar relatório.');
}

}
break;

          case 'painel':
          case 'panel': {

if (isGroup && !isAdmin && !isDono) return reply(enviar.msg.adm);

try {
    const cfg = getConfigAtualizada();
    const canal = getChannelConfig();
    const aluguel = isGroup ? grupoAlugado(from) : null;
    const stats = readJsonFast(commandStatsPath, { total: 0, comandos: {} });

    const textoPainel = `╭━━━〔 ⚙️ *PAINEL ${NomeDoBot}* 〕━━━╮\n┃ 🤖 Nome: *${NomeDoBot}*\n┃ 🔣 Prefixo: *${prefix}*\n┃ 📌 Canal: *${canal.ativo ? 'ATIVO' : 'DESATIVADO'}*\n┃ 📛 Canal nome: *${canal.nome}*\n┃ ⏱️ Uptime: *${formatUptime()}*\n┃ 📈 Comandos: *${stats.total || 0}*\n┃\n┃ 👥 Grupo: *${isGroup ? nameGroup : 'Privado'}*\n┃ 👤 Membros: *${isGroup ? participants.length : '—'}*\n┃ 🛡️ Admins: *${isGroup ? admins.length : '—'}*\n┃ 🤖 Bot admin: *${isGroup ? (isBotAdmin ? 'SIM' : 'NÃO') : '—'}*\n┃ 💰 Aluguel: *${isGroup ? (aluguel ? 'ATIVO' : 'INATIVO') : '—'}*\n┃\n┃ 🔗 AntiLink: *${isGroup ? (antiLink[from] ? 'ON' : 'OFF') : '—'}*\n┃ 🔗 AntiLink GP: *${isGroup ? (antiLinkGp[from]?.status ? 'ON' : 'OFF') : '—'}*\n┃ 🎰 AntiBet: *${isGroup ? (antiLinkBet[from] ? 'ON' : 'OFF') : '—'}*\n┃ 🎮 Brincadeira: *${isGroup ? (isBotBn(from) ? 'ON' : 'OFF') : '—'}*\n╰━━━━━━━━━━━━━━━━━━━━╯\n\n🧰 *Atalhos do dono:*\n${prefix}setprefix novo_prefixo\n${prefix}setnome novo_nome\n${prefix}channel on/off\n${prefix}backup\n${prefix}broadcast texto`;

    reply(textoPainel);
} catch (e) {
    console.error('Erro painel:', e);
    reply('❌ Erro ao abrir painel.');
}

}
break;

          case 'backup': {

if (!isDono) return reply(enviar.msg.dono);

let arquivoBackup = null;
try {
    await reply('📦 Gerando backup e enviando para o dono principal...');
    arquivoBackup = criarBackupZip();
    const nomeArquivo = path.basename(arquivoBackup);

    await enviarParaDonoPrincipal({
        document: fs.readFileSync(arquivoBackup),
        mimetype: 'application/zip',
        fileName: nomeArquivo,
        caption: `📦 *Backup automático do ${NomeDoBot}*\n\n🕒 ${moment().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss')}\n⚠️ Sessões/QR, node_modules e arquivos compactados foram ignorados por segurança.`
    }, { quoted: selometa });

    reply('✅ Backup enviado ao dono principal.\n🧹 Arquivo temporário apagado do servidor.');
} catch (e) {
    console.error('Erro backup:', e);
    reply(`❌ Erro ao gerar/enviar backup: ${e.message || e}`);
} finally {
    if (arquivoBackup && fs.existsSync(arquivoBackup)) {
        try { fs.unlinkSync(arquivoBackup); } catch {}
    }
}

}
break;

          case 'setprefix':
          case 'setpref':
          case 'setprifx':
          case 'setprifix': {

if (!isDono) return reply(enviar.msg.dono);

const novoPrefixo = args[0];
if (!novoPrefixo) return reply(`❌ Use: ${prefix}setprefix !`);
if (novoPrefixo.length > 5) return reply('❌ Prefixo muito longo. Use até 5 caracteres.');

try {
    const cfg = carregarConfigsBot(true);
    const antigo = prefix;
    cfg.prefix = novoPrefixo;
    salvarConfigsBot(cfg);
    prefix = novoPrefixo;

    reply(`✅ Prefixo atualizado.\n\nAntes: *${antigo}*\nAgora: *${prefix}*\n\nUse: ${prefix}menu`);
} catch (e) {
    console.error('Erro setprefix:', e);
    reply('❌ Erro ao atualizar prefixo.');
}

}
break;

          case 'setnome':
          case 'setname':
          case 'setbotnome': {

if (!isDono) return reply(enviar.msg.dono);

const novoNome = q.trim();
if (!novoNome) return reply(`❌ Use: ${prefix}setnome Novo Nome Do Bot`);
if (novoNome.length > 40) return reply('❌ Nome muito longo. Use até 40 caracteres.');

try {
    const cfg = carregarConfigsBot(true);
    const antigo = NomeDoBot;
    cfg.NomeDoBot = novoNome;
    salvarConfigsBot(cfg);
    NomeDoBot = novoNome;

    try {
        if (sock.updateProfileName) await sock.updateProfileName(novoNome);
    } catch (e) {
        console.log('Não consegui atualizar o nome do perfil no WhatsApp:', e.message);
    }

    reply(`✅ Nome do bot atualizado.\n\nAntes: *${antigo}*\nAgora: *${NomeDoBot}*`);
} catch (e) {
    console.error('Erro setnome:', e);
    reply('❌ Erro ao atualizar nome do bot.');
}

}
break;

          case 'broadcast':
          case 'bc': {

if (!isDono) return reply(enviar.msg.dono);

const textoBroadcast = q || obterTextoMarcado(quoted, '');
if (!textoBroadcast) return reply(`❌ Use: ${prefix}broadcast sua mensagem\n\nTambém pode responder uma mensagem com ${prefix}broadcast`);

try {
    const grupos = await sock.groupFetchAllParticipating();
    const ids = Object.keys(grupos || {});

    if (!ids.length) return reply('❌ Não encontrei grupos para enviar broadcast.');

    await reply(`📣 Iniciando broadcast para *${ids.length}* grupos...`);

    let enviados = 0;
    let falhas = 0;

    for (const gid of ids) {
        try {
            await safeSendMessage(gid, {
                text: `📣 *COMUNICADO ${NomeDoBot}*\n\n${textoBroadcast}`,
                contextInfo: getForwardContext({ forwardingScore: 999 })
            });
            enviados++;
            await new Promise(resolve => setTimeout(resolve, 350));
        } catch (e) {
            falhas++;
            console.log(`Falha no broadcast para ${gid}:`, e.message);
        }
    }

    reply(`✅ Broadcast finalizado.\n\n📨 Enviados: *${enviados}*\n⚠️ Falhas: *${falhas}*`);
} catch (e) {
    console.error('Erro broadcast:', e);
    reply('❌ Erro ao fazer broadcast.');
}

}
break;

          case 'menu': {

if (!isGroup)
return reply(enviar.msg.group);

try {

reagir('⚡');

const textMen = menu(
pushname,
NickDono,
dataFormatada,
prefix,
NomeDoBot
);

await sock.sendMessage(
from,
{
image: {
url: fotomenu
},
caption: textMen,
mentions: [sender],
contextInfo: getForwardContext({ forwardingScore: 999 })
},
{
quoted: selometa
}
);

reagir('✅');

} catch (e) {

console.log('Erro ao enviar menu:', e);

reagir('❌');

reply('❌ Erro ao enviar o menu.');

}

}
break;
                case 'nick': {

if (!q)
return reply(`✍️ Exemplo:\n${prefix}nick Matheus`);

try {

const res = await fetchJson(
`https://yuta-apis.xyz/api/geradores/gerar-nicks?apitoken=${TOKEN}&text=${encodeURIComponent(q)}`
);

console.log(JSON.stringify(res, null, 2));

const lista = res.resultado || res.resultados || [];

if (!lista.length)
return reply('❌ Nenhum nick encontrado.');

nickTemp[sender] = lista;

let txt = `🎭 *NICKS GERADOS*\n\n`;

for (let i = 0; i < lista.length; i++) {

txt += `${i + 1}️⃣ ${lista[i].result}\n`;

}

txt += `\n━━━━━━━━━━━━━━\n`;
txt += `📝 Escolha um usando:\n`;
txt += `${prefix}usarnick número\n\n`;
txt += `Exemplo:\n${prefix}usarnick 3`;

reply(txt);

} catch (e) {

console.log('Erro nick:', e);

reply('❌ Erro ao gerar os nicks.');

}

}
break;
               case 'gpt': {
    if (!q) {
        return reply(`𝚄𝚜𝚎 𝚘 𝚜𝚎𝚐𝚞𝚒𝚗𝚝𝚎 𝚎𝚡𝚎𝚖𝚙𝚕𝚘 ${prefix}gpt 𝙿𝚘𝚛 𝚚𝚞𝚎 𝚎𝚞 𝚊𝚖𝚘 𝚝𝚊𝚗𝚝𝚘 𝚎𝚜𝚜𝚊 𝚐𝚊𝚛𝚘𝚝𝚊? `);
    }

    try {
        await sock.sendPresenceUpdate('composing', from);

        const api = `https://yuta-apis.xyz/api/ias/gpt?query=${encodeURIComponent(q)}&apitoken=${TOKEN}`;

        const response = await fetch(api);
        const data = await response.json();

        if (!data.status) {
            return reply(`❌ ${data.resultado}`);
        }

        const resposta = data?.resultado?.data?.[0]?.resposta;

        if (!resposta) {
            return reply('𝙵𝚊𝚕𝚑𝚊: 𝙰𝚙𝚒 𝚗ã𝚘 𝚛𝚎𝚝𝚘𝚛𝚗𝚘𝚞 𝚘𝚞 𝙺𝚎𝚢 𝚒𝚗𝚟á𝚕𝚒𝚍𝚊. 🤷‍♀️');
        }

        reply(
`👀 *${NomeDoBot} + Gpt*

🤔 - ${resposta}`
        );

    } catch (err) {
        console.error('Erro GPT:', err);
        reply(`❌ ${err.message}`);
    }
}
break;
                case 'usarnick': {

if (!q) return reply(`Exemplo:\n${prefix}usarnick 1`);

if (!nickTemp[sender])
return reply('❌ Gere nicks primeiro usando !nick.');

const numero = parseInt(q);

if (
isNaN(numero) ||
numero < 1 ||
numero > nickTemp[sender].length
)
return reply('❌ Número inválido.');

const escolhido =
nickTemp[sender][numero - 1];

reply(
`✅ Nick escolhido:\n\n${escolhido.result}\n\n🎨 Fonte: ${escolhido.name}`
);

delete nickTemp[sender];

}
break;
            case 'menuadm':
            case 'adm':
            if (!isGroup) return reply(enviar.msg.group);
            if (!isAdmin) return reply(enviar.msg.adm);
          try {
          reagir('🙅‍♀️');
          const menuAdm = menuadm(prefix);
            await sock.sendMessage(
    from,
    {
        image: { url: fotomenu },
        caption: menuAdm,
        mentions: [sender],
        contextInfo: getForwardContext({ forwardingScore: 100000 })
    },
    { quoted: selometa }
);
            } catch (e) {
            reagir('❌');
            console.log('Erro ao enviar o menu:', e)
            reply('❌ Erro ao enviar o menu');
            }
            break;
            case 'menulogos':
            case 'logos':
            if (!isGroup) return reply(enviar.msg.group);

          try {
          reagir('🎨');
          const menuLogos = menulogos(prefix, NomeDoBot);
            await sock.sendMessage(
    from,
    {
        image: { url: fotomenu },
        caption: menuLogos,
        mentions: [sender],
        contextInfo: getForwardContext({ forwardingScore: 100000 })
    },
    { quoted: selometa }
);
            } catch (e) {
            reagir('❌');
            console.log('Erro ao enviar o menu:', e)
            reply('❌ Erro ao enviar o menu');
            }
            break;
                case 'menurpg':
            case 'rpg':
            if (!isGroup) return reply(enviar.msg.group);

          try {
          reagir('✔');
          const menurpg = menuRPG(prefix);
            await sock.sendMessage(
    from,
    {
        image: { url: fotomenu },
        caption: menurpg,
        mentions: [sender],
        contextInfo: getForwardContext({ forwardingScore: 100000 })
    },
    { quoted: selometa }
);
            } catch (e) {
            reagir('❌');
            console.log('Erro ao enviar o menu:', e)
            reply('❌ Erro ao enviar o menu');
            }
            break;
                case 'fazerpix': {
reply(
`💰 *PAGAMENTO DO ALUGUEL*

🔑 *Chave PIX:*
${chavepix}

📱 *Contato do dono:*
wa.me/${numerodono}

📋 *PASSO A PASSO:*

1- Faça o pagamento referente ao seu aluguel.

2- Envie o comprovante.

3- Mande o comprovante + o PIX utilizado + o ID ou link do grupo para o número do dono.

4- Aguarde a confirmação e a liberação do bot no grupo.

✅ Assim que o pagamento for confirmado, seu aluguel será ativado.`
);
}
break;
case 'local': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!q) return reply(`Use: ${prefix}local <nome do lugar>\nEx: ${prefix}local Nova York`);

    const axios = require('axios');

    try {
        let query = args.join(" ");

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=1`;

        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'ToshiruzBot-V1 (contato: email@dominio.com)' 
            }
        });

        if (!res.data || res.data.length === 0)
            return reply("❌ Nenhum resultado encontrado.");

        const lugar = res.data[0];

        const texto = `
📍 *Resultado da Busca*
🔎 *${query}*

🌍 *Endereço:* ${lugar.display_name}
📌 *Latitude:* ${lugar.lat}
📌 *Longitude:* ${lugar.lon}

🗺️ *OpenStreetMap detectou:*
- País: ${lugar.address.country || "—"}
- Estado: ${lugar.address.state || "—"}
- Cidade: ${lugar.address.city || lugar.address.town || lugar.address.village || "—"}

🔗 Mapa:
https://www.openstreetmap.org/?mlat=${lugar.lat}&mlon=${lugar.lon}#map=12/${lugar.lat}/${lugar.lon}
`;

        await sock.sendMessage(from, {
            text: texto,
            mentions: [sender]
        }, { quoted: selometa });

    } catch (err) {
        console.error(err);
        reply("❌ Erro ao buscar localização.");
    }
}
break;
case 'gerarimg': {
if (!isGroup) return reply(enviar.msg.group);
 if (!q) return reply(
`🖼️ Envie um texto para gerar a imagem\n\nEx:\n${prefix}gerarimage gato astronauta realista`
 )
 
reply('🎨 Gerando imagem com IA, aguarde...')

try {
const prompt = encodeURIComponent(q)
const imgUrl = `https://image.pollinations.ai/prompt/${prompt}`

 await sock.sendMessage(from, {
 image: { url: imgUrl },
 caption: `🖼️ Imagem gerada com IA\n\n📝 Prompt: ${q}`
 }, { quoted: selometa })

 } catch (err) {
 console.error(err)
 reply('Erro ao gerar a imagem...')
 }
}
break
                case "update": {

if (!isDono) return;

reply("🔄 Verificando atualização...");

const resultado = await atualizarBot();

reply(resultado.mensagem);

if (resultado.status) {

    reply("♻ Reiniciando...");

    setTimeout(() => {
        process.exit(0);
    }, 3000);

}

}
break;
            case 'menudown':
            case 'down':
            if (!isGroup) return reply(enviar.msg.group);

          try {
          reagir('📱');
          const menuDown = menudown(prefix);
            await sock.sendMessage(
    from,
    {
        image: { url: fotomenu },
        caption: menuDown,
        mentions: [sender],
        contextInfo: getForwardContext({ forwardingScore: 100000 })
    },
    { quoted: selometa }
);
            } catch (e) {
            reagir('❌');
            console.log('Erro ao enviar o menu:', e)
            reply('❌ Erro ao enviar o menu');
            }
            break;
            case 'sigma': {
    if (!isGroup) return reply(enviar.msg.group);

    const mencionado = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const respondido = info.message?.extendedTextMessage?.contextInfo?.participant;
    const alvo = mencionado || respondido || sender;

    const porcentagem = Math.floor(Math.random() * 101);

    const imgSigmaPath = './media/temp/sigma.jpg';
    const imgBuffer = fs.readFileSync(imgSigmaPath);

    await sock.sendMessage(from, { text: `☠️ Analisando sua porcentagem de sigma, aguarde...` }, { quoted: selometa });

    await sock.sendMessage(from, {
        image: imgBuffer,
        caption: `Se liga o quanto cê é sigma, @${alvo.split('@')[0]}: *${porcentagem}%*
${porcentagem >= 110 ? "🦇 Dominante supremo, sem defeitos..." :
porcentagem >= 80 ? "🦍 Dominante supremo." :
porcentagem >= 50 ? "😎 Sigma nato, confiança absurda." :
porcentagem >= 20 ? "🙂 Tem traços sigma, mas precisa treinar." :
"💀 Pouco sigma... precisa melhorar urgentemente."}
`,
        mentions: [alvo]
    }, { quoted: selometa });
}
break;
case 'bemvindo': {

if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isAdmin) return reply('❌ Apenas administradores.');

const path = './assets/bemvindo.json';

let db = fs.existsSync(path)
? JSON.parse(fs.readFileSync(path))
: {};

if (!db[from]) {
db[from] = {
ativo: true,
legenda: "👋 Olá {membro}\n\nBem-vindo(a) ao grupo {grupo}"
};
}

const opcao = q?.toLowerCase();

if (opcao === 'on') {
db[from].ativo = true;
} else if (opcao === 'off') {
db[from].ativo = false;
} else {
return reply(
`⚙️ Sistema de boas-vindas

${prefix}bemvindo on
${prefix}bemvindo off`
);
}

fs.writeFileSync(path, JSON.stringify(db, null, 2));

reply(
`✅ Bem-vindo ${db[from].ativo ? 'ativado' : 'desativado'}`
);

}
break;
            case 'destrava': {
            if (!isGroup) return reply(enviar.msg.group);
            if (!isAdmin) return reply(enviar.msg.adm);
            if (!isBotAdmin) return reply(enviar.msg.botadm)
            const { destrava } = require('./dono/destrava.js');
            const destravar = destrava();
            reply('⚡ Enviando destrava...');
            await sock.sendMessage(from, { text: destravar }, { quoted: info });
            break;
            }
case 'menufig':
case 'fig':
       if (!isGroup) return reply(enviar.msg.group);
          try {
          reagir('🌟');
          const menuFig = menufig(prefix, NomeDoBot);
            await sock.sendMessage(
    from,
    {
        image: { url: fotomenu },
        caption: menuFig,
        mentions: [sender],
        contextInfo: getForwardContext({ forwardingScore: 100000 })
    },
    { quoted: selometa }
);
            } catch (e) {
            reagir('❌');
            console.log('Erro ao enviar o menu:', e)
            reply('❌ Erro ao enviar o menu');
            }
            break;
case 'totag': {
    if (!isGroup)
        return reply('❌ Apenas em grupos.');

    if (!isAdmin)
        return reply('❌ Apenas administradores.');

    if (!isBotAdmin)
        return reply('❌ Preciso ser administrador.');

    const metadata =
        await getGroupMetadataFast(sock, from);

    const membros =
        metadata.participants.map(
            p => p.id
        );

    let texto = '';

    if (quoted) {

        if (quoted.conversation) {

            texto = quoted.conversation;

        } else if (
            quoted.extendedTextMessage?.text
        ) {

            texto =
                quoted.extendedTextMessage.text;

        } else if (
            quoted.imageMessage?.caption
        ) {

            texto =
                quoted.imageMessage.caption;

        } else if (
            quoted.videoMessage?.caption
        ) {

            texto =
                quoted.videoMessage.caption;

        } else {

            return reply(
                '❌ A mensagem marcada não possui texto.'
            );

        }

    } else {

        texto =
            q ||
            '📢 Marcação geral';

    }

    await sock.sendMessage(
        from,
        {
            text: texto,
            mentions: membros
        },
        {
            quoted: info
        }
    );

}
break;
                case 'limparqr': {
try {
if(!isDono) return reply('Apenas o dono.');
const fs = require('fs');
const limparPasta = (caminho) => {
fs.readdir(caminho, (err, arquivos) => {
if (err) {
console.error('Erro ao ler os arquivos da pasta:', err)
return
}

const arquivosDeletados = arquivos.filter((arquivo) => {
return /sender|pre-key|session/i.test(arquivo)
})

arquivosDeletados.forEach((arquivo) => {
fs.unlink(`${caminho}/${arquivo}`, (err) => {
if (err) {
console.error(`Erro ao deletar o arquivo ${arquivo}:`, err)
return
}
})
})

reply(`*${arquivosDeletados.length} ғᴏʀᴀᴍ ᴅᴇʟᴇᴛᴀᴅᴏs ᴄᴏᴍ sᴜᴄᴇssᴏ ✅*`)
})
}

await limparPasta('./media/qr-code')

} catch(e) {
console.log(e)
await reply(mess.error())
}
break
}
                case 'limpar': {

if (!isDono) return reply('Apenas o dono.');

try {

    const removidos = await limparBancoPorGrupos(sock, [
        goldsPath,
        userPetsPath
        // adicione outros json aqui
    ]);

    reply(
`🧹👀 *𝙻𝚒𝚖𝚙𝚎𝚣𝚊 𝚏𝚎𝚒𝚝𝚊!*

🗑️ *𝚃𝚘𝚝𝚊𝚕 𝚛𝚎𝚖𝚘𝚟𝚒𝚍𝚘:* ${removidos}`
    );

} catch (err) {
    console.error(err);
    reply('Erro ao limpar.');
}

}
break;
                case 'sports':
case 'esportes': {

try {

await sock.sendMessage(from, {
react: {
text: '⚽',
key: info.key
}
});

const res = await fetchJson(
`https://yuta-apis.xyz/api/noticias/esportes?apitoken=${TOKEN}`
);

if (!res?.status)
return reply('❌*𝙽ã𝚘 𝚏𝚘𝚒 𝚙𝚘𝚜𝚜í𝚟𝚎𝚕 𝚌𝚘𝚗𝚜𝚞𝚕𝚝𝚊𝚛 𝚗𝚘𝚝í𝚌𝚒𝚊𝚜.*');

const noticias = res.result || [];

if (!noticias.length)
return reply('❌ *𝙽𝚎𝚗𝚑𝚞𝚖𝚊 𝚗𝚘𝚝í𝚌𝚒𝚊 𝚏𝚘𝚒 𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚊𝚍𝚊.*');

let texto = `⚽ *Ú𝚕𝚝𝚒𝚖𝚊𝚜 𝚗𝚘𝚝í𝚌𝚒𝚊𝚜 𝚍𝚘𝚜 𝚎𝚜𝚙𝚘𝚛𝚝𝚎𝚜*\n\n`;

for (let i = 0; i < Math.min(10, noticias.length); i++) {

const n = noticias[i];

texto += `🏆 *${n.titulo || n.title || 'Sem título'}*\n`;

if (n.descricao || n.description)
texto += `📝 ${n.descricao || n.description}\n`;

if (n.link || n.url)
texto += `🔗 ${n.link || n.url}\n`;

texto += `\n━━━━━━━━━━━━━━\n\n`;

}

await sock.sendMessage(
from,
{
text: texto
},
{
quoted: info
}
);

await sock.sendMessage(from, {
react: {
text: '✅',
key: info.key
}
});

} catch (e) {

console.log('*𝙴𝚛𝚛𝚘 𝚜𝚙𝚘𝚛𝚝𝚜*', e);

reply('❌ *𝙴𝚛𝚛𝚘 𝚊𝚘 𝚋𝚞𝚜𝚌𝚊𝚛 𝚗𝚘𝚝í𝚌𝚒𝚊𝚜 𝚎𝚜𝚙𝚘𝚛𝚝𝚒𝚟𝚊𝚜.*');

}

}
break;
                case 'instagram':
case 'ig': {

try {

if (!q)
return reply('📸 *𝙴𝚗𝚟𝚒𝚎 𝚞𝚖 𝚕𝚒𝚗𝚔 𝚍𝚘 𝙸𝚗𝚜𝚝𝚊𝚐𝚛𝚊𝚖*.');

await sock.sendMessage(from, {
react: { text: '⌛', key: info.key }
});

const res = await fetchJson(
`https://yuta-apis.xyz/api/downloads/instagram-video?apitoken=${TOKEN}&url=${encodeURIComponent(q)}`
);
const dados = res.result[0];

await sock.sendMessage(
from,
{
video: {
url: dados.video
},
caption:
`📸 *𝚅í𝚍𝚎𝚘 𝚋𝚊𝚒𝚡𝚊𝚍𝚘 𝚟𝚒𝚊 - ${NomeDoBot}*\n\n🔗 ${q}`
},
{
quoted: info
}
);

await sock.sendMessage(from, {
react: { text: '✅', key: info.key }
});

} catch (e) {

console.log('Erro instagram:', e);

reply('❌ Erro ao baixar vídeo do Instagram.');

}

}
break;
                case 'cacapalavras': {

const palavra =
palavrasCaca[Math.floor(Math.random() * palavrasCaca.length)];

const embaralhada = palavra
.split('')
.sort(() => Math.random() - 0.5)
.join('');

cacaPalavras[sender] = palavra;

reply(
`🔎 CAÇA-PALAVRAS\n\n` +
`Descubra a palavra:\n` +
`🔤 ${embaralhada}\n\n` +
`Use:\n!responder palavra`
);

}
break;
                case 'responder': {

if (!cacaPalavras[sender])
return reply('Você não possui nenhum caça-palavras ativo.');

const resposta = q.trim().toLowerCase();
const correta = cacaPalavras[sender].toLowerCase();

if (resposta === correta) {

addGold(sender, 10);

delete cacaPalavras[sender];

reply(
`🎉 Você acertou!\n\n` +
`💰 +10 Golds\n` +
`🏦 Saldo atual: ${getGold(sender)}`
);

} else {

reply('❌ Resposta incorreta.');

}

}
break;
case 'gemini': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💫 *Escreva algo após o comando!*\nExemplo: ${prefix}gemini Bom dia`);

        const esperando = await reagir('🪄');

        const fetch = (await import('node-fetch')).default;
        const apiUrl = `https://neon-apis.online/api/gemini?texto=${encodeURIComponent(q)}`;
        const res = await fetch(apiUrl);

        if (!res.ok) return reply('❌ Erro ao acessar a API.');

        const data = await res.json();

        // Verifica se existe a chave "resposta"
        if (!data || !data.resposta)
            return reply('⚠️ A API não retornou nenhuma resposta.');

        // Envia a resposta da IA
        await sock.sendMessage(from, { text: data.resposta }, { quoted: info });

        // Apaga a mensagem "Consultando..."
        await sock.sendMessage(from, { delete: esperando.key });

    } catch (e) {
        console.log(e);
        reply('❌ Ocorreu um erro ao buscar a resposta da IA.');
    }
}
break;
                case 'fazendeiro': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const fazendeiroPath = './assets/fazendeiro.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let fazendeiro = fs.existsSync(fazendeiroPath)
        ? JSON.parse(fs.readFileSync(fazendeiroPath))
        : {};

    const cooldown = 8 * 60 * 60 * 1000;
    const recompensa = 35;

    if (!golds[sender]) golds[sender] = { gold: 0 };

    const agora = Date.now();

    if (fazendeiro[sender]) {
        const restante = cooldown - (agora - fazendeiro[sender]);

        if (restante > 0) {
            const horas = Math.floor(restante / 3600000);
            const minutos = Math.floor((restante % 3600000) / 60000);

            return reply(`🚜 Você já trabalhou na fazenda hoje!\n\n⏳ Aguarde ${horas}h ${minutos}min para colher novamente.`);
        }
    }

    golds[sender].gold += recompensa;
    fazendeiro[sender] = agora;

    fs.writeFileSync(goldsPath, JSON.stringify(golds, null, 2));
    fs.writeFileSync(fazendeiroPath, JSON.stringify(fazendeiro, null, 2));

    if (!fs.existsSync('./media/temp/fazendeiro.jpg'))
        return reply('❌ Imagem fazendeiro.jpg não encontrada.');

    await sock.sendMessage(from, {
        image: fs.readFileSync('./media/temp/fazendeiro.jpg'),
        caption: `🚜 *DIA DE COLHEITA!*

🌾 Você trabalhou na fazenda e recebeu:

💰 +${recompensa} Golds

🏦 Saldo atual: ${golds[sender].gold} Golds

⏳ Volte em 8 horas para colher novamente.`
    }, {
        quoted: info
    });
}
break;

case 'capinar': {
    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const inventarioPath = './assets/inventario.json';
    const capinarPath = './assets/capinar.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let inventario = fs.existsSync(inventarioPath)
        ? JSON.parse(fs.readFileSync(inventarioPath))
        : {};

    let capinar = fs.existsSync(capinarPath)
        ? JSON.parse(fs.readFileSync(capinarPath))
        : {};

    if (
        !inventario[sender] ||
        !inventario[sender].itens ||
        !inventario[sender].itens.includes('Enxada')
    ) {
        return reply(
            '🌱 Você precisa comprar uma *Enxada*.\n\nUse: !loja'
        );
    }

    if (!golds[sender]) {
        golds[sender] = {
            gold: 0
        };
    }

    const cooldown = 3 * 60 * 60 * 1000;
    const agora = Date.now();

    if (!capinar[sender]) {
        capinar[sender] = {
            usos: 0,
            ultimoReset: agora
        };
    }

    if (
        agora - capinar[sender].ultimoReset >= cooldown
    ) {
        capinar[sender].usos = 0;
        capinar[sender].ultimoReset = agora;
    }

    if (capinar[sender].usos >= 3) {

        const restante =
            cooldown -
            (agora - capinar[sender].ultimoReset);

        const horas =
            Math.floor(restante / 3600000);

        const minutos =
            Math.floor(
                (restante % 3600000) / 60000
            );

        return reply(
            `🌱 Você já usou suas 3 capinas!\n\n⏳ Aguarde ${horas}h ${minutos}min.`
        );
    }

    capinar[sender].usos++;

    const sorte = Math.random();

    let resultado;
    let recompensa;

    if (sorte <= 0.50) {

        resultado = '🌿 Mato Comum';

        recompensa =
            Math.floor(Math.random() * 21) + 10;

    } else if (sorte <= 0.80) {

        resultado = '🍀 Trevo Raro';

        recompensa =
            Math.floor(Math.random() * 41) + 30;

    } else if (sorte <= 0.95) {

        resultado = '🌻 Flor Dourada';

        recompensa =
            Math.floor(Math.random() * 81) + 70;

    } else {

        resultado = '💎 Raiz Lendária';

        recompensa =
            Math.floor(Math.random() * 151) + 150;
    }

    golds[sender].gold += recompensa;

    fs.writeFileSync(
        goldsPath,
        JSON.stringify(golds, null, 2)
    );

    fs.writeFileSync(
        capinarPath,
        JSON.stringify(capinar, null, 2)
    );

    await sock.sendMessage(
        from,
        {
            image: fs.readFileSync(
                './media/temp/capinar.jpg'
            ),

            caption:
`🌱 *CAPINA CONCLUÍDA!*

${resultado}

💰 Recompensa:
+${recompensa} Golds

📦 Usos:
${capinar[sender].usos}/3

🏦 Saldo:
${golds[sender].gold} Golds

⏳ As tentativas recarregam em 3 horas.`
        },
        {
            quoted: info
        }
    );
}
break;
case 'pescar': {
    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const inventarioPath = './assets/inventario.json';
    const pescarPath = './assets/pescar.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let inventario = fs.existsSync(inventarioPath)
        ? JSON.parse(fs.readFileSync(inventarioPath))
        : {};

    let pescar = fs.existsSync(pescarPath)
        ? JSON.parse(fs.readFileSync(pescarPath))
        : {};

    if (
        !inventario[sender] ||
        !inventario[sender].itens ||
        !inventario[sender].itens.includes('Vara de Pesca')
    ) {
        return reply(
            '🎣 Você precisa comprar uma *Vara de Pesca*.\n\nUse: !loja'
        );
    }

    if (!golds[sender]) {
        golds[sender] = {
            gold: 0
        };
    }

    const cooldown = 3 * 60 * 60 * 1000;
    const agora = Date.now();

    if (!pescar[sender]) {
        pescar[sender] = {
            usos: 0,
            ultimoReset: agora
        };
    }

    if (
        agora - pescar[sender].ultimoReset >= cooldown
    ) {
        pescar[sender].usos = 0;
        pescar[sender].ultimoReset = agora;
    }

    if (pescar[sender].usos >= 3) {

        const restante =
            cooldown -
            (agora - pescar[sender].ultimoReset);

        const horas =
            Math.floor(restante / 3600000);

        const minutos =
            Math.floor(
                (restante % 3600000) / 60000
            );

        return reply(
            `🎣 Você já usou suas 3 pescarias!\n\n⏳ Aguarde ${horas}h ${minutos}min.`
        );
    }

    pescar[sender].usos++;

    const sorte = Math.random();

    let peixe;
    let recompensa;

    if (sorte <= 0.50) {

        peixe = '🐟 Tilápia';

        recompensa =
            Math.floor(Math.random() * 21) + 10;

    } else if (sorte <= 0.80) {

        peixe = '🐠 Dourado';

        recompensa =
            Math.floor(Math.random() * 41) + 30;

    } else if (sorte <= 0.95) {

        peixe = '🦈 Tubarão';

        recompensa =
            Math.floor(Math.random() * 81) + 70;

    } else {

        peixe = '🐉 Peixe Lendário';

        recompensa =
            Math.floor(Math.random() * 151) + 150;
    }

    golds[sender].gold += recompensa;

    fs.writeFileSync(
        goldsPath,
        JSON.stringify(golds, null, 2)
    );

    fs.writeFileSync(
        pescarPath,
        JSON.stringify(pescar, null, 2)
    );

    await sock.sendMessage(
        from,
        {
            image: fs.readFileSync(
                './media/temp/pescar.jpg'
            ),

            caption:
`🎣 *PESCARIA CONCLUÍDA!*

${peixe}

💰 Recompensa:
+${recompensa} Golds

📦 Usos:
${pescar[sender].usos}/3

🏦 Saldo:
${golds[sender].gold} Golds

⏳ As tentativas recarregam em 3 horas.`
        },
        {
            quoted: info
        }
    );
}
break;
                case 'roubar': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
try {

const fs = require('fs');

const goldsPath = './assets/golds.json';
const roubosPath = './assets/roubar2.json';

let golds = fs.existsSync(goldsPath)
? JSON.parse(fs.readFileSync(goldsPath))
: {};

let roubos = fs.existsSync(roubosPath)
? JSON.parse(fs.readFileSync(roubosPath))
: {};

if (!quoted)
return reply(
`❌ Responda a mensagem da pessoa que deseja roubar.`
);

let alvo =
info.message?.extendedTextMessage?.contextInfo?.participant;

if (!alvo)
return reply('❌ Não consegui identificar a vítima.');

if (alvo === sender)
return reply('❌ Você não pode roubar a si mesmo.');

console.log('ALVO:', alvo);

// cria conta automaticamente se não existir
if (!golds[alvo]) {
golds[alvo] = {
gold: 100
};

fs.writeFileSync(
goldsPath,
JSON.stringify(golds, null, 2)
);
}

if (golds[alvo].gold <= 0)
return reply('❌ Essa pessoa está sem golds.');

if (!golds[sender]) {
golds[sender] = {
gold: 0
};
}

const agora = Date.now();

if (!roubos[sender]) {
roubos[sender] = {
tentativas: 0,
tempo: 0
};
}

if (roubos[sender].tentativas >= 3) {

const restante =
(2 * 60 * 60 * 1000) -
(agora - roubos[sender].tempo);

if (restante > 0) {

const horas =
Math.floor(restante / 3600000);

const minutos =
Math.floor((restante % 3600000) / 60000);

return reply(
`🚔 Você já usou suas 3 tentativas.

⏳ Aguarde ${horas}h ${minutos}m para tentar novamente.`
);

}

roubos[sender].tentativas = 0;
}

const sucesso = Math.random() < 0.6;

if (sucesso) {

const valor = Math.min(
golds[alvo].gold,
Math.floor(Math.random() * 100) + 20
);

golds[alvo].gold -= valor;
golds[sender].gold += valor;

roubos[sender].tentativas++;

if (roubos[sender].tentativas >= 3)
roubos[sender].tempo = agora;

fs.writeFileSync(
goldsPath,
JSON.stringify(golds, null, 2)
);

fs.writeFileSync(
roubosPath,
JSON.stringify(roubos, null, 2)
);

await sock.sendMessage(
from,
{
text:
`🦹 *ROUBO REALIZADO!*

💰 Valor roubado: ${valor} Golds

👤 Vítima:
@${alvo.split('@')[0]}

🏦 Seu saldo:
${golds[sender].gold} Golds

🎯 Tentativas:
${roubos[sender].tentativas}/3`,
mentions: [alvo]
},
{
quoted: info
}
);

} else {

const multa = Math.min(
golds[sender].gold,
Math.floor(Math.random() * 50) + 10
);

golds[sender].gold -= multa;

roubos[sender].tentativas++;

if (roubos[sender].tentativas >= 3)
roubos[sender].tempo = agora;

fs.writeFileSync(
goldsPath,
JSON.stringify(golds, null, 2)
);

fs.writeFileSync(
roubosPath,
JSON.stringify(roubos, null, 2)
);

await sock.sendMessage(
from,
{
text:
`🚔 *VOCÊ FOI PEGO!*

💸 Multa:
-${multa} Golds

🏦 Seu saldo:
${golds[sender].gold} Golds

🎯 Tentativas:
${roubos[sender].tentativas}/3`
},
{
quoted: info
}
);

}

} catch (e) {
console.log(e);
reply('❌ Erro ao executar o roubo.');
}
}
break;
                case 'lenhar': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const inventarioPath = './assets/inventario.json';
    const lenharPath = './assets/lenhar.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let inventario = fs.existsSync(inventarioPath)
        ? JSON.parse(fs.readFileSync(inventarioPath))
        : {};

    let lenhar = fs.existsSync(lenharPath)
        ? JSON.parse(fs.readFileSync(lenharPath))
        : {};

    if (
        !inventario[sender] ||
        !inventario[sender].itens ||
        !inventario[sender].itens.includes('Machado')
    ) {
        return reply(
            '🪵 Você precisa comprar um *Machado*.\n\nUse: !loja'
        );
    }

    if (!golds[sender]) {
        golds[sender] = {
            gold: 0
        };
    }

    const cooldown = 3 * 60 * 60 * 1000;
    const agora = Date.now();

    if (!lenhar[sender]) {
        lenhar[sender] = {
            usos: 0,
            ultimoReset: agora
        };
    }

    if (
        agora - lenhar[sender].ultimoReset >= cooldown
    ) {
        lenhar[sender].usos = 0;
        lenhar[sender].ultimoReset = agora;
    }

    if (lenhar[sender].usos >= 3) {

        const restante =
            cooldown -
            (agora - lenhar[sender].ultimoReset);

        const horas =
            Math.floor(restante / 3600000);

        const minutos =
            Math.floor(
                (restante % 3600000) / 60000
            );

        return reply(
            `🪵 Você já cortou lenha 3 vezes!\n\n⏳ Aguarde ${horas}h ${minutos}min.`
        );
    }

    lenhar[sender].usos++;

    const sorte = Math.random();

    let madeira;
    let recompensa;

    if (sorte <= 0.50) {

        madeira = '🌳 Madeira Comum';

        recompensa =
            Math.floor(Math.random() * 21) + 10;

    } else if (sorte <= 0.80) {

        madeira = '🌲 Madeira Resistente';

        recompensa =
            Math.floor(Math.random() * 41) + 30;

    } else if (sorte <= 0.95) {

        madeira = '🍁 Madeira Nobre';

        recompensa =
            Math.floor(Math.random() * 81) + 70;

    } else {

        madeira = '✨ Madeira Lendária';

        recompensa =
            Math.floor(Math.random() * 151) + 150;
    }

    golds[sender].gold += recompensa;

    fs.writeFileSync(
        goldsPath,
        JSON.stringify(golds, null, 2)
    );

    fs.writeFileSync(
        lenharPath,
        JSON.stringify(lenhar, null, 2)
    );

    await sock.sendMessage(
        from,
        {
            image: fs.readFileSync(
                './media/temp/lenhar.jpg'
            ),
            caption:
`🪵 *CORTE DE LENHA CONCLUÍDO!*

${madeira}

💰 Recompensa:
+${recompensa} Golds

📦 Usos:
${lenhar[sender].usos}/3

🏦 Saldo:
${golds[sender].gold} Golds

⏳ As tentativas recarregam em 3 horas.`
        },
        {
            quoted: info
        }
    );
}
break;
                case 'comercios': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
const fs = require('fs');

const comercios = JSON.parse(
fs.readFileSync('./assets/comercios.json')
);

let txt = '✨ *𝙽𝚘𝚜𝚜𝚘𝚜 𝙲𝚘𝚖é𝚛𝚌𝚒𝚘𝚜*\n';

comercios.forEach(c => {

txt += `🆔 ${c.id}\n`;
txt += `🏢 ${c.nome}\n`;
txt += `💰 *𝙿𝚛𝚎ç𝚘𝚜*: ${c.preco}\n`;
txt += `📈 *𝙻𝚞𝚌𝚛𝚘*: ${c.lucro}\n\n`;

});

reply(txt);

}
break;
                case 'comprarcomercio': {

const fs = require('fs');

const comercios = JSON.parse(
fs.readFileSync('./assets/comercios.json')
);

let golds = JSON.parse(
fs.readFileSync('./assets/golds.json')
);

let userComercios =
fs.existsSync('./assets/usercomercios.json')
?
JSON.parse(
fs.readFileSync('./assets/usercomercios.json')
)
:
{};

const id = Number(args[0]);

if(!id)
return reply(
'Use:\n!comprarcomercio id'
);

const comercio =
comercios.find(c => c.id === id);

if(!comercio)
return reply('Comércio não encontrado.');

if(!golds[sender])
golds[sender] = { gold: 0 };

if(golds[sender].gold < comercio.preco)
return reply('Golds insuficientes.');

if(!userComercios[sender]) {

userComercios[sender] = {
comercios: []
};

}

const possui =
userComercios[sender]
.comercios
.find(c => c.id === comercio.id);

if(possui)
return reply(
'Você já possui esse comércio.'
);

golds[sender].gold -= comercio.preco;

userComercios[sender]
.comercios
.push({
...comercio,
ultimoResgate: Date.now()
});

fs.writeFileSync(
'./assets/golds.json',
JSON.stringify(golds,null,2)
);

fs.writeFileSync(
'./assets/usercomercios.json',
JSON.stringify(userComercios,null,2)
);

reply(
`🏪 Comércio comprado!

${comercio.nome}

💰 Custou ${comercio.preco} Golds`
);

}
break;
                case 'resgatarcomercio': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );

const fs = require('fs');

let golds = JSON.parse(
fs.readFileSync('./assets/golds.json')
);

let userComercios =
JSON.parse(
fs.readFileSync('./assets/usercomercios.json')
);

if(
!userComercios[sender] ||
userComercios[sender].comercios.length === 0
){
return reply(
'Você não possui comércios.'
);
}

let total = 0;

for(
let comercio of
userComercios[sender].comercios
){

const agora = Date.now();

if(
agora - comercio.ultimoResgate
>= comercio.tempo
){

total += comercio.lucro;

comercio.ultimoResgate =
agora;

}

}

if(total <= 0)
return reply(
'⏳ Nenhum comércio pronto para coleta.'
);

if(!golds[sender])
golds[sender] = { gold: 0 };

golds[sender].gold += total;

fs.writeFileSync(
'./assets/golds.json',
JSON.stringify(golds,null,2)
);

fs.writeFileSync(
'./assets/usercomercios.json',
JSON.stringify(userComercios,null,2)
);

reply(
`💸 Você coletou ${total} Golds dos seus comércios!\n\n🏦 Saldo: ${golds[sender].gold}`
);

}
break;
                case 'meuscomercios': {
if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
const fs = require('fs');

const userComercios =
JSON.parse(
fs.readFileSync('./assets/usercomercios.json')
);

if (
!userComercios[sender] ||
userComercios[sender].comercios.length === 0
) {
return reply(
'🏪 Você não possui comércios.'
);
}

let txt =
'🏪 *SEUS COMÉRCIOS*\n\n';

let lucroTotal = 0;

userComercios[sender]
.comercios
.forEach((c, i) => {

lucroTotal += c.lucro;

txt +=
`${i + 1}. 🏢 ${c.nome}\n` +
`📈 Lucro: ${c.lucro} Golds\n\n`;

});

txt +=
`💰 Lucro total por coleta: ${lucroTotal} Golds`;

await sock.sendMessage(
from,
{
image: fs.readFileSync(
'./media/temp/comercios.jpg'
),
caption: txt
},
{
quoted: info
}
);

}
break;
                case 'minerar': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const inventarioPath = './assets/inventario.json';
    const minerarPath = './assets/minerar.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let inventario = fs.existsSync(inventarioPath)
        ? JSON.parse(fs.readFileSync(inventarioPath))
        : {};

    let minerar = fs.existsSync(minerarPath)
        ? JSON.parse(fs.readFileSync(minerarPath))
        : {};

    if (
        !inventario[sender] ||
        !inventario[sender].itens ||
        !inventario[sender].itens.includes('Picareta')
    ) {
        return reply(
            '⛏️ Você precisa comprar uma *Picareta*.\n\nUse: !loja'
        );
    }

    if (!golds[sender]) {
        golds[sender] = {
            gold: 0
        };
    }

    const cooldown = 3 * 60 * 60 * 1000; // 3 horas
    const agora = Date.now();

    if (!minerar[sender]) {
        minerar[sender] = {
            usos: 0,
            ultimoReset: agora
        };
    }

    // Reseta após 3 horas
    if (
        agora - minerar[sender].ultimoReset >= cooldown
    ) {
        minerar[sender].usos = 0;
        minerar[sender].ultimoReset = agora;
    }

    // Máximo 3 usos
    if (minerar[sender].usos >= 3) {

        const restante =
            cooldown -
            (agora - minerar[sender].ultimoReset);

        const horas =
            Math.floor(restante / 3600000);

        const minutos =
            Math.floor(
                (restante % 3600000) / 60000
            );

        return reply(
            `⛏️ Você já usou suas 3 minerações!\n\n⏳ Aguarde ${horas}h ${minutos}min.`
        );
    }

    minerar[sender].usos++;

    const sorte = Math.random();

    let mineral;
    let recompensa;

    if (sorte <= 0.50) {

        mineral = '🪨 Pedra';

        recompensa =
            Math.floor(Math.random() * 21) + 10;

    } else if (sorte <= 0.80) {

        mineral = '⛓️ Ferro';

        recompensa =
            Math.floor(Math.random() * 41) + 30;

    } else if (sorte <= 0.95) {

        mineral = '🥇 Ouro';

        recompensa =
            Math.floor(Math.random() * 81) + 70;

    } else {

        mineral = '💎 Diamante';

        recompensa =
            Math.floor(Math.random() * 151) + 150;
    }

    golds[sender].gold += recompensa;

    fs.writeFileSync(
        goldsPath,
        JSON.stringify(golds, null, 2)
    );

    fs.writeFileSync(
        minerarPath,
        JSON.stringify(minerar, null, 2)
    );

    await sock.sendMessage(
        from,
        {
            image: fs.readFileSync(
                './media/temp/minerar.jpg'
            ),

            caption:
`⛏️ *MINERAÇÃO CONCLUÍDA!*

${mineral}

💰 Recompensa:
+${recompensa} Golds

📦 Usos:
${minerar[sender].usos}/3

🏦 Saldo:
${golds[sender].gold} Golds

⏳ As tentativas recarregam em 3 horas.`
        },
        {
            quoted: info
        }
    );
}
break;
                case 'loja': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const loja = JSON.parse(
        fs.readFileSync('./assets/loja.json')
    );

    let texto = '🛒 *LOJA RPG*\n\n';

    loja.forEach(item => {
        texto += `${item.id} - ${item.emoji} ${item.nome}\n`;
        texto += `💰 ${item.preco} Golds\n\n`;
    });

    texto += '🛍️ Use:\n!compraritem número';

    reply(texto);
}
break;
                case 'compraritem': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const loja = JSON.parse(
        fs.readFileSync('./assets/loja.json')
    );

    const goldsPath = './assets/golds.json';
    const inventarioPath = './assets/inventario.json';

    let golds = JSON.parse(
        fs.readFileSync(goldsPath)
    );

    let inventario = fs.existsSync(inventarioPath)
        ? JSON.parse(fs.readFileSync(inventarioPath))
        : {};

    const id = Number(args[0]);

    if (!id)
        return reply(
            '🛒 Use:\n!compraritem número'
        );

    const item = loja.find(x => x.id === id);

    if (!item)
        return reply('❌ Item não encontrado.');

    if (!golds[sender])
        golds[sender] = { gold: 0 };

    if (golds[sender].gold < item.preco)
        return reply(
            `❌ Você precisa de ${item.preco} Golds.`
        );

    if (!inventario[sender]) {
        inventario[sender] = {
            itens: []
        };
    }

    if (
        inventario[sender].itens.includes(item.nome)
    ) {
        return reply(
            '❌ Você já possui este item.'
        );
    }

    golds[sender].gold -= item.preco;

    inventario[sender].itens.push(
        item.nome
    );

    fs.writeFileSync(
        goldsPath,
        JSON.stringify(golds, null, 2)
    );

    fs.writeFileSync(
        inventarioPath,
        JSON.stringify(inventario, null, 2)
    );

    reply(
`✅ ITEM COMPRADO

${item.emoji} ${item.nome}

💰 Custo: ${item.preco} Golds

🏦 Saldo atual:
${golds[sender].gold} Golds`
    );
}
break;
                case 'inventario': {
    const fs = require('fs');

    const inventarioPath =
        './assets/inventario.json';

    const inventario =
        fs.existsSync(inventarioPath)
            ? JSON.parse(
                  fs.readFileSync(inventarioPath)
              )
            : {};

    if (
        !inventario[sender] ||
        inventario[sender].itens.length === 0
    ) {
        return reply(
            '🎒 Você não possui itens.'
        );
    }

    let texto =
`🎒 *SEU INVENTÁRIO*

`;

    inventario[sender].itens.forEach(
        item => {
            texto += `• ${item}\n`;
        }
    );

    reply(texto);
}
break;
                case 'pix': {
    const fs = require('fs');

    const goldsPath = './assets/golds.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    const alvo =
        info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
        info.message?.extendedTextMessage?.contextInfo?.participant;

    const valor = parseInt(args[1]);

    if (!alvo)
        return reply('❌ Marque alguém.\n\nExemplo:\n!pix @usuario 500');

    if (isNaN(valor) || valor <= 0)
        return reply('❌ Informe um valor válido.');

    if (!golds[sender])
        golds[sender] = { gold: 0 };

    if (!golds[alvo])
        golds[alvo] = { gold: 0 };

    if (golds[sender].gold < valor)
        return reply('❌ Você não possui golds suficientes.');

    golds[sender].gold -= valor;
    golds[alvo].gold += valor;

    fs.writeFileSync(
        goldsPath,
        JSON.stringify(golds, null, 2)
    );

    await sock.sendMessage(from, {
        text:
`💸 *PIX REALIZADO*

👤 Destinatário: @${alvo.split('@')[0]}

💰 Valor: ${valor} Golds

🏦 Seu saldo: ${golds[sender].gold} Golds`,
        mentions: [alvo]
    }, {
        quoted: info
    });
}
break;
                case 'cofrinho': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const cofrinhoPath = './assets/cofrinho.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let cofrinho = fs.existsSync(cofrinhoPath)
        ? JSON.parse(fs.readFileSync(cofrinhoPath))
        : {};

    if (!golds[sender])
        golds[sender] = { gold: 0 };

    if (!cofrinho[sender])
        cofrinho[sender] = { gold: 0 };

    const acao = args[0];
    const valor = parseInt(args[1]);

    if (!acao)
        return reply(
`🐷 COFRINHO

!cofrinho guardar 500
!cofrinho sacar 500
!cofrinho saldo`
        );

    if (acao === 'guardar') {

        if (isNaN(valor) || valor <= 0)
            return reply('❌ Valor inválido.');

        if (golds[sender].gold < valor)
            return reply('❌ Você não possui golds suficientes.');

        golds[sender].gold -= valor;
        cofrinho[sender].gold += valor;

    } else if (acao === 'sacar') {

        if (isNaN(valor) || valor <= 0)
            return reply('❌ Valor inválido.');

        if (cofrinho[sender].gold < valor)
            return reply('❌ Você não possui esse valor no cofrinho.');

        cofrinho[sender].gold -= valor;
        golds[sender].gold += valor;

    } else if (acao === 'saldo') {

        return reply(
`🐷 COFRINHO

💰 Guardado: ${cofrinho[sender].gold} Golds`
        );

    }

    fs.writeFileSync(goldsPath, JSON.stringify(golds, null, 2));
    fs.writeFileSync(cofrinhoPath, JSON.stringify(cofrinho, null, 2));

    reply(
`🐷 COFRINHO ATUALIZADO

🏦 Carteira: ${golds[sender].gold} Golds

💰 Cofrinho: ${cofrinho[sender].gold} Golds`
    );
}
break;
                case 'daily': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const dailyPath = './assets/daily.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let daily = fs.existsSync(dailyPath)
        ? JSON.parse(fs.readFileSync(dailyPath))
        : {};

    const recompensa = 50;
    const cooldown = 24 * 60 * 60 * 1000;
    const agora = Date.now();

    if (!golds[sender])
        golds[sender] = { gold: 0 };

    if (daily[sender]) {
        const restante = cooldown - (agora - daily[sender]);

        if (restante > 0) {
            const horas = Math.floor(restante / 3600000);
            const minutos = Math.floor((restante % 3600000) / 60000);

            return reply(
                `🎁 Você já resgatou seu daily!\n\n⏳ Volte em ${horas}h ${minutos}min.`
            );
        }
    }

    golds[sender].gold += recompensa;
    daily[sender] = agora;

    fs.writeFileSync(goldsPath, JSON.stringify(golds, null, 2));
    fs.writeFileSync(dailyPath, JSON.stringify(daily, null, 2));

    await sock.sendMessage(from, {
        image: fs.readFileSync('./media/temp/daily.jpg'),
        caption:
`🎁 *DAILY RESGATADO!*

💰 Recompensa: +${recompensa} Golds

🏦 Saldo atual: ${golds[sender].gold} Golds

⏳ Volte amanhã para resgatar novamente.`
    }, {
        quoted: info
    });
}
break;
                case 'qrcode':
case 'qr': {
    if (!q)
        return reply(`𝚄𝚜𝚎 𝚎𝚜𝚝𝚎 𝚎𝚡𝚎𝚖𝚙𝚕𝚘: ${prefix}qrcode Meu texto aqui`);

    try {

        await sock.sendPresenceUpdate('composing', from);

        const qrUrl = `https://yuta-apis.xyz/api/geradores/qrcode?apitoken=${TOKEN}&text=${encodeURIComponent(q)}`;

        await sock.sendMessage(
            from,
            {
                image: { url: qrUrl },
                caption: `✅ 𝚀𝚛-𝚌𝚘𝚍𝚎 𝚐𝚎𝚛𝚊𝚍𝚘, 𝚜𝚎𝚞 𝚝𝚎𝚡𝚝𝚘: ${q}`
            },
            { quoted: info }
        );

    } catch (err) {
        console.error(err);
        reply('❌ Erro ao gerar o QR Code.');
    }
}
break;
case 'tiktok':
case 'tt': {
    if (!q)
        return reply(`𝚄𝚜𝚎 𝚎𝚜𝚝𝚎 𝚎𝚡𝚎𝚖𝚙𝚕𝚘: ${prefix}tiktok https://vm.tiktok.com/xxxxx`);

    try {

        await sock.sendPresenceUpdate('composing', from);

        const api = `https://yuta-apis.xyz/api/downloads/tiktok-video?apitoken=${TOKEN}&url=${encodeURIComponent(q)}`;

        const response = await fetch(api);
        const data = await response.json();

        console.log(data); // ajuda a debugar

        if (!data.status)
            return reply(data.resultado || '𝙴𝚛𝚛𝚘 𝚊𝚘 𝚋𝚊𝚒𝚡𝚊𝚛 𝚘 𝚟í𝚍𝚎𝚘.🤔');

        const videoUrl =
            data.resultado?.video ||
            data.resultado?.download ||
            data.resultado?.play ||
            data.resultado?.url;

        if (!videoUrl)
            return reply('𝙰 𝙰𝙿𝙸 𝚍𝚎𝚞 𝚎𝚛𝚛𝚘, 𝚟𝚎𝚓𝚊 𝚜𝚎𝚞 𝚝𝚘𝚔𝚎𝚗 𝚘𝚞 𝚘 𝚜𝚒𝚝𝚎');

        await sock.sendMessage(
            from,
            {
                video: { url: videoUrl },
                caption: `𝚃𝚒𝚔𝚃𝚘𝚔 𝚋𝚊𝚒𝚡𝚊𝚍𝚘 𝚟𝚒𝚊 - ${NomeDoBot}  !`
            },
            { quoted: info }
        );

    } catch (err) {
        console.error(err);
        reply('𝙴𝚛𝚛𝚘 𝚊𝚘 𝚋𝚊𝚒𝚡𝚊𝚛 𝚟í𝚍𝚎𝚘.😭');
    }
}
break;
                case 'oqueoque': {

const palavra = palavras[
Math.floor(Math.random() * palavras.length)
];

const embaralhada = palavra
.split('')
.sort(() => Math.random() - 0.5)
.join('');

jogoPalavras[sender] = palavra;

reply(
`🎮 O QUE É O QUE?\n\n` +
`Descubra a palavra:\n\n` +
`🔤 ${embaralhada}\n\n` +
`Use:\n!resposta palavra`
);

}
break;
                case 'resposta': {

if (!jogoPalavras[sender])
return reply('Você não iniciou um jogo.');

const resposta =
q.trim().toLowerCase();

const correta =
jogoPalavras[sender]
.toLowerCase();

if (resposta === correta) {

addGold(sender, 5);

delete jogoPalavras[sender];

reply(
`✅ Acertou!\n` +
`💰 +5 Golds\n\n` +
`Saldo: ${getGold(sender)}`
);

} else {

reply('❌ Palavra incorreta.');
}

}
break;
                case 'saldo': {

reply(
`💰 Seu saldo:\n\n` +
`${getGold(sender)} Golds`
);

}
break;
                case 'passearpet': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const petsPath = './assets/userpets.json';
    const passeioPath = './assets/passearpet.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let pets = fs.existsSync(petsPath)
        ? JSON.parse(fs.readFileSync(petsPath))
        : {};

    let passeio = fs.existsSync(passeioPath)
        ? JSON.parse(fs.readFileSync(passeioPath))
        : {};

    if (!pets[sender] || !pets[sender].pets || pets[sender].pets.length < 1)
        return reply('🐾 Você não possui nenhum pet.');

    if (!golds[sender])
        golds[sender] = { gold: 0 };

    const agora = Date.now();
    const cooldown = 2 * 60 * 60 * 1000;

    if (!passeio[sender]) {
        passeio[sender] = {
            usos: 0,
            ultimoReset: agora
        };
    }

    if (agora - passeio[sender].ultimoReset >= cooldown) {
        passeio[sender].usos = 0;
        passeio[sender].ultimoReset = agora;
    }

    if (passeio[sender].usos >= 2) {
        const restante = cooldown - (agora - passeio[sender].ultimoReset);

        const horas = Math.floor(restante / 3600000);
        const minutos = Math.floor((restante % 3600000) / 60000);

        return reply(
            `🐾 Seu pet já passeou 2 vezes.\n\n⏳ Aguarde ${horas}h ${minutos}min.`
        );
    }

    passeio[sender].usos++;

    const recompensa = Math.floor(Math.random() * 31) + 20;

    golds[sender].gold += recompensa;

    fs.writeFileSync(goldsPath, JSON.stringify(golds, null, 2));
    fs.writeFileSync(passeioPath, JSON.stringify(passeio, null, 2));

    const pet = pets[sender].pets[0].nome;

    await sock.sendMessage(from, {
        image: fs.readFileSync('./media/temp/passearpet.jpg'),
        caption:
`🐾 *PASSEIO CONCLUÍDO!*

🐶 ${pet} passeou pela cidade.

💰 Encontrou: ${recompensa} Golds

📦 Passeios usados: ${passeio[sender].usos}/2

🏦 Saldo atual: ${golds[sender].gold} Golds`
    }, {
        quoted: info
    });
}
break;
                case 'ranking': {

let db = carregarGold();

let ranking = Object.entries(db)
.sort((a, b) => b[1].gold - a[1].gold)
.slice(0, 10);

let texto = '🏆 TOP 10 RICOS\n\n';

ranking.forEach((u, i) => {
texto +=
`${i + 1}° ${u[0].split('@')[0]}\n` +
`💰 ${u[1].gold} Golds\n\n`;
});

reply(texto);

}
break;
                case 'investir': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const investimentosPath = './assets/investimentos.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let investimentos = fs.existsSync(investimentosPath)
        ? JSON.parse(fs.readFileSync(investimentosPath))
        : {};

    if (!golds[sender])
        golds[sender] = { gold: 0 };

    const valor = parseInt(args[0]);

    if (!valor || valor <= 0)
        return reply(
`📈 *INVESTIMENTOS*

Exemplo:
!investir 1000

Depois use:
!resgatar`
        );

    if (golds[sender].gold < valor)
        return reply('❌ Você não possui golds suficientes.');

    if (investimentos[sender])
        return reply(
'❌ Você já possui um investimento ativo.\nUse !resgatar quando o prazo terminar.'
        );

    golds[sender].gold -= valor;

    investimentos[sender] = {
        valor,
        inicio: Date.now()
    };

    fs.writeFileSync(
        goldsPath,
        JSON.stringify(golds, null, 2)
    );

    fs.writeFileSync(
        investimentosPath,
        JSON.stringify(investimentos, null, 2)
    );

    reply(
`📈 *INVESTIMENTO REALIZADO*

💰 Investido: ${valor} Golds

⏳ Prazo: 24 horas

🏦 Saldo atual: ${golds[sender].gold} Golds

Use !resgatar após 24 horas.`
    );
}
break;

case 'resgatar': {
    const fs = require('fs');

    const goldsPath = './assets/golds.json';
    const investimentosPath = './assets/investimentos.json';

    let golds = fs.existsSync(goldsPath)
        ? JSON.parse(fs.readFileSync(goldsPath))
        : {};

    let investimentos = fs.existsSync(investimentosPath)
        ? JSON.parse(fs.readFileSync(investimentosPath))
        : {};

    if (!investimentos[sender])
        return reply('❌ Você não possui nenhum investimento ativo.');

    if (!golds[sender])
        golds[sender] = { gold: 0 };

    const investimento = investimentos[sender];

    const tempoNecessario = 24 * 60 * 60 * 1000;
    const passou = Date.now() - investimento.inicio;

    if (passou < tempoNecessario) {

        const restante = tempoNecessario - passou;

        const horas = Math.floor(restante / 3600000);
        const minutos = Math.floor((restante % 3600000) / 60000);

        return reply(
`⏳ Seu investimento ainda está rendendo.

Faltam ${horas}h ${minutos}min para resgatar.`
        );
    }

    const lucro = Math.floor(
        investimento.valor *
        (Math.random() * 0.20 + 0.10)
    );

    const total = investimento.valor + lucro;

    golds[sender].gold += total;

    delete investimentos[sender];

    fs.writeFileSync(
        goldsPath,
        JSON.stringify(golds, null, 2)
    );

    fs.writeFileSync(
        investimentosPath,
        JSON.stringify(investimentos, null, 2)
    );

    reply(
`📈 *INVESTIMENTO CONCLUÍDO*

💰 Investido: ${investimento.valor}

📊 Lucro: ${lucro}

🏦 Recebido: ${total} Golds

💳 Saldo atual: ${golds[sender].gold} Golds`
    );
}
break;
case 'gerarcpf':
case 'cpf': {
if (!isGroup) return reply(enviar.msg.group)
    const novoCPF = gerarCPF();
    await sock.sendMessage(from, {
        text: `🧾 *CPF Gerado com Sucesso!*\n\n👉 ${novoCPF}`
    }, { quoted: selometa });

}
break;
case 'grupo': case 'group': {
try {
  if (!isGroup) return reply(enviar.msg.group);
  if (!isAdmin) return reply(enviar.msg.adm);
  if (!isBotAdmin) return reply(enviar.msg.botadm);

  const buttons = [
    { buttonId: `${prefix}gp a`, buttonText: { displayText: '🔓 Abrir Grupo' }, type: 1 },
    { buttonId: `${prefix}gp f`, buttonText: { displayText: '🔒 Fechar Grupo' }, type: 1 },
    { buttonId: ``, buttonText: { displayText: '✅ Aceitar participantes pendentes' }, type: 1 }
  ];

  const buttonMessage = {
    text: '❓ O que deseja que eu faça no grupo?',
    footer: NomeDoBot,
    buttons: buttons,
    headerType: 1
  };

  await sock.sendMessage(from, buttonMessage);
  } catch (e) {
  reply('Erro.');
  console.error(e);
  }
}
break;
case 'aceitar': {
try {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
    if (!isBotAdmin) return reply(enviar.msg.botadm);

    let req = await sock.groupRequestParticipantsList(from);

    if (!req) return reply("❗ Não foi possível obter os participantes pendentes.");

    let pendentes = [];

    // Suporte a diferentes formatos do Baileys-Pro
    if (Array.isArray(req)) pendentes = req;
    else if (Array.isArray(req.participants)) pendentes = req.participants;
    else if (Array.isArray(req.requests)) pendentes = req.requests;

    if (pendentes.length === 0)
        return reply("❗ Não há participantes pendentes.");

    const jids = pendentes.map(p => p.jid).filter(j => j);

    if (jids.length === 0)
        return reply("❗ Não foi possível encontrar os JIDs pendentes.");

    await sock.groupRequestParticipantsUpdate(from, jids, "approve");

    reply(`✅ *${jids.length} participante(s)* foram aceitos.`);

} catch (e) {
    reply("❗ Ocorreu um erro ao aceitar.");
    console.error(e);
}
}
break;
case 'recusar': {
try {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
    if (!isBotAdmin) return reply(enviar.msg.botadm);

    let req = await sock.groupRequestParticipantsList(from);

    if (!req) return reply("❗ Não foi possível obter os participantes pendentes.");

    let pendentes = [];

    // Suporte a diferentes retornos
    if (Array.isArray(req)) pendentes = req;
    else if (Array.isArray(req.participants)) pendentes = req.participants;
    else if (Array.isArray(req.requests)) pendentes = req.requests;

    if (pendentes.length === 0)
        return reply("❗ Não há participantes pendentes para recusar.");

    const jids = pendentes.map(p => p.jid).filter(j => j);

    if (jids.length === 0)
        return reply("❗ Não foi possível encontrar os JIDs pendentes.");

    await sock.groupRequestParticipantsUpdate(from, jids, "reject");

    reply(`❌ *${jids.length} participante(s)* foram recusados.`);

} catch (e) {
    reply("❗ Ocorreu um erro ao recusar.");
    console.error(e);
}
}
break;
case 'tomp3': {
    if (!isGroup) return reply(enviar.msg.group);

    // Verifica se respondeu um vídeo
    const quotedMsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage; 
    const { exec } = require('child_process');
    if (!quotedMsg || !quotedMsg.videoMessage)
        return reply('🎬 Responda um *vídeo* para converter em MP3!');

    try {
        // Baixa o vídeo
        reagir('💬');
        reply('✨ Transformando vídeo em áudio...');
        const buffer = await downloadMediaMessage(
            { message: quotedMsg },
            'buffer',
            { reuploadRequest: sock }
        );

        const input = './media/tomp3_input.mp4';
        const output = './media/tomp3_output.mp3';

        // Salva o vídeo temporário
        writeFileSync(input, buffer);

        // Converte para MP3
        exec(`ffmpeg -i ${input} -vn -acodec libmp3lame ${output}`, async (err) => {
            if (err) {
                console.error('FFmpeg error:', err);
                return reply('❌ Erro ao converter o vídeo para MP3.');
            }

            // Lê o arquivo final
            const audio = readFileSync(output);

            // Envia o MP3
            reagir('✅');
            await sock.sendMessage(from, {
                audio,
                mimetype: 'audio/mpeg'
            });

            // Apaga arquivos para não lotar a pasta
            try {
                unlinkSync(input);
                unlinkSync(output);
            } catch {}

        });

    } catch (e) {
        console.error(e);
        reply('❌ Ocorreu um erro ao processar o áudio.');
    }

}
break;
case 'criador':
if (!isGroup) return reply(enviar.msg.group);
sock.sendMessage(
    from,
    { 
        text: `💖 Oii, ${info.pushName}! Aqui estão os números:\n\nCriador: +55 83 9176-2245\nSub-dono: +55 13 9622-9058\n`, 
        footer: NomeDoBot 
    }, { quoted: selometa });
break;
                case 'divmsg':
case 'div': {
    if (!isGroup) return;
    if (!isDono) return;

    if (!args.length) return;

    const textoCompleto = args.join(' ');
    if (!textoCompleto.includes('|')) return;

    const [texto, quantidade] = textoCompleto.split('|').map(v => v.trim());
    const qtd = parseInt(quantidade);

    if (!texto || isNaN(qtd) || qtd <= 0 || qtd > 10) return;

    try {
        await reagir(from, '💸');

        const metadata = await getGroupMetadataFast(sock, from);
        const participantes = metadata.participants.map(p => p.id);

        for (let i = 0; i < qtd; i++) {
            await sock.relayMessage(from, {
                requestPaymentMessage: {
                    currencyCodeIso4217: 'BRL',
                    amount1000: 9999999000,
                    requestFrom: '0@s.whatsapp.net',
                    noteMessage: {
                        extendedTextMessage: {
                            text: texto,
                            contextInfo: {
                                mentionedJid: participantes
                            }
                        }
                    },
                    expiryTimestamp: 0,
                    amount: {
                        value: 9999999,
                        offset: 3,
                        currencyCode: 'BRL'
                    }
                }
            }, {});
            
            await delay(2000);
        }

        await reagir(from, '✅');

    } catch (e) {
        console.log('[CASE DIV ERRO]', e.message);
        await reagir(from, '❌');
    }
}
break;
                case 'rg_aluguel': {
    if (!isDono) return reply("Apenas o dono.");

    if (!isGroup) return reply("Use em um grupo.");

    if (!args[0]) return reply("Exemplo:\nrg_aluguel 30");

    let dias = Number(args[0]);
    if (isNaN(dias)) return reply("Informe os dias.");

    let db = carregarAluguel();

    db.push({
        id: from,
        nome: groupMetadata.subject,
        expira: Date.now() + (dias * 86400000)
    });

    salvarAluguel(db);

    reply(`✅ Grupo registrado por ${dias} dias.`);
}
break;
            case 'adotarpet': {
                if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    let db = getDB();

    if (!db[sender]) {
        db[sender] = { pets: [] };
    }

    let tem = db[sender].pets.find(p => p.id === 1);

    if (tem) return reply("❌ Você já adotou seu pet inicial.");

    db[sender].pets.push({
        id: 1,
        nome: "Doguinho",
        raridade: "comum",
        valor: 5
    });

    fs.writeFileSync('./assets/userpets.json', JSON.stringify(db, null, 2));

    return reply("🐾 Você adotou seu primeiro pet: Doguinho!");
}
break;
                
                case 'listapets': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    let pets = JSON.parse(fs.readFileSync('./assets/pet.json'));

    if (!pets || pets.length === 0)
        return reply("❌ Nenhum pet encontrado.");

    let txt = `🐾 *LISTA DE PETS DISPONÍVEIS*\n\n`;

    pets.forEach(p => {
        txt += `🐶 ${p.nome}\n`;
        txt += `💰 Preço: ${p.preco}\n`;
        txt += `⭐ Raridade: ${p.raridade}\n\n`;
    });

    return reply(txt);
}
break;
                case 'meuspets': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    const fs = require('fs');

    const userPetsPath = './assets/userpets.json';

    let userPets = fs.existsSync(userPetsPath)
        ? JSON.parse(fs.readFileSync(userPetsPath))
        : {};

    if (!userPets[sender] || !userPets[sender].pets || userPets[sender].pets.length === 0) {
        return reply('🐾 Você não possui nenhum pet.');
    }

    let texto = '🐾 *SEUS PETS*\n\n';

    userPets[sender].pets.forEach((pet, i) => {
        texto += `*${i + 1}.* ${pet.nome}\n`;
        
        if (pet.raridade)
            texto += `⭐ Raridade: ${pet.raridade}\n`;

        if (pet.valor)
            texto += `💰 Valor: ${pet.valor} golds\n`;

        texto += '\n';
    });

    reply(texto);
}
break;
                case 'comprarpet': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
                    const fs = require('fs');
    const pets = JSON.parse(fs.readFileSync('./assets/pet.json'));
    const golds = JSON.parse(fs.readFileSync('./assets/golds.json'));
    let db = getDB();
    let pet = pets.find(p =>
        p.nome.toLowerCase() === q?.toLowerCase() || p.id == q
    );

    if (!pet) return reply("❌ Pet não encontrado!");

    if (!golds[sender]) golds[sender] = { gold: 0 };
    if (!db[sender]) db[sender] = { pets: [] };

    if (golds[sender].gold < pet.preco)
        return reply("❌ Gold insuficiente!");

    if (db[sender].pets.find(p => p.id == pet.id))
        return reply("⚠️ Você já tem esse pet!");

    db[sender].pets.push({
        id: pet.id,
        nome: pet.nome,
        raridade: pet.raridade,
        valor: pet.preco
    });

    golds[sender].gold -= pet.preco;

    fs.writeFileSync('./assets/userpets.json', JSON.stringify(db, null, 2));
    fs.writeFileSync('./assets/golds.json', JSON.stringify(golds, null, 2));

    return reply(`🐾 Você comprou ${pet.nome}!`);
}
break;
                case 'venderpet': {
    let db = getDB();

    if (!db[sender] || !db[sender].pets.length)
        return reply("❌ Você não tem pets.");

    let index = parseInt(q) - 1;

    if (isNaN(index) || !db[sender].pets[index])
        return reply("❌ Pet inválido.");

    let pet = db[sender].pets[index];

    let golds = JSON.parse(fs.readFileSync('./assets/golds.json'));

    if (!golds[sender]) golds[sender] = { gold: 0 };

    let valor = Math.floor(pet.valor / 2);

    golds[sender].gold += valor;

    db[sender].pets.splice(index, 1);

    fs.writeFileSync('./assets/userpets.json', JSON.stringify(db, null, 2));
    fs.writeFileSync('./assets/golds.json', JSON.stringify(golds, null, 2));

    return reply(`💸 Você vendeu ${pet.nome} por ${valor} golds!`);
}
break;
                case 'rank_pet': {
                    if (!isBotBn(from))
    return reply(
        (enviar.msg.bn)
    );
    let db = getDB();

    let all = [];

    Object.entries(db).forEach(([user, data]) => {
        (data.pets || []).forEach(p => {
            all.push({
                owner: user,
                nome: p.nome,
                valor: p.valor || 0
            });
        });
    });

    if (!all.length) return reply("❌ Nenhum pet encontrado.");

    all.sort((a, b) => b.valor - a.valor);

    let txt = `🏆 *RANK DE PETS MAIS RAROS*\n\n`;

    all.slice(0, 10).forEach((p, i) => {
        txt += `${i + 1}. ${p.nome} - 💰 ${p.valor}\n`;
    });

    return reply(txt);
}
break;
                case 'rm_aluguel': {
    if (!isDono) return;

    let db = carregarAluguel();

    db = db.filter(g => g.id != from);

    salvarAluguel(db);

    reply("✅ Grupo removido do aluguel.");
}
break;
                case 'veraluguel': {
    const aluguel = grupoAlugado(from);

    if (!aluguel)
        return reply("❌ Este grupo não possui aluguel ativo.");

    const restante = aluguel.expira - Date.now();

    const dias = Math.floor(restante / 86400000);
    const horas = Math.floor((restante % 86400000) / 3600000);

    reply(
`📋 ALUGUEL

Nome: ${aluguel.nome}
Dias restantes: ${dias}d ${horas}h`
    );
}
break;
                case 'listaaluguel': {
    if (!isDono) return;

    let db = carregarAluguel();

    if (db.length < 1)
        return reply("Nenhum grupo registrado.");

    let txt = "📋 LISTA DE ALUGUÉIS\n\n";

    db.forEach((g, i) => {
        const restante = g.expira - Date.now();
        const dias = Math.floor(restante / 86400000);

        txt += `${i + 1} • ${g.nome}\n`;
        txt += `ID: ${g.id}\n`;
        txt += `Restam: ${dias} dias\n\n`;
    });

    reply(txt);
}
break;
                case 'aluguelglobal': {
    if (!isDono) return;

    let db = carregarAluguel();

    let ativos = db.filter(g => g.expira > Date.now()).length;
    let vencidos = db.filter(g => g.expira <= Date.now()).length;

    reply(
`🌎 ALUGUEL GLOBAL

Ativos: ${ativos}
Vencidos: ${vencidos}
Total: ${db.length}`
    );
}
break;
                case 'criargp': {
    if (!isDono) return reply('❌ | Apenas o dono pode usar isso');

    if (!args.length) return reply(`📌 Use: ${prefix + command} <nome do grupo>`);

    const nomeGrupo = args.join(' ');

    try {
        await reagir(from, '⏳');

        // Cria grupo vazio
        const response = await sock.groupCreate(nomeGrupo, []);
        const groupId = response.gid || response.id;

        // Pega link do grupo
        const inviteCode = await sock.groupInviteCode(groupId);
        const groupLink = `https://chat.whatsapp.com/${inviteCode}`;

        await sock.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/qims6c.jpg' }, // troca a URL
            caption:
`✅ Grupo criado com sucesso!

📌 *Nome:* ${nomeGrupo}
🆔 *ID:* ${groupId}

🔗 *Link do grupo:*
${groupLink}`
        }, { quoted: info });

        await reagir(from, '✅');

    } catch (e) {
        console.log('[ERRO CRIAR GP]', e.message);
        await reagir(from, '❌');
        
        await sock.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/u4owqu.jpg' }, // troca a URL
            caption: '❌ | Ocorreu um erro ao criar o grupo.\n\n> WhatsApp limita criação de grupos por dia'
        }, { quoted: info });
    }
}
break;
case 'sair':
case 'sairgp': {
    if (!isGroup) return reply('❌ | Esse comando só funciona em grupos.');
    if (!isDono) return reply(mess.dono);

    try {
        await reagir(from, '👋');
        await reply('「😢」 Saindo do grupo...');

        // Se o bot for admin, sai mesmo assim
        await sock.groupLeave(from);

    } catch (e) {
        console.log('[CASE SAIR ERRO]', e.message);
        await reagir(from, '❌');

        if (e.data === 406) {
            return reply('❌ | Não estou nesse grupo.');
        }

        reply('❌ | Erro ao sair do grupo. ' + e.message);
    }
}
break;
case 'rm_aluguel': {
    let data = lerAluguel();
    if (!data.ativo) return reply(`*ᴏ ᴍᴏᴅᴏ ᴀʟᴜɢᴜᴇʟ ᴇsᴛᴀ́ ᴅᴇsᴀᴛɪᴠᴀᴅᴏ.* 🙅‍♂️`);
    if (!isDono) return reply('*Apenas o dono pode usar este comando*');

    if (args[0]) {
        const index = parseInt(args[0]) - 1;
        if (isNaN(index) || index < 0 || index >= data.grupos.length)
            return reply(`*ᴜsᴇ: ${prefix}rm_aluguel 1*`);

        const alvo = data.grupos[index];
        desativarAluguelGrupo(alvo.id);
        return reply(`*✅ ᴀʟᴜɢᴜᴇʟ ᴅᴏ ɢʀᴜᴩᴏ ʀᴇᴍᴏᴠɪᴅᴏ ᴄᴏᴍ ꜱᴜᴄᴇꜱꜱᴏ*`);
    }

    if (!isGroup) return reply('*Este comando só funciona em grupos*');
    const grupo = data.grupos.find(g => g.id === from);
    if (!grupo) return reply(`*ᴇssᴇ ɢʀᴜᴘᴏ ɴᴀ̃ᴏ ᴇsᴛᴀ́ ᴀʟᴜɢᴀᴅᴏ. 🤷‍♂️*`);

    desativarAluguelGrupo(from);
    reply(`*✅ ᴀʟᴜɢᴜᴇʟ ʀᴇᴍᴏᴠɪᴅᴏ ᴅᴇsᴛᴇ ɢʀᴜᴘᴏ.* 🔓🤷‍♂️`);
}
break;
                case 'nuke': {
    if (!isGroup) return reply('❌ | Comando só funciona em grupos');
    if (!isDono) return reply('❌ | Apenas meu dono pode usar isso');
    if (!isBotAdmin) return reply('❌ | Preciso ser ADM pra executar');

    try {
        await reagir(from, '💣');
        reply('「⚠️」 Iniciando nuke...');

        const groupMetadata = await getGroupMetadataFast(sock, from);
        const participants = groupMetadata.participants;

        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const owner = groupMetadata.owner || participants.find(p => p.admin === 'superadmin')?.id;

        // Remove admins primeiro, exceto bot e dono do grupo
        for (const p of participants) {
            if ((p.admin === 'admin' || p.admin === 'superadmin') && p.id!== botNumber && p.id!== owner) {
                try {
                    await sock.groupParticipantsUpdate(from, [p.id], 'remove');
                    await delay(1500); // Delay maior pra evitar ban
                } catch (e) {
                    console.log(`Erro ao remover admin ${p.id}:`, e.message);
                }
            }
        }

        // Remove membros comuns, exceto bot e dono do grupo
        for (const p of participants) {
            if (!p.admin && p.id!== botNumber && p.id!== owner) {
                try {
                    await sock.groupParticipantsUpdate(from, [p.id], 'remove');
                    await delay(1500);
                } catch (e) {
                    console.log(`Erro ao remover membro ${p.id}:`, e.message);
                }
            }
        }

        // Altera nome e descrição
        await sock.groupUpdateSubject(from, '[ GRUPO ARQUIVADO ]').catch(() => {});
        await sock.groupUpdateDescription(from, `[ GRUPO ARQUIVADO by ${NomeDono} ]`).catch(() => {});

        await reagir(from, '✅');
        reply('[ ☠️ GRUPO ARQUIVADO ]');

    } catch (e) {
        console.log('[CASE NUKE ERRO]', e.message);
        await reagir(from, '❌');
        reply('❌ | Erro ao executar nuke: ' + e.message);
    }
}
break;
case 'git': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!args[0]) return reply(`Use: ${prefix}git clone <link>`);

        // Verifica se o subcomando é "clone"
        if (args[0] !== "clone") {
            return reply(`Use: ${prefix}git clone <link>`);
        }

        const repo = args[1];
        if (!repo) return reply(`❌ Envie o link do repositório.\nExemplo: ${prefix}git clone https://github.com/user/repo`);

        // Formato padrão para baixar ZIP
        const zipUrl = repo.replace(/\.git$/, '') + "/archive/refs/heads/main.zip";

        reply("_*⚡ Baixando o arquivo na velocidade da luz...*_");

        const axios = require("axios");
        const fs = require("fs");
        const pathGit = "./media/temp/repo.zip";

        const response = await axios({
            url: zipUrl,
            method: "GET",
            responseType: "arraybuffer"
        });

        fs.writeFileSync(pathGit, response.data);

const repoName = repo.split('/').pop().replace('.git', '') || "repositório";

await sock.sendMessage(from, {
    document: fs.readFileSync(pathGit),
    mimetype: "application/zip",
    fileName: `${repoName}.zip`
}, { quoted: selometa });

        fs.unlinkSync(pathGit);

    } catch (err) {
        console.log(err);
        reply("❌ Erro ao clonar o repositório. Talvez ele não exista...");
    }
}
break;
case 'bug':
case 'bugs': {
       if (!isGroup) return reply(enviar.msg.group);
       if (!q) return reply('💢 *Digite algum bug* do bot após o comando!');
       const target = sender.split('@')[0];
       const textBug = `╔╤ֶׂ࣮֮ᩧ╧ֵᩬ᩼┅ٜꠥׂ๋໋┄҇͜͡ᗁ᮫๋ׅٜׄ✦ֵ֘҆ᗀ҇͡━̶⵿ׂ໋𝆋֘❗ຼ۪۪۪ᩙ⵿━̶᮫ׅׄ҇͡ᗁֵ໋֘✦ֺ๋ٜᗀ҇͜͡┄ׂ໋ٜ֮֔┅ꠥֵֶׂ๋໋╧ᩬ᩼╤݄࣫╗\n╭┅ׄᩙֶ┄ּׅ֘ꠥ━̶ׅׄ𔘓⃙໋ׄ╼⵿ׄ╾ׅ͠╬ּׅ۟۟۟۟۟۟۟۟╏ׂᩬּ֑💔ᩖׅׄᩙ̶ ᮫ׄ╏ּׅ۟۟۟۟۟۟╬͠╼⵿ׂ໋╾⃙̶֮𔘓ׂׅ֓━ֶׅ֘┄ׄᩙꠥ┅╮\n\n*MENSAGEM DE BUG... 💔*\n👤 Relatado por: ${info.pushName}\n🔢 Número: ${target}\n🗒️ ${q}\n\n╰ׅ┅ׄᩙֶ┄ּׅ֘ꠥ━̶ׅׄ𔘓⃙໋ׄ╼⵿ׄ╾ׅ͠╬ּׅ۟۟۟۟۟۟۟۟╏ׂᩬּ֑💔ᩖׅׄᩙ̶ ᮫ׄ╏ּׅ۟۟۟۟۟۟╬͠╼⵿ׂ໋╾⃙̶֮𔘓ׂׅ֓━ֶׅ֘┄ׄᩙꠥ┅╯\n╚ׂ݄╤ֶׂ࣮֮ᩧ╧ֵᩬ᩼┅ٜꠥׂ๋໋┄҇͜͡ᗁ᮫๋ׅٜׄ✦ֵ֘҆ᗀ҇͡━̶⵿ׂ໋𝆋֘❗ຼ۪۪۪ᩙ⵿━̶᮫ׅׄ҇͡ᗁֵ໋֘✦ֺ๋ٜᗀ҇͜͡┄ׂ໋ٜ֮֔┅ꠥֵֶׂ๋໋╧ᩬ᩼╤݄࣫╝`;
       await sock.sendMessage(numerodono + '@s.whatsapp.net', { text: textBug }, { quoted: selometa });
       reply(`✅ Bug reportado com sucesso!\n🌸 Agradecemos por melhorar o ${NomeDoBot}`);
       }
break;
case 'abrirgp': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
    if (!isBotAdmin) return reply(enviar.msg.botadm);
const fs = require('fs');
    let horarios = fs.existsSync(horariosPath)
        ? JSON.parse(fs.readFileSync(horariosPath))
        : {};

    if (!horarios[from]) horarios[from] = {};

    const args = q.trim().split(' ');

    if (args[0]?.toLowerCase() === 'foto') {

        const hora = args[1];

        if (!hora || !hora.match(/^\d{2}:\d{2}$/))
            return reply(`Use: ${prefix}abrirgp foto 15:00`);

        const quoted =
            info.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted?.imageMessage)
            return reply('𝚁𝚎𝚜𝚙𝚘𝚗𝚍𝚊 𝚞𝚖𝚊 𝚖𝚎𝚗𝚜𝚊𝚐𝚎𝚖.');

        

        if (!fs.existsSync(pasta))
            fs.mkdirSync(pasta, { recursive: true });

        const caminho = path.join(
            pasta,
            `abrir_${from.replace(/[@.]/g, '_')}.jpg`
        );

        await salvarImagem(
            quoted.imageMessage,
            caminho
        );

        horarios[from].abrir = hora;
        horarios[from].imagemAbrir = caminho;

        fs.writeFileSync(
            horariosPath,
            JSON.stringify(horarios, null, 2)
        );

        return reply(`✅ 𝙾 𝚐𝚛𝚞𝚙𝚘 𝚊𝚋𝚛𝚒𝚛á 𝚊𝚜 ${hora} 𝚌𝚘𝚖 𝚒𝚖𝚊𝚐𝚎𝚖.`);
    }

    const hora = args[0];

    if (!hora || !hora.match(/^\d{2}:\d{2}$/))
        return reply(`Use: ${prefix}abrirgp 15:00`);

    horarios[from].abrir = hora;

    fs.writeFileSync(
        horariosPath,
        JSON.stringify(horarios, null, 2)
    );

    reply(`✅ Grupo abrirá às ${hora}`);
}
break;
                case 'msgabrir': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
const fs = require('fs');
    if (!q)
        return reply(`Use:\n${prefix}msgabrir 🔓 Grupo aberto!`);

    let horarios = fs.existsSync(horariosPath)
        ? JSON.parse(fs.readFileSync(horariosPath))
        : {};

    if (!horarios[from])
        horarios[from] = {};

    horarios[from].mensagemAbrir = q;

    fs.writeFileSync(
        horariosPath,
        JSON.stringify(horarios, null, 2)
    );

    reply('✅ Mensagem de abertura definida.');
}
break;
                case 'fechargp': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
    if (!isBotAdmin) return reply(enviar.msg.botadm);
const fs = require('fs');
    let horarios = fs.existsSync(horariosPath)
        ? JSON.parse(fs.readFileSync(horariosPath))
        : {};

    if (!horarios[from]) horarios[from] = {};

    const args = q.trim().split(' ');

    if (args[0]?.toLowerCase() === 'foto') {

        const hora = args[1];

        if (!hora || !hora.match(/^\d{2}:\d{2}$/))
            return reply(`Use: ${prefix}fechargp foto 22:00`);

        const quoted =
            info.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted?.imageMessage)
            return reply('Responda uma imagem.');

        

        if (!fs.existsSync(pasta))
            fs.mkdirSync(pasta, { recursive: true });

        const caminho = path.join(
            pasta,
            `fechar_${from.replace(/[@.]/g, '_')}.jpg`
        );

        await salvarImagem(
            quoted.imageMessage,
            caminho
        );

        horarios[from].fechar = hora;
        horarios[from].imagemFechar = caminho;

        fs.writeFileSync(
            horariosPath,
            JSON.stringify(horarios, null, 2)
        );

        return reply(`✅ Grupo fechará às ${hora} com imagem.`);
    }

    const hora = args[0];

    if (!hora || !hora.match(/^\d{2}:\d{2}$/))
        return reply(`Use: ${prefix}fechargp 22:00`);

    horarios[from].fechar = hora;

    fs.writeFileSync(
        horariosPath,
        JSON.stringify(horarios, null, 2)
    );

    reply(`✅ Grupo fechará às ${hora}`);
}
break;
                case 'msgfechar': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
const fs = require('fs');
    if (!q)
        return reply(`Use:\n${prefix}msgfechar 🔒 Grupo fechado!`);

    let horarios = fs.existsSync(horariosPath)
        ? JSON.parse(fs.readFileSync(horariosPath))
        : {};

    if (!horarios[from])
        horarios[from] = {};

    horarios[from].mensagemFechar = q;

    fs.writeFileSync(
        horariosPath,
        JSON.stringify(horarios, null, 2)
    );

    reply('✅ Mensagem de fechamento definida.');
}
break;
case 'd':
case 'delete':
case 'deletar': { 
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!isAdmin) return reply(enviar.msg.adm);
        if (!isBotAdmin) return reply(enviar.msg.botadm);

        const quoted =
info.message?.extendedTextMessage?.contextInfo?.quotedMessage

console.log(quoted)
            return reply('❗ Responda a *alguma mensagem* para deletá-la.');

        await sock.sendMessage(from, {
            delete: {
                id: quoted.stanzaId,
                remoteJid: from,
                fromMe: false,
                participant: quoted.participant
            }
        });

    } catch (err) {
        console.error(err);
        reply('❌ Erro ao deletar a mensagem.');
    }
}
break;
case 'promover':
case 'p': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.admin);
    if (!isBotAdmin) return reply(enviar.msg.botadm)

    // Pega menção OU o usuário da mensagem citada
    const mentioned =
        info.message.extendedTextMessage?.contextInfo?.mentionedJid[0] ||
        (quoted ? quoted.sender : null);
    const answered = info.message.extendedTextMessage?.contextInfo?.participant;
    let alvo = answered || (mentioned?.length ? mentioned : null);

if (!alvo) {
    return reply('🌸 Marque alguém ou responda a mensagem de alguém para promover!');
}

    try {
        await sock.groupParticipantsUpdate(from, [alvo], 'promote');

        await sock.sendMessage(from, {
            text: `⚡ @${alvo.split('@')[0]} foi *promovido* a admin!`,
            mentions: [alvo]
        }, { quoted: info });

    } catch (e) {
        reply('❌ Erro ao promover usuário.');
        console.error(e);
    }
}
break;
case 'rebaixar': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.admin);
    if (!isBotAdmin) return reply(enviar.msg.botadm);

    const mentioned =
        info.message.extendedTextMessage?.contextInfo?.mentionedJid[0] ||
        (quoted ? quoted.sender : null);
    const answered = info.message.extendedTextMessage?.contextInfo?.participant;
    let alvo = answered || (mentioned?.length ? mentioned : null);

    if (!alvo)
        return reply('🍓 Marque alguém para rebaixar!');

    try {
        await sock.groupParticipantsUpdate(from, [alvo], 'demote');

        await sock.sendMessage(from, {
            text: `💢 Tudo bem, adm, @${alvo.split('@')[0]} *rebaixado* a admin com sucesso.`,
            mentions: [alvo]
        }, { quoted: info });
    } catch (e) {
        reply('❌ Erro ao rebaixar usuário.');
        console.error(e);
    }
}
break;
case 'antilink': {
    if (!isGroup) return reply(enviar.msg.group)
    if (!isAdmin) return reply(enviar.msg.adm)
    if (!isBotAdmin) return reply(enviar.msg.botadm)

    // Pega o estado atual
    try {
    const atual = antiLink[from];

    // Alterna
    antiLink[from] = !atual;

    // Salva no arquivo
    saveAntiLink();

    return reply(`🔗 AntiLink neste grupo ${antiLink[from] ? '*ativado*' : '*desativado*'} com sucesso!\n${antiLink[from] ? '> Agora quem enviar links, irei banir imediatamente...' : '> Agora não irei banir mais ninguém...'}`);
    } catch (err) {
    reply('❌ Erro ao ativar o antilink!');
    console.error(err)
    }
}
break;
case 'ban': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
    if (!isBotAdmin) return reply(enviar.msg.botadm);
    const mentioned =
        info.message.extendedTextMessage?.contextInfo?.mentionedJid[0] ||
        (quoted ? quoted.sender : null);
    const answered = info.message.extendedTextMessage?.contextInfo?.participant;
    let alvo = answered || (mentioned?.length ? mentioned : null);

    // Impedir ban do dono ou admins
    if (alvo === sender) return reply("❌ Você não pode se banir sozinho 😂");
    if (admins.includes(alvo)) return reply("❌ Não posso banir outro administrador.");

    try {
        await sock.groupParticipantsUpdate(
            from,
            [alvo],
            "remove"
        );

        reply(`✅ Usuário: ${alvo ? '@' + alvo.split('@')[0] : 'removido'} removido com sucesso por motivos justos!`, { mentions: [alvo] });

    } catch (e) {
        console.log("Erro no ban:", e);
        reply("❌ Ocorreu um erro ao tentar banir.");
    }

    break;
}
case 'adms':
case 'admins': {
    if (!isGroup) return reply(enviar.msg.group);

    if (admins.length === 0) {
        return reply('❌ Este grupo não possui administradores registrados.');
    }

    let texto = '👑 *Lista de Admins do Grupo:*\n\n';
    const mentions = [];

    admins.forEach(a => {
        const jid = a.id;
        const numero = jid.split('@')[0];
        texto += `@${numero}\n`;
        mentions.push(jid);
    });

    await sock.sendMessage(from, {
        text: texto,
        mentions: mentions
    });

}
break;
case 'toimg': {
    if (!isGroup) return reply(enviar.msg.group);
    const { exec } = require('child_process');

    // função para converter stream → buffer
    const streamToBuffer = async (stream) => {
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return Buffer.concat(chunks);
    };

    // garantir pasta
    if (!fs.existsSync('./media/sticker'))
        fs.mkdirSync('./media/sticker', { recursive: true });

    // detectar figurinha
    let stickerMsg = null;

    // enviada direto
    if (info.message.stickerMessage) {
        stickerMsg = info;
    }

    // respondida
    if (!stickerMsg && info.message.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage) {
        stickerMsg = {
            ...info,
            message: info.message.extendedTextMessage.contextInfo.quotedMessage
        };
    }

    if (!stickerMsg) {
        return reply('📸 Envie ou *responda a uma figurinha* para converter em imagem!');
    }

    try {
    reply('❣️ Transformando em imagem, aguarde...');
        let stickerStream = await downloadMediaMessage(stickerMsg);
        let stickerBuffer = await streamToBuffer(stickerStream);

        const inputPath = './media/sticker/input.webp';
        const outputPath = './media/sticker/output.png';

        fs.writeFileSync(inputPath, stickerBuffer);

        exec(`ffmpeg -i "${inputPath}" "${outputPath}"`, async (err) => {
            if (err) {
                console.error(err);
                return reply('❌ Erro ao converter figurinha.');
            }

            if (!fs.existsSync(outputPath)) {
                return reply('❌ Não consegui gerar a imagem final.');
            }

            const img = fs.readFileSync(outputPath);
            reagir('🌟');
            await sock.sendMessage(from, {
                image: img,
                caption: '🖼️ Aqui está sua imagem!'
            }, { quoted: info });

            try { fs.unlinkSync(inputPath); } catch {}
            try { fs.unlinkSync(outputPath); } catch {}
        });

    } catch (e) {
        console.error(e);
        reply('❌ Erro ao processar a figurinha.');
    }

    break;
}
case 'attp': {
    if (!isGroup) return reply(enviar.msg.group)
    if (!args[0]) return reply("✨ Escreva um texto para gerar o ATTp!");

    const texto = args.join(" ");
    const output = "./media/attp.webp";

    try {
        await gerarAttp(q, output);

        const sticker = fs.readFileSync(output);

        await sock.sendMessage(from, {
            sticker: sticker
        }, { quoted: info });
        fs.rmSync('./media/attp_frames', { recursive: true, force: true });
        fs.unlinkSync('./media/attp.gif');
        fs.unlinkSync('./media/attp.webp');

    } catch (e) {
        console.error(e);
        reply("❌ Erro ao gerar ATTp local.");
    }
}
break;
case 'sugestao':
case 'sugestão': {
    try {
        if (!q) return reply(`🌹 Digite uma sugestão após o comando!\n\nExemplo: ${prefix}sugestao colocar comando de sorteio`);

        const hoje = dataHoje();
        const id = sender;
        const dbSug = readJsonFast(sugestoesPath, {});

        if (!dbSug[id]) dbSug[id] = { data: hoje, usos: 0 };
        if (dbSug[id].data !== hoje) dbSug[id] = { data: hoje, usos: 0 };

        if (dbSug[id].usos >= 4) {
            return reply('🚫 *Você já usou o comando 4 vezes hoje!* Tente novamente amanhã. 🌅');
        }

        dbSug[id].usos++;
        dbSug.historico = Array.isArray(dbSug.historico) ? dbSug.historico : [];
        dbSug.historico.push({
            id: `SUG-${Date.now()}`,
            usuario: sender,
            nome: info.pushName || pushname || 'Sem nome',
            grupo: isGroup ? from : null,
            nomeGrupo: isGroup ? nameGroup : 'Privado',
            texto: q,
            data: new Date().toISOString()
        });

        // Mantém o arquivo leve.
        if (dbSug.historico.length > 200) dbSug.historico = dbSug.historico.slice(-200);
        writeJsonFast(sugestoesPath, dbSug);

        const textSug = `╔╤ֶׂ࣮֮ᩧ╧ֵᩬ᩼┅ٜꠥׂ๋໋┄҇͜͡ᗁ᮫๋ׅٜׄ✦ֵ֘҆ᗀ҇͡━̶⵿ׂ໋𝆋֘💢ຼ۪۪۪ᩙ⵿━̶᮫ׅׄ҇͡ᗁֵ໋֘✦ֺ๋ٜᗀ҇͜͡┄ׂ໋ٜ֮֔┅ꠥֵֶׂ๋໋╧ᩬ᩼╤݄࣫╗
╭┅ׄᩙֶ┄ּׅ֘ꠥ━̶ׅׄ𔘓⃙໋ׄ╼⵿ׄ╾ׅ͠╬ּׅ۟۟۟۟۟۟۟۟╏ׂᩬּ֑💡ᩖׅׄᩙ̶ ᮫ׄ╏ּׅ۟۟۟۟۟۟╬͠╼⵿ׂ໋╾⃙̶֮𔘓ׂׅ֓━ֶׅ֘┄ׄᩙꠥ┅╮

😍 *SUGESTÃO NOVA CHEGOU!!*
👤 Sugestão de: ${info.pushName || pushname || 'Sem nome'}
🔢 Número: ${sender.split('@')[0]}
👥 Grupo: ${isGroup ? nameGroup : 'Privado'}
🆔 ID: ${isGroup ? from : 'chat privado'}
🗒️ ${q}

╰ׅ┅ׄᩙֶ┄ּׅ֘ꠥ━̶ׅׄ𔘓⃙໋ׄ╼⵿ׄ╾ׅ͠╬ּׅ۟۟۟۟۟۟۟۟╏ׂᩬּ֑💡ᩖׅׄᩙ̶ ᮫ׄ╏ּׅ۟۟۟۟۟۟╬͠╼⵿ׂ໋╾⃙̶֮𔘓ׂׅ֓━ֶׅ֘┄ׄᩙꠥ┅╯
╚ׂ݄╤ֶׂ࣮֮ᩧ╧ֵᩬ᩼┅ٜꠥׂ๋໋┄҇͜͡ᗁ᮫๋ׅٜׄ✦ֵ֘҆ᗀ҇͡━̶⵿ׂ໋𝆋֘💢ຼ۪۪۪ᩙ⵿━̶᮫ׅׄ҇͡ᗁֵ໋֘✦ֺ๋ٜᗀ҇͜͡┄ׂ໋ٜ֮֔┅ꠥֵֶׂ๋໋╧ᩬ᩼╤݄࣫╝`;

        await enviarParaDonoPrincipal({
            text: textSug,
            contextInfo: getForwardContext({ forwardingScore: 999 })
        }, { quoted: selometa });

        reply(`✅ *Sugestão enviada!*\n📌 Hoje você usou este comando *${dbSug[id].usos}/4* vezes.`);

    } catch (err) {
        console.error(err);
        reply('❌ Erro ao enviar sugestão...');
    }
}
break;

case 'ping': {
try {
const fs = require('fs');
const aluguel = JSON.parse(
fs.readFileSync('./assets/aluguel.json', 'utf8')
);

const gruposAtivos = aluguel.filter(
g => g.expira > Date.now()
).length;

const gruposTotal = aluguel.length;

const uptime = process.uptime();

const dias = Math.floor(uptime / 86400);
const horas = Math.floor((uptime % 86400) / 3600);
const minutos = Math.floor((uptime % 3600) / 60);
const segundos = Math.floor(uptime % 60);

const ram = (
process.memoryUsage().rss /
1024 /
1024
).toFixed(2);

const texto = `
┎┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┒
            𝗦𝘁𝗮𝘁𝘂𝘀 𝗱𝗼 𝗕𝗼𝘁
┖┈┈┈┈┈┈┈୨♡୧┈┈┈┈┈┈┈┚


⊹₊ ˚‧︵‿₊୨ *𝙿𝚒𝚗𝚐*: ${Date.now() % 100}ms [✨]

⊹₊ ˚‧︵‿₊୨ *𝙾𝚗𝚕𝚒𝚗𝚎*:
${dias}d ${horas}h ${minutos}m ${segundos}s [😦]

⊹₊ ˚‧︵‿₊୨ *𝙶𝚛𝚞𝚙𝚘𝚜 𝙰𝚕𝚞𝚐𝚊𝚍𝚘𝚜* :
${gruposTotal} [🔥]

⊹₊ ˚‧︵‿₊୨ *𝙶𝚛𝚞𝚙𝚘𝚜 𝚊𝚝𝚒𝚟𝚘𝚜* :
${gruposAtivos} [🕊️]

⊹₊ ˚‧︵‿₊୨ *𝚁𝙰𝙼* :
${ram} MB [🐔]

⊹₊ ˚‧︵‿₊୨ *𝙿𝚕𝚊𝚝𝚊𝚏𝚘𝚛𝚖𝚊* :
${process.platform} [💻]

⊹₊ ˚‧︵‿₊୨ *𝙽𝚘𝚍𝚎* :
${process.version} [📦]

⊹₊ ˚‧︵‿₊୨ *𝙱𝚘𝚝* :
${NomeDoBot} [🤖]

⊹₊ ˚‧︵‿₊୨ *𝚅𝚎𝚛𝚜ã𝚘* :
${version} [📱]

 ───── ⋆⋅ ♰ ⋅⋆ ───── ⊰˖°`;

await sock.sendMessage(
from,
{
image: {
url: 'https://files.catbox.moe/qxvtjv.jpeg' // troque pela sua foto
},
caption: texto
},
{
quoted: info
}
);

} catch (err) {
console.log(err);
reply('Erro ao verificar status.');
}
}
break;
case 'attp2': {
    if (!isGroup) return reply(enviar.msg.group);

    let texto = args.join(" ");
    if (!texto) return reply("🌸 Digite um texto para gerar o attp2!");

    const gerarAttp2 = require('./assets/functions/attp2.js');
    const output = './media/attp/attp2_final.webp';

    try {
        const file = await gerarAttp2(texto, output);
        await sock.sendMessage(from, { sticker: { url: file } }, { quoted: info });
        fs.unlinkSync('./media/attp/attp2_final.webp');
    } catch (e) {
        console.error(e);
        reply("❌ Falha ao gerar a figurinha.");
    }
}
break;
case 'getperfil': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!isVip) return reply(enviar.msg.vip);
        if (!q) return reply("❌ Use: #getperfil número\nEx: #getperfil 5511912345678");

        // Remove qualquer símbolo que não seja número
        const numero = q.replace(/\D/g, "");

        if (numero.length < 8) return reply("❌ Número inválido.");

        const jid = numero + "@s.whatsapp.net";

        // Buscar foto de perfil
        const ppUrl = await sock.profilePictureUrl(jid, "image")
            .catch(() => null);

        if (!ppUrl) return reply("❌ Não encontrei foto de perfil desse número.");

        // Baixar a imagem
        const buffer = await fetch(ppUrl).then(res => res.arrayBuffer());

        await sock.sendMessage(from, {
            image: Buffer.from(buffer),
            caption: `📸 Foto de perfil de: ${numero}`
        }, { quoted: selometa });

    } catch (e) {
        console.log("ERRO GETPERFIL:", e);
        reply("❌ Erro ao obter foto de perfil.");
    }
}
break;
case 'adverter': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.admin);
    if (!isBotAdmin) return reply(enviar.msg.botadm);

    const mentioned =
        info.message.extendedTextMessage?.contextInfo?.mentionedJid[0] ||
        (quoted ? quoted.sender : null);
    const answered = info.message.extendedTextMessage?.contextInfo?.participant;
    let alvo = answered || (mentioned?.length ? mentioned : null);
    
if (!alvo) return reply('🌸 Marque ou responda a mensagem de alguém para adverter!');

    const data = JSON.parse(readFileSync(advPath, 'utf-8'));

    if (!data[from]) data[from] = {}; // Inicializa o grupo
    for (let user of mentioned) {
        if (!data[from][alvo]) data[from][alvo] = 0;

        data[from][alvo] += 1;

        // Mensagem personalizada
        const adv = data[from][alvo]
        await sock.sendMessage(from, {
            text: `🌸 @${alvo.split('@')[0]} Parece que você acabou de ser advertido...\n💖 Você agora tem ${adv}/3 advertências...\n🌹 Tome cuidado! Com três advertências, você será removido do grupo!`,
            mentions: [alvo]
        }, { quoted: info });

        if (adv >= 3) {
            try {
            reply(`💕 @${alvo.split('@')[0]} *Parece que você atingiu o máximo de advertências, irei ter que lhe banir...`);
                await sock.groupParticipantsUpdate(from, [alvo], 'remove');
                delete data[from][alvo]; // reseta contagem após remoção
            } catch (e) {
            reply('❌ Erro ao adverter. Talvez eu não seja adm...');
                console.error(e);
            }
        }
    }
    writeFileSync(advPath, JSON.stringify(data, null, 2));
}
break;
case 'addcase':  
if (!isDono) return;
if (!q) return reply('😅 Você precisa fornecer o código da nova case.');
const indexPath = 'index.js';  
try {
let fileContent = fs.readFileSync(indexPath, 'utf8');
if (fileContent.includes(`case '${q.split(" ")[1]}':`)) {
return reply('⚠️ Esta case já existe no sistema!');}
let detectedClient = q.match(/(\w+)\.sendMessage/)?.[1]; 
if (detectedClient) { console.log(`🔄 Cliente detectado: ${detectedClient}`);
fileContent = fileContent.replace(/(\b\w+)\.sendMessage/, `${detectedClient}.sendMessage`);}
let lastBreakIndex = fileContent.lastIndexOf('break;');
if (lastBreakIndex === -1) { 
return reply('❌ Erro ao encontrar a estrutura do switch.');}
let newContent = [ fileContent.slice(0, lastBreakIndex + 6),
 `\n\n    ${q}\n`, fileContent.slice(lastBreakIndex + 6) 
 ].join('');
fs.writeFileSync(indexPath, newContent);
reply(`✅ Nova case adicionada com sucesso! Cliente atualizado para: ${detectedClient || "Nenhum detectado"}`);} catch (err) { reply(`❌ Erro ao adicionar a case: ${err.message}`);}
break;
case 'nickstilo': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`🌸 Escreva um nome após o comando para gerar estilos de nomes!`);

        const apiUrl = `https://neon-apis.online/api/fazernick?nome=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar os estilos de nick.");

        const json = await response.json();

        if (!Array.isArray(json) || json.length === 0) {
            return reply("❌ Não encontrei estilos para esse nome.");
        }

        let texto = `🎨 *Estilos para ${q}*:\n\n`;
        texto += json.map((estilo, i) => `${i + 1}. ${estilo}`).join("\n");

        await sock.sendMessage(from, {
            text: texto
        }, { quoted: selometa });

    } catch (e) {
        console.error(e);
        reply("❌ Ocorreu um erro ao gerar os estilos de nick.");
    }
}
break;
               case 'atualizar': {

    if (!isDono)
        return reply(
            '❌ Apenas o dono.'
        );

    try {

        const dados =
            (await axios.get(
                UPDATE_URL
            )).data;

        if (
            dados.version === versao
        ) {

            return reply(
`✅ 𝙾 𝙱𝙾𝚃 𝙹Á 𝙴𝚂𝚃Á 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰𝙳𝙾

📦 ${versao}`
            );

        }

        await reply(
`🚀 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰ÇÃ𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙰𝙳𝙰

📦 Atual: ${versao}
📦 Nova: ${dados.version}

⏳ Atualizando...`
        );

        const resultado =
            await atualizarSistema();

        await reply(
`✅ 𝙰𝚃𝚄𝙰𝙻𝙸𝚉𝙰ÇÃ𝙾 𝙲𝙾𝙽𝙲𝙻𝚄Í𝙳𝙰

📦 Versão:
${resultado.version}

📁 Arquivos:
${resultado.arquivos}

📝 ${resultado.mensagem}

♻️ Reiniciando...`
        );

        process.exit(0);

    } catch (e) {

        console.log(e);

        reply(
            '❌ Erro ao atualizar.'
        );

    }

}
break;
case 'delvip': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isDono) return reply(enviar.msg.dono);

    const mencionado = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const respondido = info.message?.extendedTextMessage?.contextInfo?.participant;
    let alvo = mencionado || respondido || args[1];

    if (!alvo) return reply("👑 Marque alguém, responda uma mensagem ou insira o número.");

    if (!alvo.includes("@")) alvo = alvo.replace(/\D+/g, "") + "@s.whatsapp.net";

    if (!vipData.includes(alvo)) return reply("🥲 Este usuário não é VIP...");

    vipData = vipData.filter(id => id !== alvo);
    saveVip();
    await reply(`😔 *Usuário ${alvo.split("@")[0]} foi removido* dos VIPs...`);
}
break;
case 'hackneon': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} nome`);
        
        reagir('☠️');

        const url = `https://neon-apis.online/api/logo/hackneon?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo, tente novamente.");
    }
}
break;
case 'gizquadro': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} nome`);
        
        reagir('🖍️');

        const url = `https://neon-apis.online/api/logo/gizquadro?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo, tente novamente.");
    }
}
break;
case 'shadow': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} nome`);
        
        reagir('☀️');

        const url = `https://neon-apis.online/api/logo/shadow?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo, tente novamente.");
    }
}
break;
case 'txtbutterfly': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} nome`);
        
        reagir('🦋');

        const url = `https://neon-apis.online/api/logo/txtborboleta?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo, tente novamente.");
    }
}
break;

case 'cemiterio': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} nome`);
        
        reagir('🦇');

        const url = `https://neon-apis.online/api/logo/cemiterio?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo, tente novamente.");
    }
}
break;
case 'harryp': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} nome`);
        
        reagir('🐺');

        const url = `https://neon-apis.online/api/logo/harryp?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo, tente novamente.");
    }
}
break;
case 'blackpink': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} nome`);
        
        reagir('🩷');

        const url = `https://neon-apis.online/api/logo/blackpink?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo, tente novamente.");
    }
}
break;
case 'wingeffect': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} nome`);
        
        reagir('💫');

        const url = `https://neon-apis.online/api/logo/wingeffect?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo, tente novamente.");
    }
}
break;
case 'fpsmascote': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} nome`);
        
        reagir('🎨');

        const url = `https://neon-apis.online/api/logo/fpsmascote?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: `🖼️ *Logo FPS Mascote criada!*`
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo, tente novamente mais tarde.");
    }
}
break;
case 'txtquadrinhos': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} texto`);
        
        reagir('💡');

        const url = `https://neon-apis.online/api/logo/txtquadrinhos?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar seu texto em quadrinhos, tente novamente.");
    }
}
break;
case 'gemini-pro': {
    try {
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} texto`);

        reagir('🪩');

        const url = `https://neon-apis.online/api/gemini-pro?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url);

        // A API retorna: { "provedor": "...", "resposta": "texto aqui" }
        const resultado = response.data?.resposta;

        if (!resultado) return reply("❌ Erro ao obter resposta do Gemini-Pro.");

        await sock.sendMessage(from, {
            text: resultado
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui consultar o Gemini-Pro no momento.");
    }
}
break;
case 'playstore': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply('📱 *Digite o nome de um app para pesquisar*\n\nExemplo:\n#playstore Free Fire');
        reagir('🔎');
        const api = `https://neon-apis.online/api/playstore?query=${encodeURIComponent(q)}`;

        const { data } = await axios.get(api);

        if (!data.status || !data.resultado || data.resultado.length === 0) {
            return reply('❌ Nenhum resultado encontrado na Play Store.');
        }

        const resultados = data.resultado;

        let texto = `📱 *PLAY STORE – Resultados para:* ${q}\n\n`;

        resultados.slice(0, 10).forEach((app, i) => {
            texto += `*${i + 1}. ${app.nome}*\n`;
            texto += `👨‍💻 Dev: ${app.desenvolvedor}\n`;
            texto += `⭐ Nota: ${app.estrelas}\n`;
            texto += `🔗 Link: ${app.link}\n\n`;
        });

        // Envia a primeira imagem como thumb
        reagir('✅');
        await sock.sendMessage(from, {
            image: { url: resultados[0].imagem },
            caption: texto
        }, { quoted: selometa });

    } catch (e) {
        console.error(e);
        reply('❌ Erro ao pesquisar na Play Store. Tente novamente mais tarde.');
    }
}
break;
case 'plaq1': {
    try {
        if (!q) return reply('🍑 *Digite um nome!*\nExemplo: #plaq1 Toshiruz');
        reagir('🫦');
        const url = `https://neon-apis.online/api/plaq1?texto=${encodeURIComponent(q)}`;

        const { data } = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        await sock.sendMessage(from, {
            image: data,
            caption: ``
        }, { quoted: selometa });

    } catch (err) {
        console.error(err);
        reply('❌ Ocorreu um erro ao gerar a plaquinha.');
    }
}
break;
case 'plaq3': {
    try {
        if (!q) return reply(`🪩 Use assim para gerar a plaquinha: ${prefix + command}`);

        reagir('😈');

        const apiUrl = `https://neon-apis.online/api/plaq3?texto=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar a imagem.");

        const buffer = await response.arrayBuffer();
        const image = Buffer.from(buffer);

        await sock.sendMessage(from, {
            image,
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Ocorreu um erro ao gerar sua plaquinha.");
    }
}
break;
case 'plaq4': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`🌸 Use assim: ${prefix + command} _nome_`);

        reagir('🔥');

        const apiUrl = `https://neon-apis.online/api/plaq4?texto=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar a imagem.");

        const buffer = await response.arrayBuffer();
        const image = Buffer.from(buffer);

        await sock.sendMessage(from, {
            image,
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Ocorreu um erro ao gerar sua plaquinha 4.");
    }
}
break;
case 'plaq5': {
    try {
        if (!q) return reply(`✋😈✋ Digite algo para transformar em plaquinha...`);

        reagir('❤️‍🔥');

        const apiUrl = `https://neon-apis.online/api/plaq5?texto=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar a imagem.");

        const buffer = await response.arrayBuffer();
        const image = Buffer.from(buffer);

        await sock.sendMessage(from, {
            image,
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Ocorreu um erro ao gerar sua plaquinha 5.");
    }
}
break;
case 'dicionario':
case 'dicionário': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`📚 Digite uma palavra para pesquisar!\nExemplo: ${prefix}dicionario amor`);

        const url = `https://neon-apis.online/api/dicionario?texto=${encodeURIComponent(q)}`;

        const { data } = await axios.get(url);

        if (!data || !data.resultado)
            return reply('❌ Não encontrei definição para essa palavra.');

        await sock.sendMessage(from, {
            text: `📖 *Dicionário – ${q}*\n${data.resultado}`
        }, { quoted: selometa });

    } catch (err) {
        console.error(err);
        reply('❌ Erro ao buscar a definição no dicionário.');
    }
}
break;
case 'plaq2': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`😈 Use: ${prefix + command} _nome_`);

        reagir('🍑');

        const apiUrl = `https://neon-apis.online/api/plaq2?texto=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar a imagem.");

        const buffer = await response.arrayBuffer();
        const image = Buffer.from(buffer);

        await sock.sendMessage(from, {
            image,
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Ocorreu um erro ao gerar sua plaquinha.");
    }
}
break;
case 'linkgp':
case 'linkgrupo':
if (!isGroup) return reply(enviar.msg.group);
if (!isAdmin) return reply(enviar.msg.adm);
if (!isBotAdmin) return reply(enviar.msg.botadm);
const codeGp = await sock.groupInviteCode(from);
reagir('💫');
await sock.sendMessage(from, { text: `❣️ Aqui está o *link do grupo!*:\nhttps://chat.whatsapp.com/${codeGp}`}, { quoted: selometa });
break;
case 'plaq6': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`❤️‍🔥 Escreva algo depois do comando!`);

        reagir('🌸');

        const apiUrl = `https://neon-apis.online/api/plaq6?texto=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar a imagem.");

        const buffer = await response.arrayBuffer();
        const image = Buffer.from(buffer);

        await sock.sendMessage(from, {
            image,
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Ocorreu um erro ao gerar sua plaquinha 6.");
    }
}
break;
case 'plaq7': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`🌸 Digite assim pra gerar a plaquinha: ${prefix + command} _nome_`);

        reagir('❤️‍🔥');

        const apiUrl = `https://neon-apis.online/api/plaq7?texto=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar a imagem.");

        const buffer = await response.arrayBuffer();
        const image = Buffer.from(buffer);

        await sock.sendMessage(from, {
            image,
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Ocorreu um erro ao gerar sua plaquinha 7.");
    }
}
break;
case 'plaq8': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`🌹 Use: ${prefix + command} _nome_`);

        reagir('❤️‍🔥');

        const apiUrl = `https://neon-apis.online/api/plaq8?texto=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar a imagem.");

        const buffer = await response.arrayBuffer();
        const image = Buffer.from(buffer);

        await sock.sendMessage(from, {
            image,
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.error(e);
        reply("❌ Ocorreu um erro ao gerar sua plaquinha 8.");
    }
}
break;
case 'plaq9': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`🌹 Use assim pra gerar: ${prefix + command} _nome_`);

        reagir('🪄')

        const apiUrl = `https://neon-apis.online/api/plaq9?texto=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar a imagem.");

        const buffer = await response.arrayBuffer();
        const image = Buffer.from(buffer);

        await sock.sendMessage(from, {
            image,
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.error(e);
        reply("❌ Ocorreu um erro ao gerar sua plaquinha 9.");
    }
}
break;
case 'plaq10': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`🫦 Digite algo após o comando pra gerar a plaquinha!`);

        reagir('🤡');

        const apiUrl = `https://neon-apis.online/api/plaq10?texto=${encodeURIComponent(q)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erro ao gerar a imagem.");

        const buffer = await response.arrayBuffer();
        const image = Buffer.from(buffer);

        await sock.sendMessage(from, {
            image,
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.error(e);
        reply("❌ Ocorreu um erro ao gerar sua plaquinha 10.");
    }
}
break;
case 'limparchat':
case 'limpar-chat': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!isAdmin) return reply(enviar.msg.adm);
        if (!isBotAdmin) return reply(enviar.msg.botadm);
        reply('⚡ *Limpando o chat...*');
        reply('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.');
        reply('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.');
        reply('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.');
        reply('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.');
        reply('.\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.');
        reply('✅ Limpeza concluída!');
        } catch (e) {
        console.error(e);
        reply('❌ Erro ao limpar o chat!');
        }
  }
break;
case 'mascotegame': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} texto`);

        reagir('🐺');

        const url = `https://neon-apis.online/api/logo/mascotegame?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: ``
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar sua logo mascote gamer, tente novamente.");
    }
}
break;
case 'ffavatar': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply(`💠 *Use assim:*  ${prefix + command} texto`);
        
        reagir('🎮');

        const url = `https://neon-apis.online/api/logo/ffavatar?texto=${encodeURIComponent(q)}`;

        const response = await axios.get(url, { responseType: "arraybuffer" });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: `🔥 *Avatar FF gerado com sucesso!*`
        }, { quoted: selometa });

    } catch (e) {
        console.log(e);
        reply("❌ Não consegui gerar seu avatar FF, tente novamente.");
    }
}
break;
case 'pinterest':
case 'pin': {
    try {
        if (!isGroup) return reply(enviar.msg.group);
        if (!q) return reply('📌 *Escreva algo para pesquisar no Pinterest.*\nExemplo: #pinterest Naruto');

        const esperando = await reagir('🌸');

        const fetch = (await import('node-fetch')).default;

        // API retorna a imagem diretamente
        const apiUrl = `https://yuta-apis.xyz/api/downloads/pinterest?apitoken=${TOKEN}&query=${encodeURIComponent(q)}`;
        const imgRes = await fetch(apiUrl);

        if (!imgRes.ok) return reply('❌ Não consegui acessar a API.');

        // Pega a imagem como buffer
        const buffer = await imgRes.buffer();

        // Envia a imagem no WhatsApp
        await sock.sendMessage(
            from,
            {
                image: buffer,
                caption: ``
            },
            { quoted: selometa }
        );

        // Remove mensagem "buscando..."
        await sock.sendMessage(from, { delete: esperando.key });

    } catch (e) {
        console.log(e);
        reply('❌ Erro ao buscar imagem do Pinterest.');
    }
}
break;
case 'chance': {
  if (!isGroup) return reply(enviar.msg.group);
  if (!q) return reply('❓ *Chance de quê?*\nEx: /chance do bot te banir');

  const porcentagem = Math.floor(Math.random() * 101); // 0 a 100

  reply(`💭 Pergunta do @${sender.split("@")[0]} *Chance ${q.trim()}:* ${porcentagem}%`);
  break;
}

case 'getcase': {
  if (!isDono) return reply(enviar.msg.dono);
  if (!q) return reply('Por favor, especifique o nome da case que deseja obter.');
  const caseName = args[0];
  const fileIndexPath = './index.js'; // caminho do arquivo cases.js
  const fileContent = fs.readFileSync(fileIndexPath, 'utf8');
  const lines = fileContent.split('\n');
  let start = false;
  let caseCode = '';
  for (let line of lines) {
    if (line.includes(`case '${caseName}':`)) {
      start = true;
      caseCode += line + '\n';
    } else if (start) {
      caseCode += line + '\n';
      if (line.includes('break;')) {
        break;
      }
    }
  }
  if (!caseCode) return reply(`A case "${caseName}" não existe.`);
  await sock.sendMessage(from, { text: caseCode }, { quoted: selometa });
} 
break;
case 'rankpau':
  {
    if (!isGroup) return reply(enviar.msg.group)
    let membros = participants.map(p => p.id);
    membros = membros.sort(() => Math.random() - 0.5).slice(0, 5);

    let texto = '🍆 *TOP 5 MAIORES PAU DO GRUPO*\n\n';
    for (let i = 0; i < membros.length; i++) {
      texto += `${i+1}°. @${membros[i].split('@')[0]}\n`;
    }

    sock.sendMessage(from, { text: texto, mentions: membros }, { quoted: selometa });
  }
  break;

case 'rankbuceta': {
    if (!isGroup) return reply(enviar.msg.group)

    let membros = participants.map(p => p.id);

    // embaralhar e pegar 5
    membros = membros.sort(() => Math.random() - 0.5).slice(0, 5);

    // montar texto
    let texto = '🍑 *TOP 5 MAIS BUCETUDOS DO GRUPO*\n\n';
    for (let i = 0; i < membros.length; i++) {
        texto += `${i + 1}. @${membros[i].split('@')[0]}\n`;
    }
    reagir('🫦');
    await sock.sendMessage(
        from,
        {
            video: { url: './media/temp/buceta.mp4' },
            gifPlayback: true,
            caption: texto,
            mentions: membros,
            contextInfo: getForwardContext({ forwardingScore: 999 })
        },
        { quoted: selometa }
    );

}
break;

case 'rankgay':
  {
    if (!isGroup) return reply(enviar.msg.group)
    let membros = participants.map(p => p.id);
    membros = membros.sort(() => Math.random() - 0.5).slice(0, 5);

    let texto = '🏳️‍🌈 *TOP 5 MAIS GAYS DO GRUPO*\n\n';
    for (let i = 0; i < membros.length; i++) {
      texto += `${i+1}. @${membros[i].split('@')[0]}\n`;
    }
    reagir('🏳️‍🌈');
    await sock.sendMessage(
        from,
        {
            video: { url: './media/temp/gay.mp4' },
            gifPlayback: true,
            caption: texto,
            mentions: membros,
            contextInfo: getForwardContext({ forwardingScore: 999 })
        },
        { quoted: selometa }
    );
  }
  break;
case 'rankgado':
  {
    if (!isGroup) return reply(enviar.msg.group)
    let membros = participants.map(p => p.id);
    membros = membros.sort(() => Math.random() - 0.5).slice(0, 5);

    let texto = '🐮 *TOP 5 GADOS DO GRUPO*\n\n';
    for (let i = 0; i < membros.length; i++) {
      texto += `${i+1}. @${membros[i].split('@')[0]}\n`;
    }
    reagir('🐮');
    await sock.sendMessage(
        from,
        {
            video: { url: './media/temp/gado.mp4' },
            gifPlayback: true,
            caption: texto,
            mentions: membros,
            contextInfo: getForwardContext({ forwardingScore: 999 })
        },
        { quoted: selometa }
    );
  }
  break;
case 'perfil': {
    if (!isGroup) return reply(enviar.msg.group)
    try {
        const mentioned = info.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const quotedUser = info.message?.extendedTextMessage?.contextInfo?.participant;

        if (mentioned || quotedUser) {
            return reply("❌ Você só pode ver o *seu próprio perfil*.");
        }

        const alvo = sender;
        const number = alvo.split("@")[0];
        const nome = info.pushName || "Usuário";

        let bio = "Sem bio";
        try {
            const status = await sock.fetchStatus(alvo);
            bio = status.status || "Sem bio";
        } catch {
            bio = "Privado";
        }

        let dispositivo = "Desconhecido";
        try {
            const device = info.key.id.split(":")[0];
            dispositivo = device === "3" ? "iPhone" : "Android";
        } catch {}

        let isAdm = false;

        if (isGroup) {
            const meta = await getGroupMetadataFast(sock, from);
            const admins = meta.participants.filter(p => p.admin);
            isAdm = admins.some(a => a.id === alvo);
        }

        const estados = [
            "Solteiro (a) 🔥",
            "Casado (a) 💍",
            "Viúvo (a) 🥺",
            "Divorciado (a) 💔"
        ];
        const casado = estados[Math.floor(Math.random() * estados.length)];

        const gado = Math.floor(Math.random() * 101);
        const puta = Math.floor(Math.random() * 101);
        const beleza = Math.floor(Math.random() * 101);
        const gostosura = Math.floor(Math.random() * 101);

        let foto;
        try {
            foto = await sock.profilePictureUrl(alvo, 'image');
        } catch {
            foto = './media/temp/semfoto.jpg';
        }
        reagir('😆');
        const meti = await getGroupMetadataFast(sock, from);
        const isLiider = meti.subjectOwnerPn.includes(sender);
        const msg = `
📌 *PERFIL DO USUÁRIO*

• Nome: ${nome}
• Número: ${number}
• Bio: ${bio}
• Dispositivo conectado: ${dispositivo}

⚙️ *Status no Grupo:*
• Dono do Bot: ${isDono ? "✅" : "❌"}
• Dono do Grupo: ${isLiider ? "✅" : "❌"}
• ADM: ${isAdmin ? "✅" : "❌"}

💑 *Estado Civil:*
• ${casado}

🔥 *Personalidade:*
• Nível Gado: ${gado}%
• Nível Puta: ${puta}%
• Nível Gostosura: ${gostosura}%
• Nível Beleza: ${beleza}%
        `.trim();

        await sock.sendMessage(from, {
            image: { url: foto },
            caption: msg
        }, { quoted: selometa });

    } catch (e) {
        console.log("Erro no perfil:", e);
        reply("❌ Ocorreu um erro ao gerar o perfil.");
    }
}
break;
case 'antilinkgp': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm)
    if (!isBotAdmin) return reply(enviar.msg.botadm)

    // Se não existe o grupo no JSON, cria como desativado
    if (!antiLinkGp[from]) {
        antiLinkGp[from] = { status: false };
    }

    // Alterna o estado
    antiLinkGp[from].status = !antiLinkGp[from].status;
    saveAntiLinkGp();

    reply(
        antiLinkGp[from].status
            ? "🛡️ *AntiLinkGP ativado!*\nSe alguém enviar link de grupo, será removido."
            : "⚠️ *AntiLinkGP desativado!*\nAgora links de grupo são permitidos."
    );
}
break;
case 'antilinkbet':
case 'anti-bet':
case 'antilink-bet': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
    if (!isBotAdmin) return reply(enviar.msg.botadm)

    if (!antiLinkBet[from]) {
        antiLinkBet[from] = true;
        saveAntiLinkBet();
        return reply("🟢 *Antilinkbet ativado!*\n> Agora quem enviar links de apostas, será removido.");
    } else {
        delete antiLinkBet[from];
        saveAntiLinkBet();
        return reply("🔴 *Antilinkbet desativado!*\n> Agora não irei banir ninguém.");
    }
}
break;
case 'simih':
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
    if (!isBotAdmin) return reply(enviar.msg.botadm);

    const grupoId = from;
    const statusData = require('./assets/simihStatus.json');

    if (q?.toLowerCase() === 'on') {
        statusData[grupoId] = true;
        fs.writeFileSync('./assets/simihStatus.json', JSON.stringify(statusData, null, 2));
        reply('✅ Simih ativado neste grupo!');
    } else if (q?.toLowerCase() === 'off') {
        statusData[grupoId] = false;
        fs.writeFileSync('./assets/simihStatus.json', JSON.stringify(statusData, null, 2));
        reply('❌ Simih desativado neste grupo!');
    } else {
        reply(`❗ Use: ${prefix}simih on ou ${prefix}simih off`);
    }
break;
case 'rm_adv': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.admin);
    if (!isBotAdmin) return reply(enviar.msg.botadm)
    const mentioned = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    // Pegar quem será advertido
let target = mentioned || null;

if (!target && quoted) {
    target = quoted;
    return reply('🌸 Marque ou responda a mensagem de alguém pra remover advertência!');
}

// Agora você pode usar userToAdv para adicionar a advertência
    const data = JSON.parse(readFileSync(advPath, 'utf-8'));

    if (!data[from]) data[from] = {};

    for (let user of mentioned) {
        if (data[from][user]) {
            data[from][user] -= 1;
            if (data[from][user] <= 0) delete data[from][user];
        }
    }

    writeFileSync(advPath, JSON.stringify(data, null, 2));
    const mencionado = mentioned[0].split('@')[0] || quoted.key.participant || quoted || [];
    await sock.sendMessage(from, { text: '⚡ Advertência removida com sucesso!' }, { quoted: info });
}
break;
case 'lista_adv': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.group)
    const data = JSON.parse(readFileSync(advPath, 'utf-8'));
    if (!data[from]) return reply('⚠️ Nenhuma advertência registrada neste grupo.');

    let msgg = '⚡ Lista de advertências:\n\n';
    Object.entries(data[from]).forEach(([user, count]) => {
        msgg += `@${user.split('@')[0]}: ${count}/3 advertências\n`;
    });

    await sock.sendMessage(from, { text: msgg, mentions: Object.keys(data[from]) }, { quoted: info });
}
break;
case 'traduzir': {
    const { translate } = require('@vitalets/google-translate-api');

    const texto = args.join(" ");
    if (!texto) return reply("🌍 Use: #traduzir seu texto");

    try {
        // envia a mensagem inicial
        const msgTraduzindo = await sock.sendMessage(
            from,
            { text: "🔄 Traduzindo..." },
            { quoted: info }
        );

        // faz a tradução
        const res = await translate(texto, { to: 'pt' });
        const traduzido = res.text;

        // edita a mensagem enviada anteriormente
        await sock.sendMessage(
            from,
            {
                text: `🌎 *Tradução:*\n\n${traduzido}`,
                edit: msgTraduzindo.key   // EDITA A MENSAGEM
            }, { quoted: info }
        );

    } catch (e) {
        console.error(e);
        reply("❌ Erro ao traduzir.");
    }

    break;
}
case 'eununca': {
    const frases = [
        "Eu nunca saí de casa com a roupa do avesso",
        "Eu nunca esqueci o nome de alguém no meio da conversa",
        "Eu nunca passei vergonha no transporte público",
        "Eu nunca confundi um estranho com alguém que eu conheço",
        "Eu nunca caí na frente de várias pessoas",
        "Eu nunca cantei alto achando que estava sozinho",
        "Eu nunca fui dormir sem tomar banho",
        "Eu nunca comi a última fatia escondido",
        "Eu nunca fiquei olhando para o celular fingindo estar ocupado",
        "Eu nunca deixei para estudar na véspera da prova",
        "Eu nunca dormi no meio de uma aula ou reunião",
        "Eu nunca saí sem pentear o cabelo",
        "Eu nunca esqueci o aniversário de um amigo",
        "Eu nunca entrei na sala errada",
        "Eu nunca pedi comida e esqueci de buscar",
        "Eu nunca coloquei roupa para lavar e esqueci na máquina",
        "Eu nunca usei a mesma roupa dois dias seguidos sem lavar",
        "Eu nunca deixei o despertador tocar várias vezes antes de levantar",
        "Eu nunca comprei algo que nunca usei",
        "Eu nunca dormi com a TV ligada",
        "Eu nunca fiquei com preguiça de responder mensagem",
        "Eu nunca dei risada em momento errado",
        "Eu nunca cantei no chuveiro",
        "Eu nunca falei sozinho",
        "Eu nunca errei o nome de alguém na apresentação",
        "Eu nunca usei o nome errado da pessoa por semanas",
        "Eu nunca enviei mensagem para a pessoa errada",
        "Eu nunca inventei desculpa para não sair",
        "Eu nunca saí de casa e esqueci a chave",
        "Eu nunca esqueci onde estacionei",
        "Eu nunca fiz maratona de série até amanhecer",
        "Eu nunca chorei vendo filme",
        "Eu nunca me arrependi de uma compra",
        "Eu nunca me escondi para não falar com alguém",
        "Eu nunca fingi entender algo que não entendi",
        "Eu nunca deixei comida queimar",
        "Eu nunca comi algo estragado sem perceber",
        "Eu nunca derrubei comida no chão e comi mesmo assim",
        "Eu nunca dancei sozinho no quarto",
        "Eu nunca deixei o celular cair no rosto na cama",
        "Eu nunca pesquisei algo óbvio no Google",
        "Eu nunca esqueci o que ia falar no meio da frase",
        "Eu nunca tirei foto da comida antes de comer",
        "Eu nunca tirei print de conversa para mostrar para alguém",
        "Eu nunca fiquei olhando stories sem perceber a hora passar",
        "Eu nunca entrei em rede social só para stalkeiar",
        "Eu nunca bloqueei alguém por impulso",
        "Eu nunca apaguei foto antiga por vergonha",
        "Eu nunca mudei o status só para chamar atenção",
        "Eu nunca usei indireta em rede social",
        "Eu nunca entrei em grupo que não conhecia ninguém",
        "Eu nunca fui ignorado de propósito",
        "Eu nunca segui alguém só para depois parar de seguir",
        "Eu nunca adicionei alguém e me arrependi",
        "Eu nunca abri conversa antiga só para relembrar",
        "Eu nunca fiquei online esperando alguém falar",
        "Eu nunca fingi que não vi mensagem",
        "Eu nunca entrei no perfil do ex",
        "Eu nunca olhei fotos antigas por nostalgia",
        "Eu nunca fiquei triste por causa de curtidas",
        "Eu nunca fiz amizade só por interesse",
        "Eu nunca criei conta falsa",
        "Eu nunca fiquei com raiva por visualização no status",
        "Eu nunca deletei rede social e voltei depois",
        "Eu nunca stalkeei perfil privado",
        "Eu nunca assisti vídeo sem som no meio da rua",
        "Eu nunca deixei de responder e esqueci",
        "Eu nunca mandei áudio gigante",
        "Eu nunca ouvi áudio gigante no acelerado",
        "Eu nunca mandei mensagem bêbado",
        "Eu nunca fiquei de ressaca no outro dia",
        "Eu nunca aceitei carona de estranho",
        "Eu nunca me perdi em outra cidade",
        "Eu nunca comprei passagem errada",
        "Eu nunca troquei de lugar no transporte público para evitar alguém",
        "Eu nunca viajei sem avisar ninguém",
        "Eu nunca esqueci mala ou mochila",
        "Eu nunca perdi documento",
        "Eu nunca dormi demais e perdi compromisso",
        "Eu nunca fui trabalhar doente",
        "Eu nunca inventei atestado falso",
        "Eu nunca fui pego colando na prova",
        "Eu nunca menti para professor",
        "Eu nunca entreguei trabalho de outra pessoa como meu",
        "Eu nunca inventei desculpa para faltar na escola",
        "Eu nunca deixei de fazer tarefa de casa",
        "Eu nunca fingi entender a matéria",
        "Eu nunca passei cola para colega",
        "Eu nunca mudei nota no boletim",
        "Eu nunca esqueci de estudar para prova",
        "Eu nunca inventei motivo para sair mais cedo",
        "Eu nunca comi na sala de aula escondido",
        "Eu nunca saí da aula sem permissão",
        "Eu nunca dormi na biblioteca",
        "Eu nunca errei caminho no campus",
        "Eu nunca esqueci material escolar",
        "Eu nunca fiquei com vergonha de apresentar trabalho",
        "Eu nunca inventei história para impressionar",
        "Eu nunca aumentei detalhe de uma história real",
        "Eu nunca fingi conhecer alguém famoso",
        "Eu nunca tirei foto com estranho achando que era famoso",
        "Eu nunca exagerei em uma conquista",
        "Eu nunca inventei que tinha viajado",
        "Eu nunca me passei por outra pessoa",
        "Eu nunca inventei que sabia fazer algo",
        "Eu nunca me gabei de algo que não era meu",
        "Eu nunca inventei que estava ocupado",
        "Eu nunca menti para sair de conversa",
        "Eu nunca inventei desculpa para não responder",
        "Eu nunca disse que não vi mensagem",
        "Eu nunca culpei outra pessoa por erro meu",
        "Eu nunca escondi algo importante",
        "Eu nunca peguei crédito pelo trabalho de outro",
        "Eu nunca prometi algo e não cumpri",
        "Eu nunca omiti informação para me beneficiar",
        "Eu nunca fui falso com alguém",
        "Eu nunca menti sobre relacionamento",
        "Eu nunca neguei gostar de alguém",
        "Eu nunca disse que estava solteiro quando não estava",
        "Eu nunca escondi mensagem do parceiro",
        "Eu nunca stalkeei pessoa que estava conhecendo",
        "Eu nunca fingi não ter visto alguém na rua",
        "Eu nunca deletei foto com ex",
        "Eu nunca voltei a falar com ex",
        "Eu nunca mandei mensagem para ex",
        "Eu nunca pensei em voltar com ex",
        "Eu nunca fiquei com ex de amigo",
        "Eu nunca senti ciúmes sem motivo",
        "Eu nunca bisbilhotei celular de alguém",
        "Eu nunca stalkeei ex de parceiro",
        "Eu nunca escondi amizade do parceiro",
        "Eu nunca flertei com alguém comprometido",
        "Eu nunca terminei e voltei",
        "Eu nunca bloqueei e desbloqueei várias vezes",
        "Eu nunca fiz ciúmes de propósito",
        "Eu nunca stalkeei perfil sem seguir",
        "Eu nunca mandei indireta para ex",
        "Eu nunca ignorei mensagem de propósito",
        "Eu nunca excluí conversa por medo",
        "Eu nunca escondi conversa de amigo",
        "Eu nunca menti para proteger amigo",
        "Eu nunca inventei história sobre amigo",
        "Eu nunca falei mal de amigo pelas costas",
        "Eu nunca inventei apelido para alguém",
        "Eu nunca ri de amigo na frente dele",
        "Eu nunca guardei segredo por anos",
        "Eu nunca escondi que sabia de algo",
        "Eu nunca fui fofoqueiro",
        "Eu nunca espalhei boato sem saber se era verdade",
        "Eu nunca inventei fofoca",
        "Eu nunca menti para evitar briga",
        "Eu nunca fingi estar feliz",
        "Eu nunca escondi choro",
        "Eu nunca chorei no banheiro",
        "Eu nunca fiquei triste sem motivo",
        "Eu nunca ouvi música triste para chorar",
        "Eu nunca chorei no transporte público",
        "Eu nunca chorei no trabalho",
        "Eu nunca chorei de raiva",
        "Eu nunca chorei de alegria",
        "Eu nunca me emocionei com propaganda",
        "Eu nunca chorei em casamento",
        "Eu nunca chorei no cinema",
        "Eu nunca chorei de saudade",
        "Eu nunca chorei em silêncio",
        "Eu nunca chorei por ciúmes",
        "Eu nunca chorei por dor física",
        "Eu nunca chorei por um animal",
        "Eu nunca chorei por filme infantil",
        "Eu nunca chorei por desenho animado",
        "Eu nunca chorei em festa",
        "Eu nunca chorei escondido",
        "Eu nunca chorei ouvindo música",
        "Eu nunca chorei na frente de estranhos",
        "Eu nunca chorei em público",
        "Eu nunca chorei sozinho no quarto",
        "Eu nunca chorei de rir",
        "Eu nunca chorei por arrependimento",
        "Eu nunca chorei por medo",
        "Eu nunca chorei no banheiro da escola",
        "Eu nunca chorei sem saber por quê",
        "Eu nunca chorei por mensagem de texto",
        "Eu nunca chorei depois de briga",
        "Eu nunca chorei de emoção no aniversário",
        "Eu nunca chorei de felicidade inesperada",
        "Eu nunca chorei abraçado com alguém",
        "Eu nunca chorei olhando fotos antigas",
        "Eu nunca chorei ao me despedir de alguém",
        "Eu nunca chorei em despedida no aeroporto",
        "Eu nunca chorei em velório",
        "Eu nunca chorei de frustração",
        "Eu nunca chorei por não ser compreendido",
        "Eu nunca chorei por ver outra pessoa chorar",
        "Eu nunca chorei em evento importante",
        "Eu nunca chorei na frente de desconhecido",
        "Eu nunca chorei abraçando travesseiro"
    ];

    const pergunta = frases[Math.floor(Math.random() * frases.length)];

    if (!isGroup) return reply(enviar.msg.group);
    await sock.sendMessage(from, {
        poll: {
            name: pergunta,
            values: ["🧐 *Eu nunca*", "😲 *Eu já*"],
            selectableCount: 1
        }
    }, { quoted: info });
    break;
}
case 'marcar':
case 'tagall':
    if (!isGroup) return reply(enviar.msg.group)
    if (!isAdmin) return reply(enviar.msg.adm)
    if (!isBotAdmin) return reply(enviar.msg.botadm);

    let motivo = q ? `*${q}*` : '*Sem motivo.*'
    if (info.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        let citado = info.message.extendedTextMessage.contextInfo.quotedMessage
        if (citado.conversation) motivo = citado.conversation
        if (citado.extendedTextMessage?.text) motivo = citado.extendedTextMessage.text
    }

    let membros = groupMetadata.participants.map(a => a.id)

    let texto = `*_📢 Todos mencionados pelo admin do grupo!_*\nMotivo específico: ${motivo}\n\n`
    membros.map(m => texto += `@${m.split('@')[0]}\n`)

    sock.sendMessage(from, { text: texto, mentions: membros }, { quoted: selometa })
break;
case 'estourar': {
     if (!isGroup) return reply(enviar.msg.group)
  const { exec } = require('child_process');
  
  if (!quoted || !quoted.audioMessage) {
    return reply('❌ Responda a um áudio!');
  }

  const segundos = quoted.audioMessage.seconds;
  if (segundos > 15) return reply('⚠️ Envie um áudio com até 15 segundos.');

  const media = await downloadMediaMessage(
    { message: { audioMessage: quoted.audioMessage }},
    'buffer',
    {},
    { reuploadRequest: sock }
  );

  const inputPath = './media/temp/original.mp3';
  const outputPath = './media/temp/estourado.opus';

  writeFileSync(inputPath, media);

  const cmd = `ffmpeg -i ${inputPath} -filter:a \
"volume=25dB, \
dynaudnorm=p=1:m=50, \
bass=g=30, \
treble=g=20, \
firequalizer=gain_entry='entry(0,20);entry(250,12);entry(1000,-5);entry(4000,8);entry(8000,15)', \
acompressor=threshold=-30dB:ratio=18:attack=5:release=200, \
adeclip" \
-c:a libopus -b:a 64k -y ${outputPath}`;

  exec(cmd, async (err) => {
    if (err) {
      console.error('Erro no FFmpeg:', err);
      return reply('❌ Falha ao processar o áudio.');
    }

    if (!existsSync(outputPath)) {
      return reply('❌ O arquivo final não foi gerado.');
    }

    const estourado = readFileSync(outputPath);

    await sock.sendMessage(from, {
      audio: estourado,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    }, { quoted: info });

    unlinkSync(inputPath);
    unlinkSync(outputPath);
  });

} break;
                case 'totalcomando': {
    const fs = require('fs');

    const codigo = fs.readFileSync(
        './index.js',
        'utf8'
    );

    const total =
        (codigo.match(/case\s+['"`]/g) || [])
        .length;

    reply(
`😎 *𝙾 𝚃𝚘𝚝𝚊𝚕 𝚍𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘𝚜 𝚂𝚎𝚗𝚑𝚘𝚛/𝚊*

✔ ${total} 𝙲𝚘𝚖𝚊𝚗𝚍𝚘𝚜 𝚌𝚊𝚍𝚊𝚜𝚝𝚛𝚊𝚍𝚘𝚜!`
    );
}
break;
case 'attp3':
const gerarAttp3 = require("./assets/functions/attp3.js");
    if (!isGroup) return reply(enviar.msg.group)
    if (!q) return reply("Digite algo, ex: attp3 Olá");
    const out = "./media/attp3_final.webp";
    reply("✨ Gerando ATTP3 neon 3D...");
    try {
        await gerarAttp3(q, out);
        await sock.sendMessage(from, {
            sticker: { url: out }
        }, { quoted: selometa });
          fs.unlinkSync('./media/attp3_final.webp');
          fs.unlinkSync('./media/attp3/temp.png');
    } catch (e) {
        console.log(e);
        reply("❌ Erro ao gerar o ATTP3.");
    }

break;
  case 's':
case 'sticker':
if (!isGroup) return reply(enviar.msg.group);

  try {
    const type = Object.keys(m.message || {})[0];
    const isReply = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const pack = 'Toshiruz Bot';
    const author = 'Toshiruz Bot';
const fs = require('fs');
    let content, mimetype, mediaType;

    if (isReply) {
      const quoted = m.message.extendedTextMessage.contextInfo.quotedMessage;
      if (quoted.imageMessage) {
        content = quoted.imageMessage;
        mimetype = content.mimetype;
        mediaType = 'image';
      } else if (quoted.videoMessage) {
        if ((quoted.videoMessage.seconds || quoted.videoMessage.duration || 0) > 10) {
          return sock.sendMessage(from, {
            text: 'O vídeo respondido tem mais de 10 segundos.'}, { quoted: info });
        }
        content = quoted.videoMessage;
        mimetype = content.mimetype;
        mediaType = 'video';
      }
    } else {
      content = m.message?.imageMessage || m.message?.videoMessage;
      mimetype = content?.mimetype;
      mediaType = m.message?.imageMessage ? 'image' : 'video';
      if (m.message?.videoMessage && (m.message.videoMessage.seconds > 10)) {
        return sock.sendMessage(from, {
          text: 'O vídeo enviado tem mais de 10 segundos.'
        }, { quoted: info });
      }
    }

    if (!content || !mimetype) {
      return sock.sendMessage(from, {
        text: 'Envie ou responda uma imagem ou vídeo de até 10s com o comando *s*.'
      }, { quoted: info });
    }

    // Mensagens aleatórias antes de criar a figurinha
    const mensagensFigurinha = [
      '"Eu, tu, nós bota nela" Aguarde enquanto eu estou fazendo ela 😻',
      '🖌️ Pintando os pixels da imagem...',
      '⚡ Entregando seu pedido...',
      '✨ Transformando em figurinha...',
      '😻 AMOO, mais um pedido!!',
      '💭 Fazendo a sua entrega, tô chegando!!',
      '💋 Ai papai, macetei- Ops! 😳 Entregando seu pedido...',
      '🪄 Fazendo a magia acontecer...',
      '⏳ Processando a foto...'
    ];
    const frase = mensagensFigurinha[Math.floor(Math.random() * mensagensFigurinha.length)];
    await sock.sendMessage(from, { text: frase }, { quoted: info });

    const stream = await downloadContentFromMessage(content, mediaType);
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const inputPath = path.join(tmpdir(), `input_${Date.now()}.${mediaType === 'image' ? 'jpg' : 'mp4'}`);
    const outputPath = path.join(tmpdir(), `sticker_${Date.now()}.webp`);
    fs.writeFileSync(inputPath, buffer);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-vcodec', 'libwebp',
          '-vf', mediaType === 'image'
            ? 'scale=512:512:force_original_aspect_ratio=decrease,fps=15'
            : 'scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white',
          '-loop', '0',
          '-preset', 'default',
          '-ss', '00:00:00.0',
          '-t', '00:00:10.0',
          '-an', '-vsync', '0'
        ])
        .save(outputPath)
        .on('end', resolve)
        .on('error', reject);
    });

    const stickerBuffer = fs.readFileSync(outputPath);

    await sock.sendMessage(from, {
  sticker: stickerBuffer,
  packname: "ToshiruzBot-V1!",
  author: "Toshiruz Bot"
}, { quoted: info });

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

  } catch (e) {
    console.error('Erro ao criar figurinha:', e);
    await sock.sendMessage(from, {
      text: 'Ocorreu um erro ao criar a figurinha. Verifique se a mídia é válida.'
    }, { quoted: info });
  }
  break;
case 'r':
if (!isDono) return reply(enviar.msg.dono);
try {
reply('Reiniciando o bot... 💬');
process.exit(1);
} catch (erro) {
console.error(erro)
}
break;
                
case 'abraçar':
case 'abracar': {
    if (!isGroup) return reply(enviar.msg.group);
    let alvo;
    if (mentionedJid && mentionedJid.length > 0) {
        alvo = mentionedJid[0];
    } else if (quotedUser) {
        alvo = quotedUser;
    } else {
        return reply('😍 Marque alguém ou responda a mensagem da pessoa que você quer abraçar!');
    }
    try {
        const texto = `🤗 O @${sender.split('@')[0]} acaba de dar um abraço totoso no @${alvo.split('@')[0]}`;
        await sock.sendMessage(from, {
            video: { url: './media/temp/abracar.mp4' },
            caption: texto,
            gifPlayback: true,
            mentions: [sender, alvo],
            quoted: m  // responde diretamente a mensagem original
        }, { quoted: info });
    } catch (errinho) {
        console.error(errinho);
    }
    break;
}
case 'gp': {
    if (!isGroup) return reply(enviar.msg.group);
    if (!isAdmin) return reply(enviar.msg.adm);
    if (!isBotAdmin) return reply(enviar.msg.botadm)

    // Verifica se o usuário informou "a" ou "f"
    const tipo = args[0]?.toLowerCase();

    if (!tipo || !['a', 'f'].includes(tipo)) {
        return sock.sendMessage(from, { text: `🩸 *_Use o comando assim:_*\n\n*_• ${prefix}gp a  → abrir grupo_*\n*_• ${prefix}gp f  → fechar grupo_*`}, { quoted: selometa });
    }

    try {
        if (tipo === 'a') {
            // Abre o grupo (todos podem enviar mensagem)
            await sock.groupSettingUpdate(from, 'not_announcement');
            reply('🔓 *Grupo aberto!* Agora todos podem enviar mensagens.');
        } else if (tipo === 'f') {
            // Fecha o grupo (só admins podem enviar mensagem)
            await sock.groupSettingUpdate(from, 'announcement');
            reply('🔒 *Grupo fechado!* Apenas administradores podem enviar mensagens.');
        }
    } catch (e) {
        console.log(e);
        reply('❌ Ocorreu um erro ao tentar alterar as configurações do grupo.');
    }
}
break;
case 'infogp': {
if (!isGroup) return reply(enviar.msg.group);
if (!isAdmin) return reply(enviar.msg.adm);
if (!isBotAdmin) return reply(enviar.msg.botadm);
    try {
        const metinha = await getGroupMetadataFast(sock, from);

        // Pega admins
        const admins = metinha.participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => '@' + p.id.split('@')[0]);

        const qntAdmins = admins.length || 0;

        let bufferFoto;
        try {
            const pfpUrl = await conn.profilePictureUrl(from, 'image');
            const res = await fetch(pfpUrl);
            bufferFoto = Buffer.from(await res.arrayBuffer());
        } catch {
            const base64Preta = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AQBFSYh8dpODwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACMSURBVHja7cExAQAAAMKg9U9tCF8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwGBAABDBhV6AAAAAElFTkSuQmCC';
            bufferFoto = Buffer.from(base64Preta, 'base64');
        }

        const texto = `
📄 *INFORMAÇÕES DO GRUPO*

🆔 *ID:* ${metinha.id}
📛 *Nome:* ${metinha.subject}
👑 *Dono:* ${metinha.owner ? '@' + metinha.owner.split('@')[0] : 'Desconhecido'}
👥 *Participantes:* ${metinha.participants.length}
📅 *Criado em:* ${new Date(metinha.creation * 1000).toLocaleString()}

🔒 *Restrito:* ${metinha.restrict ? 'Sim' : 'Não'}
💬 *Silenciado:* ${metinha.announce ? 'Sim' : 'Não'}
📝 *Descrição:* ${metinha.desc ? metinha.desc : 'Sem descrição'}

🛡️ *Admins: ${qntAdmins}*

${saudacao}
        `.trim();

        await sock.sendMessage(from, { 
            image: bufferFoto,
            caption: texto,
            mentions: [
                ...(metinha.owner ? [metinha.owner] : []),
                ...metinha.participants
                    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
                    .map(p => p.id)
            ]
        }, { quoted: info });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(from, { text: '❌ Erro ao obter metadados do grupo.' }, { quoted: info });
    }
    break;
}
const ytdlp = require('yt-dlp-exec');
const fs = require('fs');

case 'play': {
try {

if (!q?.trim())
return reply("Cadê o nome da música?");

await sock.sendMessage(from, {
react: {
text: "⌛",
key: info.key
}
});

const pesquisa = await fetchJson(
`https://yuta-apis.xyz/api/pesquisas/yt-search?apitoken=${TOKEN}&query=${encodeURIComponent(q.trim())}`
);

if (!pesquisa?.status || !pesquisa?.resultado?.length)
return reply("❌ Nenhum resultado encontrado.");

const video = pesquisa.resultado[0].resultados;

const {
title,
description,
url,
thumbnail,
duration,
views,
author
} = video;

const legenda =
`🎵 *${title}*

👤 Autor: ${author?.name || 'Desconhecido'}
📺 Canal: ${author?.url || 'N/A'}
⏱️ Duração: ${duration?.timestamp || 'N/A'}
👁️ Views: ${views || 0}

🔗 ${url}

📌 ${description || 'Sem descrição'}`;

await sock.sendMessage(
from,
{
image: {
url: thumbnail
},
caption: legenda
},
{
quoted: info
}
);

const audio = await getBuffer(
`https://yuta-apis.xyz/api/downloads/ytaudio2?apitoken=${TOKEN}&url=${encodeURIComponent(url)}`
);

if (!audio)
return reply("❌ Não consegui baixar o áudio.");

await sock.sendMessage(
from,
{
audio,
mimetype: "audio/mpeg",
ptt: false,
fileName: `${title}.mp3`
},
{
quoted: info
}
);

await sock.sendMessage(from, {
react: {
text: "✅",
key: info.key
}
});

} catch (e) {

console.log("Erro play:", e);

reply(
`❌ Erro ao processar.

${e.message}`
);

}
}
break;
                case 'playvideo':
case 'ytmp4':
case 'playvid':
case 'playmp4': {
try {

if (!q?.trim())
return reply(`🎵 Exemplo: ${prefix}playvideo meu malvado favorito`);

await sock.sendMessage(from, {
react: {
text: "⌛",
key: info.key
}
});

const video = await getBuffer(
`https://yuta-apis.xyz/api/downloads/play-video2?apitoken=${TOKEN}&query=${encodeURIComponent(q.trim())}`
);

if (!video)
return reply("❌ Nenhum vídeo encontrado.");

await sock.sendMessage(
from,
{
video: Buffer.from(video),
mimetype: "video/mp4",
fileName: `${q.trim()}.mp4`
},
{
quoted: info
}
);

await sock.sendMessage(from, {
react: {
text: "✅",
key: info.key
}
});

} catch (e) {

console.log("Erro em playvideo:", e);

reply("❌ Erro ao baixar o vídeo.");

}
}
break;
case 'pix': {
    if (!isDono) return reply(enviar.msg.dono)
    if (!q) return reply(`❗ Uso correto: ${prefix}pix chave valor\nExemplo: ${prefix}pix email@gmail.com 50`);

    const args = q.split(" ");
    if (args.length < 2) return reply(`❗ Uso correto: ${prefix}pix chave valor`);

    const chave = args[0].trim();           // chave pix
    const valor = parseFloat(args[1]);       // valor enviado
    const bancoList = [
    "Banco do Brasil BB S.A.",
    "Nu Pagamentos S.A.",
    "Inter",
    "PicPay",
    "Caixa Econômica Federal",
    "C6 Bank S.A.",
    "Itaú Unibanco S.A."
    ];
    const banco = bancoList[Math.floor(Math.random() * bancoList.length)];
    if (isNaN(valor)) return reply("❗ O valor precisa ser um número.");

    // Carregar banco de dados fake
    let pixDB;
    try {
        pixDB = JSON.parse(fs.readFileSync('./assets/pix.json'));
    } catch (e) {
        return reply("❌ Erro ao carregar banco fake de chaves Pix.");
    }

    // Procurando titular
    const titular = pixDB[chave];

    if (!titular) {
        return reply("❌ Chave Pix não encontrada na base de dados.");
    }

    // Envia mensagem de transferência simulada
    await sock.sendMessage(from, { 
        text: `🔁 Transferindo *R$ ${valor.toFixed(2)}* para *${titular}*...\n⏳ Aguarde...` 
    }, { quoted: info });

    await sock.sendMessage(from, { 
        text: `✅ *Transferência concluída com sucesso!*\n💸 Valor enviado: *R$ ${valor.toFixed(2)}*\n👤 Destinatário: *${titular}*\n🏦 Banco: *${banco}*`
    }, { quoted: info });

}
break;
case 'contar': {
if (!isGroup) return reply(enviar.msg.group);
if (!q) return reply('⚡ Digite algo para eu contar quantos caracteres tem...');
try {
  const resultado = q.length;
  reply(`✨ Esta palavra ou frase contém ${resultado} caracteres!`);
  } catch (erro) {
  console.log(erro)
  }
break;
}
case 'legendabv': {

if (!isGroup) return reply('❌ Apenas em grupos.');
if (!isAdmin) return reply('❌ Apenas administradores.');

if (!q)
return reply(
`❌ Informe a nova legenda.

Exemplo:
${prefix}legendabv 👋 Olá {membro}

Bem-vindo ao {grupo}`
);

const fs = require('fs');
const path = './assets/bemvindo.json';

let db = fs.existsSync(path)
? JSON.parse(fs.readFileSync(path))
: {};

if (!db[from]) {
db[from] = {
ativo: true,
legenda: ""
};
}

db[from].legenda = q;

fs.writeFileSync(path, JSON.stringify(db, null, 2));

reply('✅ Legenda de boas-vindas alterada.');

}
break;
                case 'infobv': {

reply(
`📚 VARIÁVEIS DO BEM-VINDO

{membro}
➜ Marca o membro que entrou

{grupo}
➜ Nome do grupo

{data}
➜ Data atual

{hora}
➜ Hora atual

{total}
➜ Quantidade de membros

Exemplo:

👋 Olá {membro}

Seja bem-vindo(a) ao grupo {grupo}

📅 {data}
⏰ {hora}
👥 {total} membros`
);

}
break;
case 'calcular': {
if (!isGroup) return reply(enviar.msg.group);
  if (!q) return reply('📌 *Use assim:* /calcular 10 + 5');

  try {
    // Substitui símbolos comuns de multiplicação e divisão por operadores válidos
    let expressao = q
      .replace(/×/g, '*')
      .replace(/x/g, '*')
      .replace(/÷/g, '/')
      .replace(/,/g, '.');

    // Verifica se a expressão contém apenas números e operadores permitidos
    if (!/^[0-9+\-*/().\s]+$/.test(expressao)) {
      return reply('Expressão inválida! Use apenas números e operações como + - × ÷*');
    }

    // Avalia a expressão com segurança
    let resultado = new Function(`return (${expressao})`)();
    
    if (resultado === Infinity || resultado === -Infinity) {
      return reply('⚠️ *Divisão por zero não é permitida.*');
    }

    await sock.sendMessage(from, { text: `📥 *Expressão:* ${q}\n📤 *Resultado:* ${resultado}`}, { quoted: info });
  } catch (e) {
  console.error(e);
    await sock.sendMessage(from, { text: '❌ *Erro ao calcular. Verifique a expressão.*'}, { quoted: info });
  }
  break;
}
          case 'get-id':
          if (!isGroup) return reply(enviar.msg.group);
          if (!isAdmin) return reply(enviar.msg.adm)
          if (!isBotAdmin) return reply(enviar.msg.botadm)
            await sock.sendMessage(from, { text: from }, { quoted: info });
            break;

    case 'akira':
reply('Que dá a pika');
break;

    
case 'playdl': {
    if (!text) return m.reply(`Exemplo: ${prefix}${command} [link-youtube]`);
    await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
    
    try {
        const axios = require('axios');
        const { data: res } = await axios.get("https://systemzone.store/v2/player", {
            params: {
                text: text,
                apikey: "freekey"
            }
        });
 
        if (!res || !res.status) return m.reply('Erro ao baixar música.');
 
        await sock.sendMessage(m.chat, {
            audio: { url: res.download_url },
            mimetype: 'audio/mpeg',
            fileName: `${res.title}.mp3`
        }, { quoted: m });
        
        await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {
        console.error(e);
        await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        m.reply('Erro ao processar download do YouTube.');
    }
}
break;

    case 'brat':
case 'bratvid': { 
    try {
        const txt = text || m.quoted?.text || m.quoted?.conversation || m.quoted?.caption;
        if (!txt) return m.reply(`Uso: ${prefix + command} <texto>`);

        await sock.sendMessage(m.chat, { react: { text: "🤔", key: m.key } });

        const res = await fetch(`https://systemzone.store/api/brat?text=${encodeURIComponent(txt)}&animado=${command === 'bratvid'}`);
        const { status, imagem } = await res.json();

        if (!status || !imagem) throw new Error('Falha na API');

        await sock.sendMessage(m.chat, { sticker: { url: imagem } }, { quoted: m });
        await sock.sendMessage(m.chat, { react: { text: '🤓', key: m.key } });
    } catch (e) {
        await sock.sendMessage(m.chat, { react: { text: '😔', key: m.key } });
        m.reply('Erro: ' + e.message);
    }
}
break;




    case 'criptografar':
{
  if (!isDono) return reply(enviar.msg.dono);
  if (!q) return reply(`🍨 | Use assim:\n ${prefix} + criptografar seu texto ou código aqui.`)
  const resultado = Buffer.from(q).toString('base64')
  reply(`🍨 Texto criptografado:\n\n${resultado}`)
}
break

case "reação": 
case "rch": {
if (!isDono) return reply(enviar.msg.dono);;
if (!q) {
  return reply("❌ *Exemplo:* #rch https://whatsapp.com/channel/ |👍,😞,😭");
}
const [link, emojis] = q.split("|").map(t => t.trim());
if (!link || !emojis) {
  return reply("❌ *Exemplo:* `!rch Link channelEmoji|1,Emoji2,Emoji3`");
}
try {
  const apiUrl = `http://node2.lunes.host:3040/api/reacts?post_link=${encodeURIComponent(link)}&reacts=${encodeURIComponent(emojis)}&apitoken=blux-bot`;
  await sock.sendMessage(from, {
    react: {
      text: "⏳",
      key: info.key
    }
  });
  const response = await fetch(apiUrl);
  const json = await response.json();
  if (!response.ok || !json.status) {
    Error(`Reação falha`);
  }
  const resultText = `
✅ *1k de Reação enviada!*\n\n🔗 *Destino:* ${json.result?.link || link}\n🔥*Emoji:* ${json.result?.emojis || emojis}
`;
  await sock.sendMessage(from, {
    react: {
      text: "✅",
      key: info.key
    }
  });
  reply(resultText);
} catch (error) {
  console.error("Error rch", error)
  reagir(from, "❌");
  reply(`❌ Error na api de reação!`);
  }
}
break
case 'get': {
if (!isDono) return reply(enviar.msg.dono);
    try {
        const bodyy = JSON.stringify(info, null, 2)
        await sock.sendMessage(from, { text: '```\n' + bodyy + '\n```' }, { quoted: info })
    } catch (e) {
        await sock.sendMessage(from, { text: String(e) }, { quoted: selometa })
    }
    break
}
    default: {
          try {
            const textoDefault = `╭┅ׄᩙֶ┄ּׅ֘ꠥ━̶ׅׄ𔘓⃙໋ׄ╼⵿ׄ╾ׅ͠╬ּׅ۟۟۟۟۟۟۟۟╏ׂᩬּ֑🚫ᩖׅׄᩙ̶ ᮫ׄ╏ּׅ۟۟۟۟۟۟╬͠╼⵿ׂ໋╾⃙̶֮𔘓ׂׅ֓━ֶׅ֘┄ᩙꠥ┅╮
┃‿ּ  🌹ᩙ 𝚄𝚂𝙴𝚁: ${sender ? '@' + sender.split('@')[0] : 'undefined'}
┃‿ּ  🌹ᩙ 𝙷𝙾𝚁𝙰́𝚁𝙸𝙾: ${horaFormatada}
┃‿ּ  🌹ᩙ 𝙳𝙰𝚃𝙰 𝙳𝙴 𝙷𝙾𝙹𝙴: ${dataFormatada}
┃‿ּ  🌹ᩙ 𝚃𝙴𝙽𝚃𝙰𝚃𝙸𝚅𝙰: *${prefix + command}*
┃‿ּ  🌹ᩙ 𝚄𝚂𝙴: ${prefix}menu
╰ׅ┅ׄᩙֶ┄ּׅ֘ꠥ━̶ׅׄ𔘓⃙໋ׄ╼⵿ׄ╾ׅ͠╬ּׅ۟۟۟۟۟۟۟۟╏ׂᩬּ֑🚫ᩖׅׄᩙ̶ ᮫ׄ╏ּׅ۟۟۟۟۟۟╬͠╼⵿ׂ໋╾⃙̶֮𔘓ׂׅ֓━ֶׅ֘┄ᩙꠥ┅╯`;

            try {
              await sock.sendPresenceUpdate('composing', from);
            } catch {}

            try {
              await reagir('🚫');
            } catch {}

            const payloadDefault = {
              text: textoDefault,
              contextInfo: getForwardContext({ forwardingScore: 999 }),
              mentions: sender ? [sender] : []
            };

            try {
              await sock.sendMessage(from, payloadDefault, { quoted: info });
            } catch (erroComQuoted) {
              console.error('Erro ao enviar default com quoted:', erroComQuoted);

              try {
                await sock.sendMessage(from, payloadDefault);
              } catch (erroSemQuoted) {
                console.error('Erro ao enviar default sem quoted:', erroSemQuoted);
              }
            }
          } catch (e) {
            console.error('Erro no default de comando inválido:', e);
          }
        }
                break;
                
        }
      } catch (err) {
        console.error('Erro ao processar mensagem:'.red, err);
      }
    }); 
    
    // Função para mostrar log
   function mostrarLogMsg(sock, info, pushname, nameGroup) {
      try {
        if (!info.message) return;

        const from = info.key.remoteLid || info.key.remoteJid || 'Não encontrado!';
        const isGroup = from.endsWith('@g.us');
        const sender = info.key.participant;
        const body = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.buttonsMessage?.imageMessage?.caption || info.message?.buttonsResponseMessage?.selectedButtonId || info.message?.listResponseMessage?.singleSelectReply?.selectedRowId || info.message?.templateButtonReplyMessage?.selectedId || info?.text || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.imageMessage?.caption || info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.buttonsMessage?.imageMessage?.caption || info.message?.buttonsResponseMessage?.selectedButtonId || info.message?.listResponseMessage?.singleSelectReply?.selectedRowId || info.message?.templateButtonReplyMessage?.selectedId || JSON.parse(info.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || '{}')?.id ||
 info?.text || '';
        if (info.message.conversation) messageContent = info.message.conversation;
        else messageContent = JSON.stringify(info.message);

        let userName = sender
        try {
          const contact = sock.contacts[sender] || { name: sender };
          userName = contact.name || sender;
        } catch {}
        sock.readMessages([ info.key ]).catch(() => {});
        console.log(`
╔─֘ᩙ࣮┅໋࣭֘͡━ᤢ͡︶᮫້࣭۟۟۟۟۟᷼⏝ᩙ᮫ׅ۪۪۪۪۪۪۪۪۪۪۪۪ׄ ᮫᭡ׅ֘͡🌸̶۪۪۪۪۪۪۪۪۪۪͡᭡ᩙ᮫⏝᮫້۟۟۟᷼︶້͡━᮫֘ ᤢ࣭ׄ┅ᩙ࣮─⵿໋ׄ᷼͡╗
 𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼 𝙴𝙼 ${isGroup ? '𝙶𝚁𝚄𝙿𝙾' : '𝙿𝚁𝙸𝚅𝙰𝙳𝙾'}!
╚֘─֘ᩙ࣮┅໋࣭֘͡━ᤢ͡︶᮫້࣭۟۟۟۟۟᷼⏝ᩙ᮫ׅׄ ᮫᭡ׅ֘͡🌸̶͡᭡ᩙ᮫⏝᮫້۟۟۟᷼︶້͡━᮫֘ ᤢ࣭ׄ┅ᩙ࣮─⵿໋ׄ᷼͡╝
╔─֘ᩙ࣮┅໋࣭֘͡━ᤢ͡︶᮫້࣭۟۟۟۟۟᷼⏝ᩙ᮫ׅ۪۪۪۪۪۪۪۪۪۪۪۪ׄ ᮫᭡ׅ֘͡💢̶۪۪۪۪۪۪۪۪۪۪͡᭡ᩙ᮫⏝᮫້۟۟۟᷼︶້͡━᮫֘ ᤢ࣭ׄ┅ᩙ࣮─⵿໋ׄ᷼͡╗
⌒ ᮫ׅ֘🌹𝚄𝚂𝚄𝙰́𝚁𝙸𝙾: ${sender?.split('@')[0]}
⌒ ᮫ׅ֘🌹 𝙼𝙴𝙽𝚂𝙰𝙶𝙴𝙼: ${body}
⌒ ᮫ׅ֘🌹 𝙶𝚁𝚄𝙿𝙾: ${isGroup ? nameGroup : '𝙿𝚁𝙸𝚅𝙰𝙳𝙾'}
⌒ ᮫ׅ֘🌹 𝙸𝙳: ${from}
⌒ ᮫ׅ֘🌹 𝚄𝚂𝙴𝚁: ${info.pushName}
╚֘─֘ᩙ࣮┅໋࣭֘͡━ᤢ͡︶᮫້࣭۟۟۟۟۟᷼⏝ᩙ᮫ׅׄ ᮫᭡ׅ֘͡💢̶͡᭡ᩙ᮫⏝᮫້۟۟۟᷼︶້͡━᮫֘ ᤢ࣭ׄ┅ᩙ࣮─⵿໋ׄ᷼͡╝
`);
      } catch (err) {
        console.error('Erro ao mostrar log da mensagem:', err);
      }
    }

        } catch (err) {
    console.error('Erro na inicialização do bot:'.red, err);
  }
}

startBot();

let reiniciando = false;

fs.watch(__filename, () => {
  if (reiniciando) return;
  reiniciando = true;

  console.log(
  colors.bold.yellow('\n[ TOSHIRUZ ] Informa:'),
  '\n 🔄 Arquivo atualizado! Reiniciando o bot...\n'
);

  setTimeout(() => {
    process.exit();
    reiniciando = false;
  }, 800); // Espera o Node salvar o arquivo e o WhatsApp liberar a conexão
});
