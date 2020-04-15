/*
^https:\/\/m\.samh\.xndm\.tech\/userapi\/info\/v1\/getuserinfo url script-response-body Smh.js
hostname=m.samh.xndm.tech
*/




var body = $response.body;
var url = $request.url;
var obj = JSON.parse(body);
const ad = 'https://pangolin.snssdk.com/api/ad/union/sdk/get_ads/';
const vip = 'userapi/info/v1/getuserinfo';


if (url.indexOf(vip) != -1) {
    obj.data["viplevel"] = "3";
  obj.data["diamondViptime"]="1775575867000"

    body = JSON.stringify(obj);
} 
if ($request.url.indexOf(ad) != -1) {
delete obj.data.message;
}
$done({body: JSON.stringify(obj)});
