//京东萌宠助手 搬得https://github.com/liuxiaoyucc/jd-helper/blob/master/pet/pet.js

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
//直接用NobyDa的js cookie
const cookie = $hammer.read('CookieJD');

var shareCodes = [ // 这个列表填入你要助力的好友的shareCode, 最多可能是5个? 没有验证过
    'MTAxODcxOTI2NTAwMDAwMDAwMDc4MDExNw==',
    'MTAxODcxOTI2NTAwMDAwMDAyNjA4ODQyMQ==',
    'MTAxODc2NTEzMDAwMDAwMDAwNTUwNDUxMw==',
    'MTAxODc2NTEzOTAwMDAwMDAxODQ5MDg5NQ==',
    'MTAxODcxOTI2NTAwMDAwMDAxOTQ3MjkzMw=='
]

var petInfo = null;
var taskInfo = null;
const name = '东东萌宠';
let message = '';
let subTitle = '';
let goodsUrl = '';
//按顺序执行, 尽量先执行不消耗狗粮的任务, 避免中途狗粮不够, 而任务还没做完
// var function_map = {
//     signInit: getSignReward, //每日签到
//     threeMealInit: getThreeMealReward, //三餐
//     browseSingleShopInit: getSingleShopReward, //浏览店铺
//     //browseShopsInit: getBrowseShopsReward, //浏览店铺s, 目前只有一个店铺
//     firstFeedInit: firstFeedInit, //首次喂食
//     inviteFriendsInit: inviteFriendsInit, //邀请好友, 暂未处理
//     feedReachInit: feedReachInit, //喂食10次任务  最后执行投食10次任务, 提示剩余狗粮是否够投食10次完成任务, 并询问要不要继续执行
// };
var function_map = [];
let gen = entrance();
gen.next();
/**
 * 入口函数
 */
async function* entrance() {
    if (!cookie) {
        return $hammer.alert("京东萌宠", '请先获取cookie\n直接使用NobyDa的京东签到获取');
    }
    console.log('任务开始');
    yield initPetTown(); //初始化萌宠
    yield taskInit(); // 初始化任务

    yield petSport(); // 遛弯
    yield slaveHelp();  // 助力, 在顶部shareCodes中填写需要助力的shareCode
    yield masterHelpInit();//获取助力信息

    // 任务开始
    for (let task_name of function_map) {
        if (!taskInfo[task_name].finished) {
            console.log('任务' + task_name + '开始');
            yield eval(task_name + '()');
        } else {
            console.log('任务' + task_name + '已完成');
        }
    }
    const response = await secondInitPetTown(); //再次初始化萌宠
    console.log('再次初始化萌宠的信息', response);
    if (response.code === '0' && response.resultCode === '0' && response.message === 'success') {
      let secondPetInfo = response.result;
      let foodAmount = secondPetInfo.foodAmount; //剩余狗粮
      if (foodAmount - 100 >= 10) {
        for (let i = 0; i < parseInt((foodAmount - 100) / 10); i++) {
          const feedPetRes = await feedPets();
          console.log('feedPetRes', feedPetRes);
          if (feedPetRes.resultCode == 0 && feedPetRes.code == 0) {
             console.log('投食成功')
          }
        }
        yield initPetTown(); //初始化萌宠
        subTitle = petInfo.goodsInfo.goodsName;
        message += `【与爱宠相识】${petInfo.meetDays}天\n`;
        message += `【剩余狗粮】${petInfo.foodAmount}g\n`;
      } else {
        console.log("目前剩余狗粮：【" + foodAmount + "】g,不再继续投食,保留100g用于完成第二天任务");
        subTitle = secondPetInfo.goodsInfo.goodsName;
        message += `【与爱宠相识】${secondPetInfo.meetDays}天\n`;
        message += `【剩余狗粮】${secondPetInfo.foodAmount}g\n`;
      }
    } else {
      console.log(`初始化萌宠失败:  ${JSON.stringify(petInfo)}`);
    }
    yield energyCollect();
    let option = {
      "media-url" : goodsUrl
    }
    $hammer.alert(name, message, subTitle, '', option)
    // $notify(name, subTitle, message);
    console.log('全部任务完成, 如果帮助到您可以点下🌟STAR鼓励我一下, 明天见~');
}


