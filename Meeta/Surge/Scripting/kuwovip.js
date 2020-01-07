var body = $response.body;
var url = $request.url;
const path1 = "/AdService/kaiping/";
const path2 = "/vip/v2/user/vip";

function ad_kaiping() {
	let obj = JSON.parse(body);
	obj.url = "http://ww1.sinaimg.cn/large/0076dY5Wgy1g36mmbdvv7j30gf0zkwf2.jpg";
	body = JSON.stringify(obj);
}

function svip_kuwo() {
	let obj = JSON.parse(body);
	obj.data["isNewUser"] = "2";
	obj.data["vipLuxuryExpire"] = "1835312949000";
	obj.data["time"] = "1961170340993";
	obj.data["isYearUser"] = "2";
	obj.data["vipmExpire"] = "1835312949000";
	obj.data["vipOverSeasExpire"] = "1835312949000";
	obj.data["vipExpire"] = "1835312949000";
	obj.data["vip3Expire"] = "1835312949000";
body = JSON.stringify(obj);
}

if (url.indexOf(path1) != -1){
	ad_kaiping()

}

if (url.indexOf(path2) != -1){
	svip_kuwo()

}
	

$done({body});


/* Made by Meeta(酷我音乐)
https?:\/\/.*\.kuwo\.cn
*/


