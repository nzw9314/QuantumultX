
/*
^https?://m.client.10010.com/uniAdmsInterface/getHomePageAd url script-response-body china_unicom.js

hostname=m.client.10010.com
*/

const url = $request.url
var body = $response.body
const path1 = "/uniAdmsInterface/getHomePageAd"
if (url.indexOf(path1) != -1) {
let obj = JSON.parse(body);
if (obj.diffNetCard_A7) obj.diffNetCard_A7 = [];
obj.homeAdv_A5.advCntList = [];
body = JSON.stringify(obj);
$done({ body });
}

