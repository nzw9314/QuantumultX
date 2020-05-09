/*
    Q-Search for Surge by Neurogram
 
    - Safari Search Add-ons by Neurogram
 
    使用说明：

        [Script]
        Q-Search = type=http-request,pattern=^https:\/\/duckduckgo.com\/\?q=.+,script-path=Q-Search.js

        [MITM]
        hostname = duckduckgo.com

        注：先进入设置更改 Safari 默认搜索为 DuckDuckGo

    关于作者
    Telegram: Neurogram
    GitHub: Neurogram-R
*/

const engineData = {
    "bd": "https://www.baidu.com/s?wd=%@",
    "db": "https://m.douban.com/search/?query=%@",
    "gh": "https://github.com/search?q=%@",
    "gl": "https://www.google.com/search?q=%@",
    "gm": "https://www.google.com/search?&tbm=isch&q=%@",
    "yd": "http://dict.youdao.com/search?q=%@",
    "ddg": "https://duckduckgo.com/?ia=about&q=%@",
    "@default": "gl"
}

let commands = Object.keys(engineData)
let url = $request.url
let keyword = url.match(/duckduckgo.com\/\?q=([^&]+)/)
if (keyword) {
    keyword = keyword[1]
    let patt = new RegExp(`^(${commands.join("|")})\\+`, "g")
    let command = keyword.match(patt)
    if (command) {
        url = engineData[command[0].replace(/\+/, "")].replace(/%@/, keyword.replace(command[0], ""))
    } else {
        url = engineData[engineData["@default"]].replace(/%@/, keyword)
    }
    $done({
        response: {
            status: 302,
            headers: {
                Location: url,
            }
        }
    })
} else {
    $done({})
}