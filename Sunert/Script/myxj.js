/*
[rewrite_local]
#美颜相机一次性解锁内购（by黑黑酱）
^https:\/\/api\.meiyan\.com\/iap\/verify\.json url script-response-body myxj.js

Surge4.0: https://api.meiyan.com/iap/verify.json

[MITM]
hostname:api.meiyan.com

*/


var obj = JSON.parse($response.body);
 
obj = {
   "meta": {
     "app_validate_result": 0,
     "bundleName": "pay",
     "code": 0,
     "msg": "success",
     "enabled": true,
     "paid": true,
     "user": null,
     "id": 56990,
     "subscription": 0,
     "request_uri": "/iap/verify",
     "error": ""
   },
   "response": {
     "status": 1
   }
 }

$done({body: JSON.stringify(obj)});
