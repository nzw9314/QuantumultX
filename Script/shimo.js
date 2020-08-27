/*
石墨文档解锁VIP未测试，自行测试
https://api.shimo.im/users/
*/

let obj = JSON.parse($response.body);

obj.membership = {
    "accountTypeExpiredAt": "2099-04-30T16:00:00.000Z",
    "accountTypeCreatedAt": "2020-03-25T13:09:31.000Z",
    "accountType": "personal_premium",
    "isEnterprisePremium": true,
    "isExpired": false,
    "isNewDing": false,
    "isOfficial": true
  }

$done({body: JSON.stringify(obj)});
