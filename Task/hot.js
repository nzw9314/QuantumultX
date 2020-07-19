/*

热门监控@evilbutcher，仓库地址：https://github.com/evilbutcher/Quantumult_X/tree/master

感谢@南叔提供反馈和测试

⚠️【使用方法】
------------------------------------------------------------------------------
1、按照客户端配置好rewrite和mitm。
2、打开微博热搜、知乎热榜、百度风云榜（http://top.baidu.com/m/#buzz/1/515）、B站日榜（https://app.bilibili.com/x/v2/rank/region?rid=0）获取Cookie即可。（B站榜单对应关系：0全站，1动画，3音乐，4游戏，5娱乐，36科技，119鬼畜，129舞蹈）
3、本地直接修改关键词，远程可通过BoxJs修改关键词，有关键词更新时会通知，否则不通知。
4、可选择是否合并同一榜单的全部通知。
5、可选择匹配关键词或者直接获取热搜最新内容，并自定义数量。
6、B站榜单独立推送时可显示封面。

本地脚本keyword设置关键词，注意是英文逗号；BoxJs是用中文逗号。

【BoxJs】订阅链接
------------------------------------------------------------------------------
https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json
订阅后，可以在BoxJs里面修改关键词，设置清除Cookie、开启对应榜单等。

⚠️BoxJs设置注意事项⚠️
#微博热搜检测数量设置：建议最大为8，设置检测数量太多显示不完全，内容过多。其他榜单最大检测数量暂无建议，自行决定即可。

#关键词：对所有榜单生效，榜单内无关键词匹配不会通知。

#忽略关键词推送最新内容：打开，将无视关键词，直接获取设定检测数量的对应榜单内容。

#消息分开推送：关闭，同一榜单的内容将整合为一条通知，可直接下拉或在通知面板长按通知展开，点击链接跳转详情；开启，每条内容分开推送，推送将会分为多条通知。关键词匹配模式下可打开，获取最新内容时建议关闭。

仅测试Quantumult X、Loon，理论上也支持Surge（没surge无法测试）。

【Surge】配置
------------------------------------------------------------------------------
热门监控微博cookie获取 = type=http-request,pattern=https:\/\/api\.weibo\.cn\/2\/page ,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false
热门监控知乎cookie获取 = type=http-request,pattern=https:\/\/api\.zhihu\.com\/topstory\/hot-lists\/total ,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false
热门监控百度cookie获取 = type=http-request,pattern=http:\/\/top\.baidu\.com\/mobile_v2\/buzz ,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false
热门监控B站cookie获取 = type=http-request,pattern=https:\/\/app\.bilibili\.com\/x\/v2\/rank\/region ,script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false
热门监控 = type=cron,cronexp="30 0 8-22/2 * * *",script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,wake-system=true,timeout=600

[MITM]
hostname = api.weibo.cn, api.zhihu.com, top.baidu.com, app.bilibili.com

【Loon】配置
----------------------------------------------------------------------------
[script]
cron "30 0 8-22/2 * * *" script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js, timeout=600, tag=热门监控
http-request https:\/\/api\.weibo\.cn\/2\/page script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false, tag=热门监控微博cookie获取
http-request https:\/\/api\.zhihu\.com\/topstory\/hot-lists\/total script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false, tag=热门监控知乎cookie获取
http-request http:\/\/top\.baidu\.com\/mobile_v2\/buzz script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false, tag=热门监控百度cookie获取
http-request https:\/\/app\.bilibili\.com\/x\/v2\/rank\/region script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,requires-body=false, tag=热门监控B站cookie获取
  
[MITM]
hostname = api.weibo.cn, api.zhihu.com, top.baidu.com, app.bilibili.com

【Quantumult X】配置
----------------------------------------------------------------------------
  [rewrite_local]
  https:\/\/api\.weibo\.cn\/2\/page url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js
  https:\/\/api\.zhihu\.com\/topstory\/hot-lists\/total url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js
  http:\/\/top\.baidu\.com\/mobile_v2\/buzz url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js
  https:\/\/app\.bilibili\.com\/x\/v2\/rank\/region url script-request-header https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js

  [task_local]
  30 0 8-22/2 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js, tag=热门监控

  [MITM]
  hostname = api.weibo.cn, api.zhihu.com, top.baidu.com, app.bilibili.com
*/

