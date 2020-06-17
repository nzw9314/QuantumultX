/*
 Author: @toulanboy 
 
📕地址：https://github.com/toulanboy/scripts
📌不定期更新各种签到、有趣的脚本，欢迎star🌟
    
配置步骤 （请先认真阅读配置，再进行操作）
 1. 根据你当前的软件，配置好srcipt。Tips:由于是远程文件，记得顺便更新文件。
 2. 打开小木虫app => 发现页面 => 签到领红包 => 拆红包。弹出通知，即获取成功。
 3. 回到quanx等软件，关掉获取cookie的rewrite。（loon是关掉获取cookie的脚本）
 4. 手动跑1次，看看是否能获取到今天签到的金币数。
 
Surge:
Rewrite: 小木虫论坛 = type=http-request,pattern=^https?:\/\/mapi.xmcimg.com\/bbs\/memcp.php\?action,script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js,requires-body=false
Tasks: 小木虫论坛 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js,wake-system=true,timeout=600
  
QuanX:
[rewrite]
^https?:\/\/mapi.xmcimg.com\/bbs\/memcp.php\?action url script-request-header https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js
[task]
5 0 * * * https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js, tag=小木虫论坛
  
Loon:
[script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js, timeout=600, tag=小木虫论坛
http-request ^https?:\/\/mapi.xmcimg.com\/bbs\/memcp.php\?action script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js,requires-body=false, tag=小木虫论坛cookie获取
 
[MITM]
hostname = *.xmcimg.com
*/
const $ = new Env('🦜小木虫论坛')

$.muchong_headers = $.getdata("muchong_headers")

const debug = false

!(async () => {
  if (typeof $request != "undefined") {
    await getCookie()
  }
  else {
    await getCode()
    if ($.isSign == false) {
      await checkin()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done()
  })
function getCookie() {
  const VAL_headers = JSON.stringify($request.headers)
  if (VAL_headers) {
    $.setdata(JSON.stringify($request.headers), 'muchong_headers')
    $.msg($.name, `📌获取会话成功`)
    if (debug) {
      console.log($.getdata("muchong_headers"))
    }
  }
}
function getCode() {
  const url = {
    url: `https://mapi.xmcimg.com/bbs/memcp.php`,
    body: `action=getcredit&_tpl=app&target=1`
  };
  url.headers = JSON.parse($.muchong_headers)
  if (debug) console.log(url)
  return new Promise((resove) => {
    $.post(url, (error, response, data) => {
      if (error) throw new Error(error)
      if (debug) console.log(response)

      if (data.match(/点击拆红包/)) {
        var result = data.match(/id=\"formhash\" value=\"(.*?)\"/)
        if (result != null) {
          $.formhash = result[1]
          $.isSign = false
          console.log(`${$.name} ✅已找到code: ${$.formhash}`)  
          resove()
        }
        else {
          console.log(`${$.name} 🚫找不到formhash, cookie可能失效了`)
          $.msg($.name, "",`🚫找不到formhash, cookie可能失效了`)
          $.isSign = true;
          resove()
        }
      }
      else if (data.match(/已连续/)) {
        $.isSign = true;
        $.coin = data.match(/<em>(\d+?)<\/em>/)
        $.other_message = data.match(/已连续.*?(\d+).*?天领取，连续.*?(\d+).*?天得大礼包/)
        $.msg(`${$.name}`, "", `🚫重复签到，签到情况如下：\n1️⃣获得金币${$.coin[1]}\n2️⃣${$.other_message[0]}`)
        resove()
      }
      else {
        $.isSign = false
        console.log(`${$.name} 🚫找不到连续连续签到信息`)
        resove()
      }
    })
  })
}
function checkin() {
  const url = {
    url: 'https://mapi.xmcimg.com/bbs/memcp.php?action=getcredit',
    body: `getmode=1&creditsubmit=1&formhash=${$.formhash}`
  };
  url.headers = JSON.parse($.muchong_headers)
  if (debug) console.log(url)
  return new Promise((resove) => {
    $.post(url, (error, response, data) => {
      if (error) throw new Error(error)
      if (debug) console.log(response)
      $.coin = data.match(/<em>(\d+?)<\/em>/)
      $.other_message = data.match(/已连续.*?(\d+).*?天领取，连续.*?(\d+).*?天得大礼包/)
      $.msg(`${$.name}`, "", `✅签到成功，签到情况如下：\n1️⃣获得金币${$.coin[1]}\n2️⃣${$.other_message[0]}`)
      //今天的红包，您已经领取了，一天就一次机会
    })
  })

}
// prettier-ignore, @chavyleung
function Env(t) { this.name = t, this.logs = [], this.isSurge = (() => "undefined" != typeof $httpClient), this.isQuanX = (() => "undefined" != typeof $task), this.log = ((...t) => { this.logs = [...this.logs, ...t], t ? console.log(t.join("\n")) : console.log(this.logs.join("\n")) }), this.msg = ((t = this.name, s = "", i = "") => { this.isSurge() && $notification.post(t, s, i), this.isQuanX() && $notify(t, s, i), this.log("==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="), t && this.log(t), s && this.log(s), i && this.log(i) }), this.getdata = (t => this.isSurge() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : void 0), this.setdata = ((t, s) => this.isSurge() ? $persistentStore.write(t, s) : this.isQuanX() ? $prefs.setValueForKey(t, s) : void 0), this.get = ((t, s) => this.send(t, "GET", s)), this.wait = ((t, s = t) => i => setTimeout(() => i(), Math.floor(Math.random() * (s - t + 1) + t))), this.post = ((t, s) => this.send(t, "POST", s)), this.send = ((t, s, i) => { if (this.isSurge()) { const e = "POST" == s ? $httpClient.post : $httpClient.get; e(t, (t, s, e) => { s && (s.body = e, s.statusCode = s.status), i(t, s, e) }) } this.isQuanX() && (t.method = s, $task.fetch(t).then(t => { t.status = t.statusCode, i(null, t, t.body) }, t => i(t.error, t, t))) }), this.done = ((t = {}) => $done(t)) }

