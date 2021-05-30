const loadEnv = () => {
  require('dotenv').config({
    path: `./.env.${ process.env.NODE_ENV }`,
  });

  require('axios').defaults.baseURL = process.env.PUPPETEER_HOST;
};

module.exports = loadEnv;
