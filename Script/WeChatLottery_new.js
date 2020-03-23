/*
微信小程序"活动抽奖"自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。
请先按下述方法进行配置，进入"活动抽奖"，手动签到一次或点击"已签到"，若弹出"首次写入活动抽奖 Token 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"活动抽奖 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

2020/03/23：
新增自动参与首页抽奖、进行参与 3 个首页抽奖后的随即兑换、领取参与 5 个首页抽奖后的每日任务奖励。

咕咕咕：
每周任务
参与幸运大礼
自动开奖

注意⚠️：此脚本用于在 2020.03.19 及之后需获取过 token 的用户，且需要更换 rewrite 及 hostname。

Author: zZPiglet

Quantumult X (TestFlight 190+, App Store 1.0.5+):
[task_local]
1 0 * * * WeChatLottery_new.js
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery_new.js

[rewrite_local]
^https:\/\/api-hdcj\.9w9\.com\/v1\/sign url script-request-header WeChatLottery_new.js
or remote
^https:\/\/api-hdcj\.9w9\.com\/v1\/sign url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery_new.js

Surge 4.0+:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery_new.js
http-request ^https:\/\/api-hdcj\.9w9\.com\/v1\/sign script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery_new.js


All app:
[mitm]
hostname = api-hdcj.9w9.com

获取完 Token 后可不注释 rewrite / mitm，Token 更新时会弹窗。若因 mitm 导致该小程序网络不稳定，可注释掉 mtim。
*/


const CheckinURL = 'https://api-hdcj.9w9.com/v1/sign/sign'
const CheckindataURL = 'https://api-hdcj.9w9.com/v1/sign'
const DataURL = 'https://api-hdcj.9w9.com/v1/informations'
const IndexURL = 'https://api-hdcj.9w9.com/v1/index?type=0&gzh_number='
const JoinURL = 'https://api-hdcj.9w9.com/v1/lotteries/'
const ExchangeURL = 'https://api-hdcj.9w9.com/v1/limit_red_envelopes/453'
const DailyURL = 'https://api-hdcj.9w9.com/v1/tasks/80'
const TokenName = '活动签到'
const TokenKey = 'wclotterynew'
const UidKey = 'wcluid'
const datainfo = {}
const $cmp = compatibility()

async function Sign() {
    await Checkin()
    await Checkindata()
    await Join()
    await Exchange()
    await Daily()
    await GetData()
    await notify()
}

if ($cmp.isRequest) {
    GetToken()
    $cmp.done()
} else {
    Sign()
    $cmp.done()
}

function GetToken() {
    if ($request && $request.method == 'GET') {
        var TokenKeyValue = $request.headers['token']
        var UIDValue = $request.headers['uid']
        $cmp.write(UIDValue, UidKey)
        if ($cmp.read(TokenKey) != (undefined || null)) {
            if ($cmp.read(TokenKey) != TokenKeyValue) {
                var token = $cmp.write(TokenKeyValue, TokenKey)
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "")
                }
            }
        } else {
            var token = $cmp.write(TokenKeyValue, TokenKey);
            if (!token) {
                $cmp.notify("首次写入" + TokenName + " Token 失败‼️", "", "")
            } else {
                $cmp.notify("首次写入" + TokenName + " Token 成功 🎉", "", "")
            }
        }
    } else {
        $cmp.notify("写入" + TokenName + "Token 失败‼️", "", "配置错误, 无法读取请求头, ")
    }
}

