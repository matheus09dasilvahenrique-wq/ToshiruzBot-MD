// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`bzP61jKPOD22WJgs/UATim7crUwgDlViDQVCGeHqBz0sfE3mdjdz1Mz0TnGor1V8CHjJAbkhQa4RC7t7R/NQDiqLdh+sh6ygl0dI5r177wQZkCh3wBtaDXuCbpT7BfD0+OSn9I+xbL8atEfsXySpBJSOrmqNF7MNH4zdTh+++nxmQSzUMQ3uZ6XSNwHlZg22MKSmudqk/XljjKD5cOHTY07D+ssF3eG9wyQKGLxUdS46amZx0L5J1/LJR4Rb3P1RNKIzFhMk0V6aul/RfvIQ7SnvkfVstEfJyBj5oJQZvOMmU/YahIfGOhGwug3I/itQ1LHgeos9Gp3XzeNDtws/AFPqZk18YVfrFsr6/Q23BBwDMoSGafN2q5hjEcQUQlnYTQ/guTjfFyHEceOUu2VJOg==`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:assets/functions/fetchJson.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
