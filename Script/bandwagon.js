/**
 * By @uchvk
 * 搬瓦工查询流量，需要手动填入veid 和 api_key
 * 测试可用 quantumultx Loon JSBox
 * [task_local]
 * 30 8 * * * bandwagon.js
 */

 // 修改veid和api_key

let config = {
    veid: 2020, // 填你的veid
    api_key: "在此填入你的key"
};

const $tool = tool();
check_flow();
$tool.done();

// 格式化时间
function formatTime(date) {
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    // var D = date.getDate() + ' ';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}

// 前一个月时间
function preMonthTime(resetTime) {
    var date = new Date(resetTime);
    date.setMonth(date.getMonth() - 1);
    return date;
}
// 当前月份天数
function monthDays(currentTime) {
    var date = new Date(currentTime)
    //将当前月份加1，下移到下一个月
    date.setMonth(date.getMonth()+1);
    date.setDate(0);
    return date.getDate();
}
// 计算当前时间 间隔
function intervalTimes(startTime, endTime) {
    var stime = Date.parse(startTime);
    var etime = Date.parse(endTime);
    // 两个时间戳相差的毫秒数
    var usedTime = etime - stime;
    // 计算相差的天数
    var days = Math.floor(usedTime / (24 * 3600 * 1000));
    // 计算天数后剩余的毫秒数
    var leave1 = usedTime % (24 * 3600 * 1000);
    // 计算出小时数
    var hours = Math.floor(leave1 / (3600 * 1000));
    // 计算小时数后剩余的毫秒数
    var leave2 = leave1 % (3600 * 1000);
    // 计算相差分钟数
    var minutes = Math.floor(leave2 / (60 * 1000));
    var time = days + "天" + hours + "时" + minutes + "分";
    return time;
}
// 剩余平均每天可用流量
function averageFlow(startTime, endTime, flow) {
    var stime = Date.parse(startTime);
    var etime = Date.parse(endTime);
    // 两个时间戳相差的毫秒数
    var usedTime = etime - stime;
    var dayFlow = flow / 1073741824 / usedTime * 1000 * 3600 * 24;
    return dayFlow.toFixed(3)
}


function parse_flow(data) {
    var currentTime = new Date();
    var resetTime = new Date(data.data_next_reset * 1000);
    var startTime = preMonthTime(resetTime);

    var use_plan = (data.data_counter/1073741824).toFixed(2) + "/" + data.plan_monthly_data/1073741824 + "G";
    var percent = (data.data_counter * 100 / data.plan_monthly_data).toFixed(2) + "%";
    var ip = data.ip_addresses[0];
    var reset_date = formatTime(resetTime);
    var start_date = formatTime(startTime);

    var days = monthDays(startTime);
    var residue = ((data.plan_monthly_data - data.data_counter)/1073741824).toFixed(2) + "G"

    var subTitle = "已用: "+ percent + ", " + use_plan + " 剩余: "+ residue;

    var usedTimes = intervalTimes(startTime, currentTime);
    var residueTimes = intervalTimes(currentTime, resetTime);

    var residueFlow = averageFlow(currentTime, resetTime, data.plan_monthly_data - data.data_counter);
    var usedFlow = averageFlow(startTime, currentTime, data.data_counter);

    var msg1 = "已用: " + usedTimes + ", 平均每天: " + usedFlow + "GB";
    var msg2 = "剩余: " + residueTimes + ", 剩余每天: " + residueFlow + "GB";
    var msg3 = "本月: " + days + "天, 重置: " + reset_date;
    var message = msg1 + "\n" + msg2 + "\n" + msg3;

    $tool.notify("搬瓦工流量查询", subTitle, message);
    $tool.log(subTitle);
    $tool.log(message);
}

function check_flow() {
    var request = {
        url: "https://api.64clouds.com/v1/getServiceInfo?veid=" + config.veid + "&api_key="+ config.api_key,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 - mmbWebBrowse - ios"
        }
      };
    $tool.get(request, function (error, response, body) {
        // response.status response.statusCode response.headers
        if (!error) {
            if (typeof response.statusCode == "undefined" || response.statusCode == 200) {
                parse_flow(JSON.parse(body));
            }
        } else {
            $tool.notify("搬瓦工流量查询", "接口查询错误", error);
            $tool.log(error)
        }
    })
}

