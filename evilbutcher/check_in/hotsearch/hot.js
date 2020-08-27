/*

【热门监控】@evilbutcher

【仓库地址】https://github.com/evilbutcher/Quantumult_X/tree/master（欢迎star🌟）

【BoxJs】https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json

【致谢】
本脚本使用了Chavy的Env.js，感谢！
@南叔、@mini计划-图标聚合、@zZPiglet、@xinian

⚠️【使用方法】请仔细阅读⚠️
------------------------------------------
1、按照客户端配置好task，支持监控微博热搜、知乎热榜、百度风云榜、B站日榜、豆瓣榜单、抖音榜单、36氪、Kindle图书、rss订阅、人人影视最新美剧资源
2、不再需要获取Cookie，无用Cookie会自动清除；B站榜单对应关系：0全站，1动画，3音乐，4游戏，5娱乐，36科技，119鬼畜，129舞蹈。
3、本地直接修改关键词，远程可通过BoxJs修改关键词，有关键词更新时会通知，否则不通知。
4、可选择是否合并同一榜单的全部通知。
5、可选择匹配关键词或者直接获取热搜最新内容，并自定义数量。
6、B站、豆瓣榜单独立推送时可显示封面。
7、可选择是否附带跳转链接。
8、可自定每个榜单匹配关键词还是获取最新内容。
9、可自定每个榜单推送分开还是合并。
10、支持BoxJs直接运行脚本。

本地脚本keyword设置关键词，注意是英文逗号；BoxJs是用中文逗号。

⚠️【BoxJs】设置注意事项⚠️
------------------------------------------
订阅后，可以在BoxJs里面修改关键词，设置清除Cookie、开启对应榜单等。

#微博热搜检测数量设置：建议最大为8，设置检测数量太多显示不完全，内容过多。其他榜单最大检测数量暂无建议，自行决定即可。

#关键词：对所有榜单生效，榜单内无关键词匹配不会通知。

#忽略关键词推送最新内容：打开，将无视关键词，直接获取设定检测数量的对应榜单内容。

#消息分开推送：关闭，同一榜单的内容将整合为一条通知，可直接下拉或在通知面板长按通知展开，点击链接跳转详情；开启，每条内容分开推送，推送将会分为多条通知。关键词匹配模式下可打开，获取最新内容时建议关闭。

仅测试Quantumult X、Loon，理论上也支持Surge（没Surge无法测试）。

【Surge】配置
------------------------------------------
热门监控 = type=cron,cronexp="30 0 8-22/2 * * *",script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js,wake-system=true,timeout=600

【Loon】配置
------------------------------------------
[script]
cron "30 0 8-22/2 * * *" script-path=https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js, timeout=600, tag=热门监控

【Quantumult X】配置
------------------------------------------
[task_local]
30 0 8-22/2 * * * https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/check_in/hotsearch/hot.js, tag=热门监控

*/

const $ = new Env("热门监控");

//⚠️本地自定参数修改位置⚠️
var keyword = ["万茜"]; //👈本地脚本关键词在这里设置。
var rsslink = ["https://rsshub.app/bilibili/user/video/2267573"]; //👈本地rss订阅设置
//⚠️👆以上用英文逗号、英文双引号⚠️
$.weibo = true; //是否开启相应榜单监控
$.wbnum = 6; //自定微博热搜数量
$.zhihu = true; //是否开启相应榜单监控
$.zhnum = 6; //自定知乎热榜数量
$.baidu = true; //是否开启相应榜单监控
$.bdnum = 6; //自定百度风云榜数量
$.bilibili = true; //是否开启相应榜单监控
$.blnum = 6; //自定B站榜单数量
$.douban = true; //是否开启相应榜单监控
$.dbnum = 6; //自定豆瓣榜单数量
$.douyin = true; //是否开启相应榜单监控
$.dynum = 6; //自定抖音榜单数量
$.k36 = true; //是否开启相应榜单监控
$.k36num = 6; //自定36氪榜单数量
$.amazon = true; //是否开启相应榜单监控
$.amznum = 6; //自定Kindle图书榜单数量
$.rss = true; //是否开启相应榜单监控
$.rssnum = 6; //自定rss订阅推送数量
$.zmz = true; //是否开启相应榜单监控
$.zmznum = 6; //自定人人影视推送数量
$.splitpushwb = false; //是否分开推送微博榜单
$.pushnewwb = false; //是否忽略关键词推送微博最新内容
$.splitpushzh = false; //是否分开推送知乎榜单
$.pushnewzh = false; //是否忽略关键词推送知乎最新内容
$.splitpushbd = false; //是否分开推送百度榜单
$.pushnewbd = false; //是否忽略关键词推送百度最新内容
$.splitpushbl = false; //是否分开推送B站榜单
$.pushnewbl = false; //是否忽略关键词推送B站最新内容
$.splitpushdb = false; //是否分开推送豆瓣榜单
$.pushnewdb = false; //是否忽略关键词推送豆瓣最新内容
$.splitpushdy = false; //是否分开推送抖音榜单
$.pushnewdy = false; //是否忽略关键词推送抖音最新内容
$.splitpushk36 = false; //是否分开推送36氪榜单
$.pushnewk36 = false; //是否忽略关键词推送36氪最新内容
$.splitpushamz = false; //是否分开推送Kindle图书榜单
$.pushnewamz = false; //是否忽略关键词推送Kindle图书最新内容
$.splitpushrss = false; //是否分开推送rss内容
$.pushnewrss = false; //是否忽略关键词推送rss最新内容
$.splitpushzmz = false; //是否分开推送人人影视内容
$.pushnewzmz = false; //是否忽略关键词推送人人影视最新内容
$.attachurl = false; //通知是否附带跳转链接
$.rid = 0; //更改B站监控榜单
$.time = 2; //榜单获取时限，单位秒
//⚠️本地自定参数修改位置⚠️

