/* Quantumult X 脚本: 筋斗云影院❤凉意 下载链接: http://jdytv.cn/app/index/qudao.html?uid=Mjg3NzQ=
//显示到期时间后即可关闭Quantumult X,开着代理可能无法播放视频
[rewrite_local] 
#筋斗云tv破解到期时间
^http\:\/\/jdytv\.cn\/login\/login\/veifys url script-response-body jdyTV.js
[mitm] hostname = jdytv.cn,
*/
let obj = JSON.parse($response.body);
 obj.msg.time = 9576796302;
 $done({
 body: JSON.stringify(obj)
}
);