/*
QQ会员成长值-lowking-v1.3

按下面配置完之后，手机qq进入左侧会员，滑动即可
⚠️注：发现cookie存活时间较短，增加isEnableNotifyForGetCookie，用来控制获取cookie时的通知，默认关闭通知

点赞排除列表数据结构如下：
{
    "qq号":[
        "要拉黑的人，写排行榜中的名字",
        "要拉黑的人，写排行榜中的名字"
    ],
    "qq号2":[
        "要拉黑的人，写排行榜中的名字",
        "要拉黑的人，写排行榜中的名字"
    ]
}

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

************************
LOON 本地脚本配置:
************************

[Script]
http-request https:\/\/proxy.vac.qq.com\/cgi-bin\/srfentry.fcgi script-path=https://raw.githubusercontent.com/lowking/Scripts/master/QQVip/qqVipCheckIn.js, timeout=10, tag=qq会员获取
cron "0 0 0,1 * * *" script-path=https://raw.githubusercontent.com/lowking/Scripts/master/QQVip/qqVipCheckIn.js, tag=qq会员签到

mitm= proxy.vac.qq.com
*/
const signHeaderKey = 'lkQQSignHeaderKey'
const blockListKey = 'lkQQSignBlockListKey'
const lk = nobyda()
const isEnableLog = !lk.getVal('lkIsEnableLogQQVip') ? true : JSON.parse(lk.getVal('lkIsEnableLogQQVip'))
const isEnableNotifyForGetCookie = !lk.getVal('lkIsEnableNotifyForGetCookie') ? false : JSON.parse(lk.getVal('lkIsEnableNotifyForGetCookie'))
const isDeleteAllCookie = !lk.getVal('lkIsDeleteAllCookie') ? false : JSON.parse(lk.getVal('lkIsDeleteAllCookie'))
const isEnableGetCookie = !lk.getVal('lkIsEnableGetCookieQQVIP') ? true : JSON.parse(lk.getVal('lkIsEnableGetCookieQQVIP'))
const signurlVal = `https://iyouxi3.vip.qq.com/ams3.0.php?actid=403490&g_tk=`
const praiseurlVal = `https://mq.vip.qq.com/m/growth/loadfrank?`
const mainTitle = `QQ会员成长值签到`
var notifyInfo = ``
var accounts = !lk.getVal(signHeaderKey) ? [] : JSON.parse(lk.getVal(signHeaderKey))
var blockList = !lk.getVal(blockListKey) ? {} : JSON.parse(lk.getVal(blockListKey))
// accounts = []

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
    if (isEnableGetCookie) {
        getCookie()
    } else {
        lk.done()
    }
} else {
    all()
}

async function all() {
    await signIn() //签到
    await notify() //通知
}

function getCookie() {
    const url = $request.url
    if ($request && $request.method != 'OPTIONS' && url.match(/\/cgi-bin\/srfentry/)) {
        try {
            const qqheader = JSON.stringify($request.headers.Cookie)
            lk.log(qqheader)
            if (!!qqheader) {
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
                if (isEnableNotifyForGetCookie) {
                    lk.msg(mainTitle, ``, `${autoComplete(obj.qq, ``, ``, ` `, `10`, `0`, true, 3, 3, `*`)}获取cookie成功🎉`)
                }
            }
        } catch (e) {
            lk.msg(mainTitle, ``, `获取cookie失败，请重试❌`)
        }
    }
    lk.done()
}

