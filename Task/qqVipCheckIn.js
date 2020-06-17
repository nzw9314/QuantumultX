/*
QQ会员成长值-lowking-v1.0

按下面配置完之后，手机qq进入左侧会员，滑动即可
⚠️注：不知道能保持多久，等时间验证吧

************************
Surge 4.2.0+ 脚本配置:
************************

[Script]
# > qq会员成长值签到
qq会员获取cookie = type=http-request,pattern=https:\/\/proxy.vac.qq.com\/cgi-bin\/srfentry.fcgi,script-path=qqVipCheckIn.js
qq会员签到 = type=cron,cronexp="0 0 0,1 * * ?",wake-system=1,script-path=qqVipCheckIn.js

[mitm]
hostname = proxy.vac.qq.com

************************
QuantumultX 本地脚本配置:
************************

[rewrite_local]
#qq会员获取cookie
https:\/\/proxy.vac.qq.com\/cgi-bin\/srfentry.fcgi? url script-request-header qqVipCheckIn.js

[task_local]
0 0 0,1 * * ? qqVipCheckIn.js

[mitm]
hostname= proxy.vac.qq.com
*/
const isEnableLog = true
const signHeaderKey = 'lkQQSignHeaderKey'
const lk = nobyda()
const signurlVal = `https://iyouxi3.vip.qq.com/ams3.0.php?actid=403490&g_tk=`
const mainTitle = `QQ会员成长值签到`
var notifyInfo = ``
var accounts = !lk.getVal(signHeaderKey) ? [] : JSON.parse(lk.getVal(signHeaderKey))
// accounts = []

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
    lk.log(JSON.stringify(accounts))
    getCookie()
} else {
    lk.log(`QQ会员成长值-开始签到`)
    all()
}

async function all() {
    await signIn() //签到
    await notify() //通知
}

function getCookie() {
    const url = $request.url
    if ($request && $request.method != 'OPTIONS' && url.match(/\/cgi-bin\/srfentry/)) {
        const qqheader = JSON.stringify($request.headers.Cookie)
        lk.log(qqheader)
        if (qqheader) {
            let obj = {
                qq: Number(getCookieProp(qqheader, `uin`).substring(1)),
                skey: getCookieProp(qqheader, `skey`),
                cookie: qqheader
            }
            //判断当前qq信息是否持久化
            if (accounts.length > 0) {
                for (var i in accounts) {
                    if (accounts[i].qq == obj.qq) {
                        accounts.splice(i, 1);
                    }
                }
            }
            accounts.push(obj)
            lk.setValueForKey(signHeaderKey, JSON.stringify(accounts))
            lk.log(`${JSON.stringify(accounts)}`)
            lk.log(`${lk.getVal(signHeaderKey)}`)
            lk.msg(mainTitle, ``, `${autoComplete(obj.qq, ``, ``, ` `, `10`, `0`, true, 3, 3, `*`)}获取cookie成功🎉`)
        }
    }
    lk.done()
}

function signIn() {
    return new Promise(async (resolve, reject) => {
        lk.log(`所有账号：${JSON.stringify(accounts)}`);
        for (var i in accounts) {
            lk.log(`账号：${JSON.stringify(accounts[i])}`);
            await qqVipSignIn(i, accounts[i])
        }
        resolve()
    })
}

function qqVipSignIn(index, obj) {
    return new Promise((resolve, reject) => {
        lk.log(`当前帐号：${obj.qq}`)
        let signurlValReal = signurlVal
        let realHeader = {}
        realHeader.Host = `iyouxi3.vip.qq.com`
        realHeader.Cookie = obj.cookie.replace("\"", "")
        let url = {
            url: signurlValReal + getCSRFToken(obj.skey),
            headers: realHeader
        }
        lk.get(url, (error, response, data) => {
            lk.log(`\n${data}`);
            try {
                if (index > 0) {
                    notifyInfo += `\n`
                }
                notifyInfo += `${autoComplete(obj.qq, ``, ``, ` `, `10`, `0`, true, 3, 3, `*`)}`
                if (index == 3) {
                    notifyInfo += `【左滑 '查看' 以显示签到详情】\n`
                }
                const result = JSON.parse(data)
                if (result.ret == 0) {
                    notifyInfo += `🎉`
                } else if (result.ret == 10601) {
                    notifyInfo += `🔁`
                } else {
                    notifyInfo += `❌`
                }
                notifyInfo += `\n` + result.msg
            } finally {
                resolve()
            }
        })
    })
}

