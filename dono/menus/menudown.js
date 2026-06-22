// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`0PKiV5WQOcCLL0w6+d4hUpJQK81eM9FDqsaApJoGXNB2enYgnaMCST/DiK6SezT4Cj29y7OuBKcDkLwXoqoQEef5Ixy8+KnVoOoqxvonI7TmRzDh3us2nxh6TKL6cy/YBbnqBTdIIb5h0dx9jmzsH+nLynUGiYvYBh7sdiPbSpYuL21Ye1tXzb5btKVVM25lFsJjpk7FlAyXXAHCESLgcnoymvAFsEgYSpNpwEZUalzNGXFkw7ESyeMk7TWaDmKhEqBExWxW7dqrfB4adw/YxCWCkaoL1KktOZBrpMvzvd2qDL31/RpjguZbt+HfZmF9DpcCxK76xF5tdOlfb7zVwIq4a/uO6YHNzLJlg3KzuCI1g6wTcPINyl7bhqRXN9NgNeqmNoUuOd9LuLq3Fmc+lpwu/VM/Hdx361JtYLih3VO2Mc30uvXdFJ8zaanujw/EpyHuL+bZGq8N8WT7LvGVLhuwfLI7VWRE/V7Qj9vXMH6ddqaluUwUI2wxogkL80TouqGBVjF+Zn5IPjr5DpRyPKXNYyUYNMYZyizUqIL9LtU=`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:dono/menus/menudown.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
