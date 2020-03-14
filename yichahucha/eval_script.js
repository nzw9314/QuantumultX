const __conf = String.raw`


[eval_remote]
// custom remote...


[eval_local]
// custom local...


`

const __emoji = "• "
const __emojiDone = "✔️"
const __emojiTasks = "🕐"
const __emojiFail = "🙃"
const __emojiSuccess = "😀"
const __showLine = 20

const __log = false
const __debug = false
const __developmentMode = false
const __concurrencyLimit = 5
const __tool = new ____Tool()

if (__tool.isTask) {
    const ____getConf = (() => {
        return new Promise((resolve) => {
            const remoteConf = ____removeAnnotation(____extractConf(__conf, "eval_remote"))
            const localConf = ____removeAnnotation(____extractConf(__conf, "eval_local"))
            if (remoteConf.length > 0) {
                console.log("Start updating conf...")
                if (__debug) __tool.notify("", "", `Start updating ${remoteConf.length} confs...`)
                ____concurrentQueueLimit(remoteConf, __concurrencyLimit, (url) => {
                    return ____downloadFile(url)
                })
                    .then(result => {
                        console.log("Stop updating conf.")
                        let content = []
                        result.forEach(data => {
                            if (data.body) {
                                content = content.concat(____parseRemoteConf(data.body))
                            }
                        });
                        content = localConf.concat(content)
                        resolve({ content, result })
                    })
            } else {
                resolve({ content: localConf, result: [] })
            }
        })
    })
    const begin = new Date()
    ____getConf()
        .then((conf) => {
            return new Promise((resolve, reject) => {
                if (conf.content.length > 0) {
                    if (__log) console.log(conf.content)
                    resolve(conf)
                } else {
                    let message = ""
                    conf.result.forEach(data => {
                        message += message.length > 0 ? "\n" + data.message : data.message
                    });
                    reject(message.length > 0 ? message : `Unavailable configuration! Please check!`)
                }
            })
        })
        .then((conf) => {
            return new Promise((resolve, reject) => {
                const result = ____parseConf(conf.content)
                if (result.obj) {
                    conf["obj"] = result.obj
                    if (__log) console.log(result.obj)
                    resolve(conf)
                } else {
                    reject(`Configuration information error: ${result.error}`)
                }
            })
        })
        .then((conf) => {
            const confObj = conf.obj
            const confResult = conf.result
            const scriptUrls = Object.keys(confObj)
            console.log("Start updating script...")
            __tool.notify("", "", `Start updating ${scriptUrls.length} scripts...`)
            ____concurrentQueueLimit(scriptUrls, __concurrencyLimit, (url) => {
                const urlRegex = /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/
                return new Promise((resolve) => {
                    if (urlRegex.test(url)) {
                        ____downloadFile(url).then((data) => {
                            if (data.code == 200) {
                                __tool.write(data.body, data.url)
                            }
                            resolve(data)
                        })
                    } else {
                        __tool.write(url, url)
                        resolve({ body: url, url, message: `${__emoji}${url} function set success` })
                    }
                })
            })
                .then(result => {
                    console.log("Stop updating script.")
                    __tool.write(JSON.stringify(confObj), "ScriptConfObjKey")
                    const resultInfo = (() => {
                        let message = ""
                        let success = 0
                        let fail = 0
                        confResult.concat(result).forEach(data => {
                            if (data.message.match("success")) success++
                            if (data.message.match("fail")) fail++
                            message += message.length > 0 ? "\n" + data.message : data.message
                        });
                        return { message, count: { success, fail } }
                    })()
                    return resultInfo
                })
                .then((resultInfo) => {
                    const messages = resultInfo.message.split("\n")
                    const detail = `${messages.slice(0, __showLine).join("\n")}${messages.length > 20 ? `\n${__emoji}......` : ""}`
                    const summary = `${__emojiSuccess}Success: ${resultInfo.count.success}  ${__emojiFail}Fail: ${resultInfo.count.fail}   ${__emojiTasks}Tasks: ${____timeDiff(begin, new Date())}s`
                    const nowDate = `${new Date().Format("yyyy-MM-dd HH:mm:ss")} last update`
                    const lastDate = __tool.read("ScriptLastUpdateDateKey")
                    console.log(`${summary}\n${resultInfo.message}\n${lastDate ? lastDate : nowDate}`)
                    __tool.notify(`${__emojiDone}Update Done`, summary, `${detail}\n${__emoji}${lastDate ? lastDate : nowDate}`)
                    __tool.write(nowDate, "ScriptLastUpdateDateKey")
                    __tool.done({})
                })
        })
        .catch((error) => {
            __tool.done({})
            __tool.notify("[eval_script.js]", "", error)
            console.log(error)
        })
}

