// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`y5uGRSWrdRl7AaYvFGpgYKHUvI0iR/sNi8U0g4eA9JD2OBaTCxm33lQ8rv9Toe452iFYqIw8IQp0McVrVudRPc0z9eVIfEfByW7cZ5B46imF/7OgdrMvQnO9tIOlGuOwKQqAkpONNs4tP3jDPtIPmJZ1hIcGvpiRrdT6P7frhElhpFomIxl6QEix9JY8bmjR5Wl8MhvCopzUvGbWqHOu9PzoILycFOEjD/MtW/UnLdZKaanFViTJnIqFpCMmoiYSl3LCZWdXEYcoB2YY5+/vBjdFDRMbLCfMyDgaepxrLftnBNNnu4fhh6CrRXAO3mgtQNHBIz+5t93PYP3VFPOdxbLKeFMDPFvKz0iqLTAhshMTaAxqrQ6++IolhFfmyF4nM7JfPX7M8x0kb+vUNQaisr4fQveRthGBYaSAg4dxZBR8KZ9csm/iMCZUTD4Zf9P5kN9oQPUoonSu3zOAUmFPVq1EmrTk9TvPCRRU0gRUR9yxPcrHRp6XilmFRhEZGHQcwecgHiVLy8/zc5M5BeqRwaDN8O52SsB+opFiw20hL9qXk/QDO9NMI6EyHP7V/VoykgxSTvKeR4mA+cKEGB/Iiv+pNbwHuuqGz4liE8IkG458aXKPRnTAvSPJy4sP6PJvemq9Z/b19e36g1cmAQf1E33pEX6m6LMbtRqaKouPy6+vytj+R3gcoNttqNkhmELBhCq68DIaSG7DYIA3SgtC5PAu0VgPoU13LUdBjwh9Y5bv44tRkdx5cjUf0fLzbZuzYlplUiOD2IU69x7UmgcutukE2DQa6sxeIyrDxEd8mcPtjF9bGzP6nx6UINvifdE5fhTk1KbHQtMrCiZlGmfx4CO9/ToBJq26WIkvaEkO/3X0h28+yv5pjwA2tLjZ3g8WtedAgimSNv3lElRShBt1p2LJbNeIoEd7w2aXTiQZ0VTrZBHy7zyvloTtvSkLP8WkXfvmNeiz/Lk/EUR1WCxsGaoqb5D2+FU1OdAgv1/oqUuUSQz+q7SCKTnCEmhkJJWYmKL7FJB0LOtvK6wS9nEOfBvVLGPjML4fgn/IfvSKNXoc8NqzSbdlsffHDOphldX5PGb6qhg9O/XwYLpYgRamEMb62Gx2qCNECpFHgMeY51ugXJB9OsczuSGbuQwvPx+ZeexYPduXmUhXeUmlnaklq3uROYB9uOP1A2mdNypsuqMezTunIA+7GiqUZINA53xTPGa+wyxuN1OFe/teFi6Jjb/X4xNc29mdRz8Hjkr3LtfOSNWWWfyuSJQH2lmkEL/Ywm0F0lv1Qq+MIq+vXlWXaUnr7vkqi4mgzpBgapbCmDUlnE1k1Veg52thOwTOFNmLyn91Fowmeu+vgbbAWpu8Fw==`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:dono/menus/menudono.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
