/* Made by Meeta(bilibili)
update 0810
此次更新仅更新了Surge api 适用于Surge 3 4.0以后的版本
清晰度破解未测试（听说还有效）,请各位自行测试
如有追番需求,请开大会员
http-response https?:\/\/app\.bilibili\.com\/x\/ script-path=https://meetagit.github.io/MeetaRules/Surge/Scripting/bili.js,requires-body=true
hostname = app.bilibili.com
欢迎关注TG频道:@meetashare
*/

var body = $response.body;
var url = $request.url;
let path1 = "/x/v2/account/mine";
let path2 = "/x/playurl"
let path3 = "/x/v2/account/myinfo?"
if (url.indexOf(path1) != -1){
  let obj = JSON.parse(body);
  obj.data.bcoin = 2019;
  obj.data.coin = 520;
  obj.data.audio_type = 2;
  obj.data.vip_type = 2;
  obj.data.level = 8;
  obj.data.vip.due_date = 3041424000000;
  obj.data.vip.status = 1;
  obj.data.vip.vip_pay_type = 1;
  obj.data.vip_section.start_time = 1554912000;
  obj.data.vip_section.end_time = 1839081600;
  obj.data.vip_section_v2.title = "🍀Meeta(1080p60),vip仅自慰";
 body = JSON.stringify(obj);
  
}
if (url.indexOf(path2) != -1){
  let obj = JSON.parse(body);
  obj.data.quality = obj.data.accept_quality[0];
  if(obj.data.quality = 116){obj.data.format = "flv_p60"};
  if(obj.data.quality = 112){obj.data.format = "hdflv2"};
  if(obj.data.quality = 74){obj.data.format = "flv720_p60"};
  body = JSON.stringify(obj);

}
if (url.indexOf(path3) != -1){
  let obj = JSON.parse(body);
  obj.data.level = 8;
  obj.data.type = 1;
  obj.data.due_date = 3041424000000;
  obj.data.vip.status = 1;
  obj.data.vip.vip_pay_type = 1;
  body = JSON.stringify(obj);
  }

$done({body});

