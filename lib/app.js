const { promisify } = require('util');
const Koa = require('koa');
const routes = require('./routes');

const app = new Koa();
const listen = promisify(app.listen).bind(app);
const port = 3000;

for ( const router of routes ) {
  app.use( router.routes() );
}

app.on('error', ex => {
  console.error('api error', ex);
});

const start = async() => {
  console.log('starting app...');
  await listen( port );
  console.log(`app listening on port ${ port }`);
};

module.exports = {
  start,
};
