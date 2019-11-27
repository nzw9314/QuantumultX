var obj = JSON.parse($response.body);
 obj={
 "status": "success",
 "code": 0,
 "msg": "",
 "time": 4099010318,
 "data": {
  "uid": 42911,
  "tel": "18888888888",
  "nick_name": "大雄脚本组",
  "head_img": "",
  "money": "0.00",
  "level": 5,
  "hat": "",
  "end_time": 4099010318,
  "end_time_text": "2099-11-22"
 },
 "sign": "361ce7638d2c6890f6667354d18dce73"
};
$done({body: JSON.stringify(obj)});
//
