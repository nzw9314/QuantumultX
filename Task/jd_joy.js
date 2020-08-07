/*
jd宠汪汪 搬的https://github.com/uniqueque/QuantumultX/blob/4c1572d93d4d4f883f483f907120a75d925a693e/Script/jd_joy.js
feedCount:自定义 每次喂养数量; 等级只和喂养次数有关，与数量无关
推荐每次投喂10个，积累狗粮，然后去聚宝盆赌每小时的幸运奖，据观察，投入3000-6000中奖概率大，超过7000基本上注定亏本，即使是第一名
Combine from Zero-S1/JD_tools(https://github.com/Zero-S1/JD_tools)
更新时间:2020-08-07
注：如果使用Node.js, 需自行安装'crypto-js,got,http-server,tough-cookie'模块. 例: npm install crypto-js http-server tough-cookie got --save
*/
// quantumultx
// [task_local]
// #京东宠汪汪
// 15 */3 * * * https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy.js, tag=京东宠汪汪, img-url=https://raw.githubusercontent.com/znz1992/Gallery/master/jdww.png, enabled=true
// Loon
// [Script]
// cron "15 */3 * * *" script-path=https://raw.githubusercontent.com/lxk0301/scripts/master/jd_joy.js,tag=京东宠汪汪
const name = '京东宠汪汪';
const $ = new Env(name);
const FEED_NUM = ($.getdata('joyFeedCount') * 1) || 10   //每次喂养数量 [10,20,40,80]
const Key = '';//单引号内自行填写您抓取的京东Cookie
//直接用NobyDa的jd cookie
const cookie =  Key ? Key : $.getdata('CookieJD');
let jdNotify = $.getdata('jdJoyNotify');
var Task = step();
Task.next();

