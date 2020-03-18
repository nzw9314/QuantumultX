/*
Check in for Surge by Neurogram (feat NavePnow)
 - 站点签到脚本
 - 流量详情显示
 - 多站签到支持
 - 多类站点支持
 
使用说明：https://www.notion.so/neurogram/Check-in-0797ec9f9f3f445aae241d7762cf9d8b
关于作者
Neurogram
    Telegram: Neurogram
    GitHub: Neurogram-R
NavePnow
    Telegram: Leped_Bot
    GitHub: NavePnow
*/

var token = 'BOT_TOKEN';
var chat_id = "CHAT_ID";

var url = "https://api.telegram.org/bot" + token;

function originalData(estring) {
    var payload = {
        "method": "sendMessage",
        "chat_id": chat_id,
        "text": estring,
        "parse_mode": "Markdown",
    };
    sendMsg(payload)
}

function sendMsg(payload) {
    var options = {
        'method': 'post',
        'payload': payload
    };

    UrlFetchApp.fetch(url + "/", options)
}

var accounts = [
    ["SAKURA", "https://sakura.aoaomoe.me/auth/login", "XXXXXXXXXXX@XXXXXX.com", "XXXXXXXXXXXX"],
    ["N3RO", "https://n3ro.net/auth/login", "XXXXXXXXXXXXXXX@XXXXX.com", "XXXXXXXXXXXX"]
]

function launch() {
    for (var i in accounts) {
        var title = accounts[i][0]
        var url = accounts[i][1]
        var email = accounts[i][2]
        var password = accounts[i][3]
        login(url, email, password, title)
    }
}

function login(url, email, password, title) {
    var loginPath = url.indexOf("auth/login") != -1 ? "auth/login" : "user/_login.php";
    var login = url.replace(/(auth|user)\/login(.php)*/g, "") + loginPath;
    var table = {
        'method': 'post',
        'payload': {
            "email": email,
            "passwd": password,
            "rumber-me": "week"
        }
    }
    var response = UrlFetchApp.fetch(login, table)
    var cookies = response.getAllHeaders()['Set-Cookie']
    for (i = 0; i < cookies.length; i++) {

        if (cookies[i].indexOf("email") != -1) email = cookies[i];
        if (cookies[i].indexOf("expire_in") != -1) expire_in = cookies[5];
        if (cookies[i].indexOf("ip") != -1) ip = cookies[i];
        if (cookies[i].indexOf("key") != -1) key = cookies[i];
        if (cookies[i].indexOf("uid") != -1) uid = cookies[i];
        if (cookies[i].indexOf("__cfduid") != -1) __cfduid = cookies[i];
        if (cookies[i].indexOf("ip") != -1) ip = cookies[i];;
    }
    email = email.split(";")[0];
    expire_in = expire_in.split(";")[0];
    ip = ip.split(";")[0];
    key = key.split(";")[0];
    uid = uid.split(";")[0];
    __cfduid = __cfduid.split(";")[0];
    cookies = email + "; " + expire_in + "; " + ip + "; " + key + "; " + uid + "; " + __cfduid;
    if (!response) {
        var error_text = title + ' 登录失败';
        originalData(error_text);
    } else {
        var data = response.getContentText();
        if (JSON.parse(data).msg == "邮箱或者密码错误") {
            originalData(title + '邮箱或者密码错误');
        } else if (JSON.parse(data).msg == "\u90ae\u7bb1\u6216\u8005\u5bc6\u7801\u9519\u8bef") {
            originalData(title + '邮箱或者密码错误');
        } else {
            var request = UrlFetchApp.getRequest(login, table)
            checkin(url, title, cookies)
        }
    }

}

function checkin(url, title, cookies) {
    var checkinPath = url.indexOf("auth/login") != -1 ? "user/checkin" : "user/_checkin.php";
    var checkin_url = url.replace(/(auth|user)\/login(.php)*/g, "") + checkinPath;
    var options = {
        'method': 'post',
        'headers': {
            'Cookie': cookies
        }
    };
    var checkin = UrlFetchApp.fetch(checkin_url, options);
    if (!checkin) originalData(title + ' 签到失败');
    else {
        var data = JSON.parse(checkin.getContentText());
        dataResults(url, data.msg, title, cookies)
    }
}

function dataResults(url, checkinMsg, title, cookies) {
    var userPath = url.indexOf("auth/login") != -1 ? "user" : "user/index.php";
    var data_url = url.replace(/(auth|user)\/login(.php)*/g, "") + userPath;
    var options1 = {
        'method': 'get',
        'headers': {
            'Cookie': cookies
        }
    };
    var dataResults = UrlFetchApp.fetch(data_url, options1);
    data = dataResults.getContentText();
    var restData = data.match(/(id="remain">)[^B]+/)
    restData = restData[0].replace("id =\"remain\”>", "")
    var deadline = data.match(/(700;">)[^</p>]+/)
    var restData = data.match(/(id="remain">)[^B]+/)
    restData = restData[0].replace("id=\"remain\">", "")
    var deadline = data.match(/(等级到期时间 )[^</p>]+/)
    deadline = deadline[0].replace("等级到期时间 ", "")
    var todaydata = data.match(/(tag-red)[^B]+/)
    todaydata = todaydata[0].replace("tag-red\">", "")
    var pastdata = data.match(/(<code class="card-tag tag-orange)[^B]+/)
    pastdata = pastdata[0].replace("<code class=\"card-tag tag-orange\">", "")
    Logger.log(checkinMsg)
    if (todaydata || pastdata) {
        originalData("*" + title + "*\n" + checkinMsg + "\n今日已用：" + todaydata + "B" + "\n过去已用：" + pastdata + "B" + "\n剩余流量：" + restData + "B" + "\n到期时间: " + deadline);
    } else {
        originalData("*" + title + "*\n获取流量信息失败");
    }
}