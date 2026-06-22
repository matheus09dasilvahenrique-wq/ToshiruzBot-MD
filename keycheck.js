const fs = require('fs')
const crypto = require('crypto')
const os = require('os')

const API_TOSHI = 'https://bubbly-dedication-production-5925.up.railway.app'
const CONFIG_PATH = './dono/configs.json'
const NUMERO_SUPORTE = '558391762245'

function getHWID() {
    const data = os.hostname() + os.platform() + os.arch() + (os.cpus()[0]?.model || 'unknown')
    return crypto.createHash('md5').update(data).digest('hex')
}

function travar(motivo) {
    console.clear()
    console.log('========================================')
    console.log(' TOSHI BOT - BLOQUEADO ')
    console.log('========================================')
    console.log(`\nMOTIVO: ${motivo}\n`)
    console.log(`HWID DESTA MÁQUINA: ${getHWID()}`)
    console.log(`\n1. Abre o arquivo: ${CONFIG_PATH}`)
    console.log(`2. Coloca tua key assim: "key": "TOSHI-XXXX-XXXX-XXXX"`)
    console.log(`3. Salva e reinicia o bot`)
    console.log(`\nNão tem key? Manda o HWID acima pro suporte: +${NUMERO_SUPORTE}`)
    console.log('========================================')
    process.exit(1)
}

module.exports = async function validarKey() {
    let config
    try {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf8')
        config = JSON.parse(raw)
    } catch (e) {
        travar('ERRO AO LER configs.json. Arquivo corrompido ou mal formatado.')
    }

    const key = config.key
    if (!key || key.trim() === "") {
        travar('KEY VAZIA. Cole sua KEY no arquivo:./dono/configs.json')
    }

    const hwid = getHWID()

    try {
        const res = await fetch(`${API_TOSHI}/ativar?key=${key}&hwid=${hwid}`)
        const data = await res.json()

        if (!res.ok ||!data.liberado) {
            const motivo = data.motivo || 'KEY INVÁLIDA'
            if (motivo.includes('OUTRO HOST')) {
                travar('KEY JÁ ESTÁ EM USO EM OUTRO COMPUTADOR!')
            }
            if (motivo.includes('EXPIRADA')) {
                travar('KEY EXPIRADA. Pede outra pro dono.')
            }
            if (motivo.includes('BANIDA')) {
                travar('KEY BANIDA PELO DONO')
            }
            travar(`ACESSO NEGADO: ${motivo}`)
        }

        console.log(`[TOSHI] Liberado! Bem-vindo ${data.nome}`)
        console.log(`[TOSHI] HWID: ${hwid}`)

        setInterval(async () => {
            try {
                const ping = await fetch(`${API_TOSHI}/ping?key=${key}&hwid=${hwid}`)
                const pingData = await ping.json()
                if (!ping.ok || pingData.liberado === false) {
                    travar('KEY FOI BLOQUEADA PELO SERVIDOR')
                }
            } catch (e) {}
        }, 5 * 60 * 1000)

    } catch (err) {
        travar('ERRO AO CONECTAR NA API. Verifique sua internet.')
    }
}