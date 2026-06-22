// Toshiruz Bot - arquivo protegido
const crypto = require('crypto');
const zlib = require('zlib');
(function(){
  const payload = Buffer.from(`75aOrEpEQi7ZbpM6SYs+6ZrxxfiIqNU5JqWW2ViuSnTpGpkpT2qQjR0ljHBIWzzI1rq6snSR32VZsBxF94Zk2m06dWj5qnICRe6nY2/NqA+Hq/NQGZ1iQEXqC2exOzHJZOQZioFHu7WNoNW/vbRRGN3Y8SRm1lrMRd1LvWZqFUhtlvhb2/XzraQEI++a1LTNmXjZNq/fYDPTRFHQJ5MzbtxQt+wBdp4yOU6hsTzCMGg/AJmkzI9wYWfeigMJsnOYvNDXmTnm8uEfb8jmyBtBbvr1Y2NqZx+HEIdm36RUwO3Ymcriiuy2sjBeW1uH9tuj8i7C3yDPudGwb6LN2rhQ5mIbmL7G+14ITFaj9E7hcLZoctMv8bylTPYJL/9onWTpz10wZeYwuY6LW55cRm/tJpaDRTi0eyCwGTmA9AXIglC3/iWODLCQ1KJmmSnk90+nPuM83E9ZW+GTt/klXYw3qjoRstlm0VzakJn024W1tjh66FYWXvBi+cQNLB1Jw19HUQvgPitR2azCe7jUf/LSe+NCpi+KpCt58+aS9S3ytL6ovbWm9300aj0B6CMpENKbQ+FCjG8ysg5I68vJrsgowhi4odCL1Bw1T2jiDJ8l60GBr1P87Pp/EiXXnwOEv8naGOAD5i5OvoBCczcJSyGhrrC0GPImpY6qSUT2zhSyTl3QHvRSd0klhhuf8uPif0KpJlmgyuXnAA8NTt+AVtVXDGDRj970pCF26ta4eWapHpyF3lkqDn/sn/iTTRkpZB5+p0B/VAAVF6DpvVbKPgPLMOOqwOJhHx1d5KUqDG/qEW0oPCcokrxSoEMrMneO8gj1BuH/dxDrlgauRSN+0xdtF+CLPftyeBHdk329qesjvzj1krEC0f27M9Qx4qvlsBC2NWjWm6hXuN7Pi7yFp7KAauhUX5KPVDhtFCQXIImnwXVJzUsCr36Cn0NuuYiWozKXgPdRE9xUrflIpS8gNQw6nEevDBsO5Kj/IXPhQ8Kr8fXGa2wx0ThXW+0Ym4IjxASvb47mQL1desnSpH0fKeaEb2COU/Mq0ipl3mio2zq2w5EHj22tqcuHnfE41aSInCU9gzY1dz4X6An17c71JiqNjp5RDiyYCW6Y17PZ6M4j/hPkjUQxJQD9XNzAlQBfGCtPHOpuDdNXhZ0003bzvx0O3Um8RxlfW4ZgV7ndRXn5sFI=`, 'base64');
  const iv = payload.subarray(0, 16);
  const data = payload.subarray(16);
  const key = crypto.createHash('sha256').update(`TOSHIRUZ-BOT-VENDA-KEY-2026:dono/menus/menu.js`).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  const code = zlib.gunzipSync(decrypted).toString('utf8');
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', code);
  return fn(require, module, exports, __filename, __dirname);
})();
