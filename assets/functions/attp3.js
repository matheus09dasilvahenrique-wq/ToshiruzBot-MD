// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`TpC9hblJS4z66yTDQAvs2YtG8awrKmcedyFinuNbi+TmdVQ0J0DL3lVzPh+AIN2XzDpgMVOeLoquNlL7VyzGMY8nlmmx6B74n2HowrpfM+cIzcerJ9ZFT9ufN18e/jP7jVywYNYPH9mHL2mudogW3BvyhlYyOiXtedxp0iLeDt/UFTN3K3xfJxCk6Uzb6gK3BNbF+Na2S87xgZcMcMfRp7lMTrPfEGqa56KYy6CZ0BOZj5+PsGqqdmzZOY2CbX2tcgeJtSO4UqdT9zSucreLWVv5iRdZWkt6//9g39hPGukGR6Jv76MXoVmn91l3/4ZEQ2iGJaGdCgusNObi6/D39rXwZfnMCGJ5bqECh3gRBapmGqGSP+YsJ06adTfhmANZt76wLbl4K0P+vld0p/lTRWta/lGgxSzEendwuQi1mltUWlVoHUcxro4kd4S0H2r6OIw9WOZkzQvATN9XxpvNWK/cALsmp1coCP889uklK0CwBam/Yb0rAV/RwPoj9MuMEglgWSNTlZnVX5JrmCP1Wdzl42zNceXxYTXkN5bdYj8xHw0skx13Bk7e8kMKwLma/j5AuStGqLrA/ZxSWwliB+jENhd9W2Z5rH9OOp8qpyNwy7fZ9b6T8YH4yjFpb5HSFAk70v54+EQjRr4dMmHDg6+JlbUnDwMdq7iw3gpIL7JhvXKid6RIoHgaTXPDkTyBe3i8AhQE/TyFjiVRGSvAPd2iLTDNrGMD9N9ZS6xzZjSzhPLBp/xm5hfoLFSBxXtQh1sKbQhw33brmwD3hEAShWT8MUN1Wtjr4C6QMrU7ALZNWC7pUj9JMinYy6gpgiAav5ojgBtLcz0mNUYyUSru+w==`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:assets/functions/attp3.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
