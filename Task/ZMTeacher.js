/*
"掌门好老师"自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。
请先按下述方法进行配置，进入"掌门好老师"，点击左上方"签到"或"📅"日历图标，若弹出"首次写入掌门好老师 Token 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"掌门好老师 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。
Author：zZPiglet

Quantumult X (App Store:1.0.5+, TestFlight 190+):
[task_local]
1 0 * * * ZMTeacher.js
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/ZMTeacher/ZMTeacher.js

[rewrite_local]
^https:\/\/teacherapi\.zmlearn\.com\/v1\/teacherApp\/app\/points\/taskCenter url script-request-header ZMTeacher.js
or remote
^https:\/\/teacherapi\.zmlearn\.com\/v1\/teacherApp\/app\/points\/taskCenter url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/ZMTeacher/ZMTeacher.js


Surge 4.0+:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/ZMTeacher/ZMTeacher.js
http-request ^https:\/\/teacherapi\.zmlearn\.com\/v1\/teacherApp\/app\/points\/sign script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/ZMTeacher/ZMTeacher.js

All app:
[mitm]
hostname = teacherapi.zmlearn.com

获取完 Token 后可不注释 rewrite / mitm，Token 更新时会弹窗。若因 mitm 导致 app "网络请求失败，请重试"，可注释掉 mtim。
*/

const CheckinURL = 'https://teacherapi.zmlearn.com/v1/teacherApp/app/points/sign';
const TokenName = '掌门好老师';
const TokenKey = 'zmteacher';
const $cmp = compatibility();

if ($cmp.isRequest) {
    GetToken()
    $cmp.end()
} else {
    Checkin()
    $cmp.end()
}

function GetToken() {
    if ($request.headers['token']) {
        var TokenValue = $request.headers['token'];
        if ($cmp.read(TokenKey) != (undefined || null)) {
            if ($cmp.read(TokenKey) != TokenValue) {
                var token = $cmp.write(TokenValue, TokenKey);
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "");
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "");
                }
            }
        } else {
            var token = $cmp.write(TokenValue, TokenKey);
            if (!token) {
                $cmp.notify("首次写入" + TokenName + " Token 失败‼️", "", "");
            } else {
                $cmp.notify("首次写入" + TokenName + " Token 成功 🎉", "", "");
            }
        }
    } else {
        $cmp.notify("写入" + TokenName + "Token 失败‼️", "", "配置错误, 无法读取请求头, ");
    }
}

function Checkin() {
    const ZMT = {
        url: CheckinURL,
        headers: {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-cn",
            "Api-Version": "4.3.0",
            "Connection": "keep-alive",
            "Content-Length": "2",
            "Content-Type": "application/json",
            "Cookie": "sessionId=",
            "Host": "teacherapi.zmlearn.com",
            "User-Agent": "ZMClientTeacher/432 CFNetwork/1121.2.2 Darwin/19.3.0",
            "platform": "ios_phone",
            "token": $cmp.read("zmteacher"),
            "version": "4.3.1",
            "version_code": "432",
        }
    };
    $cmp.post(ZMT, function(error, response, data) {
        const result = JSON.parse(data);
        if (!error) {
            if (result.code == 0) {
                console.log("ZMTeacher success response : \n" + data)
                var Days = result.data.lcountDay;
                var Points = result.data.eranPoints;
                var msg = "您已连续签到 " + Days + " 天，获得 " + Points + " 彩虹币！ 🌈";
                $cmp.notify("掌门好老师 - 签到成功！🎉", "", msg)
            } else if (result.code == 1) {
                $cmp.notify("掌门好老师 - 重复签到！😊", "", result.message)
            } else if (result.code == 51) {
                $cmp.notify("掌门好老师 - 签到未知...😳", "请去 app 检查是否签到成功", result.message + "：" + result.exception)
            } else if (result.code == 5003) {
                $cmp.notify("掌门好老师 - 签到未知...😳", "请去 app 检查是否签到成功", result.message)
            } else if (result.code == 11) {
                $cmp.notify("掌门好老师 - Token 失效❗️", "", result.message)
            } else {
                console.log("ZMTeacher failed response : \n" + data)
                $cmp.notify("掌门好老师 - 签到失败‼️", "", data)
            }
        } else {
            $cmp.notify("掌门好老师 - 签到接口请求失败", "", error)
        }
    })
}

function compatibility() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, post, end }
};
