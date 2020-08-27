


/* 奇热小说
进入收费章节-点击"立即解锁"
#rewrite
^https://api.weiqire.com/api3/(visitor/|user/unlockCharpter) url script-response-body qrxs.js
#mitm
hostname = api.weiqire.com
*/



var body = $response.body;
var url = $request.url;
var obj = JSON.parse(body);

const path1 = '/api3/visitor/';

if(url.indexOf(path1) != -1){
  obj.data.enough = 1;}
else { 
var reg1 = new RegExp("bid=(\\d+)");
var reg2 = new RegExp("sort=(\\d+)");
var bid = url.match(reg1);
var sort = url.match(reg2);
obj.status = "success";
obj.msg = "操作成功";
obj.code = 1;
obj.data.bid = parseInt(bid[1]);
obj.data.sort = [parseInt(sort[1])];
}
body = JSON.stringify(obj);
$done({body});
