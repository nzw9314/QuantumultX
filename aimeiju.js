/* 
#爱美剧（官网：xmj.app）
hostname = mjapp.whetyy.com
#广告
^http:\/\/mjapp\.whetyy\.com/index.php/app/ios/ads/index url reject-dict
^http:\/\/mjapp\.whetyy\.com/index.php/app/ios/ver/index_ios$ url reject
^http:\/\/mjapp\.whetyy\.com\/index\.php\/app\/ios\/pay\/ok$ url reject-dict
#VIP
^http:\/\/mjapp\.whetyy\.com\/index\.php\/app\/ios\/(user\/index|vod\/show|vod\/index) url script-response-body aimeiju.js
*/
var body = $response.body;
var url = $request.url;
const userinfo = "/index.php/app/ios/user/index"; //用户信息
const show = "/index.php/app/ios/vod/show"; 
const banner = "/index.php/app/ios/vod/index";//轮播广告

if (url.indexOf(userinfo) != -1){
  let obj = JSON.parse(body);
  obj.data.user["viptime"] = "2088-08-08 08:08:08";
  obj.data.user["cion"] = "88888";
  obj.data.user["vip"] = "1";
  body = JSON.stringify(obj);
}

if (url.indexOf(show) != -1) {
    let obj = JSON.parse(body);
    obj.data["looktime"] = -1;
    obj.data["vip"] = "4";
    obj.data.advertising = {};
    obj.data.CT_App_Show_Pic1  = "";
    obj.data.CT_App_Show_Vod1 = "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1519044039,3175177225&fm=26&gp=0.jpg";
    //上面这个删掉会显示广告图片，如果赋值为空，则视频不能自动播放，最好赋值为一个空格
    body = JSON.stringify(obj);
}

if (url.indexOf(banner) != -1) {
    let obj = JSON.parse(body);
    let data = obj.data
    for (var i = 0; i < data.length; i++) {
        if (data[i].ad == 1) {
            data.splice(i, 1)
            i -= 1
        }
    }
    body = JSON.stringify(obj);
}

$done({body});