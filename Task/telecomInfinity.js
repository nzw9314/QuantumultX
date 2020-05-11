/**
 1.根据原版脚本修改，增加上月账单信息，需重新获取Cookie
 2.适合流量畅享套餐使用，如非畅享套餐，可将187行前加//注释，并取消188行注释，此项仅供测试
 3.因地区不同可能获取不到Cookie,可自行复制cookie至65行下覆盖"COOKIE"，
 By Macsuny 修改
 
 感谢原版作者提供脚本

 * 下载安装 天翼账号中心 登陆 获取authToken
 * quantumultx
 [rewrite_local]
 ^https?:\/\/e\.189\.cn\/store\/user\/package_detail\.do url script-request-header telecomInfinity.js
 # MITM = e.189.cn
 [task_local]
 10 8 * * * telecomInfinity.js

 [Loon]
 http-request ^https?:\/\/e\.189\.cn\/store\/user\/package_detail\.do script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/telecomInfinity.js
 
 Surge 4.0 :
[Script]
telecomInfinity.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/telecomInfinity.js,script-update-interval=0

#  Cookie.
telecomInfinity.js = script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/telecomInfinity.js,type=http-request,pattern=https?:\/\/e\.189\.cn\/store\/user\/package_detail\.do
 
 # MITM = e.189.cn
 */

// 配置信息
let config = {
    name: "中国电信 世界触手可及🤝",
    authTokenKey: "china_telecom_authToken_10000",
    CookieKey: "china_telecom_cookie",
    delay: 0,//自定义延迟签到,单位毫秒,(如填200则每个接口延迟0.2秒执行),默认无延迟
    info: true   // 是否显示手机归属地
}
const $tool = Tool()
     d = new Date();
     Y = d.getFullYear(),
     M = ("0" + (d.getMonth())).slice(-2)
   let AUTHTOKEN = $tool.read(config.authTokenKey)
   let COOKIE = $tool.read(config.CookieKey)
var requests = {
    detail: {
        url: "https://e.189.cn/store/user/package_detail.do",
        headers: {
            "authToken": AUTHTOKEN,
            "type": "alipayMiniApp"
        },
        body: "t=tysuit",
        method: "POST"
    },
    balance: {
        url: "https://e.189.cn/store/user/balance_new.do",
        headers: {
            "authToken": AUTHTOKEN,
            "type": "alipayMiniApp"
        },
        method: "GET"
    },
    info: {
        url: "https://e.189.cn/store/user/getExtInfo.do",
        headers: {
            "authToken": AUTHTOKEN,
            "type": "alipayMiniApp"
        },
        method: "GET"
    },
      bill: {
        url: `https://e.189.cn/store/user/bill.do?year=${Y}&month=${M}&t=tysuit`,
        headers: {
            "Cookie": COOKIE,
        },
        method: "GET"
    }
}


if ($tool.ishttp) {
    GetCookie()
    $tool.done()
} else {
    cron()
    $tool.done()
}
function GetCookie() {
    if ($request && $request.headers) {
        var cookieVal = $request.headers['authToken']
        var COOKIE = $request.headers['Cookie']
      $tool.write(COOKIE, config.CookieKey)
        if (cookieVal) {
            if ($tool.write(cookieVal, config.authTokenKey)) {
                $tool.notify(config.name, '获取authToken: 成功', '')
                $tool.log.info(`[${config.name}] 获取authToken: 成功, authToken: ${cookieVal}, Cookie: [${COOKIE}]` )
            }
        }
    }
}

async function cron() {
    if (!AUTHTOKEN) {
        $tool.notify(config.name, "请获取authToken", "下载安装APP[天翼账号中心]获取")
        return
    }
    let detail = await httpRequest(requests.detail, config.delay)
    let balance = await httpRequest(requests.balance, config.delay)
    let bill = await httpRequest(requests.bill, config.delay)
    var info = {}
    if (config.info) {
        info = await httpRequest(requests.info, config.delay)
    }
    await parseData(detail, balance, info, bill)
}


