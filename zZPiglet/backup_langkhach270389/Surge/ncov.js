/*
Surge V4 ios, Mac
Api by junookyo

[Script]
cron "0 0 6-23/3 * * *" script-path=ncov.js


MITM = code.junookyo.xyz
*/
  var ncovUrl = {
    url: 'https://code.junookyo.xyz/api/ncov-moh/data.json',
  }
$httpClient.post(ncovUrl, function(error, response, data){
  if (error) {
$notification.post("NCOV", "", "Bad connection")
    $done(); 
  } 
 else{
 if(response.status == 200)
{
let obj= JSON.parse(data);
if(obj["success"])
{
obj= obj["data"];
$notification.post("NCOV ","","🇻🇳 VN: Số người nhiễm: " + obj["vietnam"]["cases"] +", Người chết: " + obj["vietnam"]["deaths"] + ", Hồi phục: " + obj["vietnam"]["recovered"] +"\n🌍 Global:  Số người nhiễm: " + obj["global"]["cases"] +", Người chết: " + obj["global"]["deaths"] + ", Hồi phục: " + obj["global"]["recovered"]);
    $done();
}
}
else{
$notification.post("NCOV", "", "API ERROR");
}
}
});
