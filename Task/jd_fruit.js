//jd免费水果 搬的https://github.com/liuxiaoyucc/jd-helper/blob/a6f275d9785748014fc6cca821e58427162e9336/fruit/fruit.js

// [task_local]
// #jd免费水果
// cron "1 0 7,12,18 * * *" script-path=https://raw.githubusercontent.com/iepngs/Script/master/jd/fruit.js,tag=jd免费水果
//兼容surge和Loon等软件功能 by@iepngs
//新增和维护功能 by@lxk0301
const $hammer = (() => {
    const isRequest = "undefined" != typeof $request,
        isSurge = "undefined" != typeof $httpClient,
        isQuanX = "undefined" != typeof $task;

    const log = (...n) => { for (let i in n) console.log(n[i]) };
    const alert = (title, body = "", subtitle = "", link = "", option) => {
        if (isSurge) return $notification.post(title, subtitle, body, link);
        if (isQuanX) return $notify(title, subtitle, (link && !body ? link : body), option);
        log("==============📣系统通知📣==============");
        log("title:", title, "subtitle:", subtitle, "body:", body, "link:", link);
    };
    const read = key => {
        if (isSurge) return $persistentStore.read(key);
        if (isQuanX) return $prefs.valueForKey(key);
    },
        write = (key, val) => {
            if (isSurge) return $persistentStore.write(key, val);
            if (isQuanX) return $prefs.setValueForKey(key, val);
        };
    const request = (method, params, callback) => {
        /**
         * 
         * params(<object>): {url: <string>, headers: <object>, body: <string>} | <url string>
         * 
         * callback(
         *      error, 
         *      {status: <int>, headers: <object>, body: <string>} | ""
         * )
         * 
         */
        let options = {};
        if (typeof params == "string") {
            options.url = params;
        } else {
            options.url = params.url;
            if (typeof params == "object") {
                params.headers && (options.headers = params.headers);
                params.body && (options.body = params.body);
            }
        }
        method = method.toUpperCase();

        const writeRequestErrorLog = function (m, u) {
            return err => {
                log("=== request error -s--");
                log(`${m} ${u}`, err);
                log("=== request error -e--");
            };
        }(method, options.url);

        if (isSurge) {
            const _runner = method == "GET" ? $httpClient.get : $httpClient.post;
            return _runner(options, (error, response, body) => {
                if (error == null || error == "") {
                    response.body = body;
                    callback("", response);
                } else {
                    writeRequestErrorLog(error);
                    callback(error, "");
                }
            });
        }
        if (isQuanX) {
            options.method = method;
            $task.fetch(options).then(
                response => {
                    response.status = response.statusCode;
                    delete response.statusCode;
                    callback("", response);
                },
                reason => {
                    writeRequestErrorLog(reason.error);
                    callback(reason.error, "");
                }
            );
        }
    };
    const done = (value = {}) => {
        if (isQuanX) return isRequest ? $done(value) : null;
        if (isSurge) return isRequest ? $done(value) : $done();
    };
    return { isRequest, isSurge, isQuanX, log, alert, read, write, request, done };
})();


//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';

//直接用NobyDa的jd cookie
const cookie = $hammer.read('CookieJD')
const name = '京东水果'
//助力好友分享码(最多4个,否则后面的助力失败),原因:京东农场每人每天只有四次助力机会
var shareCodes = [ // 这个列表填入你要助力的好友的shareCode
    'a6f686a9f6aa4c80977370b03681c553',
    'f92cb56c6a1349f5a35f0372aa041ea0',
    'a9360baeceb04c9baaaa109f5d428d3c',
    '61ff5c624949454aa88561f2cd721bf6',
    '40dbf12bb7ea4b8eb772741afe2125da'
]
// 添加box功能
// 【用box订阅的好处】
// 1️⃣脚本也可以远程挂载了。助力功能只需在box里面设置助力码。
// 2️⃣所有脚本的cookie都可以备份，方便你迁移到其他支持box的软件。
let isBox = false //默认没有使用box
const boxShareCodeArr = ['jd_fruit1', 'jd_fruit2', 'jd_fruit3', 'jd_fruit4'];
isBox = boxShareCodeArr.some((item) => {
  const boxShareCode = $hammer.read(item);
  return (boxShareCode !== undefined && boxShareCode !== null && boxShareCode !== '');
});
if (isBox) {
  shareCodes = [];
  for (const item of boxShareCodeArr) {
    if ($hammer.read(item)) {
      shareCodes.push($hammer.read(item));
    }
  }
}
var Task = step();
Task.next();

