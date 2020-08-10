/**********

  🐬主要作者：Evilbutcher （签到、cookie等主体逻辑编写）
  📕地址：https://github.com/evilbutcher/Quantumult_X/tree/master

  🐬次要作者: toulanboy （细节完善，支持多平台）
  📕地址：https://github.com/toulanboy/scripts

  🐬 另，感谢@Seafun、@jaychou、@MEOW帮忙测试及提供建议。

  evilbutcher:非专业人士制作，头一次写签到脚本，感谢@柠檬精帮忙调试代码、感谢@Seafun、@jaychou、@MEOW帮忙测试及提供建议，感谢@chavyleung模版。
  
  📌不定期更新各种签到、有趣的脚本，欢迎star🌟

  *************************
  【配置步骤，请认真阅读】
  *************************
  1. 根据你当前的软件，配置好srcipt。 Tips:由于是远程文件，记得顺便更新文件。
  2. 打开微博APP，”我的“， ”超话社区“， ”底部栏--我的“， ”关注“， 弹出通知，提示获取已关注超话链接成功。
  3. 点进一个超话页面，手动签到一次，弹出通知，提示获取超话签到链接成功。 若之前所有已经签到，请关注一个新超话进行签到。
  4. 点开底部栏“关注”，上面切换到“关注”，从下往上滑，提示获取超话签到状态成功。（如果$.check_first设为false则此步骤不需要，需将脚本放在本地修改参数。）
  5. 回到quanx等软件，关掉获取cookie的rewrite。（loon是关掉获取cookie的脚本）
  提示：如果超话过多提示频繁，可间隔半个小时以上再执行一次。

   ***************************************
  【boxjs 订阅， 可以让你修改远程文件里面的变量】
   ***************************************
   box订阅链接：https://raw.githubusercontent.com/toulanboy/scripts/master/toulanboy.boxjs.json
   订阅后，可以在box里面进行 cookie清空、通知个数、签到延迟 等设置.

  *************************
  【Surge 4.2+ 脚本配置】
  *************************
  微博超话cookie获取 = type=http-request,pattern=^https:\/\/api\.weibo\.cn\/2\/(cardlist|page\/button),script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.cookie.js,requires-body=false
  微博超话 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.js,wake-system=true,timeout=600

  [MITM]
  hostname = api.weibo.cn

  *************************
  【Loon 2.1+ 脚本配置】
  *************************
  [script]
  cron "5 0 * * *" script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.js, timeout=600, tag=微博超话
  http-request ^https:\/\/api\.weibo\.cn\/2\/(cardlist|page\/button) script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.cookie.js,requires-body=false, tag=微博超话cookie获取
  
  [MITM]
  hostname = api.weibo.cn

  *************************
  【 QX 1.0.10+ 脚本配置 】 
  *************************
  [rewrite_local]
  ^https:\/\/api\.weibo\.cn\/2\/(cardlist|page\/button) url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.cookie.js

  [task]
  5 0 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.js, tag=微博超话

  [MITM]
  hostname = api.weibo.cn

*********/

const $ = new Env(`weibo`);
const tokenurl = "evil_tokenurl";
const tokencheckinurl = "evil_tokencheckinurl";
const tokensinceurl = "evil_tokensinceurl";
const tokensinceheaders = "evil_tokensinceheaders";
const tokenheaders = "evil_tokenheaders";
const tokencheckinheaders = "evil_tokencheckinheaders";

if (
  $request &&
  $request.method != "OPTIONS" &&
  $request.url.match(/\_\-\_myfollow\&need\_head\_cards/) &&
  $request.url.match(/cardlist/)
) {
  const listurl = $request.url;
  $.log(listurl);
  const listheaders = JSON.stringify($request.headers);
  $.setdata(listurl, tokenurl);
  $.setdata(listheaders, tokenheaders);
  //$.msg("微博超话", "", "获取已关注超话列表成功✅");
  $.msg("微博超话", "✅获取已关注超话列表成功", "✨接下来，请点进一个超话进行签到。如果没有需要签到的超话，请关注新的进行签到。")
} else if (
  $request &&
  $request.method != "OPTIONS" &&
  $request.url.match(/active\_checkin/) &&
  $request.url.match(/page\/button/)
) {
  const checkinurl = $request.url;
  $.log(checkinurl);
  const checkinheaders = JSON.stringify($request.headers);
  $.setdata(checkinurl, tokencheckinurl);
  $.setdata(checkinheaders, tokencheckinheaders);
  //$.msg("微博超话", "", "获取超话签到链接成功🎉");
  $.msg("微博超话", "🎉获取超话签到链接成功", `🚨请回到底部栏“关注”，上面切换到“关注”，从下往上滑，获取签到状态。如果$.check_first设为false则Cookie获取已完成，可以关闭获取Cookie的脚本或重写。`)
} else if (
  $request &&
  $request.method != "OPTIONS" &&
  $request.url.match(/manage/) &&
  $request.url.match(/since\_id/)
) {
  const sinceurl = $request.url;
  $.log(sinceurl);
  const sinceheaders = JSON.stringify($request.headers);
  $.setdata(sinceurl, tokensinceurl);
  $.setdata(sinceheaders, tokensinceheaders);
  //$.msg("微博超话", "", "获取超话签到状态成功🆗");
  $.msg("微博超话", "🆗获取超话签到状态成功", `Cookie获取全部完成，可以关闭获取Cookie的脚本或重写。`)
}

$.done();

//chavyleung
function Env(t) {
  (this.name = t),
    (this.logs = []),
    (this.isSurge = () => "undefined" != typeof $httpClient),
    (this.isQuanX = () => "undefined" != typeof $task),
    (this.log = (...t) => {
      (this.logs = [...this.logs, ...t]),
        t ? console.log(t.join("\n")) : console.log(this.logs.join("\n"));
    }),
    (this.msg = (t = this.name, s = "", i = "") => {
      this.isSurge() && $notification.post(t, s, i),
        this.isQuanX() && $notify(t, s, i),
        this.log(
          "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="
        ),
        t && this.log(t),
        s && this.log(s),
        i && this.log(i);
    }),
    (this.getdata = t =>
      this.isSurge()
        ? $persistentStore.read(t)
        : this.isQuanX()
        ? $prefs.valueForKey(t)
        : void 0),
    (this.setdata = (t, s) =>
      this.isSurge()
        ? $persistentStore.write(t, s)
        : this.isQuanX()
        ? $prefs.setValueForKey(t, s)
        : void 0),
    (this.get = (t, s) => this.send(t, "GET", s)),
    (this.wait = (t, s = t) => i =>
      setTimeout(() => i(), Math.floor(Math.random() * (s - t + 1) + t))),
    (this.post = (t, s) => this.send(t, "POST", s)),
    (this.send = (t, s, i) => {
      if (this.isSurge()) {
        const e = "POST" == s ? $httpClient.post : $httpClient.get;
        e(t, (t, s, e) => {
          s && ((s.body = e), (s.statusCode = s.status)), i(t, s, e);
        });
      }
      this.isQuanX() &&
        ((t.method = s),
        $task.fetch(t).then(
          t => {
            (t.status = t.statusCode), i(null, t, t.body);
          },
          t => i(t.error, t, t)
        ));
    }),
    (this.done = (t = {}) => $done(t));
}