async function httpRequest(resq, delay = 0, statusCode = 200) {
    return new Promise(resolve => {
        $tool.timeout(() => {
            var adapterClient = $tool.get;
            if (typeof resq.method != "undefined") {
                if (resq.method == "POST") {
                    adapterClient = $tool.post
                }
                delete resq.method
            }
            adapterClient(resq, function (error, response, body) {
                try {
                    if (!error) {
                        if (typeof response.statusCode == "undefined" || response.statusCode == statusCode) {
resolve(JSON.parse(body));
                        }
                    } else {
                        $tool.notify('', 'httpRequest', error)
                        resolve("")
                    }
                } catch (e) {
                    $tool.notify('', 'httpRequest catch', e)
                    resolve("")
                }
            });

        }, parseInt(delay))
    })
}

function parseData(detail, balance, info, bill) {
    return new Promise(resolve => {
        if (!info || !detail  || !balance|| !bill) {
            resolve("done")
            return
        }
        if (balance.result != 0) {
            $tool.notify(config.name, "获取余额信息失败", `${balance.msg}`)
            resolve("done")
            return
        }
        if (config.info && info.result != 10000) {
            $tool.notify(config.name, "", "获取手机号归属地信息失败，请稍后重试")
            resolve("done")
            return
        }
        if (bill.paraFieldResult == "no sum charge data"||"消息格式错误-账期错误"){
            bill = `上月账单未生成`
            //resolve("done")
            //return
        }
        var balanceAvailable = Number(balance.totalBalanceAvailable)
        notify(detail, balanceAvailable, info, bill)
        resolve("done")
    })
}

function notify(data, balance, exdata, bldata) {
    // voiceAmount 总语音 voiceUsage voiceBalance
    // totalCommon usedCommon balanceCommon
    var subtitle = ""
    if (config.info) {
        subtitle = "[手机] " + exdata.mobileShort + "  (" + exdata.province + "-" + exdata.city + ")"
    }
    var productname = "中国电信"
    if (typeof data.items[0].productOFFName != "undefined") {
        productname = data.items[0].productOFFName
    }
    var Resourcename = "流量套餐"
    if (typeof data.items[0].items[1].ratableResourcename != "undefined") {
        Resourcename = data.items[0].items[1].ratableResourcename
    }

    var message = "[套餐] " + productname + "\n" + "[话费] 剩余: " + (balance / 100).toFixed(2) + "元"
if (bldata != '上月账单未生成'){message +=  '  上月消费合计: '+ bldata.items[0].sumCharge/100+'元'}
    if (typeof data.voiceAmount != "undefined") {
        var voice = "[通话] 已用: " + data.voiceUsage + "分, 剩余: " + data.voiceBalance + "分,  合计: " + data.voiceAmount + "分"
        message = message + "\n" + voice
    }
    if (typeof data.totalCommon != "undefined" ) {
      var flow =  '[流量套餐] ' + Resourcename + '  已用: ' + formatFlow(data.usageCommon/1024) 
    //  var flow = "[流量] 已用: " + formatFlow(data.usedCommon/1024) + ", 剩余: " + formatFlow(data.balanceCommon/1024) + ", 合计: " + formatFlow(data.totalCommon/1024)
    message = message + "\n" + flow
    }
 if (bldata == '上月账单未生成'){
message = message + "\n" + bldata
} else if (typeof bldata.items[0].acctName != "undefined" && bldata.serviceResultCode == 0) {
  var bills = '[上月话费账单]' + "\n"+ bldata.items[0].items[0].chargetypeName + ':      '+
bldata.items[0].items[0].charge/100+'元'+ "\n"+ bldata.items[0].items[1].chargetypeName + ':    '+
bldata.items[0].items[1].charge/100+'元'+ "\n"+ bldata.items[0].items[2].chargetypeName + ':  '+
bldata.items[0].items[2].charge/100+'元'
    message = message + "\n" + bills
    }
    $tool.notify(config.name, subtitle, message)
    $tool.log.info(config.name + "\n" + subtitle + "\n" + message)
}

