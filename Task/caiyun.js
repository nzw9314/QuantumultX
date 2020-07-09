/**
 * 彩云天气 v0.1 alpha
 * @author: Peng-YM
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/caiyun.js
 * 
 * 功能：
 * √ 自动定位
 * √ 异常天气预警
 * √ 实时天气预报
 * 
 * TODO:
 * - 降雨提醒
 * - 每日睡前预报
 * 
 * 配置：
 * 1. 配置自动定位
 * 根据平台添加如下配置
 * (1). Quantumult X
 * [MITM]
 * hostname=weather-data.apple.com
 * [rewrite_local]
 * https://weather-data.apple.com url script-request-header https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/caiyun.js
 * 
 * (2). Loon
 * [MITM]
 * hostname=weather-data.apple.com
 * [Script]
 * http-request https://weather-data.apple.com script-path=https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/caiyun.js, require-body=false
 * 
 * (3). Surge
 * [MITM]
 * hostname=weather-data.apple.com
 * [Script]
 * type=http-request, pattern=https://weather-data.apple.com, script-path=https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/caiyun.js, require-body=false
 * 
 * 打开手机设置 > 隐私 > 定位服务
 * (1) 打开定位服务
 * (2) 选择天气，设置永远允许天气访问位置信息，并允许使用精确位置。
 * 
 * 2. 配置cron任务
 * 3. 打开box.js设置API token即可。
 * 
 */

/********************** SCRIPT START *********************************/
const $ = API("caiyun");

const ERR = MYERR();

if (typeof $request !== 'undefined') {
  // get location from request url
  const url = $request.url;
  const res = url.match(/weather\/.*?\/(.*)\/(.*)\?/);
  if (res === null) {
    $.notify("[彩云天气]", "❌ 正则表达式匹配错误", `🥬 无法从URL: ${url}获取位置。`);
    $.done({ body: $request.body });
  }
  location = {
    latitude: res[1],
    longitude: res[2]
  }
  if (!$.read("location")) {
    $.notify("[彩云天气]", "", "🎉🎉🎉 获取定位成功。");
  }
  if ($.read("display_location") == true) {
    $.info(`成功获取当前位置：纬度 ${location.latitude} 经度 ${location.longitude}`);
  }
  $.write(location, "location");
  $.done({ body: $request.body });
} else {
  // this is a task
  !(async () => {
    if (!$.read("token")) {
      // no token found
      throw new ERR.TokenError("❌ 未找到Token");
    } else if (!$.read("location")) {
      // no location
      $.notify("[彩云天气]", "❌ 未找到定位", "🤖 您可能没有正确设置MITM，请检查重写是否成功。");
    } else {
      await scheduler();
    }
  })().catch((err) => {
    if (err instanceof ERR.TokenError)
      $.notify("[彩云天气]", err.message, "🤖 由于API Token具有时效性，请前往\nhttps://t.me/cool_scripts\n获取最新Token。", {
        "open-url": "https://t.me/cool_scripts"
      });
    else
      $.notify("[彩云天气]", "❌ 出现错误", err.message);
  }).finally($.done());
}

async function scheduler() {
  const now = new Date();
  $.log(`Scheduler activated at ${now.getMonth() + 1}月${now.getDate()}日${now.getHours()}时${now.getMinutes()}分`);
  await query();
  weatherAlert();
  realtimeWeather();
  // hourlyForcast();
  // dailyForcast();
}

async function query() {
  const now = new Date();
  // check last updated time
  const STABLE_UPDATE_TIME = (5 + Math.random()) * 60 * 1000;
  const updated = $.read("updated");
  if (updated === undefined || now - new Date(updated) > STABLE_UPDATE_TIME) {
    // query API
    const url = `https://api.caiyunapp.com/v2.5/${$.read("token").caiyun}/${$.read("location").longitude},${$.read("location").latitude}/weather?lang=zh_CN&dailystart=0&hourlysteps=384&dailysteps=16&alert=true`;

    $.log("Query weather...");

    const weather = await $.get({
      url,
      headers: {
        'User-Agent': 'ColorfulCloudsPro/5.0.10 (iPhone; iOS 14.0; Scale/3.00)'
      }
    }).then(resp => {
      const body = JSON.parse(resp.body);
      if (body.status === 'failed') {
        throw new ERR.TokenError(`❌ 无效的彩云天气Token: ${$.read("token").caiyun}`);
      }
      return body;
    }).catch(err => {
      throw err;
    });

    $.log("Query location...");
    const address =
      await $
        .get(`https://apis.map.qq.com/ws/geocoder/v1/?key=${$.read("token").tencent}&location=${$.read("location").latitude},${$.read("location").longitude}`)
        .then(resp => {
          const body = JSON.parse(resp.body);
          if (body.status !== 0) {
            throw new ERR.TokenError("❌ 腾讯地图Token错误");
          }
          return body.result.address_component;
        }).catch(err => {
          throw err;
        });
    $.write(new Date().getTime(), "updated");
    $.write(weather, "weather");

    if ($.read("display_location") == true) {
      $.info(JSON.stringify(address));
    }
    $.write(address, "address");
  }
}

