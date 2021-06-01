/* eslint-disable camelcase */
const dotenv = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');
const BlogPost = require('./models/BlogPost');


dotenv.config();
const bot = new TelegramBot(process.env.BOT_TOKEN);
const url = process.env.BOT_URL;
bot.setWebHook(`${url}/bot`);

const commandsAndResponses = {
  '/start': () => 'Started !',
  '/help': text => text || 'call 911',
  '/pin_msg': () => {},
};

bot.on('message', async (msg) => {
  const {
    message_id,
    chat: { id, username },
    text = '',
    date,
  } = msg;

  const dataToSave = {
    message_id,
    chat_id: id,
    username,
    text,
    responseText: text,
    date,
  };
  const [part, ...rest] = text.split(' ');
  if (!part || part === '/pin_msg') {
    await BlogPost.create(dataToSave);
    return;
  }
  if (part.startsWith('/')) {
    const currentCommand = commandsAndResponses[part];
    dataToSave.responseText = currentCommand
      ? commandsAndResponses[part](rest.join(' ')) : `No command "${part}" was recognized`;
  }
  const result = await BlogPost.create(dataToSave);
  console.log(result);
  bot.sendMessage(id, dataToSave.responseText);
});

bot.on('animation', (anima) => {
  const { chat: { id }, animation: { file_id } } = anima;
  bot.sendAnimation(id, file_id);
});

bot.onText(/\/pin_msg (.+)/, (msg) => {
  const { chat: { id }, message_id } = msg;
  bot.pinChatMessage(id, message_id);
});

bot.on('error', (err) => {
  console.log(`Error occured here: ${err.message}`);
  throw new Error(err);
});

module.exports = bot;