let farmTask = null;
// let farmInfo = null;

function* step() {
    //
    let message = '';
    let subTitle = '';

    if (!cookie) {
        return $hammer.alert(name, '请先获取cookie\n直接使用NobyDa的京东签到获取');
    }
    
    let farmInfo = yield initForFarm();
    if (farmInfo.farmUserPro) {
      subTitle = farmInfo.farmUserPro.nickName + '的' + farmInfo.farmUserPro.name;
        console.log('shareCode为: ' + farmInfo.farmUserPro.shareCode);
        farmTask = yield taskInitForFarm();
        // console.log(`当前任务详情: ${JSON.stringify(farmTask)}`);
        console.log(`开始签到`);
        if (!farmTask.signInit.todaySigned) {
            let signResult = yield signForFarm(); //签到
            if (signResult.code == "0") {
                message += `【签到成功】获得${signResult.amount}g\n`//连续签到${signResult.signDay}天
            } else {
                message += `签到失败,详询日志\n`
                console.log(`签到结果:  ${JSON.stringify(signResult)}`);
            }
        } else {
            console.log(`今天已签到,连续签到${farmTask.signInit.totalSigned},下次签到可得${farmTask.signInit.signEnergyEachAmount}g`);
            // message += `今天已签到,连续签到${farmTask.signInit.totalSigned},下次签到可得${farmTask.signInit.signEnergyEachAmount}g\n`
        }
        console.log(`签到结束,开始广告浏览任务`);
        let goalResult = yield gotWaterGoalTaskForFarm();
        console.log(`被水滴砸中奖励:${JSON.stringify(goalResult)}`);
        if (!farmTask.gotBrowseTaskAdInit.f) {
            let adverts = farmTask.gotBrowseTaskAdInit.userBrowseTaskAds
            let browseReward = 0
            let browseSuccess = 0
            let browseFail = 0
            for (let advert of adverts) { //开始浏览广告
                if (advert.limit <= advert.hadFinishedTimes) {
                    // browseReward+=advert.reward
                    console.log(`${advert.mainTitle}+ ' 已完成`);//,获得${advert.reward}g
                    continue;
                }
                console.log('正在进行广告浏览任务: ' + advert.mainTitle);
                let browseResult = yield browseAdTaskForFarm(advert.advertId, 0);
                if (browseResult.code == 0) {
                    console.log(`${advert.mainTitle}浏览任务完成`);
                    //领取奖励
                    let browseRwardResult = yield browseAdTaskForFarm(advert.advertId, 1);
                    if (browseRwardResult.code == '0') {
                        console.log(`领取浏览${advert.mainTitle}广告奖励成功,获得${browseRwardResult.amount}g`)
                        browseReward += browseRwardResult.amount
                        browseSuccess++
                    } else {
                        browseFail++
                        console.log(`领取浏览广告奖励结果:  ${JSON.stringify(browseRwardResult)}`)
                    }
                } else {
                    browseFail++
                    console.log(`广告浏览任务结果:   ${JSON.stringify(browseResult)}`);
                }
            }
            if (browseFail > 0) {
                message += `【广告浏览】完成${browseSuccess}个,失败${browseFail},获得${browseReward}g\n`
            } else {
                message += `【广告浏览】完成${browseSuccess}个,获得${browseReward}g\n`
            }
        } else {
            console.log(`今天已经做过浏览任务`);
            // message += '今天已经做过浏览任务\n'
        }
        //定时领水
        if (!farmTask.gotThreeMealInit.f) {
            //
            let threeMeal = yield gotThreeMealForFarm();
            if (threeMeal.code == "0") {
                message += `【定时领水】获得${threeMeal.amount}g\n`
            } else {
                message += `【定时领水】失败,详询日志\n`
                console.log(`定时领水成功结果:  ${JSON.stringify(threeMeal)}`);
            }
        } else {
            // message += '当前不在定时领水时间断或者已经领过\n'
            console.log('当前不在定时领水时间断或者已经领过')
        }
        const masterHelpResult = yield masterHelpTaskInitForFarm();
        console.log("初始化助力信息", masterHelpResult);
        if (masterHelpResult.code === '0' && (masterHelpResult.masterHelpPeoples && masterHelpResult.masterHelpPeoples.length >=5)) {
          // 已有五人助力。领取助力后的奖励
            if (!masterHelpResult.masterGotFinal ) {
                const masterGotFinished = yield masterGotFinishedTaskForFarm();
                if (masterGotFinished.code === '0') {
                    console.log(`已成功领取好友助力奖励：【${masterGotFinished.amount}】g水`);
                    message += `【好友助力额外奖励】:${masterGotFinished.amount}g水领取成功\n`;
                }
            } else {
                console.log("已经领取过5好友助力额外奖励");
                message += `【好友助力额外奖励】已被领取过\n`;
            }
        } else {
            console.log("助力好友未达到5个");
            message += `【额外奖励领取失败】原因：助力好友未达5个\n`;
        }
        //助力
        // masterHelpTaskInitForFarm
        console.log('开始助力好友')
        let salveHelpAddWater = 0;
        let remainTimes = 4;//今日剩余助力次数,默认4次（京东农场每人每天4次助力机会）。
        let helpSuccessPeoples = '';//成功助力好友
        for (let code of shareCodes) {
            if (code == farmInfo.farmUserPro.shareCode) {
                console.log('跳过自己的shareCode')
                continue
            }
            console.log(`开始助力好友: ${code}`);
            let helpResult = yield masterHelp(code)
            if (helpResult.code == 0) {
                if (helpResult.helpResult.code === '0') {
                    //助力成功
                    salveHelpAddWater += helpResult.helpResult.salveHelpAddWater;
                    console.log(`【助力好友结果】: 已成功给【${helpResult.helpResult.masterUserInfo.nickName}】助力`);
                    helpSuccessPeoples += helpResult.helpResult.masterUserInfo.nickName + '，';
                } else if (helpResult.helpResult.code === '8'){
                    console.log(`【助力好友结果】: 助力【${helpResult.helpResult.masterUserInfo.nickName}】失败，您今天助力次数已耗尽`);
                } else if (helpResult.helpResult.code === '9'){
                    console.log(`【助力好友结果】: 之前给【${helpResult.helpResult.masterUserInfo.nickName}】助力过了`);
                } else if (helpResult.helpResult.code === '10') {
                    console.log(`【助力好友结果】: 好友【${helpResult.helpResult.masterUserInfo.nickName}】已满五人助力`);
                }
                console.log(`【今日助力次数还剩】${helpResult.helpResult.remainTimes}次`);
                remainTimes =  helpResult.helpResult.remainTimes;
            }
        }
        if (helpSuccessPeoples && helpSuccessPeoples.length > 0) {
            message += `已成功给${helpSuccessPeoples}助力\n`;
        }
        if (salveHelpAddWater > 0) {
            message += `【助力好友】获得${salveHelpAddWater}g\n`
        }
        message += `【今日剩余助力次数】：${remainTimes}\n`;
        console.log('助力好友结束，即将开始每日浇水任务');
        // console.log('当前水滴剩余: ' + farmInfo.farmUserPro.totalEnergy);
        // farmTask = yield taskInitForFarm();

        //浇水10次
        if (farmTask.totalWaterTaskInit.totalWaterTaskTimes < farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
            let waterCount = 0
            for (; waterCount < farmTask.totalWaterTaskInit.totalWaterTaskLimit - farmTask.totalWaterTaskInit.totalWaterTaskTimes; waterCount++) {
                console.log(`第${waterCount + 1}次浇水`);
                let waterResult = yield waterGoodForFarm();
                console.log(`本次浇水结果:   ${JSON.stringify(waterResult)}`);
                if (waterResult.code != 0) {//异常中断
                    break
                }
                if (waterResult.finished) {
                    //猜测 还没到那阶段 不知道对不对
                    message += `【猜测】应该可以领取水果了，请去农场查看\n`
                    break
                }
                if (waterResult.totalEnergy < 10) {
                    console.log(`水滴不够，结束浇水`)
                    break
                }
            }
            farmTask = yield taskInitForFarm();
            message += `【自动浇水】浇水${waterCount}次，今日浇水${farmTask.totalWaterTaskInit.totalWaterTaskTimes}次\n`
        } else {
            console.log('今日已完成10次浇水任务');
        }
        //领取首次浇水奖励
        if (!farmTask.firstWaterInit.f && farmTask.firstWaterInit.totalWaterTimes > 0) {
            let firstWaterReward = yield firstWaterTaskForFarm();
            if (firstWaterReward.code == '0') {
                message += `【首次浇水奖励】获得${firstWaterReward.amount}g\n`
            } else {
                message += '【首次浇水奖励】领取奖励失败,详询日志\n'
                console.log(`领取首次浇水奖励结果:  ${JSON.stringify(firstWaterReward)}`);
            }
        }
        //领取10次浇水奖励
        if (!farmTask.totalWaterTaskInit.f && farmTask.totalWaterTaskInit.totalWaterTaskTimes >= farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
            let totalWaterReward = yield totalWaterTaskForFarm();
            if (totalWaterReward.code == '0') {
                // console.log(`领取10次浇水奖励结果:  ${JSON.stringify(totalWaterReward)}`);
                message += `【十次浇水奖励】获得${totalWaterReward.totalWaterTaskEnergy}g\n`//，
            } else {
                message += '【十次浇水奖励】领取奖励失败,详询日志\n'
                console.log(`领取10次浇水奖励结果:  ${JSON.stringify(totalWaterReward)}`);
            }
        } else if (farmTask.totalWaterTaskInit.totalWaterTaskTimes < farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
            message += `【十次浇水奖励】任务未完成，今日浇水${farmTask.totalWaterTaskInit.totalWaterTaskTimes}次\n`
        }
        // 水滴雨
        if (!farmTask.waterRainInit.f) {
          console.log(`水滴雨任务，每天两次，最多可得10g水滴`);
          console.log(`两次水滴雨任务是否全部完成：${farmTask.waterRainInit.f ? '是' : '否'}`);
          if (farmTask.waterRainInit.winTimes === 0) {
            console.log(`开始水滴雨任务,这是第${farmTask.waterRainInit.winTimes + 1}次，剩余${2 - (farmTask.waterRainInit.winTimes + 1)}次`);
            let waterRain = yield waterRainForFarm();
            console.log('水滴雨waterRain', waterRain);
            if (waterRain.code === '0') {
              console.log('水滴雨任务执行成功，获得水滴：' + waterRain.addEnergy + 'g');
              message += `【第${farmTask.waterRainInit.winTimes + 1}次水滴雨任务】获得${waterRain.addEnergy}g水滴\n`
            }
          } else {
            //执行了第一次水滴雨。需等待3小时候才能再次执行
            if (new Date().getTime()  > (farmTask.waterRainInit.lastTime + 3 * 60 * 60 *1000)) {
              console.log(`开始水滴雨任务,这是第${farmTask.waterRainInit.winTimes + 1}次，剩余${2 - (farmTask.waterRainInit.winTimes + 1)}次`);
              let waterRain = yield waterRainForFarm();
              console.log('水滴雨waterRain', waterRain);
              if (waterRain.code === '0') {
                console.log('水滴雨任务执行成功，获得水滴：' + waterRain.addEnergy + 'g');
                message += `【第${farmTask.waterRainInit.winTimes + 1}次水滴雨任务】获得${waterRain.addEnergy}g水滴\n`
              }
            } else {
              console.log(`【第${farmTask.waterRainInit.winTimes + 1}次水滴雨任务】未到时间，请稍后再试\n`)
              message += `【第${farmTask.waterRainInit.winTimes + 1}次水滴雨任务】未到时间，请稍后再试\n`
            }
          }
        } else {
          message += `【当天两次水滴雨任务】已全部完成，获得20g水滴\n`
        }
        console.log('finished 水果任务完成!');

        farmInfo = yield initForFarm();
        // 所有的浇水(10次浇水)任务，获取水滴任务完成后，如果剩余水滴大于等于110g,则继续浇水(保留100g是用于完成第二天的浇水10次的任务)
        let overageEnergy = farmInfo.farmUserPro.totalEnergy - 100;
        if (overageEnergy >= 10) {
          console.log("目前剩余水滴：【" + farmInfo.farmUserPro.totalEnergy + "】g，可继续浇水");
          for (let i = 0; i < parseInt(overageEnergy / 10); i++){
            let res = yield waterGoodForFarm();
            if (res.totalEnergy <= 100) {
              console.log(`目前水滴【${res.totalEnergy}】g，不再继续浇水`)
            } else {
              console.log(`目前剩余水滴：【${res.totalEnergy}】g，可继续浇水`);
            }
          }
        } else {
          console.log("目前剩余水滴：【" + farmInfo.farmUserPro.totalEnergy + "】g,不再继续浇水,保留100g水滴用于完成第二天任务")
        }
        farmInfo = yield initForFarm();
        message += `【水果进度】已浇水${farmInfo.farmUserPro.treeEnergy / 10}次,还需${(farmInfo.farmUserPro.treeTotalEnergy - farmInfo.farmUserPro.treeEnergy) / 10}次\n`
        if (farmInfo.toFlowTimes > (farmInfo.farmUserPro.treeEnergy / 10)) {
            message += `【开花进度】再浇水${farmInfo.toFlowTimes - farmInfo.farmUserPro.treeEnergy / 10}次开花\n`
        } else if (farmInfo.toFruitTimes > (farmInfo.farmUserPro.treeEnergy / 10)) {
            message += `【结果进度】再浇水${farmInfo.toFruitTimes - farmInfo.farmUserPro.treeEnergy / 10}次结果\n`
        } else {
        }
        message += `【剩余水滴】${farmInfo.farmUserPro.totalEnergy}g\n`
//        //集卡抽奖活动
//        console.log('开始集卡活动')
//
//        //初始化集卡抽奖活动数据
//        let turntableFarm = yield initForTurntableFarm()
//        if (turntableFarm.code == 0) {
//            //浏览爆品任务
//            if (!turntableFarm.turntableBrowserAdsStatus) {
//                let browserResult1 = yield browserForTurntableFarm(1);
//                console.log(`浏览爆品任务结果${JSON.stringify(browserResult1)}`)
//                if (browserResult1.code == 0) {
//                    let browserResult2 = yield browserForTurntableFarm(2);
//                    console.log(`领取爆品任务奖励结果${JSON.stringify(browserResult2)}`)
//                }
//            }
//            //领取定时奖励 //4小时一次 没判断时间
//            if (!turntableFarm.timingGotStatus) {
//                let timingAward = yield timingAwardForTurntableFarm();
//                console.log(`领取定时奖励结果${JSON.stringify(timingAward)}`)
//            }
//            turntableFarm = yield initForTurntableFarm()
//            console.log('开始抽奖')
//            //抽奖
//            if (turntableFarm.remainLotteryTimes > 0) {
//                let lotteryResult = "【集卡抽奖】获得"
//                for (let i = 0; i < turntableFarm.remainLotteryTimes; i++) {
//                    let lottery = yield lotteryForTurntableFarm()
//                    console.log(`第${i + 1}次抽奖结果${JSON.stringify(lottery)}`)
//
//                    if (lottery.code == 0) {
//                        if (lottery.type == "water") {
//                            lotteryResult += `水滴${lottery.addWater}g `
//                        } else if (lottery.type == "pingguo") {
//                            lotteryResult += "苹果卡 "
//                        } else if (lottery.type == "baixiangguo") {
//                            lotteryResult += "百香果卡 "
//                        } else if (lottery.type == "mangguo") {
//                            lotteryResult += "芒果卡 "
//                        } else if (lottery.type == "taozi") {
//                            lotteryResult += "桃子卡 "
//                        } else if (lottery.type == "mihoutao") {
//                            lotteryResult += "猕猴桃卡 "
//                        } else if (lottery.type == "pingguo") {
//                            lotteryResult += "苹果卡 "
//                        } else if (lottery.type == "coupon") {
//                            lotteryResult += "优惠券 "
//                        } else if (lottery.type == "coupon3") {
//                            lotteryResult += "8斤金枕榴莲 "
//                        } else if (lottery.type == "bean") {
//                            lotteryResult += `京豆${lottery.beanCount}个 `
//                        } else if (lottery.type == "hongbao1") {
//                            lotteryResult += `${lottery.hongBao.balance}元无门槛红包 `
//                        } else {
//                            lotteryResult += `未知奖品${lottery.type} `
//                        }
//                        //没有次数了
//                        if (lottery.remainLotteryTimes == 0) {
//                            break
//                        }
//                    }
//
//                }
//                message += lotteryResult
//            }
//            console.log('抽奖结束')
//
//        } else {
//            console.log(`初始化集卡抽奖活动数据异常, 数据: ${JSON.stringify(farmInfo)}`);
//            message += '【集卡抽奖】初始化集卡抽奖数据异常'
//        }
//        console.log('集卡活动抽奖结束')

        console.log('全部任务结束');
    } else {
        console.log(`初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常,农场初始化数据: ${JSON.stringify(farmInfo)}`);
        message = '初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常'
    }
    let option = {
      'media-url': farmInfo.farmUserPro.goodsImage
    }
    $hammer.alert(name, message, subTitle, '', option)
    $hammer.done();
}

