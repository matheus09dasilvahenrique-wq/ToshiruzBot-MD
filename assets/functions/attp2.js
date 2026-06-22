const { exec } = require("child_process");
const fs = require("fs");

// Função para quebrar texto automaticamente a cada 7 caracteres
function quebrarTexto(texto, limite = 7) {
    const palavras = texto.split(" ");
    let linhas = [];
    let linhaAtual = "";

    for (let palavra of palavras) {
        if ((linhaAtual + " " + palavra).trim().length > limite) {
            linhas.push(linhaAtual.trim());
            linhaAtual = palavra;
        } else {
            linhaAtual += " " + palavra;
        }
    }

    if (linhaAtual) linhas.push(linhaAtual.trim());

    return linhas.join("\n");
}

async function gerarAttp2(texto, outputWebp) {
    return new Promise((resolve, reject) => {

        // 🔥 Aqui aplica o limite de 7 caracteres
        const textoFormatado = quebrarTexto(texto, 7);

        const comando = `magick -size 512x512 xc:none -gravity center \
-pointsize 120 -stroke cyan -strokewidth 12 -annotate 0 "${textoFormatado.replace(/"/g, '\\"')}" \
-stroke white -strokewidth 2 -annotate 0 "${textoFormatado.replace(/"/g, '\\"')}" \
-fill white -annotate 0 "${textoFormatado.replace(/"/g, '\\"')}" ${outputWebp}`;

        exec(comando, (err) => {
            if (err) return reject(err);

            if (!fs.existsSync(outputWebp))
                return reject(new Error("❌ Falha ao gerar a figurinha (magick não criou o arquivo)"));

            resolve(outputWebp);
        });
    });
}

module.exports = gerarAttp2;