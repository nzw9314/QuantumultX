/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
    您也可直接在tg中联系@wechatu
*/
// #region 固定头部
let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            //为了兼容qx中fetch的写法,所以永不reject
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
// #endregion



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



const address = "&location=auto_ip";//自动定位填 auto_ip , 精确定位填入 经纬度.
const k = "&key=填这里";//和风天气APIkey,可自行前往 https://dev.heweather.com/ 进行获取(注意key类型选WebApi)

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



var title = $persistentStore.read("city")+"天气 : "+$persistentStore.read("noweather")+" • "+$persistentStore.read("tmp")+" °C "+" | "+$persistentStore.read("ssd");
var subtitle = "降雨提醒 : "+$persistentStore.read("minute_forecast");
var mation = "风向 : "+$persistentStore.read("wind_dir")+" • "+$persistentStore.read("wind_sc")+"级 "+" | "+"  湿度 • "+$persistentStore.read("hum")+"%"+" | "+" PM2.5 • "+$persistentStore.read("pm25")+"\n生活指数 : "+$persistentStore.read("life")+"\n更新于 : "+$persistentStore.read("updatetime");
$notification.post(title, subtitle, mation);
$done();