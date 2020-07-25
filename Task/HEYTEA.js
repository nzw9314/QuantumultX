/*
微信小程序"喜茶GO"自动签到，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。
请先按下述方法进行配置，进入"喜茶GO"小程序，点击"我的"，进入"任务中心"，若弹出"首次写入喜茶 Authorization 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"喜茶 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。
Author：zZPiglet

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
1 0 * * * HEYTEA.js, tag=喜茶
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/HEYTEA/HEYTEA.js, tag=喜茶

[rewrite_local]
^https:\/\/vip\.heytea\.com\/api\/service-member\/vip\/task$ url script-request-header HEYTEA.js
or remote
^https:\/\/vip\.heytea\.com\/api\/service-member\/vip\/task$ url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/HEYTEA/HEYTEA.js


Surge 4.0+ & Loon:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/HEYTEA/HEYTEA.js
http-request ^https:\/\/vip\.heytea\.com\/api\/service-member\/vip\/task$ script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/HEYTEA/HEYTEA.js

All app:
[mitm]
hostname = vip.heytea.com

获取完 Authorization 后可不注释 rewrite / hostname，Authorization 更新时会弹窗。若因 MitM 导致该软件或小程序网络不稳定，可注释掉 hostname。
*/

const CheckinURL = 'https://vip.heytea.com/api/service-member/vip/task/award/114'
const AuthorizationName = '喜茶'
const AuthorizationKey = 'HEYTEA'
const $cmp = compatibility()

if ($cmp.isRequest) {
    GetAuthorization()
    $cmp.done()
} else {
    Checkin()
    $cmp.done()
}

function GetAuthorization() {
    if ($request.headers['Authorization']) {
        var AuthorizationValue = $request.headers['Authorization']
        if ($cmp.read(AuthorizationKey) != (undefined || null)) {
            if ($cmp.read(AuthorizationKey) != AuthorizationValue) {
                var authorization = $cmp.write(AuthorizationValue, AuthorizationKey)
                if (!authorization) {
                    $cmp.notify("更新" + AuthorizationName + " Authorization 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + AuthorizationName + " Authorization 成功 🎉", "", "")
                }
            }
        } else {
            var authorization = $cmp.write(AuthorizationValue, AuthorizationKey);
            if (!authorization) {
                $cmp.notify("首次写入" + AuthorizationName + " Authorization 失败‼️", "", "")
            } else {
                $cmp.notify("首次写入" + AuthorizationName + " Authorization 成功 🎉", "", "")
            }
        }
    } else {
        $cmp.notify("写入" + AuthorizationName + "Authorization 失败‼️", "", "配置错误, 无法读取请求头, ")
    }
}

function Checkin() {
    const hey = {
        url: CheckinURL,
        headers: {
            "Authorization": $cmp.read("HEYTEA"),
        },
        body: '{}'
    };
    $cmp.post(hey, function(error, response, data) {
        const result = JSON.parse(data)
        if (!error) {
            if (result.code == 0) {
                $cmp.notify(AuthorizationName + " - 签到成功！🎉", "", "今日签到获得 " + result.data.score + " 积分")
            } else if (result.code == 400045) {
                $cmp.notify(AuthorizationName, "",  "重复签到！😊")
            } else if (result.code == 1002) {
                $cmp.notify(AuthorizationName, "", "未获取或 Authorization 失效❗ 请重新获取。️")
            } else {
                console.log("HEYTEA failed response : \n" + data)
                $cmp.notify(AuthorizationName, "签到失败‼️ 详情请见日志。", data)
            }
        } else {
            $cmp.notify(AuthorizationName,  "签到接口请求失败，详情请见日志。", error)
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