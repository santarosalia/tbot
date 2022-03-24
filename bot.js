const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
const TelegramBot = require('node-telegram-bot-api/lib/telegram');
const {createSomething} = require('./notion');
const request = require('request');
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
  //await createSomething(msg.text).then();

});


const options = {
  method: 'GET',
  url: 'https://api.upbit.com/v1/market/all?isDetails=true',
  headers: {Accept: 'application/json'}
};

  const options2 = {
      method: 'GET',
      url: 'https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=1',
      headers: {Accept: 'application/json'}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      const info = JSON.parse(body);
      console.log(info[1]);
      console.log(info[1].market);

      for(oneInfo in info){
        console.log(oneInfo);
        
        async () =>{
        const market = oneInfo.market
        const koreanName = oneInfo.korean_name
        const englishName = oneInfo.english_name
        const marketWarning = oneInfo.market_warning
        await createSomething(market,koreanName,englishName,marketWarning).then();
        }
      }
    });

    // request(options,error,response,async(body) =>{
    //   const info = JSON.parse(body);
    //   console.log(body);
    //   console.log("ㅇㅇㅇㅇㅇ");
    //   console.log(info);
      
    //   for(oneInfo in info){
    //     console.log(oneInfo);
    //     console.log(oneInfo.market);
        
    //     const market = oneInfo.market
    //     const koreanName = oneInfo.korean_name
    //     const englishName = oneInfo.english_name
    //     const marketWarning = oneInfo.market_warning
    //     await createSomething(market,koreanName,englishName,marketWarning).then();
        
    //   }
    // });


module.exports = bot;
