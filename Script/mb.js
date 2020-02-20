var obj = JSON.parse($response.body);
 obj={
 "code": 0,
 "msg": null,
 "data": {
  "level": 2    ,
  "phone": null,
  "encryptPassword": null,
  "name": "大雄脚本组",
  "id": 4960640,
  "passSecure": false,
  "vipEndDate": "20330912"
 }
};
$done({body: JSON.stringify(obj)});
//
