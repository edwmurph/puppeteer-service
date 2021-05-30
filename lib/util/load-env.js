const loadEnv = ({ required = [] }) => {
  require('dotenv').config({
    path: `./.env.${ process.env.NODE_ENV }`,
  });

  require('axios').defaults.baseURL = process.env.PUPPETEER_HOST;

  for ( const envVar of required.concat([ 'NODE_ENV' ]) ) {
    if (!process.env[envVar]) {
      throw new Error(`'${envVar}' is a required environment variable`);
    }
  }
};

module.exports = loadEnv;
