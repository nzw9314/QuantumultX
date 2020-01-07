/*
[rewrite_local]
^https?:\/\/tieba.baidu\.com url script-response-body cookie_baidu_tieba.js

[mitm]
hostname = tieba.baidu.com
*/

var regex = /(^|)BDUSS=([^;]*)(;|$)/
var cookieName = 'CookieTB';
var historyCookie = $prefs.valueForKey(cookieName);
var headerCookie = $request.headers["Cookie"].match(regex)[0];
if (historyCookie != undefined) {
  if (historyCookie != headerCookie) {
    var cookie = $prefs.setValueForKey(headerCookie, cookieName);
    if (!cookie) {
      $notify("更新贴吧Cookie失败‼️‼️", "", "");
    } else {
      $notify("更新贴吧Cookie成功🎉", "", `无需禁用脚本，仅cookie改变时才会重新获取`);
    }
  }
} else {
  var cookie = $prefs.setValueForKey(headerCookie, cookieName);
  if (!cookie) {
    $notify("首次写入贴吧Cookie失败‼️‼️", "", "");
  } else {
    $notify("首次写入贴吧Cookie成功🎉", "", `无需禁用脚本，仅cookie改变时才会重新获取`);
  }
}
$done({});