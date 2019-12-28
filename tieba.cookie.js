/*
[rewrite_local]
^https?:\/\/tieba.baidu\.com url script-response-body cookie_baidu_tieba.js

[mitm]
hostname = tieba.baidu.com
*/

var headerCookie = $request.headers["Cookie"];
if (headerCookie) {
  if (headerCookie.indexOf("BDUSS") == -1) {
    $notify("写入贴吧Cookie失败‼️‼️", "未获取到BDUSS", "请重试");
  } else {
    var cookie = $prefs.setValueForKey(headerCookie, "CookieTB");
    if (!cookie) {
      $notify("写入贴吧Cookie失败‼️‼️", "", "请重试");
    } else {
      $notify("写入贴吧Cookie成功🎉", "", "您可以手动禁用此脚本");
    }
  }
} else {
  $notify("写入贴吧Cookie失败‼️‼️", "", "请退出账号, 重复步骤");
}
$done({});