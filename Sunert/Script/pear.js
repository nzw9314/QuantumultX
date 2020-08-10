/*
app下载地址：https://is.gd/atCoeV

#圈Xpear解锁会员
^https:\/\/ayk\.tmdidi\.com\/api\/(movie\/WatchMovie|account\/IsVip|Account\/CheckVip|account\/IndexDetail|account\/IsSafeUser|PictureSet\/LookPhoto|account\/Milk|video\/watch.*|video\/WatchCount|account\/UserSetting) url script-response-body pear.js

MITM = ayk.tmdidi.com

*/

var body = $response.body;
var url = $request.url;
var obj = JSON.parse(body);

const vip = '/movie/WatchMovie';

const checkvip = '/account/IsVip';

const checkvip2 = '/Account/CheckVip';

const vipinfo = '/account/IndexDetail';

const safe = '/account/IsSafeUser';

const picfree = '/PictureSet/LookPhoto';

const spfree = '/video/watch';

const spcount = '/video/WatchCount';

const milk = '/account/Milk';

const point = '/account/UserSetting';

if (url.indexOf(vip) != -1) {
	obj["canWath"] = true;
	body = JSON.stringify(obj);
 }

if (url.indexOf(checkvip) != -1) {
	obj["data"] = 1;
   obj["value"] = true;
	body = JSON.stringify(obj);
 }
if (url.indexOf(checkvip2) != -1) {
	obj["data"] = 1;
   obj["value"] = true;
	body = JSON.stringify(obj);
 }

if (url.indexOf(vipinfo) != -1) {
	obj["nickName"] = "爱熬夜的好心人";
   obj["vipLevel"] = 3;
   obj["vipEndTime"] = "2222-05-21";
   obj["cartoonVip"] = true;
	body = JSON.stringify(obj);
 }
if (url.indexOf(safe) != -1) {
	obj["value"] = true;
	body = JSON.stringify(obj);
 }
if (url.indexOf(picfree) != -1) {
	obj["value"] = true;
	body = JSON.stringify(obj);
 }
if (url.indexOf(spfree) != -1) {
	obj["value"] = true;
	body = JSON.stringify(obj);
 }
if (url.indexOf(spcount) != -1) {
	obj["todayCanWatchCount"] = 9999;
	body = JSON.stringify(obj);
 }
if (url.indexOf(milk) != -1) {
	obj["milkName"] = "肯德鸡";
   	obj["milkLevel"] = 7;
	body = JSON.stringify(obj);
 }
if (url.indexOf(point) != -1) {
	obj["orderVip"] = true;
   	obj["accountHadSet"] = true;
   obj["memberPoint"] = 8000;
	body = JSON.stringify(obj);
 }


$done({body});

