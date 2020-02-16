/**
 * 下载安装 天翼账号中心 登陆
 [rewrite_local]
^https?:\/\/e\.189\.cn\/store\/user\/package_detail\.do url script-request-header Tasks/china_telecom.js
# MITM = e.189.cn
[task_local]
10 8 * * * Tasks/china_telecom.js

 */

let config = {
    name: "天翼账号中心",
    authTokenKey: "china_telecom_authToken_10000"
};

const $tool = tool()

if ($tool.isRe) {
    GetCookie()
    $tool.done()
} else {
    cron()
    $tool.done()
}

function GetCookie() {
    if (this.$request && this.$request.headers) {
        var cookieVal = $request.headers['authToken']
        if (cookieVal) {
            if ($tool.write(cookieVal, config.authTokenKey)) {
                $tool.notify(`${config.name}`, '获取authToken: 成功', '')
                $tool.log(`[${config.name}] 获取authToken: 成功, authToken: ${cookieVal}`)
            }
        }
    }
}

function cron() {
    var authToken = $tool.read(config.authTokenKey);
    if (!authToken) {
        $tool.notify(`${config.name}`, '请获取authToken', '下载安装APP[天翼账号中心]获取')
        return
    }
    var request = {
        url: "https://e.189.cn/store/user/package_detail.do",
        headers: {
            "authToken": `${authToken}`,
            "type": "alipayMiniApp"
        },
        body: "t=tysuit"
    }
    $tool.post(request, function (error, response, body) {
        // response.status response.statusCode response.headers
        if (!error) {
            if (response.statusCode == 200) {
                // $tool.log(body)
                // parseBody(JSON.parse(body));
                balanceMessage(JSON.parse(body));
            }
        } else {
            $tool.log(error);
            $tool.notify(`${config.name}`, '调用接口错误', error)
        }
    })
}

// 话费余额
function balanceMessage(data){
    var authToken = $tool.read(config.authTokenKey);
    if (!authToken) {
        $tool.notify(`${config.name}`, '请获取authToken', '下载安装APP[天翼账号中心]获取')
        return
    }
    var request = {
        url: "https://e.189.cn/store/user/balance_new.do",
        headers: {
            "authToken": `${authToken}`,
            "type": "alipayMiniApp"
        }
    }
    $tool.get(request, function (error, response, body) {
        // response.status response.statusCode response.headers
        if (!error) {
            if (response.statusCode == 200) {
                // $tool.log(body)
                try {
                    var bdata = JSON.parse(body);
                    var balance = Number(bdata.totalBalanceAvailable)
                    parseBody(data, balance)

                } catch (e) {
                    $tool.log(e)
                    $tool.log(data)
                    $tool.log(bdata)
                }
            }
        } else {
            $tool.log(error);
            $tool.notify(`${config.name}`, '调用接口错误', error)
        }
    })
}

function parseBody(data, balance) {
    // voiceAmount 总语音 voiceUsage voiceBalance
    // totalCommon usedCommon balanceCommon
    var subtitle = "中国电信套餐查询";
    var name = data.items[0].productOFFName;
    if (typeof name != "undefined") {
        subtitle = "[套餐] " + name;
    }

    var message = "[话费] 剩余: " + (balance/100).toFixed(2) + "元";
    if  (typeof data.voiceAmount != "undefined"){
        var voice = "[通话] 已用: " + data.voiceUsage + "分, 剩余: " + data.voiceBalance + "分,  合计: " + data.voiceAmount + "分";
        message = message + "\n" + voice;
    }
    if (typeof data.totalCommon != "undefined" && data.totalCommon > 0) {
        var flow = "[流量] 已用: " + formatFlow(data.usedCommon/1024) + ", 剩余: " + formatFlow(data.balanceCommon/1024) + ", 合计: " + formatFlow(data.totalCommon/1024);
        message = message + "\n" + flow;
    }

    $tool.notify(`${config.name}`, subtitle, message);
    $tool.log(config.name + subtitle + message);
}

// MB 和 GB 自动转换
function formatFlow(number) {
    if (number < 1024) {
        return number.toFixed(0) + "M"
    }
    return (number/1024).toFixed(2) + "G"
}

// https://github.com/yichahucha/surge/blob/master/tool.js
// 基于上面修改，在此注明出处
function tool() {
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isResponse = typeof $response != "undefined"
    const isRequest = typeof $request != "undefined"
    const isRe = isRequest || isResponse
    const node = (() => {
        if (typeof require == "function") {
            const request = require('request')
            return ({ request })
        } else {
            return (null)
        }
    })()
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (node) log(JSON.stringify({ title, subtitle, message }));
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
        if (node) {
            node.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
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
        if (node) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
    }
    const log = (message) => console.log(message)
    const done = (value = {}) => {
        if (isQuanX) isRe ? $done(value) : ""
        if (isSurge) isRe ? $done(value) : $done()
    }

    return {isQuanX, isSurge, isRequest, isResponse, isRe, notify, write, read, get, post, log, done}
}
