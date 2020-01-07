/*
JingDong Check in Get Cookie. by NobyDa

Need to manually log in to the https://bean.m.jd.com checkin to get cookie. When QX pops up to get a successful notification, you can disable the script.
Note that the following config is only a local script configuration, please put this script into Quantumult X/Script

[rewrite_local]
https:\/\/api\.m\.jd\.com\/client\.action.*functionId=signBeanIndex url script-response-body cookie_jd_bonus.js

[mitm]
hostname = api.m.jd.com
*/
let cookieName = `CookieJD`;
let headerCookie = $request.headers["Cookie"];
let historyCookie = $prefs.valueForKey(cookieName);
if (historyCookie) {
  if (historyCookie != headerCookie) {
    var cookie = $prefs.setValueForKey(headerCookie, cookieName);
    if (!cookie) {
      $notify("更新京东Cookie失败‼️‼️", "", "请重试");
    } else {
      $notify("更新京东Cookie成功🎉", "", "无需禁用脚本，仅cookie改变时才会重新获取");
    }
  }
} else {
  var cookie = $prefs.setValueForKey(headerCookie, cookieName);
  if (!cookie) {
    $notify("首次写入京东Cookie失败‼️‼️", "", "请重试");
  } else {
    $notify("首次写入京东Cookie成功🎉", "", "无需禁用脚本，仅cookie改变时才会重新获取");
  }
}
$done({});