function getCookieProp(ca, cname) {
    var name = cname + "="
    ca = ca.split(";")
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim()
        if (c.indexOf(name) == 0) {
            return c.substring(name.length).replace("\"", "")
        }
    }
    return ""
}

function notify() {
    return new Promise((resolve, reject) => {
        lk.msg(`QQ会员成长值签到结果`, ``, `${notifyInfo}`)
        // 待测试
        // lk.setValueForKey(signHeaderKey, ``)
        lk.time()
        lk.done()
        resolve()
    })
}

function nobyda() {
    const start = Date.now()
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
    const isNode = typeof require == "function" && !isJSBox;
    const node = (() => {
        if (isNode) {
            const request = require('request');
            return ({request})
        } else {
            return (null)
        }
    })()
    const msg = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (isNode) log(title + subtitle + message)
        if (isJSBox) $push.schedule({
            title: title,
            body: subtitle ? subtitle + "\n" + message : message
        })
    }
    const setValueForKey = (key, value) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const getVal = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
        if (isNode) {
            node.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {
                url: options
            }
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data);
                callback(error, adapterStatus(resp.response), body)
            };
            $http.get(options);
        }
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {
                url: options
            }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {
                url: options
            }
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options);
        }
    }
    const log = (message) => {
        if (isEnableLog) console.log(`\n██${message}`)
    }
    const time = () => {
        const end = ((Date.now() - start) / 1000).toFixed(2)
        return console.log(`\n██用时：${end}秒`)
    }
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return {isRequest, isJSBox, isNode, msg, setValueForKey, getVal, get, post, log, time, done}
}

function getCSRFToken(skeyz) {
    var t = '5381';
    var n = 'tencentQQVIP123443safde&!%^%1282';
    var r = skeyz;
    var i = [],
        o;
    i.push(t << 5);
    for (var a = 0, s = r.length; a < s; ++a) {
        o = r.charAt(a).charCodeAt(0);
        i.push((t << 5) + o);
        t = o
    }
    return md5z(i.join("") + n)
}

