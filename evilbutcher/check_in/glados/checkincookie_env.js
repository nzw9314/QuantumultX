/*
Check in for Surge by Neurogram

 - 站点签到脚本
 - 流量详情显示
 - 多站签到支持
 - 多类站点支持

使用说明：https://www.notion.so/neurogram/Check-in-0797ec9f9f3f445aae241d7762cf9d8b

关于作者
Telegram: Neurogram
GitHub: Neurogram-R

————————————————————

【机场签到Cookie版】修改自Neurogram
Modified by evilbutcher

【仓库地址】https://github.com/evilbutcher/Quantumult_X/tree/master（欢迎star🌟）

【BoxJs】https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json

【致谢】
使用Chavy的Env.js修改了原脚本，支持Quantumult X和Loon，并支持BoxJs


【此版本为尝试用Cookie签到，针对有登陆验证或跳转的机场】

⚠️【必读】⚠️【必读】⚠️【必读】⚠️
‼️此处说明过的内容将不再解答‼️

①需要将你的将机场域名加入mitm，例如cccat的域名为cccat.io，则hostname = cccat.io

②添加属于你自己的配置（重写/脚本），例如cccat👇

【Quantumult X】
----------------
[rewrite_local]
https:\/\/cccat\.io url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/glados/checkincookie_env.js
（其中https:\/\/cccat\.io需要替换为你自己的机场链接）

[task_local]
5 0 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/glados/checkincookie_env.js

【Surge】
----------------
[Script]
获取Cookie = type=http-request, pattern=https:\/\/cccat\.io, script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/glados/checkincookie_env.js
（其中https:\/\/cccat\.io需要替换为你自己的机场链接）

机场签到Cookie版 = type=cron,cronexp=5 0 * * *,wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/glados/checkincookie_env.js

【Loon】
----------------
[Script]
http-request https:\/\/cccat\.io tag=获取Cookie, script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/glados/checkincookie_env.js
（其中https:\/\/cccat\.io需要替换为你自己的机场链接）

cron "5 0 * * *" tag=机场签到Cookie版, script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/glados/checkincookie_env.js

③BoxJs中，填入机场登陆链接。

④配置好后，手动签到一次，提示Cookie获取成功，如无第二个机场即可禁用Cookie获取。

⑤此时返回BoxJs中查看，Cookie和URL都有数据，即可保存会话。如有需要再重复1-4，获取第二个机场的Cookie（记得更改url为第二个机场对应的登陆链接）。

*/
const $ = new Env("机场签到Cookie版");
const signurl = "evil_checkinurl";
const signcookie = "evil_checkincookie";

var siurl = $.getdata(signurl);
var sicookie = $.getdata(signcookie);

