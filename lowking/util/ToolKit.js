/**
 * 根据自己的习惯整合各个开发者而形成的工具包（@NobyDa, @chavyleung）
 * 兼容surge，quantumult x，loon，node环境
 * 并且加入一些好用的方法
 * 方法如下：
 *      isEmpty： 判断字符串是否是空（undefined，null，空串）
 *      getRequestUrl： 获取请求的url（目前仅支持surge和quanx）
 *      getResponseBody： 获取响应体（目前仅支持surge和quanx）
 *      boxJsJsonBuilder：构建最简默认boxjs配置json
 *      randomString： 生成随机字符串
 *      autoComplete： 自动补齐字符串
 *      customReplace： 自定义替换
 *
 * ⚠️当开启当且仅当执行失败的时候通知选项，请在执行失败的地方执行execFail()
 *
 * @param scriptName 脚本名，用于通知时候的标题
 * @param scriptId 每个脚本唯一的id，用于存储持久化的时候加入key
 * @param options 传入一些参数，目前参数如下；
 *                                      httpApi=ffff@3.3.3.18:6166（这个是默认值，本人surge调试脚本用，可自行修改）
 * @constructor
 */
function ToolKit(scriptName, scriptId, options) {
    return new (class {
        constructor(scriptName, scriptId, options) {
            this.userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15`
            this.prefix = `lk`
            this.name = scriptName
            this.id = scriptId
            this.data = null
            this.dataFile = `${this.prefix}${this.id}.dat`
            this.boxJsJsonFile = `${this.prefix}${this.id}.boxjs.json`

            //surge http api等一些扩展参数
            this.options = options

            //命令行入参
            this.isExecComm = false

            //默认脚本开关
            this.isEnableLog = this.getVal(`${this.prefix}IsEnableLog${this.id}`)
            this.isEnableLog = this.isEmpty(this.isEnableLog) ? true : JSON.parse(this.isEnableLog)
            this.isNotifyOnlyFail = this.getVal(`${this.prefix}NotifyOnlyFail${this.id}`)
            this.isNotifyOnlyFail = this.isEmpty(this.isNotifyOnlyFail) ? false : JSON.parse(this.isNotifyOnlyFail)

            //tg通知开关
            this.isEnableTgNotify = this.getVal(`${this.prefix}IsEnableTgNotify${this.id}`)
            this.isEnableTgNotify = this.isEmpty(this.isEnableTgNotify) ? false : JSON.parse(this.isEnableTgNotify)
            this.tgNotifyUrl = this.getVal(`${this.prefix}TgNotifyUrl${this.id}`)
            this.isEnableTgNotify = this.isEnableTgNotify ? !this.isEmpty(this.tgNotifyUrl) : this.isEnableTgNotify

            //计时部分
            this.costTotalStringKey = `${this.prefix}CostTotalString${this.id}`
            this.costTotalString = this.getVal(this.costTotalStringKey)
            this.costTotalString = this.isEmpty(this.costTotalString) ? `0,0` : this.costTotalString.replace("\"", "")
            this.costTotalMs = this.costTotalString.split(",")[0]
            this.execCount = this.costTotalString.split(",")[1]
            this.costTotalMs = this.isEmpty(this.costTotalMs) ? 0 : parseInt(this.costTotalMs)
            this.execCount = this.isEmpty(this.execCount) ? 0 : parseInt(this.execCount)

            this.logSeparator = '\n██'
            this.startTime = new Date().getTime()
            this.node = (() => {
                if (this.isNode()) {
                    const request = require('request')
                    return ({request})
                } else {
                    return (null)
                }
            })()
            this.execStatus = true
            this.notifyInfo = []
            this.log(`${this.name}, 开始执行!`)
            this.execComm()
        }

        async execComm() {
            //支持node命令，实现发送手机测试
            if (this.isNode()) {
                this.comm = process.argv.slice(2)
                if (this.comm[0] == "p") {
                    this.isExecComm = true
                    //phone
                    this.log(`开始执行指令【${this.comm[0]}】=> 发送到手机测试脚本！`)
                    if (this.isEmpty(this.options) || this.isEmpty(this.options.httpApi)) {
                        //设置默认值
                        if (this.isEmpty(this.options)) {
                            this.options = {}
                        }
                        this.options.httpApi = `ffff@3.3.3.18:6166`;
                    } else {
                        //判断格式
                        if (/.*?@.*?:[0-9]+/.test(this.options.httpApi)) {
                            this.log(`httpApi格式错误！格式：ffff@3.3.3.18:6166`)
                            this.done()
                        }
                    }
                    await this.callApi();
                }
            }
        }

        callApi() {
            let fname = this.getCallerFileNameAndLine().split(":")[0].replace("[", "")
            this.log(`获取【${fname}】内容传给手机`)
            let scriptStr = ''
            this.fs = this.fs ? this.fs : require('fs')
            this.path = this.path ? this.path : require('path')
            const curDirDataFilePath = this.path.resolve(fname)
            const rootDirDataFilePath = this.path.resolve(process.cwd(), fname)
            const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
            const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
            if (isCurDirDataFile || isRootDirDataFile) {
                const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
                try {
                    scriptStr = this.fs.readFileSync(datPath)
                } catch (e) {
                    scriptStr = ''
                }
            } else {
                scriptStr = ''
            }
            let options = {
                url: `http://${this.options.httpApi.split("@")[1]}/v1/scripting/evaluate`,
                headers: {
                    "X-Key": `${this.options.httpApi.split("@")[0]}`
                },
                body: {
                    "script_text": `${scriptStr}`,
                    "mock_type": "cron",
                    "timeout": 5
                },
                json: true
            }
            this.post(options, (error, response, data) => {
                this.log(`已将脚本【${fname}】发给手机！`)
                this.done()
            })
        }

        getCallerFileNameAndLine(){
            let error
            try {
                throw Error('')
            } catch (err) {
                error = err
            }

            const stack = error.stack
            const stackArr = stack.split('\n')
            let callerLogIndex = 1

            if (callerLogIndex !== 0) {
                const callerStackLine = stackArr[callerLogIndex]
                this.path = this.path ? this.path : require('path')
                return `[${callerStackLine.substring(callerStackLine.lastIndexOf(this.path.sep) + 1, callerStackLine.lastIndexOf(':'))}]`
            } else {
                return '[-]'
            }
        }

        getFunName(fun) {
            var ret = fun.toString();
            ret = ret.substr('function '.length);
            ret = ret.substr(0, ret.indexOf('('));
            return ret;
        }

        boxJsJsonBuilder(info) {
            if (this.isNode()) {
                this.log('using node')
                let needAppendKeys = ["keys", "settings"]
                const domain = 'https://raw.githubusercontent.com/Orz-3'
                let boxJsJson = {}
                boxJsJson.id = `${this.prefix}${this.id}`
                boxJsJson.name = this.name
                boxJsJson.icons = [`${domain}/mini/master/${this.id.toLocaleLowerCase()}.png`,`${domain}/task/master/${this.id.toLocaleLowerCase()}.png`]
                boxJsJson.keys = []
                boxJsJson.settings = [
                    {
                        "id": `${this.prefix}IsEnableLog${this.id}`,
                        "name": "开启/关闭日志",
                        "val": true,
                        "type": "boolean",
                        "desc": "默认开启"
                    },
                    {
                        "id": `${this.prefix}NotifyOnlyFail${this.id}`,
                        "name": "只当执行失败才通知",
                        "val": false,
                        "type": "boolean",
                        "desc": "默认关闭"
                    },
                    {
                        "id": `${this.prefix}isEnableTgNotify${this.id}`,
                        "name": "开启/关闭Telegram通知",
                        "val": false,
                        "type": "boolean",
                        "desc": "默认关闭"
                    },
                    {
                        "id": `${this.prefix}TgNotifyUrl${this.id}`,
                        "name": "Telegram通知地址",
                        "val": "",
                        "type": "text",
                        "desc": "Tg的通知地址，如：https://api.telegram.org/bot-token/sendMessage?chat_id=-100140&parse_mode=Markdown&text="
                    }
                ]
                boxJsJson.author = "@lowking"
                boxJsJson.repo = "https://github.com/lowking/Scripts"
                //除了settings和keys追加，其他的都覆盖
                if (!this.isEmpty(info)) {
                    for (let i in needAppendKeys) {
                        let key = needAppendKeys[i]
                        if (!this.isEmpty(info[key])) {
                            boxJsJson[key] = boxJsJson[key].concat(info[key])
                        }
                        delete info[key]
                    }
                }
                Object.assign(boxJsJson, info)
                if (this.isNode()) {
                    this.fs = this.fs ? this.fs : require('fs')
                    this.path = this.path ? this.path : require('path')
                    const curDirDataFilePath = this.path.resolve(this.boxJsJsonFile)
                    const rootDirDataFilePath = this.path.resolve(process.cwd(), this.boxJsJsonFile)
                    const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                    const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                    const jsondata = JSON.stringify(boxJsJson, null, '\t')
                    if (isCurDirDataFile) {
                        this.fs.writeFileSync(curDirDataFilePath, jsondata)
                    } else if (isRootDirDataFile) {
                        this.fs.writeFileSync(rootDirDataFilePath, jsondata)
                    } else {
                        this.fs.writeFileSync(curDirDataFilePath, jsondata)
                    }
                }
            }
        }

        appendNotifyInfo(info, type) {
            if (type == 1) {
                this.notifyInfo = info
            } else {
                this.notifyInfo.push(info)
            }
        }

        execFail() {
            this.execStatus = false
        }

        isRequest() {
            return typeof $request != "undefined"
        }

        isSurge() {
            return typeof $httpClient != "undefined"
        }

        isQuanX() {
            return typeof $task != "undefined"
        }

        isLoon() {
            return typeof $loon != "undefined"
        }

        isJSBox() {
            return typeof $app != "undefined" && typeof $http != "undefined"
        }

        isNode() {
            return typeof require == "function" && !this.isJSBox()
        }

        sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time))
        }

        log(message) {
            if (this.isEnableLog) console.log(`${this.logSeparator}${message}`)
        }

        logErr(message) {
            if (this.isEnableLog) {
                console.log(`${this.logSeparator}${this.name}执行异常:`)
                console.log(message)
                console.log(`\n${message.message}`)
            }
        }

        msg(subtitle, message) {
            if (!this.isRequest() && this.isNotifyOnlyFail && this.execStatus) {
                //开启了当且仅当执行失败的时候通知，并且执行成功了，这时候不通知
            } else {
                if (this.isEmpty(message)) {
                    if (Array.isArray(this.notifyInfo)) {
                        message = this.notifyInfo.join("\n")
                    } else {
                        message = this.notifyInfo
                    }
                }
                if (!this.isEmpty(message)) {
                    if (this.isEnableTgNotify) {
                        this.log(`${this.name}Tg通知开始`)
                        this.get({
                            url: encodeURI(`${this.tgNotifyUrl}📌${this.name}\n${message}`)
                        }, (error, statusCode, body) => {
                            this.log(`Tg通知完毕`)
                        })
                    } else {
                        if (this.isQuanX()) $notify(this.name, subtitle, message)
                        if (this.isSurge()) $notification.post(this.name, subtitle, message)
                        if (this.isNode()) this.log("⭐️" + this.name + subtitle + message)
                        if (this.isJSBox()) $push.schedule({
                            title: this.name,
                            body: subtitle ? subtitle + "\n" + message : message
                        })
                    }
                }
            }
        }

        getVal(key) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.read(key)
            } else if (this.isQuanX()) {
                return $prefs.valueForKey(key)
            } else if (this.isNode()) {
                this.data = this.loadData()
                return this.data[key]
            } else {
                return (this.data && this.data[key]) || null
            }
        }

        setVal(key, val) {
            if (this.isSurge() || this.isLoon()) {
                return $persistentStore.write(val, key)
            } else if (this.isQuanX()) {
                return $prefs.setValueForKey(val, key)
            } else if (this.isNode()) {
                this.data = this.loadData()
                this.data[key] = val
                this.writeData()
                return true
            } else {
                return (this.data && this.data[key]) || null
            }
        }

        loadData() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                if (isCurDirDataFile || isRootDirDataFile) {
                    const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
                    try {
                        return JSON.parse(this.fs.readFileSync(datPath))
                    } catch (e) {
                        return {}
                    }
                } else return {}
            } else return {}
        }

        writeData() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require('fs')
                this.path = this.path ? this.path : require('path')
                const curDirDataFilePath = this.path.resolve(this.dataFile)
                const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
                const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
                const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
                const jsondata = JSON.stringify(this.data)
                if (isCurDirDataFile) {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                } else if (isRootDirDataFile) {
                    this.fs.writeFileSync(rootDirDataFilePath, jsondata)
                } else {
                    this.fs.writeFileSync(curDirDataFilePath, jsondata)
                }
            }
        }

        adapterStatus(response) {
            if (response) {
                if (response.status) {
                    response["statusCode"] = response.status
                } else if (response.statusCode) {
                    response["status"] = response.statusCode
                }
            }
            return response
        }

        get(options, callback = () => {}) {
            if (this.isQuanX()) {
                if (typeof options == "string") options = {
                    url: options
                }
                options["method"] = "GET"
                $task.fetch(options).then(response => {
                    callback(null, this.adapterStatus(response), response.body)
                }, reason => callback(reason.error, null, null))
            }
            if (this.isSurge()) $httpClient.get(options, (error, response, body) => {
                callback(error, this.adapterStatus(response), body)
            })
            if (this.isNode()) {
                this.node.request(options, (error, response, body) => {
                    callback(error, this.adapterStatus(response), body)
                })
            }
            if (this.isJSBox()) {
                if (typeof options == "string") options = {
                    url: options
                }
                options["header"] = options["headers"]
                options["handler"] = function (resp) {
                    let error = resp.error
                    if (error) error = JSON.stringify(resp.error)
                    let body = resp.data
                    if (typeof body == "object") body = JSON.stringify(resp.data)
                    callback(error, this.adapterStatus(resp.response), body)
                }
                $http.get(options)
            }
        }

        post(options, callback = () => {}) {
            if (this.isQuanX()) {
                if (typeof options == "string") options = {
                    url: options
                }
                options["method"] = "POST"
                $task.fetch(options).then(response => {
                    callback(null, this.adapterStatus(response), response.body)
                }, reason => callback(reason.error, null, null))
            }
            if (this.isSurge()) {
                $httpClient.post(options, (error, response, body) => {
                    callback(error, this.adapterStatus(response), body)
                })
            }
            if (this.isNode()) {
                this.node.request.post(options, (error, response, body) => {
                    callback(error, this.adapterStatus(response), body)
                })
            }
            if (this.isJSBox()) {
                if (typeof options == "string") options = {
                    url: options
                }
                options["header"] = options["headers"]
                options["handler"] = function (resp) {
                    let error = resp.error
                    if (error) error = JSON.stringify(resp.error)
                    let body = resp.data
                    if (typeof body == "object") body = JSON.stringify(resp.data)
                    callback(error, this.adapterStatus(resp.response), body)
                }
                $http.post(options)
            }
        }

        costTime() {
            let info = `${this.name}执行完毕！`
            if (this.isNode() && this.isExecComm) {
                info = `指令【${this.comm[0]}】执行完毕！`
            }
            const endTime = new Date().getTime()
            const ms = endTime - this.startTime
            const costTime = ms / 1000
            this.execCount++
            this.costTotalMs += ms
            this.log(`${info}耗时【${costTime}】秒\n总共执行【${this.execCount}】次，平均耗时【${((this.costTotalMs / this.execCount) / 1000).toFixed(4)}】秒`)
            this.setVal(this.costTotalStringKey, JSON.stringify(`${this.costTotalMs},${this.execCount}`))
            // this.setVal(this.execCountKey, JSON.stringify(0))
            // this.setVal(this.costTotalMsKey, JSON.stringify(0))
        }

        done(value) {
            this.costTime()
            let key = `body`
            if (this.isRequest()) {
                if (this.isQuanX()) key = `content`
                if (this.isSurge()) key = `body`
            }
            let obj = {}
            obj[key] = value
            if (this.isQuanX()) this.isRequest() ? $done(obj) : null
            if (this.isSurge()) this.isRequest() ? $done(obj) : $done()
        }

        getRequestUrl() {
            return $request.url
        }

        getResponseBody() {
            return $response.body
        }

        isGetCookie(reg) {
            return !!($request.method != 'OPTIONS' && this.getRequestUrl().match(reg))
        }

        isEmpty(obj) {
            if (typeof obj == "undefined" || obj == null || obj == "" || obj == "null") {
                return true
            } else {
                return false
            }
        }

        randomString(len) {
            len = len || 32
            var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
            var maxPos = $chars.length
            var pwd = ''
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
            }
            return pwd
        }

        /**
         * 自动补齐字符串
         * @param str 原始字符串
         * @param prefix 前缀
         * @param suffix 后缀
         * @param fill 补齐用字符
         * @param len 目标补齐长度，不包含前后缀
         * @param direction 方向：0往后补齐
         * @param ifCode 是否打码
         * @param clen 打码长度
         * @param startIndex 起始坐标
         * @param cstr 打码字符
         * @returns {*}
         */
        autoComplete(str, prefix, suffix, fill, len, direction, ifCode, clen, startIndex, cstr) {
            str += ``
            if (str.length < len) {
                while (str.length < len) {
                    if (direction == 0) {
                        str += fill
                    } else {
                        str = fill + str
                    }
                }
            }
            if (ifCode) {
                let temp = ``
                for (var i = 0; i < clen; i++) {
                    temp += cstr
                }
                str = str.substring(0, startIndex) + temp + str.substring(clen + startIndex)
            }
            str = prefix + str + suffix
            return this.toDBC(str)
        }

        /**
         * @param str 源字符串 "#{code}, #{value}"
         * @param param 用于替换的数据，结构如下
         * @param prefix 前缀 "#{"
         * @param suffix 后缀 "}"
         * {
         *     "code": 1,
         *     "value": 2
         * }
         * 按上面的传入，输出为"1, 2"
         * 对应的#{code}用param里面code的值替换，#{value}也是
         * @returns {*|void|string}
         */
        customReplace(str, param, prefix, suffix) {
            try {
                if (this.isEmpty(prefix)) {
                    prefix = "#{"
                }
                if (this.isEmpty(suffix)) {
                    suffix = "}"
                }

                for (let i in param) {
                    str = str.replace(`${prefix}${i}${suffix}`, param[i])
                }
            } catch (e) {
                this.logErr(e)
            }

            return str
        }

        toDBC(txtstring) {
            var tmp = ""
            for (var i = 0; i < txtstring.length; i++) {
                if (txtstring.charCodeAt(i) == 32) {
                    tmp = tmp + String.fromCharCode(12288)
                } else if (txtstring.charCodeAt(i) < 127) {
                    tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248)
                }
            }
            return tmp
        }
    })(scriptName, scriptId, options)
}