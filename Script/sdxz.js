/* Quantumult X 脚本: 闪电下载vip❤凉意  下载链接🔗 http://bbs.flashdown365.com/download.html

[rewrite_local] 
#闪电下载vip
^http\:\/\/app\.flashdown365\.com\/ios\/login url script-response-body sdxz.js
[mitm] hostname = app.flashdown365.com,

*/

let obj = JSON.parse($response.body);
obj.body.isvip = true
$done({body: JSON.stringify(obj)});
