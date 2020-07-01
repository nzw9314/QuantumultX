/*
作者邀请码:53150681
nzw9314邀请码: 12773106
公众号iosrule by红鲤鱼与绿鲤鱼与驴

2020.6.28
增加小视频和视频奖励ck
2020.6.30更新获取ck的bug
点击签到获取ck
by红鲤鱼与绿鲤鱼与驴

====================================
获取ck完毕可以禁止该js
#惠头条签到获取Qx
#时段签到, 阅读数据, 小视频和视频 4个cookie


https:\/\/api\.cashtoutiao\.com url script-request-body htt_cookie.js

#惠头条签到获取ckloon

http-request https:\/\/api\.cashtoutiao\.com script-path=htt_cookie.js, requires-body=true, timeout=30, tag=惠头条CK

====================================

MITM=api.cashtoutiao.com
====================================
*/

//++++++++++++++++++++++++++++++++-
//1.需要申明的变量

const $iosrule = iosrule();//声明必须
const httid="A";


const  huitoutiao="惠头条";



const htt_dongfangname="htt_dongfangname"+httid;


const htt_signurlckname="htt_signurlckname"+httid;

const htt_signbdname="htt_signbdname"+httid;

const htt_videoname="htt_videoname"+httid;

const htt_smvideoname="htt_smvideoname"+httid;





//++++++++++++++++++++++++++++++++-


if ($iosrule.isRequest)
{

htt_writeck();
  
  }
$iosrule.end()
  
  
function htt_writeck() {

if ($request.headers) {

 var urlval = $request.url;

var md_header=$request.headers;
var md_bd=$request.body;

var tt=huitoutiao;


console.log(urlval)
if(urlval.indexOf("frontend/sign?")>=0)
{
 
var htt_signurlck=urlval.substring(urlval.indexOf("sign?")+5,urlval.length);

var httso= $iosrule.write(htt_signurlck,htt_signurlckname);
 var httbdo= $iosrule.write(md_bd,htt_signbdname);


if (httbdo==true&&httso==true) 
 papa(tt,"[签到ck]","写入" + tt + "签到数据成功");}

else if(urlval.indexOf("frontend/credit/sych/reward/per/hour?")>=0)
{
 
var htt_signurlck=urlval.substring(urlval.indexOf("hour?")+5,urlval.length);

var httso= $iosrule.write(htt_signurlck,htt_signurlckname);
 var httbdo= $iosrule.write(md_bd,htt_signbdname);


if (httbdo==true&&httso==true) 
 papa(tt,"[时段签到ck]","写入" + tt + "时段签到数据成功");}

else if(urlval.indexOf("frontend/read/sych/duration")>=0)
{

if(md_bd.indexOf("dongfang")>0)
 {

   
   var httbdo= $iosrule.write(md_bd,htt_dongfangname);
if (httbdo==true) 
 papa(tt,"[阅读ck]","写入" + tt + "阅读数据成功");}

else if(md_bd.indexOf("video")>0&&md_bd.indexOf("self_smallvideo")<0)

 {var httbdo= $iosrule.write(md_bd,htt_videoname);
if (httbdo==true) 
 papa(tt,"[视频ck]","写入" + tt + "视频数据成功");}

else if(md_bd.indexOf("self_smallvideo")>0)

 {var httbdo= $iosrule.write(md_bd,htt_smvideoname);
if (httbdo==true) 
 papa(tt,"[小视频ck]","写入" + tt + "小视频数据成功");}


}
}}






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
