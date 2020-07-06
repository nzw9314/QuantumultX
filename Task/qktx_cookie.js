/*
公众号iosrule by红鲤鱼与绿鲤鱼与驴
2020.7.3
获取cookies文件
====================================
获取ck完毕可以禁止该js
#趣看天下ck Qx
https:\/\/(appv8\.qukantianxia\.com|appv7\.qukantx\.com) url script-request-header qktx_cookie.js

#趣看天下获取ck loon

http-request https:\/\/(appv8\.qukantianxia\.com|appv7\.qukantx\.com) script-path=qktx_cookie.js, requires-body=true, timeout=30, tag=趣看天下ck

====================================

MITM=appv8.qukantianxia.com,appv7.qukantx.com
====================================
*/

//++++++++++++++++++++++++++++++++-
//1.需要申明的变量

const $iosrule = iosrule();//声明必须
const qktxid="A";


const  qukantianxia="趣看天下";


const qktx_urlckname="qktx_urlckname"+qktxid;

const qktx_urlrckname="qktx_urlrckname"+qktxid;
const qktx_ridname="qktx_ridname"+qktxid;

const qktx_frboxurlname="qktx_frboxurlname"+qktxid;
const qktx_taskboxurlname="qktx_taskboxurlname"+qktxid;
const qktx_username="qktx_username"+qktxid;



//++++++++++++++++++++++++++++++++-


if ($iosrule.isRequest)
{

qktx_writeck();
  
  }
$iosrule.end()
  
  
function qktx_writeck() {

if ($request.headers) {

 var urlval = $request.url;

var md_header=$request.headers;
var md_bd=$request.body;
var tt=qukantianxia;



if(urlval.indexOf("qktx-activity/activity/openBox?")>=0)
{var so= $iosrule.write(urlval,qktx_frboxurlname);if (so==true) 
 papa(tt,"[好友开宝箱ck]","写入" + tt + "开宝箱数据成功");}

else if(urlval.indexOf("qktx-activity/activity/openActivityBox?")>=0)
{var so= $iosrule.write(urlval,qktx_taskboxurlname);if (so==true) 
 papa(tt,"[每日任务宝箱ck]","写入" + tt + "任务宝箱数据成功");}


else if(urlval.indexOf("user/userPoint.do?")>=0)
 {
   var val_url=urlval.substring(urlval.indexOf("userPoint.do?")+13,urlval.length);
   
   var so= $iosrule.write(val_url,qktx_username);if (so==true) 
  papa(tt,"[用户信息ck]","写入" + tt + "用户数据成功");}





else if(urlval.indexOf("qktx-content/showURL?")>=0)
{
  
  var ck_url=urlval.substring(urlval.indexOf("showURL")+8,urlval.length);
 var so= $iosrule.write(ck_url,qktx_urlckname);if (so==true) 
 papa(tt,"[阅读ck1]","写入" + tt + "阅读数据成功");}


else
if(urlval.indexOf("addCoin.json?")>=0)
{
  
  var rck_url=urlval.substring(urlval.indexOf("addCoin.json?")+13,urlval.length);
 var so= $iosrule.write(rck_url,qktx_urlrckname);if (so==true) 
 papa(tt,"[阅读ck2]","写入" + tt + "阅读数据成功");}

else
if(urlval.indexOf("qktx-content/task/getArticleRelationList?")>=0)
{
  
  var qktx_rid=urlval.substr(urlval.indexOf("taskId="),15);
  
   var fuckok= $iosrule.write(qktx_rid,qktx_ridname);
      
             if (fuckok==true) 
       papa(tt, "[写入阅读]", "写入阅读ck成功");
      
 
  }
  
  
  



}
}





//可以增加模块



function papa(x,y,z){
 $iosrule.notify(x,y,z);}




function iosrule() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};
