/*
"饿了么" app(9.0.10) "我的 - 打卡领红包"自动签到，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。
默认已使用 elemSign.js，故请先使用 elemGetCookies.js 获取 Token。(https://github.com/songyangzz/QuantumultX/blob/master/elem/elemGetCookies.js)
到 cron 设定时间自动签到时，若弹出"饿了么 - 打卡领红包 - 打卡成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
1 0 * * * elemCheckIn.js, tag=饿了么-打卡领红包
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/elem/elemCheckIn.js, tag=饿了么-打卡领红包

Surge 4.0+ & Loon:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/elem/elemCheckIn.js
*/

const CheckInURL = 'https://h5.ele.me/restapi/acquisition/dailyCheckIn/v1/checkIn'
const $cmp = compatibility()
Checkin()
$cmp.done()

function Checkin() {
    let subTitle = ''
    let detail = ''
    const daily = {
        url: CheckInURL,
        headers: {
            "Cookie": $cmp.read("cookie_elem")
        }
    }
    $cmp.post(daily, function(error, response, data) {
        if (!error) {
            if (response.statusCode == 401) {
                subTitle += 'Token 未获取或失效❗'
                detail += '请按脚本开头注释完成配置并首次或重新获取 Token。'
            } else {
                const result = JSON.parse(data)
                if (result.code == 200) {
                    subTitle += '打卡成功！🍗'
                    let todayearn = result.data.checkInAmount / 100
                    let total = result.data.currentAmount / 100
                    detail += '打卡获得 ' + todayearn + ' 元，账户共有 ' + total + ' 元红包。'
                } else if (result.code == 4003) {
                    subTitle += '重复打卡！🥡'
                    detail += result.message
                } else {
                    subTitle += '打卡失败‼️ 详情请见日志。'
                    detail += data
                    $cmp.log("elem failed response : \n" + data)
                }
            }
        } else {
            subTitle += '打卡接口请求失败，详情请见日志。'
            detail += error
            $cmp.log("elem failed response : \n" + error)
        }
        $cmp.notify('饿了么 - 打卡领红包', subTitle, detail)
    })
}

function compatibility() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
    const isNode = typeof require == "function" && !isJSBox
    const node = (() => {
        if (isNode) {
            const request = require('request')
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
                let error = resp.error
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.get(options)
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
                let error = resp.error
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options)
        }
    }
    const log = (message) => console.log(message)
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return { isQuanX, isSurge, isJSBox, isRequest, notify, write, read, get, post, log, done }
}