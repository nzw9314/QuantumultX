/*
京东818手机节，可获得京豆（活动时间8.1日-8.11日）
活动地址: https://rdcseason.m.jd.com/#/index
每天0/6/12/18点逛新品/店铺/会场可获得京豆，京豆先到先得
往期奖励一般每天都能拿20京豆
支持京东双账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
// quantumultx
[task_local]
#京东818手机节
1 0-18/6 * * * https://gitee.com/lxk0301/scripts/raw/master/jd_818.js, tag=京东818手机节, enabled=true
// Loon
[Script]
cron "1 0-18/6 * * *" script-path=https://gitee.com/lxk0301/scripts/raw/master/jd_818.js,tag=京东818手机节
// Surge
京东818手机节 = type=cron,cronexp=1 0-18/6 * * *,wake-system=1,timeout=20,script-path=https://gitee.com/lxk0301/scripts/raw/master/jd_818.js
 */
const $ = new Env('京东818手机节');
const Key = '';//单引号内自行填写您抓取的京东Cookie
//如需双账号签到,此处单引号内填写抓取的"账号2"Cookie, 否则请勿填写
const DualKey = '';
//直接用NobyDa的jd cookie

let cookie = Key ? Key : $.getdata('CookieJD');
const cookie2 = DualKey ? DualKey : $.getdata('CookieJD2');
let UserName = '';
const JD_API_HOST = 'https://rdcseason.m.jd.com/api/';

