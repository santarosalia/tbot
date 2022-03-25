const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
const TelegramBot = require('node-telegram-bot-api/lib/telegram');
const {createSomething} = require('./notion');
const request = require('request');
const { poll } = require('./poll');




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
    bot.sendMessage(msg.chat.id,'',{
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
    
    

    
    
  
    

  
  function loop2(){

      request(options2,function(error,response,body){
        if (error) throw new Error(error);
        const info = JSON.parse(body);
        
        
        const market = info[0].market;
        const tradePrice1 = info[0].trade_price;
        const timePresenet = info[0].candle_date_time_kst;
        const tradePrice5 = info[4].trade_price;
        const timePast = info[4].candle_date_time_kst;
        const onePer = tradePrice5/10000;
        const result = tradePrice1-tradePrice5;

        const tp1 = parseInt(tradePrice1).toLocaleString();
        const tp5 =parseInt(tradePrice5).toLocaleString();
        const rs = parseInt(result).toLocaleString();
        const per2 = parseFloat((result/tradePrice5)*100).toFixed(2);
        if((tradePrice5-tradePrice1) >=onePer){
          bot.sendMessage('5133524983',timePast.split('T')[1]+' 기준'+'\n'+market+'의 가격 : '+tp5+'원 => '+tp1+'원\n'+per2+'% 하락 : '+rs+'원').then();
        }else if((tradePrice1-tradePrice5) >=onePer){
          bot.sendMessage('5133524983',timePast.split('T')[1]+' 기준'+'\n'+market+'의 가격 : '+tp5+'원 => '+tp1+'원\n'+per2+'% 상승 : '+rs+'원').then();
        }
        
        
        
      });
      
    
  }
  poll(loop2,60000);
  
  

  
  
  
  
      
      
        
    
  


    
    
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