function weatherAlert() {
  const data = $.read("weather").result.alert;
  const address = $.read("address");
  const alerted = $.read("alerted") || [];

  if (data.status === 'ok') {
    data.content.forEach(alert => {
      if (alerted.indexOf(alert.alertId) === -1) {
        $.notify(
          `[彩云天气] ${address.city} ${address.district} ${address.street}`, alert.title, alert.description
        );
        alerted.push(alert.alertId);
        if (alerted.length > 10) {
          alerted.shift();
        }
        $.write(alerted, "alerted");
      }
    });
  }
}

function realtimeWeather() {
  const data = $.read("weather").result;
  const address = $.read("address");

  const alert = data.alert;
  const alertInfo = alert.content.length == 0 ? "" : alert.content.reduce((acc, curr) => {
    if (curr.status === '预警中') {
      return acc + "\n" + mapAlertCode(curr.code) + "预警";
    } else{
      return acc;
    } 
  }, "[预警]") + "\n\n";

  const realtime = data.realtime;
  const keypoint = data.forecast_keypoint;

  const hourly = data.hourly;

  let hourlySkycon = "[未来3小时]\n";
  for (let i = 0; i < 3; i++) {
    const skycon = hourly.skycon[i];
    const dt = new Date(skycon.datetime);
    const now = dt.getHours() + 1;
    dt.setHours(dt.getHours() + 1)
    hourlySkycon += `${now}-${dt.getHours() + 1}时 ${mapSkycon(skycon.value)}` + (i == 2 ? "" : "\n")
  }

  $.notify(
    `[彩云天气] ${address.city} ${address.district} ${address.street}`,
    `${mapSkycon(realtime.skycon)} ${realtime.apparent_temperature} ℃  🌤 空气质量 ${realtime.air_quality.description.chn}`,
    `${keypoint}
🌡 体感${realtime.life_index.comfort.desc} ${realtime.temperature} ℃  💧 湿度 ${realtime.humidity.toFixed(2) * 100}%
🌞 紫外线 ${realtime.life_index.ultraviolet.desc} 
💨 风力 ${mapWind(realtime.wind.speed, realtime.wind.direction)}

${alertInfo}${hourlySkycon}
`);
}

function dailyForcast() {
}

/************************** 天气对照表 *********************************/

function mapAlertCode(code) {
  const names = {
    "01": "🌪 台风",
    "02": "⛈ 暴雨",
    "03": "❄️ 暴雪",
    "04": "❄ 寒潮",
    "05": "💨 大风",
    "06": "💨 沙尘暴",
    "07": "☄️ 高温",
    "08": "☄️ 干旱",
    "09": "⚡️ 雷电",
    "10": "💥 冰雹",
    "11": "❄️ 霜冻",
    "12": "💨 大雾",
    "13": "💨 霾",
    "14": "❄️ 道路结冰",
    "15": "🔥 森林火灾",
    "16": "⛈ 雷雨大风"
  };

  const intensity = {
    "01": "蓝色",
    "02": "黄色",
    "03": "橙色",
    "04": "红色"
  };

  const res = code.match(/(\d{2})(\d{2})/);
  return `${names[res[1]]}${intensity[res[2]]}`
}

function mapWind(speed, direction) {
  let description = "";
  if (speed < 1) {
    description = "无风";
  } else if (speed <= 5) {
    description = "1级 清风徐徐";
  } else if (speed <= 11) {
    description = "2级 清风";
  } else if (speed <= 19) {
    description = "3级 树叶摇摆";
  } else if (speed <= 28) {
    description = "4级 树枝摇动";
  } else if (speed <= 38) {
    description = "5级 风力强劲";
  } else if (speed <= 49) {
    description = "6级 风力强劲";
  } else if (speed <= 61) {
    description = "7级 风力超强";
  } else if (speed <= 74) {
    description = "8级 狂风大作";
  } else if (speed <= 88) {
    description = "9级 狂风呼啸";
  } else {
    description = ">9级 超级强风";
  }
  return description;
}

// 天气状况 --> 自然语言描述
function mapSkycon(skycon) {
  const map = {
    "CLEAR_DAY": "☀️ 日间晴朗",
    "CLEAR_NIGHT": "✨ 夜间晴朗",
    "PARTLY_CLOUDY_DAY": "⛅️ 日间多云",
    "PARTLY_CLOUDY_NIGHT": "☁️ 夜间多云",
    "CLOUDY": "☁️ 阴",
    "LIGHT_HAZE": "😤 轻度雾霾",
    "MODERATE_HAZE": "😤 中度雾霾",
    "HEAVY_HAZE": "😤 重度雾霾",
    "LIGHT_RAIN": "💧 小雨",
    "MODERATE_RAIN": "💦 中雨",
    "HEAVY_RAIN": "🌧 大雨",
    "STORM_RAIN": "⛈ 暴雨",
    "LIGHT_SNOW": "🌨 小雪",
    "MODERATE_SNOW": "❄️ 中雪",
    "HEAVY_SNOW": "☃️ 大雪",
    "STORM_SNOW": "⛄️暴雪",
    "DUST": "💨 浮尘",
    "SAND": "💨 沙尘",
    "WIND": "🌪 大风"
  }
  return map[skycon];
}

