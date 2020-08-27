/*

By LTribe
Quantumult X 脚本:万里影视解锁VIP无限时长 

万里影视App Store版 : http://t.cn/A6zB6tlH
备用下载地址：http://t.cn/A6zB6IIG

[rewrite_local]
# 解锁万里影视VIP无限时长 （by LTribe）
^http?:\/\/.*\.arten.cn/login/login url script-response-body Wanliyingshi.js

[mitm]
hostname = *.arten.cn,

*/

let obj = JSON.parse($response.body);
obj.msg.time = 4102464235;
$done({body: JSON.stringify(obj)});