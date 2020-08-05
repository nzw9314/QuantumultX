const $vei = init();
$vei.cookie = "vei_nga_cookie";
$vei.body = "vei_nga_body";

const cookie = $vei.read($vei.cookie) || "";
const body = $vei.read($vei.body) || "";
const userAgent = 'NGA/7.0.4 (iPhone; iOS 13.6; Scale/3.00)';
const xUserAgent = "'NGA_skull/7.0.4(iPhone10,3;iOS 13.6)'"
const currentTimeSpan = Date.parse(new Date()) / 1000;

if (!cookie || !body) {
    console.log("NGA刮墙，请获取Cookie");
    $vei.notify("NGA刮墙", "刮墙失败", "请获取Cookie");
} else {
    const options = {
        url: "https://ngabbs.com/nuke.php?",
        method: "POST",
        headers: {
            Cookie: cookie,
            "User-Agent": userAgent,
            "'X-User-Agent'": xUserAgent
        },
        'Content-Type': 'application/x-www-form-urlencoded',
        body: `${body}${currentTimeSpan}`
    }

    $vei.post(options, (error, response, body) => {
        if (error) {
            console.log(error);
            this.notify("NGA刮墙", "刮墙失败", "请查看日志");
        } else if (response.status === 200) {
            console.log(body);
            const result = JSON.parse(body);
            if (result.error) {
                $vei.notify("NGA刮墙", "刮墙失败", result.error.join(";"));
            } else if (result.data) {
                const message = result.data[0];
                const continued = result.data[1].continued;
                const sum = result.data[1].sum;
                $vei.notify("NGA刮墙", "刮墙成功", `${message}，连续刮墙${continued}天，累计刮墙${sum}天`);
            }
        }

    })
}



function init() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
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
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, post, end }
}
