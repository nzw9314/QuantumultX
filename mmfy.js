var obj = JSON.parse($response.body);
 obj={
 "code": 10000,
 "message": "success",
 "userinfo": {
  "usertoken": "WYxpMuKBIFzWZ0UEUh2487GdzAM92WMtHJuRBnGzXN1VWfpKgMoX4kbszZ4XlfVo1Mof9DgkIazDJc5-4d_7wSC1IeraiWGRO1qF",
  "nickname": "",
  "head_portrait": "",
  "username": "hd_2727de42b01a97eeea7dcd448f656fc4",
  "nowtime": 1574604433,
  "lastloginip": "47.103.92.104",
  "lastlogintime": 1574604408,
  "createtime": 1574604381,
  "bindmobile": "",
  "bindemail": "",
  "ispwd": 0,
  "uid": 141896378,
  "accounttype": 5,
  "vip": [],
  "vip_valid": 1,
  "vip_deadline": 1669099631
 }
};
$done({body: JSON.stringify(obj)});
//
