const get = require('lodash.get');

const formatAxiosError = ex => {
  return {
    baseURL: get(ex, ['baseURL']),
    method: get(ex, ['method'] ),
    headers: get(ex, ['headers']),
    request: {
      path: get(ex, ['request', 'path']),
    },
    response: {
      status: get(ex, ['response', 'status']),
      statusText: get(ex, ['response', 'statusText']),
      headers: get(ex, ['response', 'headers']),
    },
  };
};

module.exports = formatAxiosError;
