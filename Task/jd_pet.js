//京东萌宠助手 搬得https://github.com/liuxiaoyucc/jd-helper/blob/master/pet/pet.js
//只能quanx用

//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';
//直接用NobyDa的js cookie
const cookie = $prefs.valueForKey('CookieJD')

var shareCodes = [ // 这个列表填入你要助力的好友的shareCode, 最多可能是5个? 没有验证过
    'MTAxODcxOTI2NTAwMDAwMDAwMDc4MDExNw==',
    'MTAxODcxOTI2NTAwMDAwMDAyNjA4ODQyMQ==',
]

var petInfo = null;
var taskInfo = null;

//按顺序执行, 尽量先执行不消耗狗粮的任务, 避免中途狗粮不够, 而任务还没做完
var function_map = {
    signInit: getSignReward, //每日签到
    threeMealInit: getThreeMealReward, //三餐
    browseSingleShopInit: getSingleShopReward, //浏览店铺
    browseShopsInit: getBrowseShopsReward, //浏览店铺s, 目前只有一个店铺
    firstFeedInit: firstFeedInit, //首次喂食
    inviteFriendsInit: inviteFriendsInit, //邀请好友, 暂未处理
    feedReachInit: feedReachInit, //喂食10次任务  最后执行投食10次任务, 提示剩余狗粮是否够投食10次完成任务, 并询问要不要继续执行
};

/**
 * 入口函数
 */
function* entrance() {
    console.log('任务开始');
    yield initPetTown(); //初始化萌宠
    yield taskInit(); // 初始化任务

    yield petSport(); // 遛弯
    yield slaveHelp();  // 助力, 在顶部shareCodes中填写需要助力的shareCode


    // 任务开始
    for (let task_name in function_map) {
        if (!taskInfo[task_name].finished) {
            console.log('任务' + task_name + '开始');
            yield function_map[task_name]();
        } else {
            console.log('任务' + task_name + '已完成');
        }
    }

    yield energyCollect();

    console.log('全部任务完成, 如果帮助到您可以点下🌟STAR鼓励我一下, 明天见~');
}


// 收取所有好感度
function energyCollect() {
    console.log('开始收取任务奖励好感度');

    let function_id = arguments.callee.name.toString();
    request(function_id).then(response => {
        console.log(`收取任务奖励好感度完成:${JSON.stringify(response)}`);
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

    let foodAmount = petInfo.foodAmount; //剩余狗粮
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

    var times = 0;
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

    gen.next();

}

/**
 * 助力好友, 暂时支持一个好友, 需要拿到shareCode
 * shareCode为你要助力的好友的
 * 运行脚本时你自己的shareCode会在控制台输出, 可以将其分享给他人
 */
async function slaveHelp() {
    let functionId = arguments.callee.name.toString();

    for (let code of shareCodes) {
        console.log(`开始助力好友: ${code}`);
        let response = await request(functionId, {
            shareCode: code
        });
        console.log(`助理好友结果: ${response.message}`);
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
async function getBrowseShopsReward() {
    console.log('开始浏览店铺任务');
    let times = 0;
    let resultCode = 0;
    let code = 0;

    do {
        let response = await request(arguments.callee.name.toString());
        console.log(`第${times}次浏览店铺结果: ${JSON.stringify(response)}`);
        code = response.code;
        resultCode = response.resultCode;
        times++;
    } while (resultCode == 0 && code == 0 && times < 5)

    console.log('浏览店铺任务结束');
    gen.next();
}

// 浏览指定店铺 任务
function getSingleShopReward() {
    console.log('准备浏览指定店铺');
    request(arguments.callee.name.toString()).then(response => {
        console.log(`浏览指定店铺结果: ${JSON.stringify(response)}`);
        gen.next();
    })
}

// 三餐签到, 每天三段签到时间
function getThreeMealReward() {
    console.log('准备三餐签到');
    request(arguments.callee.name.toString()).then(response => {
        console.log(`三餐签到结果: ${JSON.stringify(response)}`);
        gen.next();
    })
}

// 每日签到, 每天一次
function getSignReward() {
    console.log('准备每日签到');
    request(arguments.callee.name.toString()).then(response => {
        console.log(`每日签到结果: ${JSON.stringify(response)}`);
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
            console.log(`初始化萌宠信息完成: ${JSON.stringify(petInfo)}`);
            console.log(`您的shareCode为: ${petInfo.shareCode}`);

            gen.next();
        } else {
            console.log(`初始化萌宠失败:  ${JSON.stringify(petInfo)}`);
            gen.return();
        }
    })

}

// 邀请新用户
function inviteFriendsInit() {
    console.log('邀请新用户功能未实现');
    setTimeout(() => {
        gen.next();
    }, 2000);
}


// 初始化任务, 可查询任务完成情况
function taskInit() {
    console.log('开始任务初始化');
    request(arguments.callee.name.toString()).then(response => {
        if (response.resultCode === '9999' || !response.result) {
            console.log('初始化任务异常, 请稍后再试');
            gen.return();
        }
        taskInfo = response.result
        console.log(`任务初始化完成: ${JSON.stringify(taskInfo)}`);
        gen.next();
    })

}

// 请求
async function request(function_id, body = {}) {
    await sleep(3); //歇口气儿, 不然会报操作频繁
    return new Promise((resolve, reject) => {
        $task.fetch(taskurl(function_id,body)).then(
            (res) => {
                // $.log(response.body)
                return JSON.parse(res.body)
            },
            (reason) => console.log(reason.error, reason)
        ).then((response) => resolve(response))

    })
}

function taskurl(function_id, body = {}) {
    return {
        url:`${JD_API_HOST}?functionId=${function_id}&appid=wh5&loginWQBiz=pet-town&body=${escape(JSON.stringify(body))}`,
        headers: {
            Cookie: cookie
        },
        method: "GET",
    }
}

let gen = entrance();
gen.next();