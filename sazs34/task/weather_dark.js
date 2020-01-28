/*
具体配置可见
https://github.com/sazs34/TaskConfig#%E5%A4%A9%E6%B0%94
 */
let config = {
    darksky_api: "填这里", //从https://darksky.net/dev/ 上申请key填入即可
    aqicn_api: "填这里", //从http://aqicn.org/data-platform/token/#/ 上申请key填入即可
    huweather_apiKey: "填这里", //和风天气APIkey,可自行前往 https://dev.heweather.com/ 进行获取(注意key类型选WebApi)
    lat_lon: "填这里", //请填写经纬度,直接从谷歌地图中获取即可
    lang: "zh", //语言,请不要修改
    show: {
        log: 0, //调试日志,0为不开启,1为开启,2为开启精简日志
        icon: true, //是否显示图标信息,不显示会比较精简
        aqi: true, //空气质量以及风速显示,false则不显示
        uv: true, //紫外线显示,false则不显示
        apparent: true, //体感温度显示,false则不显示
        lifestyle: { //此处用于显示各项生活指数，可自行调整顺序，顺序越在前面则显示也会靠前，如果您不想查看某一指数，置为false即可，想看置为true即可
            comf: false, //舒适度指数,
            cw: false, //洗车指数,
            drsg: true, //穿衣指数,
            flu: false, //感冒指数,
            sport: false, //运动指数,
            trav: false, //旅游指数,
            uv: false, //紫外线指数,
            air: false, //空气污染扩散条件指数,
            ac: false, //空调开启指数,
            ag: false, //过敏指数,
            gl: false, //太阳镜指数,
            mu: false, //化妆指数,
            airc: false, //晾晒指数,
            ptfc: false, //交通指数,
            fsh: false, //钓鱼指数,
            spi: false, //防晒指数
        }
    }
}

var weatherInfo = {};
//clear-day, partly-cloudy-day, cloudy, clear-night, rain, snow, sleet, wind, fog, or partly-cloudy-night
//☀️🌤⛅️🌥☁️🌦🌧⛈🌩🌨❄️💧💦🌫☔️☂️ ☃️⛄️
function weather() {
    var durl = {
        url: `https://api.darksky.net/forecast/${config.darksky_api}/${config.lat_lon}?lang=${config.lang}&units=si&exclude=currently,minutely`
    };

    $task.fetch(durl).then(response => {
        try {
            let darkObj = JSON.parse(response.body);
            record(`天气数据获取-A1-${response.body}`);
            if (darkObj.error) {
                $notify("DarkApi", "出错啦", darkObj.error);
            }
            weatherInfo.icon = darkObj.hourly.icon;
            weatherInfo.dailyInfo = darkObj.daily.data[0];
            weatherInfo.hourlyInfo = darkObj.hourly;
            record(`天气数据获取-A2-${JSON.stringify(weatherInfo)}`);
            aqi();
        } catch (e) {
            console.log(`天气数据A获取报错${JSON.stringify(e)}`)
        }

    }, reason => {
        record(`天气数据获取-A3-${reason.error}`);
        $notify("Dark Sky", '信息获取失败', reason.error);
    });
}

function aqi() {
    let aurl = {
        url: `https://api.waqi.info/feed/geo:${config.lat_lon.replace(/,/, ";")}/?token=${config.aqicn_api}`,
        headers: {},
    }
    $task.fetch(aurl).then(response => {
        try {
            var waqiObj = JSON.parse(response.body);
            if (waqiObj.status == 'error') {
                $notify("Aqicn", "出错啦", waqiObj.data);
            }
            record(`天气数据获取-B1-${response.body}`);
            weatherInfo.city = getCityInfo(waqiObj.data.city.name);
            var aqi = getAqiInfo(waqiObj.data.aqi);
            weatherInfo.aqiInfo = {
                ...aqi
            }
            heweatherLifestyle();
        } catch (e) {
            console.log(`天气数据B获取报错${JSON.stringify(e)}`)
        }
    }, reason => {
        record(`天气数据获取-B2-${reason.error}`);
        $notify("Aqicn.org", '信息获取失败', reason.error);
    });
}

function heweatherLifestyle() {
    var needRequest = false;
    //判断一下是否全部都是false,全false的话,则不需要请求此接口直接返回渲染的数据了
    for (var item in config.show.lifestyle) {
        if (config.show.lifestyle[item]) {
            needRequest = true;
            break;
        }
    }
    if (needRequest) {
        var hurl = {
            url: `https://free-api.heweather.net/s6/weather/lifestyle?location=${config.lat_lon}&key=${config.huweather_apiKey}`,
        };

        $task.fetch(hurl).then(response => {
            try {
                record(`天气数据获取-C1-${response.body}`);
                var heObj = JSON.parse(response.body);
                weatherInfo.lifestyle = heObj.HeWeather6[0].lifestyle;
                render();
            } catch (e) {
                console.log(`天气数据C获取报错${JSON.stringify(e)}`)
            }
        }, reason => {
            record(`天气数据获取-C2-${reason.error}`);
            //因为此接口出错率还挺高的,所以即使报错我们也不处理,该返回什么就返回什么好了
            render();
        })
    } else {
        render();
    }
}

