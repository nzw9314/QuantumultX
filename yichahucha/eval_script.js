/**
 * 远程脚本管理（QuanX 举例，Surge 同理）
 * 
 * 1.设置定时任务更新添加的远程脚本，第一次运行需要手动执行一下更新脚本（ Qanx 普通调试模式容易更新失败，使用最新 TF 红色按钮调试），例如设置每天凌晨更新脚本：
 * [task_local]
 * 0 0 * * * eval_script.js
 * 
 * 2.__conf 配置说明：
 * 参考下面 __conf 对象，key = 远程脚本的 URL，value = 匹配脚本对应的 URL
 * 
 * 3.修改配置文件的本地脚本为此脚本，例如之前京东 jd_price.js 改为 eval_script.js 即可：
 * [rewrite_local]
 * # ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body jd_price.js
 * ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body eval_script.js
 * [mitm]
 * hostname = api.m.jd.com
 */

const __conf = {
    "https://raw.githubusercontent.com/yichahucha/surge/master/jd_price.js": "^https?:\/\/api\.m\.jd.com",
    "https://raw.githubusercontent.com/yichahucha/surge/master/tb_price.js": ["^https?://trade-acs\.m\.taobao\.com", "^https?://amdc\.m\.taobao\.com"],
    "https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js": "^https?://ios\.prod\.ftl\.netflix\.com",
    "https://raw.githubusercontent.com/yichahucha/surge/master/wb_ad.js": "^https?://m?api\.weibo\.c(n|om)",
    "https://raw.githubusercontent.com/yichahucha/surge/master/wb_launch.js": "^https?://(sdk|wb)app\.uve\.weibo\.com",
    //添加自定义远程脚本...
}

const __tool = new __Tool()
const __isTask = __tool.isTask

if (__isTask) {
    const downloadScript = (url) => {
        return new Promise((resolve) => {
            __tool.get(url, (error, response, body) => {
                let filename = url.match(/.*\/(.*?)$/)[1]
                if (!error) {
                    if (response.statusCode == 200) {
                        __tool.write(body, url)
                        resolve(`🪓${filename} update success`)
                        console.log(`Update success: ${url}`)
                    } else {
                        resolve(`🪓${filename} update fail`)
                        console.log(`Update fail ${response.statusCode}: ${url}`)
                    }
                } else {
                    resolve(`🪓${filename} update fail`)
                    console.log(`Update fail ${error}: ${url}`)
                }
            })
        })
    }
    const promises = (() => {
        let all = []
        Object.keys(__conf).forEach((url) => {
            all.push(downloadScript(url))
        });
        return all
    })()
    console.log("Start updating...")
    Promise.all(promises).then(vals => {
        console.log("Stop updating.")
        console.log(vals.join("\n"))
        let lastDate = __tool.read("ScriptLastUpdateDate")
        lastDate = lastDate ? lastDate : new Date()
        __tool.notify("Update done.", `${lastDate.Format("yyyy-MM-dd HH:mm:ss")} last update.`, `${vals.join("\n")}`)
        __tool.write(new Date(), "ScriptLastUpdateDate")
        $done()
    })
}

if (!__isTask) {
    const __url = $request.url
    const __script = (() => {
        let s = null
        for (let key in __conf) {
            let value = __conf[key]
            if (Array.isArray(value)) {
                value.some((item) => {
                    if (__url.match(item)) {
                        s = { url: key, content: __tool.read(key) }
                        return true
                    }
                })
            } else {
                if (__url.match(value)) {
                    s = { url: key, content: __tool.read(key) }
                }
            }
        }
        return s
    })()
    if (__script) {
        if (__script.content) {
            eval(__script.content)
            console.log(`Execute script: ${__script.url}`)
        } else {
            $done({})
            console.log(`Not found script: ${__script.url}`)
        }
    } else {
        $done({})
        console.log(`Not match URL: ${__url}`)
    }
}

if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]'
    }
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function __Tool() {
    _node = (() => {
        if (typeof require == "function") {
            const request = require('request')
            return ({ request })
        } else {
            return (null)
        }
    })()
    _isSurge = typeof $httpClient != "undefined"
    _isQuanX = typeof $task != "undefined"
    _isTask = typeof $request == "undefined"
    this.isSurge = _isSurge
    this.isQuanX = _isQuanX
    this.isTask = _isTask
    this.isResponse = typeof $response != "undefined"
    this.notify = (title, subtitle, message) => {
        if (_isQuanX) $notify(title, subtitle, message)
        if (_isSurge) $notification.post(title, subtitle, message)
        if (_node) console.log(JSON.stringify({ title, subtitle, message }));
    }
    this.write = (value, key) => {
        if (_isQuanX) return $prefs.setValueForKey(value, key)
        if (_isSurge) return $persistentStore.write(value, key)
        if (_node) console.log(`${key} write success`);
    }
    this.read = (key) => {
        if (_isQuanX) return $prefs.valueForKey(key)
        if (_isSurge) return $persistentStore.read(key)
        if (_node) console.log(`${key} read success`);
    }
    this.get = (options, callback) => {
        if (_isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => { callback(null, _status(response), response.body) }, reason => callback(reason.error, null, null))
        }
        if (_isSurge) $httpClient.get(options, (error, response, body) => { callback(error, _status(response), body) })
        if (_node) _node.request(options, (error, response, body) => { callback(error, _status(response), body) })
    }
    this.post = (options, callback) => {
        if (_isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => { callback(null, _status(response), response.body) }, reason => callback(reason.error, null, null))
        }
        if (_isSurge) $httpClient.post(options, (error, response, body) => { callback(error, _status(response), body) })
        if (_node) _node.request.post(options, (error, response, body) => { callback(error, _status(response), body) })
    }
    _status = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
}
