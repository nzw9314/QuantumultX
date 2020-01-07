/* // 小小影视(Made by Meeta)
使用方法：
1.小小视频下载地址：http://tinyurl.com/y4thsp99
2.注册登录小小影视
3.Surge文本编辑模式下复制粘贴
http-response https?:\/\/ios\.xiaoxiaoapps\.com\/  script-path=https://meetagit.github.io/MeetaRules/Surge/Scripting/smallvideo.js,requires-body=true
4.添加hostname = ios.xiaoxiaoapps.com
欢迎大家使用和反馈
欢迎关注TG频道:@meetashare
*/

const path1 = "/ucp/index";
const path2 = "/vod/reqplay/";
const path3 = "/getGlobalData"
var body = $response.body;
var url = $request.url;
if (url.indexOf(path1) != -1){
	let obj = JSON.parse(body);
	obj.data.uinfo["down_daily_remainders"] = "998";
	obj.data.uinfo["play_daily_remainders"] = "998";
	obj.data.uinfo["goldcoin"] = "999";
	obj.data.uinfo["next_upgrade_need"] = "0";
	obj.data.uinfo.curr_group["gicon"] = "V5";
	obj.data.uinfo.curr_group["gid"] = "5";
	obj.data.uinfo.curr_group["minup"] = "20";
	obj.data.uinfo.curr_group["gname"] = "尊贵VIP";
	obj.data.user["isvip"] = "1";
	obj.data.user["nickname"] = "Meeta_share";
	obj.data.user["avatar_url"] = "https://img.sdxaly.com/C1/avatar/044/44414.jpeg?t=1563021092";
	obj.data.user["avatar"] = "044/44414.jpeg?t=1563021092"
	obj.data.user["goldcicon"] = "998";
	obj.data.user["gicon"] = "V5";
	obj.data.user["gid"] = "5";
	body = JSON.stringify(obj);
}
if (url.indexOf(path2) != -1){
	let obj = JSON.parse(body);
	//console.log(obj);
	obj.retcode = "0";
	obj.data.lastplayindex = "1";
	if(obj.data.hasOwnProperty("httpurl_preview")){
		var playurl = obj.data["httpurl_preview"];
		obj.data["httpurl"] = playurl;
	};
	body = JSON.stringify(obj);
}
if (url.indexOf(path3) != -1){
	let obj = JSON.parse(body);
	obj.data.adgroups.global_adgroup_ad1[0].countdown = "1";
	obj.data.adgroups.global_adgroup_ad1[0].pic = "http://ww1.sinaimg.cn/large/0076dY5Wgy1g36mmbdvv7j30gf0zkwf2.jpg";
	obj.data.adgroups.global_adgroup_ad1[0].url = "";
	obj.data.adgroups.global_adgroup_ad1[1].countdown = "1";
	obj.data.adgroups.global_adgroup_ad1[1].pic = "http://ww1.sinaimg.cn/large/0076dY5Wgy1g36mmbdvv7j30gf0zkwf2.jpg";
	obj.data.adgroups.global_adgroup_ad1[1].url = "";
	obj.data.adgroups.global_adgroup_ad1[2].countdown = "1";
	obj.data.adgroups.global_adgroup_ad1[2].pic = "http://ww1.sinaimg.cn/large/0076dY5Wgy1g36mmbdvv7j30gf0zkwf2.jpg";
	obj.data.adgroups.global_adgroup_ad1[2].url = "";
	obj.data.adgroups.global_adgroup_ad1[3].countdown = "1";
	obj.data.adgroups.global_adgroup_ad1[3].pic = "http://ww1.sinaimg.cn/large/0076dY5Wgy1g36mmbdvv7j30gf0zkwf2.jpg";
	obj.data.adgroups.global_adgroup_ad1[3].url = "";
	obj.data.adgroups.global_adgroup_ad1[4].countdown = "1";
	obj.data.adgroups.global_adgroup_ad1[4].pic = "http://ww1.sinaimg.cn/large/0076dY5Wgy1g36mmbdvv7j30gf0zkwf2.jpg";
	obj.data.adgroups.global_adgroup_ad1[4].url = "";
	body = JSON.stringify(obj);
}

$done({body});
