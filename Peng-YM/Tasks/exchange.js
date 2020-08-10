/**
 * 监控汇率变化
 * @author: Peng-YM
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/exchange.js
 * 配置方法：
 * 1. 设置基准货币，默认人民币(CNY)。
 * 2. 设置保留几位小数。
 */

const base = "CNY"; // 基准货币，可以改成其他币种
const digits = 2; // 保留几位有效数字

const currencyNames = {
    CNY: ["人民币", "🇨🇳"],
    USD: ["美元", "🇺🇸"],
    HKD: ["港币", "🇭🇰"],
    JPY: ["日元", "🇯🇵"],
    EUR: ["欧元", "🇪🇺"],
    GBP: ["英镑", "🇬🇧"],
};

/******************** 转换器 ********************/
let q = null != $task, s = null != $httpClient;
var $task = q ? $task : {}, $httpClient = s ? $httpClient : {}, $prefs = q ? $prefs : {},
    $persistentStore = s ? $persistentStore : {}, $notify = q ? $notify : {}, $notification = s ? $notification : {};
if (q) {
    var errorInfo = {error: ""};
    $httpClient = {
        get: (t, r) => {
            var e;
            e = "string" == typeof t ? {url: t} : t, $task.fetch(e).then(t => {
                r(void 0, t, t.body)
            }, t => {
                errorInfo.error = t.error, r(errorInfo, response, "")
            })
        }, post: (t, r) => {
            var e;
            e = "string" == typeof t ? {url: t} : t, t.method = "POST", $task.fetch(e).then(t => {
                r(void 0, t, t.body)
            }, t => {
                errorInfo.error = t.error, r(errorInfo, response, "")
            })
        }
    }
}
s && ($task = {
    fetch: t => new Promise((r, e) => {
        "POST" == t.method ? $httpClient.post(t, (t, e, o) => {
            e ? (e.body = o, r(e, {error: t})) : r(null, {error: t})
        }) : $httpClient.get(t, (t, e, o) => {
            e ? (e.body = o, r(e, {error: t})) : r(null, {error: t})
        })
    })
}), q && ($persistentStore = {
    read: t => $prefs.valueForKey(t),
    write: (t, r) => $prefs.setValueForKey(t, r)
}), s && ($prefs = {
    valueForKey: t => $persistentStore.read(t),
    setValueForKey: (t, r) => $persistentStore.write(t, r)
}), q && ($notification = {
    post: (t, r, e) => {
        $notify(t, r, e)
    }
}), s && ($notify = function (t, r, e) {
    $notification.post(t, r, e)
});
/******************** 转换器 ********************/
$task
    .fetch({url: "https://api.ratesapi.io/api/latest?base=CNY"})
    .then((response) => {
        const data = JSON.parse(response.body);
        const source = currencyNames[base];

        const info = Object.keys(currencyNames).reduce((accumulator, key) => {
            let line = "";
            if (key !== base && data.rates.hasOwnProperty(key)) {
                const rate = parseFloat(data.rates[key]);
                const target = currencyNames[key];
                if (rate > 1) {
                    line = `${target[1]} 1${source[0]}兑${roundNumber(rate, digits)}${
                        target[0]
                    }\n`;
                } else {
                    line = `${target[1]} 1${target[0]}兑${roundNumber(1 / rate, digits)}${
                        source[0]
                    }\n`;
                }
            }
            return accumulator + line;
        }, "");
        $notify(
            `[今日汇率] 基准：${source[1]} ${source[0]}`,
            `⏰ 更新时间：${data.date}`,
            `📈 汇率情况：\n${info}`
        );
    })
    .then(() => $done());

function roundNumber(num, scale) {
    if (!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale) + "e-" + scale);
    } else {
        let arr = ("" + num).split("e");
        let sig = "";
        if (+arr[1] + scale > 0) {
            sig = "+";
        }
        return +(
            Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) +
            "e-" +
            scale
        );
    }
}
