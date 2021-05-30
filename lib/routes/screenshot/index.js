const Router = require('@koa/router');
const httpError = require('http-errors');
const puppeteer = require('../../puppeteer');

const router = new Router({ prefix: '/screenshot' });

router.get('/', async (ctx) => {
  const { url } = ctx.query;

  if ( !url ) {
    throw httpError( 400, 'url query param is required' );
  }

  const screenshot = await puppeteer.screenshot( url );

  ctx.body = screenshot;
});

module.exports = router;