// https://github.com/yichahucha/surge/blob/master/tool.js
// 基于上面修改，在此注明出处
function tool() {
    const isSurge = typeof $httpClient != "undefined";
    const isQuanX = typeof $task != "undefined";
    const isJSBox = typeof $app != "undefined" && $app.info.bundleID == "app.cyan.jsbox"
    const isNode = typeof require == "function" && !isJSBox;
    const isResponse = typeof $response != "undefined";
    const isRequest = typeof $request != "undefined";
    const isRe = isRequest || isResponse;
    const nodeStore = "prefs.json";
    const nodeRequest = (() => {
        if (isNode) {
            const request = require('request');
            return ({request})
        } else {
            return (null)
        }
    })();
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message);
        if (isSurge) $notification.post(title, subtitle, message);
        if (isNode) log(JSON.stringify({title, subtitle, message}));
        if (isJSBox) $push.schedule({title: title, body: subtitle + "\n" + message})
    };
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key);
        if (isSurge) return $persistentStore.write(value, key);
        if (isJSBox) return $prefs.set(key, value);
        if (isNode) {
            try {
                var fs = require("fs");
                if (!fs.existsSync(nodeStore)) {
                    fs.writeFileSync(nodeStore, JSON.stringify({}));
                }
                var data = JSON.parse(fs.readFileSync(nodeStore));
                data[key] = value;
                fs.writeFileSync(nodeStore, JSON.stringify(data))
                return true;
            } catch (error) {
                log(error);
            }
            return false;
        }
    };
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key);
        if (isSurge) return $persistentStore.read(key);
        if (isJSBox) return $prefs.get(key);
        if (isNode) {
            try {
                var fs = require("fs");
                var data = JSON.parse(fs.readFileSync(nodeStore));
                if (typeof data[key] != "undefined") {
                    return data[key];
                }
            } catch (error) {
                log(error);
            }
            return "";
        }
    };
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status;
            } else if (response.statusCode) {
                response["status"] = response.statusCode;
            }
        }
        return response
    };
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {url: options}
            options["method"] = "GET";
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        });
        if (isNode && nodeRequest) {
            nodeRequest.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options};
            options["header"] = options["headers"];
            delete options["headers"];
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data);
                callback(error, adapterStatus(resp.response), body)
            };
            $http.get(options);
        }
    };
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {url: options}
            options["method"] = "POST";
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode && nodeRequest) {
            nodeRequest.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options};
            options["header"] = options["headers"];
            delete options["headers"];
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data);
                callback(error, adapterStatus(resp.response), body)
            };
            $http.post(options);
        }
    };
    const log = (message) => console.log(message);
    const done = (value = {}) => {
        if (isQuanX) isRe ? $done(value) : "";
        if (isSurge) isRe ? $done(value) : $done()
    };

    const timeout = (handler, timeout = 0) => {
        if (typeof setTimeout != "undefined") {
            return setTimeout(handler, timeout);
        }
        return (handler, timeout = 0)=>{return handler()};
    };

    const httpRequest = async (resq, delay = 0, statusCode = 200) => {
        return new Promise(resolve => {
            timeout(() => {
                var adapterClient = get;
                if (typeof resq.method != "undefined") {
                    if (resq.method == "POST") {
                        adapterClient = post
                    }
                    delete resq.method;
                }
                adapterClient(resq, function (error, response, body) {
                    try {
                        if (!error) {
                            if (typeof response.statusCode == "undefined" || response.statusCode == statusCode) {
                                resolve(JSON.parse(body));
                            }
                        } else {
                            notify('', 'httpRequest', error);
                            resolve("");
                        }
                    } catch (e) {
                        notify('', 'httpRequest catch', e);
                        resolve("");
                    }
                });

            }, parseInt(delay))
        });
    };

    return {
        isQuanX,
        isSurge,
        isJSBox,
        isRequest,
        isResponse,
        isRe,
        notify,
        write,
        read,
        get,
        post,
        httpRequest,
        log,
        done
    }
}

