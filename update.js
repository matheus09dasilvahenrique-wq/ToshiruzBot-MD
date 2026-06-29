const axios = require('axios');
const fs = require('fs');

const INDEX_URL = "https://raw.githubusercontent.com/matheus09dasilvahenrique-wq/Toshiruz-Bot/main/index.js";
const VERSION_URL = "https://raw.githubusercontent.com/matheus09dasilvahenrique-wq/Toshiruz-Bot/main/version.json";
const LOCAL_VERSION = "./version.json";

async function atualizar(sock, msg, prefix) {
    const from = msg.key.remoteJid;
    const quoted = { quoted: msg };

    try {
        await sock.sendMessage(from, { text: '🔄 Checando atualização...' }, quoted);

        // 1. Pega versão local
        let versaoLocal = { version: "0.0.0", message: "Nenhum" };
        if (fs.existsSync(LOCAL_VERSION)) {
            versaoLocal = JSON.parse(fs.readFileSync(LOCAL_VERSION));
        }

        // 2. Pega versão do GitHub
        const { data: versaoRepo } = await axios.get(VERSION_URL);
        
        if (versaoRepo.version === versaoLocal.version) {
            return await sock.sendMessage(from, { text: `✅ Já tá na v${versaoLocal.version}.\n*Changelog:* ${versaoLocal.message}` }, quoted);
        }

        await sock.sendMessage(from, { text: `⬇️ Nova versão: v${versaoLocal.version} -> v${versaoRepo.version}\n*Novidades:* ${versaoRepo.message}\n\nBaixando...` }, quoted);

        // 3. Baixa só o index.js novo
        const { data: novoIndex } = await axios.get(INDEX_URL);
        fs.writeFileSync('./index.js', novoIndex);

        // 4. Atualiza version.json local
        fs.writeFileSync(LOCAL_VERSION, JSON.stringify(versaoRepo, null, 2));

        await sock.sendMessage(from, { text: `✅ Atualizado para v${versaoRepo.version}\nReiniciando em 3s...` }, quoted);
        
        setTimeout(() => process.exit(1), 3000);

    } catch (e) {
        console.error('[UPDATE ERRO]', e.message);
        await sock.sendMessage(from, { text: `❌ Erro ao atualizar: ${e.message}` }, quoted);
    }
}

module.exports = { atualizar };