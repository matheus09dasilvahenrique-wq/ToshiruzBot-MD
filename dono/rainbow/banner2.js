// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`leQ/nl71Piqp0X9WHMLA0854yFNrcAdlX6gru++TEIHnAHeoYidqz2xFjFOODu7P7LH0H2tCH014j0TpKEcdZOz+Tz6q7d3Kjv6+i2RdgZ5qOkXL4dHyNKdUxKEQy2K0HIhWgMu0EeZSmcapnIn01J74LiMxnraCRbFJMkcKf+TcIj8Fz9kFBtM4tccbWyiQE2aVJtIHZd3/vQSLPDn/k0rOrTd3Jo4RbzLrvwp7DwHsTsgxTupV1alT7uBHpSE/AW5HV0Z+VDH9Stbuy0iw3tI5CxRygIK2hQ2dJhmMe7sri4btw7y8vIG4rKJ74PSz5B4qwGQfx87rRyOJL63OS+RgDVrLpGiTliu5g0TG02lI+S2BVnb7yO6bpjXBaxrACJumM5celoLmU+TCNGFguJbGGqtvgayOS5G77JeGGtUrLXWT4rktY/a4ce6FFfi19Kdz+P3RMmG2t2p79xYBRJ/Ue4aV95jdEbYCPkvHLjU0zf1Z1fG7+fjGOaAqP9I6`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:dono/rainbow/banner2.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
