/*
 * 转自nobyda，修改压缩之后自用
 */
function nobyda() {
    const start = Date.now()
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isLoon = typeof $loon != "undefined"
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
    const getRequestUrl = () => {
        if (isQuanX) return $resource.link
        if (isSurge) return $request.url
        return ""
    }
    const getResponseBody = () => {
        if (isQuanX) return $resource.content
        if (isSurge) return $response.body
        return ""
    }
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
    const done = (value) => {
        let key = `body`
        if(isRequest){
            if (isQuanX) key = `content`
            if (isSurge) key = `body`
        }
        let obj = {}
        obj[key] = value
        if (isQuanX) isRequest ? $done(obj) : null
        if (isSurge) isRequest ? $done(obj) : $done()
        if (isNode) log(JSON.stringify(obj))
    }
    const isEmpty = (obj) => {
        if(typeof obj == "undefined" || obj == null || obj == ""){
            return true;
        }else{
            return false;
        }
    }
    const wait = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time))
    }
    return {isRequest, isJSBox, isSurge, isQuanX, isLoon, isNode, getRequestUrl, getResponseBody, msg, setValueForKey, getVal, get, post, log, time, done, isEmpty, wait}
}