// 收取所有好感度
function energyCollect() {
    console.log('开始收取任务奖励好感度');

    let function_id = arguments.callee.name.toString();
    request(function_id).then(response => {
        console.log(`收取任务奖励好感度完成:${JSON.stringify(response)}`);
        if (response.code === '0') {
            message += `【第${petInfo.medalNum + 2}块勋章完成进度】：${response.result.medalPercent}%，还需投食${response.result.needCollectEnergy}g狗粮\n`;
            message += `【已获得勋章】${petInfo.medalNum + 1}块，还需收集${petInfo.goodsInfo.exchangeMedalNum - petInfo.medalNum - 1}块即可兑换奖品“${petInfo.goodsInfo.goodsName}”\n`;
        }
        gen.next();
    })
}

// 首次投食 任务
function firstFeedInit() {
    console.log('首次投食任务合并到10次喂食任务中');
    setTimeout(() => {
        gen.next();
    }, 2000);
}

/**
 * 投食10次 任务
 */
async function feedReachInit() {
    console.log('投食任务开始...');

    // let foodAmount = petInfo.foodAmount; //剩余狗粮
    let finishedTimes = taskInfo.feedReachInit.hadFeedAmount / 10; //已经喂养了几次
    let needFeedTimes = 10 - finishedTimes; //还需要几次
    // let canFeedTimes = foodAmount / 10;
    // if (canFeedTimes < needFeedTimes) {
        // if (confirm('当前剩余狗粮' + foodAmount + 'g, 已不足投食' + needFeedTimes + '次, 确定要继续吗?') === false) {
        // 	console.log('你拒绝了执行喂养十次任务');
        // 	gen.next();
        // }
    // }

    let tryTimes = 20; //尝试次数
    do {
        console.log(`还需要投食${needFeedTimes}次`);
        let response = await feedPets();
        console.log(`本次投食结果: ${JSON.stringify(response)}`);
        if (response.resultCode == 0 && response.code == 0) {
            needFeedTimes--;
        }
        if (response.resultCode == 3003 && response.code == 0) {
            console.log('剩余狗粮不足, 投食结束');
            needFeedTimes = 0;
        }

        tryTimes--;
    } while (needFeedTimes > 0 && tryTimes > 0)

    console.log('投食任务结束...');
    gen.next();

}

//等待一下
function sleep(s) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, s * 1000);
    })
}

// 遛狗, 每天次数上限10次, 随机给狗粮, 每次遛狗结束需调用getSportReward领取奖励, 才能进行下一次遛狗
async function petSport() {
    console.log('开始遛弯');

    var times = 1;
    var code = 0;
    var resultCode = 0;

    do {
        let response = await request(arguments.callee.name.toString())
        console.log(`第${times}次遛狗完成: ${JSON.stringify(response)}`);
        resultCode = response.resultCode;

        if (resultCode == 0) {
            let sportRevardResult = await getSportReward();
            console.log(`领取遛狗奖励完成: ${JSON.stringify(sportRevardResult)}`);
        }

        times++;
    } while (resultCode == 0 && code == 0)
    if (times > 1) {
        message += '已完成十次遛狗\n';
    }
    gen.next();

}

/**
 * 助力好友, 暂时支持一个好友, 需要拿到shareCode
 * shareCode为你要助力的好友的
 * 运行脚本时你自己的shareCode会在控制台输出, 可以将其分享给他人
 */
async function slaveHelp() {
    let functionId = arguments.callee.name.toString();
    let helpPeoples = '';
    for (let code of shareCodes) {
        console.log(`开始助力好友: ${code}`);
        let response = await request(functionId, {
            shareCode: code
        });
        if (response.code === '0' && response.resultCode === '0') {
            console.log('已给好友: 【' + response.result.masterNickName + '】助力');
            helpPeoples += response.result.masterNickName + '，';
        } else {
            console.log(`助理好友结果: ${response.message}`);
        }
    }
    if (helpPeoples && helpPeoples.length > 0) {
        message += `已成功给${helpPeoples}助力\n`;
    }

    gen.next();
}


// 领取遛狗奖励
function getSportReward() {
    return new Promise((rs, rj) => {
        request(arguments.callee.name.toString()).then(response => {
            rs(response);
        })
    })
}

// 浏览店铺任务, 任务可能为多个? 目前只有一个
async function browseShopsInit() {
    console.log('开始浏览店铺任务');
    let times = 0;
    let resultCode = 0;
    let code = 0;

    do {
        let response = await request("getBrowseShopsReward");
        console.log(`第${times}次浏览店铺结果: ${JSON.stringify(response)}`);
        code = response.code;
        resultCode = response.resultCode;
        times++;
    } while (resultCode == 0 && code == 0 && times < 5)

    console.log('浏览店铺任务结束');
    gen.next();
}

