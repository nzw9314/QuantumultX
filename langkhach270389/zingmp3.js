body = $response.body.replace(/"lastVipExpireTime".*\d{10}\n/, "");
let obj = JSON.parse(body);
obj["data"]["sessionsKey"]= "sm1.mfc_.1009719336.10.vjnZ26bVD1L1HnifQLyq5MbVD1LfNpGLQDphhpHVD1K";
obj["data"]["vip"]= {"expireTime":1869254270,"startTime":1572527803,"subscription":{"status":1,"expireTime": 1869254270,"platform":2},"vipType":1};
$done({body: JSON.stringify(obj)});