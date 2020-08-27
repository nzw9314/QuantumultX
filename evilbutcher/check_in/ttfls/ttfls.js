/*
有时间加密校验，弃坑

[rewrite_local]
https:\/\/api\.kuaidihelp\.com\/g\_tbk\/v1\/Sign\/signDetails url script-request-body ttfls.js
https:\/\/api\.kuaidihelp\.com\/g\_tbk\/v1\/Benefits\/prizeDraw url script-request-body ttfls.js

[task_local]
5 0 * * * ttfls.js

hostname = api.kuaidihelp.com
*/

const $ = new Env("天天福利社");
const signurl = "evil_signurl";
const signcookie = "evil_signcookie";
const signbody = "evil_signbody";
const lotteryurl = "evil_lotteryurl";
const lotterycookie = "evil_lotterycookie";

var siurl = $.getdata(signurl);
var sicookie = $.getdata(signcookie);
var sibody = $.getdata(signbody);
var lyurl = $.getdata(lotteryurl);
var lycookie = $.getdata(lotterycookie);

!(async () => {
  if (typeof $request != "undefined") {
    getCookie();
    return;
  }
  signin();
  //lottery();
  $.done();
})()
  .catch(e => {
    $.log("", `❌失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function signin() {
  var time = new Date().getTime();
  var time2 = sicookie.slice(-10);
  var time3 = time - 1;
  //$.log(sicookie+ "\n\n")
  var sicookie2 = sicookie.slice(0,41)
  //$.log(sicookie2)
  sicookiesend = sicookie2 + `|${time3}|${time2}`
  //$.log(sicookiesend)
  var siheader = { Cookie: sicookiesend };
  var siurlsend = siurl.replace(new RegExp(/ts\=.*?&/), `ts\=${time}&`);
  console.log(siurlsend);
  console.log(siheader);
  console.log(sibody);
  return new Promise(resolve => {
    const signinRequest = {
      url: siurl,
      headers: siheader,
      body: sibody
    };
    $.post(signinRequest, (error, response, data) => {
      var body = response.body;
      var obj = JSON.parse(body);
      console.log(obj);
      resolve();
    });
  });
}

function lottery() {
  $.wait(1000);
  var time = new Date().getTime();
  var lyurlsend = lyurl.replace(new RegExp(/ts\=.*?&/), `ts\=${time}&`);
  var lyheader = { Cookie: lycookie };
  return new Promise(resolve => {
    const lotteryRequest = {
      url: lyurlsend,
      headers: lyheader
    };
    $.post(lotteryRequest, (error, response, data) => {
      var body = response.body;
      var obj = JSON.parse(body);
      console.log(obj);
      resolve();
    });
  });
}

function getCookie() {
  
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/signDetails/)
  ) {
    const siurl = $request.url;
    //$.log(siurl);
    const sicookie = $request.headers["Cookie"];
    //$.log(sicookie);
    const sibody = $request.body;
    //$.log(sibody);
    $.setdata(siurl, signurl);
    $.setdata(sicookie, signcookie);
    $.setdata(sibody, signbody);
    $.msg("天天福利社", "", "获取签到Cookie成功🎉");
  }
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/prizeDraw/)
  ) {
    const lyurl = $request.url;
    $.log(lyurl);
    const lycookie = $request.headers["Cookie"];
    $.log(lycookie);
    $.setdata(lyurl, lotteryurl);
    $.setdata(lycookie, lotterycookie);
    $.msg("天天福利社", "", "获取抽奖Cookie成功🎉");
  }
}

//chavyleung
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
