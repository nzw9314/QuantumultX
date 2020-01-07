/*
[rewrite_local]
^https?:\/\/music\.163\.com url script-response-body MyConfig/js/cookie_netease_music.js

[mitm]
hostname = music.163.com
*/
let cookieName = `CookieWY`;
let headerCookie = $request.headers["Cookie"];
let historyCookie = $prefs.valueForKey(cookieName);
if (historyCookie) {
  if (historyCookie != headerCookie) {
    var cookie = $prefs.setValueForKey(headerCookie, cookieName);
    if (!cookie) {
      $notify("更新网易Cookie失败‼️‼️", "", "请重试");
    } else {
      $notify("更新网易Cookie成功🎉", "", "无需禁用脚本，仅cookie改变时才会重新获取");
    }
  }
} else {
  var cookie = $prefs.setValueForKey(headerCookie, cookieName);
  if (!cookie) {
    $notify("首次写入网易Cookie失败‼️‼️", "", "请重试");
  } else {
    $notify("首次写入网易Cookie成功🎉", "", "无需禁用脚本，仅cookie改变时才会重新获取");
  }
}
$done({});