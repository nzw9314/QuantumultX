let obj = JSON.parse($response.body);
let url = $request.url;
var cons = "payVerify";
var cons1= "imeiVerify";
if(url.indexOf(cons) != -1)
{
obj= {
  "product_id": "vip_privilege_monthly",
  "status": "0",
  "isBlacklist": "0",
  "transaction_id": "310000409847203",
  "cancellation_date": "",
  "expires_date": "2099-04-29 01:25:28 Etc/GMT",
  "current_date": "2019-05-02 13:15:02",
  "is_trial_period": "true",
  "msg": "验证成功",
  "original_transaction_id": "310000409847203",
  "purchase_date": "2019-04-26 01:25:28 Etc/GMT"
};
}
if(url.indexOf(cons1) != -1)
{
obj["list"][0]["expires_date"]= "2099-11-13 05:55:51";
}

$done({body: JSON.stringify(obj)});