if (!__tool.isTask) {
    const __url = $request.url
    const __confObj = (() => {
        if (__developmentMode) {
            return ____parseDevelopmentModeConf(__conf)
        } else {
            return JSON.parse(__tool.read("ScriptConfObjKey"))
        }
    })()
    const __script = (() => {
        let script = null
        const keys = Object.keys(__confObj)
        for (let i = 0, len = keys.length; i < len; i++) {
            if (script) break
            const key = keys[i]
            const value = __confObj[key]
            for (let j = 0, len = value.length; j < len; j++) {
                const match = value[j]
                const regular = new RegExp(match.regular)
                if (__debug) {
                    try {
                        if (regular.test(__url)) {
                            const type = match.type
                            if (type && type.length > 0) {
                                if (__tool.scriptType == type) {
                                    script = { url: key, match, content: __developmentMode ? key : __tool.read(key) }
                                    break
                                }
                            } else {
                                script = { url: key, match, content: __developmentMode ? key : __tool.read(key) }
                                break
                            }
                        }
                    } catch (error) {
                        if (__debug) __tool.notify("[eval_script.js]", "", `Error regular : ${match.regular}\nRequest: ${__url}`)
                        throw error
                    }
                } else {
                    if (regular.test(__url)) {
                        const type = match.type
                        if (type && type.length > 0) {
                            if (__tool.scriptType == type) {
                                script = { url: key, match, content: __developmentMode ? key : __tool.read(key) }
                                break
                            }
                        } else {
                            script = { url: key, match, content: __developmentMode ? key : __tool.read(key) }
                            break
                        }
                    }
                }
            }
        }
        return script
    })()
    if (__script) {
        if (__script.content) {
            const type = __script.match.type
            if (type && type.length > 0) {
                if (__tool.scriptType == type) {
                    if (__debug) {
                        try {
                            eval(__script.content)
                            if (__debug) __tool.notify("[eval_script.js]", `${__tool.method} ${__tool.scriptType}==${type}`, `Execute script: ${__script.url}\nRegular: ${__script.match.regular}\nRequest: ${__url}`)
                        } catch (error) {
                            if (__debug) __tool.notify("[eval_script.js]", `${__tool.method} ${__tool.scriptType}`, `Script execute error: ${error}\nScript: ${__script.url}\nRegular: ${__script.match}\nRequest: ${__url}\nContent: ${__script.content}`)
                            throw error
                        }
                    } else {
                        eval(__script.content)
                    }
                } else {
                    __tool.done({})
                    if (__debug) __tool.notify("[eval_script.js]", `${__tool.method} ${__tool.scriptType}!=${type}`, `Script types do not match! Don't execute script.\nScript: ${__script.url}\nRegular: ${__script.match.regular}\nRequest: ${__url}`)
                }
            } else {
                if (__debug) {
                    try {
                        eval(__script.content)
                        if (__debug) __tool.notify("[eval_script.js]", `${__tool.method} ${__tool.scriptType} ${"request&&response"}`, `Execute script: ${__script.url}\nRegular: ${__script.match.regular}\nRequest: ${__url}`)
                    } catch (error) {
                        if (__debug) __tool.notify("[eval_script.js]", `${__tool.method} ${__tool.scriptType}`, `Script execute error: ${error}\nScript: ${__script.url}\nRegular: ${__script.match.regular}\nRequest: ${__url}\nContent: ${__script.content}`)
                        throw error
                    }
                } else {
                    eval(__script.content)
                }
            }
        } else {
            __tool.done({})
            if (__log) console.log(`script not found: ${__script.url}\nregular: ${__script.match.regular}\nrequest: ${__url}`)
        }
    } else {
        __tool.done({})
        if (__log) console.log(`script not matched: ${__url}`)
    }
}

