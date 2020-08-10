/*
 Author: @toulanboy 
 
📕地址：https://github.com/toulanboy/scripts
📌不定期更新各种签到、有趣的脚本，欢迎star🌟
    
配置步骤 （请先认真阅读配置，再进行操作）
 1. 根据你当前的软件，配置好srcipt。Tips:由于是远程文件，记得顺便更新文件。
 2. 打开小木虫app => 发现页面 => 签到领红包 => 拆红包。弹出通知，即获取成功。
 3. 回到quanx等软件，关掉获取cookie的rewrite。（loon是关掉获取cookie的脚本）
 4. 手动跑1次，看看是否能获取到今天签到的金币数。
 
Surge:
Rewrite: 小木虫论坛 = type=http-request,pattern=^https?:\/\/mapi.xmcimg.com\/bbs\/memcp.php\?action,script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js,requires-body=false
Tasks: 小木虫论坛 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js,wake-system=true,timeout=600
  
QuanX:
[rewrite]
^https?:\/\/mapi.xmcimg.com\/bbs\/memcp.php\?action url script-request-header https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js
[task]
5 0 * * * https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js, tag=小木虫论坛
  
Loon:
[script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js, timeout=600, tag=小木虫论坛
http-request ^https?:\/\/mapi.xmcimg.com\/bbs\/memcp.php\?action script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js,requires-body=false, tag=小木虫论坛cookie获取
 
[MITM]
hostname = *.xmcimg.com
*/
const $ = new Env('🦜小木虫论坛')

$.debug = false

!(async () => {
    if (typeof $request != "undefined") {
        set_cookie()
    } else {
        get_env()
        await get_hashcode()
        if ($.need_sign) await checkin()
    }
})()
.catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
})
.finally(() => {
    $.done()
})

function get_env() {
    $.debug = JSON.parse($.getdata('muchong_debug') || $.debug)
    $.muchong_headers = $.getdata("muchong_headers")
}

function set_cookie() {
    $.setdata(JSON.stringify($request.headers), 'muchong_headers')
    if ($.debug) console.log($.getdata("muchong_headers"))
    $.msg($.name, `📌获取会话成功`)
}

function get_hashcode() {
    const url = {
        url: `https://mapi.xmcimg.com/bbs/memcp.php`,
        body: `action=getcredit&_tpl=app&target=1`
    };
    url.headers = JSON.parse($.muchong_headers)
    if ($.debug) console.log(url)
    return new Promise((resolve) => {
        $.post(url, (error, response, data) => {
            if (error) throw new Error(error)
            if ($.debug) console.log(response)
            if (response.status == 404) {
                console.log(`${$.name} 签到网址404，找不到相关信息`)
                $.msg(`${$.name}`, `签到网址404`,`可能是服务器临时维护，若持续多天无法签到，请联系Github@toulanboy`)
                $.need_sign = false
                // return
                resolve()
                return
            }
            $.need_sign = false
            if (data.match(/点击拆红包/)) {
                var result = data.match(/id=\"formhash\" value=\"(.*?)\"/)
                if (result != null) {
                    $.formhash = result[1]
                    $.need_sign = true
                    console.log(`${$.name} ✅已找到code: ${$.formhash}`)
                } else {
                    console.log(`${$.name} 找不到formhash，cookie可能已失效，请重新获取。`)
                    $.msg($.name, `找不到formhash`,`cookie可能已失效，请重新获取。`)
                }
            } else if (data.match(/已连续/)) {
                $.coin = data.match(/<em>(\d+?)<\/em>/)
                $.other_message = data.match(/已连续.*?(\d+).*?天领取，连续.*?(\d+).*?天得大礼包/)
                $.msg(`${$.name}`, "", `重复签到，签到情况如下：\n1️⃣获得金币${$.coin[1]}\n2️⃣${$.other_message[0]}`)
            } else {
                console.log(`${$.name}`,`找不到相关信息`,`cookie可能已失效，请重新获取。`)
            }
            resolve()
        })
    })
}

function checkin() {
    const url = {
        url: 'https://mapi.xmcimg.com/bbs/memcp.php?action=getcredit',
        body: `getmode=1&creditsubmit=1&formhash=${$.formhash}`
    };
    url.headers = JSON.parse($.muchong_headers)
    if ($.debug) console.log(url)
    return new Promise((resolve) => {
        $.post(url, (error, response, data) => {
            if (error) {
                console.log(error)
                throw new Error(error)
            }
            if ($.debug) console.log(response.body)
            $.coin = data.match(/<em>(\d+?)<\/em>/)
            $.other_message = data.match(/已连续.*?(\d+).*?天领取，连续.*?(\d+).*?天得大礼包/)
            $.msg(`${$.name}`, "", `✅签到成功，签到情况如下：\n1️⃣获得金币${$.coin[1]}\n2️⃣${$.other_message[0]}`)
            resolve()
        })
    })

}
//作者@chavyleung
function Env(s) {
    this.name = s, this.data = null, this.logs = [], this.isSurge = (() => "undefined" != typeof $httpClient), this.isQuanX = (() => "undefined" != typeof $task), this.isLoon = (() => "undefined" != typeof $loon), this.isNode = (() => "undefined" != typeof module && !!module.exports), this.log = ((...s) => {
        this.logs = [...this.logs, ...s], s ? console.log(s.join("\n")) : console.log(this.logs.join("\n"))
    }), this.msg = ((s = this.name, t = "", i = "") => {
        this.isLoon() && $notification.post(s, t, i, jump_url), this.isSurge() && !this.isLoon() && $notification.post(s, t, i), this.isQuanX() && $notify(s, t, i);
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