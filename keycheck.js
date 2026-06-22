// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`M8tGzpf/950xpnmtZlmCQZ4EqyAwloQncWLWQWv9lHLqZbSgX+ydWng51TI/Swvzp8taPUXKyzdPA+TzIY0sB9YEOBr0UEMhwEzmR1JBMBYCLSF+MKVixQlPkl+rwsX/5fUVKZ9USnB9GJ2Q4OI5pV4SDUc1YTd/MtJetzg1snv7XQZSz8ur/nh0uSlt8GFNN84Sj1+cSqZIL0rWEZjvHkZkx42Cl8Ub8JoeiD0l4C+0KlPI2ZH2BBfOvx548uKZnLGBsaNd3KqL0p6IZGLPvakSIZwckvAbLN114ThU1/1SozxefR3zI/pzagU+b2I3jvcIYK7LzkpyfPNb+uT2NeHctlsu0cFl/id0sHeKAFPYd9d/qptGyISZCb4WXD28c4L6ltqSCa9bkhk40hiHKPJH1KanE9a64wEcpkdIQpCWSCF71BPD3bX6P8krT0ss6nyFt0jglvAW4n98EZPfPUcWfkT5qsZTd/I0bxcFpBQhms7fhGonuEvKp6iItY+Rvl2HIRqK8OlGrB3roX6OtoH0EML1GFTsxzpF7dOtSefnvmvk3lup4ruARnLv1iHX7ka2lUgOe46/HLJ2PcERCBe087p57HXkYr2lXklY8grX6P5RUJdUASBAE6G6P43FiM+zYwZvkoQe58cNQwdEIaLSL/6PdyqYzS/L9MzTnOi7vl8qQ3gdDHgn02vS0pwXc70WoHIbABFguLIG9HjHn4CtEf/Pjp2WRJLaKAmxKlZcLeKgWTUu0XBFHgM42DQEXZcd+N4dF5A6/BshCw8tzqpwKe9viI+n3j/yD60+F0t2oCpusx/sGzctcc2pWYtype33CSPcZR4rqG0dA/7Br8V4olAIIJz0nrwnCkAkhoqnJXOtphAJqI3UjHGjmAbbAZpEdVeQLDP+jy+U6d2ZCUc8WA2HqNnwH6NjZUDHJr5wQG6NCEv74NdEiJkcvUZgvbhfYNJ8wAr2Ph2GC/u9YKueOaF+S27WBh2XkhW41X3yBt3AjbuIxD+JhL5ZuJr8D+8BAsa+CBSbn1DOtJUivdZGS/mQlcrsKGz0a3QLc12X+aHFdmktxQTZvPqEpBIyfNBjELopx0U/bFUzI2bbEXjMvaXbanRXveXNYKTZL8fIqoSFw8fmNDNJxc2k4krkyGEGkxDt5R8eABNo93e0lUHtsFCvDltUxGOAQbeZZVFp2Qp9SH3jT2IE61lg9Og6slB2sTS07aFfilM8nYkj2f5AQGk6deVkkscYZtsdHWu/g5NNF759J7n+LGddVgDKVinYDDteWruICEvUBozkdMz/cBLK+wCwp7sZr+9n5TECL8yqvFNiwYpjJ6Jj1T3I6mHvnomlkGjeV2syv9XG+5v1EP/4r1m+mSKDHjKSGAoXYprwxTK8CLgU2UGD9z2ILYIOUayfAYUFpLqaYb9FZ9SRdNcIhh2UAX7YrQ/5pTF3IX6XHl013g8FrnOE+mCpQS20+wK7bPQ5ABFY5aJqUZVqPMKgGBfrKqLU1+XiK1WbaT5lZRQp5keJ6jrWNUOSuRDuzyh83bbL2XEFn99Ob+zDwSuCfqSJB5ahDFGv4PE=`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:keycheck.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
