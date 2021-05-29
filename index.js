const app = require('./lib/app');

app.start().catch( console.error.bind( 'error starting app:' ) );
