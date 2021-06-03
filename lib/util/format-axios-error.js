const get = require('lodash.get');

const formatAxiosError = ex => {
  return {
    errno: get(ex, ['errno']),
    code: get(ex, ['code']),
    baseURL: get(ex, ['config', 'baseURL']),
    url: get(ex, ['config', 'url']),
    method: get(ex, ['config', 'method']),
    headers: get(ex, ['config', 'headers']),
    response: {
      status: get(ex, ['response', 'status']),
      statusText: get(ex, ['response', 'statusText']),
      headers: get(ex, ['response', 'headers']),
    },
  };
};

module.exports = formatAxiosError;
