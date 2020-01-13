/*
[Script]
cron "0 6 * * *" script-path=Shopee_checkin.js

http-request ^https:\/\/shopee\.vn\/me\/setting max-size=0,script-path=shopee_getcookie.js

MITM = shopee.vn
*/
  var shopeeUrl = {
    url: 'https://shopee.vn/mkt/coins/api/v2/checkin',
    headers: {
      Cookie: $persistentStore.read("CookieSP"),
    }
  }
$httpClient.post(shopeeUrl, function(error, response, data){
  if (error) {
$notification.post("Shopee checkin", "", "Lỗi kết nối‼️")
    $done(); 
  } 
 else{
 if(response.status == 200)
{
let obj= JSON.parse(data);
if(obj["data"]["success"])
{
var user = obj["data"]["username"];
var coins = obj["data"]["increase_coins"];
$notification.post("Shopee " + user, "", "Đã nhận được " + coins + "💰");
    $done();
}
}
else{
$notification.post("Shopee Cookie đã hết hạn‼️", "", "Hãy đăng nhập lại 🔓");
}
}
});
