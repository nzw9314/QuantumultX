/*
"欧可林"每日红包得积分，早上十点，此脚本为使用 Oclean.js 者使用。
0 0 10 * * *

由于欧可林服务器（大概）的问题，脚本几乎肯定会超时无通知，日志为 timeout，但有概率可以抽中，希望抽中且有通知者反馈一下日志中的返回体或日志、通知截图。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet
*/

const CookieName = '欧可林'
const CheckinURL = 'https://mall.oclean.com/API/VshopProcess.ashx'
const $cmp = compatibility()
Lottery()
$cmp.done()

function Lottery() {
    let subTitle = ''
    let detail = ''
    const oclean = {
        url: CheckinURL,
        headers: {
            "Cookie": 'Shop-Member=' + $cmp.read("Oclean"),
        },
        body: 'action=GrabEveryDayPoint&redId=1&clientType=2'
    }
    $cmp.post(oclean, function(error, response, data) {
        if (!error) {
            const result = JSON.parse(data)
            if (result.Status == "OK") {
                subTitle += '抽奖成功！🦷'
                detail += result.Message
                $cmp.log(data)
            } else if (result.Status == "NO") {
                subTitle += '抽奖失败'
                detail += result.Message
                $cmp.log(data)
            } else {
                subTitle += '未知错误，详情请见日志。'
                detail += result.Message
                $cmp.log("Oclean failed response : \n" + JSON.stringify(result))
            }
            $cmp.notify(CookieName, subTitle, detail)
        } else {
            //subTitle += '签到接口请求失败，详情请见日志。'
            //detail += error
            $cmp.log("Oclean failed response : \n" + error)
        }
        //$cmp.notify(CookieName, subTitle, detail)
    })
}

function compatibility(){const e="undefined"!=typeof $request,t="undefined"!=typeof $httpClient,r="undefined"!=typeof $task,o="undefined"!=typeof $app&&"undefined"!=typeof $http,n="function"==typeof require&&!o,s=(()=>{if(n){const e=require("request");return{request:e}}return null})(),i=(e,s,i)=>{r&&$notify(e,s,i),t&&$notification.post(e,s,i),n&&a(e+s+i),o&&$push.schedule({title:e,body:s?s+"\n"+i:i})},u=(e,o)=>r?$prefs.setValueForKey(e,o):t?$persistentStore.write(e,o):void 0,d=e=>r?$prefs.valueForKey(e):t?$persistentStore.read(e):void 0,l=e=>(e&&(e.status?e.statusCode=e.status:e.statusCode&&(e.status=e.statusCode)),e),f=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="GET",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.get(e,(e,t,r)=>{i(e,l(t),r)}),n&&s.request(e,(e,t,r)=>{i(e,l(t),r)}),o&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.get(e))},p=(e,i)=>{r&&("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e).then(e=>{i(null,l(e),e.body)},e=>i(e.error,null,null))),t&&$httpClient.post(e,(e,t,r)=>{i(e,l(t),r)}),n&&s.request.post(e,(e,t,r)=>{i(e,l(t),r)}),o&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let t=e.error;t&&(t=JSON.stringify(e.error));let r=e.data;"object"==typeof r&&(r=JSON.stringify(e.data)),i(t,l(e.response),r)},$http.post(e))},a=e=>console.log(e),y=(o={})=>{r&&e&&$done(o),t&&(e?$done(o):$done())};return{isQuanX:r,isSurge:t,isJSBox:o,isRequest:e,notify:i,write:u,read:d,get:f,post:p,log:a,done:y}}