function md5z(e) {
    var t = 0;
    var n = "";
    var r = 8;
    var i = 32;

    function o(e) {
        return T(f(x(e), e.length * r))
    }

    function a(e) {
        return j(f(x(e), e.length * r))
    }

    function s(e) {
        return w(f(x(e), e.length * r))
    }

    function l(e, t) {
        return T(y(e, t))
    }

    function u(e, t) {
        return j(y(e, t))
    }

    function c(e, t) {
        return w(y(e, t))
    }

    function f(e, t) {
        e[t >> 5] |= 128 << t % 32;
        e[(t + 64 >>> 9 << 4) + 14] = t;
        var n = 1732584193;
        var r = -271733879;
        var o = -1732584194;
        var a = 271733878;
        for (var s = 0; s < e.length; s += 16) {
            var l = n;
            var u = r;
            var c = o;
            var f = a;
            n = p(n, r, o, a, e[s + 0], 7, -680876936);
            a = p(a, n, r, o, e[s + 1], 12, -389564586);
            o = p(o, a, n, r, e[s + 2], 17, 606105819);
            r = p(r, o, a, n, e[s + 3], 22, -1044525330);
            n = p(n, r, o, a, e[s + 4], 7, -176418897);
            a = p(a, n, r, o, e[s + 5], 12, 1200080426);
            o = p(o, a, n, r, e[s + 6], 17, -1473231341);
            r = p(r, o, a, n, e[s + 7], 22, -45705983);
            n = p(n, r, o, a, e[s + 8], 7, 1770035416);
            a = p(a, n, r, o, e[s + 9], 12, -1958414417);
            o = p(o, a, n, r, e[s + 10], 17, -42063);
            r = p(r, o, a, n, e[s + 11], 22, -1990404162);
            n = p(n, r, o, a, e[s + 12], 7, 1804603682);
            a = p(a, n, r, o, e[s + 13], 12, -40341101);
            o = p(o, a, n, r, e[s + 14], 17, -1502002290);
            r = p(r, o, a, n, e[s + 15], 22, 1236535329);
            n = h(n, r, o, a, e[s + 1], 5, -165796510);
            a = h(a, n, r, o, e[s + 6], 9, -1069501632);
            o = h(o, a, n, r, e[s + 11], 14, 643717713);
            r = h(r, o, a, n, e[s + 0], 20, -373897302);
            n = h(n, r, o, a, e[s + 5], 5, -701558691);
            a = h(a, n, r, o, e[s + 10], 9, 38016083);
            o = h(o, a, n, r, e[s + 15], 14, -660478335);
            r = h(r, o, a, n, e[s + 4], 20, -405537848);
            n = h(n, r, o, a, e[s + 9], 5, 568446438);
            a = h(a, n, r, o, e[s + 14], 9, -1019803690);
            o = h(o, a, n, r, e[s + 3], 14, -187363961);
            r = h(r, o, a, n, e[s + 8], 20, 1163531501);
            n = h(n, r, o, a, e[s + 13], 5, -1444681467);
            a = h(a, n, r, o, e[s + 2], 9, -51403784);
            o = h(o, a, n, r, e[s + 7], 14, 1735328473);
            r = h(r, o, a, n, e[s + 12], 20, -1926607734);
            n = g(n, r, o, a, e[s + 5], 4, -378558);
            a = g(a, n, r, o, e[s + 8], 11, -2022574463);
            o = g(o, a, n, r, e[s + 11], 16, 1839030562);
            r = g(r, o, a, n, e[s + 14], 23, -35309556);
            n = g(n, r, o, a, e[s + 1], 4, -1530992060);
            a = g(a, n, r, o, e[s + 4], 11, 1272893353);
            o = g(o, a, n, r, e[s + 7], 16, -155497632);
            r = g(r, o, a, n, e[s + 10], 23, -1094730640);
            n = g(n, r, o, a, e[s + 13], 4, 681279174);
            a = g(a, n, r, o, e[s + 0], 11, -358537222);
            o = g(o, a, n, r, e[s + 3], 16, -722521979);
            r = g(r, o, a, n, e[s + 6], 23, 76029189);
            n = g(n, r, o, a, e[s + 9], 4, -640364487);
            a = g(a, n, r, o, e[s + 12], 11, -421815835);
            o = g(o, a, n, r, e[s + 15], 16, 530742520);
            r = g(r, o, a, n, e[s + 2], 23, -995338651);
            n = m(n, r, o, a, e[s + 0], 6, -198630844);
            a = m(a, n, r, o, e[s + 7], 10, 1126891415);
            o = m(o, a, n, r, e[s + 14], 15, -1416354905);
            r = m(r, o, a, n, e[s + 5], 21, -57434055);
            n = m(n, r, o, a, e[s + 12], 6, 1700485571);
            a = m(a, n, r, o, e[s + 3], 10, -1894986606);
            o = m(o, a, n, r, e[s + 10], 15, -1051523);
            r = m(r, o, a, n, e[s + 1], 21, -2054922799);
            n = m(n, r, o, a, e[s + 8], 6, 1873313359);
            a = m(a, n, r, o, e[s + 15], 10, -30611744);
            o = m(o, a, n, r, e[s + 6], 15, -1560198380);
            r = m(r, o, a, n, e[s + 13], 21, 1309151649);
            n = m(n, r, o, a, e[s + 4], 6, -145523070);
            a = m(a, n, r, o, e[s + 11], 10, -1120210379);
            o = m(o, a, n, r, e[s + 2], 15, 718787259);
            r = m(r, o, a, n, e[s + 9], 21, -343485551);
            n = v(n, l);
            r = v(r, u);
            o = v(o, c);
            a = v(a, f)
        }
        if (i == 16) {
            return Array(r, o)
        } else {
            return Array(n, r, o, a)
        }
    }

    function d(e, t, n, r, i, o) {
        return v(b(v(v(t, e), v(r, o)), i), n)
    }

    function p(e, t, n, r, i, o, a) {
        return d(t & n | ~t & r, e, t, i, o, a)
    }

    function h(e, t, n, r, i, o, a) {
        return d(t & r | n & ~r, e, t, i, o, a)
    }

    function g(e, t, n, r, i, o, a) {
        return d(t ^ n ^ r, e, t, i, o, a)
    }

    function m(e, t, n, r, i, o, a) {
        return d(n ^ (t | ~r), e, t, i, o, a)
    }

    function y(e, t) {
        var n = x(e);
        if (n.length > 16)
            n = f(n, e.length * r);
        var i = Array(16),
            o = Array(16);
        for (var a = 0; a < 16; a++) {
            i[a] = n[a] ^ 909522486;
            o[a] = n[a] ^ 1549556828
        }
        var s = f(i.concat(x(t)), 512 + t.length * r);
        return f(o.concat(s), 512 + 128)
    }

    function v(e, t) {
        var n = (e & 65535) + (t & 65535);
        var r = (e >> 16) + (t >> 16) + (n >> 16);
        return r << 16 | n & 65535
    }

    function b(e, t) {
        return e << t | e >>> 32 - t
    }

    function x(e) {
        var t = Array();
        var n = (1 << r) - 1;
        for (var i = 0; i < e.length * r; i += r)
            t[i >> 5] |= (e.charCodeAt(i / r) & n) << i % 32;
        return t
    }

    function w(e) {
        var t = "";
        var n = (1 << r) - 1;
        for (var i = 0; i < e.length * 32; i += r)
            t += String.fromCharCode(e[i >> 5] >>> i % 32 & n);
        return t
    }

    function T(e) {
        var n = t ? "0123456789ABCDEF" : "0123456789abcdef";
        var r = "";
        for (var i = 0; i < e.length * 4; i++) {
            r += n.charAt(e[i >> 2] >> i % 4 * 8 + 4 & 15) + n.charAt(e[i >> 2] >> i % 4 * 8 & 15)
        }
        return r
    }

    function j(e) {
        var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var r = "";
        for (var i = 0; i < e.length * 4; i += 3) {
            var o = (e[i >> 2] >> 8 * (i % 4) & 255) << 16 | (e[i + 1 >> 2] >> 8 * ((i + 1) % 4) & 255) << 8 | e[i + 2 >> 2] >> 8 * ((i + 2) % 4) & 255;
            for (var a = 0; a < 4; a++) {
                if (i * 8 + a * 6 > e.length * 32)
                    r += n;
                else
                    r += t.charAt(o >> 6 * (3 - a) & 63)
            }
        }
        return r
    }

    return o(e)
}