// 雷达降 水/雪 强度 --> skycon
function mapPrecipitation(intensity) {
  if (0.031 < intensity && intensity < 0.25) {
    return "LIGHT";
  } else if (intensity < 0.35) {
    return "MODERATE";
  } else if (intensity < 0.48) {
    return "HEADY";
  } else if (intensity >= 0.48) {
    return "STORM";
  }
}

function mapIntensity(breakpoints) {

}

/************************** ERROR *********************************/
function MYERR() {
  class TokenError extends Error {
    constructor(message) {
      super(message);
      this.name = "TokenError";
    }
  }

  return {
    TokenError
  }
}

// prettier-ignore
/*********************************** API *************************************/
function API(t = "untitled", s = !1) { return new class { constructor(t, s) { this.name = t, this.debug = s, this.isQX = "undefined" != typeof $task, this.isLoon = "undefined" != typeof $loon, this.isSurge = "undefined" != typeof $httpClient && !this.isLoon, this.isNode = "function" == typeof require, this.isJSBox = this.isNode && "undefined" != typeof $jsbox, this.node = (() => this.isNode ? { request: "undefined" != typeof $request ? void 0 : require("request"), fs: require("fs") } : null)(), this.cache = this.initCache(), this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`), Promise.prototype.delay = function (t) { return this.then(function (s) { return ((t, s) => new Promise(function (e) { setTimeout(e.bind(null, s), t) }))(t, s) }) } } get(t) { return this.isQX ? ("string" == typeof t && (t = { url: t, method: "GET" }), $task.fetch(t)) : new Promise((s, e) => { this.isLoon || this.isSurge ? $httpClient.get(t, (t, i, o) => { t ? e(t) : s({ status: i.status, headers: i.headers, body: o }) }) : this.node.request(t, (t, i, o) => { t ? e(t) : s({ ...i, status: i.statusCode, body: o }) }) }) } post(t) { return this.isQX ? ("string" == typeof t && (t = { url: t }), t.method = "POST", $task.fetch(t)) : new Promise((s, e) => { this.isLoon || this.isSurge ? $httpClient.post(t, (t, i, o) => { t ? e(t) : s({ status: i.status, headers: i.headers, body: o }) }) : this.node.request.post(t, (t, i, o) => { t ? e(t) : s({ ...i, status: i.statusCode, body: o }) }) }) } initCache() { if (this.isQX) return JSON.parse($prefs.valueForKey(this.name) || "{}"); if (this.isLoon || this.isSurge) return JSON.parse($persistentStore.read(this.name) || "{}"); if (this.isNode) { const t = `${this.name}.json`; return this.node.fs.existsSync(t) ? JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(t, JSON.stringify({}), { flag: "wx" }, t => console.log(t)), {}) } } persistCache() { const t = JSON.stringify(this.cache); this.log(`FLUSHING DATA:\n${t}`), this.isQX && $prefs.setValueForKey(t, this.name), (this.isLoon || this.isSurge) && $persistentStore.write(t, this.name), this.isNode && this.node.fs.writeFileSync(`${this.name}.json`, t, { flag: "w" }, t => console.log(t)) } write(t, s) { this.log(`SET ${s} = ${JSON.stringify(t)}`), this.cache[s] = t, this.persistCache() } read(t) { return this.log(`READ ${t} ==> ${JSON.stringify(this.cache[t])}`), this.cache[t] } delete(t) { this.log(`DELETE ${t}`), delete this.cache[t], this.persistCache() } notify(t, s, e, i) { const o = "string" == typeof i ? i : void 0, n = e + (null == o ? "" : `\n${o}`); this.isQX && (void 0 !== o ? $notify(t, s, e, { "open-url": o }) : $notify(t, s, e, i)), this.isSurge && $notification.post(t, s, n), this.isLoon && $notification.post(t, s, e), this.isNode && (this.isJSBox ? require("push").schedule({ title: t, body: s ? s + "\n" + e : e }) : console.log(`${t}\n${s}\n${n}\n\n`)) } log(t) { this.debug && console.log(t) } info(t) { console.log(t) } error(t) { console.log("ERROR: " + t) } wait(t) { return new Promise(s => setTimeout(s, t)) } done(t = {}) { this.isQX || this.isLoon || this.isSurge ? $done(t) : this.isNode && !this.isJSBox && "undefined" != typeof $context && ($context.headers = t.headers, $context.statusCode = t.statusCode, $context.body = t.body) } }(t, s) }
/*****************************************************************************/
