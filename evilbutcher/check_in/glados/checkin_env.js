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


自行写cron，例如 0 1 0 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/glados/checkin_env.js

*/
const $ = new Env("机场签到");
$.autoLogout = false;

if (
  $.getdata("evil_checkintitle") != undefined &&
  $.getdata("evil_checkintitle") != ""
) {
  var acc = $.getdata("evil_checkintitle");
  accounts = acc.split("，");
} else {
  $.msg("机场签到", "", "请在 BoxJs 检查填写是否正确", "http://boxjs.com");
}

if (
  $.getdata("evil_checkinlogin") != undefined &&
  $.getdata("evil_checkinlogin") != ""
) {
  var ur = $.getdata("evil_checkinlogin");
  urls = ur.split("，");
} else {
  $.msg("机场签到", "", "请在 BoxJs 检查填写是否正确", "http://boxjs.com");
}

if (
  $.getdata("evil_checkinemail") != undefined &&
  $.getdata("evil_checkinemail") != ""
) {
  var ema = $.getdata("evil_checkinemail");
  emails = ema.split("，");
} else {
  $.msg("机场签到", "", "请在 BoxJs 检查填写是否正确", "http://boxjs.com");
}

if (
  $.getdata("evil_checkinpwd") != undefined &&
  $.getdata("evil_checkinpwd") != ""
) {
  var pwd = $.getdata("evil_checkinpwd");
  passwords = pwd.split("，");
} else {
  $.msg("机场签到", "", "请在 BoxJs 检查填写是否正确", "http://boxjs.com");
}

$.autoLogout = JSON.parse($.getdata("evil_autoLogout") || $.autoLogout);

function launch() {
  for (var i in accounts) {
    let title = accounts[i];
    let url = urls[i];
    let email = emails[i];
    let password = passwords[i];
    if ($.autoLogout) {
      let logoutPath =
        url.indexOf("auth/login") != -1 ? "user/logout" : "user/logout.php";
      var logouturl = {
        url: url.replace(/(auth|user)\/login(.php)*/g, "") + logoutPath
      };
      console.log(logouturl)
      $.get(logouturl, function(error, response, data) {
        login(url, email, password, title);
      });
    } else {
      checkin(url, email, password, title);
    }
  }
  $.done();
}

launch();

function login(url, email, password, title) {
  let loginPath =
    url.indexOf("auth/login") != -1 ? "auth/login" : "user/_login.php";
  let table = {
    url: url.replace(/(auth|user)\/login(.php)*/g, "") + loginPath,
    body: `email=${email}&passwd=${password}&rumber-me=week`
  };
  console.log(table)
  $.post(table, function(error, response, data) {
    if (error) {
      console.log(error);
      $.msg(title + "登录失败", error, "");
    } else {
      if (
        JSON.parse(data).msg.match(
          /邮箱或者密码错误|Mail or password is incorrect/
        )
      ) {
        console.log(response);
        $.msg(title + "邮箱或者密码错误", "", "");
      } else {
        checkin(url, email, password, title);
      }
    }
  });
}

function checkin(url, email, password, title) {
  let checkinPath =
    url.indexOf("auth/login") != -1 ? "user/checkin" : "user/_checkin.php";
  var checkinreqest = {
    url: url.replace(/(auth|user)\/login(.php)*/g, "") + checkinPath
  };
  console.log(checkinreqest)
  $.post(checkinreqest, (error, response, data) => {
    if (error) {
      console.log(error);
      $.msg(title + "签到失败", error, "");
    } else {
      if (data.match(/\"msg\"\:/)) {
        dataResults(url, JSON.parse(data).msg, title);
      } else {
        login(url, email, password, title);
      }
    }
  });
}

function dataResults(url, checkinMsg, title) {
  let userPath = url.indexOf("auth/login") != -1 ? "user" : "user/index.php";
  var datarequest = {
    url: url.replace(/(auth|user)\/login(.php)*/g, "") + userPath
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
    $.msg(title, checkinMsg, flowMsg);
  });
}

function flowFormat(data) {
  data = data.replace(/\d+(\.\d+)*%/, "");
  let flow = data.match(/\d+(\.\d+)*\w*/);
  return flow[0] + "B";
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
