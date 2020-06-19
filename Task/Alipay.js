/*
qx 及 loon 最新 tf 可用。
半自动提醒支付宝签到及蚂蚁森林收能量。
25 7 * * * Alipay.js
到时候点击通知即可跳转领积分，领完积分等待一定延迟（可自行设置符合自己手速的）后点击第二个通知跳转收能量。

自用 by zZPiglet
*/

const delay = 8000 //设置两个通知之前的延迟，单位毫秒

const $ = new cmp()
const point = "alipays://platformapi/startapp?appId=20000160&url=/www/myPoints.html"
const mayi = "alipay://platformapi/startapp?appId=60000002"

$.notify("支付宝", "", "领积分啦", point)

setTimeout(() => {
    $.notify("支付宝", "", "收能量啦", mayi)
}, delay)

$done()

function cmp() {
    _isQuanX = typeof $task != "undefined"
    _isLoon = typeof $loon != "undefined"
    this.notify = (title, subtitle, message, url) => {
        if (_isLoon) $notification.post(title, subtitle, message, url)
        if (_isQuanX) $notify(title, subtitle, message, {"open-url" : url})
    }
}