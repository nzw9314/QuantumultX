/* 🍌️视频（Made by Meeta）
🍌️下载链接：http://tinyurl.com/y57j6hjg

1.文本编辑模式下复制粘贴
http-response https?:\/\/ios\.fuliapps\.com\/ script-path=https://meetagit.github.io/MeetaRules/Surge/Scripting/bananavideo.js,requires-body=true
2.添加hostname = ios.fuliapps.com
欢迎关注TG频道:@meetashare
*/




var body = $response.body;
var url = $request.url;
const path1 = "/ucp/index";
const path2 = "/getGlobalData";
const path3 = "/vod/reqplay/"
if (url.indexOf(path1) != -1){
  let obj = JSON.parse(body);
  obj.data.uinfo.down_daily_remainders = "998";
  obj.data.uinfo.play_daily_remainders = "998";
  obj.data.uinfo.curr_group["gicon"] = "V6";
  obj.data.uinfo.curr_group["gid"] = "6";
  obj.data.uinfo.curr_group["minup"] = "1000000";
  obj.data.uinfo.curr_group["gname"] = "尊贵VIP";
  obj.data.uinfo["next_upgrade_need"] = "0";
  obj.data.user.isvip = "1";
  obj.data.user.nickname = "Meeta_share";
  obj.data.user.gicon = "V6";
  obj.data.user.gid = "6";
  obj.data.user.avatar = "https://s2.ax1x.com/2019/07/11/ZRNrbq.th.jpg";
  body = JSON.stringify(obj);
}

if (url.indexOf(path2) != -1){
  let obj = JSON.parse(body);
  obj.data.app_launch_times_adshow = "0";
  obj.data.adgroups = "";
  obj.data.iOS_adgroups ="";
  body = JSON.stringify(obj);
}
if (url.indexOf(path3) != -1){
  let obj = JSON.parse(body);
  obj.retcode = "0";
  if(obj.data.hasOwnProperty("httpurl_preview")){
		var playurl = obj.data["httpurl_preview"];
		obj.data["httpurl"] = playurl;
	};
	body = JSON.stringify(obj);
}
$done({body});
