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
  if(msg.text=='id'){
    console.log(msg.chat.id);
    
    
  }
  if(msg.text=='전체보기'){
    bot.sendMessage(msg.chat.id,'전체보기',{
      "reply_markup" : {
        "keyboard" : [["BTC-???"],["BTC-KRW"]]

      }
    }).then();
    

  }
  

});


const options = {
  method: 'GET',
  url: 'https://api.upbit.com/v1/market/all?isDetails=true',
  headers: {Accept: 'application/json'}
};

  const options2 = {
      method: 'GET',
      url: 'https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=5',
      headers: {Accept: 'application/json'}
    };
    
    const send2 = async()=>{

    
    request(options2,function(error,response,body){
      if (error) throw new Error(error);
      const info = JSON.parse(body);
      
      
      
      const tradePrice1 = info[0].trade_price;
      const tradePrice5 = info[4].trade_price;

      const result = tradePrice1-tradePrice5;
      
      
      
      
    });
  bot.sendMessage('5133524983',result).then();
  }    
    
  let bool = true;
  while(bool){
    const date = new Date();
    const minutes =date.getMinutes();
    const seconds = date.getSeconds();
    if(seconds==0){
      send2().then();
      bool = false;
    }
    

  }
      
      
        
    
  
   


    
    
    // request(options, function (error, response, body) {
    //   if (error) throw new Error(error);
    //   const info = JSON.parse(body);
      

    //   for(i in info){
        
    //     const market = info[i].market;
    //     const koreanName = info[i].korean_name;
    //     const englishName = info[i].english_name;
    //     const marketWarning = info[i].market_warning;
        
        
        
        
    //     createSomething(market,koreanName,englishName,marketWarning).then();
        
    //   }
    // });


module.exports = bot;
