/*

bjyd去开屏广告Quantumult X配置
[mitm]
mobilebj.cn

[rewrite_local](注意路径）
#bjyd_remove_ad
https:\/\/mobilebj\.cn\/app\/appBasicInfo? url script-response-body bjyd.js

#粗暴（但还有3s）
https:\/\/mobilebj\.cn\/app\/appBasicInfo? url reject
*/

let obj=JSON.parse($response.body);

obj.startimg_showtime=0;
obj.startimg_url="";
obj.startimg_visitlink="";
obj.startimglist[0].startimg_showtime=0;
obj.startimglist[0].startimg_url="";
obj.startimglist[0].startimg_visitlink="";

$done({body: JSON.stringify(obj)})
