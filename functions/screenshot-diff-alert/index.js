require('../../lib/util/load-env')();

const fs = require('fs');
const axios = require('axios');
const qs = require('querystring');
const pngDiff = require('../../lib/util/png-diff');

const {
  TARGET,
  PUPPETEER_HOST,
} = process.env;

if ( [ TARGET, PUPPETEER_HOST ].some( val => !val ) ) {
  throw new Error('missing required env var');
}

const prevImagePath = './local/prev.png';
const diffImagePath = './local/diff.png';

const screenshotDiffAlert = async() => {
  console.log(`fetching screenshot for ${ TARGET }`);

  const res = await axios({
    method: 'GET',
    url: `/screenshot?${ qs.stringify({ url: TARGET }) }`,
    responseType: 'arraybuffer',
  });

  const next = res.data;

  if (fs.existsSync( prevImagePath )) {
    console.log('comparing screenshots');

    const prev = fs.readFileSync( prevImagePath );

    const diff = pngDiff( prev, next );

    if (diff.image) {
      fs.writeFileSync(diffImagePath, diff.image);
    }

    console.log( 'different pixels:', diff.pixels );
  } else {
    console.log('skipping diff calculationg because previous screenshot didnt exist');
  }

  fs.writeFileSync(prevImagePath, next, { encoding: null });
};

screenshotDiffAlert().catch( console.error.bind('top level function error\n\n') );
