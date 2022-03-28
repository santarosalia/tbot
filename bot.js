const token = process.env.TOKEN;

const Bot = require('node-telegram-bot-api');
const TelegramBot = require('node-telegram-bot-api/lib/telegram');
const {registCoin,myRegist} = require('./notion');
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
    bot.sendMessage(msg.chat.id,'전체목록입니다',{
    "reply_markup" : {
        "keyboard" : [["BTC-???","BTC-KRW"]]

    }
    }).then();
    

    }


});
bot.onText(/\/start/,async (msg) =>{
    const chatId =msg.chat.id;
    bot.sendMessage(chatId,'안녕하세요 '+msg.chat.first_name+'님 dope 봇입니다🥳\n/help 를 통해 사용법을 알려드릴게요!');
});
bot.onText(/\/help/,async(msg)=>{
    const chatId =msg.chat.id;
    bot.sendMessage(chatId,'/myRegist : 구독중인 코인 확인\n/list : 코인 리스트 확인하기\n/add 마켓코드 : 구독할 코인 등록\n/warning : 유의종목 확인');
});

bot.onText(/\/list/,async(msg)=>{
    const chatId =msg.chat.id;
    request(options,function(error,response,body){
        if (error) throw new Error(error);
        const info = JSON.parse(body);
        let list = '';
        for(i in info){
            const market = info[i].market;
            if(market.includes('KRW')){
              list += market+'\n';
            }
            
            
        }

        bot.sendMessage(chatId,'등록가능한 코인리스트입니다.\n'+list);
    });

    
    
});

bot.onText(/\/warning/,async(msg)=>{
const chatId = msg.chat.id;
let warningList = '유의종목입니다.\n';

request(options,function(error,response,body){
if(error) throw new Error(error);
const info =JSON.parse(body);
for(i in info){
if(info[i].market_warning=='CAUTION' && info[i].market.includes('KRW')){
    const coinName =info[i].korean_name;
    warningList += coinName+'\n';

}

}

bot.sendMessage(chatId,warningList);
});

});
bot.onText(/^\/add\sKRW-\w+/,async(msg)=>{
  const chatId =msg.chat.id;
  const text = msg.text;
  
  const market = text.split(' ')[1];
  registCoin(chatId.toString(),market);




  
  bot.sendMessage(chatId,'list add');
});
bot.onText(/\/myRegist/,async(msg)=>{
  const chatId = msg.chat.id;
  
  
  
  await myRegist(chatId.toString()).then((result)=>{
    console.log('넘어온 결과 : '+result);
  });
  
  

  bot.sendMessage(chatId,'1');
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
        const onePer = tradePrice5/100;
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
  
  

  
  
  
  
      
      
        
    
  


    
    



module.exports = bot;
