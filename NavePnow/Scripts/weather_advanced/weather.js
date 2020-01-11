var api = "7dd82149462af52db7794ad498e3ff58";
//dark sky api: https://darksky.net/dev
var api_aqi = "2dfd0d7c3349545ec1e26b4815fc573b66924360"
//aqi api: http://aqicn.org/data-platform/token/#/
var lat_lon = "31.29923925574573,120.5795650906956"

const lang = "zh"
var lat_lon_1 = lat_lon.replace(/,/,";")
//第一行引号内填入申请到的dark sky api
//有问题请通过Telegram反馈 https://t.me/Leped_Bot
//clear-day, partly-cloudy-day, cloudy, clear-night, rain, snow, sleet, wind, fog, or partly-cloudy-night
//☀️🌤⛅️🌥☁️🌦🌧⛈🌩🌨❄️💧💦🌫☔️☂️ ☃️⛄️
async function launch() {
    await weather();
    $done();
}

launch()

function weather() {
    let info = {
        url: "https://api.darksky.net/forecast/" + api + "/" + lat_lon + "?lang=" + lang + "&units=si&exclude=currently,minutely",  //?lang=en&units=si
        headers: {},
    }
    
    $httpClient.get(info, async function (error, response, data) {
        if (error) {
            console.log(error);
            $notification.post("Dark Sky", lat_lon + '信息获取失败', error);
        } else {
            var obj = JSON.parse(data);
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
            
            //$notification.post("Dark Sky", icon + " " + Math.round(daily_mintemp) + " - " + Math.round(daily_maxtemp) + "  ☔️ " + (Number(daily_prec_chance) * 100).toFixed(1)+ "%", hour_summary);
            await aqi(icon, daily_mintemp, daily_maxtemp, daily_prec_chance, hour_summary);
        }
    });
}

function aqi(icon, daily_mintemp, daily_maxtemp, daily_prec_chance, hour_summary)
{
    // console.log(daily_mintemp)
    // console.log(daily_maxtemp)
    // console.log(daily_prec_chance)
    // console.log(hour_summary)
    let aqi = {
        url: "https://api.waqi.info/feed/geo:" + lat_lon_1 + "/?token=" + api_aqi, //?lang=en&units=si
        headers: {},
    }
    $httpClient.get(aqi, async function (error, response, data) {
        if (error) {
            console.log(error);
            $notification.post("Aqicn.org", lat_lon + '信息获取失败', error);
        } else {
            //console.log(data)
            var obj1 = JSON.parse(data);
            //console.log(obj1);
            var aqi = obj1.data.aqi;
            var loc = obj1.data.city.name;
            loc = loc.split(",")[1];

            //console.log(loc);
            //console.log(daily_mintemp);
            //$notification.post(daily_mintemp);
            $notification.post(loc, icon + " " + Math.round(daily_mintemp) + " - " + Math.round(daily_maxtemp) + "°  ☔️ " + (Number(daily_prec_chance) * 100).toFixed(0) + "%" + "  😷 " + aqi, hour_summary);
        }
    });
}