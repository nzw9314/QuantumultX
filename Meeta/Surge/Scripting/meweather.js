/* Hourly weather(Made by Meeta)
cron "0 0 8-20/1 * * *" script-path=https://raw.githubusercontent.com/MeetaGit/MeetaRules/master/Surge/Scripting/meweather.js
PS:
a.远程脚本是通过ip定位，所以可能定位城市不够精确
  本地脚本通过经纬度定位比较准，不过比较麻烦，可自行选择
  本地脚本生成的workflow,请去TG频道获取
b.Lifestyle 是随机的生活建议包括（穿衣、洗车、感冒、紫外线、运动、舒适度、旅游、空气污染扩散条件 等)
c.使用此脚本的话个人建议将通知>Surge>横幅风格 改为临时，哈，我是不喜欢把这种通知堆积在通知栏的
d.由于免费接口限制每日访问量，请不要设置高频天气通知
  有高频通知需求的话建议可以自己注册和风天气，脚本更换key值即可

TG频道:@meetashare
*/



const address = "&location=auto_ip";
const k = "&key=faead3de5f42420098c8132b3924cd09";

const wea = "https://free-api.heweather.net/s6/weather/now?"+address+k;
const forecast = "https://widget-api.heweather.net/s6/plugin/sticker?key=acd0fdcab4b9481a98d0f59145420fac&location="+$persistentStore.read("cid")+"&lang=zh";
const weaqua = "https://free-api.heweather.net/s6/air/now?"+address+k;
const lifestyle = "https://free-api.heweather.net/s6/weather/lifestyle?"+address+k;

$httpClient.get(wea, function(error, response, data){
    if (error){
        console.log(error);
        $done();                   
    } else {
        var obj = JSON.parse(data);
        //console.log(obj);
        let city = obj.HeWeather6[0].basic["parent_city"];
        let cid = obj.HeWeather6[0].basic["cid"];
        let noweather = obj.HeWeather6[0].now["cond_txt"];
        let wind_dir = obj.HeWeather6[0].now["wind_dir"];
        let wind_sc = obj.HeWeather6[0].now["wind_sc"];
        let hum = obj.HeWeather6[0].now["hum"];
        let tmp = obj.HeWeather6[0].now["tmp"];
        let updatetime = obj.HeWeather6[0].update["loc"];
        $persistentStore.write(city, "city");
        $persistentStore.write(noweather, "noweather");
        $persistentStore.write(updatetime, "updatetime");
        $persistentStore.write(wind_dir, "wind_dir");
        $persistentStore.write(wind_sc, "wind_sc");
        $persistentStore.write(hum, "hum");
        $persistentStore.write(tmp, "tmp");
        $persistentStore.write(cid, "cid");
        $done(); 
    }
}
);
        

    
$httpClient.get(forecast, function(error, response, data){
    if (error){
        console.log(error);
        $done();                   
    } else {
        var obj = JSON.parse(data);
        //console.log(obj);
        var minute_forecast = obj.rain["txt"];
        $persistentStore.write(minute_forecast, "minute_forecast");
        $done(); 
    }
}
);

        
        
        
$httpClient.get(weaqua, function(error, response, data){
    if (error){
        console.log(error);
        $done();                   
    } else {
        var obj = JSON.parse(data);
        //console.log(obj);
        var qlty = obj.HeWeather6[0].air_now_city.qlty;
        var aqi = obj.HeWeather6[0].air_now_city.aqi;
        var pm25 = obj.HeWeather6[0].air_now_city.pm25;
        $persistentStore.write(qlty, "qlty");
        $persistentStore.write(aqi, "aqi");
        $persistentStore.write(pm25, "pm25");
        $done(); 
    }
}
);



$httpClient.get(lifestyle, function(error, response, data){
    if (error){
        console.log(error);
        $done();                   
    } else {
        var obj = JSON.parse(data);
        //console.log(obj); 
        var rng = Math.floor((Math.random()*8)+1);
        var ssd = obj.HeWeather6[0].lifestyle[0].brf;
        var life =  obj.HeWeather6[0].lifestyle[rng].txt;
        $persistentStore.write(ssd, "ssd");
        $persistentStore.write(life, "life");
        $done(); 
    }
}
);



var title = $persistentStore.read("city")+"天气 : "+$persistentStore.read("noweather")+" ` "+$persistentStore.read("tmp")+" °C "+" · "+$persistentStore.read("ssd")+"  AQI: "+$persistentStore.read("aqi")+"("+$persistentStore.read("qlty")+")";
var subtitle = "Minute_Forecast : "+$persistentStore.read("minute_forecast");
var mation = "风向 : "+$persistentStore.read("wind_dir")+" · "+$persistentStore.read("wind_sc")+" 级"+"  湿度 : "+$persistentStore.read("hum")+"  PM2.5 : "+$persistentStore.read("pm25")+"\nLifestyle : "+$persistentStore.read("life")+"\n更新于 : "+$persistentStore.read("updatetime")+"\n                                         ---  Meeta小贴士";
$notification.post(title, subtitle, mation);
$done();
