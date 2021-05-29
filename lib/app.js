const { promisify } = require('util');
const express = require('express');

const app = express();
const listen = promisify(app.listen).bind(app);
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello world');
});

const start = async() => {
  console.log('starting app...');
  await listen( port );
  console.log(`app listening on port ${ port }`);
};

module.exports = {
  start,
};
