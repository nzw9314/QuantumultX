// 统一 Surge、QuanX、Node 相关脚本 API, 方便开发、调试
// 包括 Node（request 模块）、Surge（$httpClient，$notification，$persistentStore 模块）、QuanX（$task，$notify，$prefs 模块）

const $tool = tool()
// notify
$tool.notify("title", "subtitle", "message")
// cache
$tool.write("value", "key")
$tool.read("key")
// get
$tool.get("http://www.baidu.com", function (error, response, body) {
    // response.status response.statusCode response.headers
    if (!error) {
        if (response.statusCode == 200) {
            console.log(body)
        }
    } else {
        console.log(error)
    }
})
// post
const request = {
    url: "https://www.baidu.com",
    body: ""
    //...
}
$tool.post(request, function (error, response, body) {
    // response.status response.statusCode response.headers
    if (!error) {
        if (response.statusCode == 200) {
            console.log(body)
        }
    } else {
        console.log(error)
    }
})

function tool() {
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isResponse = typeof $response != "undefined"
    const node = (() => {
        if (typeof require == "function") {
            const request = require('request')
            return ({ request })
        } else {
            return (null)
        }
    })()
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (node) console.log(JSON.stringify({ title, subtitle, message }));
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response.status) {
            response["statusCode"] = response.status
        } else if (response.statusCode) {
            response["status"] = response.statusCode
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => { callback(null, adapterStatus(response), response.body) }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => { callback(error, adapterStatus(response), body) })
        if (node) node.request(options, (error, response, body) => { callback(error, adapterStatus(response), body) })
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => { callback(null, adapterStatus(response), response.body) }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, (error, response, body) => { callback(error, adapterStatus(response), body) })
        if (node) node.request.post(options, (error, response, body) => { callback(error, adapterStatus(response), body) })
    }
    return { isQuanX, isSurge, isResponse, notify, write, read, get, post }
}