/**
 * 自动补齐字符串
 * @param str 原始字符串
 * @param prefix 前缀
 * @param suffix 后缀
 * @param fill 补齐用字符
 * @param len 目标补齐长度，不包含前后缀
 * @param direction 方向：0往后补齐
 * @param ifCode 是否打码
 * @param clen 打码长度
 * @param startIndex 起始坐标
 * @param cstr 打码字符
 * @returns {*}
 */
function autoComplete(str, prefix, suffix, fill, len, direction, ifCode, clen, startIndex, cstr) {
    str += ``
    if (str.length < len) {
        while (str.length < len) {
            if (direction == 0) {
                str += fill
            } else {
                str = fill + str
            }
        }
    }
    if (ifCode) {
        let temp = ``
        for (var i = 0; i < clen; i++) {
            temp += cstr
        }
        str = str.substring(0, startIndex) + temp + str.substring(clen + startIndex)
    }
    str = prefix + str + suffix;
    lk.log(`补齐后：${str}`)
    return toDBC(str)
}

function toDBC(txtstring) {
    var tmp = ""
    for (var i = 0; i < txtstring.length; i++) {
        if (txtstring.charCodeAt(i) == 32) {
            tmp = tmp + String.fromCharCode(12288)
        } else if (txtstring.charCodeAt(i) < 127) {
            tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248)
        }
    }
    return tmp
}