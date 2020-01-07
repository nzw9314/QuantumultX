const $tool = tool()

$tool.notify("title", "subtitle", "body")
$tool.setCache("value", "key")
$tool.getCache("key")

$tool.get("http://www.baidu.com", function (error, response, data) {
    console.log(error)
    console.log(response)// response.status response.headers
    console.log(data)
})

const request = {
    url: "https://www.baidu.com",
    body: "{}"
    //...
}
$tool.post(request, function (error, response, data) {
    console.log(error)
    console.log(response)// response.status response.headers
    console.log(data)
})

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

/*function tool() {
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (() => {
        const post = (title, subtitle, message) => {
            if (isQuanX) $notify(title, subtitle, message)
            if (isSurge) $notification.post(title, subtitle, message)
        }
        return { post }
    })()
    const cache = (() => {
        const set = (value, key) => {
            if (isQuanX) return $prefs.setValueForKey(value, key)
            if (isSurge) return $persistentStore.write(value, key)
        }
        const get = (key) => {
            if (isQuanX) return $prefs.valueForKey(key)
            if (isSurge) return $persistentStore.read(key)
        }
        return { set, get }
    })()
    const request = (() => {
        const get = (options, callback) => {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
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
        return { get, post }
    })()
    return { isQuanX, isSurge, notify, cache, request }
}*/
