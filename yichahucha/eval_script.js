/**
 * 远程脚本管理 beta（QuanX举例，Surge同理）
 * 
 * 设置定时任务更新 conf 配置的远程脚本，第一次运行需要手动执行一下更新脚本，例如设置每天凌晨更新脚本：
 * [task_local]
 * 0 0 * * * eval_script.js
 * 
 * conf 配置说明：
 * key = 远程脚本的URL  value = 脚本匹配对应的URL
 * 
 * 脚本使用，只需要改一下之前配置的本地脚本名为本脚本名，例如京东 jd_price.js 改为 eval_script.js 即可：
 * [rewrite_local]
 * ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body eval_script.js
 * [mitm]
 * hostname = api.m.jd.com
 */
const conf = {
    "https://raw.githubusercontent.com/yichahucha/surge/master/jd_price.js": "^https?:\/\/api\.m\.jd.com",
    "https://raw.githubusercontent.com/yichahucha/surge/master/tb_price.js": ["^https?://trade-acs\.m\.taobao\.com", "^https?://amdc\.m\.taobao\.com"],
    "https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js": "^https?://ios\.prod\.ftl\.netflix\.com",
    "https://raw.githubusercontent.com/yichahucha/surge/master/wb_ad.js": "^https?://m?api\.weibo\.c(n|om)",
    "https://raw.githubusercontent.com/yichahucha/surge/master/wb_launch.js": "^https?://(sdk|wb)app\.uve\.weibo\.com",
    //继续添加新的远程脚本...
}
const $tool = new Tool()
const isTask = $tool.isTask

if (isTask) {
    const downloadScript = (url) => {
        return new Promise((resolve) => {
            $tool.get(url, (error, response, body) => {
                let filename = url.match(/.*\/(.*?)$/)[1]
                if (!error) {
                    if (response.statusCode == 200) {
                        $tool.write(body, url)
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
        Object.keys(conf).forEach((url) => {
            all.push(downloadScript(url))
        });
        return all
    })()

    console.log("Start updating...")
    Promise.all(promises).then(vals => {
        console.log("Stop updating.")
        console.log(vals.join("\n"))
        let lastDate = $tool.read("ScriptLastUpdateDate")
        lastDate = lastDate ? lastDate : new Date()
        $tool.notify("Update done.", `${lastDate.Format("yyyy-MM-dd HH:mm:ss")} last update.`, `${vals.join("\n")}`)
        $tool.write(new Date(), "ScriptLastUpdateDate")
        $done()
    })
}

if (!isTask) {
    const url = $request.url
    const script = (() => {
        let s = null
        for (let key in conf) {
            let value = conf[key]
            if (Array.isArray(value)) {
                value.some((item) => {
                    if (url.match(item)) {
                        s = { url: key, content: $tool.read(key) }
                        return true
                    }
                })
            } else {
                if (url.match(value)) {
                    s = { url: key, content: $tool.read(key) }
                }
            }
        }
        return s
    })()
    if (script) {
        if (script.content) {
            eval(script.content)
            console.log(`Execute script: ${script.url}`)
        } else {
            $done({})
            console.log(`Not found script: ${script.url}`)
        }
    } else {
        $done({})
        console.log(`Not match URL: ${url}`)
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

function Tool() {
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
