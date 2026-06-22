const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Função para quebrar o texto automaticamente a cada 7 caracteres
function quebrarLinhas(texto, limite = 7) {
    const palavras = texto.split(" ");
    let linhas = [];
    let linhaAtual = "";

    for (let palavra of palavras) {
        // Se a palavra sozinha já ultrapassa o limite, quebra no meio
        if (palavra.length > limite) {
            if (linhaAtual) {
                linhas.push(linhaAtual.trim());
                linhaAtual = "";
            }

            while (palavra.length > limite) {
                linhas.push(palavra.slice(0, limite));
                palavra = palavra.slice(limite);
            }

            if (palavra.length > 0) {
                linhaAtual = palavra + " ";
            }

            continue;
        }

        if ((linhaAtual + palavra).length > limite) {
            linhas.push(linhaAtual.trim());
            linhaAtual = palavra + " ";
        } else {
            linhaAtual += palavra + " ";
        }
    }

    if (linhaAtual.trim().length > 0) linhas.push(linhaAtual.trim());

    return linhas.join("\n");
}

async function gerarAttp(texto, outputWebp) {
    return new Promise((resolve, reject) => {
        const pasta = "./media/attp_frames";

        // Remove a pasta inteira e recria zerada
        try {
            if (fs.existsSync(pasta)) fs.rmSync(pasta, { recursive: true, force: true });
            fs.mkdirSync(pasta, { recursive: true });
        } catch (e) {
            console.log("Erro ao limpar pasta:", e);
        }

        // ID único por execução
        const ID = Date.now();

        let cmds = [];

        // Aplicar quebra automática de linha
        const textoFormatado = quebrarLinhas(texto, 7);

        // Gerar 20 frames
        for (let i = 0; i < 20; i++) {
            const hue = Math.floor((i * 360) / 20);

            cmds.push(
                `convert -size 512x512 xc:transparent -gravity center ` +
                `-pointsize 90 -fill "hsl(${hue},100%,50%)" ` +
                `-annotate 0 "${textoFormatado.replace(/"/g, '\\"')}" ` +
                `${pasta}/frame_${ID}_${i}.png`
            );
        }

        // Executa o convert de todos os frames
        exec(cmds.join(" && "), (err) => {
            if (err) return reject("Erro ao gerar frames: " + err);

            const gifPath = "./media/attp.gif";
            const webpPath = outputWebp;

            // Gerar GIF com estabilidade máxima
            const gifCmd = `convert -delay 4 -loop 0 ${pasta}/frame_${ID}_*.png ${gifPath}`;

            exec(gifCmd, (err) => {
                if (err) return reject("Erro ao gerar GIF: " + err);

                // Verificar se o GIF existe e tem tamanho válido
                if (!fs.existsSync(gifPath)) return reject("GIF não foi gerado.");
                if (fs.statSync(gifPath).size < 20) return reject("GIF gerado está vazio.");

                // Converter GIF para WEBP
                const webpCmd =
                    `ffmpeg -y -i ${gifPath} -vcodec libwebp -filter:v fps=fps=15 ` +
                    `-lossless 0 -compression_level 6 -q:v 50 ` +
                    `-loop 0 -preset default -an -fps_mode passthrough ${webpPath}`;

                exec(webpCmd, (err) => {
                    if (err) return reject("Erro ao gerar WEBP: " + err);

                    resolve(webpPath);
                });
            });
        });
    });
}

module.exports = { gerarAttp };