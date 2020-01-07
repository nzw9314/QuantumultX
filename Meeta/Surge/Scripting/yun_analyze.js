/*
云盘解析（Made by Meeta)
使用方法:复制粘贴在 [Script] 下
http-request https?:\/\/pan\.baidu\.com\/s\/ script-path=https://meetagit.github.io/MeetaRules/Surge/Scripting/yun_analyze.js,requires-body=1

ps : 云盘解析脚本使用了度盘网页版解析
目前仅部分云盘分享链接可自动填写提取码，未来计划加入云盘万能钥匙
转载请注明来源哦🍺
欢迎关注TG频道:@meetashare

*/
var url = $request.url;
var murl = url.replace(/baidu/i, "baiduwp");
var furl = murl.replace(/https/i, "alook");
console.log(furl);
var title = "Meeta 正在为您解析百度云盘分享链接";
var subtitle = "如需下载该文件请下拉通知点击链接跳转";
$notification.post(title, subtitle, furl);

$done();
