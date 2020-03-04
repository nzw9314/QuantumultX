/*
什么值得买主屏去广告
[Surge 4]
http-response ^https?:\/\/homepage-api\.smzdm\.com\/home\?ad requires-body=1,max-size=-1,script-path=https://raw.githubusercontent.com/primovist/ScriptsForSurge/master/Scripts/SMZDM.js

[QuantumultX]
^https?:\/\/homepage-api\.smzdm\.com\/home\?ad url script-response-body nzw9314/Script/smzdm.js

[MITM]
hostname = *.smzdm.com
*/

let body = JSON.parse($response.body);
delete body.data.banner.big_banner;
delete body.data.banner.tonglan_banner;
body.data.rows.forEach((element, index) => {
  if (element.model_type == "ads") {
    body.data.rows.splice(index, 1);
  }
});
$done({
  body: JSON.stringify(body)
})