function render() {
    var notifyInfo = {
        title: `${weatherInfo.city}${weatherInfo.hourlyInfo.summary}`,
        subtitle: `${getWeatherDesc(weatherInfo.icon)} ${Math.round(weatherInfo.dailyInfo.temperatureMin)} ~ ${Math.round(weatherInfo.dailyInfo.temperatureMax)}℃  ${config.show.icon?'☔️':''}下雨概率 ${(Number(weatherInfo.dailyInfo.precipProbability) * 100).toFixed(1)}%`,
        detail: ''
    };
    var lineBreak = `
`;
    if (config.show.aqi) {
        notifyInfo.detail += `${notifyInfo.detail==""?"":lineBreak}${config.show.icon?'😷':''}空气质量 ${weatherInfo.aqiInfo.aqi}(${weatherInfo.aqiInfo.aqiDesc}) ${config.show.icon?'💨':''}风速${weatherInfo.dailyInfo.windSpeed}km/h`;
    }
    if (config.show.uv) {
        notifyInfo.detail += `${notifyInfo.detail==""?"":lineBreak}${config.show.icon?'🌚':''}紫外线指数${weatherInfo.dailyInfo.uvIndex}(${getUVDesc(weatherInfo.dailyInfo.uvIndex)})`;
    }
    if (config.show.apparent) {
        notifyInfo.detail += `${notifyInfo.detail==""?"":lineBreak}${config.show.icon?'🌡':''}体感温度${Math.round(weatherInfo.dailyInfo.apparentTemperatureLow)} ~ ${Math.round(weatherInfo.dailyInfo.apparentTemperatureHigh)}℃`;
    }
    if (weatherInfo.lifestyle && weatherInfo.lifestyle.length > 0) {
        for (var item in config.show.lifestyle) {
            if (config.show.lifestyle[item]) {
                var youAreTheOne = weatherInfo.lifestyle.filter(it => it.type == item);
                if (youAreTheOne && youAreTheOne.length > 0) {
                    notifyInfo.detail += `${notifyInfo.detail==""?"":lineBreak}${config.show.icon?'💡':''}[${youAreTheOne[0].brf}]${youAreTheOne[0].txt}`
                }

            }
        }
    }
    $notify(notifyInfo.title, notifyInfo.subtitle, notifyInfo.detail);
}

function getWeatherDesc(icon_text) {
    let icon = "❓"
    if (icon_text == "clear-day") icon = `${config.show.icon?'☀️':''}晴`;
    if (icon_text == "partly-cloudy-day") icon = `${config.show.icon?'🌤':''}晴转多云`;
    if (icon_text == "cloudy") icon = `${config.show.icon?'☁️':''}多云`;
    if (icon_text == "rain") icon = `${config.show.icon?'🌧':''}雨`;
    if (icon_text == "snow") icon = `${config.show.icon?'☃️':''}雪`;
    if (icon_text == "sleet") icon = `${config.show.icon?'🌨':''}雨夹雪`;
    if (icon_text == "wind") icon = `${config.show.icon?'🌬':''}大风`;
    if (icon_text == "fog") icon = `${config.show.icon?'🌫':''}大雾`;
    if (icon_text == "partly-cloudy-night") icon = `${config.show.icon?'🌑':''}多云`;
    if (icon_text == "clear-night") icon = `${config.show.icon?'🌑':''}晴`;
    return icon;
}

function getCityInfo(name) {
    var loc;
    try {
        var locArr = name.split(/[(),，（）]/)
        if (locArr.length >= 4) {
            loc = locArr[2] + " ";
        } else if (locArr.length >= 2) {
            loc = locArr[1] + " ";
        } else {
            loc = ""; //此时会很长,还不如不显示了
        }
    } catch (e) {
        loc = '';
        record(`获取城市名称失败-${JSON.stringify(e)}`);
    }
    return loc;
}

function getAqiInfo(aqi) {
    var aqiDesc = "";
    var aqiWarning = "";
    if (aqi > 300) {
        aqiDesc = `${config.show.icon?'🟤':''}严重污染`;
        aqiWarning = "儿童、老人、呼吸系统等疾病患者及一般人群停止户外活动";
    } else if (aqi > 200) {
        aqiDesc = `${config.show.icon?'🟣':''}重度污染`;
        aqiWarning = "儿童、老人、呼吸系统等疾病患者及一般人群停止或减少户外运动";
    } else if (aqi > 150) {
        aqiDesc = `${config.show.icon?'🔴':''}中度污染`;
        aqiWarning = "儿童、老人、呼吸系统等疾病患者及一般人群减少户外活动";
    } else if (aqi > 100) {
        aqiDesc = `${config.show.icon?'🟠':''}轻度污染`;
        aqiWarning = "老人、儿童、呼吸系统等疾病患者减少长时间、高强度的户外活动";
    } else if (aqi > 50) {
        aqiDesc = `${config.show.icon?'🟡':''}良好`;
        aqiWarning = "极少数敏感人群应减少户外活动";
    } else {
        aqiDesc = `${config.show.icon?'🟢':''}优`;
    }
    return {
        aqi,
        aqiDesc,
        aqiWarning
    };
}

function getUVDesc(daily_uvIndex) {
    var uvDesc = "";
    if (daily_uvIndex >= 10) {
        uvDesc = "五级-特别强";
    } else if (daily_uvIndex >= 7) {
        uvDesc = "四级-很强";
    } else if (daily_uvIndex >= 5) {
        uvDesc = "三级-较强";
    } else if (daily_uvIndex >= 3) {
        uvDesc = "二级-较弱";
    } else {
        uvDesc = "一级-最弱";
    }
    return uvDesc;
}

function record(log) {
    if (config.show.log == 1) {
        console.log(log);
    } else if (config.show.log == 2) {
        console.log(log.substring(0, 20));
    }
}

weather();