function* step() {
    let message = '';
    let subTitle = '';
    if (cookie) {
        //获取任务信息
        let petTaskConfig = yield getPetTaskConfig()
        if (petTaskConfig.success) {
            //每日签到
            let signEveryDayTask = petTaskConfig.datas.find(item => item.taskType === 'SignEveryDay')
            if (signEveryDayTask && signEveryDayTask.taskStatus == 'processing' && signEveryDayTask.joinedCount == 0) {
                let signResult = yield SignEveryDay()
                console.log(`签到结果${JSON.stringify(signResult)}`)
            } else {
                console.log(`今天已签到或任务不存在`)
            }
            //关注店铺
            let followShopTask = petTaskConfig.datas.find(item => item.taskType === 'FollowShop')
            if (followShopTask && followShopTask.taskStatus == 'processing' && followShopTask.taskChance > followShopTask.joinedCount) {
                for (let shop of followShopTask.followShops) {
                    if (!shop.status) {
                        let followShopResult = yield followShop(shop.shopId)
                        console.log(`关注店铺${shop.name}结果${JSON.stringify(followShopResult)}`)
                    }
                }
            } else {
                console.log(`关注店铺今天已完成或任务不存在`)
            }
            //三餐
            let threeMeals = petTaskConfig.datas.find(item => item.taskType === 'ThreeMeals')
            if (threeMeals && threeMeals.taskStatus == 'processing') {
                let threeMealsResult = yield ThreeMeals()
                console.log(`三餐结果${JSON.stringify(threeMealsResult)}`)
            } else {
                // console.log(`今天已关注或任务不存在`)
            }
            //逛会场
            let scanMarketTask = petTaskConfig.datas.find(item => item.taskType === 'ScanMarket')
            if (scanMarketTask && scanMarketTask.taskStatus == 'processing' && scanMarketTask.taskChance > scanMarketTask.joinedCount) {
                for (let market of scanMarketTask.scanMarketList) {
                    if (!market.status) {
                        // 解决部分商品market.marketLink为空的时候，浏览不到的bug
                        let clickResult = yield click(market.marketLinkH5)
                        console.log(`逛会场点击${market.marketName}结果${JSON.stringify(clickResult)}`)
                        
                        let scanMarketResult = yield ScanMarket(market.marketLinkH5)
                        console.log(`逛会场${market.marketName}结果${JSON.stringify(scanMarketResult)}`)
                    }
                }
            } else {
                console.log(`逛会场今天已完成或任务不存在`)
            }
            //关注商品
            let followGoodTask = petTaskConfig.datas.find(item => item.taskType === 'FollowGood')
            if (followGoodTask && followGoodTask.taskStatus == 'processing' && followGoodTask.taskChance > followGoodTask.joinedCount) {
                for (let good of followGoodTask.followGoodList) {
                    if (!good.status) {
                        let followGoodResult = yield followGood(good.sku)
                        console.log(`关注商品${good.skuName}结果${JSON.stringify(followGoodResult)}`)
                    }
                }
            } else {
                console.log(`关注商品今天已完成或任务不存在`)
            }
            //浏览频道
            let followChannelTask = petTaskConfig.datas.find(item => item.taskType === 'FollowChannel')
            if (followChannelTask && followChannelTask.taskStatus == 'processing' && followChannelTask.taskChance > followChannelTask.joinedCount) {
                for (let channel of followChannelTask.followChannelList) {
                    if (!channel.status) {
                        let followChannelResult = yield FollowChannel(channel.channelId)
                        console.log(`浏览频道${channel.channelName}结果${JSON.stringify(followChannelResult)}`)
                    }
                }
            } else {
                console.log(`浏览商品今天已完成或任务不存在`)
            }
            //浏览商品奖励积分
            let deskGoodDetails = yield getDeskGoodDetails()
            if (deskGoodDetails.success) {
              if (deskGoodDetails.data.deskGoods && deskGoodDetails.data.deskGoods.length > 0) {
                for (let deskGood of deskGoodDetails.data.deskGoods) {
                  if (!deskGood.status) {
                    let scanDeskGoodResult = yield ScanDeskGood(deskGood.sku)
                    console.log(`浏览频道${deskGood.skuName}结果${JSON.stringify(scanDeskGoodResult)}`)
                  }
                }
              }
            } else {
                console.log(`浏览商品奖励积分返回结果${JSON.stringify(deskGoodDetails)}`)
            }
            // 看激励视频得狗粮
            // let taskVideoRes = yield taskVideo();
            // console.log(`视频激--任务列表--${JSON.stringify(taskVideoRes)}`);
            // if (taskVideoRes.success) {
            //   let taskArr = {};
            //   for (let item of taskVideoRes.datas) {
            //     if (item.ViewVideo) {
            //       taskArr = item;
            //     }
            //   }
            //   let joinedCount = taskArr.joinedCount || 0;
            //   for (let i = 0; i < new Array(taskArr.taskChance - joinedCount).fill('').length; i++) {
            //     console.log(`开始第${i+1}次看激励视频`);
            //       let sanVideoRes = yield sanVideo();
            //     console.log(`看视频激励结果--${JSON.stringify(sanVideoRes)}`);
            //   }
            // }
            // 好友列表
            let getFriendsResult = yield getFriends()
            for (var i = getFriendsResult.datas.length - 1; i >= 1; i--) {
            	let friendPin = getFriendsResult.datas[i]["friendPin"]
            	console.log(friendPin)
            	// 进入好友房间
                let enterFriendRoomResult = yield enterFriendRoom(friendPin)
                let friendHomeCoin = enterFriendRoomResult.data["friendHomeCoin"]
                console.log('friendHomeCoin = ' + friendHomeCoin)
                if (enterFriendRoomResult.data["friendHomeCoin"] > 0) {
                    let getFriendCoinResult = yield getFriendCoin(friendPin)
                    console.log(`收取好友金币结果${JSON.stringify(getFriendCoinResult)}`)
                }
                let stealStatus = getFriendsResult.datas[i]["stealStatus"]
                console.log('stealStatus = ' + stealStatus)
                if (getFriendsResult.datas[i]["stealStatus"] == "can_steal") {
                    let getRandomFoodResult = yield getRandomFood(friendPin)
                    console.log(`收取好友狗粮结果${JSON.stringify(getRandomFoodResult)}`)
                }
                let status = getFriendsResult.datas[i]["status"]
                console.log('status = ' + status)
                if (getFriendsResult.datas[i]["status"] == "not_feed") {
                    let helpFeedResult = yield helpFeed(friendPin)
                    console.log(`帮忙喂食结果${JSON.stringify(helpFeedResult)}`)
                }
                // if (friendPin != "jd_6162cd8a30268") {
                    
                // }
            }
            // 喂食
            let feedPetsResult = yield feedPets()
            console.log(`喂食结果${JSON.stringify(feedPetsResult)}`)
            if (feedPetsResult.success) {
              if (feedPetsResult.errorCode === 'feed_ok') {
                console.log('喂食成功')
              } else if (feedPetsResult.errorCode === 'time_error') {
                console.log('喂食失败：正在食用')
              }
            }
            // 喂养状态
            let enterRoomResult = yield enterRoom()
            console.log(`喂养状态${JSON.stringify(enterRoomResult)}`)
            message = `现有积分: ${enterRoomResult.data.petCoin}\n现有狗粮: ${enterRoomResult.data.petFood}\n喂养次数: ${enterRoomResult.data.feedCount}\n宠物等级: ${enterRoomResult.data.petLevel}`
            subTitle = `【用户名】${enterRoomResult.data.pin}`
        } else {
            console.log(`任务信息${JSON.stringify(petTaskConfig)}`)
          if (petTaskConfig.errorCode === 'B0001') {
            $.setdata('', 'CookieJD');//cookie失效，故清空cookie。
            $.msg(name, '【提示】京东cookie已失效,请重新登录获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
            $.done();
            return
          } else {
            message += `${petTaskConfig.errorMessage}`;
          }
        }
    } else {
      $.msg(name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', { "open-url": "https://bean.m.jd.com/" });
      $.done();
      return
    }
    console.log(`jdNotify${jdNotify}`)
    console.log(`jdNotify${jdNotify === 'false'}`)
    if (!jdNotify || jdNotify === 'false') {
      $.msg(name, subTitle, message);
    }
    $.done();
}

function click(marketLink) {
    request(`https://jdjoy.jd.com/pet/icon/click?reqSource=h5&iconCode=scan_market&linkAddr=${marketLink}`)
}

//浏览商品
function ScanDeskGood(sku) {
    requestPost(`https://jdjoy.jd.com/pet/scan`, JSON.stringify({ sku: sku, taskType: 'ScanDeskGood', reqSource: 'h5' }), 'application/json')
}

//浏览商品奖励积分任务
function getDeskGoodDetails() {
    request(`https://jdjoy.jd.com/pet/getDeskGoodDetails?reqSource=h5`)
}

//浏览频道
function FollowChannel(channelId) {
    requestPost(`https://jdjoy.jd.com/pet/scan`, JSON.stringify({ channelId: channelId, taskType: 'FollowChannel', reqSource: 'h5' }), 'application/json')
}

//关注商品
function followGood(sku) {
    requestPost(`https://jdjoy.jd.com/pet/followGood`, `sku=${sku}&reqSource=h5`)
}

//逛会场
function ScanMarket(marketLink,) {
    requestPost(`https://jdjoy.jd.com/pet/scan`, JSON.stringify({ marketLink: marketLink, taskType: 'ScanMarket', reqSource: 'h5' }), 'application/json')
}
//关注店铺
function followShop(shopId) {
    requestPost(`https://jdjoy.jd.com/pet/followShop`, `shopId=${shopId}&reqSource=h5`)
}

//每日签到
function SignEveryDay() {
    request(`https://jdjoy.jd.com/pet/sign?taskType=SignEveryDay`)
}
//获取任务
function getPetTaskConfig() {
    request(`https://jdjoy.jd.com/pet/getPetTaskConfig?reqSource=h5`)
}
//三餐奖励
function ThreeMeals() {
    request(`https://jdjoy.jd.com/pet/getFood?taskType=ThreeMeals`)
}

//喂食
function feedPets() {
    request(`https://jdjoy.jd.com/pet/feed?feedCount=${FEED_NUM}`)
}

//喂养状态
function enterRoom() {
    request(`https://jdjoy.jd.com/pet/enterRoom?reqSource=h5`)
}
//看激励视频
function taskVideo() {
  request('https://draw.jdfcloud.com//pet/scan?reqSource=weapp', 'weapp')
}

//好友列表
function getFriends() {
    request(`https://jdjoy.jd.com/pet/getFriends?itemsPerPage=20&currentPage=1`)
}

//进入好友房间
function enterFriendRoom(friendPin) {
    let url = "https://jdjoy.jd.com/pet/enterFriendRoom?friendPin="+friendPin
    let encodeURI_url = encodeURI(url)
    request(encodeURI_url)
}

//收集好友金币
function getFriendCoin(friendPin) {
    let url = "https://jdjoy.jd.com/pet/getFriendCoin?friendPin="+friendPin
    let encodeURI_url = encodeURI(url)
    request(encodeURI_url)
}

//收集好友狗粮
function getRandomFood(friendPin) {
    let url = "https://jdjoy.jd.com/pet/getRandomFood?friendPin="+friendPin
    let encodeURI_url = encodeURI(url)
    request(encodeURI_url)
}

//帮忙喂食
function helpFeed(friendPin) {
    let url = "https://jdjoy.jd.com/pet/helpFeed?friendPin="+friendPin
    let encodeURI_url = encodeURI(url)
    request(encodeURI_url)
}

function sanVideo() {
  const body = {
    "taskType": "ViewVideo",
    "reqSource": "weapp"
  }
  requestPost('https://draw.jdfcloud.com//pet/scan', body, 'application/json', 'weapp')
}
function request(url) {
    console.log(`\n request url:：：${url}\n`);
    const option =  {
        url: url,
        headers: {
            Cookie: cookie,
            reqSource: 'h5',
          'Host': 'jdjoy.jd.com',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Referer': 'https://jdjoy.jd.com/pet/index?un_area=5_274_49707_49973&lng=116.8439659502069&lat=39.95722551778479',
          'User-Agent': 'jdapp;iPhone;8.5.8;13.4.1;9b812b59e055cd226fd60ebb5fd0981c4d0d235d;network/wifi;supportApplePay/3;hasUPPay/0;pushNoticeIsOpen/0;model/iPhone9,2;addressid/138109592;hasOCPay/0;appBuild/167169;supportBestPay/0;jdSupportDarkMode/0;pv/200.75;apprpd/MyJD_Main;ref/MyJdMTAManager;psq/29;ads/;psn/9b812b59e055cd226fd60ebb5fd0981c4d0d235d|608;jdv/0|direct|-|none|-|1587263154256|1587263330;adk/;app_device/IOS;pap/JA2015_311210|8.5.8|IOS 13.4.1;Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
          'Accept-Language': 'zh-cn',
          'Accept-Encoding': 'gzip, deflate, br',
        }
    };
    $.get(option, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        sleep(data);
      }
      // if (err) {
      //   console.log("\n京东宠汪汪: API查询请求失败 ‼️‼️")
      //   $.msg('京东宠汪汪', `脚本执行中断`, `京东宠汪汪: API查询请求失败 ‼️‼️`);
      //   $.done();
      // } else {
      //   try {
      //     data = JSON.parse(data);
      //   } catch (e) {
      //     console.log(e);
      //   } finally {
      //     sleep(data);
      //   }
      // }
    })
}

