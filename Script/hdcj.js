/*
微信小程序"活动抽奖"自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。
请先按下述方法进行配置，进入"活动抽奖"，手动签到一次或点击"已签到"，若弹出"首次写入活动抽奖 Token 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"活动抽奖 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。
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


const CheckinURL = 'https://api-hdcj.9w9.com/v1/sign'
const DataURL = 'https://api-hdcj.9w9.com/v1/informations'
const TokenName = '活动签到'
const HeaderKey = 'wclotterynewnew'
const datainfo = {}
const $cmp = compatibility()

async function Sign() {
    await Checkin()
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
        var HeaderValue = JSON.stringify($request.headers)
        if ($cmp.read(HeaderKey) != (undefined || null)) {
            if ($cmp.read(HeaderKey) != HeaderValue) {
                var token = $cmp.write(HeaderValue, HeaderKey)
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "")
                }
            }
        } else {
            var token = $cmp.write(HeaderValue, HeaderKey);
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
            headers: JSON.parse($cmp.read("wclotterynewnew"))
        }
        $cmp.get(LotteryCheckin, function(error, response, data) {
            try{
                if (error) {
                    datainfo.error = 0
                    datainfo.errormessage = error
                } else {
                    const obj1 = JSON.parse(data)
                    if (obj1.success == true) {
                        datainfo.success = 0
                        datainfo.days = obj1.data.cycle
                        datainfo.luckcoin = obj1.data.sign_lucky[datainfo.days - 1]
                        console.log(obj1.data.cycle)
                    }else {
                        console.log("wclotterynew failed response : \n" + data)
                        datainfo.error = 2
                        datainfo.errormessage = data
                    }
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动签到"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function GetData() {
    return new Promise(resolve => {
        let LotteryData = {
            url: DataURL,
            headers: JSON.parse($cmp.read("wclotterynewnew"))
        }
        $cmp.get(LotteryData, function (error, response, data) {
            try {
                const obj2 = JSON.parse(data)
                datainfo.allluckcoin = obj2.data.user_info.lucky_count;
                datainfo.luckmoney = obj2.data.user_info.money;
                console.log(obj2.data.user_info.money)
                resolve ('done')
            } catch (e) {
                $cmp.notify("活动签到"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })

}

function notify() {
    return new Promise(resolve => {
        try {
            if (datainfo.success == 0) {
                let msg1 = "签到获得 " + datainfo.luckcoin + " 币，共有 " + datainfo.allluckcoin + " 币及 " + datainfo.luckmoney + " 元。💰";
                $cmp.notify("活动签到 - 签到成功！🎉", "", msg1)
            } else if (datainfo.error == 0) {
                $cmp.notify("活动签到 - 签到接口请求失败", "", datainfo.errormessage)
            } else if (datainfo.error == 2) {
                $cmp.notify("活动签到 - 签到失败‼️", "", datainfo.errormessage)
            }
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