// MB 和 GB 自动转换
function formatFlow(number) {
    if (number < 1024) {
        return number.toFixed(2) + "MB"
    }
    return (number / 1024).toFixed(2) + "GB"
}

// https://github.com/yichahucha/surge/blob/master/tool.js
//https://github.com/chavyleung/scripts/blob/master/chavy.js
// 工具方法编写参考了以上脚本，在此感谢 🙏
function Tool() {
    // app
    const _isQuanX = typeof $task != "undefined"
    const _isSurge = typeof $httpClient != "undefined"
    const _isJSBox = typeof $app != "undefined" && $app.info.bundleID == "app.cyan.jsbox"
    const _isNode = typeof require == "function" && !_isJSBox

    // environment
    const _isRequest = typeof $request != "undefined"
    const _isResponse = typeof $response != "undefined"

    const ishttp = _isRequest || _isResponse

    // require Tools
    const _requireTools = (() => {
        var tools = {}
        if (typeof require == "function") {
            let request = require('request')
            if (request) tools.request = request
            let fs = require("fs")
            if (fs) tools.fs = fs
        }
        return tools
    })()

    // config
    const _nodeStoreName = "prefs.json"

    // custom log
    // if you want to add log level, just add to _logLevels
    const _log = (() => {
        // default log value
        let _logLevel = "debug"

        const _logLevels = new Array("trace", "debug", "info", "warn", "error", "fatal")

        const _setLogLevel = (level = "") => {
            if (_logLevels.indexOf(level) > -1) {
                _logLevel = level
            }
            return _logLevel
        }

        const _setLogFunction = (level) => {
            return (message) => {
                _consolelog(message, level, _setLogLevel)
            }
        }

        const _consolelog = (message, level, loglevel) => {
            let index = _logLevels.indexOf(level)
            let current = _logLevels.indexOf(loglevel())
            if (index > -1 && current > -1) {
                if (index >= current) {
                    return console.log(message)
                }
            }
        }

        const level = _setLogLevel

        var logFunc = {level}
        _logLevels.forEach((item) => {
            logFunc[item] = _setLogFunction(item)
        })

        return logFunc
    })

    const log = _log()

    // setTimeout
    const timeout = (() => {
        if (typeof setTimeout != "undefined") {
            return setTimeout
        }
        return (handler, timeout = 0) => {
            handler()
        }
    })()

    // notification
    const notify = (title, subtitle, message) => {
        if (_isQuanX) {
            $notify(title, subtitle, message)
        }
        if (_isSurge) {
            $notification.post(title, subtitle, message)
        }
        if (_isNode) {
            console.log(JSON.stringify({title, subtitle, message}))
        }
        if (_isJSBox) {
            if (subtitle && message) {
                $push.schedule({title: title, body: subtitle + "\n" + message})
            } else {
                $push.schedule({title: title, body: subtitle + message})
            }
        }
    }

    // store
    const read = (key) => {
        if (_isQuanX) return $prefs.valueForKey(key)
        if (_isSurge) return $persistentStore.read(key)
        if (_isJSBox) return _jsBoxRead(key)
        if (_isNode) return _nodeRead(key)
    }

    const write = (value, key) => {
        if (_isQuanX) return $prefs.setValueForKey(value, key)
        if (_isSurge) return $persistentStore.write(value, key)
        if (_isJSBox) return _jsBoxWrite(value, key)
        if (_isNode) return _nodeWrite(value, key)
    }

    const _nodeRead = (key) => {
        try {
            var data = JSON.parse(_requireTools.fs.readFileSync(_nodeStoreName))
            if (typeof data[key] != "undefined") {
                return data[key]
            }
        } catch (error) {
            log.error(error)
        }
        return ""
    }

    const _nodeWrite = (value, key) => {
        try {
            if (!_requireTools.fs.existsSync(_nodeStoreName)) {
                _requireTools.fs.writeFileSync(_nodeStoreName, JSON.stringify({}))
            }
            var data = JSON.parse(_requireTools.fs.readFileSync(_nodeStoreName))
            data[key] = value
            _requireTools.fs.writeFileSync(_nodeStoreName, JSON.stringify(data))
            return true
        } catch (error) {
            log.error(error)
        }
        return false
    }

    const _jsBoxRead = (key) => {
        try {
            if (_jsBoxEnvName != "icloud") {
                return $prefs.get(key)
            }
            if (typeof $drive != "undefined") {
                let filePath = "Code/" + _nodeStoreName
                if ($drive.exists(filePath)) {
                    let content = $drive.read(filePath)
                    if (content) {
                        let data = JSON.parse(content)
                        if (typeof data[key] != "undefined") {
                            return data[key]
                        }
                    }
                }
            }
        } catch (error) {
            log.error(error)
        }
        return ""
    }

    const _jsBoxWrite = (value, key) => {
        try {
            if (_jsBoxEnvName != "icloud") {
                return $prefs.set(key, value)
            }
            if (typeof $drive != "undefined") {
                let filePath = "Code/" + _nodeStoreName
                var data = {}
                if ($drive.exists(filePath)) {
                    let content = $drive.read(filePath)
                    data = JSON.parse(content)
                }
                data[key] = value
                return $drive.write({data: $data({string: JSON.stringify(data)}), path: filePath})
            }
        } catch (error) {
            log.error(error)
        }
        return false
    }

    const _jsBoxEnvName = (() => {
        if (typeof $addin != "undefined") {
            if (typeof $addin.current == "undefined") {
                // 运行在icloud
                return "icloud"
            } else {

                let _version = typeof $addin.current.version != "undefined"
                let _author = typeof $addin.current.author != "undefined"
                let _url = typeof $addin.current.url != "undefined"
                let _website = typeof $addin.current.website != "undefined"
                if (_version || _author || _url || _website) {
                    // jsBox 应用
                    return "app"
                } else {
                    // jsBox 脚本
                    return "script"
                }
            }
        }
        return ""
    })()

    // http request
    const get = (options, callback) => {
        if (_isQuanX) {
            if (typeof options == "string") options = {url: options}
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, _status(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (_isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, _status(response), body)
        });
        if (_isNode) {
            _requireTools.request(options, (error, response, body) => {
                callback(error, _status(response), body)
            })
        }
        if (_isJSBox) $http.get(_jsBoxRequest(options, callback))
    }
    const post = (options, callback) => {
        if (_isQuanX) {
            if (typeof options == "string") options = {url: options}
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, _status(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (_isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, _status(response), body)
            })
        }
        if (_isNode) {
            _requireTools.request.post(options, (error, response, body) => {
                callback(error, _status(response), body)
            })
        }
        if (_isJSBox) $http.post(_jsBoxRequest(options, callback))
    }

    const _jsBoxRequest = (options, callback) => {
        if (typeof options == "string") options = {url: options}
        options["header"] = options["headers"]
        delete options["headers"]
        let body = options["body"]
        if (typeof body != "undefined") {
            try {
                body = JSON.parse(body)
                options["body"] = body
            } catch (e) {}
        }
        options["handler"] = function (resp) {
            let error = resp.error
            if (error) error = JSON.stringify(resp.error)
            let body = resp.data
            if (typeof body == "object") body = JSON.stringify(resp.data)
            callback(error, _status(resp.response), body)
        }
        return options
    }

    const _status = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }

    // done
    const done = (value = {}) => {
        if (_isQuanX) ishttp ? $done(value) : ""
        if (_isSurge) ishttp ? $done(value) : $done()
    }

    return {read, write, notify, get, post, ishttp, log, timeout, done}
}
