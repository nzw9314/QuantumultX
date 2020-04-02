/* Quantumult X 脚本: 韩剧tv(原名爱美剧) VIP❤凉意 韩剧tv 下载链接: https://h5.hjapi.bjxkhc.com/piglet_web/index.html#/shareGetRedBag?code=10000071
[rewrite_local] 
#韩剧tv解锁全部特权
^https\:\/\/hjapi\.bjxkhc\.com\/v2d2\/users\/.*\/member url script-response-body hanjuTV.js
[mitm] hostname = *.bjxkhc.com,
*/
let obj = JSON.parse($response.body);
 obj.data.member = 9576796302;
 obj.data.member_fhd = 4092599349;
 obj.data.member_download = 9576796302;
 obj.data.member_share_screen = 9576796302;
 obj.data.silver = 6796302;
 obj.data.member_barrage = 9576796302
 $done({
 body: JSON.stringify(obj)
}
);