/*
   🐬@toulanboy
   📕更新地址：https://github.com/toulanboy/scripts

   *********************************************
   Loon, surge, quanx配置教程（建议使用BoxJs修改变量）
   *********************************************
   1️⃣Box用户：远程订阅该js脚本。     非Box用户：请下载到本地使用。
   2️⃣Box用户：在BoxJs中订阅https://raw.githubusercontent.com/toulanboy/scripts/master/toulanboy.boxjs.json
   3️⃣打开https://weather.com/zh-CN/weather/today， 搜索你的城市，然后切换到【每小时】。
   4️⃣Box用户将 地址栏的链接填到 box里面的“tlb_weather_url”。  非Box用户：请填在第24行。
   5️⃣认真检查链接是否正确。正确的链接是包含hourbyhour字样的，下述是参考样例！
   样例参考：https://weather.com/zh-CN/weather/hourbyhour/l/f6de1330f517758fbcfe51946263fb8485477d27f5ab1e3f2d9f88b0e823f544
   
   💢【强烈建议】，增加一条分流规则：
   host-suffix, weather.com, proxy

   [Loon config]
   cron "0 6,12,17 * * *" script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weather/weather.js, tag=下雨提醒
   [Quanx config]
   0 6,12,17 * * * https://raw.githubusercontent.com/toulanboy/scripts/master/weather/weather.js, img-url=https://raw.githubusercontent.com/Orz-3/task/master/weather.png, tag=下雨提醒
   [surge config]
   下雨提醒= type=cron,cronexp="0 6,12,17 * * *",script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/weather/weather.js, wake-system=true

*/
const $ = new Env('⏰ 下雨提醒')
$.weather_url = ""   //这里需要你填。支持在boxjs中设置。
$.pre_hours = 24     //预测未来24小时，最多48小时
$.timeout = 2000     //超时限制，单位ms
$.always_notify = false
$.rain_test = false
if ($.weather_url == "" && $.getdata('tlb_weather_url') != undefined && $.getdata('tlb_weather_url') != "") {
    $.weather_url = $.getdata('tlb_weather_url')
}
if ($.getdata('tlb_pre_hours') != undefined && $.getdata('tlb_pre_hours') != "") {
    $.pre_hours = $.getdata('tlb_pre_hours') * 1
    if ($.pre_hours > 48) {
        $.pre_hours = 48
        $.setdata(48, 'tlb_pre_hours')
    }
}
if ($.getdata('tlb_rain_timeout') != undefined && $.getdata('tlb_rain_timeout') != "") {
    $.timeout = $.getdata('tlb_rain_timeout') * 1
    if ($.timeout > 4000) {
        $.timeout = 4000
        $.setdata(4000, 'tlb_rain_timeout')
    }
}
if ($.getdata('tlb_always_notify') != undefined) {
    if ($.getdata('tlb_always_notify') == true || $.getdata('tlb_always_notify') == 'true')
        $.always_notify = true
    else if ($.getdata('tlb_always_notify') == false || $.getdata('tlb_always_notify') == 'false')
        $.always_notify = false
}
if ($.getdata('tlb_rain_test') != undefined) {
    if ($.getdata('tlb_rain_test') == true || $.getdata('tlb_rain_test') == 'true')
        $.rain_test = true
    else if ($.getdata('tlb_rain_test') == false || $.getdata('tlb_rain_test') == 'false')
        $.rain_test = false
}
!(async () => {
    $.log('', `🔔 ${$.name}, 开始!`, '')
    if (!$.rain_test) {
        $.msg($.name, "🚫暂停使用【长按查看具体说明】", "😭目前偶尔出现请求超时的问题。\n🌧而这会导致quanx或者loon重启，建议同学们换用其他大佬的天气脚本。\n🙁后续会尝试找稳定的天气接口，有需要的小伙伴可以点击此通知关注github。", "https://github.com/toulanboy/scripts")
        return
    }
    if ($.weather_url == undefined || $.weather_url == "" || $.weather_url.match(/hourbyhour/) == undefined || $.weather_url.match(/^https:.*?/) == undefined) {
        $.msg($.name, "", "🚫启动失败，请配置weather_url，具体配置过程请阅读js文件。")
        $.done()
        return
    }
    await getw()

})()
.catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
})
.finally(() => {
    $.log('', `🔔 ${$.name}, 结束!`, ''), $.done()
    return
})
function random_num(min_num,max_num){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*min_num+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(max_num-min_num+1)+min_num,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
}
function getw() {
    return new Promise((resolve) => {
        agent_rand = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_${random_num(11,15)}_${random_num(1,5)}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${random_num(70,83)}.0.${random_num(2000,4000)}.${random_num(1,200)} Safari/537.36`
        // console.log(agent_rand) 
        url = {
            url: $.weather_url,
            headers: {
                'user-agent':agent_rand,
            }
        }
        $.get(url, (error, response, data) => {
            if (error) {
                // $.msg($.name, "", "🚫请求出现错误，具体看日志")
                console.log("🚫请求出现错误，具体如下：")
                console.log(error)
                resolve()
                throw new Error(error)
            }
            body = response.body
            city_name = body.match(/locationCard">.*?locationName--.*?>(.*?)</)
            if (city_name != undefined) {
                console.log(city_name[1])
                $.city_name = city_name[1]
            }
            else {
                console.log("🚫 获取城市名称失败")
                $.city_name = "🚫 获取城市名称失败"
            }
            var is_tomorrow = false
            var is_notify = false
            var time_prefix = ""
            var count = 1
            $.message = ""
            const reg_time = /daypartName.*?>(\d+:\d+)/g //g代表全局模式，可以多次匹配
            const reg_tmp = /TemperatureValue.*?DetailsSummary--tempValue.*?>(.*?)</g
            const reg_rain_p = /PercentageValue">(.*?)</g
            
            while ((r = reg_time.exec(body)) && (count <= $.pre_hours)) {
                time_point = r[1]
                tmp = reg_tmp.exec(body)[1]
                rain_p = reg_rain_p.exec(body)[1] 
                if (count == 1) {
                    $.message += `🌈 当前温度 ${tmp}，降雨概率为${rain_p}。\n⬇️ 未来${$.pre_hours}小时内大概率降雨如下\n`
                }
                time_point = time_prefix + time_point
                if (!is_tomorrow && parseInt(r[1].replace(/:\d+/, "")) == 23) {
                    time_prefix = "明天"
                    is_tomorrow = true
                }
                else if (is_tomorrow && parseInt(r[1].replace(/:\d+/, "")) == 23) {
                    time_prefix = "后天"
                }
                console.log(`${time_point}，温度${tmp}，下雨概率${rain_p}`)
                if (parseInt(rain_p.replace(/°/, "")) >= 50) {
                    is_notify = true
                    $.message += `🌧 ${time_point}，温度${tmp}，下雨概率${rain_p}。\n`
                }
                count++
            }
            if ($.always_notify || is_notify){
                if(!is_notify) $.message += "🌟 当前降雨概率都不大于50%\n"
                $.msg(`${$.name}:${$.city_name}`, ``, $.message)
            }
            else {
                console.log("🌟 当前降雨概率都不大于50%， 故不弹出系统通知。")
            }
            resolve()
        })
        setTimeout(() => {
                console.log("🚨 请求已达时间上限，自动退出。")
                resolve()
            }, $.timeout);
    })
}
// prettier-ignore, @chavyleung
function Env(s) {
    this.name = s, this.data = null, this.logs = [], this.isSurge = (() => "undefined" != typeof $httpClient), this.isQuanX = (() => "undefined" != typeof $task), this.isLoon = (() => "undefined" != typeof $loon),this.isNode = (() => "undefined" != typeof module && !!module.exports), this.log = ((...s) => {
        this.logs = [...this.logs, ...s], s ? console.log(s.join("\n")) : console.log(this.logs.join("\n"))
    }), this.msg = ((s = this.name, t = "", i = "", opts="") => {
        this.isLoon() && $notification.post(s, t, i, opts), this.isSurge() && !this.isLoon() && $notification.post(s, t, i), this.isQuanX() && $notify(s, t, i, { "open-url": opts});
        const e = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
        s && e.push(s), t && e.push(t), i && e.push(i), console.log(e.join("\n"))
    }), this.getdata = (s => {
        if (this.isSurge()) return $persistentStore.read(s);
        if (this.isQuanX()) return $prefs.valueForKey(s);
        if (this.isNode()) {
            const t = "box.dat";
            return this.fs = this.fs ? this.fs : require("fs"), this.fs.existsSync(t) ? (this.data = JSON.parse(this.fs.readFileSync(t)), this.data[s]) : null
        }
    }), this.setdata = ((s, t) => {
        if (this.isSurge()) return $persistentStore.write(s, t);
        if (this.isQuanX()) return $prefs.setValueForKey(s, t);
        if (this.isNode()) {
            const i = "box.dat";
            return this.fs = this.fs ? this.fs : require("fs"), !!this.fs.existsSync(i) && (this.data = JSON.parse(this.fs.readFileSync(i)), this.data[t] = s, this.fs.writeFileSync(i, JSON.stringify(this.data)), !0)
        }
    }), this.wait = ((s, t = s) => i => setTimeout(() => i(), Math.floor(Math.random() * (t - s + 1) + s))), this.get = ((s, t) => this.send(s, "GET", t)), this.post = ((s, t) => this.send(s, "POST", t)), this.send = ((s, t, i) => {
        if (this.isSurge()) {
            const e = "POST" == t ? $httpClient.post : $httpClient.get;
            e(s, (s, t, e) => {
                t && (t.body = e, t.statusCode = t.status), i(s, t, e)
            })
        }
        this.isQuanX() && (s.method = t, $task.fetch(s).then(s => {
            s.status = s.statusCode, i(null, s, s.body)
        }, s => i(s.error, s, s))), this.isNode() && (this.request = this.request ? this.request : require("request"), s.method = t, s.gzip = !0, this.request(s, (s, t, e) => {
            t && (t.status = t.statusCode), i(null, t, e)
        }))
    }), this.done = ((s = {}) => this.isNode() ? null : $done(s))
}