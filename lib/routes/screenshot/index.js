const Router = require('@koa/router');
const puppeteer = require('../../puppeteer');

const router = new Router({ prefix: '/screenshot' });

router.get('/', async (ctx, next) => {
  await next();

  const { url, extraWait } = ctx.query;

  if ( !url ) {
    ctx.throw( 400, 'url query param is required' );
  }

  const opts = { ctx, url };

  if ( extraWait ) {
    opts.extraWait = extraWait;
  }

  const screenshot = await puppeteer.screenshot( opts );

  ctx.body = screenshot;
});

module.exports = router;
