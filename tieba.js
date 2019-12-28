/*
[task_local]
0 9 * * * sign_baidu_tieba_v2.js
 */
var cookieVal = $prefs.valueForKey("CookieTB");
var singleNotifyCount = 30; //想签到几个汇总到一个通知里,这里就填几个(比如我有13个要签到的,这里填了5,就会分三次消息通知过去)
var process = {
    total: 0,
    result: [
        // {
        //     bar:'',
        //     level:0,
        //     exp:0,
        //     errorCode:0,
        //     errorMsg:''
        // }
    ]
};
var url_fetch_sign = {
    url: "https://tieba.baidu.com/mo/q/newmoindex",
    headers: {
        "Content-Type": "application/octet-stream",
        Referer: "https://tieba.baidu.com/index/tbwise/forum",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366"
    }
};
var url_fetch_add = {
    url: "https://tieba.baidu.com/sign/add",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookieVal,
        "User-Agent": "Mozilla/5.0 (iPho