const $ = new Env("热门监控");
//⚠️本地自定参数修改位置⚠️
var keyword = ["中国", "万茜"]; //👈本地脚本关键词在这里设置。 ⚠️用英文逗号、英文双引号⚠️
$.deletecookie = false; //👈清除Cookie选项
$.weibo = true; //是否开启相应榜单监控
$.wbnum = 6; //自定微博热搜数量
$.zhihu = true; //是否开启相应榜单监控
$.zhnum = 6; //自定知乎热榜数量
$.baidu = true; //是否开启相应榜单监控
$.bdnum = 6; //自定百度风云榜数量
$.bilibili = true; //是否开启相应榜单监控
$.blnum = 6; //自定B站榜单数量
$.splitpush = false; //是否分开推送
$.pushnew = false; //是否忽略关键词推送最新内容
$.rid = 0; //更改B站监控榜单
//⚠️本地自定参数修改位置⚠️

const url = "evil_hotsearchurl";
const cookie = "evil_hotsearchcookie";
const urlzh = "evil_zhihuurl";
const cookiezh = "evil_zhihucookie";
const urlbd = "evil_baiduurl";
const cookiebd = "evil_baiducookie";
const urlbl = "evil_bilibiurl";
const cookiebl = "evil_bilibilicookie";
var siurl = $.getdata(url);
var sicookie = $.getdata(cookie);
var zhurl = $.getdata(urlzh);
var zhcookie = $.getdata(cookiezh);
var bdurl = $.getdata(urlbd);
var bdcookie = $.getdata(cookiebd);
var blurl = $.getdata(urlbl);
var blcookie = $.getdata(cookiebl);
var items = [];
var items2 = [];
var items3 = [];
var items4 = [];
var urls = [];
var urls2 = [];
var urls3 = [];
var urls4 = [];
var covers = [];
var resultwb = [];
var resultzh = [];
var resultbd = [];
var resultbl = [];
var mediaurl = [];

!(async () => {
  if (typeof $request != "undefined") {
    getCookie();
    return;
  }
  getsetting();
  if (havekeyword() == true && deletecookie() == true) {
    if ($.weibo == true) {
      if (ifwbcanrun() == true) {
        $.log("微博Cookie完整🉑️");
        await gethotsearch();
      } else {
        $.log("微博热搜Cookie未获取或不完整😫\n请获取Cookie后再试❌");
      }
    } else {
      $.log("微博热搜未获取😫");
    }
    if ($.zhihu == true) {
      if (ifzhcanrun() == true) {
        $.log("知乎Cookie完整🉑️");
        await gethotlist();
      } else {
        $.log("知乎热榜Cookie未获取或不完整😫\n请获取Cookie后再试❌");
      }
    } else {
      $.log("知乎热榜未获取😫");
    }
    if ($.baidu == true) {
      if (ifbdcanrun() == true) {
        $.log("百度Cookie完整🉑️");
        await getfylist();
      } else {
        $.log("百度风云榜Cookie未获取或不完整😫\n请获取Cookie后再试❌");
      }
    } else {
      $.log("百度风云榜未获取😫");
    }
    if ($.bilibili == true) {
      if (ifblcanrun() == true) {
        $.log("B站Cookie完整🉑️");
        await getbllist();
      } else {
        $.log("B站日榜Cookie未获取或不完整😫\n请获取Cookie后再试❌");
      }
    } else {
      $.log("B站日榜未获取😫");
    }
    output();
    final();
  }
})()
  .catch(e => {
    $.log("", `❌失败! 原因: ${e}!`, "");
  })
  .finally(() => {
    $.done();
  });

function havekeyword() {
  if (keyword.length == 0) {
    $.msg("热门监控", "", "请输入要监控的关键词🔍");
    return false;
  } else {
    return true;
  }
}

function deletecookie() {
  if ($.deletecookie == true) {
    $.setdata("", url);
    $.setdata("", cookie);
    $.setdata("", urlzh);
    $.setdata("", cookiezh);
    $.setdata("", urlbd);
    $.setdata("", cookiebd);
    $.setdata("", urlbl);
    $.setdata("", cookiebl);
    $.msg("热门监控", "", "Cookie已清除🆑");
    return false;
  }
  return true
}

