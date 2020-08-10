/*
qx(tf 1.0.11(316)) 、 loon(tf 2.1.1(163)) 及更新版本可用。
半自动提醒完成招行消费 188、688 抽奖活动。
0 23 * * *  （挑一个玩手机的时间）
到时候点击通知即可按步骤跳转支付宝余额宝（可选）、招行对应活动页，完成转账及抽奖即可。
具体各个跳转之间延迟可根据自己手速在 boxjs 中进行设置，默认每个步骤中等待 15 秒。是否需要跳转支付宝余额宝也可在 boxjs 设置。

自用 by zZPiglet
*/

const $ = new compatibility()
$.wait_688 = $.read('CMB_wait_688') * 1000 || 15000
$.wait_188 = $.read('CMB_wait_188') * 1000 || 15000
$.wait_out = $.read('CMB_wait_out') * 1000 || 15000
const transfer_in = 'alipays://platformapi/startapp?appId=60000126&url=/www/transfer_in.html'
const transfer_out = 'alipays://platformapi/startapp?appId=60000126&url=/www/transfer_out.html'
const cmb_688 = 'cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20200511170340nbDomUNv&shorturl=http%3A%2F%2Fcmbt.cn%2FQQmnzR'
const cmb_188 = 'cmbmobilebank://cmbls/functionjump?action=gofuncid&funcid=16335001&needlogin=true&cmb_app_trans_parms_start=here&ActGroupID=AGP20200511170310bmhNWMhO&shorturl=http%3A%2F%2Fcmbt.cn%2FQQmnzR'

let delay = function(s){
    return new Promise(function(resolve,reject){
        setTimeout(resolve,s)
    })
}

delay().then(function(){
    $.notify("招商银行-688、188活动", "步骤 1：余额宝从招行卡转入 688", "点击跳转去余额宝转入", transfer_in)
    return delay($.wait_688)
}).then(function(){
    $.notify("招商银行-688、188活动", "步骤 2：招行 688 刮奖", "点击跳转去招行 688 刮奖页面", cmb_688)
    return delay($.wait_188)
}).then(function(){
    $.notify("招商银行-688、188活动", "步骤 3：招行 188 刮奖", "点击跳转去招行 188 刮奖页面", cmb_188)
    return delay($.wait_out)
}).then(function (){
    $.notify("招商银行-688、188活动", "步骤 4：余额宝转回招行卡 688", "点击跳转去余额宝转出", transfer_out)
})


$done()
function compatibility() {
    _isQuanX = typeof $task != "undefined"
    _isLoon = typeof $loon != "undefined"
    _isSurge = typeof $httpClient != "undefined" && !_isLoon
    this.read = (key) => {
        if (_isQuanX) return $prefs.valueForKey(key)
        if (_isLoon) return $persistentStore.read(key)
    }
    this.notify = (title, subtitle, message, url) => {
        imessage_ = message + (url == undefined ? "" : `\n跳转链接：${url}`)
        if (_isLoon) $notification.post(title, subtitle, message, url)
        if (_isQuanX) $notify(title, subtitle, message, {"open-url" : url})
        if (_isSurge) $notification.post(title, subtitle, content_)
    }
}