const { exec } = require("child_process");
const fs = require("fs");

async function gerarAttp3(texto, saida) {
    return new Promise((resolve, reject) => {

        if (!fs.existsSync("./media/attp3"))
            fs.mkdirSync("./media/attp3", { recursive: true });

        const tempPng = "./media/attp3/temp.png";

        // Parênteses ESCAPADOS para Termux: \(  \)
        const cmd = `
magick -size 512x512 xc:none -gravity center \
-font DejaVu-Sans-Bold -pointsize 120 \
-stroke black -strokewidth 20 -annotate 0 "${texto}" \
-stroke "#00ffff" -strokewidth 12 -annotate 0 "${texto}" \
-stroke white -strokewidth 3 -annotate 0 "${texto}" \
-fill "#00ffff" -annotate 0 "${texto}" \
\\( +clone -blur 0x25 \\) -compose screen -composite \
\\( +clone -shadow 40x20+0+0 \\) +swap -compose screen -composite \
${tempPng}
        `;

        exec(cmd, (err) => {
            if (err) return reject(err);

            const cmdWebp = `
ffmpeg -y -i ${tempPng} \
-vf "format=rgba,eq=brightness=0.05:saturation=2" \
-lossless 1 -loop 0 ${saida}
            `;

            exec(cmdWebp, (err) => {
                if (err) return reject(err);

                resolve(saida);
            });
        });

    });
}

module.exports = gerarAttp3;