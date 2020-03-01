/*
微信小程序【活动抽奖】助手自动签到脚本，支持QX
未做surge适配
制作者：t.me/makexp

[task_local]
1 0 * * * hdcj.js

[rewrite_local]
^https:\/\/new\.api\.hdcj\.9w9\.com\/api\/sign\/sign url script-request-body hdcj.js

[mitm]
hostname = new.api.hdcj.9w9.com
*/

const userCheckinURL = 'https://new.api.hdcj.9w9.com/api/sign/sign';
const userCookieKey  = 'cjzs_userCookieKey';
const userAgentKey   = 'cjzs_userAgentKey';
const userTokenKey   = 'cjzs_userTokenKey';
const userRefererKey = 'cjzs_userReferKey';
const userBodyKey    = 'cjzs_userBodyKey';
let userBody = '';

let isGetCookie = typeof $request !== 'undefined';

if (isGetCookie) {
    // 获取 Cookie
    if ($request.headers['api-token']) {
        //var usercookie = $request.headers['Cookie'];
        var userAgent  = $request.headers['User-Agent'];
        var userToken  = $request.headers['api-token'];
        var userReferer= $request.headers['Referer'];
        
         userBody   = $request.body;
        //console.log(userBody);
        //$prefs.setValueForKey(usercookie, userCookieKey);
        $prefs.setValueForKey(userAgent, userAgentKey);
        $prefs.setValueForKey(userToken, userTokenKey);
        $prefs.setValueForKey(userReferer, userRefererKey);
        $prefs.setValueForKey(userBody, userBodyKey);
        $notify("成功获取活动抽奖 Cookie 🎉", "", "请禁用该脚本")
    }
    $done({});
} else {
    // 签到
    var request = {
        url: userCheckinURL,
        method: 'POST',
        headers: {
            'app-version': '3.3.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Cotent-Type': 'application/json',
            'Content-Type': 'application/json',
            'api-token': $prefs.valueForKey(userTokenKey),
            'Cache-Control': 'no-cache',
            'Referer': $prefs.valueForKey(userRefererKey),
            'Host': 'new.api.hdcj.9w9.com',
            'User-Agent': $prefs.valueForKey(userAgentKey),
            'Accept-Language' : 'en-us',
            'Accept' : 'application/vnd.lumen.v2+json',
            'Content-Length' : 'en-us',
        },
        body: $prefs.valueForKey(userBodyKey)

    };
//console.log(request);
    $task.fetch(request).then(response => {
        const obj = JSON.parse(response.body);
        if (obj.result == "success") {
            $notify("活动抽奖", "", "签到成功！");
        } else {
            $notify("活动抽奖", "", obj.result);
        }
        $prefs.setValueForKey(obj.data, userDataKey); 
    }, reason => {
        $notify("活动抽奖", "", reason.error)
    });
}
