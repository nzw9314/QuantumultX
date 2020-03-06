const up_blacklist = ['NathanRich火锅大王','大祥哥来了'];
const title_blackwords = ['乔碧萝','鸡你太美'];
const region_blacklist = ['宅舞','三次元舞蹈'];
let body = $response.body;
console.log($request.url)
console.log(body)
body = JSON.parse(body);

// 观看页面
if (-1 != $request.url.indexOf('/x/v2/view\?a') && 0 == body['code']) {
    body['data']['relates'] = body['data']['relates'].filter(function (item) {
        if (item.hasOwnProperty('is_ad')) {
            return false;
        }
        return true;
    });
}

// 排行榜
if (-1 != $request.url.indexOf('/x/v2/rank') && 0 == body['code']) {
    body['data'] = body['data'].filter(function (item) {
        if (up_blacklist.includes(item.name)) {
            return false;
        }
        return true;
    });
}

// feed
if (-1 != $request.url.indexOf('/x/v2/feed') && 0 == body['code']) {
    body['data']['items'] = body['data']['items'].filter(function (item) {
        // search_subscribe 人气UP主推荐
        if (['ad_web_s', 'ad_web', 'live', 'banner', 'search_subscribe'].includes(item.card_goto)) {
            return false;
        }
        if (item.hasOwnProperty('ad_info')) {
            return false;
        }
        if (up_blacklist.includes(item.args.up_name)) {
            return false;
        }
        if (region_blacklist.includes(item.args.rname)) {
            return false;
        }
        for( let word of title_blackwords){
            if(-1 != item.title.indexOf(word)){
                return false;
            }
        }
        return true;
    });
}

// 搜索页Banner
if(-1 != $request.url.indexOf('search/resource') && 0 == body['code']){
    body['data'] = [];
}

// 评论页面notice
if (-1 != $request.url.indexOf('/x/v2/reply/main') && 0 == body['code']) {
    body['data']['notice'] = {};
}

// tab
if (-1 != $request.url.indexOf('resource/show/tab?') && 0 == body['code']) {
    // 会员购
    body['data']['bottom'] = body['data']['bottom'].filter(function (item) {
        return item.id != 180
    });
    // 70 直播 影视
    body['data']['tab'] = body['data']['tab'].filter(function (item) {
        return item.id != 38247 && item.id != 39 && item.id != 165
    });
    // 游戏中心
    body['data']['top'] = body['data']['top'].filter(function (item) {
        return item.id != 175
    });
}

// 我的
if (-1 != $request.url.indexOf('/x/v2/account/mine') && 0 == body['code']) {
    body['data']['vip_section'] = {};
    body['data']['vip_section_v2'] = {};
    body['data']['sections'] = body['data']['sections'].filter(
        function (item, index) {
            if ('创作中心' == item.title) {
                return true;
            }
            item.items = item.items.filter(function (section_items) {
                console.log(section_items.title);
                if ((['我的课程', '我的钱包', '会员购中心', '直播中心', '青少年模式', '看视频免流量', '我的客服'].includes(section_items.title))) {
                    return true;
                }
                return true;
            });
            return true;
        });
}
body = JSON.stringify(body);
$done({body});
