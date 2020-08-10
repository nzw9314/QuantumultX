/*
"滴滴出行" app 自动签到，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。
请先按下述方法进行配置，进入"滴滴出行"，若弹出"首次写入滴滴出行 Token 成功"即可正常食用，先手动运行一次脚本，弹出成功后回到"滴滴出行"，点击右上角"天天领福利"查看福利金是否到账，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"滴滴出行 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet

----------
版本记录：
- 2020/06/09：
测试阶段，可能会出现各种问题，希望因脚本出现问题可及时反馈。
增加自动签到领取福利金。
脚本中使用了我的邀请打卡 aff（每日最多 5 次，每次 60 福利金。），若不希望使用，可将 aff 改为 false。
代办：增加自动领取打车后未领取的福利金/打车金。
常见错误：
1. 若是 Token 获取问题请先自行排查重写及主机名是否正确，若均正确且日志无报错的情况下无法获取，请反馈，并最好能提供抓包记录（打开抓包软件，然后再进入滴滴，进入打车的界面之后关闭抓包的软件，导出这个包私发给我就行）。
2. 提示"签到失败‼️ 详情请见日志。"，可将日志信息私发给我。若日志信息含有"500 Server internal error"，且着急签到，可尝试将 aff 改为 false 后运行一次脚本，并反馈是否还存在问题。
----------

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
1 0 * * * DiDi.js, tag=滴滴出行
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js, tag=滴滴出行

[rewrite_local]
^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? url script-request-header DiDi.js
or remote
^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js


Surge 4.0+ & Loon:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js
http-request ^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js

All app:
[mitm]
hostname = as.xiaojukeji.com

获取完 Token 后可不注释 rewrite / hostname，Token 更新时会弹窗。若因 MitM 导致该软件或小程序网络不稳定，可注释掉 hostname。
*/

const aff = true //若不想提供 aff 请改为 false。
const mainURL = 'https://bosp-api.xiaojukeji.com/wechat/benefit/public/index?'
const TokenName = '滴滴出行'
const TokenKey = 'DiDi'
const CityKey = 'DiDi_city'
const reg = /^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\?(.*)location_cityid=(\d*)&(.*)ticket=(.*)&/
const source_id = ['WTZs7tfSPrADJ8uLRVMOKA%253D%253D', 'DRKV%252BEcE4Gqn%252BH1mKz2HQg%253D%253D']
const today = new Date().getFullYear() + "-" + ("00" + Number(new Date().getMonth() + 1)).substr(-2) + "-" + ("00" + new Date().getDate()).substr(-2)
const $cmp = compatibility()

if ($cmp.isRequest) {
    GetToken()
    $cmp.done()
} else {
    Checkin()
    $cmp.done()
}

function GetToken() {
    if ($request) {
        const requrl = $request.url
        let TokenValue = decodeURIComponent(reg.exec(requrl)[4])
        let CityValue = reg.exec(requrl)[2]
        $cmp.write(CityValue, CityKey)
        if ($cmp.read(TokenKey) != (undefined || null)) {
            if ($cmp.read(TokenKey) != TokenValue) {
                let token = $cmp.write(TokenValue, TokenKey)
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "")
                }
            }
        } else {
            let token = $cmp.write(TokenValue, TokenKey)
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

function Choose(v) {
    let r = Math.floor(Math.random() * Math.floor(2))
    return v[r]
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            let obj = JSON.parse(str)
            if (typeof obj == 'object' && obj) {
                return obj
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }
    return false
}

function Checkin() {
    let subTitle = ''
    let detail = ''
    let CheckinURL = mainURL + 'city_id=' + $cmp.read("DiDi_city")
    if (aff) {
        let s_i = Choose(source_id)
        $cmp.log("DiDi aff : \n" + s_i)
        CheckinURL += '&share_source_id=' + s_i + '&share_date=' + today
    }
    const didi = {
        url: CheckinURL,
        headers: {
            "Didi-Ticket": $cmp.read("DiDi"),
        }
    }
    $cmp.get(didi, function(error, response, data) {
        if (!error) {
            if (response.statusCode == 403) {
                subTitle += 'Token 未获取或失效❗'
                detail += '请按脚本开头注释完成配置并首次或重新获取 Token。'
            } else {
                const result = isJSON(data)
                if (result && result.errno == 0) {
                    if(result.data.sign.sign) {
                        subTitle += '签到成功！🚕'
                        let todayearn = Number(result.data.sign.sign.subsidy_state.subsidy_amount + result.data.sign.sign.subsidy_state.extra_subsidy_amount)
                        detail += '签到获得 ' + todayearn + ' 福利金，'
                    } else {
                        subTitle += '重复签到！🚖'
                    }
                    let total = result.data.welfare.balance
                    detail += '账户共有 ' + total + ' 福利金，可抵扣 ' + total/100 + ' 元。'
                    for (let message of result.data.notification.reverse()) {
                        detail += '\n' + message
                    }
                    $cmp.log("DiDi source_id : \n" + result.data.share.source_id)
                } else if (result && result.errno == 101) {
                    subTitle += '签到失败‼️ 城市代码错误。'
                    detail += '请重新获取 Token。\n' + result.errmsg
                } else {
                    subTitle += '签到失败‼️ 详情请见日志。'
                    detail += data
                    $cmp.log("DiDi failed response : \n" + data)
                }
            }
        } else {
            subTitle += '签到接口请求失败，详情请见日志。'
            detail += error
            $cmp.log("DiDi failed response : \n" + error)
        }
        $cmp.notify(TokenName, subTitle, detail)
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