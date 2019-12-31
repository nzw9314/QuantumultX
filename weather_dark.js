/*
具体配置可见
https://github.com/sazs34/TaskConfig#%E5%A4%A9%E6%B0%94
 */
let config = {
    darksky_api: `adff46a828dcf7e9686aa52170a1db8a`, //从https://darksky.net/dev/ 上申请key填入即可
    aqicn_api: `dc9f948c8d9a8a1f10c2bc5bba60c4dd2e0dec4a`, //从http://aqicn.org/data-platform/token/#/ 上申请key填入即可
    lat_lon: "30.6393910,114.8632089", //请填写经纬度,直接从谷歌地图中获取即可
    lang: 'zh', //语言,请不要修改
    uv: true, //紫外线显示,false则不显示
    apparent: true, //体感温度显示,false则不显示
    tips: true //空气质量建议显示,false则不显示
}

//clear-day, partly-cloudy-day, cloudy, clear-night, rain, snow, sleet, wind, fog, or partly-cloudy-night
//☀️🌤⛅️🌥☁️🌦🌧⛈🌩🌨❄️💧💦🌫☔️☂️ ☃️⛄️
function weather() {
    var wurl = {
        url: "https://api.darksky.net/forecast/" + config.darksky_api + "/" + config.lat_lon + "?lang=" + config.lang + "&units=si&exclude=currently,minutely",
    };


    $task.fetch(wurl).then(response => {
        let obj = JSON.parse(response.body);
        // console.log("天气数据获取-1", obj);
        let icon_text = obj.hourly.icon;
        let icon = "❓"
        if (icon_text == "clear-day") icon = "☀️晴";
        if (icon_text == "partly-cloudy-day") icon = "🌤晴转多云";
        if (icon_text == "cloudy") icon = "☁️多云";
        if (icon_text == "rain") icon = "🌧雨";
        if (icon_text == "snow") icon = "☃️雪";
        if (icon_text == "sleet") icon = "🌨雨夹雪";
        if (icon_text == "wind") icon = "🌬大风";
        if (icon_text == "fog") icon = "🌫大雾";
        if (icon_text == "partly-cloudy-night") icon = "🌑";
        if (icon_text == "clear-night") icon = "🌑";
        let weatherInfo = {
            icon,
            daily_prec_chance: obj.daily.data[0].precipProbability,
            daily_maxtemp: obj.daily.data[0].temperatureMax,
            daily_mintemp: obj.daily.data[0].temperatureMin,
            daily_windspeed: obj.daily.data[0].windSpeed,
            daily_uvIndex: obj.daily.data[0].uvIndex,
            hour_summary: obj.hourly.summary,
            apparentTemperatureLow: obj.daily.data[0].apparentTemperatureLow,
            apparentTemperatureHigh: obj.daily.data[0].apparentTemperatureHigh
        }
        // console.log(`天气数据获取-2-${JSON.stringify(weatherInfo)}`);
        aqi(weatherInfo);

    }, reason => {
        $notify("Dark Sky", '信息获取失败', reason.error);
    });
}

function aqi(weatherInfo) {
    const {
        icon,
        daily_prec_chance,
        daily_maxtemp,
        daily_mintemp,
        daily_windspeed,
        hour_summary,
        daily_uvIndex,
        apparentTemperatureLow,
        apparentTemperatureHigh
    } = weatherInfo;
    let aqi = {
        url: "https://api.waqi.info/feed/geo:" + config.lat_lon.replace(/,/, ";") + "/?token=" + config.aqicn_api,
        headers: {},
    }
    $task.fetch(aqi).then(response => {
        var obj1 = JSON.parse(response.body);
        // console.log(`天气数据获取-3-${JSON.stringify(obj1)}`);
        var aqi = obj1.data.aqi;
        var loc = obj1.data.city.name;
        try {
            loc = loc.split(",")[1].split("(")[0];
        } catch (e) {
            loc = '';
            console.log(`获取城市名称失败-${JSON.stringify(e)}`);
        }
        var aqiInfo = getAqiInfo(aqi);
        var weather = `${icon} ${Math.round(daily_mintemp)} ~ ${Math.round(daily_maxtemp)}℃  ☔️下雨概率 ${(Number(daily_prec_chance) * 100).toFixed(1)}%`;
let detail = `😷空气质量 ${aqi}(${aqiInfo.aqiDesc}) 💨风速${daily_windspeed}km/h`;
        if (config.uv) {
            detail += `
🌚紫外线指数${daily_uvIndex}(${getUVDesc(daily_uvIndex)})`;
        }
        if (config.apparent) {
            detail += `
🤔体感温度${Math.round(apparentTemperatureLow)} ~ ${Math.round(apparentTemperatureHigh)}℃`;
        }
        if (config.tips) {
            detail += `
${aqiInfo.aqiWarning?"Tips:":""}${aqiInfo.aqiWarning}`;
        }
        $notify(`(${loc})${hour_summary}`, weather, detail);
    }, reason => {
        $notify("Aqicn.org", '信息获取失败', reason.error);
    });
}

function getAqiInfo(aqi) {
    var aqiDesc = "";
    var aqiWarning = "";
    if (aqi > 300) {
        aqiDesc = "🟤严重污染";
        aqiWarning = "儿童、老人、呼吸系统等疾病患者及一般人群停止户外活动";
    } else if (aqi > 200) {
        aqiDesc = "🟣重度污染";
        aqiWarning = "儿童、老人、呼吸系统等疾病患者及一般人群停止或减少户外运动";
    } else if (aqi > 150) {
        aqiDesc = "🔴中度污染";
        aqiWarning = "儿童、老人、呼吸系统等疾病患者及一般人群减少户外活动";
    } else if (aqi > 100) {
        aqiDesc = "🟠轻度污染";
        aqiWarning = "老人、儿童、呼吸系统等疾病患者减少长时间、高强度的户外活动";
    } else if (aqi > 50) {
        aqiDesc = "🟡良好";
        aqiWarning = "极少数敏感人群应减少户外活动";
    } else {
        aqiDesc = "🟢优";
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

weather()