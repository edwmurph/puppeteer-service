require('../../lib/util/load-env')();

const fs = require('fs');
const axios = require('axios');
const qs = require('querystring');

const {
  TARGET,
  PUPPETEER_HOST,
} = process.env;

if ( [ TARGET, PUPPETEER_HOST ].some( val => !val ) ) {
  throw new Error('missing required env var');
}

const screenshotDiffAlert = async() => {
  const res = await axios({
    method: 'GET',
    url: `/screenshot?${ qs.stringify({ url: TARGET }) }`,
    responseType: 'arraybuffer',
  });

  fs.writeFileSync('./local/test.png', res.data, { encoding: null });

  console.log( 'axios res\n', res.status, res.statusText, res.headers );

  // TODO diff new screenshot from last screenshot
};

screenshotDiffAlert().catch( console.error.bind('top level function error\n\n') );
