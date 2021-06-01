const dotenv = require('dotenv');
const app = require('./app');

try {
  dotenv.config();
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`App server is now listening on ${port} !`);
  });
} catch (error) {
  console.log(`Error is:\n${error}`);
  process.exitCode = 1;
}
