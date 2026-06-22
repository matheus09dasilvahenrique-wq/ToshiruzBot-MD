const axios = require('axios');

const fetchJson = async (url, options = {}) => {
  try {
    const res = await axios({
      method: options.method || 'GET',
      url,
      headers: options.headers || {},
      data: options.body || null,
      timeout: options.timeout || 15000
    });

    return res.data;
  } catch (err) {
    return {
      status: false,
      msg: 'Erro ao acessar a API',
      error: String(err)
    };
  }
};

module.exports = fetchJson;