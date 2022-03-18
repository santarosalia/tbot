const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
const TelegramBot = require('node-telegram-bot-api/lib/telegram');
const {typeFilter, getTypeList, leftDateFive, allThings} = require('./notion');

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
  if(msg.text=='희망'){
    bot.sendMessage(msg.chat.id,'우주대존예여신!');
  }
  //bot.sendMessage(msg.chat.id, 'Hello, ' + name + '!').then(() => {
    // reply sent!
  //});
});

bot.on('message', async (msg) => {
  if (msg.text.toString().indexOf('전체보기') === 0) {
      let message = ''
      await allThings().then((value)=>{
          message = value
      })
      bot.sendMessage(msg.chat.id, message).then();
  }

  let typeList = []

  await getTypeList().then((name)=>{
      typeList.push(...name)
  })

  typeList.map(async (name)=>{
      if (msg.text.toString().indexOf(name) === 0) {
          let message = ''
          await typeFilter(name).then((value)=>{
              message = value
          })
          bot.sendMessage(msg.chat.id, message).then();
      }
  })
});

bot.onText(/\/start/, (msg) => {
  const name = msg.from.first_name;
  bot.sendMessage(msg.chat.id, `🚀 안녕하세요! ${name} 저는 냉장고 챗봇입니다.\n/help 라고 입력해보세요.\n 제가 어떤일을 하는지 알려드릴게요!`).then();
});

bot.onText(/\/help/, async (msg) => {
  bot.sendMessage(msg.chat.id, `🚀🚀🚀🚀🚀🚀🚀\n 냉장고 물건보기 👉 /list 라고 입력해보세요.\n 유통기한 체크 👉 /expire 라고 입력해보세요.`).then();
});

bot.onText(/\/list/, async (msg) => {
  const keyboard = [['전체보기']]
  await getTypeList().then((value)=>{
      keyboard.push(...value.map((value)=> [value]))
  })
  console.log(keyboard)
  bot.sendMessage(msg.chat.id, "👇냉장고에서 찾고 싶은 물품을 눌러주세요👇", {
      "reply_markup": {
          "keyboard": keyboard
      }
  }).then();
});

bot.onText(/\/expire/, async (msg) => {
  await leftDateFive().then((result)=>{
      if(result.length > 0) {
              let state = ''
              result.map((item)=>{
                  if(item.left === 0){
                      state += `${item.name} 오늘까지입니다.\n`
                  } else if(item.left > 0){
                      state += `${item.name} ${item.left}일 남았습니다.\n`
                  } else {
                      state += `${item.name} ${Math.abs(item.left)}일 지났습니다.\n`
                  }
              })
              bot.sendMessage(msg.chat.id, state)

      }
  })
});

let rule = new schedule.RecurrenceRule();
rule.tz = 'Asia/Seoul';
let chatList = []
chatList.push(process.env.DEFAULT_CHAT_ID, process.env.VIVI_CHAT_ID)


schedule.scheduleJob('0 18 * * *', async function(){
  await leftDateFive().then((result)=>{
      if(result.length > 0) {
          chatList.map((chatId)=>{
              let state = ''
              result.map((item)=>{
                  if(item.left === 0){
                      state += `${item.name} 오늘까지입니다.\n`
                  } else if(item.left > 0){
                      state += `${item.name} ${item.left}일 남았습니다.\n`
                  } else {
                      state += `${item.name} ${Math.abs(item.left)}일 지났습니다.\n`
                  }
              })
              bot.sendMessage(chatId, state)
          })
      }
  })
});

module.exports = bot;
