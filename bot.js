const token = process.env.TOKEN;

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

const sdk = require('api')('@upbit/v1.3.1#1mld74kq6wh6ea');



while(true){
  setTimeout(() => {
  sdk['마켓-코드-조회']({isDetails: 'true'})
  .then(res => console.log(res))
  .catch(err => console.error(err));
  }, 5000);
  
}

module.exports = bot;
