/*
无忧行签到脚本

更新时间: 2020.07.08 14:30
脚本兼容: QuantumultX, Surge4, Loon

获取Cookie说明：「 分为五部分: AccountID | UserID | Mobile | Token | TaskID 」
1.打开无忧行App, 通知成功写入「 AccountID | UserID | Mobile | Token 」.
2.依次点击"我的" 👉 "任务中心". 通知成功写入「 TaskID 」.
3.如上述步骤全部完成, 则可以使用此签到脚本.
获取Cookie后, 请将Cookie脚本禁用并移除主机名，以免产生不必要的MITM.
脚本将在每天上午9:00执行, 您可以修改执行时间。

**********************
QuantumultX 脚本配置:
**********************
[task_local]
# 无忧行签到
0 9 * * * https://ooxx.be/js/jegotrip.js, tag=无忧行, img-url=https://ooxx.be/js/icon/jegotrip.png, enabled=true

[rewrite_local]
# 获取无忧行Cookie
https?:\/\/app.*\.jegotrip\.com\.cn\/.*getUser\? url script-response-body https://ooxx.be/js/jegotrip.js
https?:\/\/task\.jegotrip\.com\.cn\:8080\/app\/tasks\?userid url script-response-body https://ooxx.be/js/jegotrip.js

[mitm] 
hostname= app*.jegotrip.com.cn, task.jegotrip.com.cn

**********************
Surge 4.2.0+ 脚本配置:
**********************
[Script]
无忧行签到 = type=cron,cronexp=0 9 * * *,script-path=https://ooxx.be/js/jegotrip.js

获取无忧行Cookie1 = type=http-response,pattern=https?:\/\/app.*\.jegotrip\.com\.cn\/.*getUser\?,script-path=https://ooxx.be/js/jegotrip.js, requires-body=true
获取无忧行Cookie2 = type=http-response,pattern=https?:\/\/task\.jegotrip\.com\.cn\:8080\/app\/tasks\?userid,script-path=https://ooxx.be/js/jegotrip.js, requires-body=true

[MITM] 
hostname= app*.jegotrip.com.cn, task.jegotrip.com.cn

************************
Loon 2.1.0+ 脚本配置:
************************

[Script]
# 无忧行签到
cron "0 9 * * *" script-path=https://ooxx.be/js/jegotrip.js

# 获取无忧行Cookie
http-response https?:\/\/app.*\.jegotrip\.com\.cn\/.*getUser\? script-path=https://ooxx.be/js/jegotrip.js, requires-body=true
http-response https?:\/\/task\.jegotrip\.com\.cn\:8080\/app\/tasks\?userid script-path=https://ooxx.be/js/jegotrip.js, requires-body=true

[Mitm] 
hostname= app*.jegotrip.com.cn, task.jegotrip.com.cn

*/
const $ = vinewx("JegoTrip",true);
const appName = `无忧行`;
const accountid = $.read("accountid");
const userid = $.read("userid");
const mobile = $.read("mobile");
const token = $.read("token");
const taskid = $.read("taskid");
const headers = {
    "Accept-Encoding": "gzip, deflate",
    "Origin": "http://task.jegotrip.com.cn:8080",
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=utf-8",
    "Connection": "close",
    "Host": "task.jegotrip.com.cn:8080",
    "Content-Length": "89",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 source/jegotrip",
    "Accept-Language": "en-us",
    "Referer": "http://task.jegotrip.com.cn:8080/task/index.html"
};

if (typeof $request != "undefined") {
  GetCookie()
} else if (accountid && mobile && userid && taskid && token) {
  Status()
} else {
  $.notify(appName, "签到失败：请先获取Cookie⚠️", "")
}


function Status() {
  delete headers["Origin", "Content-Type", "Content-Length"];
  const url = `http://task.jegotrip.com.cn:8080/app/tasks?userid=${userid}`;
  const request = {
      url: url,
      headers: headers,
  };

  $.get(request)
    .then((resp) => {
      const data = resp.body;
      let res = JSON.parse(data.replace(/\[|]/g,''));
      let list = res.rtn.tasks["日常任务"];
      let status = list.triggerAction;
      if (status.indexOf("已签到") >= 0) {
        info = `签到失败：今日已签到‼️`;
        Total(info);
      } else {
        let coins = list.credits
        Checkin(coins);
      }
      $.log("Status body: \n" + data)
    })
    .catch((err) => {
      $.notify(appName, "状态获取失败⚠️", JSON.stringify(err))
      $.log(`状态获取失败⚠️\n ${JSON.stringify(err)}`)
    });
}


