require('../../lib/util/load-env')({
  required: [
    'TARGET',
    'PUPPETEER_HOST',
    'DIFF_THRESHOLD',
  ],
});

const fs = require('fs');
const axios = require('axios');
const qs = require('querystring');
const pngDiff = require('../../lib/util/png-diff');
const discord = require('../../lib/util/discord');

const {
  TARGET,
} = process.env;

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

    if (diff.pixels) {
      console.log(`${diff.pixels} pixels changed on: ${TARGET}`);

      if ( diff.image ) {
        if ( discord.enabled ) {
          await discord.webhook.send(`Change detected on: ${TARGET}`, {
            embeds: [{
              thumbnail: {
                url: `attachment://${Date.now()}.png`,
              },
            }],
            files: [{
              attachment: diffImagePath,
              name: `${Date.now()}.png`,
            }],
          });

          console.log('posted change to discord');
        }
      }
    }
  } else {
    console.log('skipping diff calculationg because previous screenshot didnt exist');
  }

  fs.writeFileSync(prevImagePath, next, { encoding: null });
};

screenshotDiffAlert()
  .then(() => process.exit(0))
  .catch( ex => {
    console.error('top level function error\n\n', ex);
    process.exit(1);
  });
