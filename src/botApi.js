/* eslint-disable camelcase */
const dotenv = require('dotenv');
const randomToken = require('random-token');
const TelegramBot = require('node-telegram-bot-api');
const BlogPost = require('./models/BlogPost');
const User = require('./models/User');


dotenv.config();
const bot = new TelegramBot(process.env.BOT_TOKEN);
const url = process.env.BOT_URL;
bot.setWebHook(`${url}/bot`);

const commandsAndResponses = {
  '/start': async (userUrl, username) => {
    const password = randomToken(16);
    const user = await User.findOne({ username });
    const pathType = user && user.username ? 'login' : 'register';
    const newUrl = new URL(`auth/${pathType}`, userUrl);
    newUrl.searchParams.append('username', username);
    newUrl.searchParams.append('password', password);
    if (pathType === 'login') {
      await user.updateOne({ $set: { password } });
    }
    const urlMask = `Press to ${pathType}`;
    return `[${urlMask}](${newUrl.toString()}) to be able to see chat history`;
  },
  '/update_password': async (userUrl, username) => {
    const password = randomToken(16);
    const user = await User.findOne({ username });
    await user.updateOne({ $set: { password } });
    return `Your new password is ${password}`;
  },
  '/help': () => `you may monitor all messages from this chat
  by entering the appropriate resource;
  see info from this bot's reply at the start of the chat`,
  '/pin_msg': () => {},
};

bot.on('message', async (msg) => {
  const {
    message_id,
    chat: { id, username },
    text = '',
    hostUrl,
  } = msg;

  const dataToSave = {
    message_id,
    chat_id: id,
    username,
    text,
    responseText: text,
    date: new Date(),
  };
  const [part, ...rest] = text.split(' ');
  if (!part || part === '/pin_msg') {
    await BlogPost.create(dataToSave);
    return;
  }
  if (part.startsWith('/')) {
    const currentCommand = commandsAndResponses[part];
    dataToSave.responseText = currentCommand
      ? await commandsAndResponses[part](hostUrl, username, rest.join(''))
      : `No command "${part}" was recognized`;
  }
  await BlogPost.create(dataToSave);
  bot.sendMessage(id, dataToSave.responseText, { parse_mode: 'MarkdownV2' });
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