function signIn() {
    return new Promise(async (resolve, reject) => {
        lk.log(`所有账号：${JSON.stringify(accounts)}`);
        if (!accounts || accounts.length <= 0) {
            lk.msg(mainTitle, ``, `帐号列表为空，请获取cookie之后再试❌`)
        } else {
            if (isDeleteAllCookie) {
                lk.setValueForKey(signHeaderKey, ``)
                lk.msg(mainTitle, ``, `已清除所有cookie⭕️`)
            } else {
                for (let i in accounts) {
                    lk.log(`████████████████████████████`)
                    lk.log(`账号：${JSON.stringify(accounts[i])}`)
                    await qqVipSignIn(i, accounts[i])
                    let list = await praise(i, accounts[i])
                    if (list != null && list.length > 0) {
                        pcount = 0
                        arcount = 0
                        errorcount = 0
                        for (let ii = 0; ii < list.length; ii++) {
                            if (isBlock(list[ii]["memo"], accounts[i]["qq"])) {
                                lk.log(`点赞排除【${list[ii]["memo"]}】`)
                                continue
                            }
                            if (list[ii]["isPraise"] == 0) {
                                await doPraise(list[ii], accounts[i])
                            } else {
                                arcount++
                            }
                        }
                        notifyInfo += `\n🎉【${pcount}】个，🔁【${arcount}】个，❌【${errorcount}】个`
                    }
                }
            }
        }
        resolve()
    })
}

function isBlock(name, qqno) {
    for(var key in blockList){
        if (key == qqno) {
            if (blockList[key].indexOf(name) != -1) {
                return true
            } else {
                return false
            }
        }
    }

    return false
}

var pcount = 0
var arcount = 0
var errorcount = 0
function praise(index, obj){
    return new Promise(async (resolve, reject) => {
        let qqno = autoComplete(obj.qq, ``, ``, ` `, `10`, `0`, true, 3, 3, `*`)
        let pskey = randomString(44)
        let pstk = getPstk(pskey)
        let gtk = getCSRFToken(obj.skey)
        let praiseurlValReal = praiseurlVal
        let realHeader = {}
        // realHeader.Host = `iyouxi3.vip.qq.com`
        realHeader.Cookie = obj.cookie + `; p_skey=${pskey}`
        realHeader.Cookie = realHeader.Cookie.replace("\"", "")
        realHeader.Cookie = realHeader.Cookie.replace("\"", "")
        realHeader.Referer = `https://mq.vip.qq.com/m/growth/rank`
        let url = {
            url: praiseurlValReal + `pn=1&g_tk=${gtk}&ps_tk=${pstk}`,
            headers: realHeader
        }
        lk.get(url, (error, response, data) => {
            let list = null
            try {
                const result = JSON.parse(data)
                if (result.ret == 0) {
                    list = result.data
                } else if (result.ret == -7) {
                    notifyInfo += `\n${qqno}❌\ncookie失效，请重新获取`
                } else {
                    //获取列表失败，返回
                    notifyInfo += `\n${qqno}会员点赞失败，请查看日志`
                    lk.log(`当前帐号：${obj.qq}\n获取好友会员列表失败，请重新执行任务，若还是失败，请重新获取cookie`)
                }
            } catch (e) {
                lk.log(`${qqno}的cookie失效`)
            } finally {
                resolve(list)
            }
        })
    })
}

function doPraise(item, obj){
    return new Promise(async (resolve, reject) => {
        if (item["me"] != `me`) {
            let pskey = randomString(44)
            let pstk = getPstk(pskey)
            let gtk = getCSRFToken(obj.skey)
            let realHeader = {}
            realHeader.Cookie = obj.cookie + `; p_skey=${pskey}`
            realHeader.Cookie = realHeader.Cookie.replace("\"", "")
            realHeader.Cookie = realHeader.Cookie.replace("\"", "")
            realHeader.Referer = `https://mq.vip.qq.com/m/growth/rank`
            let purl = {
                url: `https://mq.vip.qq.com/m/growth/doPraise?method=0&toUin=${item["uin"]}&g_tk=${gtk}&ps_tk=${pstk}`,
                headers: realHeader
            }
            await lk.get(purl, (perror, presponse, pdata) => {
                try {
                    const presult = JSON.parse(pdata)
                    if (presult.ret == 0) {
                        lk.log(`给第${item["rank"]}名：${item["memo"]}点赞成功🎉`)
                        pcount++
                    } else {
                        lk.log(`第${item["rank"]}名：${item["memo"]}点赞失败❌`)
                        errorcount++
                    }
                } catch (e) {
                    console.log(e)
                    resolve()
                } finally {
                    resolve()
                }
            })
        }else{
            resolve()
        }
    })
}