!(async () => {
  if (!cookie) {
    $.msg('【京东账号一】818手机节', '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
  } else {
    UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
    await JD818();
  }
  await $.wait(1000);
  if (cookie2) {
    cookie = cookie2;
    UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1]);
    await JD818(cookie2);
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function JD818(doubleKey) {
  await Promise.all([
    listGoods(),//逛新品
    shopInfo(),//逛店铺
    listMeeting()//逛会场
  ])
  await Promise.all([
    listGoods(),//逛新品
    shopInfo(),//逛店铺
    listMeeting()//逛会场
  ])
  await myRank();//领取往期排名奖励
  $.msg($.name, '', `【京东账号${doubleKey ? '二' : '一'}】${UserName}\n【往期排名奖励】获得京豆${$.jbeanNum}个\n奖品详情查看 https://rdcseason.m.jd.com/#/hame\n`, {"open-url": "https://rdcseason.m.jd.com/#/hame"});
}
function listMeeting() {
  const options = {
    'url': `${JD_API_HOST}task/listMeeting?t=${Date.now()}`,
    'headers': {
      'Host': 'rdcseason.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'Connection':' keep-alive',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.14(0x17000e2a) NetType/4G Language/zh_CN',
      'Accept-Language': 'zh-cn',
      'Referer': `https://rdcseason.m.jd.com/?reloadWQPage=t_${Date.now()}`,
      'Accept-Encoding': 'gzip, deflate, br'
    }
  }
  return new Promise((resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        data = JSON.parse(data);
        // console.log('ddd----ddd', data.code)
        if (data.code === 200 && data.data.meetingList) {
          let integralNum = 0, jdNum = 0;
          for (let item of data.data.meetingList) {
            let res = await browseMeeting(item.id);
            if (res.code === 200) {
              let res2 = await getMeetingPrize(item.id);
              integralNum += res2.data.integralNum * 1;
              jdNum += res2.data.jdNum * 1;
            }
            // await browseMeeting('1596206323911');
            // await getMeetingPrize('1596206323911');
          }
          console.log(`逛会场--获得积分:${integralNum}`)
          console.log(`逛会场--获得京豆:${jdNum}`)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function listGoods() {
  const options = {
    'url': `${JD_API_HOST}task/listGoods?t=${Date.now()}`,
    'headers': {
      'Host': 'rdcseason.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'Connection':' keep-alive',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.14(0x17000e2a) NetType/4G Language/zh_CN',
      'Accept-Language': 'zh-cn',
      'Referer': `https://rdcseason.m.jd.com/?reloadWQPage=t_${Date.now()}`,
      'Accept-Encoding': 'gzip, deflate, br'
    }
  }
  return new Promise( (resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        // console.log('data1', data);
        data = JSON.parse(data);
        if (data.code === 200 && data.data.goodsList) {
          let integralNum = 0, jdNum = 0;
          for (let item of data.data.goodsList) {
            let res = await browseGoods(item.id);
            if (res.code === 200) {
              let res2 = await getGoodsPrize(item.id);
              // console.log('逛新品领取奖励res2', res2);
              integralNum += res2.data.integralNum * 1;
              jdNum += res2.data.jdNum * 1;
            }
          }
          console.log(`逛新品获得积分:${integralNum}`)
          console.log(`逛新品获得京豆:${jdNum}`)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  });
}
function shopInfo() {
  const options = {
    'url': `${JD_API_HOST}task/shopInfo?t=${Date.now()}`,
    'headers': {
      'Host': 'rdcseason.m.jd.com',
      'Accept': 'application/json, text/plain, */*',
      'Connection':' keep-alive',
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.14(0x17000e2a) NetType/4G Language/zh_CN',
      'Accept-Language': 'zh-cn',
      'Referer': `https://rdcseason.m.jd.com/?reloadWQPage=t_${Date.now()}`,
      'Accept-Encoding': 'gzip, deflate, br'
    }
  }
  return new Promise( (resolve) => {
    $.get(options, async (err, resp, data) => {
      try {
        // console.log('data1', data);
        data = JSON.parse(data);
        if (data.code === 200 && data.data) {
          let integralNum = 0, jdNum = 0;
          for (let item of data.data) {
            let res = await browseShop(item.shopId);
            // console.log('res', res)
            // res = JSON.parse(res);
            // console.log('res', res.code)
            if (res.code === 200) {
              // console.log('---')
              let res2 = await getShopPrize(item.shopId);
              // console.log('res2', res2);
              // res2 = JSON.parse(res2);
              integralNum += res2.data.integralNum * 1;
              jdNum += res2.data.jdNum * 1;
            }
          }
          console.log(`逛店铺获得积分:${integralNum}`)
          console.log(`逛店铺获得京豆:${jdNum}`)
        }
        // console.log('data1', data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    })
  })

}
function browseGoods(id) {
  const options = {
    "url": `${JD_API_HOST}task/browseGoods?t=${Date.now()}&skuId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.get(options, (err, resp, data) => {
      try {
        // console.log('data1', data);
        data = JSON.parse(data);
        // console.log('data1', data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function getGoodsPrize(id) {
  const options = {
    "url": `${JD_API_HOST}task/getGoodsPrize?t=${Date.now()}&skuId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.get(options, (err, resp, data) => {
      try {
        // console.log('data1', data);
        data = JSON.parse(data);
        // console.log('data1', data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function browseShop(id) {
  const options2 = {
    "url": `${JD_API_HOST}task/browseShop`,
    "body": `shopId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.post(options2, (err, resp, data) => {
      try {
        // console.log('data1', data);
        data = JSON.parse(data);
        // console.log('data1', data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function getShopPrize(id) {
  const options = {
    "url": `${JD_API_HOST}task/getShopPrize`,
    "body": `shopId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        // console.log('getShopPrize', data);
        data = JSON.parse(data);
        // console.log('data1', data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function browseMeeting(id) {
  const options2 = {
    "url": `${JD_API_HOST}task/browseMeeting`,
    "body": `meetingId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.post(options2, (err, resp, data) => {
      try {
        // console.log('点击浏览会场', data);
        data = JSON.parse(data);
        // console.log('点击浏览会场', data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function getMeetingPrize(id) {
  const options = {
    "url": `${JD_API_HOST}task/getMeetingPrize`,
    "body": `meetingId=${id}`,
    "headers": {
      "Host": "rdcseason.m.jd.com",
      "Accept": "application/json, text/plain, */*",
      "Connection": "keep-alive",
      "Cookie": cookie,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
      "Accept-Language": "zh-cn",
      "Referer": "https://rdcseason.m.jd.com/",
      "Accept-Encoding": "gzip, deflate, br"
    }
  }
  return new Promise( (resolve) => {
    $.post(options, (err, resp, data) => {
      try {
        // console.log('getMeetingPrize', data);
        data = JSON.parse(data);
        // console.log('data1', data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function myRank() {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/myRank?t=${Date.now()}`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com/",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.jbeanNum = 0;
    $.get(options, async (err, resp, data) => {
      try {
        // console.log('查询获奖列表data', data);
        data = JSON.parse(data);
        if (data.code === 200 && data.data.myHis) {
          for (let item of data.data.myHis){
            if (item.status === '21') {
              await $.wait(1000);
              console.log('开始领奖')
              let res = await saveJbean(item.id);
              // console.log('领奖结果', res)
              if (res.code === 200 && res.data.rsCode === 200) {
                $.jbeanNum += Number(res.data.jbeanNum);
              }
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function saveJbean(id) {
  return new Promise(resolve => {
    const options = {
      "url": `${JD_API_HOST}task/saveJbean`,
      "body": `prizeId=${id}`,
      "headers": {
        "Host": "rdcseason.m.jd.com",
        "Accept": "application/json, text/plain, */*",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Referer": "https://rdcseason.m.jd.com/",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        // console.log('领取京豆结果', data);
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
// prettier-ignore
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=s&&s.timeout?s.timeout:o;const[h,a]=i.split("@"),r={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":h,Accept:"*/*"}};$.post(r,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}