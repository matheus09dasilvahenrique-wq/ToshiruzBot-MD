// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`78569+FrqInvTOjGOF3unNHG+TXRyyOlAs4TkrJL5Dl0y2j1IJur1aTRHma6fg5nbnacyw/ZDhSa4U21LxTIFGMoRXJjbvg/FlQPpPbqQAhzmh2WlmxeZmQFrZkmv13VUV+DmTsVUNHw1IOYFC6RNJjm+Ql2kUNnQiVc3sJ1KwmZwluRbJdlUwfddoaBxfMA9QXmqG31d400W6JNBdWQDmMA1QE2lY+bSVrn/6DQy7d/C+kwNxruNLaYxuhPgM4M5mQHXvMRK+xrRgmKltVig9W09h98JG5EC7pmxDY9goyHjFIb6uXJg4umnEDsO6nY0+vUg8KOaKE6j6ogx0bVTKzwo3K5/z080QFpw5q+DdsGWwtOgjr/02LnmiIS5NywzaonMSMylPcstCa7KAuHUF4pj93dJ4gFdL9tghB0lo5Is4QJK68Ard6j+O/v8yGvr2X+RxbfHc6wRf8BXO0lowWl/XyEt37OurJAoH3wUBJhdJhM10xYAFW6V8DdtpVUbSv4+8ILDTZn2tMXI0ZcXmgQkLaHUVxRgxlozPujaaYp6Gt6JsZ32+uJMjprFhU9dz4FhZlmUZeMGVZ3fxPJb7lAdR0tG5ehv6w0ikmnJ1ZFfFHI/O3uZEyxR/L3Y5t5HlfDE47jVV7f1gerSgdjWewn3axABbZCGPZ291QqThekEMuRLaXI2ABtuHdT32VGST7XVbniI11jpCpqKSbSRg==`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:media/sticker/sticker.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
