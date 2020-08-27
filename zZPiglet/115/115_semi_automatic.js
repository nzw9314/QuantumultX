/*
qx(tf 1.0.11(316)) 及 loon(tf 2.1.1(163)) 及更新版本可用。
半自动提醒 115 摇一摇得空间。
0 23 * * *  （挑一个玩手机的时间）
到时候点击通知即可跳转至 115 主界面，摇一摇领取空间。

自不用 by zZPiglet
*/

const $ = new cmp()

let wp115 = "wx9b74cc2b355eef5f://"
//let wp115 = "oof.disk://"

$.notify("115", "", "点击跳转摇一摇领空间啦", wp115)

$done()

function cmp() {
    _isQuanX = typeof $task != "undefined"
    _isLoon = typeof $loon != "undefined"
    _isSurge = typeof $httpClient != "undefined" && !_isLoon
    this.notify = (title, subtitle, message, url) => {
        message_ = message + (url == undefined ? "" : `\n跳转链接：${url}`)
        if (_isLoon) $notification.post(title, subtitle, message, url)
        if (_isQuanX) $notify(title, subtitle, message, {"open-url" : url})
        if (_isSurge) $notification.post(title, subtitle, content_)
    }
}