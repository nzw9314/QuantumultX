const weaapi = "https://www.tianqiapi.com/api/?version=v6&appid=13333885&appsecret=v8OEJUMb"

$httpClient.get(weaapi, function(error, response, data){
    if (error){
        console.log(error);
        $done();                   
    } else {
        var obj = JSON.parse(data);
        console.log(obj);
        var city = "所在城市： " + obj.city+ "  •  " + obj.tem + "℃" ;;
        var wea = "天气状况： " + obj.wea +"  •  " + obj.tem2 + "℃～" + obj.tem1 + "℃"
        var air = "当前风力： " + obj.win + "  •  "+obj.win_speed + "      风速" + obj.win_meter + "\n空气指数： " +obj.air + "  •  "+ obj.air_level +"  |  湿度  •  " + obj.humidity+"  |  能见度  •  "+obj.visibility+ "\n友情提示： " + obj.air_tips + "\n更新时间： " + obj.update_time;
        let wmation = [city,wea,air];
        $notification.post(wmation[0], wmation[1], wmation[2]);
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
