/*
README：https://github.com/yichahucha/surge/tree/master
 */

const consoleLog = false
const url = $request.url
const body = $response.body
const isSurge = typeof $httpClient != "undefined"
const isQuanX = typeof $task != "undefined"

if (true) {
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
    if (isSurge) {
        $httpClient.post(options, function (error, response, data) {
            if (!error) {
                callback(JSON.parse(data));
                if (consoleLog) console.log("Data:\n" + data);
            } else {
                callback(null, null);
                if (consoleLog) console.log("Error:\n" + error);
            }
        })
    }
    if (isQuanX) {
        options["method"] = "POST"
        $task.fetch(options).then(response => {
            callback(JSON.parse(response.body));
            if (consoleLog) console.log("Data:\n" + response.body);
        }, reason => {
            callback(null, null);
            if (consoleLog) console.log("Error:\n" + reason.error);
        })
    }
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