function getsetting() {
  $.log("初始化，开始！");
  if (
    $.getdata("evil_wb_keyword") != undefined &&
    $.getdata("evil_wb_keyword") != ""
  ) {
    var key = $.getdata("evil_wb_keyword");
    keyword = key.split("，");
  }
  $.deletecookie = JSON.parse(
    $.getdata("evil_wb_deletecookie") || $.deletecookie
  );
  $.weibo = JSON.parse($.getdata("evil_wb") || $.weibo);
  $.zhihu = JSON.parse($.getdata("evil_zh") || $.zhihu);
  $.baidu = JSON.parse($.getdata("evil_bd") || $.baidu);
  $.bilibili = JSON.parse($.getdata("evil_bl") || $.bilibili);
  $.splitpush = JSON.parse($.getdata("evil_splitpush") || $.splitpush);
  $.pushnew = JSON.parse($.getdata("evil_pushnew") || $.pushnew);
  $.rid = $.getdata("evil_blrid") * 1 || $.rid;
  $.wbnum = $.getdata("evil_wbnum") * 1 || $.wbnum;
  $.zhnum = $.getdata("evil_zhnum") * 1 || $.zhnum;
  $.bdnum = $.getdata("evil_bdnum") * 1 || $.bdnum;
  $.blnum = $.getdata("evil_blnum") * 1 || $.blnum;
  $.log("监控关键词 " + keyword);
  $.log("获取微博热搜 " + $.weibo);
  $.log("获取知乎热榜 " + $.zhihu);
  $.log("获取百度风云榜 " + $.baidu);
  $.log("获取B站榜单 " + $.bilibili);
  $.log("独立推送消息 " + $.splitpush);
  $.log("忽略关键词获取最热内容 " + $.pushnew);
  $.log("获取微博热搜数量 " + $.wbnum + "个");
  $.log("获取知乎热榜数量 " + $.zhnum + "个");
  $.log("获取百度风云榜数量 " + $.bdnum + "个");
  $.log("获取B站日榜数量 " + $.blnum + "个\n");
}