/**
 * 集卡抽奖
 */
function lotteryForTurntableFarm() {
    request(arguments.callee.name.toString(), { type: 1, version: 4, channel: 1 });
}

function timingAwardForTurntableFarm() {
    request(arguments.callee.name.toString(), { version: 4, channel: 1 });
}

// 初始化集卡抽奖活动数据
function initForTurntableFarm() {
    request(arguments.callee.name.toString(), { version: 4, channel: 1 });
}

function browserForTurntableFarm(type) {
    if (type === 1) {
        console.log('浏览爆品会场');
    }
    if (type === 2) {
        console.log('领取浏览爆品会场奖励');
    }

    request(arguments.callee.name.toString(), { type: type });
    // 浏览爆品会场8秒
}


/**
 * 被水滴砸中
 * 要弹出来窗口后调用才有效, 暂时不知道如何控制
 */
function gotWaterGoalTaskForFarm() {
    request(arguments.callee.name.toString(), { type: 3 });
}

//助力好友信息
function masterHelpTaskInitForFarm() {
    let functionId = arguments.callee.name.toString();
    request(functionId);
}
//领取5人助力后的额外奖励
function masterGotFinishedTaskForFarm() {
    console.log("领取助力完成后的水滴")
    let functionId = arguments.callee.name.toString();
    request(functionId);
}

