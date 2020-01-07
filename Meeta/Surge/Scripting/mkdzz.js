/*
快递追踪（Made by Meeta)
完善中，还有较大改造空间

cron "0 0 8-20/1 * * *" script-path=mkdzz.js

https://meetagit.github.io/MeetaRules/Surge/Scripting/mkdzz.js


向通知中心发送通知，Surge iOS 上需开启通知总开关；
欢迎大家使用
欢迎关注TG频道:@meetashare

常用快递公司代码：
 ("顺丰" "shunfeng"),
 ("中通" "zhongtong"),
 ("申通" "shentong"),
 ("圆通" "yuantong"),
 ("汇通" "huitongkuaidi"),
 ("韵达" "yunda"),
 ("EMS" "ems"),
 ("天天" "tiantian"),
 ("德邦" "debangwuliu")
*/




// 请在下方""内填入您的快递单号
var kdnum = "";

// 请在""内填入快递公司代码 （下面注释部分列举了常用快递公司的代码）
var kdcom = "";

const kdurl = "http://www.135cha.com/model/ajax.php?type="+kdcom+"&no="+kdnum;
function getkdmatioin(data){
    var obj = JSON.parse(data);
    //console.log(obj);
    let kdname = obj["com"];
    let updatetime = obj.data[0]["time"];
    let kdcontext = obj.data[0]["context"];
    let mm = [kdname, updatetime, kdcontext];
    return mm


}

$httpClient.get(kdurl, function(error, response, data){
    if (error){
        console.log(error);
        $done();                   
    } else {
        var mm = getkdmatioin(data);
        var title = "Meeta快递追踪：您的"+mm[0]+"快递 Coming";
        var subtitle = "更新时间："+mm[1];
        var mation = "最新信息："+mm[2];
        $notification.post(title, subtitle, mation);
        $done();
    }
}
);

