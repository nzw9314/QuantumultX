var api = "";
//dark sky api: https://darksky.net/dev
var api_aqi = ""
//aqi api: http://aqicn.org/data-platform/token/#/
var lang = "zh"
var lat_lon = "36.07592356270848,103.7693173638988"
var lat_lon_1 = lat_lon.replace(/,/, ";")

//有问题请通过Telegram反馈 https://t.me/Leped_Bot
//clear-day, partly-cloudy-day, cloudy, clear-night, rain, snow, sleet, wind, fog, or partly-cloudy-night
//☀️🌤⛅️🌥☁️🌦🌧⛈🌩🌨❄️💧💦🌫☔️☂️ ☃️⛄️
function weather() {
    var wurl = {
        url: "https://api.darksky.net/forecast/" + api + "/" + lat_lon + "?lang=" + lang + "&units=si&exclude=currently,minutely",
    };


    $task.fetch(wurl).then(response => {
        var obj = JSON.parse(response.body);
        //console.log(obj);
        var hour_summary = obj.hourly.summary;
        var icon_text = obj.hourly.icon;
        var icon = "❓"
        if (icon_text == "clear-day") icon = "☀️";
        if (icon_text == "partly-cloudy-day") icon = "🌤";
        if (icon_text == "cloudy") icon = "☁️";
        if (icon_text == "rain") icon = "🌧";
        if (icon_text == "snow") icon = "☃️";
        if (icon_text == "sleet") icon = "🌨";
        if (icon_text == "wind") icon = "🌬";
        if (icon_text == "fog") icon = "🌫";
        if (icon_text == "partly-cloudy-night") icon = "🌑";
        if (icon_text == "clear-night") icon = "🌑";
        var daily_prec_chance = obj.daily.data[0].precipProbability;
        var daily_maxtemp = obj.daily.data[0].temperatureMax;
        var daily_mintemp = obj.daily.data[0].temperatureMin;
        aqi(icon, daily_mintemp, daily_maxtemp, daily_prec_chance, hour_summary);

    }, reason => {
        $notify("Dark Sky", lat_lon + '信息获取失败', reason.error);
    });
}

function aqi(icon, daily_mintemp, daily_maxtemp, daily_prec_chance, hour_summary){
    let aqi = {
        url: "https://api.waqi.info/feed/geo:" + lat_lon_1 + "/?token=" + api_aqi,
        headers: {},
    }
    $task.fetch(aqi).then(response => {
        var obj1 = JSON.parse(response.body);
        //console.log(obj1);
        var aqi = obj1.data.aqi;
        var loc = obj1.data.city.name;
        loc = loc.split(",")[1];
        $notify(loc, icon + " " + Math.round(daily_mintemp) + " - " + Math.round(daily_maxtemp) + "°  ☔️ " + (Number(daily_prec_chance) * 100).toFixed(0) + "%" + "  😷 " + aqi, hour_summary);
    }, reason => {
    $notify("Aqicn.org", lat_lon + '信息获取失败', reason.error);
    });

}

weather()