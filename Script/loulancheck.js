/*
楼兰签到
网页登录 www.lltxt.com 点击 "我的信息 - 签到 - 开始签到" 获取 cookie.

[rewrite_local]
^https:\/\/www\.lltxt\.com/hack\.php\?H_name=qiandao&action=qiandao url script-request-header loulancheck.js

[task_local]
8 0 * * * loulancheck.js

[mitm]
hostname = www.lltxt.com
*/

const cookieKey = 'iNotification_www.lltxt.com_cookie';

let isGetCookie = typeof $request !== 'undefined';

if (isGetCookie) {
    // 获取 cookie
    if ($request.headers['Cookie']) {
        var cookie = $request.headers['Cookie'];
        $prefs.setValueForKey(cookie, cookieKey);
        $notify("成功获取 www.lltxt.com cookie 🎉", "", "请禁用该脚本")
    }
    $done({});
} else {
    // 签到
    var request = {
        url: 'https://www.lltxt.com/hack.php?H_name=qiandao&action=qiandao',
        headers: {
            'Cookie': $prefs.valueForKey(cookieKey),
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Safari/604.1'
        }
    };

    $task.fetch(request).then(response => {
        if (response.body.indexOf('请明天再来') != -1) {
            $notify("楼兰论坛签到", "", "已签过，请下期再来");
        } else if (response.body.indexOf('恭喜你签到成功') != -1) {
            $notify("楼兰论坛签到", "", "签到成功");
        } else if (response.body.indexOf('您没有登录') != -1) {
            $notify("楼兰论坛签到", "", "请重新获取 Cookie");
        } else {
            $notify("楼兰论坛签到", "", "失败，请查看日志");
            console.log(response.body)
        }
    }, reason => {
        $notify("楼兰论坛签到", "", reason.error)
    });
}