function requestPost(url, body, ContentType) {
    console.log(`\n request url:：：${url}\n`);
    console.log(`request body:${body}\n`);
    console.log(`request ContentType:${ContentType}\n`);
    const options = {
        url: url,
        body: body,
        headers: {
            Cookie: cookie,
        UserAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`,
            reqSource: 'h5',
            'Content-Type': ContentType,
          'Host': 'jdjoy.jd.com',
          'Referer': 'https://jdjoy.jd.com/pet/index?un_area=5_274_49707_49973&lng=116.8439659502069&lat=39.95722551778479',
          'Accept-Language': 'zh-cn',
          'Accept-Encoding': 'gzip, deflate, br',
        }
    };
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        sleep(data);
      }
      // if (err) {
      //   console.log("\n京东宠汪汪: API查询请求失败 ‼️‼️")
      //   $.msg('京东宠汪汪', `${err.name}`, `京东宠汪汪: API查询请求失败 ‼️‼️`);
      //   $.done();
      // } else {
      //   try {
      //     data = JSON.parse(data);
      //   } catch (e) {
      //     console.log(e);
      //   } finally {
      //     sleep(data);
      //   }
      // }
    })
}

function sleep(response) {
    console.log('休息一下');
    setTimeout(() => {
        console.log('休息结束');
        Task.next(response)
    }, 1000);
}

// https://jdjoy.jd.com/pet/getPetTaskConfig?reqSource=h5
// prettier-ignore
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=s&&s.timeout?s.timeout:o;const[h,a]=i.split("@"),r={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":h,Accept:"*/*"}};$.post(r,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;$.isMute||(this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o))),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}