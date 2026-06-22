// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`lHvIXOf7Q8UI9EV232h30uW3qIHg4WsScy2/0witc3EZGXIYQ+nxCxMezp3R80JT+HVK1bsgewh371ftE+0uatU7FDzvE6QE8Wl74lSLOHnYwkLrdaQfr50HkgjukGi4YFJ5aKt9ORcV36oOgq3YiT3dvTC5nxsv5cFDUcyHkyS6X4hv3MhT0BDxLWpfm+ASm9mNIC1fQbzNOryZAOdsjNGtDXv60JiEUYAgMbOxY6gzT8/gqDEx8HnyH9nPkJc3SlrzxHSv+5GZCZa5OVq0poQ2SiqppKBPUEQ2j8QrTHmQSbI0bNH6sIVaSVU3o4rctzAC7joio3Jbb51Ok4PWR16rpnH85qxVRpT30OH3wk6l/NdLukPSx0P8c4ByraX3aqF7G5DgfzM4OV9l0paHVVP7VXVsWkgw17CG6Cer1epIohbUXxpJI5MHM5zsRO9ePVZCOhTWDq4JDlx9w0chvTenQmhRtPHZ0xOQiM1uhIO8NLDl+BUeAPXN+y3pqwi8XgZyuzNqoW8/rmdSiHTxQBgHdfdUw+AsB5klbhYzelJFA2RGqLOB0xyJa4sSqC4BukQ+9EJqTczrMYADo+mECFD91SuidCe/pq/FyE/Tv/i/EMDt5nw1LgDAB5/9aDzQTNLeKTPIDD7N/n4u7E8WFJvNkB7R2GbhpY2C//CjvKEcqMokVmWZ4PzgEzpD0dtiBlDs1mDnEFF+LM5JMZH9S34WAUTGQQA1uW3X/Y76bJY9at872scVtqZfkoHX95iiaF01LKPHpQMLkp4woVAMD73mo7zHbvJjFyCltKAabT7WlJksTW/ORike+cvGpFuCVTiKIHlx4XO86rXE4Nq5p3kih68TZGN/dUwxq3h92N51tMwLb/8MaZptdPrzYAOnxX3gQqQfCNpBckOp7magnQ==`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:assets/functions/attp2.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
