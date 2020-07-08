/*
作者的邀请码:53150681
nzw9314邀请码: 12773106
公众号iosrule by红鲤鱼与绿鲤鱼与驴
2020.6.27

#惠头条签到定时执行任务，因为有阅读，视频和小视频三个奖励，建议2分钟以上频率.

1.2020627完成签到奖励,时段奖励,阅读奖励
2.2020628增加观视频奖励,小视频奖励,首页奖励，每日阅读资讯领金币
3.20200629修复每日任务的阅读资讯领金币待测试，首页奖励无法代码实现。加关闭任务通知功能。
4.没有改动界面。对上版本圈叉和loon通用修复,请匹配最新版的htt_cookie.js文件,本次发布在微信撸金币群。





问题:如果日志出现提示登录状态失效之类，点阅读软件首页时段奖励按钮获取ck。


loon定时格式参考
cron "0 21,31,50 0-22 * * ?" script-path=htt_task.js, tag=惠头条
*/


//以上是配置说明


const Notice=90;//设置运行多少次才通知。










//====================================

const $iosrule = iosrule();//声明必须
const httid="A";
const huitoutiao="惠头条";


//++++++++++++++++++++++++++++++++-

const htt_videoname="htt_videoname"+httid;
const htt_video=$iosrule.read(htt_videoname);

const htt_dongfangname="htt_dongfangname"+httid;
const htt_dongfang=$iosrule.read(htt_dongfangname);
const htt_smvideoname="htt_smvideoname"+httid;
const htt_smvideo=$iosrule.read(htt_smvideoname);


const htt_signurlckname="htt_signurlckname"+httid;
const htt_signurlck=$iosrule.read(htt_signurlckname);


const htt_signbdname="htt_signbdname"+httid;
const htt_signbd=$iosrule.read(htt_signbdname)
;



var htt_num=0;var htt_result="";

//++++++++++++++++++++++++++++++++













//++++++++++++++++++++++++++++++++

//3.需要执行的函数都写这里
function main()
{


htt_main();

  

}

function htt_main()
{


htt_coinall();


}



main()


//++++++++++++++++++++++++++++++++++++
//4.基础模板