function ____parseDevelopmentModeConf(conf) {
    const localConf = ____removeAnnotation(____extractConf(__conf, "eval_local"))
    const result = ____parseConf(localConf)
    return result.obj
}

function ____timeDiff(begin, end) {
    return Math.ceil((end.getTime() - begin.getTime()) / 1000)
}

function ____concurrentQueueLimit(list, limit, asyncHandle) {
    let results = []
    const recursion = (arr) => {
        return asyncHandle(arr.shift())
            .then((data) => {
                results.push(data)
                if (arr.length !== 0) return recursion(arr)
                else return 'finish'
            })
    };
    const listCopy = [].concat(list)
    let asyncList = []
    if (list.length < limit)
        limit = list.length
    while (limit--) {
        asyncList.push(recursion(listCopy))
    }
    return new Promise((resolve) => {
        Promise.all(asyncList).then(() => resolve(results))
    });
}

function ____downloadFile(url) {
    return new Promise((resolve) => {
        __tool.get(url, (error, response, body) => {
            const filename = url.match(/.*\/(.*?)$/)[1]
            if (!error) {
                const code = response.statusCode
                if (code == 200) {
                    console.log(`update Success: ${url}`)
                    resolve({ url, code, body, message: `${__emoji}${filename} update success` })
                } else {
                    console.log(`update Fail ${response.statusCode}: ${url}`)
                    resolve({ url, code, body, message: `${__emoji}${filename} update fail` })
                }
            } else {
                console.log(`update Fail ${error}`)
                resolve({ url, code: null, body: null, message: `${__emoji}${filename} update fail` })
            }
        })
    })
}

function ____extractConf(conf, type) {
    const rex = new RegExp("\\[" + type + "\\](.|\\n)*?(?=\\n($|\\[))", "g")
    let result = rex.exec(conf)
    if (result) {
        result = result[0].split("\n")
        result.shift()
    } else {
        result = []
    }
    return result
}

