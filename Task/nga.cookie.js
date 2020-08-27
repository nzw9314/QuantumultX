/*
 https://ngabbs.com/nuke.php?
 ^https:\/\/ngabbs.com\/nuke.php\?? url script-request-body https://raw.githubusercontent.com/chouchoui/QuanX/master/Scripts/nga/nga.cookie.js
*/


const $vei = init();
$vei.cookie = "vei_nga_cookie";
$vei.body = "vei_nga_body";

const bodyRegex = /__act=([_a-z]*)&(.*)&t=(\d*)/;

if (bodyRegex.test($request.body)) {

    console.log($request.body)

    let body = $request.body.replace(bodyRegex, "__act=check_in&$2&t=");
    const cookie = $request.headers["Cookie"];

    $vei.write(body, $vei.body);
    $vei.write(cookie, $vei.cookie);

    $vei.notify("NGA刮墙", "Cookie", "Cookie获取成功")
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


$done({});
