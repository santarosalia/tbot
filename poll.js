async function a(a,t,e=(()=>!1)){
    do{
        if(await a(a,b),await e())break;

        const i="number"==typeof t?t:t();

        await new Promise((a=>setTimeout(a,Math.max(0,i))))

    }
        while(!await e())
}
let poll = a;

module.exports = {poll};