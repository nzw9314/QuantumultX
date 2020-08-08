/*
宠汪汪积分兑换奖品脚本, 目前脚本只兑换京豆(默认兑换条件：1、积分满足，2、等级满足的京豆)！
更新时间; 2020-08-07
兑换奖品成功后才会有系统弹窗通知
每日京豆库存会在0:00、8:00、16:00及时更新。有时候发现晚上23点多也有京豆可兑换，建议cron加上这个时间
每个京东账户每天只可兑换一次，商品和京豆数量有限，兑完即止。
支持京东双账号
脚本兼容: Quantumult X, Surge, Loon, JSBox, Node.js
// Quantumult X
[task_local]
#宠汪汪积分兑换奖品
1 0-16/8 * * * https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_reward.js, tag=宠汪汪积分兑换奖品, enabled=true
// Loon
[Script]
cron "1 0-16/8 * * *" script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_reward.js,tag=宠汪汪积分兑换奖品
// Surge
宠汪汪积分兑换奖品 = type=cron,cronexp=1 0-16/8 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy_reward.js
 */
const $ = new Env('宠汪汪积分兑换奖品');
const joyRewardName = $.getdata('joyRewardName') || 20;//兑换多少数量的京豆，默认兑换20京豆
//=======node.js使用说明======
//请在下方单引号内自行填写您抓取的京东Cookie
const Key = '';
//如需双账号签到,此处单引号内填写抓取的"账号2"Cookie, 否则请勿填写
const DualKey = '';
//=======node.js使用说明结束=======
//直接用NobyDa的jd cookie
let cookie = Key ? Key : $.getdata('CookieJD');
const cookie2 = DualKey ? DualKey : $.getdata('CookieJD2');
let UserName = '';
const JD_API_HOST = 'https://jdjoy.jd.com/pet/';
!(async () => {
  if (!cookie) {
    $.msg('【京东账号一】宠汪汪积分兑换奖品失败', '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
  } else {
    UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
    console.log(`\n开始兑换【京东账号一】${UserName}\n`)
    await joyReward();
  }
  await $.wait(1000);
  if (cookie2) {
    cookie = cookie2;
    UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/)[1]);
    console.log(`\n开始兑换【京东账号二】${UserName}\n`)
    await joyReward(cookie2);
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function joyReward(doubleKey) {
  let getExchangeRewardsRes = await getExchangeRewards();
  if (getExchangeRewardsRes.success) {
    // console.log('success', getExchangeRewardsRes);
    const datas = getExchangeRewardsRes.datas;
    const {score, petLevel, pin} = getExchangeRewardsRes.datas[0];
    const canPetLevel = Math.ceil((petLevel - 0.5)/5);
    console.log(`当前积分 ${score}\n`);
    console.log(`宠物等级 ${petLevel}\n`);
    console.log(`可兑换阶级 ${canPetLevel === 1 ? 'L1-5等级' : canPetLevel === 2 ? 'L6-10等级' : canPetLevel === 3 ? 'L10-15等级' : canPetLevel === 4 ? 'L6-20等级' : canPetLevel === 5 ? 'L21-25等级' : canPetLevel === 6 ? 'L26-30等级' : '最高级'}\n`);
    console.log(`京东昵称 ${pin}\n`);

    let todayExchanged =  datas.some((value, index, array) => value.todayExchanged === true)
    console.log(`今日是否已兑换过奖品  ${todayExchanged ? '是':'否'}\n`);
    let canReardArr = [];//，满足你当前的等级，以及积分足够的京豆奖品
    if (!todayExchanged) {
      for (let i = 0; i < canPetLevel; i++) {
        for (let j = 0; j < datas[i].rewardDetailVOS.length; j++) {
          if (datas[i].rewardDetailVOS[j].rewardType === 3 && datas[i].rewardDetailVOS[j].petScore < score) {
            if (joyRewardName * 1 === -1) {
              canReardArr.push({
                'petLevel': datas[i].rewardDetailVOS[j].petLevel,
                'rewardName': datas[i].rewardDetailVOS[j].rewardName,
                'petScore': datas[i].rewardDetailVOS[j].petScore,
                'leftStock': datas[i].rewardDetailVOS[j].leftStock,
                'id': datas[i].rewardDetailVOS[j].id,
              });
            } else if (joyRewardName * 1 === 20) {
              if (datas[i].rewardDetailVOS[j].rewardName === '20京豆') {
                canReardArr.push({
                  'petLevel': datas[i].rewardDetailVOS[j].petLevel,
                  'rewardName': datas[i].rewardDetailVOS[j].rewardName,
                  'petScore': datas[i].rewardDetailVOS[j].petScore,
                  'leftStock': datas[i].rewardDetailVOS[j].leftStock,
                  'id': datas[i].rewardDetailVOS[j].id,
                });
              }
            } else if (joyRewardName * 1 === 50) {
              if (datas[i].rewardDetailVOS[j].rewardName === '50京豆') {
                canReardArr.push({
                  'petLevel': datas[i].rewardDetailVOS[j].petLevel,
                  'rewardName': datas[i].rewardDetailVOS[j].rewardName,
                  'petScore': datas[i].rewardDetailVOS[j].petScore,
                  'leftStock': datas[i].rewardDetailVOS[j].leftStock,
                  'id': datas[i].rewardDetailVOS[j].id,
                });
              }
            } else if (joyRewardName * 1 === 100) {
              if (datas[i].rewardDetailVOS[j].rewardName === '100京豆') {
                canReardArr.push({
                  'petLevel': datas[i].rewardDetailVOS[j].petLevel,
                  'rewardName': datas[i].rewardDetailVOS[j].rewardName,
                  'petScore': datas[i].rewardDetailVOS[j].petScore,
                  'leftStock': datas[i].rewardDetailVOS[j].leftStock,
                  'id': datas[i].rewardDetailVOS[j].id,
                });
              }
            } else if (joyRewardName * 1 === 500) {
              if (datas[i].rewardDetailVOS[j].rewardName === '500京豆') {
                canReardArr.push({
                  'petLevel': datas[i].rewardDetailVOS[j].petLevel,
                  'rewardName': datas[i].rewardDetailVOS[j].rewardName,
                  'petScore': datas[i].rewardDetailVOS[j].petScore,
                  'leftStock': datas[i].rewardDetailVOS[j].leftStock,
                  'id': datas[i].rewardDetailVOS[j].id,
                });
              }
            } else if (joyRewardName * 1 === 1000) {
              if (datas[i].rewardDetailVOS[j].rewardName === '1000京豆') {
                canReardArr.push({
                  'petLevel': datas[i].rewardDetailVOS[j].petLevel,
                  'rewardName': datas[i].rewardDetailVOS[j].rewardName,
                  'petScore': datas[i].rewardDetailVOS[j].petScore,
                  'leftStock': datas[i].rewardDetailVOS[j].leftStock,
                  'id': datas[i].rewardDetailVOS[j].id,
                });
              }
            }
          }
        }
      }
      console.log('可兑换京豆的列表长度', canReardArr)
      canReardArr.reverse();//倒序进行兑换奖品
      if (canReardArr && canReardArr.length > 0) {
        for (let item of canReardArr) {
          // console.log('leftStock', item.leftStock)
          let levelArea = item.petLevel === 1 ? 'L1-5等级' : item.petLevel === 2 ? 'L6-10等级' : item.petLevel === 3 ? 'L10-15等级' : item.petLevel === 4 ? 'L6-20等级' : item.petLevel === 5 ? 'L21-25等级' : item.petLevel === 6 ? 'L26-30等级' : '最高级';
          if (item.leftStock > 0) {
            let exchangeRes = await exchange(item.id);
            if (exchangeRes.success) {
              if (exchangeRes.data === 'exchange_success') {
                console.log(`【京东账号${doubleKey ? '二':'一'}】${UserName}成功兑换 ${item.rewardName}花费 ${item.petScore}积分`);
                $.msg($.name, `成功兑换 ${item.rewardName}`, `【京东账号${doubleKey ? '二':'一'}】${UserName}\n成功从${levelArea}区域兑换 ${item.rewardName}\n花费 ${item.petScore}积分\n`)
              } else if (exchangeRes.data === 'stock_insufficient') {
                console.log(`兑换${levelArea}区域的【${item.rewardName}】失败，原因：已抢光`)
              } else if (exchangeRes.data === 'chance_full') {
                console.log(`兑换${levelArea}区域的【${item.rewardName}】失败，原因：今日兑换机会已用完`)
              }
            } else {
              console.log('兑换奖励API调用失败')
            }
          } else {
            console.log(`兑换${levelArea}区域的【${item.rewardName}】失败，原因：奖品已抢光`)
          }
        }
      } else {
        if (joyRewardName * 1 !== 0) {
          $.msg($.name, '请在boxjs重新设置', '当前设置兑换京豆数量不满足您宠汪汪的等级和积分\n');
        } else {
          console.log('您在boxjs设置了不进行兑换奖品')
        }
      }
    } else {
      console.log(`兑换失败，您今日已经兑换过一次奖品（每个京东账户每天只可兑换一次）`)
    }
  } else if (!getExchangeRewardsRes.success && getExchangeRewardsRes.errorCode === 'B0001') {
    $.msg($.name, `【提示】京东账号${doubleKey ? '二':'一'}cookie已失效,请重新登录获取`, '请点击此处去获取Cookie\n https://bean.m.jd.com/ \n', {"open-url": "https://bean.m.jd.com/"});
    if (doubleKey) {
      $.setdata('', 'CookieJD2')
    } else {
      $.setdata('', 'CookieJD');//cookie失效，故清空cookie。
    }
    // $.done();
  }
}
function getExchangeRewards() {
  return new Promise((resolve) => {
    const option = {
      url: `${JD_API_HOST}getExchangeRewards`,
      headers: {
        "Host": "jdjoy.jd.com",
        "Content-Type": "application/json",
        "Cookie": cookie,
        "reqSource": "h5",
        "Connection": "keep-alive",
        "Accept": "*/*",
        "User-Agent": "jdapp;iPhone;9.0.4;13.5.1;e35caf0a69be42084e3c97eef56c3af7b0262d01;network/4g;ADID/3B3AD5BC-B5E6-4A08-B32A-030CD805B5DD;supportApplePay/3;hasUPPay/0;pushNoticeIsOpen/1;model/iPhone11,8;addressid/2005183373;hasOCPay/0;appBuild/167283;supportBestPay/0;jdSupportDarkMode/1;pv/169.3;apprpd/MyJD_Main;ref/MyJdMTAManager;psq/2;ads/;psn/e35caf0a69be42084e3c97eef56c3af7b0262d01|638;jdv/0|iosapp|t_335139774|appshare|CopyURL|1596547194976|1596547198;adk/;app_device/IOS;pap/JA2015_311210|9.0.4|IOS 13.5.1;Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        "Referer": "https://jdjoy.jd.com/pet/index",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br"
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        // console.log('data', data)
        data = JSON.parse(data);
        // console.log('data', data)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  })
}
function exchange(rewardId) {
  return new Promise((resolve) => {
    const option = {
      url: `${JD_API_HOST}exchange`,
      body: `${JSON.stringify({'id':rewardId})}`,
      headers: {
        "Host": "jdjoy.jd.com",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Content-Type": "application/json",
        "Origin": "https://jdjoy.jd.com",
        "reqSource": "h5",
        "Connection": "keep-alive",
        "User-Agent": "jdapp;iPhone;9.0.4;13.5.1;e35caf0a69be42084e3c97eef56c3af7b0262d01;network/4g;ADID/3B3AD5BC-B5E6-4A08-B32A-030CD805B5DD;supportApplePay/3;hasUPPay/0;pushNoticeIsOpen/1;model/iPhone11,8;addressid/2005183373;hasOCPay/0;appBuild/167283;supportBestPay/0;jdSupportDarkMode/1;pv/169.3;apprpd/MyJD_Main;ref/MyJdMTAManager;psq/2;ads/;psn/e35caf0a69be42084e3c97eef56c3af7b0262d01|638;jdv/0|iosapp|t_335139774|appshare|CopyURL|1596547194976|1596547198;adk/;app_device/IOS;pap/JA2015_311210|9.0.4|IOS 13.5.1;Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        "Referer": "https://jdjoy.jd.com/pet/index",
        "Content-Length": "10",
        "Cookie": cookie
      },
    }
    $.post(option, (err, resp, data) => {
      try {
        // console.log('exchange', data)
        data = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    });
  })
}
// prettier-ignore
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=s&&s.timeout?s.timeout:o;const[h,a]=i.split("@"),r={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":h,Accept:"*/*"}};$.post(r,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;$.isMute||(this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o))),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}