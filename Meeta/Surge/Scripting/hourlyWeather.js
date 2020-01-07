const weaapi = "https://www.tianqiapi.com/api/?version=v6"

$httpClient.get(weaapi, function(error, response, data){
    if (error){
        console.log(error);
        $done();                   
    } else {
        var obj = JSON.parse(data);
        console.log(obj);
        var wea = obj.wea;
        var city = obj.city;
        var time = "天气更新于："+obj.update_time;
        let wmation = [wea,time,city];
        $notification.post(wmation[0], wmation[2], wmation[1]);
        $done();
    }
}
);

/* 每时天气(Made by Meeta)
文本编辑模式下复制粘贴
cron "* * * *" script-path=https://meetagit.github.io/MeetaRules/Surge/Scripting/hourlyWeather.js
天气预报每小时通过通知栏提醒一次（可以自己修改提醒频率)；
向通知中心发送通知，Surge iOS 上需开启通知总开关；
欢迎大家使用
欢迎关注TG频道:@meetashare
*/
