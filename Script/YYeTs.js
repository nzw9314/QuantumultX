let body = $response.body;
body = JSON.parse(body);
if (-1 != $request.url.indexOf('init')) {
    body['adSwitch'] = [];
    body['adUpdateTime'] += 86400*365;
    // 关闭弹幕功能
    // body['barrageIp'] = "";
}
if (-1 != $request.url.indexOf('ads')) {
    // 留下影片推荐,防止轮播位置空白
    body['ads'] = body['ads'].filter(
        function (item) {
            if (6 != item.adType) {
                return false;
            }
            if (-1 == item.click.indexOf('yyets://')) {
                return false;
            }
            return true;
        });
}
body = JSON.stringify(body);
$done({body});
/**
 * MITM: ctrl.playcvn.com
 * 人人影视字幕组(https://itunes.apple.com/cn/app/%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%E5%AD%97%E5%B9%95%E7%BB%84/id1052761459)
 * 应用有广告缓存,可能需要重装
 * http-response http://ctrl.playcvn.com/app/(init|ads) requires-body=true,script-path=YYeTs.js
 */
