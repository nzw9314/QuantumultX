/*
quantumult x:
[rewrite_local]
^https:\/\/api\.bilibili\.com\/pgc\/player\/api\/playurl url script-response-body bilibili_playurl_qx.js
[mitm]
hostname=api.bilibili.com

Original author:@onewayticket255
*/

let url = $request.url

function getParams(key) {
    let regex = new RegExp(`${key}=(\\d*?)&`)
    let tmp = regex.exec(url)
    return tmp[1]
}

let api = `https://bilibili.mlyx.workers.dev/?cid=${getParams('cid')}&ep_id=${getParams('ep_id')}`

var biliUrl = {
  url: api,
  method: "GET"
};

$task.fetch(biliUrl).then(response => {
    if(response.statusCode == 404) {
        $notify('获取播放链接失败', '使用原始链接', 'biliplus未收录此资源或服务器错误')
        $done({})
    } else {
        //$notify('获取播放链接成功', '使用大会员链接', 'success');
        $done(response.body);
    }
}, reason => {
    $notify('获取播放链接失败', '使用原始链接', 'biliplus未收录此资源或服务器错误')
    $done({})
});