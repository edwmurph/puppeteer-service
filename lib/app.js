const { promisify } = require('util');
const log = require('@starryinternet/jobi');
const Koa = require('koa');
const { Jobi } = require('@starryinternet/jobi');
const querystring = require('querystring');
const routes = require('./routes');

const app = new Koa();
const listen = promisify(app.listen).bind(app);
const port = 3000;

app.use(async (ctx, next) => {
  const start = Date.now();

  const [ path, qs ] = ctx.url.split('?');

  const parsedQs = querystring.parse( qs );

  const qsTags = Object.keys( parsedQs )
    .filter( key => parsedQs[key] )
    .map( key => `${key}=${parsedQs[key]}` )
    .sort();

  ctx.state.log = new Jobi({
    format: log => {
      const prefix = [ path, ...qsTags ]
        .map( i => `[${ i }]` ).join(' ');

      return Jobi.format({
        ...log,
        message: `${ prefix } ${ log.message }`,
      });
    },
  });

  await next();

  const ms = Date.now() - start;
  ctx.state.log.info(`finished - ${ms}ms`);
});

for ( const router of routes ) {
  app.use( router.routes() );
}

app.on('error', ex => {
  log.error('api error', ex);
});

const start = async() => {
  log.info('starting app...');
  await listen( port );
  log.info(`app listening on port ${ port }`);
};

module.exports = {
  start,
};
