/*
quantumult x:
[rewrite_local]
^https:\/\/api\.bilibili\.com\/pgc\/view\/app\/season url script-response-body bilibili_season_qx.js
[mitm]
hostname=api.bilibili.com

Original author:@onewayticket255
*/

let url = $request.url

function getParams(key) {
    let regex = new RegExp(`${key}=(\\d*?)&`)
    let tmp = regex.exec(url)
    if (tmp) {
        return tmp[1]
    }
}

let season_id = getParams("season_id")

if (season_id) {
    let api = `https://bilibili.mlyx.workers.dev/?season_id=${season_id}`

    var biliUrl = {
      url: api,
      method: "GET"
    };

    $task.fetch(biliUrl).then(response => {
        if(response.statusCode == 404) {
            $notify('获取播放链接失败', '使用原始链接', 'biliplus未收录此资源或服务器错误')
            $done({})
        } else {
            //$notify('获取播放链接成功', '使用大会员链接', 'success')
            $done(response.body)
        }
    }, reason => {
        $notify('获取播放链接失败', '使用原始链接', 'biliplus未收录此资源或服务器错误')
        $done({})
    });
} else {
    $done({})
}