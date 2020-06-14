//jd免费水果 搬的https://github.com/liuxiaoyucc/jd-helper/blob/a6f275d9785748014fc6cca821e58427162e9336/fruit/fruit.js
//只能quanx用

//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';
//直接用NobyDa的js cookie
const cookie = $prefs.valueForKey('CookieJD')

var Task = step();
Task.next();

let farmTask = null;
let farmInfo = null;

function* step() {
    farmTask = yield taskInitForFarm();
    console.log(`当前任务详情: ${JSON.stringify(farmTask)}`);
    farmInfo = yield initForFarm();
    console.log(`农场初始化数据: ${JSON.stringify(farmInfo)}`);

    if (farmInfo.farmUserPro) {
        console.log('shareCode为: ' + farmInfo.farmUserPro.shareCode);
    } else {
        console.log('初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常');
    }

    if (!farmTask.signInit.todaySigned) {
        let signResult = yield signForFarm(); //签到
        console.log(`签到结果:  ${JSON.stringify(signResult)}`);
    }

    // let goalResult = yield gotWaterGoalTaskForFarm();
    // console.log('被水滴砸中奖励: ', goalResult);

    let adverts = farmTask.gotBrowseTaskAdInit.userBrowseTaskAds
    for (let advert of adverts) { //开始浏览广告
        if (advert.limit <= advert.hadFinishedTimes) {
            console.log(advert.mainTitle + ' 已完成');
            continue;
        }
        console.log('正在进行广告浏览任务: ' + advert.mainTitle);
        let browseResult = yield browseAdTaskForFarm(advert.advertId, 0);
        console.log(`广告浏览任务结果:   ${JSON.stringify(browseResult)}`);
        if (browseResult.code == 0) {
            let browseRwardResult = yield browseAdTaskForFarm(advert.advertId, 1);
            console.log(`领取浏览广告奖励结果:  ${JSON.stringify(browseRwardResult)}`)
        }
    }
    console.log('所有广告浏览任务结束, 即将开始每日浇水任务');

    console.log('当前水滴剩余: ' + farmInfo.farmUserPro.totalEnergy);
    if (farmTask.totalWaterTaskInit.totalWaterTaskTimes < farmTask.totalWaterTaskInit.totalWaterTaskLimit) {

        do {
            console.log('已浇水 ' + farmTask.totalWaterTaskInit.totalWaterTaskTimes + ' 次');
            let waterResult = yield waterGoodForFarm();
            console.log(`本次浇水结果:   ${JSON.stringify(waterResult)}` );
            if (waterResult.code != 0) {//异常中断
                break
            }
            farmTask = yield taskInitForFarm();
        } while (farmTask.totalWaterTaskInit.totalWaterTaskTimes < farmTask.totalWaterTaskInit.totalWaterTaskLimit)

        //这里还需要领取一下浇水奖励
        let firstWaterReward = yield firstWaterTaskForFarm();
        console.log(`首次浇水奖励领取结果:    ${JSON.stringify(firstWaterReward)}`);
        let totalWaterReward = yield totalWaterTaskForFarm();
        console.log(`10次浇水奖励领取结果:    ${JSON.stringify(totalWaterReward)}`);
    }

    console.log('finished 水果任务完成!');
    yield browserForTurntableFarm(1);
    yield browserForTurntableFarm(2);


    console.log('全部任务结束');
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

function signForFarm() {
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
    $task.fetch(taskurl(function_id,body)).then(
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
        url:`${JD_API_HOST}?functionId=${function_id}&appid=wh5&body=${escape(JSON.stringify(body))}`,
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