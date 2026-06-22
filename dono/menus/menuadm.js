// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`g1ThjuAjbzJYVHK8nSlHbvEnaNm3hrZnx0CnGJ7sSA2vFTAWOIX4CLYd6irz9qjKswxSAq4Y1d+QivofWJzOg6DBKhat0RSpF1M3E4iyK1X/EBw1fjabsfAruojWu92A72HY3mjjDGHdPuPomhpcRlHmxnkurK63v5fSfJM9/dUJYo9pIIzdaOrOdjC4NbnWdzPJjElncJXk5PJM1L6ceeXMPJaWXr0WeOjRPQHsHOczeVg0P46acKvCNDErA/fcKNm/tiDtE154fQK6HvjQUyMHx4Vv09PdIThF6Jjv4SZWxRunsv0PN62H9XqGv5526nCr5xOvMIPSC7wAtuSQIRzni55TPjCvSzwBC8XEP5Itwmj+4pV5+p5NGOzQqc07eOuWU3vQU5ZUtdlgLdXO/Q7hD7EAWKUXQwAQSRQxVTpwhHcBvcmpSwwxt/ZunqSyVWqTdT4EqNPGtSciD2IM+sBJ4eC8W9WWaX+7iYhNAGOwjuk3903NJBiYZakhvjsMpynbD0o5gc500KkPXrB34Bv7hE1ZGphs9xFLDVihegeh8/Femk/xMVOLujixyj3XiJEcoOchCuQhpBGXgg++gjDVttRanypkFF2zQzz0MpAG/zxygFgjwkRJ6+ss7Fe6f15RCzIWvnblKJ6klOwARReCVh+e01JZ8Ppmn0vIVc8DuomhqRwjPpRNWAvWdSSdq24zPZhhFJsEYRJ3zlWE+nuZKdBkPvpQhm0WFYFOD5t6rP/NjymgaV5RENSdwndL6pDs2urPjRjXbw4fcicag5IywBHa/oOJwlGOiOh3PQXFKl7avV1bSQ85TDcHnHL9/+11eqVFwmGA9xd7QUJTLdHCQKFY2QQS1aGjYW4qaoAmpflXpfiYhxBoByG+2l0fxSkCTemZlMzf+6cN+eqlKe6yD8acVzj2t3ANnn4MULg=`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:dono/menus/menuadm.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
