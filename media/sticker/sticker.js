const fs = require('fs');
const cwebp = require('cwebp-bin'); 
const { execFile } = require('child_process');
const path = require('path');

async function writeExifImg(buffer, metadata = { packname: "ToshiruzBot-V1!", author: info.pushName }) {
  const tmpInput = path.join(__dirname, `input_${Date.now()}.webp`);
  const tmpOutput = path.join(__dirname, `sticker_${Date.now()}.webp`);

  fs.writeFileSync(tmpInput, buffer);

  // Cria exif em base64
  const json = {
    "sticker-pack-id": "com.toshiruz.bot",
    "sticker-pack-name": metadata.packname,
    "sticker-pack-publisher": metadata.author,
    "emojis": []
  };
  let jsonBuff = Buffer.from(JSON.stringify(json), 'utf8');

  // EXIF header
  const exifBuff = Buffer.concat([
    Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00]), 
    jsonBuff
  ]);

  fs.writeFileSync(tmpOutput, exifBuff);

  const finalBuffer = fs.readFileSync(tmpOutput);

  fs.unlinkSync(tmpInput);
  fs.unlinkSync(tmpOutput);

  return finalBuffer;
}

module.exports = { writeExifImg };