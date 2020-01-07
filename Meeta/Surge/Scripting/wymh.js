var body = $response.body;
var url = $request.url;
const path = '/getUserProfile';
let obj = JSON.parse(body)
if (url.indexOf(path) != -1) {
	obj["resCode"] = 0;
	obj["data"]["money"] = 10111;
	obj["data"]["hongbao"] = 6666;
	obj["data"]["realVipType"] = 1;
	obj["data"]["score"] = 9999;
        obj["data"]["userType"] = 1;
        obj["data"]["level"] = "VIP8";
        obj["data"]["yuepiao"] = 666;
        obj["data"]["to"] = 7262649741721;
        obj["data"]["from"] = 1543574359721;
        obj["data"]["avatar"] = "http://ww1.sinaimg.cn/large/0076dY5Wgy1g36mmbdvv7j30gf0zkwf2.jpg"
        obj["data"]["nickname"] = "Hi Meeta"
	body = JSON.stringify(obj);
   
 }

$done({body});


 
 // Made by Meeta (网易漫画）

 // hostname = api-163.biliapi.net

 //http-response https?:\/\/api-163\.biliapi\.net\/getUserProfile
