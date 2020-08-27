/*

quake解锁Quantumult X配置
[mitm]
quakeapp.com

[rewrite_local](注意路径）
https:\/\/quakeapp\.com\/quakeapi\/v2\/u\/appLaunch url script-request-body Local/remove_ad/quake.js
https:\/\/quakeapp\.com\/quakeapi\/v2\/u\/appLaunch url script-response-body Local/remove_ad/quake.js

*/

if ($request) {
  var obj = JSON.parse($request.body);
  obj.ispremium = "1";
  $done({ body: JSON.stringify(obj) });
}

/*
if ($response) {
  obj = JSON.parse($response.body);
  obj.resultsCount = "0";
  $done({ body: JSON.stringify(obj) });
}
*/
