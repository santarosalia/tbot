const token = process.env.TOKEN;

const SdkCache = require('api/src/cache');
const { links } = require('express/lib/response');
const Bot = require('node-telegram-bot-api');
const TelegramBot = require('node-telegram-bot-api/lib/telegram');
const {createSomething} = require('./notion');

let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.on('message',async (msg) => {
  console.log(msg.from.first_name+'의 메세지 :'+msg.text);
  
  const name = msg.from.first_name;
  if(msg.text=='희망'){
    bot.sendMessage(msg.chat.id,'우주대존예여신!');
    
  }
  if(msg.text=='전체보기'){
    bot.sendMessage(msg.chat.id,'전체보기',{
      "reply_markup" : {
        "keyboard" : [["전체보기"]]

      }
    }).then();

  }
  await createSomething(msg.text).then();

});

let res;




  setTimeout(() => {
  res = links('https://api.upbit.com/v1/market/all');
  console.log(res);
  }, 5000);
  


module.exports = bot;
