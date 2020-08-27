let obj= JSON.parse($response.body);

//fake user vip
delete obj.data.lastVipExpireTime;
obj.data.vip= {
  "expireTime": 1892800999,
  "startTime": 1572527803,
  "subscription": {
    "status": 0,
    "expireTime": 1892800999,
    "platform": 2
  },
  "vipType": 1
}

$done({body:JSON.stringify(obj)});
