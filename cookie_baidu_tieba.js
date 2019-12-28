/*
TieBa Checkin Get Cookie.

About the author:
Telegram channel: @NobyDa
Telegram bots: @NobyDa_bot

Description :
When TieBa app is opened, click "My", If notification gets cookie success, you can use the check in script. because script will automatically judgment whether the cookie is updated, so you dont need to disable it manually.

[rewrite_local]
https?:\/\/c\.tieba\.baidu\.com\/c\/s\/login url script-response-body TieBa_GetCookie_QX.js

MITM = c.tieba.baidu.com
*/

var headerCookie = $request.headers["Cookie"];

if ($request.headers["Cookie"]) {
  if ($prefs.valueForKey("CookieTB") != undefined) {
    if ($prefs.valueForKey("CookieTB") != headerCookie) {
      if (headerCookie.indexOf("BDUSS") == -1) {
        $notify("更新贴吧Cookie失败‼️‼️ 无BDUSS", "", "");
      } else {
        var cookie = $prefs.setValueForKey(headerCookie, "CookieTB");
        if (!cookie) {
          $notify("更新贴吧Cookie失败‼️", "", "");
        } else {
          $notify("更新贴吧Cookie成功 🎉", "", "");
        }
      }
    }
  } else {
    if (headerCookie.indexOf("BDUSS") == -1) {
      $notify("首次写入贴吧Cookie失败,无BDUSS,请重试‼️‼️", "", "");
    } else {
      var cookie = $prefs.setValueForKey(headerCookie, "CookieTB");
      if (!cookie) {
        $notify("首次写入贴吧Cookie失败‼️", "", "");
      } else {
        $notify("首次写入贴吧Cookie成功 🎉", "", "");
      }
    }
  }
}
$done({})