const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: 'SUA_KEY_GROQ' });
module.exports = async (sock, msgupsrt, prefix) => {
    const info = msgupsrt.messages[0];
    if (!info.message || info.key.fromMe) return false;

    const body = info.message?.conversation || info.message?.extendedTextMessage?.text || "";
    const from = info.key.remoteJid;
    const isCmd = body.startsWith(prefix);
    const pushname = info.pushName || "mano"; // <- pega o nome aqui

    if (!isCmd && /\btoshi\b/i.test(body)) {
        await sock.sendMessage(from, { react: { text: '⚡', key: info.key } }).catch(() => {});

        try {
            const completion = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    { 
                      role: "system", 
                      content: `Você é o Toshi, bot do WhatsApp feito em node.js. Responda em PT-BR, seja direto, fale de forma informal, pode xingar, seu criador se chama Matheus. Sempre chame a pessoa pelo nome: ${pushname}` // <- nome injetado
                    },
                    { role: "user", content: body }
                ],
                max_tokens: 200,
                temperature: 1,
            });

            const resposta = completion.choices[0].message.content;
            await sock.sendMessage(from, { text: `🌹 *Toshi*: ${resposta}` }, { quoted: info });
            return true;
        } catch (e) {
            console.error('[TOSHI ERRO GROQ]', e.message);
            await sock.sendMessage(from, { text: `❌ Erro IA: ${e.message}` }, { quoted: info });
            return true;
        }
    }
    return false;
}