function Checkin(coins) {
  const url = "http://task.jegotrip.com.cn:8080/app/sign";
  const body = `{
      "userid":"${userid}",
      "taskId":"${taskid}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };

  $.post(request)
    .then((resp) => {
      const data = resp.body;
      if (data.indexOf("true") >= 0) {
        info = `签到成功：无忧币 +${coins}🎉`;
        VideoTask(info);
        $.log("\nCheckin body: \n" + data)
      }
    })
    .catch((err) => {
      $.notify(appName, "签到失败⚠️", JSON.stringify(err))
      $.log(`签到失败⚠️\n ${JSON.stringify(err)}`)
    });
}


function VideoTask(info) {
  const url = "https://uds-i.cmishow.com:1443/uds/cloud/watch/update?version=1";
  delete headers["Content-Length"];
  headers["Accept-Encoding"] = "gzip, deflate, br";
  headers["Origin"] = "https://ishow.jegotrip.com.cn";
  headers["Connection"] = "keep-alive";
  headers["Host"] = "uds-i.cmishow.com:1443";
  headers["Referer"] = "https://ishow.jegotrip.com.cn/freeStyleTourism/detail";
  const body = `{
      "userId":"${accountid}",
      "userWatchTime":"10.0",
      "accountId":"${mobile}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };

  $.post(request)
    .then((resp) => {
      const data = resp.body;
      if (data.indexOf("update success") >= 0) {
        $.log("\n视频任务成功🎉\nVideoTask body: \n" + data)
        Exchange(headers,info)
      } else {
      }
    })
    .catch((err) => {
      $.notify(appName, "视频任务失败⚠️", JSON.stringify(err))
      $.log(`视频任务失败⚠️\n ${JSON.stringify(err)}`)
    });
}


function Exchange(headers,info) {
  const url = "https://uds-i.cmishow.com:1443/uds/cloud/watch/exchange?version=1";
  headers["Referer"] = "https://ishow.jegotrip.com.cn/freeStyleTourism/activity";
  const body = `{
      "userId":"${accountid}",
      "exchangeTime":10,
      "exchangeNum":10,
      "accountId":"${mobile}"
  }`;
  const request = {
      url: url,
      headers: headers,
      body: body
  };

  $.post(request)
    .then((resp) => {
      const data = resp.body;
      if (data.indexOf("exchangeNum") >= 0) {
        $.log("\n兑换成功🎉\nExchange body: \n" + data)
        info += "\n视频任务：无忧币 +10🎉"
      } else {
        $.log("\n兑换失败‼️\nExchange body: \n" + data)
        res = JSON.parse(data.replace(".",""));
        info += "\n视频任务：" + res.mes + "‼️"
      }
      Total(info)
    })
    .catch((err) => {
      $.notify(appName, "兑换失败⚠️", JSON.stringify(err))
      $.log(`兑换失败⚠️\n ${JSON.stringify(err)}`)
    });
}


function Total(info) {
  const url = `https://app.jegotrip.com.cn/api/service/user/v1/getUserAssets?lang=zh_cn&token=${token}`;
  const body = `{"token":"${token}"}`;
  headers["Accept-Encoding"] = "gzip, deflate, br";
  headers["Connection"] = "keep-alive";
  headers["Content-Length"] = "44";
  headers["Host"] = "app.jegotrip.com.cn";
  const request = {
      url: url,
      headers: headers,
      body: body
  };

  $.post(request)
    .then((resp) => {
      const data = resp.body;
      let res = JSON.parse(data);
      let total = res.body.tripCoins;
      info += `\n无忧币总计：${total}💰`;
      $.log("\nTotal body: \n" + data)
      $.notify(appName, "", info)
    })
    .catch((err) => {
      $.notify(appName, "信息获取失败⚠️", JSON.stringify(err))
      $.log(`信息获取失败⚠️\n ${JSON.stringify(err)}`)
    });
    $.done();
}


function GetCookie() {
  if ($request.method != 'OPTIONS' && $response.body && $request.url.match(/userid/)) {
    var body = JSON.parse($response.body.replace(/\[|]/g,''));
    var taskid = body.rtn.tasks["日常任务"].id;
    if ($.read("taskid")) {
      if ($.read("taskid") !== taskid) {
        $.write(taskid, "taskid");
        if ($.read("taskid") !== taskid) {
          info = "更新TaskID失败‼️";
        } else {
          info = "更新TaskID成功 🎉";
        }
      }
    } else {
      $.write(taskid, "taskid");
      if ($.read("taskid") !== taskid) {
        info = "首次写入TaskID失败‼️";
      } else {
        info = "首次写入TaskID成功 🎉";
      }
    }
    if (typeof info != "undefined") {
      $.notify(appName, "", info)
    }
  }

  if ($request.method != 'OPTIONS' && $response.body && $request.url.match(/getUser?/)) {
    var body = JSON.parse($response.body);
    var res = body.body;
    var accountid = res["user_id"];
    var userid = res["open_id"];
    var mobile = res["mobile"];
    var regex = /token=([A-Za-z0-9]+)/;
    var token = regex.exec($request.url)[1];
    var info = "获取Cookie...";
    if ($.read("accountid")) {
      if ($.read("accountid") !== accountid) {
        $.write(accountid, "accountid");
        if ($.read("accountid") !== accountid) {
          info = "更新AccountID失败‼️";
        } else {
          info = "更新AccountID成功 🎉";
        }
      }
    } else {
      $.write(accountid, "accountid");
      if ($.read("accountid") !== accountid) {
        info = "首次写入AccountID失败‼️";
      } else {
        info = "首次写入AccountID成功 🎉";
      }
    }

    if ($.read("userid")) {
      if ($.read("userid") !== userid) {
        $.write(userid, "userid");
        if ($.read("userid") !== userid) {
          info += "\n更新UserID失败‼️";
        } else {
          info += "\n更新UserID成功 🎉";
        }
      }
    } else {
      $.write(userid, "userid");
      if ($.read("userid") !== userid) {
        info += "\n首次写入UserID失败‼️";
      } else {
        info += "\n首次写入UserID成功 🎉";
      }
    }

    if ($.read("mobile")) {
      if ($.read("mobile") !== mobile) {
        $.write(mobile, "mobile");
        if ($.read("mobile") !== mobile) {
          info += "\n更新Mobile号码失败‼️";
        } else {
          info += "\n更新Mobile号码成功 🎉";
        }
      }
    } else {
      $.write(mobile, "mobile");
      if ($.read("mobile") !== mobile) {
        info += "\n首次写入Mobile号码失败‼️";
      } else {
        info += "\n首次写入Mobile号码成功 🎉";
      }
    }

    if ($.read("token")) {
      if ($.read("token") !== token) {
        $.write(token, "token");
        if ($.read("token") !== token) {
          info += "\n更新Token失败‼️";
        } else {
          info += "\n更新Token成功 🎉";
        }
      }
    } else {
      $.write(token, "token");
      if ($.read("token") !== token) {
        info += "\n首次写入Token失败‼️";
      } else {
        info += "\n首次写入Token成功 🎉";
      }
    }
    if (info != "获取Cookie...") {
      $.notify(appName, "", info)
    }
  }

  $.done();
}

// prettier-ignore
// OpenAPI from Peng-YM
/*********************************** API *************************************/
function vinewx(t="untitled",s=!1){return new class{constructor(t,s){this.name=t,this.debug=s,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>this.isNode?{request:"undefined"!=typeof $request?void 0:require("request"),fs:require("fs")}:null)(),this.cache=this.initCache(),this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`),Promise.prototype.delay=function(t){return this.then(function(s){return((t,s)=>new Promise(function(e){setTimeout(e.bind(null,s),t)}))(t,s)})}}get(t){return this.isQX?("string"==typeof t&&(t={url:t,method:"GET"}),$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.get(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}post(t){return this.isQX?("string"==typeof t&&(t={url:t}),t.method="POST",$task.fetch(t)):new Promise((s,e)=>{this.isLoon||this.isSurge?$httpClient.post(t,(t,i,o)=>{t?e(t):s({status:i.status,headers:i.headers,body:o})}):this.node.request.post(t,(t,i,o)=>{t?e(t):s({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX)return JSON.parse($prefs.valueForKey(this.name)||"{}");if(this.isLoon||this.isSurge)return JSON.parse($persistentStore.read(this.name)||"{}");if(this.isNode){const t=`${this.name}.json`;return this.node.fs.existsSync(t)?JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(t,JSON.stringify({}),{flag:"wx"},t=>console.log(t)),{})}}persistCache(){const t=JSON.stringify(this.cache);this.log(`FLUSHING DATA:\n${t}`),this.isQX&&$prefs.setValueForKey(t,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(t,this.name),this.isNode&&this.node.fs.writeFileSync(`${this.name}.json`,t,{flag:"w"},t=>console.log(t))}write(t,s){this.log(`SET ${s} = ${JSON.stringify(t)}`),this.cache[s]=t,this.persistCache()}read(t){return this.log(`READ ${t} ==> ${JSON.stringify(this.cache[t])}`),this.cache[t]}delete(t){this.log(`DELETE ${t}`),delete this.cache[t],this.persistCache()}notify(t,s,e,i){const o="string"==typeof i?i:void 0,n=e+(null==o?"":`\n${o}`);this.isQX&&(void 0!==o?$notify(t,s,e,{"open-url":o}):$notify(t,s,e,i)),this.isSurge&&$notification.post(t,s,n),this.isLoon&&$notification.post(t,s,e),this.isNode&&(this.isJSBox?require("push").schedule({title:t,body:s?s+"\n"+e:e}):console.log(`${t}\n${s}\n${n}\n\n`))}log(t){this.debug&&console.log(t)}info(t){console.log(t)}error(t){console.log("ERROR: "+t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){this.isQX||this.isLoon||this.isSurge?$done(t):this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=t.headers,$context.statusCode=t.statusCode,$context.body=t.body)}}(t,s)}
/*****************************************************************************/