function masterHelp() {
    request(`initForFarm`, { imageUrl: "", nickName: "", shareCode: arguments[0], babelChannel: "3", version: 2, channel: 1 });
}

/**
 * 10次浇水
 */
function totalWaterTaskForFarm() {
    let functionId = arguments.callee.name.toString();
    request(functionId);
}

function firstWaterTaskForFarm() {
    let functionId = arguments.callee.name.toString();
    request(functionId);
}

// 浇水动作
function waterGoodForFarm() {
    let functionId = arguments.callee.name.toString();
    request(functionId);
}

/**
 * 浏览广告任务
 * type为0时, 完成浏览任务
 * type为1时, 领取浏览任务奖励
 */
function browseAdTaskForFarm(advertId, type) {
    let functionId = arguments.callee.name.toString();
    request(functionId, { advertId, type });
}
//签到
function signForFarm() {
    let functionId = arguments.callee.name.toString();
    request(functionId);
}
//定时领水
function gotThreeMealForFarm() {
    let functionId = arguments.callee.name.toString();
    request(functionId);
}

// 初始化任务列表
function taskInitForFarm() {
    let functionId = arguments.callee.name.toString();
    request(functionId);
}

/**
 * 初始化农场, 可获取果树及用户信息
 */
function initForFarm() {
    let functionId = arguments.callee.name.toString();
    request(functionId);
}

/**
 * 水滴雨
 * @param function_id
 * @param body
 */
function waterRainForFarm() {
  let functionId = arguments.callee.name.toString();
  let body = {"type":1,"hongBaoTimes":100,"version":3};
  request(functionId, body);
}
function request(function_id, body = {}) {
    $hammer.request('GET', taskurl(function_id, body), (error, response) => {
        error ? $hammer.log("Error:", error) : sleep(JSON.parse(response.body));
    })
}

function sleep(response) {
    console.log('休息一下');
    setTimeout(() => {
        $hammer.log('休息结束');
        // $hammer.log(response)
        Task.next(response)
    }, 2000);
}

function taskurl(function_id, body = {}) {
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&body=${escape(JSON.stringify(body))}`,
        headers: {
            Cookie: cookie,
            UserAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`,
        }
    }
}

function taskPostUrl(function_id, body = {}) {
    return {
        url: JD_API_HOST,
        body: `functionId=${function_id}&body=${JSON.stringify(body)}&appid=wh5`,
        headers: {
            Cookie: cookie,
        }
    }
}
