/*
Douban Movie Add-ons for Surge by Neurogram
 - 豆瓣电影移动版网页增强
 - 快捷跳转 茶杯狐 搜索
 - 快捷收藏电影至 Airtable
 
关于作者
Telegram: Neurogram
GitHub: Neurogram-R


使用说明

[Script]
茶杯狐
http-response ^https://m.douban.com/movie/subject/.+ script-path=Douban.js,requires-body=true,max-size=307200

Airtable 收藏
http-request ^https://m.douban.com/movie/subject/.+\?seen=\d script-path=Douban.js

[MITM]
hostname = m.douban.com

收藏功能，需自行修改代码，点击 想看 / 看过 触发收藏
*/

let url = $request.url
let movieId = url.match(/subject\/(\d+)/)
let seen = url.match(/\?seen=(\d)$/)
let collect = false  //收藏功能，默认关闭，需自行配置
if (!seen) {
    let body = $response.body
    let title = body.match(/"sub-title">([^<]+)/)
    if (title) {

        // 茶杯狐 部分引用于 Portal of Douban to Cupfox by Jackeriss (https://greasyfork.org/zh-TW/scripts/30020-%E5%9C%A8%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E9%A1%B5%E9%9D%A2%E7%9B%B4%E6%8E%A5%E6%90%9C%E7%B4%A2%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90)
        let cupfox = `<span class="cupfox"><style>.cupfox{vertical-align: middle;}.cupfox:hover{background: #fff!important;}</style>
    <a href="https://www.cupfox.com/search?key=${title[1]}" class="cupfox" target="_blank">
    <?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xli
    nk="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="23px"
     viewBox="0 0 32 23" enable-background="new 0 0 32 23" xml:space="preserve">
    <image id="image0" width="32" height="23" x="0" y="0" xlink:href="data:image
    /png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAuCAYAAACYlx/0AAAABGdBTUEAALGPC/xh
    BQAAACBjSFJN
    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
    MDg6MDD6f5wnAAAAAElFTkSuQmCC"/></svg></a></span>`

        body = body.replace(/("sub-title">.+?)(<\/div>)/, `$1${cupfox}$2`)

        if (collect) {
            body = body.replace(/<a.+pbtn.+wish.+>/, `<a href="${url}?seen=0">`)
            body = body.replace(/<a.+pbtn.+collect.+>/, `<a href="${url}?seen=1">`)
        }

        $done({ body })
    } else {
        $done({})
    }
} else {
    $httpClient.get(`https://api.douban.com/v2/movie/subject/${movieId[1]}?apikey=0df993c66c0c636e29ecbb5344252a4a`, function (error, response, data) {
        let info = JSON.parse(data)
        if (error) {
            $notification.post('获取影片信息失败', error, "");
        } else if (data.msg == "movie_not_found") {
            $notification.post('豆瓣电影', data.msg, "");
        } else {
            let casts = ""
            for (var i = 0; i < info.casts.length; i++) {
                casts = casts + info.casts[i].name + " / "
            }
            let directors = ""
            for (var k = 0; k < info.directors.length; k++) {
                directors = directors + info.directors[k].name + " / "
            }
            let title = info.title + "  " + info.original_title
            let table = {
                url: "https://api.airtable.com/v0/BASE_ID/Douban",
                headers: {
                    Authorization: "API_KEY"
                },
                body: {
                    records: [
                        {
                            "fields": {
                                "Title": title,
                                "Description": info.summary,
                                "Poster": [
                                    {
                                        "url": info.images.large
                                    }
                                ],
                                "Seen": seen[1] == 1 ? true : false,
                                "Actors": casts.replace(/\s\/\s$/, ""),
                                "Director": directors.replace(/\s\/\s$/, ""),
                                "Genre": info.genres.toString(),
                                "Douban": "https://movie.douban.com/subject/" + movieId,
                                "Rating": info.rating.average,
                                "Year": info.year
                            }
                        }
                    ]
                }
            }
            $httpClient.post(table, function (error, response, data) {
                data = JSON.parse(data)
                if (error) {
                    $notification.post('收藏失败', error, "");
                } else if (data.records) {
                    $notification.post('豆瓣电影', title + " 收藏成功", "");
                } else {
                    $notification.post('收藏失败', data.error.type, data.error.message);
                }
            })
        }
    })
    $done({ url: url.replace(/\?seen=\d/, "") })
}
