require('./lib/util/load-env')({
  required: [
    'MAX_PAGES',
  ],
});

const log = require('@starryinternet/jobi');
const app = require('./lib/app');

app.start().catch( log.error.bind( 'error starting app:' ) );