function Checkin() {
    return new Promise(resolve => {
        const LotteryCheckin = {
            url: CheckinURL,
            headers: {
                "token": $cmp.read('wclotterynew'),
                "uid" : $cmp.read('wcluid'),
            }
        }
        $cmp.get(LotteryCheckin, function(error, response, data) {
            try{
                if (error) {
                    datainfo.error = 0
                    datainfo.errormessage = error
                } else {
                    datainfo.checkin = JSON.parse(data)
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动签到"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Checkindata() {
    return new Promise(resolve => {
        let LotteryCheckindata = {
            url: CheckindataURL,
            headers: {
                "token": $cmp.read('wclotterynew'),
                "uid" : $cmp.read('wcluid'),
            }
        }
        $cmp.get(LotteryCheckindata, function(error, response, data) {
            try{
                const checkindata = JSON.parse(data)
                let day = checkindata.data.cycle
                datainfo.luckcoin = checkindata.data.sign_lucky[day - 1]
                resolve('done')
            } catch (e) {
                $cmp.notify("活动签到签到结果"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Join() {
    return new Promise(resolve => {
        const commonheaders = {
            "token": $cmp.read('wclotterynew'),
            "uid" : $cmp.read('wcluid'),
        }
        const LotteryIndex = {
            url: IndexURL,
            headers: commonheaders
        }
        $cmp.get(LotteryIndex, function(error, response, data) {
            try{
                const index = JSON.parse(data)
                let list = index.data.mr_data
                datainfo.joinCnt = 0
                datainfo.skipedCnt = 0
                datainfo.failCnt = 0
                for (var l of list) {
                    if (l.join_status == true) {
                        datainfo.skipedCnt += 1
                    } else {
                        const LotteryJoin = {
                            url: JoinURL + l.id +'/join',
                            headers:  commonheaders,
                            body: { "template": "" }
                        }
                        $cmp.post(LotteryJoin, function (error, response, data) {
                            try{
                                const joindata = JSON.parse(data)
                                if (joindata.success == true) {
                                    datainfo.joinCnt += 1
                                } else {
                                    datainfo.failCnt += 1
                                    $cmp.log('\n' + l.sponsor_name + '：' + joindata.message.error)
                                }
                            } catch (e) {
                                $cmp.notify("活动签到参与\"${l.sponsor_name}\"抽奖"+e.name+"‼️", JSON.stringify(e), e.message)
                                resolve('done')
                            }
                        })
                    }
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动签到获取抽奖列表"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Exchange() {
    return new Promise(resolve => {
        const LotteryExchange = {
            url: ExchangeURL,
            headers: {
                "token": $cmp.read('wclotterynew'),
                "uid" : $cmp.read('wcluid'),
            }
        }
        $cmp.post(LotteryExchange, function(error, response, data) {
            try{
                if (error) {
                    datainfo.exchangeerror = 0
                    datainfo.exchangeerrormessage = error
                } else {
                    datainfo.exchange = JSON.parse(data)
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动签到兑换结果"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Daily() {
    return new Promise(resolve => {
        const LotteryDaily = {
            url: DailyURL,
            headers: {
                "token": $cmp.read('wclotterynew'),
                "uid" : $cmp.read('wcluid'),
            }
        }
        $cmp.post(LotteryDaily, function(error, response, data) {
            try{
                if (error) {
                    datainfo.dailyerror = 0
                    datainfo.dailyerror = error
                } else {
                    datainfo.daily = JSON.parse(data)
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动签到每日任务"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function GetData() {
    return new Promise(resolve => {
        let LotteryData = {
            url: DataURL,
            headers: {
                "token": $cmp.read('wclotterynew'),
            }
        }
        $cmp.get(LotteryData, function (error, response, data) {
            try {
                const obj = JSON.parse(data)
                datainfo.allluckcoin = obj.data.user_info.lucky_count;
                datainfo.luckmoney = obj.data.user_info.money;
                resolve ('done')
            } catch (e) {
                $cmp.notify("活动签到结果"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })

}

function notify() {
    return new Promise(resolve => {
        try {
            let subTitle = ''
            let detail = ''
            let em = ''
            if (datainfo.error == 0) {
                $cmp.log("wclcheckin failed response: \n" + datainfo.errormessage)
                subTitle += '签到失败 '
                em += '\n签到接口请求失败,详情请看日志。'
            } else if (datainfo.checkin) {
                if (datainfo.checkin.success == true) {
                    subTitle += '签到成功 '
                    detail += '签到获得 ' + datainfo.luckcoin + ' 币,'
                } else if (datainfo.checkin.message.code == 1) {
                    subTitle += '签到重复 '
                } else if (datainfo.checkin.message.code == 30001) {
                    subTitle += '签到失败 '
                    em += '\n签到 Token 失效，请重新获取。'
                } else {
                    $cmp.log("wclcheckin failed response: \n" + datainfo.checkin)
                    subTitle += '签到失败 '
                    em += '\n签到失败：' + datainfo.checkin.message.error + '，详情请看日志。'
                }
            }
            if (datainfo.exchangeerror == 0) {
                $cmp.log("wclcheckin failed response: \n" + datainfo.exchangeerrormessage)
                subTitle += '兑换失败 '
                em += '\n兑换接口请求失败，详情请看日志。'
            } else if (datainfo.exchange) {
                if (datainfo.exchange.success == true) {
                    subTitle += '兑换成功 '
                    detail += '花费 20 币兑换获得 ' + datainfo.exchange.data.money + ' 元,'
                } else if (datainfo.exchange.message.code == 1) {
                    subTitle += '兑换重复 '
                } else {
                    $cmp.log("wclexchange failed response: \n" + datainfo.checkin)
                    subTitle += '兑换失败 '
                    em += '\n兑换失败：' + datainfo.checkin.message.error + '，详情请看日志。'
                }
            }
            if (datainfo.dailyerror == 0) {
                $cmp.log("wcldaily failed response: \n" + datainfo.exchangeerrormessage)
                em += '\n每日任务接口请求失败，详情请看日志。'
            } else if (datainfo.daily) {
                if (datainfo.daily.success == true && datainfo.daily.data) {
                    detail += '每日任务获得 ' + datainfo.daily.data.lucky_count + ' 币。'
                } else if (datainfo.daily.success == true && !datainfo.daily.data) {

                } else {
                    $cmp.log("wcldail failed response: \n" + datainfo.daily)
                    em += '\n每日任务失败：' + datainfo.daily.message.error + '，详情请看日志。'
                }
            }
            detail += '账户共有 ' + datainfo.allluckcoin + " 币及 " + datainfo.luckmoney + " 元。💰"
            if (datainfo.joinCnt > 0) {
                subTitle += '参与抽奖 ' + datainfo.joinCnt + ' 个 '
            }
            if (datainfo.failCnt > 0 ) {
                em += '\n抽奖失败共' + datainfo.failCnt + ' 个，详情请看日志。'
            }
            if (datainfo.skipedCnt > 0) {
                detail += '\n跳过 ' + datainfo.skipedCnt +' 个已参与的抽奖。'
            }
            $cmp.notify(TokenName, subTitle, detail+em)
            resolve('done')
        } catch (e) {
            $cmp.notify("通知模块 " + e.name + "‼️", JSON.stringify(e), e.message)
            resolve('done')
        }
    })
}

function compatibility() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
    const isNode = typeof require == "function" && !isJSBox;
    const node = (() => {
        if (isNode) {
            const request = require('request');
            return ({request})
        } else {
            return (null)
        }
    })()
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (isNode) log(title+subtitle+message)
        if (isJSBox) $push.schedule({title: title, body: subtitle?subtitle+"\n"+message:message})
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
        if (isNode) {
            node.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data);
                callback(error, adapterStatus(resp.response), body)
            };
            $http.get(options);
        }
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options);
        }
    }
    const log = (message) => console.log(message)
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return { isQuanX, isSurge, isJSBox, isRequest, notify, write, read, get, post, log, done }
}
