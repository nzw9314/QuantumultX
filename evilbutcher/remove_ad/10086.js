/*

10086去开屏广告Quantumult X配置
[mitm]
10086.online-cmcc.cn

[rewrite_local](注意路径）
#10086_remove_ad
https:\/\/10086\.online\-cmcc\.cn\:20010\/gfms\/front\/hn\/busi3\!getAdvert url script-response-body 10086.js

*/

let obj=JSON.parse($response.body);

obj.flag=0;
obj.content=" ";

$done({body: JSON.stringify(obj)})
