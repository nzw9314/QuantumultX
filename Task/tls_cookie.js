/*
公众号iosrule by红鲤鱼与绿鲤鱼与驴
2020.6.28


====================================
获取ck完毕可以禁止该js
#特仑苏获取Qx
https:\/\/xwsh\.javamall\.cn url script-request-body tls_cookie.js

#特仑苏获取ckloon

http-request https:\/\/xwsh\.javamall\.cn script-path=tls_cookie.js, requires-body=true, timeout=30, tag=特仑苏微信获取ck

====================================

MITM=xwsh.javamall.cn
获取完ck后在主机名后面➕.com 或者删掉tls的主机名
要获取ck时再删掉.com或者重新添加主机名
====================================

点击进入“特仑苏向往的生活”小程序授权登录后点击放牧获取ck
*/

//++++++++++++++++++++++++++++++++-
//1.需要申明的变量

const $iosrule = iosrule();//声明必须



const  telunsu="特仑苏";



const tls_signckname="tls_signckname";


//++++++++++++++++++++++++++++++++-


if ($iosrule.isRequest)
{

tls_writeck();
  
  }
$iosrule.end()
  
  
function tls_writeck() {

if ($request.headers) {

 var urlval = $request.url;

var md_header=$request.headers;
var md_bd=$request.body;
var tt=telunsu;
console.log(urlval)
if(urlval.indexOf("Api/TelunsuHandler2.ashx")>=0)
{
 var so= $iosrule.write(md_header.Cookie,tls_signckname);if (so==true) 
 papa(tt,"[签到ck]","写入" + tt + "签到数据成功");}




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