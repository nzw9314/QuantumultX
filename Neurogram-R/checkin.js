/*
Check in for Surge by Neurogram

- 站点签到脚本
- 流量详情显示
- 多站签到支持
- 多类站点支持
 
使用说明：https://www.notion.so/neurogram/Check-in-0797ec9f9f3f445aae241d7762cf9d8b

关于作者
Telegram: Neurogram
GitHub: Neurogram-R
*/

const accounts = [
    ["隔壁西站", "https://example.com/auth/login", "example@v2bz.com", "password"],
    ["DlerCloud", "https://example.com/auth/login", "example@dlercloud.com", "password"],
    ["CCCAT", "https://example.com/user/login.php", "example@cccat.com", "password"]
]

const autoLogout = false

function launch() {
    for (var i in accounts) {
        let title = accounts[i][0]
        let url = accounts[i][1]
        let email = accounts[i][2]
        let password = accounts[i][3]
        if (autoLogout) {
            let logoutPath = url.indexOf("auth/login") != -1 ? "user/logout" : "user/logout.php"
            $httpClient.get(url.replace(/(auth|user)\/login(.php)*/g, "") + logoutPath, function (error, response, data) {
                login(url, email, password, title)
            })
        } else {
            checkin(url, email, password, title)
        }
    }
    $done()
}

launch()

function login(url, email, password, title) {
    let loginPath = url.indexOf("auth/login") != -1 ? "auth/login" : "user/_login.php"
    let table = {
        url: url.replace(/(auth|user)\/login(.php)*/g, "") + loginPath,
        body: `email=${email}&passwd=${password}&rumber-me=week`
    }
    $httpClient.post(table, function (error, response, data) {
        if (error) {
            console.log(error);
            $notification.post(title + '登录失败', error, "");
        } else {
            if (JSON.parse(data).msg.match(/邮箱或者密码错误|Mail or password is incorrect/)) {
                $notification.post(title + '邮箱或者密码错误', "", "");
            } else {
                checkin(url, email, password, title)
            }
        }
    }
    );
}

function checkin(url, email, password, title) {
    let checkinPath = url.indexOf("auth/login") != -1 ? "user/checkin" : "user/_checkin.php"
    $httpClient.post(url.replace(/(auth|user)\/login(.php)*/g, "") + checkinPath, function (error, response, data) {
        if (error) {
            console.log(error);
            $notification.post(title + '签到失败', error, "");
        } else {
            if (data.match(/\"msg\"\:/)) {
                dataResults(url, JSON.parse(data).msg, title)
            } else {
                login(url, email, password, title)
            }
        }
    });
}

function dataResults(url, checkinMsg, title) {
    let userPath = url.indexOf("auth/login") != -1 ? "user" : "user/index.php"
    $httpClient.get(url.replace(/(auth|user)\/login(.php)*/g, "") + userPath, function (error, response, data) {
        let resultData = ""
        let result = []
        if (data.match(/theme\/malio/)) {

            let flowInfo = data.match(/trafficDountChat\s*\(([^\)]+)/)
            if (flowInfo) {
                let flowData = flowInfo[1].match(/\d[^\']+/g)
                let usedData = flowData[0]
                let todatUsed = flowData[1]
                let restData = flowData[2]
                result.push(`今日：${todatUsed}\n已用：${usedData}\n剩余：${restData}`)
            }

            let userInfo = data.match(/ChatraIntegration\s*=\s*({[^}]+)/)
            if (userInfo) {
                let user_name = userInfo[1].match(/name.+'(.+)'/)[1]
                let user_class = userInfo[1].match(/Class.+'(.+)'/)[1]
                let class_expire = userInfo[1].match(/Class_Expire.+'(.+)'/)[1]
                let money = userInfo[1].match(/Money.+'(.+)'/)[1]
                result.push(`用户名：${user_name}\n用户等级：lv${user_class}\n余额：${money}\n到期时间：${class_expire}`)
            }

            if (result.length != 0) {
                resultData = result.join("\n\n")
            }
        } else {

            let todayUsed = data.match(/>*\s*今日(已用)*[^B]+/)

            if (todayUsed) {
                todayUsed = flowFormat(todayUsed[0])
                result.push(`今日：${todayUsed}`)
            }

            let usedData = data.match(/(Used Transfer|>过去已用|>已用|\"已用)[^B]+/)
            if (usedData) {
                usedData = flowFormat(usedData[0])
                result.push(`已用：${usedData}`)
            }

            let restData = data.match(/(Remaining Transfer|>剩余流量|>可用|\"剩余)[^B]+/)
            if (restData) {
                restData = flowFormat(restData[0])
                result.push(`剩余：${restData}`)
            }

            if (result.length != 0) {
                resultData = result.join("\n")
            }
        }

        let flowMsg = resultData == "" ? "流量信息获取失败" : resultData
        $notification.post(title, checkinMsg, flowMsg);

    });
}

function flowFormat(data) {
    data = data.replace(/\d+(\.\d+)*%/, "")
    let flow = data.match(/\d+(\.\d+)*\w*/)
    return flow[0] + "B"
}
