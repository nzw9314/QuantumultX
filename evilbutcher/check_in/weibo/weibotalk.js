/**********

  🐬主要作者：evilbutcher （签到、cookie等主体逻辑编写）
  📕地址：https://github.com/evilbutcher/Quantumult_X/tree/master

  🐬次要作者: toulanboy （细节完善，支持多平台）
  📕地址：https://github.com/toulanboy/scripts

 【致谢】
  非专业人士制作，头一次写签到脚本，感谢@柠檬精帮忙调试代码、感谢@Seafun、@jaychou、@MEOW帮忙测试及提供建议，感谢@chavyleung模版。
  
  📌不定期更新各种签到、有趣的脚本，欢迎star🌟

  *************************
  【配置步骤，请认真阅读】
  *************************
  1. 根据你当前的软件，配置好srcipt。 Tips:由于是远程文件，记得顺便更新文件。
  2. 打开微博APP，"我的"， "超话社区"， "底部栏--我的"， "关注"， 弹出通知，提示获取已关注超话链接成功。
  3. 点进一个超话页面，手动签到一次，弹出通知，提示获取超话签到链接成功。 若之前所有已经签到，请关注一个新超话进行签到。
  4. 点开底部栏"关注"，上面切换到"关注"，从下往上滑，提示获取超话签到状态成功。（如果$.check_first设为false则此步骤不需要，需将脚本放在本地修改参数。）
  5. 回到quanx等软件，关掉获取cookie的rewrite。（loon是关掉获取cookie的脚本）
  提示：如果超话过多提示频繁，可间隔半个小时以上再执行一次。

   ***************************************
  【BoxJs 订阅， 可以让你修改远程文件里面的变量】
   ***************************************
   BoxJs订阅链接：https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json
   订阅后，可以在box里面进行 cookie清空、通知个数、签到延迟 等设置.

  *************************
  【Surge 4.2+ 脚本配置】
  *************************
  微博超话cookie获取 = type=http-request,pattern=^https:\/\/api\.weibo\.cn\/2\/(cardlist|page\/button),script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.cookie.js,requires-body=false
  微博超话 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.js,wake-system=true,timeout=600

  *************************
  【Loon 2.1+ 脚本配置】
  *************************
  [script]
  cron "5 0 * * *" script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.js, timeout=600, tag=微博超话
  http-request ^https:\/\/api\.weibo\.cn\/2\/(cardlist|page\/button) script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.cookie.js,requires-body=false, tag=微博超话cookie获取

  *************************
  【 QX 1.0.10+ 脚本配置 】 
  *************************
  [rewrite_local]
  ^https:\/\/api\.weibo\.cn\/2\/(cardlist|page\/button) url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.cookie.js

  [task]
  5 0 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/weibo/weibotalk.js, tag=微博超话


  【All App MitM】
  hostname = api.weibo.cn

*********/

const $ = new Env("微博超话");

//可自定参数👇
$.time = 1000; //签到间隔默认1s
$.delete_cookie = false; //如果需要清除Cookie请改为true，清除后改为false
$.msg_max_num = 30; //自定义超话页面数量
$.check_first = true; //true为先检查签到状态，再签到；false则为直接签到

//debug选项
const debugurl = false;
const debugstatus = false;
const debugcheckin = false;

if ($.getdata("wb_delete_cookie") != undefined) {
  if (
    $.getdata("wb_delete_cookie") == true ||
    $.getdata("wb_delete_cookie") == "true"
  )
    $.delete_cookie = true;
  else $.delete_cookie = false;
}
if ($.getdata("wb_msg_max_num") != undefined) {
  if ($.getdata("wb_msg_max_num") != "")
    $.msg_max_num = $.getdata("wb_msg_max_num") * 1;
}
if ($.getdata("wb_request_time") != undefined) {
  if ($.getdata("wb_request_time") != "")
    $.time = $.getdata("wb_request_time") * 1;
}
if ($.getdata("wb_check_first") != undefined) {
  if (
    $.getdata("wb_check_first") == true ||
    $.getdata("wb_check_first") == "true"
  )
    $.check_first = true;
  else $.check_first = false;
}

