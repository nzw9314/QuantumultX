/* Quantumult X 脚本: 啪啪啪研究所vip❤凉意  下载链接🔗推荐码：NDHJVB
https://zhhml.cn?code=NDHJVB&channelCode=share

[rewrite_local] 
#JAV101无限观看
^https\:\/\/pwaapi\.gao1gps\.cn\/v1\/user\/info url script-response-body JAV101.js
[mitm] hostname = api.*.cn,

*/

if ($response.body != "") {
  let obj = JSON.parse($response.body);
  obj.response.expiry = 9576796302;
  obj.response.level = 2;
  $done({body: JSON.stringify(obj)});
} else {
  $done({body: $response.body});
}
