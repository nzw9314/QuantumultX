/**
 * 远程脚本管理（QuanX 举例）
 * 
 * 1.设置定时任务更新添加的远程脚本，第一次运行需要手动执行一下更新脚本（Qanx 普通调试模式容易更新失败，使用最新 TF 红色按钮调试），例如设置每天凌晨更新脚本：
 * [task_local]
 * 0 0 * * * eval_script.js
 * 
 * 2.__conf 配置说明：
 * 参考下面 __conf 示例，格式为：远程脚本的链接 url 匹配脚本对应的正则1,匹配脚本对应的正则2
 * 
 * 
 * 3.修改配置文件的本地脚本为此脚本，例如之前京东 jd_price.js 改为 eval_script.js 即可：
 * [rewrite_local]
 * # ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body jd_price.js
 * ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body eval_script.js
 * [mitm]
 * hostname = api.m.jd.com
 */
const __c = String.raw
const __conf = __c`


//京东
https://raw.githubusercontent.com/yichahucha/surge/master/jd_price.js url ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig)
//淘宝
https://raw.githubusercontent.com/yichahucha/surge/master/tb_price.js url ^https?://.+/amdc/mobileDispatch, ^https?://trade-acs\.m\.taobao\.com/gw/mtop\.taobao\.detail\.getdetail
//奈飞
https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js url https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D
//微博
https://raw.githubusercontent.com/yichahucha/surge/master/wb_ad.js url ^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|!/photos/pic_recommend_status)
https://raw.githubusercontent.com/yichahucha/surge/master/wb_launch.js url ^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua)

//添加自定义远程脚本...


`

const __tool = new ____Tool()
const __confObj = ____confObj()
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
        Object.keys(__confObj).forEach((url) => {
            all.push(downloadScript(url))
        })
        return all
    })()
    console.log("Start updating...")
    Promise.all(promises).then(vals => {
        console.log("Stop updating.")
        console.log(vals.join("\n"))
        let lastDate = __tool.read("ScriptLastUpdateDate")
        lastDate = lastDate ? lastDate : new Date().Format("yyyy-MM-dd HH:mm:ss")
        __tool.notify("Update Done.", `${lastDate} last update.`, `${vals.join("\n")}`)
        __tool.write(new Date().Format("yyyy-MM-dd HH:mm:ss"), "ScriptLastUpdateDate")
        $done()
    })
}

if (!__isTask) {
    const __url = $request.url
    const __script = (() => {
        let s = null
        for (let key in __confObj) {
            let value = __confObj[key]
            if (!Array.isArray(value)) value = value.split(",")
            value.some((url) => {
                if (__url.match(url)) {
                    s = { url: key, content: __tool.read(key), match: url }
                    return true
                }
            })
        }
        return s
    })()
    if (__script) {
        if (__script.content) {
            eval(__script.content)
            console.log(`Request url: ${__url}\nMatch url: ${__script.match}\nExecute script: ${__script.url}`)
        } else {
            $done({})
            console.log(`Request url: ${__url}\nMatch url: ${__script.match}\nScript not executed. Script not found: ${__script.url}`)
        }
    } else {
        $done({})
        console.log(`No match url: ${__url}`)
    }
}

function ____confObj() {
    const lines = __conf.split("\n")
    let confObj = {}
    lines.forEach((line) => {
        line = line.replace(/^\s*/, "")
        if (line.length > 0 && line.substring(0, 2) != "//") {
            console.log(line);
            const avaliable = (() => {
                const format = /^https?:\/\/.*\s+url\s+.*/
                return format.test(line)
            })()
            if (avaliable) {
                const value = line.split("url")
                const remote = value[0].replace(/\s/g, "")
                const match = value[1].replace(/\s/g, "")
                confObj[remote] = match
            } else {
                __tool.notify("Configuration error", "", line)
                throw "Configuration error:" + line
            }
        }
    })
    console.log(`Configuration information:  \n${JSON.stringify(confObj)}`)
    return confObj
}

function ____Tool() {
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