/**
 * @toulanboy 、@PENG-YM
 * 
 * 🌧 6月16日 下午2点 ，下雨天：经过多次测试，非常遗憾地发现石头的参数是每天变化且加密的，只能弃坑。
 * 
 * 📕地址：https://github.com/toulanboy/scripts
 * 📌不定期更新各种签到、有趣的脚本，欢迎star🌟
 * 
 * 【请认真阅读以下内容】
 * 
 * 1、 根据你当前的软件，配置好srcipt。Tips:由于是远程文件，记得顺便更新文件。
 * 2、 打开石头读书，点击签到。点击签到后，有一个日历的页面，建议再次点击今天的日期，确保获取成功。
 * 3、 quanx等软件，关掉获取cookie的rewrite。（loon是关掉获取cookie的脚本）

 * 
 * Surge:
 * Rewrite: 石头读书 = type=http-request,pattern=^https?:\/\/app.stoneread.com\/api\/apiClient\/index,script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js,requires-body=true
 * Tasks: 石头读书 = type=cron,cronexp="5 0 * * *",script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js,wake-system=true,timeout=600
 * 
 * QuanX:
 * [rewrite]
 * ^https?:\/\/app.stoneread.com\/api\/apiClient\/index url script-request-body https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js
 * [task]
 * 5 0 * * * https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js, img-url=https://raw.githubusercontent.com/Orz-3/task/master/stone.png, tag=石头读书
 * 
 * Loon:
 * [script]
 * cron "5 0 * * *" script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js, timeout=600, tag=石头读书
 * http-request ^https?:\/\/app.stoneread.com\/api\/apiClient\/index script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js,requires-body=true, tag=石头读书cookie获取
 *
 * [MITM]
 * hostname = *.stoneread.com
 */
const $ = new Env('📚石头读书')

$.stone_headers = $.getdata("stone_headers")
$.stone_body = $.getdata("stone_body")

const debug = false

!(async () => {
  if (typeof $request != "undefined") {
    await checkin(0)
    if ($.isCorrentLink) {
      await getCookie()
    }
  }
  else {
    await checkin()
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done()
  })

function getCookie() {
  const VAL_body = $request.body
  const VAL_headers = JSON.stringify($request.headers)
  if (VAL_body && VAL_headers) {
    $.setdata($request.body, 'stone_body')
    $.setdata(JSON.stringify($request.headers), 'stone_headers')
    $.msg("📚石头读书", `📌获取会话成功`)
    if (debug) {
      console.log($.getdata("stone_body"))
      console.log($.getdata("stone_headers"))
    }
  }
}

function checkin(type = 1) {
  const myRequest = {
    url: `https://app.stoneread.com/api/apiClient/index`,

  };
  myRequest.headers = type == 1 ? JSON.parse($.stone_headers): $request.headers
  myRequest.body = type == 1 ? $.stone_body : $request.body
  if (debug)
    console.log(myRequest)
  return new Promise((resove) => {
    $.post(myRequest, (error, response, data) => {
      if (error) throw new Error(error)
      if (debug) console.log(response)

      rb = JSON.parse(response.body)
      const success = rb.success
      const result = rb.result.Message.messagestr
      if(debug) console.log(result)
      if (type != 1) {
        if (result.match(/签到/)) {
          console.log(`${$.name}  🥰 检测到签到页面啦！ 页面内容是：${result}`)
          $.isCorrentLink = true
          resove()
          return
        }
        else {
          $.isCorrentLink = false
          resove()
          return
        }
      }
      if (success == 0)
        $.msg("📚石头读书", `${result.match('error')?"🚫cookie已过期，签到失败。":result}`, `${result.match('error')?"😭由于cookie时效太短，只能弃坑\n其他脚本欢迎了解：https://github.com/toulanboy/scripts":""}`)
      else if(success == 1){
        $.msg("📚石头读书", `📌${result}`, `📌连续签到${rb.continuous}天\n📌共签到${rb.signcount}天\n📌当前拥有${rb.sumcretis}金币`)
      }
      else {
        $.msg("📚石头读书", `📌${result}`, "😭由于cookie时效太短，只能弃坑\n其他脚本欢迎了解：https://github.com/toulanboy/scripts")
      }
    })
  })
}

// prettier-ignore, @chavyleung
function Env(t) { this.name = t, this.logs = [], this.isSurge = (() => "undefined" != typeof $httpClient), this.isQuanX = (() => "undefined" != typeof $task), this.log = ((...t) => { this.logs = [...this.logs, ...t], t ? console.log(t.join("\n")) : console.log(this.logs.join("\n")) }), this.msg = ((t = this.name, s = "", i = "") => { this.isSurge() && $notification.post(t, s, i), this.isQuanX() && $notify(t, s, i), this.log("==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="), t && this.log(t), s && this.log(s), i && this.log(i) }), this.getdata = (t => this.isSurge() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : void 0), this.setdata = ((t, s) => this.isSurge() ? $persistentStore.write(t, s) : this.isQuanX() ? $prefs.setValueForKey(t, s) : void 0), this.get = ((t, s) => this.send(t, "GET", s)), this.wait = ((t, s = t) => i => setTimeout(() => i(), Math.floor(Math.random() * (s - t + 1) + t))), this.post = ((t, s) => this.send(t, "POST", s)), this.send = ((t, s, i) => { if (this.isSurge()) { const e = "POST" == s ? $httpClient.post : $httpClient.get; e(t, (t, s, e) => { s && (s.body = e, s.statusCode = s.status), i(t, s, e) }) } this.isQuanX() && (t.method = s, $task.fetch(t).then(t => { t.status = t.statusCode, i(null, t, t.body) }, t => i(t.error, t, t))) }), this.done = ((t = {}) => $done(t)) }