function htt_homepage()
  {
   var result1="【首页奖励】";var result2="";
var tt=huitoutiao;
    const llUrl1 = {url:"https://api.cashtoutiao.com/frontend/homepage/top/ttsdk_ios/ad/feedback?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:htt_signbd,timeout:60};
 $iosrule.post(llUrl1, function(error, response, data) {
      console.log(data)
    var obj=JSON.parse(data);
   if(obj.statusCode==200)
result2="[金币]"+obj.reward;

else   if(obj.statusCode==-50)
result2=obj.msg;
   htt_msg(result1+"\n"+result2+"\n");
   })
 }


function htt_taskread5()
  {
   var result1="【每日任务阅读奖励】";var result2="";
var tt=huitoutiao;
var htt_signbd_task=JSON.parse(htt_signbd);
htt_signbd_task.taskId=5;htt_signbd_task=JSON.stringify(htt_signbd_task);
    const llUrl1 = {url:"https://api.cashtoutiao.com/frontend/daily/task/revision/draw?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:htt_signbd_task,timeout:60};
 $iosrule.post(llUrl1, function(error, response, data) {
      console.log(data)
    var obj=JSON.parse(data);
   if(obj.statusCode==200)
result2="[金币]"+obj.reward;

else   if(obj.statusCode==-50)
result2=obj.msg;
   htt_msg(result1+"\n"+result2+"\n");
   })
 }


function htt_daysign()
  {
   var result1="";var result2="";
var tt=huitoutiao;
const llUrl1 = {url:"https://api.cashtoutiao.com/frontend/sign?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:htt_signbd};var signjs=JSON.parse(htt_signbd);signjs["code"]=sign("%3Dhdfefni");signjs=JSON.stringify(signjs); const llUrl2 = {url:"https://api.cashtoutiao.com/frontend/invite?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:signjs};
 $iosrule.post(llUrl1, function(error, response, data) {
    
    console.log(data)
    var obj=JSON.parse(data)

   if(obj.statusCode==200)
{result2="[金币]"+obj.signCredit;
htt_signday(result2);}
else   if(obj.statusCode==-50)
{result2="[重复签到]";
htt_signday(result2);}})
    $iosrule.post(llUrl2, function(error, response, data){})}

function htt_hoursign()
  {
   var result1="【时段奖励】";var result2="";
var tt=huitoutiao;
    const llUrl1 = {url:"https://api.cashtoutiao.com/frontend/credit/sych/reward/per/hour?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:htt_signbd,timeout:60};
 $iosrule.post(llUrl1, function(error, response, data) {
      console.log(data)
    var obj=JSON.parse(data);
   if(obj.statusCode==200)
result2="[金币]"+obj.credit;

else   if(obj.statusCode==-50)
result2=obj.msg;
   htt_msg(result1+"\n"+result2+"\n");
   })
 }




function htt_signday(res)
  {
   var result1="【签到奖励】";var result2="";
var tt=huitoutiao;
    const llUrl1 = {url:"https://api.cashtoutiao.com/frontend/sign/record?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:htt_signbd,timeout:60};

 $iosrule.post(llUrl1, function(error, response, data) {
   
      console.log(data)
    var obj=JSON.parse(data)

   if(obj.statusCode==200)
result2=res+"  [签到天数]"+obj.day;

   htt_msg(result1+"\n"+result2+"\n");
   })
 }




function htt_read_dongfang()
  {
   var result1="【阅读奖励】";var result2="";
var tt=huitoutiao;
    const llUrl1 = {url:"https://api.cashtoutiao.com/frontend/read/sych/duration?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:htt_find(htt_dongfang),timeout:60};

 $iosrule.post(llUrl1, function(error, response, data) {
   console.log(data)
    var obj=JSON.parse(data)

   if(obj.statusCode==200)
   {if(data.indexOf("失败")<0)
{result2="[金币]"+obj.incCredit+" [今日阅读时长]"+formatSeconds(obj.todayDuration);}
else
{
  result2=obj.msg;result1="【阅读奖励失败】"
}

   htt_msg(result1+"\n"+result2+"\n");}
   })
 }




function htt_read_video()
  {
   var result1="【看视频奖励】";var result2="";
var tt=huitoutiao;


    const llUrl1 = {url:"https://api.cashtoutiao.com/frontend/read/sych/duration?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:htt_find(htt_video),timeout:60};

 $iosrule.post(llUrl1, function(error, response, data) {
   console.log(data)
    var obj=JSON.parse(data)

   if(obj.statusCode==200)
   {if(data.indexOf("失败")<0)
{result2="[金币]"+obj.incCredit+" [今日看视频时长]"+formatSeconds(obj.todayDuration);
}
else
{
  result2=obj.msg;result1="【看视频奖励失败】"
}

      }
 else
result2="请求失败*";
htt_msg(result1+"\n"+result2+"\n");

   })
 }


function htt_read_smvideo()
  {
   var result1="【看小视频奖励】";var result2="";
var tt=huitoutiao;


    const llUrl1 = {url:"https://api.cashtoutiao.com/frontend/read/sych/duration?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:htt_find(htt_smvideo),timeout:300};

 $iosrule.post(llUrl1, function(error, response, data) {
   console.log("小视频"+data)
    var obj=JSON.parse(data)

   if(obj.statusCode==200)
   {if(data.indexOf("失败")<0)
{result2="[金币]"+obj.incCredit+" [今日看小视频时长]"+formatSeconds(obj.todayDuration);
}
else
{
  result2=obj.msg;result1="【看小视频奖励失败】"
}

      }
 else
result2="请求失败*";
htt_msg(result1+"\n"+result2+"\n");

   })
 }







function htt_readtotal()
  {
   var result1="【收益统计】";var result2="";
var tt=huitoutiao;
    const llUrl1 = {url:"https://api.cashtoutiao.com/frontend/read/detail/today?"+htt_signurlck,headers:{"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"},body:htt_signbd,timeout:60};

 $iosrule.post(llUrl1, function(error, response, data) {
   
    var obj=JSON.parse(data)

   if(obj.statusCode==200)
   {result2=
 "[总金币]"+obj.userDailyReadRecord.durationCredit+"💰 "+formatSeconds(obj.userDailyReadRecord.totalDuration)+"\n"+
 "[观看视频]"+obj.userDailyReadRecord.videoDurationCredit+"💰"+formatSeconds(obj.userDailyReadRecord.videoDuration)+"\n"+
"[观看小视频]"+obj.userDailyReadRecord.smallVideoDurationCredit+"💰"+formatSeconds(obj.userDailyReadRecord.smallVideoDuration)+" "
+"\n"+
 "[分享收益]"+obj.userDailyReadRecord.shareClickCredit+"💰";
   htt_msg(result1+"\n"+result2+"\n");
;}})
}
   



function htt_msg(r)
{var tt=huitoutiao;
  htt_num++;htt_result+=r;
 if(htt_num==8)
  {var loon= $iosrule.read("iosrule");
 if (typeof(loon) !="undefined")
    {loon=loon.substring(7,loon.length);
 loon++;$iosrule.write("iosrule"+loon,"iosrule");}else{loon=1;
$iosrule.write("iosrule"+loon,"iosrule")
}     if (loon%Notice==0)
 {papa(tt,"[签到-时段-视频-阅读]"+"当前运行"+loon+"次",htt_result);loon=0;$iosrule.write("iosrule"+loon,"iosrule");loon=0; htt_result ="";$iosrule.write("iosrule"+loon,"iosrule");
    
    }
  }
}

function htt_coinall()

 {

 setTimeout(function(){
   htt_daysign();
 }, 1* 100);

 setTimeout(function(){
   htt_hoursign();
   htt_homepage();
   htt_taskread5();
 }, 5* 100);

 setTimeout(function(){
   htt_read_dongfang();
 }, 6* 100);

setTimeout(function(){
   htt_read_video();
 }, 35* 1000);

setTimeout(function(){
   htt_read_smvideo();
 }, 70* 1000);

setTimeout(function(){
  htt_readtotal();
 }, 71* 1000);

}



  
function htt_find(bd) {
if(JSON.parse(bd).hasOwnProperty("token"))
  {bd=JSON.parse(bd);delete bd["token"];bd=JSON.stringify(bd);
return bd;}
else
return bd;
}





function
formatSeconds(value) {
    let result = parseInt(value)
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
 
    let res = '';
    if(h !== '00') res += `${h}小时`;
    if(m !== '00') res += `${m}分`;
    res += `${s}秒`;
    return res;
  }


  
  


function papa(x,y,z){

 $iosrule.notify(x,y,z);}

function sign(code)  
{  
   code=unescape(code);  
   var c=String.fromCharCode(code.charCodeAt(0)-code.length);  
   for(var i=1;i<code.length;i++){  
       c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));  
   }  
   return c;  
}  



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