var itemswb = [];
var itemszh = [];
var itemsbd = [];
var itemsbl = [];
var itemsdb = [];
var itemsdy = [];
var itemsk36 = [];
var itemsamz = [];
var itemsrss = [];
var itemszmz = [];
var urlswb = [];
var urlszh = [];
var urlsbd = [];
var urlsbl = [];
var urlsdb = [];
var urlsdy = [];
var urlsk36 = [];
var urlsamz = [];
var urlsrss = [];
var urlszmz = [];
var coversbl = [];
var coversdb = [];
var coversamz = [];
var coversrss = [];
var resultwb = [];
var resultzh = [];
var resultbd = [];
var resultbl = [];
var resultdb = [];
var resultdy = [];
var resultk36 = [];
var resultamz = [];
var resultrss = [];
var resultzmz = [];
var openurlwb = [];
var openurlzh = [];
var openurlbd = [];
var openurlbl = [];
var openurldb = [];
var openurldy = [];
var openurlk36 = [];
var openurlamz = [];
var openurlrss = [];
var openurlzmz = [];
var mediaurlbl = [];
var mediaurldb = [];
var mediaurlamz = [];
var mediaurlrss = [];
var titlerss = [];

!(async () => {
  /*if (typeof $request != "undefined") {
    getCookie();
    return;
  }*/
  getsetting();
  if (havekeyword() == true) {
    if ($.weibo == true) {
      await gethotsearch();
      if (resultwb.length != 0) {
        if ($.splitpushwb == true) {
          splitpushnotify(resultwb, openurlwb);
        } else {
          mergepushnotify(resultwb);
        }
      }
    } else {
      $.log("微博热搜未获取😫");
    }
    if ($.zhihu == true) {
      await gethotlist();
      if (resultzh.length != 0) {
        if ($.splitpushzh == true) {
          splitpushnotify(resultzh, openurlzh);
        } else {
          mergepushnotify(resultzh);
        }
      }
    } else {
      $.log("知乎热榜未获取😫");
    }
    if ($.baidu == true) {
      await getfylist();
      if (resultbd.length != 0) {
        if ($.splitpushbd == true) {
          splitpushnotify(resultbd, openurlbd);
        } else {
          mergepushnotify(resultbd);
        }
      }
    } else {
      $.log("百度风云榜未获取😫");
    }
    if ($.bilibili == true) {
      await getbllist();
      if (resultbl.length != 0) {
        if ($.splitpushbl == true) {
          splitpushnotifymedia(resultbl, openurlbl, mediaurlbl);
        } else {
          mergepushnotify(resultbl);
        }
      }
    } else {
      $.log("B站日榜未获取😫");
    }
    if ($.douban == true) {
      await getdblist();
      if (resultdb.length != 0) {
        if ($.splitpushdb == true) {
          splitpushnotifymedia(resultdb, openurldb, mediaurldb);
        } else {
          mergepushnotify(resultdb);
        }
      }
    } else {
      $.log("豆瓣榜单未获取😫");
    }
    if ($.douyin == true) {
      await getdylist();
      if (resultdy.length != 0) {
        if ($.splitpushdy == true) {
          splitpushnotify(resultdy, openurldy);
        } else {
          mergepushnotify(resultdy);
        }
      }
    } else {
      $.log("抖音榜单未获取😫");
    }
    if ($.k36 == true) {
      await getk36list();
      if (resultk36.length != 0) {
        if ($.splitpushk36 == true) {
          splitpushnotify(resultk36, openurlk36);
        } else {
          mergepushnotify(resultk36);
        }
      }
    } else {
      $.log("36氪榜单未获取😫");
    }
    if ($.amazon == true) {
      await getamazonlist();
      if (resultamz.length != 0) {
        if ($.splitpushamz == true) {
          splitpushnotifymedia(resultamz, openurlamz, mediaurlamz);
        } else {
          mergepushnotify(resultamz);
        }
      }
    } else {
      $.log("Kindle图书榜单未获取😫");
    }
    if ($.zmz == true) {
      await getzmzlist();
      if (resultzmz.length != 0) {
        if ($.splitpushzmz == true) {
          splitpushnotify(resultzmz, openurlzmz);
        } else {
          mergepushnotify(resultzmz);
        }
      }
    } else {
      $.log("人人影视榜单未获取😫");
    }
    if ($.rss == true) {
      if (haversslink()) {
        for (var i = 0; i < rsslink.length; i++) {
          resultrss[i] = [];
          openurlrss[i] = [];
          mediaurlrss[i] = [];
          titlerss[i] = [];
          itemsrss[i] = [];
          urlsrss[i] = [];
          coversrss[i] = [];
          await getrsslist(
            rsslink[i],
            resultrss[i],
            openurlrss[i],
            mediaurlrss[i],
            titlerss[i],
            itemsrss[i],
            urlsrss[i],
            coversrss[i]
          );
          if (resultrss[i].length != 0) {
            if ($.splitpushrss == true) {
              splitpushnotifymedia(resultrss[i], openurlrss[i], mediaurlrss[i]);
            } else {
              mergepushnotify(resultrss[i]);
            }
          }
        }
      }
    } else {
      $.log("rss订阅未获取😫");
    }
    last();
    final();
    //deluselessck();
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
    $.msg("热门监控", "请输入要监控的关键词🔍", "请在BoxJs或本地中进行设置。");
    return false;
  } else {
    for (var i = 0; i < keyword.length; i++) {
      if (keyword[i] != 0) {
        return true;
      }
    }
    $.msg(
      "热门监控",
      "请输入要监控的关键词🔍",
      "存在为空的关键词，请在BoxJs或本地重新设置。"
    );
    return false;
  }
}

function haversslink() {
  if (rsslink.length == 0) {
    $.msg("热门监控", "请输入要监控的rss链接🔍", "请在BoxJs中进行设置。");
    return false;
  } else {
    for (var i = 0; i < rsslink.length; i++) {
      if (keyword[i] != 0) {
        return true;
      }
    }
    $.msg(
      "热门监控",
      "请输入要监控的rss链接🔍",
      "存在为空的rss链接，请在BoxJs重新设置。"
    );
    return false;
  }
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
  if (
    $.getdata("evil_rsslink") != undefined &&
    $.getdata("evil_rsslink") != ""
  ) {
    var rssurl = $.getdata("evil_rsslink");
    rsslink = rssurl.split("，");
  }
  $.weibo = JSON.parse($.getdata("evil_wb") || $.weibo);
  $.zhihu = JSON.parse($.getdata("evil_zh") || $.zhihu);
  $.baidu = JSON.parse($.getdata("evil_bd") || $.baidu);
  $.bilibili = JSON.parse($.getdata("evil_bl") || $.bilibili);
  $.douban = JSON.parse($.getdata("evil_db") || $.douban);
  $.douyin = JSON.parse($.getdata("evil_dy") || $.douyin);
  $.k36 = JSON.parse($.getdata("evil_k36") || $.k36);
  $.amazon = JSON.parse($.getdata("evil_amazon") || $.amazon);
  $.rss = JSON.parse($.getdata("evil_rss") || $.rss);
  $.zmz = JSON.parse($.getdata("evil_zmz") || $.zmz);
  $.splitpushwb = JSON.parse($.getdata("evil_splitpushwb") || $.splitpushwb);
  $.splitpushzh = JSON.parse($.getdata("evil_splitpushzh") || $.splitpushzh);
  $.splitpushbd = JSON.parse($.getdata("evil_splitpushbd") || $.splitpushbd);
  $.splitpushbl = JSON.parse($.getdata("evil_splitpushbl") || $.splitpushbl);
  $.splitpushdb = JSON.parse($.getdata("evil_splitpushdb") || $.splitpushdb);
  $.splitpushdy = JSON.parse($.getdata("evil_splitpushdy") || $.splitpushdy);
  $.splitpushk36 = JSON.parse($.getdata("evil_splitpushk36") || $.splitpushk36);
  $.splitpushamz = JSON.parse($.getdata("evil_splitpushamz") || $.splitpushamz);
  $.splitpushrss = JSON.parse($.getdata("evil_splitpushrss") || $.splitpushrss);
  $.splitpushzmz = JSON.parse($.getdata("evil_splitpushzmz") || $.splitpushzmz);
  $.pushnewwb = JSON.parse($.getdata("evil_pushnewwb") || $.pushnewwb);
  $.pushnewzh = JSON.parse($.getdata("evil_pushnewzh") || $.pushnewzh);
  $.pushnewbd = JSON.parse($.getdata("evil_pushnewbd") || $.pushnewbd);
  $.pushnewbl = JSON.parse($.getdata("evil_pushnewbl") || $.pushnewbl);
  $.pushnewdb = JSON.parse($.getdata("evil_pushnewdb") || $.pushnewdb);
  $.pushnewdy = JSON.parse($.getdata("evil_pushnewdy") || $.pushnewdy);
  $.pushnewk36 = JSON.parse($.getdata("evil_pushnewk36") || $.pushnewk36);
  $.pushnewamz = JSON.parse($.getdata("evil_pushnewamz") || $.pushnewamz);
  $.pushnewrss = JSON.parse($.getdata("evil_pushnewrss") || $.pushnewrss);
  $.pushnewzmz = JSON.parse($.getdata("evil_pushnewzmz") || $.pushnewzmz);
  $.attachurl = JSON.parse($.getdata("evil_attachurl") || $.attachurl);
  $.rid = $.getdata("evil_blrid") * 1 || $.rid;
  $.wbnum = $.getdata("evil_wbnum") * 1 || $.wbnum;
  $.zhnum = $.getdata("evil_zhnum") * 1 || $.zhnum;
  $.bdnum = $.getdata("evil_bdnum") * 1 || $.bdnum;
  $.blnum = $.getdata("evil_blnum") * 1 || $.blnum;
  $.dbnum = $.getdata("evil_dbnum") * 1 || $.dbnum;
  $.dynum = $.getdata("evil_dynum") * 1 || $.dynum;
  $.k36num = $.getdata("evil_k36num") * 1 || $.k36num;
  $.amznum = $.getdata("evil_amznum") * 1 || $.amznum;
  $.rssnum = $.getdata("evil_rssnum") * 1 || $.rssnum;
  $.zmznum = $.getdata("evil_zmznum") * 1 || $.zmznum;
  $.time = $.getdata("evil_time") * 1000 || $.time * 1000;
  $.log("监控关键词 " + keyword);
  $.log("监控rss链接 " + rsslink);
  $.log("获取rss订阅 " + $.rss);
  $.log("分开推送rss内容 " + $.splitpushrss);
  $.log("忽略关键词获取rss最新内容 " + $.pushnewrss);
  $.log("获取rss数量 " + $.rssnum + "个");
  $.log("获取微博热搜 " + $.weibo);
  $.log("分开推送微博内容 " + $.splitpushwb);
  $.log("忽略关键词获取微博最热内容 " + $.pushnewwb);
  $.log("获取微博热搜数量 " + $.wbnum + "个");
  $.log("获取知乎热榜 " + $.zhihu);
  $.log("分开推送知乎内容 " + $.splitpushzh);
  $.log("忽略关键词获取知乎最热内容 " + $.pushnewzh);
  $.log("获取知乎热榜数量 " + $.zhnum + "个");
  $.log("获取百度风云榜 " + $.baidu);
  $.log("分开推送百度内容 " + $.splitpushbd);
  $.log("忽略关键词获取百度最热内容 " + $.pushnewbd);
  $.log("获取百度风云榜数量 " + $.bdnum + "个");
  $.log("获取B站榜单 " + $.bilibili);
  $.log("分开推送B站内容 " + $.splitpushbl);
  $.log("忽略关键词获取B站最热内容 " + $.pushnewbl);
  $.log("获取B站日榜数量 " + $.blnum + "个");
  $.log("获取豆瓣榜单 " + $.douban);
  $.log("分开推送豆瓣内容 " + $.splitpushdb);
  $.log("忽略关键词获取豆瓣最热内容 " + $.pushnewdb);
  $.log("获取豆瓣榜单数量 " + $.dbnum + "个");
  $.log("获取抖音榜单 " + $.douyin);
  $.log("分开推送抖音内容 " + $.splitpushdy);
  $.log("忽略关键词获取抖音最热内容 " + $.pushnewdy);
  $.log("获取抖音榜单数量 " + $.dynum + "个");
  $.log("获取36氪榜单 " + $.k36);
  $.log("分开推送36氪内容 " + $.splitpushk36);
  $.log("忽略关键词获取36氪最热内容 " + $.pushnewk36);
  $.log("获取36氪榜单数量 " + $.k36num + "个");
  $.log("获取Kindle图书榜单 " + $.amazon);
  $.log("分开推送Kindle图书内容 " + $.splitpushamz);
  $.log("忽略关键词获取Kindle图书最热内容 " + $.pushnewamz);
  $.log("获取Kindle图书榜单数量 " + $.amznum + "个");
  $.log("获取人人影视榜单 " + $.zmz);
  $.log("分开推送人人影视内容 " + $.splitpushzmz);
  $.log("忽略关键词获取人人影视最新内容 " + $.pushnewzmz);
  $.log("获取人人影视榜单数量 " + $.zmznum + "个");
  $.log("附带跳转链接 " + $.attachurl + "\n");
}

function gethotsearch() {
  $.log("开始获取微博榜单...");
  return new Promise(resolve => {
    try {
      const wbRequest = {
        url:
          "https://m.weibo.cn/api/container/getIndex?containerid=106003%26filter_type%3Drealtimehot"
      };
      $.get(wbRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.data.cards == undefined ||
            obj.data.cards == null
          ) {
            $.msg(
              $.name,
              "🚨获取微博榜单出现错误",
              `⚠️原因：${obj.errmsg}\n可稍后重试，若问题依旧可联系作者`
            );
            resolve();
            return;
          }
          var group = obj.data.cards[0]["card_group"];
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].desc;
            var urllong = group[i].scheme;
            var content = urllong.match(new RegExp(/q%3D.*?&isnewpage/));
            var con = JSON.stringify(content);
            var newcon = con.slice(2, -12);
            var postcon = newcon.replace("q%3D", "q=");
            var url = "sinaweibo://searchall?" + postcon;
            itemswb.push(item);
            urlswb.push(url);
          }
          $.log("微博热搜获取成功✅\n" + itemswb);
          if ($.pushnewwb == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontenturl(
                $.splitpushwb,
                "微博",
                resultwb,
                openurlwb,
                keyword[j],
                itemswb,
                urlswb
              );
            }
          } else {
            gethotcontenturl(
              $.splitpushwb,
              "微博",
              resultwb,
              openurlwb,
              $.wbnum,
              itemswb,
              urlswb
            );
          }
          resolve();
        } else {
          $.log("获取微博热搜出现错误❌以下详情：\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取微博热搜出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function gethotlist() {
  $.log("开始获取知乎榜单...");
  return new Promise(resolve => {
    try {
      const zhRequest = {
        url:
          "https://api.zhihu.com/topstory/hot-lists/total?limit=10&reverse_order=0"
      };
      $.get(zhRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.data == undefined ||
            obj.data == null
          ) {
            $.msg(
              $.name,
              "🚨获取知乎榜单出现错误",
              `⚠️原因：${obj.errmsg}\n可稍后重试，若问题依旧可联系作者`
            );
            resolve();
            return;
          }
          var group = obj.data;
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].target.title;
            var oriurl = group[i].target.url;
            var url = oriurl.replace("https://api.zhihu.com/", "zhihu://");
            itemszh.push(item);
            urlszh.push(url);
          }
          $.log("知乎热榜获取成功✅\n" + itemszh);
          if ($.pushnewzh == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontenturl(
                $.splitpushzh,
                "知乎",
                resultzh,
                openurlzh,
                keyword[j],
                itemszh,
                urlszh
              );
            }
          } else {
            gethotcontenturl(
              $.splitpushzh,
              "知乎",
              resultzh,
              openurlzh,
              $.zhnum,
              itemszh,
              urlszh
            );
          }
          resolve();
        } else {
          $.log("获取知乎热榜出现错误❌以下详情：\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取知乎热榜出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function getfylist() {
  $.log("开始获取百度榜单...");
  return new Promise(resolve => {
    try {
      const bdRequest = {
        url: "http://top.baidu.com/mobile_v2/buzz?b=1&c=515"
      };
      $.get(bdRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.result.descs == undefined ||
            obj.result.descs == null
          ) {
            $.msg(
              $.name,
              "🚨获取百度榜单出现错误",
              `⚠️原因：${obj.errmsg}\n可稍后重试，若问题依旧可联系作者`
            );
            resolve();
            return;
          }
          var group = obj.result.descs;
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var originitem = group[i].content;
            if (originitem == undefined) {
              continue;
            }
            var item = originitem.data[0].title;
            if (item == undefined) {
              continue;
            }
            var url = originitem.data[0].originlink;
            if (url == undefined) {
              continue;
            }
            itemsbd.push(item);
            urlsbd.push(url);
          }
          $.log("百度风云榜获取成功✅\n" + itemsbd);
          if ($.pushnewbd == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontenturl(
                $.splitpushbd,
                "百度",
                resultbd,
                openurlbd,
                keyword[j],
                itemsbd,
                urlsbd
              );
            }
          } else {
            gethotcontenturl(
              $.splitpushbd,
              "百度",
              resultbd,
              openurlbd,
              $.bdnum,
              itemsbd,
              urlsbd
            );
          }
          resolve();
        } else {
          $.log("获取百度风云榜出现错误❌以下详情：\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取百度风云榜出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function getbllist() {
  $.log("开始获取B站日榜...");
  return new Promise(resolve => {
    try {
      const blRequest = {
        url: "https://app.bilibili.com/x/v2/rank/region?rid=" + $.rid
      };
      $.get(blRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj.data == undefined ||
            obj.data == null
          ) {
            $.msg(
              $.name,
              "🚨获取B站榜单出现错误",
              `⚠️原因：${obj.errmsg}\n可稍后重试，若问题依旧可联系作者`
            );
            resolve();
            return;
          }
          var group = obj.data;
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var item = group[i].title;
            var url = group[i].uri;
            var cover = group[i].cover;
            itemsbl.push(item);
            urlsbl.push(url);
            coversbl.push(cover);
          }
          $.log("B站日榜获取成功✅\n" + itemsbl);
          if ($.pushnewbl == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontentmedia(
                $.splitpushbl,
                "B站",
                resultbl,
                openurlbl,
                mediaurlbl,
                keyword[j],
                itemsbl,
                urlsbl,
                coversbl
              );
            }
          } else {
            gethotcontentmedia(
              $.splitpushbl,
              "B站",
              resultbl,
              openurlbl,
              mediaurlbl,
              $.blnum,
              itemsbl,
              urlsbl,
              coversbl
            );
          }
          resolve();
        } else {
          $.log("获取B站日榜出现错误❌以下详情:\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取B站日榜出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function getdblist() {
  $.log("开始获取豆瓣榜单...");
  return new Promise(resolve => {
    try {
      const dbheader = {
        Referer: `https://m.douban.com/pwa/cache_worker`
      };
      const dbRequest = {
        url:
          "https://m.douban.com/rexxar/api/v2/subject_collection/movie_real_time_hotest/items?start=0&count=50&items_only=1&for_mobile=1",
        headers: dbheader
      };
      $.get(dbRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          if (
            obj.hasOwnProperty("errmsg") ||
            obj["subject_collection_items"] == undefined ||
            obj["subject_collection_items"] == null
          ) {
            $.msg(
              $.name,
              "🚨获取豆瓣榜单出现错误",
              `⚠️原因：${obj.errmsg}\n可稍后重试，若问题依旧可联系作者`
            );
            resolve();
            return;
          }
          var group = obj["subject_collection_items"];
          var num = group.length;
          for (var i = 0; i < num; i++) {
            var title = group[i].title;
            var subtitle = group[i]["card_subtitle"];
            var rating = group[i].rating;
            if (rating == null) continue;
            var star = rating["star_count"];
            var item =
              title + "\n" + "评分：" + star + "星🌟" + "\n" + subtitle;
            var url = group[i].url;
            var cover = group[i].cover.url;
            itemsdb.push(item);
            urlsdb.push(url);
            coversdb.push(cover);
          }
          $.log("豆瓣榜单获取成功✅\n" + itemsdb);
          if ($.pushnewdb == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontentmedia(
                $.splitpushdb,
                "豆瓣",
                resultdb,
                openurldb,
                mediaurldb,
                keyword[j],
                itemsdb,
                urlsdb,
                coversdb
              );
            }
          } else {
            gethotcontentmedia(
              $.splitpushdb,
              "豆瓣",
              resultdb,
              openurldb,
              mediaurldb,
              $.dbnum,
              itemsdb,
              urlsdb,
              coversdb
            );
          }
          resolve();
        } else {
          $.log("获取豆瓣榜单出现错误❌以下详情:\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取豆瓣榜单出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function getdylist() {
  $.log("开始获取抖音榜单...");
  return new Promise(resolve => {
    try {
      const dyRequest = {
        url: "https://tophub.today/n/DpQvNABoNE"
      };
      $.get(dyRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          parsehtml(body, itemsdy, urlsdy);
          $.log("抖音榜单获取成功✅\n" + itemsdy);
          if ($.pushnewdy == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontenturl(
                $.splitpushdy,
                "抖音",
                resultdy,
                openurldy,
                keyword[j],
                itemsdy,
                urlsdy
              );
            }
          } else {
            gethotcontenturl(
              $.splitpushdy,
              "抖音",
              resultdy,
              openurldy,
              $.dynum,
              itemsdy,
              urlsdy
            );
          }
          resolve();
        } else {
          $.log("获取抖音榜单出现错误❌以下详情:\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取抖音榜单出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function getk36list() {
  $.log("开始获取36氪榜单...");
  return new Promise(resolve => {
    try {
      const k36Request = {
        url: "https://tophub.today/n/Q1Vd5Ko85R"
      };
      $.get(k36Request, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          parsehtml(body, itemsk36, urlsk36);
          $.log("36氪榜单获取成功✅\n" + itemsk36);
          if ($.pushnewk36 == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontenturl(
                $.splitpushk36,
                "36氪",
                resultk36,
                openurlk36,
                keyword[j],
                itemsk36,
                urlsk36
              );
            }
          } else {
            gethotcontenturl(
              $.splitpushk36,
              "36氪",
              resultk36,
              openurlk36,
              $.k36num,
              itemsk36,
              urlsk36
            );
          }
          resolve();
        } else {
          $.log("获取36氪榜单出现错误❌以下详情:\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取36氪榜单出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function getamazonlist() {
  $.log("开始获取Kindle图书榜单...");
  return new Promise(resolve => {
    try {
      const amazonRequest = {
        url: "https://www.amazon.cn/gp/bestsellers/digital-text",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1"
        }
      };
      $.get(amazonRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          parsehtmlkindle(body, itemsamz, urlsamz, coversamz);
          $.log("Kindle图书榜单获取成功✅\n" + itemsamz);
          if ($.pushnewamz == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontentmedia(
                $.splitpushamz,
                "Kindle书单",
                resultamz,
                openurlamz,
                mediaurlamz,
                keyword[j],
                itemsamz,
                urlsamz,
                coversamz
              );
            }
          } else {
            gethotcontentmedia(
              $.splitpushamz,
              "Kindle书单",
              resultamz,
              openurlamz,
              mediaurlamz,
              $.amznum,
              itemsamz,
              urlsamz,
              coversamz
            );
          }
          resolve();
        } else {
          $.log("获取Kindle图书榜单出现错误❌以下详情:\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取Kindle图书榜单出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function getzmzlist() {
  $.log("开始获取人人影视榜单...");
  return new Promise(resolve => {
    try {
      const zmzRequest = {
        url: `http://file.apicvn.com/file/list?page=1&order=create_time&sort=desc`,
        headers: {
          Host: "file.apicvn.com",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0"
        }
      };
      $.get(zmzRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          var obj = JSON.parse(body);
          for (var i = 0; i < obj.length; i++) {
            var item = obj[i]["file_name"];
            var oriurl = obj[i]["magnet_url"];
            var url = "shortcuts://x-callback-url/run-shortcut?name=%E7%A3%81%E5%8A%9B%E7%A6%BB%E7%BA%BF&input=" + oriurl;
            var size = (obj[i]["file_size"] / 1048576).toFixed(2);
            var finalsize = size + "MB";
            if (size > 1024) {
              size = (obj[i]["file_size"] / 1073741824).toFixed(2);
              finalsize = size + "GB";
            }
            var finalitem = item + "\n📦大小：" + finalsize;
            itemszmz.push(finalitem);
            urlszmz.push(url);
          }
          $.log("人人影视榜单获取成功✅\n" + itemszmz);
          if ($.pushnewzmz == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontenturl(
                $.splitpushzmz,
                "人人影视",
                resultzmz,
                openurlzmz,
                keyword[j],
                itemszmz,
                urlszmz
              );
            }
          } else {
            gethotcontenturl(
              $.splitpushzmz,
              "人人影视",
              resultzmz,
              openurlzmz,
              $.zmznum,
              itemszmz,
              urlszmz
            );
          }
          resolve();
        } else {
          $.log("获取人人影视榜单出现错误❌以下详情:\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取人人影视榜单出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function getrsslist(
  rsslink,
  resultrss,
  openurlrss,
  mediaurlrss,
  titlerss,
  itemsrss,
  urlsrss,
  coversrss
) {
  $.log("开始获取RSS内容...");
  return new Promise(resolve => {
    try {
      const rssRequest = {
        url: rsslink
      };
      $.get(rssRequest, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        if (response.statusCode == 200) {
          var body = response.body;
          parsehtmlrss(body, titlerss, itemsrss, urlsrss, coversrss);
          $.log("RSS内容获取成功✅\n" + itemsrss);
          if ($.pushnewrss == false) {
            for (var j = 0; j < keyword.length; j++) {
              getkeywordcontentmedia(
                $.splitpushrss,
                titlerss,
                resultrss,
                openurlrss,
                mediaurlrss,
                keyword[j],
                itemsrss,
                urlsrss,
                coversrss
              );
            }
          } else {
            gethotcontentmedia(
              $.splitpushrss,
              titlerss,
              resultrss,
              openurlrss,
              mediaurlrss,
              $.rssnum,
              itemsrss,
              urlsrss,
              coversrss
            );
          }
          resolve();
        } else {
          $.log("获取RSS内容出现错误❌以下详情:\n");
          $.log(response);
        }
        resolve();
      });
    } catch (e) {
      $.log("获取RSS内容出现错误❌原因：\n");
      $.log(e);
      resolve();
    }
    setTimeout(() => {
      resolve();
    }, $.time);
  });
}

function parsehtmlrss(str, title, items, urls, covers) {
  var text = JSON.stringify(str);
  //title表达式
  var alltitle = /channel\>(\\\S.*?|)\<title\>(\<\!\[CDATA\[.*?\]|.*?)\>/;
  //括号表达式
  var getbracket = /CDATA\[.*?]/;
  //箭头表达式
  var getarrow = /title\>.*?\</;
  //获取title
  var pretitle = text.match(alltitle);
  //检测括号
  var kuotitle = pretitle[0].match(getbracket);
  //检测箭头
  var jiantitle = pretitle[0].match(getarrow);
  title.splice(0);
  if (kuotitle != null) {
    title.push(kuotitle[0].slice(6, -1));
  } else {
    title.push(jiantitle[0].slice(6, -1));
  }
  //item表达式
  var content = /item\>.*?\<\/item/g;
  var detail = text.match(content);
  for (var i = 0; i < detail.length; i++) {
    //subtitle表达式
    var subtitle = /title\>(\<\!\[CDATA\[.*?\]|.*?)\>\</;
    //description表达式
    var allwords = /description\>(\<\!\[CDATA\[.*?\]|\S.*?)\>\</;
    //openurl的link表达式
    var allurls = /link\>http.*?\</;
    //mediaurl的link表达式
    var allcovers = /img src=(\\\"|\S).*?(jpg|png|&#34)/;
    //筛选http
    var getcovers = /http.*?(jpg|png|&#34)/;
    //获取subtitle
    var presubtitle = detail[i].match(subtitle);
    if (presubtitle != null) {
      //检测括号
      var postsubtitle = presubtitle[0].match(getbracket);
      if (postsubtitle != null) {
        var finalsubtitle = postsubtitle[0].slice(6, -1);
      } else {
        finalsubtitle = presubtitle[0].slice(6, -9);
      }
      //获取description
      var prewords = detail[i].match(allwords);
      //检测括号
      var postwords = prewords[0].match(getbracket);
      if (postwords != null) {
        var getwords = postwords[0].slice(6, -1);
      } else {
        getwords = "未获取";
      }
      var finalwords = getwords
        .replace(new RegExp(/\\n/, "gm"), "")
        .replace(new RegExp(/\<.*?\>/, "gm"), "");
      if (finalwords.length != 0) {
        var item = finalsubtitle + "\n🔍详情  " + finalwords;
        items.push(item);
      } else {
        var item = finalsubtitle + "\n🔍详情  暂无";
        items.push(item);
      }
      var preurls = detail[i].match(allurls);
      var posturls = preurls[0].slice(5, -1);
      urls.push(posturls);
      var precovers = detail[i].match(allcovers);
      if (precovers != null) {
        var postcovers = precovers[0].match(getcovers);
        covers.push(postcovers[0]);
      } else {
        covers.push(
          "https://raw.githubusercontent.com/58xinian/icon/master/hot.png"
        );
      }
    } else {
      continue;
    }
  }
}

function parsehtml(str, items, urls) {
  var text = JSON.stringify(str);
  var name = /itemid\=\\\"\d\d\d\d\d\d\d\d\\\"\>.*?\<\/a\>\<\/td\>/g;
  var link = /al\\\"\>\<a href\=\\\".*?\\\"/g;
  var preitem = text.match(name);
  var preurl = text.match(link);
  for (var i = 0; i < 20; i++) {
    var postitem = preitem[i].slice(20, -9);
    var posturl = preurl[i].slice(15, -2);
    if (postitem.indexOf("<i class") != -1) {
      continue;
    }
    items.push(postitem);
    urls.push(posturl);
  }
}

function parsehtmlkindle(str, items, urls, covers) {
  var text = JSON.stringify(str);
  var name = /\<img alt\=\\\".*?\\\"/g;
  var link = /href\=\\\"\/dp.*?\\\"/g;
  var img = /\" src\=\\\"https.*?SR110\,110\_\.jpg/g;
  var price1 = /a-size-large\\\"\>.*?\</g;
  var price2 = /p13n-sc-hero-cents\\\"\>.*?\</g;
  var preitem = text.match(name);
  var preurl = text.match(link);
  var preimg = text.match(img);
  var preprice1 = text.match(price1);
  var preprice2 = text.match(price2);
  for (var i = 0; i < 20; i++) {
    var postitem = preitem[i].slice(11, -2);
    var posturl = preurl[i].slice(7, -2);
    var addurl = "https://www.amazon.cn" + posturl;
    var imgurl = preimg[i].slice(8);
    var okurl = imgurl.replace("UL110_SR110,110_.jpg", "UL330_SR330,330_.jpg");
    var postprice1 = preprice1[i].slice(15, -1);
    var postprice2 = preprice2[i].slice(21, -1);
    var content =
      postitem + "\n" + "💰价格  " + postprice1 + "." + postprice2 + "¥";
    items.push(content);
    urls.push(addurl);
    covers.push(okurl);
  }
}

function getkeywordcontenturl(
  splitpush,
  text,
  result,
  openurl,
  key,
  items,
  urls
) {
  if (splitpush == false) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].indexOf(key) != -1) {
        if ($.attachurl == true) {
          result.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${items[i]}\n${
              urls[i]
            }`
          );
        } else {
          result.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${items[i]}`
          );
        }
      }
    }
  } else {
    for (i = 0; i < items.length; i++) {
      if (items[i].indexOf(key) != -1) {
        if ($.attachurl == true) {
          result.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${items[i]}\n${
              urls[i]
            }`
          );
        } else {
          result.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${items[i]}`
          );
        }
        openurl.push(urls[i]);
      }
    }
  }
}

function gethotcontenturl(splitpush, text, result, openurl, num, items, urls) {
  if (splitpush == false) {
    for (var i = 0; i < num; i++) {
      if ($.attachurl == true) {
        if (i == 0) {
          result.push(
            `🎉"${text}"的热门排行\n第${i + 1}名：${items[i]}\n${urls[i]}`
          );
        } else {
          result.push(`第${i + 1}名：${items[i]}\n${urls[i]}`);
        }
      } else {
        if (i == 0) {
          result.push(`🎉"${text}"的热门排行\n第${i + 1}名：${items[i]}`);
        } else {
          result.push(`第${i + 1}名：${items[i]}`);
        }
      }
    }
  } else {
    for (i = 0; i < num; i++) {
      if ($.attachurl == true) {
        result.push(
          `🎉"${text}"的热门排行\n第${i + 1}名：${items[i]}\n${urls[i]}`
        );
      } else {
        result.push(`🎉"${text}"的热门排行\n第${i + 1}名：${items[i]}`);
      }
      openurl.push(urls[i]);
    }
  }
}

function getkeywordcontentmedia(
  splitpush,
  text,
  result,
  openurl,
  mediaurl,
  key,
  items,
  urls,
  covers
) {
  if (splitpush == false) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].indexOf(key) != -1) {
        if ($.attachurl == true) {
          result.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${items[i]}\n${
              urls[i]
            }`
          );
        } else {
          result.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${items[i]}`
          );
        }
      }
    }
  } else {
    for (i = 0; i < items.length; i++) {
      if (items[i].indexOf(key) != -1) {
        if ($.attachurl == true) {
          result.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${items[i]}\n${
              urls[i]
            }`
          );
        } else {
          result.push(
            `🎉"${text}"的关键词"${key}"更新\n第${i + 1}名：${items[i]}`
          );
        }
        openurl.push(urls[i]);
        mediaurl.push(covers[i]);
      }
    }
  }
}

function gethotcontentmedia(
  splitpush,
  text,
  result,
  openurl,
  mediaurl,
  num,
  items,
  urls,
  covers
) {
  if (splitpush == false) {
    for (var i = 0; i < num; i++) {
      if ($.attachurl == true) {
        if (i == 0) {
          result.push(
            `🎉"${text}"的热门排行\n第${i + 1}名：${items[i]}\n${urls[i]}`
          );
        } else {
          result.push(`第${i + 1}名：${items[i]}\n${urls[i]}`);
        }
      } else {
        if (i == 0) {
          result.push(`🎉"${text}"的热门排行\n第${i + 1}名：${items[i]}`);
        } else {
          result.push(`第${i + 1}名：${items[i]}`);
        }
      }
    }
  } else {
    for (i = 0; i < num; i++) {
      if ($.attachurl == true) {
        result.push(
          `🎉"${text}"的热门排行\n第${i + 1}名：${items[i]}\n${urls[i]}`
        );
      } else {
        result.push(`🎉"${text}"的热门排行\n第${i + 1}名：${items[i]}`);
      }
      openurl.push(urls[i]);
      mediaurl.push(covers[i]);
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

function splitpushnotify(result, openurl) {
  for (var m = 0; m < result.length; m++) {
    $.this_msg = ``;
    $.this_msg += `${result[m]}`;
    $.msg("热门监控", "", $.this_msg, { "open-url": openurl[m] });
  }
}

function splitpushnotifymedia(result, openurl, mediaurl) {
  for (var m = 0; m < result.length; m++) {
    $.this_msg = ``;
    $.this_msg += `${result[m]}`;
    $.msg("热门监控", "", $.this_msg, {
      "open-url": openurl[m],
      "media-url": mediaurl[m]
    });
  }
}

function checkrssresult() {
  for (var i = 0; i < rsslink.length; i++) {
    if (resultrss[i] != undefined) {
      if (resultrss[i].length != 0) {
        return true;
      }
    }
  }
  return false;
}

function last() {
  if (
    resultwb.length == 0 &&
    resultzh.length == 0 &&
    resultbd.length == 0 &&
    resultbl.length == 0 &&
    resultdb.length == 0 &&
    resultdy.length == 0 &&
    resultk36.length == 0 &&
    resultamz.length == 0 &&
    resultzmz.length == 0 &&
    checkrssresult() == false
  ) {
    $.log(`\n😫您订阅的关键词"${keyword}"暂时没有更新`);
  }
}

function final() {
  if (
    $.weibo == false &&
    $.zhihu == false &&
    $.baidu == false &&
    $.bilibili == false &&
    $.douban == false &&
    $.douyin == false &&
    $.k36 == false &&
    $.amazon == false &&
    $.rss == false &&
    $.zmz == false
  ) {
    $.msg(
      "热门监控",
      "哎呀！您关闭了全部的榜单😫",
      "请打开一个榜单监控再尝试哦😊"
    );
  }
}

function deluselessck() {
  $.setdata("", "evil_hotsearchurl");
  $.setdata("", "evil_hotsearchcookie");
  $.setdata("", "evil_zhihuurl");
  $.setdata("", "evil_zhihucookie");
  $.setdata("", "evil_baiduurl");
  $.setdata("", "evil_baiducookie");
  $.setdata("", "evil_bilibiurl");
  $.setdata("", "evil_bilibilicookie");
  $.setdata("", "evil_doubanurl");
  $.setdata("", "evil_doubancookie");
  $.log("\n已清除无用Cookie✅");
}

function getCookie() {
  /*if (
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
  }*/
}

//From chavyleung's Env.js
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
