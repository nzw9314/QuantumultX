/*
iQIYI Checkin Get Cookie. by NobyDa

After launching iQIYI app. You can disable this script when a success notification pops up.
Note that the following config is only a local script configuration, please put this script into Quantumult X/Script

[rewrite_local]
https:\/\/passport\.iqiyi\.com\/apis\/user\/info\.action.*authcookie url script-response-body MyConfig/js/cookie_iqiyi.js

MITM = passport.iqiyi.com
*/

var regex = /authcookie=([A-Za-z0-9]+)/;
var iQIYI = regex.exec($request.url)[1];

if ($prefs.valueForKey("CookieQY") != undefined) {
if ($prefs.valueForKey("CookieQY") != iQIYI) {
var cookie = $prefs.setValueForKey(iQIYI, "CookieQY");
  if (!cookie){
    $notify("更新爱奇艺签到Cookie失败‼️", "", "")
    } else {
      $notify("更新爱奇艺签到Cookie成功 🎉", "", "")
    }
}
} else {
var cookie = $prefs.setValueForKey(iQIYI, "CookieQY");
  if (!cookie){
    $notify("首次写入爱奇艺Cookie失败‼️", "", "")
    } else {
      $notify("首次写入爱奇艺Cookie成功 🎉", "", "")
    }
}
$done({})
/*
var cookie = $prefs.setValueForKey(iQIYI, "CookieQY");

  if (!cookie){
    $notify("写入爱奇艺Cookie失败‼️‼️", "", "请重试")
    } else {
      $notify("写入爱奇艺Cookie成功🎉", "", "您可以手动禁用此脚本")
      console.log("爱奇艺Cookie : \n" + $prefs.valueForKey("CookieQY"))
    }
  $done({})
  */