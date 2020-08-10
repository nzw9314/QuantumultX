var body = $response.body;
var obj = JSON.parse(body);

obj.outPutModel.isVip = true;
obj.outPutModel.vipEndTime = "2022-05-21";
obj.outPutModel.nickName = "爱熬夜的好心人";
body = JSON.stringify(obj);
$done(body);

/*
^https:\/\/ayk\.tmdidi\.com\/api\/account\/suport url script-response-body pear2.js
*/
