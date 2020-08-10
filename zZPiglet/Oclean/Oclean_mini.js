/*
微信小程序"欧可林商城"自动签到得积分，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。
请先按下述方法进行配置，进入微信小程序"欧可林商城"并点击"每日任务"，若弹出"首次写入欧可林商城 Cookie 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"欧可林商城 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

注意："欧可林" app 签到与微信小程序"欧可林商城"签到共享（一致），即 Oclean.js 与 Oclean_mini.js 任取一个使用即可，暂未验证两个脚本中账户信息哪个过期快，不过猜测 app 签到会更持久，而新用户推荐使用小程序先进行注册，会有额外积分奖励。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet

Quantumult X:
[task_local]
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/Oclean/Oclean_mini.js, tag=欧可林商城

[rewrite_local]
^https:\/\/mall\.oclean\.com\/API\/VshopProcess\.ashx\?action=TaskHome&clientType=5&client=5&openId= url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/Oclean/Oclean_mini.js


Surge & Loon:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Oclean/Oclean_mini.js
http-request ^https:\/\/mall\.oclean\.com\/API\/VshopProcess\.ashx\?action=TaskHome&clientType=5&client=5&openId= script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Oclean/Oclean_mini.js

All app:
[mitm]
hostname = mall.oclean.com

获取完 Cookie 后可不注释 rewrite / hostname，Cookie 更新时会弹窗。若因 MitM 导致该软件网络不稳定，可注释掉 hostname。
*/

const CheckinURL = 'https://mall.oclean.com/API/VshopProcess.ashx?action=SignIn&SignInSource=5&clientType=5&client=5&openId='
const CookieName = '欧可林商城'
const CookieKey = 'Oclean_mini'
const reg = /https:\/\/mall\.oclean\.com\/API\/VshopProcess\.ashx\?action=TaskHome&clientType=5&client=5&openId=(.*)&/
const $cmp = compatibility()

if ($cmp.isRequest) {
    GetCookie()
    $cmp.done()
} else {
    Checkin()
    $cmp.done()
}

function GetCookie() {
    if ($request && reg.exec($request.url)[1]) {
        let CookieValue = reg.exec($request.url)[1]
        if ($cmp.read(CookieKey) != (undefined || null)) {
            if ($cmp.read(CookieKey) != CookieValue) {
                let token = $cmp.write(CookieValue, CookieKey)
                if (!token) {
                    $cmp.notify("更新" + CookieName + " Cookie 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + CookieName + " Cookie 成功 🎉", "", "")
                }
            }
        } else {
            let token = $cmp.write(CookieValue, CookieKey)
            if (!token) {
                $cmp.notify("首次写入" + CookieName + " Cookie 失败‼️", "", "")
            } else {
                $cmp.notify("首次写入" + CookieName + " Cookie 成功 🎉", "", "")
            }
        }
    } else {
        $cmp.notify("写入" + CookieName + "Cookie 失败‼️", "", "配置错误, 无法读取请求头, ")
    }
}

function Checkin() {
    let subTitle = ''
    let detail = ''
    const oclean_mini = {
        url: CheckinURL + $cmp.read("Oclean_mini")
    }
    $cmp.get(oclean_mini, function(error, response, data) {
        if (!error) {
            const result = JSON.parse(data)
            if (result.Status == "OK" && result.Code == 1) {
                subTitle += '签到成功！🦷'
                let todayget = result.Data.points
                let total = result.Data.integral
                detail += '签到获得 ' + todayget + ' 积分，账户共有 ' + total + ' 积分。'
            } else if (result.Status == "OK" && result.Code == 2) {
                subTitle += '重复签到！🥢'
                let total = result.Data.integral
                detail += '账户共有 ' + total + ' 积分。'
            } else if (result.Status == "NO") {
                subTitle += 'Cookie 失效或未获取'
                detail += '请按照脚本开头注释获取 Cookie。'
            } else {
                subTitle += '未知错误，详情请见日志。'
                detail += result.Message
                $cmp.log("Oclean_mini failed response : \n" + JSON.stringify(result))
            }
        } else {
            subTitle += '签到接口请求失败，详情请见日志。'
            detail += error
            $cmp.log("Oclean_mini failed response : \n" + error)
        }
        $cmp.notify(CookieName, subTitle, detail)
    })
}

function compatibility(){const e="undefined"!=typeof $request,t="undefined"!=typeof $httpClient,r="undefined"!=typeof $task,o="undefined"!=typeof $app&&"undefined"!=typeof $http,n="function"==typeof require&&!o,s=(()=>{if(n){const e=require("request");return{request:e}}return null})(),i=(e,s,i)=>{r&&$notify(e,s,i),t&&$notification.post(e,s,i),n&&a(e+s+i),o&&$push.schedule({title:e,body:s?s+"\n"+i:i})},u=(e,o)=>r?$prefs.setValueForKey(e,o):t?$persistentStore.write(e,o):void 0,d=e=>r?$prefs.valueForKey(e):t?$persistentStore.read(e):void 0,l=e=>(e&&(e.status?e.statusCode=e.status:e.statusCode&&(e.status=e.statusCode)),e),f=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="GET",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.get(e,(e,t,r)=>{i(e,l(t),r)}),n&&s.request(e,(e,t,r)=>{i(e,l(t),r)}),o&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.get(e))},p=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.post(e,(e,t,r)=>{i(e,l(t),r)}),n&&s.request.post(e,(e,t,r)=>{i(e,l(t),r)}),o&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.post(e))},a=e=>console.log(e),y=(o={})=>{r&&e&&$done(o),t&&(e?$done(o):$done())};return{isQuanX:r,isSurge:t,isJSBox:o,isRequest:e,notify:i,write:u,read:d,get:f,post:p,log:a,done:y}}
