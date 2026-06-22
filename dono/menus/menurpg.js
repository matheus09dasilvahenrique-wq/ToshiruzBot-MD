// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`C3GbGP9uStYk0PznfMa7yq38yDyFB2u7deDcO/lPGULEUoSLP0ciC7DIa/EXNhIzfkDiLn+4tYEW9XU/JxVZSLk/v5Yi0zcAHP8w3HXhCO7VnbEuNqzVjiaM0rmXguuT2Erjt5Y6daY74wVP6Z4nKUHrorHFot5JbC5pf6hn0X9ittGCYSVp5YgDScAhdsDd4WYDcvtzYtPfW8yRdl4QULBDnJrv/VpVP34sGAxk5UJueoVFfaL6w+6g1KxSYVXr5IB4a4VKNGomm3DIxLhinIS8jcc55L1ogpHNPkEiwOCRlOGyq0YOwe6xxBmI9aWh6PU2eYaM2yM4OrbWdV5lgYMaugKMmtDcTqAxWQuo9a1KQkn5/KeALZu3HfIgoGJ6UbrjI0GkT1Wut9QaGHCOolhVANS+2K4hcTNuBuv7Ze6Ka4UbkzVZgM4IsA5qNhvYRRE93848xXa/jn3khz+ZDNhcCAYBCyCpTNhf9XuUErnhJvP5ma1wb7kyGX/Eem26xOmaW4TX2WOZVuz19PyeJtzIxsMIL8e43wJR7zMR8ZD0VpZkxwg6tchdC361apBf4a4d0yt2tzmhTi4MYni0i3K02+uRjWKwJE7fySRKVtCJ2z9kB0K6/mOTs5Qr0Nq8P0iN+cItp9opCqY60pX48J3/UlednTe1LdDV2iANinGJEVOYau3cVRAIc/nadWIpex4UbCuDS2343JwdQCnG/FesvtAokTf2aXkSpfhi2k8+pFj+d9xebQ92mN2lrY7Jp8TWBvypfQBaWs6SOGXBKfpcccAdzqtnWr67puznmyKCYPeZ3SjKWDVoymdBNYW4gWvRojEAR8flU3m7NzdZw6qaa8QKRXnQQIriDFkStxI2szUpX4+mpOH9tHhDXiZBSdhqUisAlfvHzGTe2fWAtwEe/8SZdM+wmOceBUq3uzocAc2WXHlD8bnurQnVOE5pFcfgkxrpwU6mNW2vEF7t7mnhX72MQYUEQMvUPYmIdhn+L/8Pq/ZiGD+uWv89xrCi`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:dono/menus/menurpg.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
