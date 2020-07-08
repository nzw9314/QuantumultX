/*
CaiYun Weather (ColorWeather) unlock Vip

QX 1.0.0:
^https:\/\/biz\.caiyunapp\.com\/v2\/user\?app_name\=weather url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/ColorWeather.js

MitM = biz.caiyunapp.com
*/

var _0xe0e0 = ["body", "parse", "xy_vip_expire", "result", "is_vip", "vip_expired_at", "is_xy_vip", "stringify", "vip_type"];// 新增 vip_type
var body = $response[_0xe0e0[0]];
var obj = JSON[_0xe0e0[1]](body);
obj[_0xe0e0[3]][_0xe0e0[2]] = 4096483190;
obj[_0xe0e0[3]][_0xe0e0[4]] = true;
obj[_0xe0e0[3]][_0xe0e0[5]] = 4096483190;
obj[_0xe0e0[3]][_0xe0e0[6]] = true;
obj[_0xe0e0[3]][_0xe0e0[8]] = "s";// 新加入
body = JSON[_0xe0e0[7]](obj);
$done(body)