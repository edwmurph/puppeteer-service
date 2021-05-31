const wait = ( ms ) => new Promise( r => setTimeout( r, ms ) );

module.exports = wait;
