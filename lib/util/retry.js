const wait = require('./wait');

const retry = async( fn, opts = {} ) => {
  const {
    attempts = 5,
    shouldRetry = () => true,
    baseTime = 1000,
    exp = 2,
  } = opts;

  for ( let i = 1; i <= attempts; ++i ) {
    try {
      return await fn();
    } catch ( ex ) {
      if ( i >= attempts || !shouldRetry( ex ) ) {
        throw ex;
      }
      await wait( baseTime * Math.pow( i, exp ) );
    }
  }
};

module.exports = retry;
