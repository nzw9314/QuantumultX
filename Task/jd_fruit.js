//jd免费水果 搬的https://github.com/liuxiaoyucc/jd-helper/blob/a6f275d9785748014fc6cca821e58427162e9336/fruit/fruit.js
//只能quanx用，request里面的请求跟获取cookie的地方改改，别的app应该也能用

//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';

//直接用NobyDa的jd cookie
const cookie = $prefs.valueForKey('CookieJD')
const name = '京东水果'
// let $={};
var shareCodes = [ // 这个列表填入你要助力的好友的shareCode, 最多可能是5个? 没有验证过
    'a6f686a9f6aa4c80977370b03681c553',
    'f92cb56c6a1349f5a35f0372aa041ea0',
]
var Task = step();
Task.next();

let farmTask = null;
// let farmInfo = null;

function* step() {
    //
    let message = ''
    if (cookie) {
        let farmInfo = yield initForFarm();
        if (farmInfo.farmUserPro) {
            console.log('shareCode为: ' + farmInfo.farmUserPro.shareCode);
            farmTask = yield taskInitForFarm();
            // console.log(`当前任务详情: ${JSON.stringify(farmTask)}`);
            console.log(`开始签到`);
            if (!farmTask.signInit.todaySigned) {
                let signResult = yield signForFarm(); //签到
                if (signResult.code == "0") {
                    message += `签到成功，获得${signResult.amount}g\n`//连续签到${signResult.signDay}天
                } else {
                    message += `签到失败,详询日志\n`
                    console.log(`签到结果:  ${JSON.stringify(signResult)}`);
                }
            } else {
                // message += `今天已签到,连续签到${farmTask.signInit.totalSigned},下次签到可得${farmTask.signInit.signEnergyEachAmount}g\n`
            }
            console.log(`签到结束,开始广告浏览任务`);
            // let goalResult = yield gotWaterGoalTaskForFarm();
            // console.log('被水滴砸中奖励: ', goalResult);
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
                message += `完成广告浏览任务${browseSuccess}个,失败${browseFail},获得${browseReward}g\n`
            } else {
                // message += '今天已经做过浏览任务\n'
            }
            //定时领水
            if (!farmTask.gotThreeMealInit.f) {
                //
                let threeMeal = yield gotThreeMealForFarm();
                if (threeMeal.code == "0") {
                    message += `定时领水成功，获得${threeMeal.amount}g\n`
                } else {
                    message += `定时领水成功失败,详询日志\n`
                    console.log(`定时领水成功结果:  ${JSON.stringify(threeMeal)}`);
                }
            } else {
                // message += '当前不在定时领水时间断或者已经领过\n'
            }
            //助力
            // masterHelpTaskInitForFarm

            console.log('即将开始每日浇水任务');
            // console.log('当前水滴剩余: ' + farmInfo.farmUserPro.totalEnergy);
            // farmTask = yield taskInitForFarm();

            //浇水10次
            if (farmTask.totalWaterTaskInit.totalWaterTaskTimes < farmTask.totalWaterTaskInit.totalWaterTaskLimit) {
                let waterCount = 0
                do {
                    console.log('已浇水 ' + farmTask.totalWaterTaskInit.totalWaterTaskTimes + ' 次');
                    let waterResult = yield waterGoodForFarm();
                    console.log(`本次浇水结果:   ${JSON.stringify(waterResult)}`);
                    if (waterResult.code != 0) {//异常中断
                        break
                    }
                    waterCount++
                    farmTask = yield taskInitForFarm();
                    if (waterResult.finished){
                        //猜测 还没到那阶段 不知道对不对
                        message += `应该可以领取水果了\n`
                    }
                } while (farmTask.totalWaterTaskInit.totalWaterTaskTimes < farmTask.totalWaterTaskInit.totalWaterTaskLimit)
                message += `浇水${waterCount}次\n`
            }
            //领取首次浇水奖励
            if (farmTask.firstWaterInit.firstWaterFinished && !farmTask.firstWaterInit.f) {
                let firstWaterReward = yield firstWaterTaskForFarm();
                if (firstWaterReward.code == '0') {
                    message += `领取首次浇水奖励成功，获得${firstWaterReward.amount}g\n`
                } else {
                    message += '领取首次浇水奖励失败,详询日志\n'
                    console.log(`领取首次浇水奖励结果:  ${JSON.stringify(firstWaterReward)}`);
                }
            }
            //领取10次浇水奖励
            if (farmTask.totalWaterTaskInit.totalWaterTaskFinished && !farmTask.totalWaterTaskInit.f) {
                let totalWaterReward = yield totalWaterTaskForFarm();
                if (totalWaterReward.code == '0') {
                    message += `领取10次浇水奖励成功，获得${totalWaterReward.amount}g\n`
                } else {
                    message += '领取10次浇水奖励失败,详询日志\n'
                    console.log(`领取10次浇水奖励结果:  ${JSON.stringify(totalWaterReward)}`);
                }
            }
            console.log('finished 水果任务完成!');
            yield browserForTurntableFarm(1);
            yield browserForTurntableFarm(2);
            farmInfo = yield initForFarm();
            let infoMessage=`已浇水${farmInfo.farmUserPro.treeEnergy/10}次,还需${(farmInfo.farmUserPro.treeTotalEnergy- farmInfo.farmUserPro.treeEnergy)/10}次领取${farmInfo.farmUserPro.name}\n`
            if (farmInfo.toFlowTimes>(farmInfo.farmUserPro.treeEnergy/10)){
                infoMessage+=`再浇水${farmInfo.toFlowTimes-farmInfo.farmUserPro.treeEnergy/10}次开花\n`
            }else if (farmInfo.toFruitTimes>(farmInfo.farmUserPro.treeEnergy/10)){
                infoMessage+=`再浇水${farmInfo.toFruitTimes-farmInfo.farmUserPro.treeEnergy/10}次结果\n`
            }else{
            }
            infoMessage+=`当前还有${farmInfo.farmUserPro.totalEnergy}g\n`
            message=infoMessage+message

            console.log('全部任务结束');
        } else {
            console.log(`初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常,农场初始化数据: ${JSON.stringify(farmInfo)}`);
            message = '初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常'
        }
    } else {
        message = '请先获取cookie\n直接使用NobyDa的京东签到获取'

    }
    $notify(name, '', message)
}
/**
 * 集卡抽奖
 */
function lotteryForTurntableFarm() {

    request(arguments.callee.name.toString(), { type: 1 });
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


function request(function_id, body = {}) {
    // console.log(function_id);
    $task.fetch(taskurl(function_id, body)).then(
        (response) => {
            // $.log(response.body)
            return JSON.parse(response.body)
        },
        (reason) => console.log(reason.error, reason)//callback(reason.error, reason, reason)
    ).then((response) => sleep(response))
}
function sleep(response) {
    console.log('休息一下');
    setTimeout(() => {
        console.log('休息结束');
        Task.next(response)
    }, 2000);
}

function taskurl(function_id, body = {}) {
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&body=${escape(JSON.stringify(body))}`,
        headers: {
            Cookie: cookie,
            UserAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`,
        },
        method: "GET",
    }
}

function taskposturl(function_id, body = {}) {
    return {
        url: JD_API_HOST,
        body: `functionId=${function_id}&body=${JSON.stringify(body)}&appid=wh5`,
        headers: {
            Cookie: cookie,
        },
        method: "POST",
    }
}