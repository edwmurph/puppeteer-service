const Router = require('@koa/router');
const httpError = require('http-errors');

const router = new Router({ prefix: '/screenshot' });

router.get('/', async (ctx) => {
  const { url } = ctx.query;

  if ( !url ) {
    throw httpError( 400, 'url query param is required' );
  }

  ctx.body = 'hello world';
});

module.exports = router;