!(async () => {
  if (typeof $request != "undefined") {
    getCookie();
    return;
  }
  if (
    siurl == undefined ||
    siurl == "" ||
    sicookie == undefined ||
    sicookie == ""
  ) {
    $.msg(
      "机场签到Cookie版",
      "",
      "❌请在 BoxJs 检查填写是否正确或是否获取到Cookie",
      "http://boxjs.com"
    );
  }
  var name = $.getdata("evil_checkincktitle")
  if (
    name == undefined ||
    name == ""
  ) {
    name = "机场签到Cookie版"
  }
  checkin(siurl, sicookie, name);
})()
  .catch(e => {
    $.log("", `❌失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function checkin(url, cookie, name) {
  let checkinPath =
    url.indexOf("auth/login") != -1 ? "user/checkin" : "user/_checkin.php";
  var checkinurl = url.replace(/(auth|user)\/login(.php)*/g, "") + checkinPath;
  var checkinrequest = {
    url: checkinurl,
    headers: { Cookie: cookie }
  };
  console.log(checkinrequest);
  $.post(checkinrequest, (error, response, data) => {
    if (error) {
      console.log(error);
      $.msg(name, "签到失败", error);
    } else {
      if (data.match(/\"msg\"\:/)) {
        dataResults(url, cookie, JSON.parse(data).msg, name);
        console.log(JSON.parse(data).msg);
      } else {
        console.log(data);
        console.log("⚠️签到失败，某些地方出错啦");
      }
    }
  });
}

function dataResults(url, cookie, checkinMsg, name) {
  let userPath = url.indexOf("auth/login") != -1 ? "user" : "user/index.php";
  var datarequest = {
    url: url.replace(/(auth|user)\/login(.php)*/g, "") + userPath,
    headers: { Cookie: cookie }
  };
  console.log(datarequest)
  $.get(datarequest, (error, response, data) => {
    let resultData = "";
    let result = [];
    if (data.match(/theme\/malio/)) {
      let flowInfo = data.match(/trafficDountChat\s*\(([^\)]+)/);
      if (flowInfo) {
        let flowData = flowInfo[1].match(/\d[^\']+/g);
        let usedData = flowData[0];
        let todatUsed = flowData[1];
        let restData = flowData[2];
        result.push(`今日：${todatUsed}\n已用：${usedData}\n剩余：${restData}`);
      }
      let userInfo = data.match(/ChatraIntegration\s*=\s*({[^}]+)/);
      if (userInfo) {
        let user_name = userInfo[1].match(/name.+'(.+)'/)[1];
        let user_class = userInfo[1].match(/Class.+'(.+)'/)[1];
        let class_expire = userInfo[1].match(/Class_Expire.+'(.+)'/)[1];
        let money = userInfo[1].match(/Money.+'(.+)'/)[1];
        result.push(
          `用户名：${user_name}\n用户等级：lv${user_class}\n余额：${money}\n到期时间：${class_expire}`
        );
      }
      if (result.length != 0) {
        resultData = result.join("\n\n");
      }
    } else {
      let todayUsed = data.match(/>*\s*今日(已用)*[^B]+/);
      if (todayUsed) {
        todayUsed = flowFormat(todayUsed[0]);
        result.push(`今日：${todayUsed}`);
      }
      let usedData = data.match(/(Used Transfer|>过去已用|>已用|\"已用)[^B]+/);
      if (usedData) {
        usedData = flowFormat(usedData[0]);
        result.push(`已用：${usedData}`);
      }
      let restData = data.match(
        /(Remaining Transfer|>剩余流量|>可用|\"剩余)[^B]+/
      );
      if (restData) {
        restData = flowFormat(restData[0]);
        result.push(`剩余：${restData}`);
      }
      if (result.length != 0) {
        resultData = result.join("\n");
      }
    }
    let flowMsg = resultData == "" ? "流量信息获取失败" : resultData;
    $.msg(name, checkinMsg, flowMsg);
  });
}

function flowFormat(data) {
  data = data.replace(/\d+(\.\d+)*%/, "");
  let flow = data.match(/\d+(\.\d+)*\w*/);
  return flow[0] + "B";
}

function getCookie() {
  if ($request && $request.method != "OPTIONS" && $request.url.match(/check/)) {
    const sicookie = $request.headers["Cookie"];
    console.log(sicookie);
    $.setdata(sicookie, signcookie);
    $.msg("机场签到Cookie版", "", "获取Cookie成功🎉");
  }
}

//From chavyleung's Env.js
function Env(s) {
  (this.name = s),
    (this.data = null),
    (this.logs = []),
    (this.isSurge = () => "undefined" != typeof $httpClient),
    (this.isQuanX = () => "undefined" != typeof $task),
    (this.isNode = () => "undefined" != typeof module && !!module.exports),
    (this.log = (...s) => {
      (this.logs = [...this.logs, ...s]),
        s ? console.log(s.join("\n")) : console.log(this.logs.join("\n"));
    }),
    (this.msg = (s = this.name, t = "", i = "") => {
      this.isSurge() && $notification.post(s, t, i),
        this.isQuanX() && $notify(s, t, i);
      const e = [
        "",
        "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="
      ];
      s && e.push(s), t && e.push(t), i && e.push(i), console.log(e.join("\n"));
    }),
    (this.getdata = s => {
      if (this.isSurge()) return $persistentStore.read(s);
      if (this.isQuanX()) return $prefs.valueForKey(s);
      if (this.isNode()) {
        const t = "box.dat";
        return (
          (this.fs = this.fs ? this.fs : require("fs")),
          this.fs.existsSync(t)
            ? ((this.data = JSON.parse(this.fs.readFileSync(t))), this.data[s])
            : null
        );
      }
    }),
    (this.setdata = (s, t) => {
      if (this.isSurge()) return $persistentStore.write(s, t);
      if (this.isQuanX()) return $prefs.setValueForKey(s, t);
      if (this.isNode()) {
        const i = "box.dat";
        return (
          (this.fs = this.fs ? this.fs : require("fs")),
          !!this.fs.existsSync(i) &&
            ((this.data = JSON.parse(this.fs.readFileSync(i))),
            (this.data[t] = s),
            this.fs.writeFileSync(i, JSON.stringify(this.data)),
            !0)
        );
      }
    }),
    (this.wait = (s, t = s) => i =>
      setTimeout(() => i(), Math.floor(Math.random() * (t - s + 1) + s))),
    (this.get = (s, t) => this.send(s, "GET", t)),
    (this.post = (s, t) => this.send(s, "POST", t)),
    (this.send = (s, t, i) => {
      if (this.isSurge()) {
        const e = "POST" == t ? $httpClient.post : $httpClient.get;
        e(s, (s, t, e) => {
          t && ((t.body = e), (t.statusCode = t.status)), i(s, t, e);
        });
      }
      this.isQuanX() &&
        ((s.method = t),
        $task.fetch(s).then(
          s => {
            (s.status = s.statusCode), i(null, s, s.body);
          },
          s => i(s.error, s, s)
        )),
        this.isNode() &&
          ((this.request = this.request ? this.request : require("request")),
          (s.method = t),
          (s.gzip = !0),
          this.request(s, (s, t, e) => {
            t && (t.status = t.statusCode), i(null, t, e);
          }));
    }),
    (this.done = (s = {}) => (this.isNode() ? null : $done(s)));
}