const tokenurl = "evil_tokenurl";
const tokencheckinurl = "evil_tokencheckinurl";
const tokenheaders = "evil_tokenheaders";
const tokensinceurl = "evil_tokensinceurl";
const tokensinceheaders = "evil_tokensinceheaders";
const tokencheckinheaders = "evil_tokencheckinheaders";
var allnumber;
var pagenumber;
var listurl = $.getdata(tokenurl);
var listheaders = $.getdata(tokenheaders);
var checkinurl = $.getdata(tokencheckinurl);
var checkinheaders = $.getdata(tokencheckinheaders);
var sinceurl = $.getdata(tokensinceurl);
var sinceheaders = $.getdata(tokensinceheaders);
$.message = [];
$.name_list = [];
$.id_list = [];
$.sign_status = [];
$.sinceinserturl = [];
$.successNum = 0;
$.failNum = 0;
$.stopNum = 0;

!(async () => {
  if ($.delete_cookie) {
    $.setdata("", tokenurl);
    $.setdata("", tokenheaders);
    $.setdata("", tokencheckinurl);
    $.setdata("", tokencheckinheaders);
    $.setdata("", tokensinceurl);
    $.setdata("", tokensinceheaders);
    $.msg(
      "微博超话",
      "✅Cookie清除成功",
      "请将脚本内deletecookie改为false，按照流程重新获取Cookie。"
    );
    return;
  }
  if ($.check_first) {
    if (
      listurl == undefined ||
      listheaders == undefined ||
      checkinurl == undefined ||
      checkinheaders == undefined ||
      sinceurl == undefined ||
      sinceheaders == undefined ||
      listurl == "" ||
      listheaders == "" ||
      checkinurl == "" ||
      checkinheaders == "" ||
      sinceurl == "" ||
      sinceheaders == ""
    ) {
      $.msg(
        `微博超话`,
        "🚫检测到没有cookie或者cookie不完整",
        "请认真阅读配置流程，并重新获取cookie。"
      );
      return;
    }
  } else {
    if (
      listurl == undefined ||
      listheaders == undefined ||
      checkinurl == undefined ||
      checkinheaders == undefined ||
      listurl == "" ||
      listheaders == "" ||
      checkinurl == "" ||
      checkinheaders == ""
    ) {
      $.msg(
        `微博超话`,
        "🚫检测到没有cookie或者cookie不完整",
        "请认真阅读配置流程，并重新获取cookie。"
      );
      return;
    }
  }
  await getnumber();
  if ($.check_first) {
    var firsturl = sinceurl.replace(
      new RegExp("&since_id=.*?&moduleID"),
      "&moduleID"
    );
    $.sinceinserturl.push(firsturl);
    for (var i = 0; i <= pagenumber - 2; i++) {
      await geturl(i);
    }
    for (i = 0; i < pagenumber; i++) {
      await getSignStatus(i);
    }
    for (i in $.name_list) {
      await checkin($.id_list[i], $.name_list[i], $.sign_status[i]);
      $.wait($.time);
      if ($.stopNum != 0) {
        $.msg("微博超话", "🚨检测到Cookie失效，脚本已自动停止");
        console.log("🚨检测到Cookie失效，脚本已自动停止");
        return;
      }
    }
  } else {
    for (i = 1; i <= pagenumber; i++) {
      await getid(i);
    }
    for (i in $.name_list) {
      await checkin($.id_list[i], $.name_list[i], false);
      $.wait($.time);
      if ($.stopNum != 0) {
        $.msg("微博超话", "🚨检测到Cookie失效，脚本已自动停止");
        console.log("🚨检测到Cookie失效，脚本已自动停止");
        return;
      }
    }
  }
  output();
})()
  .catch(e => {
    $.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function output() {
  $.this_msg = ``;
  for (var i = 0; i < $.message.length; ++i) {
    if (i && i % $.msg_max_num == 0) {
      $.msg(
        `${$.name}: 成功${$.successNum}个，失败${$.failNum}个`,
        `当前第${Math.ceil(i / $.msg_max_num)}页 ，共${Math.ceil(
          $.message.length / $.msg_max_num
        )}页`,
        $.this_msg
      );
      $.this_msg = "";
    }
    $.this_msg += `${$.message[i]}\n`;
  }
  if ($.message.length % $.msg_max_num != 0) {
    $.msg(
      `${$.name}: 成功${$.successNum}个，失败${$.failNum}个`,
      `当前第${Math.ceil(i / $.msg_max_num)}页 ，共${Math.ceil(
        $.message.length / $.msg_max_num
      )}页`,
      $.this_msg
    );
  }
}

function getnumber() {
  console.log($.name + "  正在刷新链接");
  var idrequest = {
    url: listurl,
    header: listheaders
  };
  return new Promise(resolve => {
    try {
      $.get(idrequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 418) {
          console.log(`太频繁啦，获取超话信息失败，请稍后再试。`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.cardlistInfo.total == undefined ||
            obj.cardlistInfo.total == null
          ) {
            $.msg(
              $.name,
              "🚨获取超话页数出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            $.pagenumber = 0;
            resolve();
            return;
          }
          if (debugurl) console.log(obj);
          allnumber = obj.cardlistInfo.total;
          console.log(
            "当前已关注超话" +
              allnumber +
              "个(数量存在延迟，仅参考，以签到执行为准)"
          );
          pagenumber = Math.ceil(allnumber / 20);
          resolve();
        } else {
          console.log("请将以下内容发送给作者\n");
          console.log(response);
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function geturl(i) {
  var j = i + 2;
  var getlisturl = listurl.replace(
    new RegExp("&page=.*?&"),
    "&page=" + j + "&"
  );
  if (debugurl) console.log(getlisturl);
  var idrequest = {
    url: getlisturl,
    header: listheaders
  };
  return new Promise(resolve => {
    try {
      $.get(idrequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 418) {
          console.log(`太频繁啦，获取超话信息失败，请稍后再试。`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.cards[0] == undefined ||
            obj.cards[0] == null
          ) {
            $.msg(
              $.name,
              "🚨获取超话URL出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            resolve();
            return;
          }
          var group = obj.cards[0]["card_group"];
          if (group == undefined) return;
          var insertid = group[0].scheme.slice(33, 71);
          if (debugurl) console.log(insertid);
          var inserturl = sinceurl
            .replace(
              new RegExp("follow%22%3A%221022%3A.*?%22"),
              "follow%22%3A%221022%3A" + insertid + "%22"
            )
            .replace(new RegExp("page%22%3A.*?%7D"), "page%22%3A" + j + "%7D");
          $.sinceinserturl.push(inserturl);
          if (debugurl) console.log($.sinceinserturl);
          resolve();
        } else {
          console.log("请将以下内容发送给作者\n");
          console.log(response);
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function getSignStatus(i) {
  $.log(`正在获取第${i + 1}页签到状态`);
  if (debugstatus) console.log("第" + i + "个 " + $.sinceinserturl[i]);
  var sincerequest = {
    url: $.sinceinserturl[i],
    header: sinceheaders
  };
  return new Promise(resolve => {
    try {
      $.get(sincerequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 418) {
          $.message.push(`太频繁啦，获取第${i}页超话及签到状态失败`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.cards[0] == undefined ||
            obj.cards[0] == null
          ) {
            $.msg(
              $.name,
              "🚨获取签到状态出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            resolve();
            return;
          }
          var group = obj.cards[0]["card_group"];
          for (var j = 0; j < group.length; j++) {
            var name = group[j]["title_sub"];
            if (name == undefined) {
              continue;
            }
            $.name_list.push(name);
            var status = group[j].buttons[0].name;
            if (status == "签到") {
              console.log(`${name} 未签到`);
              $.sign_status.push(false);
            } else {
              console.log(`${name} 已签到`);
              $.sign_status.push(true);
            }
            var id = group[j].scheme.slice(33, 71);
            $.id_list.push(id);
          }
          if (debugstatus) {
            console.log($.name_list);
            console.log($.sign_status);
            console.log($.id_list);
          }
          resolve();
        } else {
          console.log("请将以下内容发送给作者\n");
          console.log(response);
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

//获取超话签到id
function getid(page) {
  $.log(`正在获取第${page}页超话id`);
  var getlisturl = listurl.replace(
    new RegExp("&page=.*?&"),
    "&page=" + page + "&"
  );
  var idrequest = {
    url: getlisturl,
    header: listheaders
  };
  return new Promise(resolve => {
    try {
      $.get(idrequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 418) {
          $.message.push(`太频繁啦，获取第${i}页超话及签到状态失败`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.cards[0] == undefined ||
            obj.cards[0] == null
          ) {
            $.msg(
              $.name,
              "🚨获取超话ID出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            resolve();
            return;
          }
          var group = obj.cards[0]["card_group"];
          var number = group.length;
          for (var i = 0; i < number; i++) {
            var name = group[i]["title_sub"];
            $.name_list.push(name);
            var id = group[i].scheme.slice(33, 71);
            $.id_list.push(id);
            if (debugstatus) {
              console.log(name);
              console.log(id);
            }
          }
          resolve();
        } else {
          console.log("请将以下内容发送给作者\n");
          console.log(response);
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

//签到
function checkin(id, name, isSign = false) {
  var idname = name.replace(/超话/, "");
  if (isSign == true) {
    $.successNum += 1;
    $.message.push(`【${idname}】：✨今天已签到`);
    console.log(`【${idname}】执行签到：跳过`);
    return;
  }
  var sendcheckinurl = checkinurl
    .replace(new RegExp("&fid=.*?&"), "&fid=" + id + "&")
    .replace(new RegExp("pageid%3D.*?%26"), "pageid%3D" + id + "%26");
  var checkinrequest = {
    url: sendcheckinurl,
    header: checkinheaders
  };
  return new Promise(resolve => {
    try {
      $.get(checkinrequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (debugcheckin) console.log(response);
        if (response.statusCode == 418) {
          $.failNum += 1;
          $.message.push(`【${idname}】：太频繁啦，请稍后再试`);
          console.log(`【${idname}】执行签到：太频繁啦，请稍后再试`);
        } else if (response.statusCode == 511) {
          $.failNum += 1;
          $.message.push(`【${idname}】：需要身份验证，请稍后再试`);
          console.log(`【${idname}】执行签到：需要身份验证，请稍后再试`);
        } else if (response.statusCode == 502) {
          $.failNum += 1;
          $.message.push(`【${idname}】：无效响应，请稍后再试`);
          console.log(`【${idname}】执行签到：无效响应，请稍后再试`);
        } else if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.result == null ||
            obj.result == undefined
          ) {
            $.stopNum += 1;
            $.msg(
              $.name,
              "🚨签到出现错误或接口返回数据错误",
              `⚠️原因：${obj.errmsg}\n👨‍💻作者提示：若为登陆保护等问题可尝试重新获取Cookie。`
            );
            resolve();
            return;
          }
          if (debugcheckin) console.log(obj);
          var result = obj.result;
          if (debugcheckin) console.log(result);
          if (result == 1 || result == 382004) {
            $.successNum += 1;
          } else {
            $.failNum += 1;
          }
          if (result == 1) {
            $.message.push(`【${idname}】：✅${obj.button.name}`);
            console.log(`【${idname}】执行签到：${obj.button.name}`);
          } else if (result == 382004) {
            $.message.push(`【${idname}】：✨今天已签到`);
            console.log(`【${idname}】执行签到：${obj.error_msg}`);
          } else if (result == 388000) {
            $.message.push(`【${idname}】：需要拼图验证⚠️`);
            console.log(`【${idname}】执行签到：需要拼图验证⚠️`);
            if (debugcheckin) console.log(response);
          } else if (result == 382010) {
            $.message.push(`【${idname}】：超话不存在⚠️`);
            console.log(`【${idname}】执行签到：超话不存在⚠️`);
            if (debugcheckin) console.log(response);
          } else if (obj["errno"] == -100) {
            $.stopNum += 1;
            $.message.push(`【${idname}】：签到失败，请重新签到获取Cookie⚠️`);
            console.log(
              `【${idname}】执行签到：签到失败，请重新签到获取Cookie⚠️\n${response}`
            );
            if (debugcheckin) console.log(response);
          } else {
            $.message.push(`【${idname}】：未知错误⚠️`);
            console.log(`【${idname}】执行签到：未知错误⚠️`);
            console.log("请将以下内容发送给作者\n");
            console.log(response);
          }
          resolve();
        } else {
          $.failNum += 1;
          console.log("请将以下内容发送给作者\n");
          console.log(response);
          resolve();
        }
      });
    } catch (e) {
      console.log("请将以下内容发给作者\n");
      console.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
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
