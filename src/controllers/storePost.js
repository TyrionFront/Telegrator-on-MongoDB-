/* eslint-disable camelcase */
const bot = require('../botApi');

let updId = 0;
module.exports = (req, res) => {
  const { body } = req;
  const { update_id } = body;
  if (updId !== update_id) {
    updId = update_id;
    bot.processUpdate(body);
  }
  res.send('');
};
