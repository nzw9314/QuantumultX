/*
README：https://github.com/yichahucha/surge/tree/master
 */

const $tool = tool()
const $base64 = new Base64()
const consoleLog = false
const url = $request.url
const body = $response.body
const path1 = "/amdc/mobileDispatch"
const path2 = "/gw/mtop.taobao.detail.getdetail"

if (url.indexOf(path1) != -1) {
    let obj = JSON.parse($base64.decode(body))
    let dns = obj.dns
    if (dns && dns.length > 0) {
        let i = dns.length;
        while (i--) {
            const element = dns[i];
            let host = "trade-acs.m.taobao.com"
            if (element.host == host) {
                element.ips = []
                if (consoleLog) console.log(JSON.stringify(element))
            }
        }
    }
    $done({ body: $base64.encode(JSON.stringify(obj)) })
}

if (url.indexOf(path2) != -1) {
    const body = $response.body
    let obj = JSON.parse(body)
    let apiStack = obj.data.apiStack[0]
    let value = JSON.parse(apiStack.value)
    if (value.global) {
        let tradeConsumerProtection = value.global.data.tradeConsumerProtection
        if (!tradeConsumerProtection) {
            value.global.data["tradeConsumerProtection"] = customTradeConsumerProtection()
        }
        tradeConsumerProtection = value.global.data.tradeConsumerProtection
        let service = tradeConsumerProtection.tradeConsumerService.service
        let nonService = tradeConsumerProtection.tradeConsumerService.nonService

        let item = obj.data.item
        let shareUrl = `https://item.taobao.com/item.htm?id=${item.itemId}`

        requestPrice(shareUrl, function (data) {
            if (data) {
                let historyItem = customItem()
                if (data.ok == 1 && data.single) {
                    const lower = lowerMsgs(data.single)
                    const result = historyItems(data.single)
                    const tbitems = result[1]
                    service.items = service.items.concat(nonService.items)
                    historyItem.desc = lower[0]
                    historyItem.title = lower[1]
                    service.items.unshift(historyItem)
                    nonService.title = "价格走势"
                    nonService.items = tbitems
                }
                if (data.ok == 0 && data.msg.length > 0) {
                    historyItem.desc = data.msg
                    service.items.push(historyItem)
                }
                apiStack.value = JSON.stringify(value)
                $done({ body: JSON.stringify(obj) })
            } else {
                $done({ body })
            }
        })
    } else {
        $done({ body })
    }
}

function requestPrice(shareUrl, callback) {
    let options = {
        url: "https://apapia-history.manmanbuy.com/ChromeWidgetServices/WidgetServices.ashx",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 - mmbWebBrowse - ios"
        },
        body: "methodName=getBiJiaInfo_wxsmall&p_url=" + encodeURIComponent(shareUrl)
    }
    $tool.post(options, function (error, response, data) {
        if (!error) {
            callback(JSON.parse(data));
            if (consoleLog) console.log("Data:\n" + data);
        } else {
            callback(null, null);
            if (consoleLog) console.log("Error:\n" + error);
        }
    })
}

function lowerMsgs(data) {
    const lower = data.lowerPriceyh
    const lowerDate = dateFormat(data.lowerDateyh)
    const lowerMsg = "历史最低到手价:   ¥" + String(lower) + "   " + lowerDate
    const curret_msg = (data.currentPriceStatus ? "   当前价格" + data.currentPriceStatus : "") + "   (仅供参考)"
    const lower1 = lowerMsg + curret_msg
    const lower2 = "历史最低¥" + String(lower)
    return [lower1, lower2]
}

function historyItems(data) {
    const rexMatch = /\[.*?\]/g;
    const rexExec = /\[(.*),(.*),"(.*)"\]/;
    const list = data.jiagequshiyh.match(rexMatch);
    let tbitems = [];
    let startDate = "";
    let endDate = "";
    list.reverse().forEach((item, index) => {
        if (item.length > 0) {
            const result = rexExec.exec(item);
            const dateUTC = new Date(eval(result[1]));
            const date = dateUTC.format("yyyy-MM-dd");
            if (index == 0) {
                endDate = date;
            }
            if (index == list.length - 1) {
                startDate = date;
            }
            let price = result[2];
            price = "¥" + String(parseFloat(price));
            const msg = date + getSpace(50 - date.length) + price;
            tbitem = {
                icon: "https://s2.ax1x.com/2020/01/03/lU2AYD.png",
                title: msg
            }
            tbitems.push(tbitem);
        }
    });
    const dateMsg = `(${startDate} ~ ${endDate})`;
    return [dateMsg, tbitems];
}

function dateFormat(cellval) {
    const date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + month + "-" + currentDate;
}

function getSpace(length) {
    let blank = "";
    for (let index = 0; index < length; index++) {
        blank += " ";
    }
    return blank;
}

function customItem() {
    return {
        icon: "https://s2.ax1x.com/2020/01/03/lU2Pw6.png",
        title: "历史价格",
        desc: ""
    }
}

function customTradeConsumerProtection() {
    return {
        "tradeConsumerService": {
            "service": {
                "items": [
                ],
                "icon": "",
                "title": "基础服务"
            },
            "nonService": {
                "items": [
                ],
                "title": "其他"
            }
        },
        "passValue": "all",
        "url": "https://h5.m.taobao.com/app/detailsubpage/consumer/index.js",
        "type": "0"
    }
}

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

Date.prototype.format = function (fmt) {
    var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            if (k == "y+") {
                fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
            }
            else if (k == "S+") {
                var lens = RegExp.$1.length;
                lens = lens == 1 ? 3 : lens;
                fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
            }
            else {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }
    return fmt;
}

function tool() {
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const setCache = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const getCache = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    return { isQuanX, isSurge, notify, setCache, getCache, get, post }
}

function Base64() {
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }
    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }
    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
