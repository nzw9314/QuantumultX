//jd宠汪汪 搬的https://github.com/uniqueque/QuantumultX/blob/4c1572d93d4d4f883f483f907120a75d925a693e/Script/jd_joy.js

//0 */3 * * * jd_joy.js  #每隔三小时运行一次，加快升级
//feedCount:自定义 每次喂养数量; 等级只和喂养次数有关，与数量无关
//推荐每次投喂10个，积累狗粮，然后去聚宝盆赌每小时的幸运奖，据观察，投入3000-6000中奖概率大，超过7000基本上注定亏本，即使是第一名
//Combine from Zero-S1/JD_tools(https://github.com/Zero-S1/JD_tools)
//2020。07.02 解决部分商品market.marketLink为空的时候，浏览不到的bug，解决浏览商品奖励积分api接口返回空值导致脚本报错的bug
const FEED_NUM = 10   // [10,20,40,80]

const $hammer = (() => {
    const isRequest = "undefined" != typeof $request,
        isSurge = "undefined" != typeof $httpClient,
        isQuanX = "undefined" != typeof $task;

    const log = (...n) => { for (let i in n) console.log(n[i]) };
    const alert = (title, body = "", subtitle = "", link = "") => {
        if (isSurge) return $notification.post(title, subtitle, body, link);
        if (isQuanX) return $notify(title, subtitle, (link && !body ? link : body));
        log("==============📣系统通知📣==============");
        log("title:", title, "subtitle:", subtitle, "body:", body, "link:", link);
    };
    const read = key => {
        if (isSurge) return $persistentStore.read(key);
        if (isQuanX) return $prefs.valueForKey(key);
    };
    const write = (val, key) => {
        if (isSurge) return $persistentStore.write(val, key);
        if (isQuanX) return $prefs.setValueForKey(val, key);
    };
    const request = (method, params, callback) => {
        /**
         *
         * params(<object>): {url: <string>, headers: <object>, body: <string>} | <url string>
         *
         * callback(
         *      error,
         *      <response-body string>?,
         *      {status: <int>, headers: <object>, body: <string>}?
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
                    callback("", body, response);
                } else {
                    writeRequestErrorLog(error);
                    callback(error);
                }
            });
        }
        if (isQuanX) {
            options.method = method;
            $task.fetch(options).then(
                response => {
                    response.status = response.statusCode;
                    delete response.statusCode;
                    callback("", response.body, response);
                },
                reason => {
                    writeRequestErrorLog(reason.error);
                    callback(reason.error);
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

//直接用NobyDa的jd cookie
const cookie = $hammer.read('CookieJD')
const name = '京东宠汪汪'

var Task = step();
Task.next();

function* step() {
    const startTime = Date.now();
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
            // 喂食
            let feedPetsResult = yield feedPets()
            console.log(`喂食结果${JSON.stringify(feedPetsResult)}`)
            // 喂养状态
            let enterRoomResult = yield enterRoom()
            console.log(`喂养状态${JSON.stringify(enterRoomResult)}`)
            message = `现有积分: ${enterRoomResult.data.petCoin}\n现有狗粮: ${enterRoomResult.data.petFood}\n喂养次数: ${enterRoomResult.data.feedCount}\n宠物等级: ${enterRoomResult.data.petLevel}`
            subTitle = `【用户名】${enterRoomResult.data.pin}`
        } else {
            console.log(`任务信息${JSON.stringify(petTaskConfig)}`)
            message = petTaskConfig.errorMessage
        }
    } else {
        message = '请先获取cookie\n直接使用NobyDa的京东签到获取'
    }
    const end = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n完成${name}脚本耗时:  ${end} 秒\n`);
    $hammer.alert(name, message, subTitle)
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

function request(url) {
    $hammer.log("request url:", url);
    const option =  {
        url: url,
        headers: {
            Cookie: cookie,
            reqSource: 'h5',
        }
    };
    $hammer.request('GET', option, (error, response) => {
        error ? $hammer.log("Error:", error) : sleep(JSON.parse(response));
    })
}

function requestPost(url, body, ContentType) {
    $hammer.log("request url:", url, "body:", body, "ContetentType:", ContentType);
    const options = {
        url: url,
        body: body,
        headers: {
            Cookie: cookie,
        UserAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`,
            reqSource: 'h5',
            'Content-Type': ContentType,
        }
    };
    $hammer.request('POST', options, (error, response) => {
        error ? $hammer.log("Error:", error) : sleep(JSON.parse(response));
    })
}

function sleep(response) {
    console.log('休息一下');
    setTimeout(() => {
        console.log('休息结束');
        Task.next(response)
    }, 3000);
}

// https://jdjoy.jd.com/pet/getPetTaskConfig?reqSource=h5