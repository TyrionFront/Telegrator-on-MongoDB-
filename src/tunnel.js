/* eslint-disable import/no-extraneous-dependencies */
const ngrok = require('ngrok');
const nodemon = require('nodemon');
const dotenv = require('dotenv');

const launch = async () => {
  dotenv.config();
  const addr = process.env.PORT;
  process.env.BOT_URL = await ngrok.connect({ addr });
  const url = process.env.BOT_URL;

  nodemon({
    script: 'src/server.js',
    exec: `NGROK_URL=${url} node`,
  }).on('start', () => {
    console.log(`The tunnel has started and working on ${url}`);
  }).on('quit', () => {
    console.log('The application has quit, closing ngrok tunnel');
    ngrok.kill().then(() => process.exit(0));
  });
};

try {
  launch();
} catch (error) {
  console.log(`Error is:\n${error}`);
  process.exitCode = 1;
}