// 浏览指定店铺 任务
function browseSingleShopInit() {
    console.log('准备浏览指定店铺');
    request("getSingleShopReward").then(response => {
        console.log(`浏览指定店铺结果: ${JSON.stringify(response)}`);
        message += '【浏览指定店铺】成功,获取狗粮8g\n';
        gen.next();
    })
}

// 三餐签到, 每天三段签到时间
function threeMealInit() {
    console.log('准备三餐签到');
    request("getThreeMealReward").then(response => {
        console.log(`三餐签到结果: ${JSON.stringify(response)}`);
        if (response.code === '0' && response.resultCode === '0') {
            message += `【定时领狗粮】获得${response.result.threeMealReward}g\n`;
        } else {
            message += `【定时领狗粮】${response.message}\n`;
        }
      gen.next();
    })
}

// 每日签到, 每天一次
function signInit() {
    console.log('准备每日签到');
    request("getSignReward").then(response => {
        console.log(`每日签到结果: ${JSON.stringify(response)}`);
        message += `【每日签到成功】奖励${response.result.signReward}g狗粮\n`;
        gen.next();
    })

}

// 投食
function feedPets() {
    console.log('开始投食');
    return new Promise((rs, rj) => {
        request(arguments.callee.name.toString()).then(response => {
            rs(response);
        })
    })
}

//查询jd宠物信息
function initPetTown() {
    console.log('初始化萌宠信息');
    request(arguments.callee.name.toString()).then((response) => {
        if (response.code === '0' && response.resultCode === '0' && response.message === 'success') {
            petInfo = response.result;
            goodsUrl = response.result.goodsInfo.goodsUrl;
            console.log(`初始化萌宠信息完成: ${JSON.stringify(petInfo)}`);
            console.log(`您的shareCode为: ${petInfo.shareCode}`);
          gen.next();
        } else {
            console.log(`初始化萌宠失败:  ${JSON.stringify(petInfo)}`);
            gen.return();
        }
    })

}
// 再次查询萌宠信息
function secondInitPetTown() {
  console.log('开始再次初始化萌宠信息');
  return new Promise((rs, rj) => {
    request("initPetTown").then(response => {
      rs(response);
    })
  })
}
// 邀请新用户
function inviteFriendsInit() {
    console.log('邀请新用户功能未实现');
    setTimeout(() => {
        gen.next();
    }, 2000);
}

// 好友助力信息
async function masterHelpInit() {
  let res = await request(arguments.callee.name.toString());
  console.log('助力信息: ' , res);
  if (res.code === '0' && res.resultCode === '0' && (res.result.masterHelpPeoples && res.result.masterHelpPeoples.length >= 5)) {
    if(!res.result.addedBonusFlag) {
      console.log("开始领取额外奖励");
      let getHelpAddedBonusResult = await getHelpAddedBonus();
      console.log(`领取30g额外奖励结果：【${getHelpAddedBonusResult.message}】`);
      message += `【额外奖励${getHelpAddedBonusResult.result.reward}领取】${getHelpAddedBonusResult.message}\n`;
    } else {
      console.log("已经领取过5好友助力额外奖励");
      message += `【5好友助力额外奖励】已领取\n`;
    }
  } else {
    console.log("助力好友未达到5个")
    message += `【额外奖励领取失败】原因：助力好友未达5个\n`;
  }
  gen.next();
}
// 领取5好友助力后的奖励
function getHelpAddedBonus() {
  return new Promise((rs, rj)=> {
    request(arguments.callee.name.toString()).then(response=> {
      rs(response);
    })
  })
}

// 初始化任务, 可查询任务完成情况
function taskInit() {
    console.log('开始任务初始化');
    request(arguments.callee.name.toString()).then(response => {
        if (response.resultCode === '9999' || !response.result) {
            console.log('初始化任务异常, 请稍后再试');
            gen.return();
        }
        taskInfo = response.result;
        function_map = taskInfo.taskList;
        console.log(`任务初始化完成: ${JSON.stringify(taskInfo)}`);
        gen.next();
    })

}

// 请求
async function request(function_id, body = {}) {
    await sleep(3); //歇口气儿, 不然会报操作频繁
    return new Promise((resolve, reject) => {
        $hammer.request('GET', taskurl(function_id,body), (error, response) => {
            if(error){
                $hammer.log("Error:", error);
            }else{
                resolve(JSON.parse(response.body));
            }
        })
    })
}

function taskurl(function_id, body = {}) {
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&appid=wh5&loginWQBiz=pet-town&body=${escape(JSON.stringify(body))}`,
        headers: {
            Cookie: cookie,
            UserAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`,
        }
    };
}

