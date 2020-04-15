/*
微信喜马拉雅 By @makexp

微信小程序 - 喜马拉雅 - 我的： 签到 " 获取 Cookie
重复签到不会提醒，，能签，自取

[task_local]
8 0 * * * nzw9314/Script/xmly_wc.js

[rewrite_local]
https://m.ximalaya.com/wechat/ url script-request-header nzw9314/Script/xmly_wc.js

[mitm]
hostname = m.ximalaya.com
*/

const userCheckinURL = 'https://m.ximalaya.com/wechat/api/paidAudition/signIn';
const userCookieKey = 'ximalaya_wechat_userCookieKey';
const userAgentKey = 'ximalaya_wechat_userAgentKey';
const userDataKey = 'ximalaya_wechat_userDataKey';
//const userToken = '_userToken'

let isGetCookie = typeof $request !== 'undefined';

if (isGetCookie) {
    // 获取 Cookie
    if ($request.headers['Cookie']) {
        var cookie = $request.headers['Cookie'];
        var userAgent = $request.headers['User-Agent'];
        $prefs.setValueForKey(cookie, userCookieKey);
        $prefs.setValueForKey(userAgent, userAgentKey);
        $notify("成功获取微信喜马拉雅 cookie 🎉", "", "请在Rewrite_Local禁用该脚本")
    }
    $done({});
} else {
    // 签到
    var request = {
        url: userCheckinURL,
        method: 'POST',
        headers: {
            'Cookie': $prefs.valueForKey(userCookieKey),
            'Accept-Encoding': 'gzip, deflate, br',
            'xm-sign': '5eaf02499406c8e9f548ee374fcac69b(71)1582216331415(27)1582216331415',
            'Connection': 'keep-alive',
            'Host': 'm.ximalaya.com',
            'Accept': '*/*',
            'Referer': 'https://servicewechat.com/wxb63203ca8ecbc8fc/123/page-frame.html',
            'User-Agent': $prefs.valueForKey(userAgentKey),
            'Content-type' : 'application/json',
            'Content-Length': '2',
            'Accept-Language': 'en-us'
        },
        body: JSON.stringify({})
    };

    $task.fetch(request).then(response => {
        const obj = JSON.parse(response.body);
        
        if (obj.data == userDataKey) {
            $notify("微信喜马拉雅", "", "重复签到");
        } else {
            $notify("微信喜马拉雅", "", "签到成功，奖励星星数："+obj.ret);
        }
        var temp = obj.data;
        console.log(obj);
        $prefs.setValueForKey(temp, userDataKey); 
        var tt = $prefs.valueForKey(userDataKey);
        console.log(tt);
    }, reason => {
        $notify("微信喜马拉雅", "", reason.error)
    });
}