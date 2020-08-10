/*
From 🐩️哥 (https://raw.githubusercontent.com/Neurogram-R/Surge/master/Q-Search.js)

Quantumult X:
[rewrite_local]
^https:\/\/duckduckgo.com\/\?q=.+ url script-echo-response https://raw.githubusercontent.com/zZPiglet/Task/master/Q-Search.js

Surge:
[Script]
Q-Search = type=http-request,pattern=^https:\/\/duckduckgo.com\/\?q=.+,script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Q-Search.js

[mitm]
hostname = duckduckgo.com
 */

const engineData = {
    // Wikipedia
    "wiki": "https://wikipedia.org/wiki/%@",
    // Wikipedia 中文
    "wk": "https://zh.wikipedia.org/wiki/%@",
    // Magi
    "mg": "https://magi.com/search?q=%@",
    // 百度
    "bd": "https://www.baidu.com/s?wd=%@",
    // GitHub
    "gh": "https://github.com/search?q=%@",
    // Google 搜索 TestFlight
    "tf": "https://www.google.com/search?as_q=%@&as_sitesearch=testflight.apple.com",
    // Google 图片
    "gi": "https://www.google.com/search?&tbm=isch&q=%@",
    // 有道词典
    "yd": "https://dict.youdao.com/search?q=%@",
    // Google 译至中
    "trc": "https://translate.google.com/#view=home&op=translate&sl=auto&tl=zh-CN&text=%@",
    // Google 译至英
    "tre": "https://translate.google.com/#view=home&op=translate&sl=auto&tl=en&text=%@",
    // Google 译至日
    "trj": "https://translate.google.com/#view=home&op=translate&sl=auto&tl=ja&text=%@",
    // 少数派站内搜索
    "sspai": "https://sspai.com/search/post/%@",
    // Google 搜索少数派
    "ssp": "https://www.google.com/search?as_q=%@&as_sitesearch=sspai.com",
    // YouTube
    "ytb": "https://www.youtube.com/results?search_query=%@",
    // Stack Overflow
    "so": "https://stackoverflow.com/search?q=%@",
    // StackExchange
    "se": "https://stackexchange.com/search?q=%@",
    // WolframAlpha
    "wa": "https://www.wolframalpha.com/input/?i=%@",
    // 豆瓣
    "db": "https://www.douban.com/search?q=%@",
    // 知乎
    "zh": "https://www.zhihu.com/search?q=%@",
    // 微博
    "wb": "https://s.weibo.com/weibo/%@",
    // Reddit
    "rd": "https://www.reddit.com/search?q=%@",
    // Twitter
    "tw": "https://twitter.com/search?q=%@",
    // Google 搜索 Google Drive 资源
    "gd": "https://www.google.com/search?q=%22Google+Drive%22+%@",
    // t.me/gdurl 搜索 Google Drive 资源
    "tgd": "https://t.me/s/gdurl?q=%@",
    // t.me/Remux_2160P 搜索 Google Drive 资源
    "t4k": "https://t.me/s/Remux_2160P?q=%@\n",
    // DuckDuckGo
    "ddg": "https://duckduckgo.com/?ia=about&q=%@",
    // Google
    "gl": "https://www.google.com/search?q=%@",
    "@default": "gl"
}

let commands = Object.keys(engineData)
let url = $request.url
let keyword = url.match(/duckduckgo.com\/\?q=([^&]+)/)
if (keyword) {
    keyword = keyword[1]
    let patt = new RegExp(`^(${commands.join("|")})(\\+|%20)`, "g")
    let command = keyword.match(patt)
    if (command) {
        url = engineData[command[0].replace(/(\+|%20)/, "")].replace(/%@/, keyword.replace(command[0], ""))
    } else {
        url = engineData[engineData["@default"]].replace(/%@/, keyword)
    }
    const response={
        status: "HTTP/1.1 302 Temporary Redirect",
        headers: {
            Location: url,
        }
    }

    $done(response)
} else {
    $done({})
}