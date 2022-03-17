const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
const TelegramBot = require('node-telegram-bot-api/lib/telegram');
let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.on('message', (msg) => {
  console.log(msg);
  
  const name = msg.from.first_name;
  if(msg.text='희망'){
    bot.sendMessage('우주대존예여신!')
  }
  //bot.sendMessage(msg.chat.id, 'Hello, ' + name + '!').then(() => {
    // reply sent!
  //});
});

module.exports = bot;
