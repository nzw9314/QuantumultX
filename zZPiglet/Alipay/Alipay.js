/*
qx(tf 1.0.11(316)) 、 loon(tf 2.1.1(163)) 及更新版本可用。
半自动提醒支付宝签到及蚂蚁森林收能量。
25 7 * * * Alipay.js
到时候点击通知即可跳转领积分，领完积分等待一定延迟（可自行设置符合自己手速的）后点击第二个通知跳转收能量。
可在 boxjs 中设置两个通知之间的时间间隔。

自用 by zZPiglet
*/

const $ = new compatibility()
const delay = $.read('Alipay_wait_mayi') * 1000 || 8000
const point = "alipays://platformapi/startapp?appId=20000160&url=/www/myPoints.html"
const mayi = "alipay://platformapi/startapp?appId=60000002"

$.notify("支付宝", "", "领积分啦", point)

setTimeout(() => {
    $.notify("支付宝", "", "收能量啦", mayi)
}, delay)

$done()

function compatibility() {
    _isQuanX = typeof $task != "undefined"
    _isLoon = typeof $loon != "undefined"
    this.read = (key) => {
        if (_isQuanX) return $prefs.valueForKey(key)
        if (_isLoon) return $persistentStore.read(key)
    }
    this.notify = (title, subtitle, message, url) => {
        if (_isLoon) $notification.post(title, subtitle, message, url)
        if (_isQuanX) $notify(title, subtitle, message, {"open-url" : url})
    }
}