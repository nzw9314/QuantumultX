/* Made by Meeta(西瓜视频官网：www.xg1.app)
更新：0701
1.文本编辑模式下复制粘贴
http-response https?:\/\/api2\.gkaorlz\.com\:8080\/api\/user\/ script-path=https://meetagit.github.io/MeetaRules/Surge/Scripting/watermelonvideo.js,requires-body=true
2.添加hostname = api2.gkaorlz.com
欢迎关注TG频道:@meetashare
*/

const path1 = "/api/user/get";
const path2 = "/api/user/getAdv";
const path3 = "api/user/getNotice";
var body = $response.body;
var url = $request.url;
if (url.indexOf(path1) != -1){
  let obj = JSON.parse(body);
  obj.content["nickName"] = "Meeta_share";
  obj.content["level"] = "5";
  obj.content["vipType"] = "3";
  obj.content["expirationTime"] = "3029548557000";
  body = JSON.stringify(obj);
}
if (url.indexOf(path2) != -1){
  let obj = JSON.parse(body);
  obj.content["img"] = "http://ww1.sinaimg.cn/large/0076dY5Wgy1g36mmbdvv7j30gf0zkwf2.jpg";
  obj.content["url"] = "https://s2.ax1x.com/2019/07/11/Zgxxpt.jpg";
  body = JSON.stringify(obj);
}
if (url.indexOf(path3) != -1){
  let obj = JSON.parse(body);
  obj.content["title"] = "Meeta 小贴士";
  obj.content["content"] = "<big>色不异空，空不异色，色即是空，空即是色，受想行识，亦复如是。舍利子，是诸法空相，不生不灭，不垢不净，不增不减。</big>";
  body = JSON.stringify(obj);
}

$done({body});




