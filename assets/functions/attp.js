// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`i6IaqZ+2MYmwEwbrJjKAmEkbGd0V5nGtgjK3tkoH/+StgDr5RuDXiLoc+mzTqCPGVa92CGy+wgDY7z8rC2qlsuqAIg9eq0RCk+jrE3YMZKvx+BVuHvIDh+jWGpPpxCtHDHDxcmGxhivhmCPMeN7DXKry2dIXMf3nQW/H4uW9AC2/sc755yy/fbMRorz1Xi76XzGGibNYV4EyswO4z83Cn9UKMu6GjkHgEhkG9iZCUiP2WkWQyQmf6E623TCQuMKpAJCqOHtbV1BeYqfypz1FcD0Prfjl2mj+/K0xYkqSi7v8/Jlgj8WPuw8Fp5E4S/tjf5UW7xsZKs8HsGHjHN3JM2C4rAW5SaKFietgYv7K+0ecxOlOkGVsRU2c8+GiZY3zGhqYT4UDCvPj7vzlbwPFdpM5MUj46pD/nu4WSLKytyc6xfUe05SIhAZVJY++/sV1Jqw9IFyn1KzlCFAwtrX2fY+T2Isg+Webgu1oBgb+n3C6lCh+2qsuGUolJQKRK7j5ai0tfsP+jur4H+VOLZ6CjPMnMchXueOq4ied1ozFCl6qUo26knArQ81Wi4E8O4seDGeAhxdjEATZ5GVhLosU4JdGopS6Nu15wIIctfDO+farcj3zyT03XnFnnzgUh3j18U9DMw4lLCS7+cxVJjpEAEQElbd5Ix+QhViX0ugg+ALTpsUrAbBHhokz+UEFueqvEqNO8pj8ftSNVsKgfPc5cll4bbCSWPpMkSYZrMWFCObRgLMofPoJ8cWwRP1EqSnzKOTdQWWTmt1B3z4aQ+QzGeCLYPHEasRna72zsC8ftd4aZWEohMWlPfsGG8DWO9TM2INlr2pPr9SvilacJZX4gVvWJKF/40BrPI3uthKbNtOpjcmUpm0/L0bmNcWFNKsISclNeiyhN9yGI9FudEzIhoLE2H90kVGBfXeanugIqVCDGAGHt1bej2w4JUJZY0B/wV+lqdMnSROoU0rE7GrVc6lUSFt8PMKm+YHKx2HMWmuKpeBEK06PINYnkMaJDGrWy4oqVzJl5uziF0M3YNLebs9sezU8juwyGg45rSeVyaR95DurpZ1OZZ2A5QTLqZqYdNJPzahtWCJ+Z0kPn+2Pkp6fqyX+UYqPDOFnHf9uoBc8DFEKXgIfCClmEHvy2hBQFVcxvu8pw3Frn32zsxH+Mvnr1tvmc4JMPR7Y8Gax/P2ZGRRy8sxTmTF8uHlM1qJu5ksbtgoVxXNgBvnhyfInhQsax+dbrpLbSWxHHwuJcM+RysOPt5hnIPvZ8RPYXxFIrrDtHX4vRQSqtcFDRpRNq9/i65dQg3q+f1kWb066sGUOB502GeqHEC9OthbMIkbog0o/K+wNwYMLYPwD05ikcfZurNZMMgkOuoL6fonw0xBebRwa6jxoiP6Hcn+9P59SJnybDr2e14B1mkNcTMPV5DD1yU4+jr3FQQUwBSw1Wd52eEntmeVlHPO6HYvgNbQRmnYx/rHV+KjxI6NB1N6dosnUmuY5ZlvYwpTfvslGDL1Rx6A4o9iU+40slAFfDhSBMLddpYZ4v6zd3J/yJ2aHTFYG7jYCwrF9LYZdRDnz0CADyVEdCN38o+gnkdrEuGItMIFoeLMSByyeZgR5MdLoBFYzOF/XvrrYJWMbtUTEuT2Z0Om2zf6vEM8WvCQ+Por6cLllLmQDHdN9cYauZ7i9PrLvgESmRT75hFwaNvYA9Dwco0bg+Khqqzc5lkGjQ++UncmOVZYqciTFCIle+L6kxcGrj0b28B7mErvWOwmrcvMA+ysaTxG1KFExarrRoSMS`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:assets/functions/attp.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
