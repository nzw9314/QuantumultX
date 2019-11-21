let url = 'http://132.145.127.5:7777/pixivtoken'
//DO NOT ABUSE

let headers = $request.headers
$httpClient.get(url, (error, response, data) => {
    if (error) {
        $done({})
    }
    else {
        headers['Authorization'] = `Bearer ${data}`
        $done({headers})
    }
})
