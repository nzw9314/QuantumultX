var result = body
let path = "/pay/memberCardSummary";
if (url.indexOf(path) != -1){
  var obj = JSON.parse(body);
  obj["expiredTime"] = 1747624048;
  obj["remainTime"] = 189302400;
  result = JSON.stringify(obj);
}
result;

/*
Made by Meeta (微信阅读)
https?:\/\/i\.weread\.qq.com\/pay\/memberCardSummary\?pf
hostname = i.weread.qq.com
*/
