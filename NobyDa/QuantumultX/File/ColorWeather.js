/*
CaiYun Weather (ColorWeather) unlock Vip

QX 1.0.0:
^https:\/\/biz\.caiyunapp\.com\/v2\/user\?app_name\=weather url script-response-body https://raw.githubusercontent.com/nzw9314/QuantumultX/master/NobyDa/QuantumultX/File/ColorWeather.js

MitM = biz.caiyunapp.com
*/

var body = $response.body;
 var url = $request.url;
 var obj = JSON.parse(body);
 const 1 = '/v2/user';
 if (url.indexOf(1) != -1) {
  obj.is_vip = true;
  obj.vip_expired_at = 9576796302; 
  obj.is_xy_vip = true; 
  obj.xy_vip_expire = 9576796302;
  body = JSON.stringify(obj);
}
 $done({
 body
}
);