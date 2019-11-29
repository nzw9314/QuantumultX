var obj = JSON.parse($response.body);
 obj={
 "data": {
  "level": 2,
  "status": 1,
  "openTime": "2099-10-20",
  "startTime": "2099-10-20",
  "endTime": "2099-10-20",
  "shareToken": ""
 },
 "code": 0,
 "msg": "返回成功"
};
$done({body: JSON.stringify(obj)});
//