function qqVipSignIn(index, obj) {
    return new Promise((resolve, reject) => {
        let signurlValReal = signurlVal
        let realHeader = {}
        realHeader.Host = `iyouxi3.vip.qq.com`
        realHeader.Cookie = obj.cookie.replace("\"", "")
        let url = {
            url: signurlValReal + getCSRFToken(obj.skey),
            headers: realHeader
        }
        lk.get(url, (error, response, data) => {
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
                notifyInfo += `\n` + result.msg.indexOf(`火爆`) != -1 ? `\ncookie失效，请重新获取` : `\n${result.msg}`
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
        if(!!notifyInfo.trim()) {
            lk.msg(`QQ会员成长值签到结果`, ``, `${notifyInfo}`)
        }
        lk.time()
        lk.done()
        resolve()
    })
}

function nobyda(){const t=Date.now();const e=typeof $request!="undefined";const n=typeof $httpClient!="undefined";const o=typeof $task!="undefined";const s=typeof $app!="undefined"&&typeof $http!="undefined";const r=typeof require=="function"&&!s;const i=(()=>{if(r){const t=require("request");return{request:t}}else{return null}})();const f=(t,e,i)=>{if(o)$notify(t,e,i);if(n)$notification.post(t,e,i);if(r)c(t+e+i);if(s)$push.schedule({title:t,body:e?e+"\n"+i:i})};const u=(t,e)=>{if(o)return $prefs.setValueForKey(e,t);if(n)return $persistentStore.write(e,t)};const l=t=>{if(o)return $prefs.valueForKey(t);if(n)return $persistentStore.read(t)};const d=t=>{if(t){if(t.status){t["statusCode"]=t.status}else if(t.statusCode){t["status"]=t.statusCode}}return t};const a=(t,e)=>{if(o){if(typeof t=="string")t={url:t};t["method"]="GET";$task.fetch(t).then(t=>{e(null,d(t),t.body)},t=>e(t.error,null,null))}if(n)$httpClient.get(t,(t,n,o)=>{e(t,d(n),o)});if(r){i.request(t,(t,n,o)=>{e(t,d(n),o)})}if(s){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let n=t.error;if(n)n=JSON.stringify(t.error);let o=t.data;if(typeof o=="object")o=JSON.stringify(t.data);e(n,d(t.response),o)};$http.get(t)}};const p=(t,e)=>{if(o){if(typeof t=="string")t={url:t};t["method"]="POST";$task.fetch(t).then(t=>{e(null,d(t),t.body)},t=>e(t.error,null,null))}if(n){$httpClient.post(t,(t,n,o)=>{e(t,d(n),o)})}if(r){i.request.post(t,(t,n,o)=>{e(t,d(n),o)})}if(s){if(typeof t=="string")t={url:t};t["header"]=t["headers"];t["handler"]=function(t){let n=t.error;if(n)n=JSON.stringify(t.error);let o=t.data;if(typeof o=="object")o=JSON.stringify(t.data);e(n,d(t.response),o)};$http.post(t)}};const c=t=>{if(isEnableLog)console.log(`\n██${t}`)};const y=()=>{const e=((Date.now()-t)/1e3).toFixed(2);return console.log(`\n██用时：${e}秒`)};const $=(t={})=>{if(o)e?$done(t):null;if(n)e?$done(t):$done()};return{isRequest:e,isJSBox:s,isNode:r,msg:f,setValueForKey:u,getVal:l,get:a,post:p,log:c,time:y,done:$}}
function randomString(r){r=r||32;var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";var t=n.length;var a="";for(i=0;i<r;i++){a+=n.charAt(Math.floor(Math.random()*t))}return a}function getPstk(r){for(var n=5381,t=0,a=r.length;a>t;++t)n+=(n<<5)+r.charCodeAt(t);return 2147483647&n}function getCSRFToken(r){var n="5381";var t="tencentQQVIP123443safde&!%^%1282";var a=r;var e=[],o;e.push(n<<5);for(var u=0,f=a.length;u<f;++u){o=a.charAt(u).charCodeAt(0);e.push((n<<5)+o);n=o}return md5z(e.join("")+t)}function md5z(r){var n=0;var t="";var a=8;var e=32;function o(r){return p(h(S(r),r.length*a))}function u(r){return B(h(S(r),r.length*a))}function f(r){return b(h(S(r),r.length*a))}function v(r,n){return p(s(r,n))}function i(r,n){return B(s(r,n))}function c(r,n){return b(s(r,n))}function h(r,n){r[n>>5]|=128<<n%32;r[(n+64>>>9<<4)+14]=n;var t=1732584193;var a=-271733879;var o=-1732584194;var u=271733878;for(var f=0;f<r.length;f+=16){var v=t;var i=a;var c=o;var h=u;t=l(t,a,o,u,r[f+0],7,-680876936);u=l(u,t,a,o,r[f+1],12,-389564586);o=l(o,u,t,a,r[f+2],17,606105819);a=l(a,o,u,t,r[f+3],22,-1044525330);t=l(t,a,o,u,r[f+4],7,-176418897);u=l(u,t,a,o,r[f+5],12,1200080426);o=l(o,u,t,a,r[f+6],17,-1473231341);a=l(a,o,u,t,r[f+7],22,-45705983);t=l(t,a,o,u,r[f+8],7,1770035416);u=l(u,t,a,o,r[f+9],12,-1958414417);o=l(o,u,t,a,r[f+10],17,-42063);a=l(a,o,u,t,r[f+11],22,-1990404162);t=l(t,a,o,u,r[f+12],7,1804603682);u=l(u,t,a,o,r[f+13],12,-40341101);o=l(o,u,t,a,r[f+14],17,-1502002290);a=l(a,o,u,t,r[f+15],22,1236535329);t=A(t,a,o,u,r[f+1],5,-165796510);u=A(u,t,a,o,r[f+6],9,-1069501632);o=A(o,u,t,a,r[f+11],14,643717713);a=A(a,o,u,t,r[f+0],20,-373897302);t=A(t,a,o,u,r[f+5],5,-701558691);u=A(u,t,a,o,r[f+10],9,38016083);o=A(o,u,t,a,r[f+15],14,-660478335);a=A(a,o,u,t,r[f+4],20,-405537848);t=A(t,a,o,u,r[f+9],5,568446438);u=A(u,t,a,o,r[f+14],9,-1019803690);o=A(o,u,t,a,r[f+3],14,-187363961);a=A(a,o,u,t,r[f+8],20,1163531501);t=A(t,a,o,u,r[f+13],5,-1444681467);u=A(u,t,a,o,r[f+2],9,-51403784);o=A(o,u,t,a,r[f+7],14,1735328473);a=A(a,o,u,t,r[f+12],20,-1926607734);t=C(t,a,o,u,r[f+5],4,-378558);u=C(u,t,a,o,r[f+8],11,-2022574463);o=C(o,u,t,a,r[f+11],16,1839030562);a=C(a,o,u,t,r[f+14],23,-35309556);t=C(t,a,o,u,r[f+1],4,-1530992060);u=C(u,t,a,o,r[f+4],11,1272893353);o=C(o,u,t,a,r[f+7],16,-155497632);a=C(a,o,u,t,r[f+10],23,-1094730640);t=C(t,a,o,u,r[f+13],4,681279174);u=C(u,t,a,o,r[f+0],11,-358537222);o=C(o,u,t,a,r[f+3],16,-722521979);a=C(a,o,u,t,r[f+6],23,76029189);t=C(t,a,o,u,r[f+9],4,-640364487);u=C(u,t,a,o,r[f+12],11,-421815835);o=C(o,u,t,a,r[f+15],16,530742520);a=C(a,o,u,t,r[f+2],23,-995338651);t=d(t,a,o,u,r[f+0],6,-198630844);u=d(u,t,a,o,r[f+7],10,1126891415);o=d(o,u,t,a,r[f+14],15,-1416354905);a=d(a,o,u,t,r[f+5],21,-57434055);t=d(t,a,o,u,r[f+12],6,1700485571);u=d(u,t,a,o,r[f+3],10,-1894986606);o=d(o,u,t,a,r[f+10],15,-1051523);a=d(a,o,u,t,r[f+1],21,-2054922799);t=d(t,a,o,u,r[f+8],6,1873313359);u=d(u,t,a,o,r[f+15],10,-30611744);o=d(o,u,t,a,r[f+6],15,-1560198380);a=d(a,o,u,t,r[f+13],21,1309151649);t=d(t,a,o,u,r[f+4],6,-145523070);u=d(u,t,a,o,r[f+11],10,-1120210379);o=d(o,u,t,a,r[f+2],15,718787259);a=d(a,o,u,t,r[f+9],21,-343485551);t=m(t,v);a=m(a,i);o=m(o,c);u=m(u,h)}if(e==16){return Array(a,o)}else{return Array(t,a,o,u)}}function g(r,n,t,a,e,o){return m(y(m(m(n,r),m(a,o)),e),t)}function l(r,n,t,a,e,o,u){return g(n&t|~n&a,r,n,e,o,u)}function A(r,n,t,a,e,o,u){return g(n&a|t&~a,r,n,e,o,u)}function C(r,n,t,a,e,o,u){return g(n^t^a,r,n,e,o,u)}function d(r,n,t,a,e,o,u){return g(t^(n|~a),r,n,e,o,u)}function s(r,n){var t=S(r);if(t.length>16)t=h(t,r.length*a);var e=Array(16),o=Array(16);for(var u=0;u<16;u++){e[u]=t[u]^909522486;o[u]=t[u]^1549556828}var f=h(e.concat(S(n)),512+n.length*a);return h(o.concat(f),512+128)}function m(r,n){var t=(r&65535)+(n&65535);var a=(r>>16)+(n>>16)+(t>>16);return a<<16|t&65535}function y(r,n){return r<<n|r>>>32-n}function S(r){var n=Array();var t=(1<<a)-1;for(var e=0;e<r.length*a;e+=a)n[e>>5]|=(r.charCodeAt(e/a)&t)<<e%32;return n}function b(r){var n="";var t=(1<<a)-1;for(var e=0;e<r.length*32;e+=a)n+=String.fromCharCode(r[e>>5]>>>e%32&t);return n}function p(r){var t=n?"0123456789ABCDEF":"0123456789abcdef";var a="";for(var e=0;e<r.length*4;e++){a+=t.charAt(r[e>>2]>>e%4*8+4&15)+t.charAt(r[e>>2]>>e%4*8&15)}return a}function B(r){var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var a="";for(var e=0;e<r.length*4;e+=3){var o=(r[e>>2]>>8*(e%4)&255)<<16|(r[e+1>>2]>>8*((e+1)%4)&255)<<8|r[e+2>>2]>>8*((e+2)%4)&255;for(var u=0;u<4;u++){if(e*8+u*6>r.length*32)a+=t;else a+=n.charAt(o>>6*(3-u)&63)}}return a}return o(r)}function autoComplete(r,n,t,a,e,o,u,f,v,i){r+=``;if(r.length<e){while(r.length<e){if(o==0){r+=a}else{r=a+r}}}if(u){let n=``;for(var c=0;c<f;c++){n+=i}r=r.substring(0,v)+n+r.substring(f+v)}r=n+r+t;return toDBC(r)}function toDBC(r){var n="";for(var t=0;t<r.length;t++){if(r.charCodeAt(t)==32){n=n+String.fromCharCode(12288)}else if(r.charCodeAt(t)<127){n=n+String.fromCharCode(r.charCodeAt(t)+65248)}}return n}