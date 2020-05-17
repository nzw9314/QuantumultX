/*
# 参数说明：
# filter：节点名称关键词筛选，支持用+多个连接
# bad：删除已筛选中节点的关键词，支持+连接
# length：限制已筛选节点数量，超过则不做更改
# rename：节点重命名，格式 香港@HK，支持+连接
# tfo：参数为1时为所有节点开启，0则为关闭
# udp：参数为1时为所有节点开启，0则为关闭
# sort：参数为1时按序排列节点，-1颠倒排列
# direct：参数为1时顶部插入直连节点，-1尾部添加
# media：筛选支持Netflix的节点，目前只适配CCCAT

示例： https://a.subs.cat/surge4vmesslist.php?token=xxx&filter=HK&rename=(.*)%20-%20HK@%F0%9F%87%AD%F0%9F%87%B0%E9%A6%99%E6%B8%AF%20-%20$1&sort=1&udp=1

[Script]
CCCAT = type=http-response,pattern=^https?:\/\/a\.subs\.cat\/surge4vmesslist\.php,requires-body=true,script-path=https://Choler.github.io/Surge/Script/policy.js

[MITM]
hostname = %APPEND% a.subs.cat

*/

let url = decodeURIComponent($request.url);
let data = $response.body;

if (url.indexOf("media=") != -1) {
  let Netflix =
    "(Mirage|Vega|Altair|Rin|Camelia|Mirai|Scheat|Chigusa|Waterloo)";
  let media = url.match(/media=([^&]+)/)[1];
  if (media == "netflix") {
    var re = new RegExp(".*" + Netflix + ".*", "g");
    var arr = data.match(re);
    data = arr.join("\n");
  }
}

if (url.indexOf("filter=") != -1) {
  let filter = url.match(/filter=([^&]+)/)[1];
  filter = filter.replace(/\+/g, "|");
  var re = new RegExp(".*(" + filter + ").*", "g");
  var arr = data.match(re);
  data = arr.join("\n");
}

if (url.indexOf("bad=") != -1) {
  let bad = url.match(/bad=([^&]+)/)[1];
  bad = bad.replace(/\+/g,"|")
  var re = new RegExp(".*(" + bad + ").*", "g");
  var arr = data.match(re);
  for (var i = arr.length - 1; i >= 0; i--) {
    data = data.replace(arr[i], "");
  }
}

if (url.indexOf("length=") != -1) {
  let len = url.match(/length=(\d+)/)[1];
  data = data.split("\n");
  var arr = data.filter(function(e) {
    return e;
  });
  if (arr.length > len) {
    arr.length = len;
  }
  data = arr.join("\n");
}

if (url.indexOf("direct=") != -1) {
  let direct = url.match(/direct=(-?1)/)[1];
  let arr = data.split("\n");
  if (direct == 1) {
    arr.unshift("DIRECT = direct");
  } else {
    arr.push("DIRECT = direct");
  }
  data = arr.join("\n");
}

if (url.indexOf("rename=") != -1) {
  let rename = url.match(/rename=([^&]+)/)[1];
  let arr = rename.split("+");
  for (var i = arr.length - 1; i >= 0; i--) {
    let str = arr[i].match(/(.+)@([^&]+)/);
    var re = new RegExp(str[1], "g");
    data = data.replace(re, str[2]);
  }
}

if (url.indexOf("udp=") != -1) {
  data = data.replace(/,\s?udp-relay\s?=\s?(false|true)/g, "");
  let udp = url.match(/udp=(\d)/)[1];
  if (udp == 1) {
    data = data.split("\n");
    var arr = data.filter(function(e) {
      return e;
    });
    for (var i = arr.length - 1; i >= 0; i--) {
      arr[i] = arr[i] + ",udp-relay=true";
    }
    data = arr.join("\n");
  }
}

if (url.indexOf("tfo=") != -1) {
  data = data.replace(/,\s?tfo\s?=\s?(false|true)/g, "");
  let tfo = url.match(/tfo=(\d)/)[1];
  if (tfo == 1) {
    data = data.split("\n");
    var arr = data.filter(function(e) {
      return e;
    });
    for (var i = arr.length - 1; i >= 0; i--) {
      arr[i] = arr[i] + ",tfo=true";
    }
    data = arr.join("\n");
  }
}

if (url.indexOf("sort=") != -1) {
  let sort = url.match(/sort=(-?1)/)[1];
  let arr = data.split("\n");
  if (sort == 1) {
    arr.sort();
  } else {
    arr.reverse();
  }
  data = arr.join("\n");
}
    
$done({body: data});