function ____parseRemoteConf(conf) {
    const lines = conf.split("\n")
    let newLines = []
    for (let i = 0, len = lines.length; i < len; i++) {
        const eval = /^(.+)\s+eval\s+(.+)$/
        const surge = /^http\s*-\s*(request|response)\s+(\S+)\s+(.+)$/
        const quanx = /^(\S+)\s+url\s+script\s*-\s*(\S+)\s*-\s*(?:header|body)\s+(\S+)$/
        let line = lines[i].trim()
        if (line.length > 0) {
            if (/^#{4}/.test(line)) {
                line = line.replace(/^#*/, "")
                newLines.push(line)
            } else if (/^(?!;|#|\/\/).*/.test(line)) {
                if (eval.test(line) || surge.test(line)) {
                    newLines.push(line)
                }
                if (quanx.test(line)) {
                    const path = line.match(quanx)[3].trim()
                    if (/^https?:\/\/.+/.test(path)) {
                        newLines.push(line)
                    }
                }
            }
        }
    }
    return newLines
}

function ____removeAnnotation(lines) {
    if (lines.length > 0) {
        let i = lines.length;
        while (i--) {
            const line = lines[i].replace(/^\s*/, "")
            if (line.length == 0 || line.substring(0, 2) == "//" || line.substring(0, 1) == "#") {
                lines.splice(i, 1)
            }
        }
    }
    return lines
}

function ____parseConf(lines) {
    let confObj = {}
    for (let i = 0, len = lines.length; i < len; i++) {
        let line = lines[i].trim()
        if (line.length > 0 && line.substring(0, 2) != "//" && line.substring(0, 1) != "#") {
            const eval = /^(.+)\s+eval\s+(.+)$/
            const surge = /^http\s*-\s*(request|response)\s+(\S+)\s+(.+)$/
            const quanx = /^(\S+)\s+url\s+script\s*-\s*(\S+)\s*-\s*(?:header|body)\s+(\S+)$/
            if (surge.test(line)) {
                const result = line.match(surge)
                line = `${result[1].trim()} ${result[2].trim()} eval ${____surgeScriptPath(result[3].trim())}`
            } else if (quanx.test(line)) {
                const result = line.match(quanx)
                line = `${result[2].trim()} ${result[1].trim()} eval ${result[3].trim()}`
            }
            if (eval.test(line)) {
                const value = line.match(eval)
                const remote = value[2].trim()
                const match = ____parseMatch(value[1].trim())
                if (remote.length > 0 && match.length > 0) {
                    if (confObj.hasOwnProperty(remote)) {
                        confObj[remote] = confObj[remote].concat(match)
                    } else {
                        confObj[remote] = match
                    }
                } else {
                    return { obj: null, error: line }
                }
            } else {
                return { obj: null, error: line }
            }
        }
    }
    return { obj: confObj, error: null }
}

function ____surgeScriptPath(arg) {
    let scriptPath = ""
    const args = arg.split(",")
    for (let i = 0, len = args.length; i < len; i++) {
        const item = args[i].trim()
        const path = /^script-path\s*=\s*(\S+)$/
        if (path.test(item)) {
            scriptPath = item.match(path)[1]
            break
        }
    }
    return scriptPath
}

function ____parseMatch(match) {
    let matchs = []
    const typeRegex = /(request|response)\s+\S+/g
    const typeItems = match.match(typeRegex)
    if (typeItems && typeItems.length > 0) {
        match = match.replace(typeRegex, "")
    }
    const normalItems = match.match(/\S+/g)
    const items = (typeItems ? typeItems : []).concat(normalItems ? normalItems : [])
    for (let i = 0, len = items.length; i < len; i++) {
        let item = items[i]
        item = item.match(/\S+/g)
        if (item.length > 1) {
            matchs.push({ type: item[0], regular: item[1] })
        } else {
            matchs.push({ type: "", regular: item[0] })
        }
    }
    return matchs
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
    _isResponse = typeof $response != "undefined"
    _isRequestBody = typeof $request != "undefined" && typeof $request.body != "undefined"
    this.isSurge = _isSurge
    this.isQuanX = _isQuanX
    this.isTask = _isTask
    this.isResponse = _isResponse
    this.isRequestBody = _isRequestBody
    this.method = (() => {
        if (!_isTask && (_isSurge || _isQuanX)) {
            return $request.method
        }
    })()
    this.scriptType = (() => {
        if (_isResponse) {
            return "response"
        } else {
            return "request"
        }
    })()
    this.done = (obj) => {
        if (_isQuanX) $done(obj)
        if (_isSurge) $done(obj)
        if (_node) console.log("script Done.");
    }
    this.notify = (title, subtitle, message) => {
        if (_isQuanX) $notify(title, subtitle, message)
        if (_isSurge) $notification.post(title, subtitle, message)
        if (_node) console.log(JSON.stringify({ title, subtitle, message }));
    }
    this.write = (value, key) => {
        if (_isQuanX) return $prefs.setValueForKey(value, key)
        if (_isSurge) return $persistentStore.write(value, key)
        if (_node) console.log(`write success: ${key}`);
    }
    this.read = (key) => {
        if (_isQuanX) return $prefs.valueForKey(key)
        if (_isSurge) return $persistentStore.read(key)
        if (_node) console.log(`read success: ${key}`);
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