function ifwbcanrun() {
  if (
    siurl != undefined &&
    sicookie != undefined &&
    siurl != "" &&
    sicookie != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function ifzhcanrun() {
  if (
    zhurl != undefined &&
    zhcookie != undefined &&
    zhurl != "" &&
    zhcookie != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function ifbdcanrun() {
  if (
    bdurl != undefined &&
    bdcookie != undefined &&
    bdurl != "" &&
    bdcookie != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function ifblcanrun() {
  if (
    blurl != undefined &&
    blcookie != undefined &&
    blurl != "" &&
    blcookie != ""
  ) {
    return true;
  } else {
    return false;
  }
}

function gethotsearch() {
  $.log("开始获取微博榜单...");
  return new Promise(resolve => {
    try {
      const wbRequest = {
        url: siurl,
        headers: sicookie
      };
      $.get(wbRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          var group = obj.cards[0]["card_group"];
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].desc;
            var urllong = group[i].scheme;
            var content = urllong.match(new RegExp(/q=.*?&isnewpage/));
            var con = JSON.stringify(content);
            var newcon = con.slice(2, -12);
            var url = "sinaweibo://searchall?" + newcon;
            items.push(item);
            urls.push(url);
          }
          $.log("微博热搜获取成功✅\n" + items);
          if ($.pushnew == false) {
            for (var j = 0; j < keyword.length; j++) {
              findkeywordurl(
                "微博",
                resultwb,
                $.wbnum,
                keyword[j],
                items,
                urls
              );
            }
          } else {
            findkeywordurl("微博", resultwb, $.wbnum, keyword[j], items, urls);
          }
          resolve();
        } else {
          $.log("获取微博热搜出现错误❌以下详情：\n" + response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取微博热搜出现错误❌原因：\n" + e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function gethotlist() {
  $.log("开始获取知乎榜单...");
  return new Promise(resolve => {
    try {
      const zhRequest = {
        url: zhurl,
        headers: zhcookie
      };
      $.get(zhRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          var group = obj.data;
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].target.title;
            var oriurl = group[i].target.url;
            var url = oriurl.replace("https://api.zhihu.com/", "zhihu://");
            items2.push(item);
            urls2.push(url);
          }
          $.log("知乎热榜获取成功✅\n" + items2);
          if ($.pushnew == false) {
            for (var j = 0; j < keyword.length; j++) {
              findkeywordurl(
                "知乎",
                resultzh,
                $.zhnum,
                keyword[j],
                items2,
                urls2
              );
            }
          } else {
            findkeywordurl(
              "知乎",
              resultzh,
              $.zhnum,
              keyword[j],
              items2,
              urls2
            );
          }
          resolve();
        } else {
          $.log("获取知乎热榜出现错误❌以下详情：\n" + response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取知乎热榜出现错误❌原因：\n" + e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function getfylist() {
  $.log("开始获取百度榜单...");
  return new Promise(resolve => {
    try {
      const bdRequest = {
        url: bdurl,
        headers: bdcookie
      };
      $.get(bdRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          var group = obj.result.descs;
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].content.data[0].title;
            var url = group[i].content.data[0].originlink;
            items3.push(item);
            urls3.push(url);
          }
          $.log("百度风云榜获取成功✅\n" + items3);
          if ($.pushnew == false) {
            for (var j = 0; j < keyword.length; j++) {
              findkeywordurl(
                "百度",
                resultbd,
                $.bdnum,
                keyword[j],
                items3,
                urls3
              );
            }
          } else {
            findkeywordurl(
              "百度",
              resultbd,
              $.bdnum,
              keyword[j],
              items3,
              urls3
            );
          }
          resolve();
        } else {
          $.log("获取百度风云榜出现错误❌以下详情：\n" + response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取百度风云榜出现错误❌原因：\n" + e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function getbllist() {
  $.log("开始获取B站日榜...");
  return new Promise(resolve => {
    try {
      const blRequest = {
        url: "https://app.bilibili.com/x/v2/rank/region?rid=" + $.rid,
        headers: blcookie
      };
      $.get(blRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          var group = obj.data;
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].title;
            var url = group[i].uri;
            var cover = group[i].cover;
            items4.push(item);
            urls4.push(url);
            covers.push(cover);
          }
          $.log("B站日榜获取成功✅\n" + items4);
          if ($.pushnew == false) {
            for (var j = 0; j < keyword.length; j++) {
              findkeywordmedia(
                "B站",
                resultbl,
                mediaurl,
                $.blnum,
                keyword[j],
                items4,
                urls4,
                covers
              );
            }
          } else {
            findkeywordmedia(
              "B站",
              resultbl,
              mediaurl,
              $.blnum,
              keyword[j],
              items4,
              urls4,
              covers
            );
          }
          resolve();
        } else {
          $.log("获取B站日榜出现错误❌以下详情:\n" + response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取B站日榜出现错误❌原因：\n" + e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function findkeywordurl(text, output, num, key, array, array2) {
  if ($.pushnew == false) {
    if ($.splitpush == false) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].indexOf(key) != -1) {
          output.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${array[i]}\n${
              array2[i]
            }`
          );
        }
      }
    } else {
      for (i = 0; i < array.length; i++) {
        if (array[i].indexOf(key) != -1) {
          output.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${array[i]}\n${
              array2[i]
            }`
          );
        }
      }
    }
  } else {
    if ($.splitpush == false) {
      for (i = 0; i < num; i++) {
        if (i == 0) {
          output.push(
            `🎉"${text}"的热门排行\n第${i + 1}名：${array[i]}\n${array2[i]}`
          );
        } else {
          output.push(`第${i + 1}名：${array[i]}\n${array2[i]}`);
        }
      }
    } else {
      for (i = 0; i < num; i++) {
        output.push(
          `🎉"${text}"的热门排行\n第${i + 1}名：${array[i]}\n${array2[i]}`
        );
      }
    }
  }
}

function findkeywordmedia(
  text,
  output,
  output2,
  num,
  key,
  array,
  array2,
  array3
) {
  if ($.pushnew == false) {
    if ($.splitpush == false) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].indexOf(key) != -1) {
          output.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${array[i]}\n${
              array2[i]
            }`
          );
          output2.push(array3[i]);
        }
      }
    } else {
      for (i = 0; i < array.length; i++) {
        if (array[i].indexOf(key) != -1) {
          output.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${array[i]}\n${
              array2[i]
            }`
          );
          output2.push(array3[i]);
        }
      }
    }
  } else {
    if ($.splitpush == false) {
      for (i = 0; i < num; i++) {
        if (i == 0) {
          output.push(
            `🎉"${text}"的热门排行\n第${i + 1}名：${array[i]}\n${array2[i]}`
          );
          output2.push(array3[i]);
        } else {
          output.push(`第${i + 1}名：${array[i]}\n${array2[i]}`);
          output2.push(array3[i]);
        }
      }
    } else {
      for (i = 0; i < num; i++) {
        output.push(
          `🎉"${text}"的热门排行\n第${i + 1}名：${array[i]}\n${array2[i]}`
        );
        output2.push(array3[i]);
      }
    }
  }
}

function mergepushnotify(result) {
  $.this_msg = ``;
  for (var m = 0; m < result.length; m++) {
    if (m == 0) {
      $.this_msg += `${result[m]}`;
    } else {
      $.this_msg += `\n${result[m]}`;
    }
  }
  $.msg("热门监控", "", $.this_msg);
}

function splitpushnotify(result) {
  for (var m = 0; m < result.length; m++) {
    $.this_msg = ``;
    $.this_msg += `${result[m]}`;
    $.msg("热门监控", "", $.this_msg);
  }
}

function splitpushnotifymedia(result, mediaurl) {
  for (var m = 0; m < result.length; m++) {
    $.this_msg = ``;
    $.this_msg += `${result[m]}`;
    $.msg("热门监控", "", $.this_msg, { "media-url": mediaurl[m] });
  }
}

function output() {
  if (
    resultwb.length != 0 ||
    resultzh.length != 0 ||
    resultbd.length != 0 ||
    resultbl.length != 0
  ) {
    if ($.pushnew == false) {
      $.log("\n关键词为👇\n" + keyword + "\n");
      if ($.splitpush == true) {
        if (resultwb.length != 0) splitpushnotify(resultwb);
        if (resultzh.length != 0) splitpushnotify(resultzh);
        if (resultbd.length != 0) splitpushnotify(resultbd);
        if (resultbl.length != 0) splitpushnotifymedia(resultbl, mediaurl);
      } else {
        if (resultwb.length != 0) mergepushnotify(resultwb);
        if (resultzh.length != 0) mergepushnotify(resultzh);
        if (resultbd.length != 0) mergepushnotify(resultbd);
        if (resultbl.length != 0) mergepushnotify(resultbl);
      }
    } else {
      $.log("\n关键词匹配关掉了哟😉将推送最新的内容～");
      if ($.splitpush == true) {
        if (resultwb.length != 0) splitpushnotify(resultwb);
        if (resultzh.length != 0) splitpushnotify(resultzh);
        if (resultbd.length != 0) splitpushnotify(resultbd);
        if (resultbl.length != 0) splitpushnotifymedia(resultbl, mediaurl);
      } else {
        if (resultwb.length != 0) mergepushnotify(resultwb);
        if (resultzh.length != 0) mergepushnotify(resultzh);
        if (resultbd.length != 0) mergepushnotify(resultbd);
        if (resultbl.length != 0) mergepushnotify(resultbl);
      }
    }
  } else {
    $.log(`😫您订阅的关键词"${keyword}"暂时没有更新`);
  }
}

function final() {
  if (
    $.weibo == false &&
    $.zhihu == false &&
    $.baidu == false &&
    $.bilibili == false
  ) {
    $.msg(
      "热门监控",
      "哎呀！您关闭了全部的榜单😫",
      "请打开一个榜单监控再尝试哦😊"
    );
  } else {
    if (
      ifwbcanrun() == false &&
      ifzhcanrun() == false &&
      ifbdcanrun() == false &&
      ifblcanrun() == false
    ) {
      $.msg("热门监控", "Cookie未获取或不完整😫", "请获取Cookie后再尝试哦❌");
    }
  }
}

function getCookie() {
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/display\_time/)
  ) {
    const siurl = $request.url;
    $.log(siurl);
    const sicookie = JSON.stringify($request.headers);
    $.log(sicookie);
    $.setdata(siurl, url);
    $.setdata(sicookie, cookie);
    $.msg("热门监控", "", "获取微博热搜Cookie成功🎉");
  }
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/hot\-lists/)
  ) {
    const zhurl = $request.url;
    $.log(zhurl);
    const zhcookie = JSON.stringify($request.headers);
    $.log(zhcookie);
    $.setdata(zhurl, urlzh);
    $.setdata(zhcookie, cookiezh);
    $.msg("热门监控", "", "获取知乎热榜Cookie成功🎉");
  }
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(/b\=1\&c\=515/)
  ) {
    const bdurl = $request.url;
    $.log(bdurl);
    const bdcookie = JSON.stringify($request.headers);
    $.log(bdcookie);
    $.setdata(bdurl, urlbd);
    $.setdata(bdcookie, cookiebd);
    $.msg("热门监控", "", "获取百度风云榜Cookie成功🎉");
  }
  if (
    $request &&
    $request.method != "OPTIONS" &&
    $request.url.match(`rid=${$.rid}`)
  ) {
    const blurl = $request.url;
    $.log(blurl);
    const blcookie = JSON.stringify($request.headers);
    $.log(blcookie);
    $.setdata(blurl, urlbl);
    $.setdata(blcookie, cookiebl);
    $.msg("热门监控", "", "获取B站榜单Cookie成功🎉");
  }
}

//chavyleung
function Env(t, s) {
  return new (class {
    constructor(t, s) {
      (this.name = t),
        (this.data = null),
        (this.dataFile = "box.dat"),
        (this.logs = []),
        (this.logSeparator = "\n"),
        (this.startTime = new Date().getTime()),
        Object.assign(this, s),
        this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    loaddata() {
      if (!this.isNode()) return {};
      {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s);
        if (!e && !i) return {};
        {
          const i = e ? t : s;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (e) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        (this.fs = this.fs ? this.fs : require("fs")),
          (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          s = this.path.resolve(process.cwd(), this.dataFile),
          e = this.fs.existsSync(t),
          i = !e && this.fs.existsSync(s),
          o = JSON.stringify(this.data);
        e
          ? this.fs.writeFileSync(t, o)
          : i
          ? this.fs.writeFileSync(s, o)
          : this.fs.writeFileSync(t, o);
      }
    }
    lodash_get(t, s, e) {
      const i = s.replace(/\[(\d+)\]/g, ".$1").split(".");
      let o = t;
      for (const t of i) if (((o = Object(o)[t]), void 0 === o)) return e;
      return o;
    }
    lodash_set(t, s, e) {
      return Object(t) !== t
        ? t
        : (Array.isArray(s) || (s = s.toString().match(/[^.[\]]+/g) || []),
          (s
            .slice(0, -1)
            .reduce(
              (t, e, i) =>
                Object(t[e]) === t[e]
                  ? t[e]
                  : (t[e] = Math.abs(s[i + 1]) >> 0 == +s[i + 1] ? [] : {}),
              t
            )[s[s.length - 1]] = e),
          t);
    }
    getdata(t) {
      let s = this.getval(t);
      if (/^@/.test(t)) {
        const [, e, i] = /^@(.*?)\.(.*?)$/.exec(t),
          o = e ? this.getval(e) : "";
        if (o)
          try {
            const t = JSON.parse(o);
            s = t ? this.lodash_get(t, i, "") : s;
          } catch (t) {
            s = "";
          }
      }
      return s;
    }
    setdata(t, s) {
      let e = !1;
      if (/^@/.test(s)) {
        const [, i, o] = /^@(.*?)\.(.*?)$/.exec(s),
          h = this.getval(i),
          a = i ? ("null" === h ? null : h || "{}") : "{}";
        try {
          const s = JSON.parse(a);
          this.lodash_set(s, o, t),
            (e = this.setval(JSON.stringify(s), i)),
            console.log(`${i}: ${JSON.stringify(s)}`);
        } catch (e) {
          const s = {};
          this.lodash_set(s, o, t),
            (e = this.setval(JSON.stringify(s), i)),
            console.log(`${i}: ${JSON.stringify(s)}`);
        }
      } else e = $.setval(t, s);
      return e;
    }
    getval(t) {
      return this.isSurge() || this.isLoon()
        ? $persistentStore.read(t)
        : this.isQuanX()
        ? $prefs.valueForKey(t)
        : this.isNode()
        ? ((this.data = this.loaddata()), this.data[t])
        : (this.data && this.data[t]) || null;
    }
    setval(t, s) {
      return this.isSurge() || this.isLoon()
        ? $persistentStore.write(t, s)
        : this.isQuanX()
        ? $prefs.setValueForKey(t, s)
        : this.isNode()
        ? ((this.data = this.loaddata()),
          (this.data[s] = t),
          this.writedata(),
          !0)
        : (this.data && this.data[s]) || null;
    }
    initGotEnv(t) {
      (this.got = this.got ? this.got : require("got")),
        (this.cktough = this.cktough ? this.cktough : require("tough-cookie")),
        (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()),
        t &&
          ((t.headers = t.headers ? t.headers : {}),
          void 0 === t.headers.Cookie &&
            void 0 === t.cookieJar &&
            (t.cookieJar = this.ckjar));
    }
    get(t, s = () => {}) {
      t.headers &&
        (delete t.headers["Content-Type"], delete t.headers["Content-Length"]),
        this.isSurge() || this.isLoon()
          ? $httpClient.get(t, (t, e, i) => {
              !t && e && ((e.body = i), (e.statusCode = e.status), s(t, e, i));
            })
          : this.isQuanX()
          ? $task.fetch(t).then(
              t => {
                const { statusCode: e, statusCode: i, headers: o, body: h } = t;
                s(null, { status: e, statusCode: i, headers: o, body: h }, h);
              },
              t => s(t)
            )
          : this.isNode() &&
            (this.initGotEnv(t),
            this.got(t)
              .on("redirect", (t, s) => {
                try {
                  const e = t.headers["set-cookie"]
                    .map(this.cktough.Cookie.parse)
                    .toString();
                  this.ckjar.setCookieSync(e, null), (s.cookieJar = this.ckjar);
                } catch (t) {
                  this.logErr(t);
                }
              })
              .then(
                t => {
                  const {
                    statusCode: e,
                    statusCode: i,
                    headers: o,
                    body: h
                  } = t;
                  s(null, { status: e, statusCode: i, headers: o, body: h }, h);
                },
                t => s(t)
              ));
    }
    post(t, s = () => {}) {
      if (
        (t.body &&
          t.headers &&
          !t.headers["Content-Type"] &&
          (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
        delete t.headers["Content-Length"],
        this.isSurge() || this.isLoon())
      )
        $httpClient.post(t, (t, e, i) => {
          !t && e && ((e.body = i), (e.statusCode = e.status), s(t, e, i));
        });
      else if (this.isQuanX())
        (t.method = "POST"),
          $task.fetch(t).then(
            t => {
              const { statusCode: e, statusCode: i, headers: o, body: h } = t;
              s(null, { status: e, statusCode: i, headers: o, body: h }, h);
            },
            t => s(t)
          );
      else if (this.isNode()) {
        this.initGotEnv(t);
        const { url: e, ...i } = t;
        this.got.post(e, i).then(
          t => {
            const { statusCode: e, statusCode: i, headers: o, body: h } = t;
            s(null, { status: e, statusCode: i, headers: o, body: h }, h);
          },
          t => s(t)
        );
      }
    }
    msg(s = t, e = "", i = "", o) {
      const h = t =>
        !t || (!this.isLoon() && this.isSurge())
          ? t
          : "string" == typeof t
          ? this.isLoon()
            ? t
            : this.isQuanX()
            ? { "open-url": t }
            : void 0
          : "object" == typeof t && (t["open-url"] || t["media-url"])
          ? this.isLoon()
            ? t["open-url"]
            : this.isQuanX()
            ? t
            : void 0
          : void 0;
      this.isSurge() || this.isLoon()
        ? $notification.post(s, e, i, h(o))
        : this.isQuanX() && $notify(s, e, i, h(o)),
        this.logs.push(
          "",
          "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="
        ),
        this.logs.push(s),
        e && this.logs.push(e),
        i && this.logs.push(i);
    }
    log(...t) {
      t.length > 0
        ? (this.logs = [...this.logs, ...t])
        : console.log(this.logs.join(this.logSeparator));
    }
    logErr(t, s) {
      const e = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      e
        ? $.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack)
        : $.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.message);
    }
    wait(t) {
      return new Promise(s => setTimeout(s, t));
    }
    done(t = null) {
      const s = new Date().getTime(),
        e = (s - this.startTime) / 1e3;
      this.log(
        "",
        `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`
      ),
        this.log(),
        (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }
  })(t, s);
}
