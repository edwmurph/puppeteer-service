const Router = require('@koa/router');
const httpError = require('http-errors');
const puppeteer = require('../../puppeteer');

const router = new Router({ prefix: '/screenshot' });

router.get('/', async (ctx) => {
  const { url, extraWait } = ctx.query;

  if ( !url ) {
    throw httpError( 400, 'url query param is required' );
  }

  const opts = { url };

  if ( extraWait ) {
    opts.extraWait = extraWait;
  }

  const screenshot = await puppeteer.screenshot( opts );

  ctx.body = screenshot;
});

module.exports = router;
