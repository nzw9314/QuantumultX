//jd宠汪汪 搬的https://github.com/uniqueque/QuantumultX/blob/4c1572d93d4d4f883f483f907120a75d925a693e/Script/jd_joy.js
/******************** 转换器 ********************/
let isQuantumultX = $task != undefined;
let isSurge = $httpClient != undefined;
let isLoon = isSurge && typeof $loon != undefined;
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
if (isQuantumultX) {
  var errorInfo = {
    error: "",
  };
  $httpClient = {
    get: (url, cb) => {
      var urlObj;
      if (typeof url == "string") {
        urlObj = {
          url: url,
        }
      } else {
        urlObj = url
      }
      $task.fetch(urlObj).then((response) => {
        cb(undefined, response, response.body)
      }, (reason) => {
        errorInfo.error = reason.error;
        cb(errorInfo, response, "")
      })
    }, post: (url, cb) => {
      var urlObj;
      if (typeof url == "string") {
        urlObj = {
          url: url,
        }
      } else {
        urlObj = url
      }
      url.method = "POST"
      $task.fetch(urlObj).then((response) => {
        cb(undefined, response, response.body)
      }, (reason) => {
        errorInfo.error = reason.error;
        cb(errorInfo, response, "")
      })
    },
  }
}
if (isSurge) {
  $task = {
    fetch: (url) => {
      return new Promise((resolve, reject) => {
        if (url.method == "POST") {
          $httpClient.post(url, (error, response, data) => {
            if (response) {
              response.body = data;
              resolve(response, {
                error: error,
              })
            } else {
              resolve(null, {
                error: error,
              })
            }
          })
        } else {
          $httpClient.get(url, (error, response, data) => {
            if (response) {
              response.body = data;
              resolve(response, {
                error: error,
              })
            } else {
              resolve(null, {
                error: error,
              })
            }
          })
        }
      })
    },
  }
}
if (isQuantumultX) {
  $persistentStore = {
    read: (key) => {
      return $prefs.valueForKey(key)
    }, write: (val, key) => {
      return $prefs.setValueForKey(val, key)
    },
  }
}
if (isSurge) {
  $prefs = {
    valueForKey: (key) => {
      return $persistentStore.read(key)
    }, setValueForKey: (val, key) => {
      return $persistentStore.write(val, key)
    },
  }
}
if (isQuantumultX) {
  $notify = ((notify) => {
    return function (title, subTitle, detail, url = undefined) {
      detail = url === undefined ? detail : `${detail}\n点击链接跳转: ${url}`;
      notify(title, subTitle, detail)
    }
  })($notify);
  $notification = {
    post: (title, subTitle, detail, url = undefined) => {
      detail = url === undefined ? detail : `${detail}\n点击链接跳转: ${url}`;
      $notify(title, subTitle, detail)
    },
  }
}
if (isSurge && !isLoon) {
  $notification.post = ((notify) => {
    return function (title, subTitle, detail, url = undefined) {
      detail = url === undefined ? detail : `${detail}\n点击链接跳转: ${url}`;
      notify.call($notification, title, subTitle, detail)
    }
  })($notification.post);
  $notify = (title, subTitle, detail, url = undefined) => {
    detail = url === undefined ? detail : `${detail}\n点击链接跳转: ${url}`;
    $notification.post(title, subTitle, detail)
  }
}
if (isLoon) {
  $notify = (title, subTitle, detail, url = undefined) => {
    $notification.post(title, subTitle, detail, url)
  }
}
/******************** 转换器 ********************/
// 兼容Loon,surge等app，转化器代码来自：https://github.com/Peng-YM/ScriptConverter
//直接用NobyDa的jd cookie
const cookie = $prefs.valueForKey('CookieJD')
const name = '京东宠汪汪'

var Task = step();
Task.next();

function* step() {
    let message = ''
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
                        let scanMarketResult = yield ScanMarket(market.marketLink)
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
                console.log(`浏览频道今天已完成或任务不存在`)
            }
            //浏览商品奖励积分
            let deskGoodDetails = yield getDeskGoodDetails()
            if (deskGoodDetails.success) {
                for (let deskGood of deskGoodDetails.data.deskGoods) {
                    if (!deskGood.status) {
                        let scanDeskGoodResult = yield ScanDeskGood(deskGood.sku)
                        console.log(`浏览频道${deskGood.skuName}结果${JSON.stringify(scanDeskGoodResult)}`)
                    }
                }
            }else{
                console.log(`浏览商品奖励积分返回结果${JSON.stringify(deskGoodDetails)}`)
            }
        } else {
            console.log(`任务信息${JSON.stringify(petTaskConfig)}`)
            message = petTaskConfig.errorMessage
        }
    } else {
        message = '请先获取cookie\n直接使用NobyDa的京东签到获取'
    }
    $notify(name, '', message)
}
//浏览商品
function ScanDeskGood(sku){
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

function request(url) {
    $task.fetch({
        url: url,
        headers: {
            Cookie: cookie,
            UserAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`,
            reqSource: 'h5',
        },
        method: "GET",
    }).then(
        (response) => {
            return JSON.parse(response.body)
        },
        (reason) => console.log(reason.error, reason)
    ).then((response) => sleep(response))
}

function requestPost(url, body, ContentType) {
    $task.fetch({
        url: url,
        body: body,
        headers: {
            Cookie: cookie,
            reqSource: 'h5',
            'Content-Type': ContentType,
        },
        method: "POST",
    }).then(
        (response) => {
            return JSON.parse(response.body)
        },
        (reason) => console.log(reason.error, reason)
    ).then((response) => sleep(response))
}

function sleep(response) {
    console.log('休息一下');
    setTimeout(() => {
        console.log('休息结束');
        Task.next(response)
    }, 2000);
}

// https://jdjoy.jd.com/pet/getPetTaskConfig?reqSource=h5