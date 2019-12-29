/*
Check in for 1point3acres by NavePnow
Adviser: wangfei021325
使用说明：

关于作者
Telegram: Leped_Bot
GitHub: NavePnow
*/
const accounts = [
    ["username@xxx.com", "xxx","x","xxxx"]
]

async function launch() {
    for (var i in accounts) {
        let username = encodeURIComponent(accounts[i][0])
        let password = encodeURIComponent(accounts[i][1])
        let questionid = encodeURIComponent(accounts[i][2])
        let answer = encodeURIComponent(accounts[i][3])
        // let username = accounts[i][0]
        // let password = accounts[i][1]
        // let questionid = accounts[i][2]
        // let answer = accounts[i][3]
        await getloginhash(username, password, questionid, answer)
    }
    $done();
}

launch()
function getloginhash(username, password, questionid, answer)
{
    let table = {
        url: "https://www.1point3acres.com/bbs/member.php?mod=logging&action=login&mobile=1" ,
        headers: {
            "Accept-Language": "en-us",
        }
    }
    $httpClient.get(table, async function(error, response, data)
    {
        if (error)
        {
            console.log(error)
            $notification.post(username + '获取登陆hash失败', error, "");
        }else{
            // if(data.match(/(gbk)/))
            // {

            // }
                if (data.match(/(欢迎您回来)/))
                {
                    
                    //console.log(data)
                    //$notification.post("登陆成功")
                    await getcheckinhash(username)
                }else{
                    var formhash_login = data.match(/formhash" value="(\w+)/)
                    if (formhash_login)
                    {
                        formhash_login = formhash_login[0].replace("formhash\" value=\"", "")
                        await login(username, password, questionid, answer, formhash_login)
                    }else{
                        var formhash_login1 = data.match(/formhash" value='(\w+)/)
                        if(formhash_login1)
                        {   
                            formhash_login1 = formhash_login1[0].replace("formhash\" value='", "")
                            await login(username, password, questionid, answer, formhash_login1)
                        }
                        else{
                            $notification.post("操作失败_获取登陆hash");
                        }
                    }
                }
            

        }
    })
}

// 如果登陆成功， 获取签到hash进行更新，进行内容签到，否则返回
function login(username, password, questionid, answer, formhash)
{

    let table1 = {
        url: "https://www.1point3acres.com/bbs/member.php?mod=logging&action=login&loginsubmit=yes&loginhash=LtM5y&mobile=yes",
        headers: {
            "Accept-Language": "en-us",
        },
        body: "formhash=" + formhash + "&referer=https%3A%2F%2Fwww.1point3acres.com%2Fbbs%2F.%2F&fastloginfield=username&username=" + username + "&password="+ password + "&submit=%E7%99%BB%E5%BD%95&questionid="+ questionid +"&answer=" + answer + "&cookietime=2592000"
    }
    $httpClient.post(table1, async function (error, response, data) {
        if(error)
        {
            console.log(error)
            $notification.post(username + '登陆失败', error, "");
        }else{
            if (data.match(/(欢迎您回来)/))
            {
                //console.log(data)
                //$notification.post("登陆成功")
                await getcheckinhash(username)
            }else{
                $notification.post("操作失败_登陆");
            }

        }
    })

}
function getcheckinhash(username)
{
    let table2 = {
        url: "https://www.1point3acres.com/bbs/forum.php?mobile=1",
        headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
        "Accept-Language": "en-us"
    }
    }
    $httpClient.get(table2, async function (error, response, data) {
        //console.log(data)
        if (error) {
            console.log(error)
            $notification.post(username + '获取签到hash失败', error, "");
        } else {
            //console.log(data)
            var formhash_checkin = data.match(/formhash=(\w+)/)
            if (formhash_checkin) {
                formhash_checkin = formhash_checkin[0].replace("formhash=", "")
                //console.log(formhash_checkin)
                await checkin(formhash_checkin, username)
                //$notification.post(formhash_checkin);
                //await login(username, password, questionid, answer, formhash_tmp)
            }
            else{
                $notification.post("操作失败_获取签到hash");
            }
        }
    })
}

function checkin(formhash, username)
{
    let table3 = {
        url: "https://www.1point3acres.com/bbs/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&inajax=1",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset:utf-8;",
        },
        body: "formhash=" + formhash + "&qdxq=kx&qdmode=2&todaysay=&fastreply=0"
    }
    $httpClient.post(table3, async function (error, response, data) {
        if (error) {
            console.log(error)
            $notification.post(username + '签到失败', error, "");
        } else {
            console.log(data)
            var result = data.match(/<div class="c">([\s\S]*?)<a/)
            //$notification.post("进入签到")
            if (data.match(/(Äú½ñÈÕÒÑ¾­Ç©µ½£¬ÇëÃ÷ÌìÔÙÀ´£¡)/))
            {
                $notification.post("1point3acres","already check-in","");
            } else if (data.match(/(Ç©µ½³É¹¦)/)) {
                $notification.post("1point3acres","check-in success","");
            }else{
                $notification.post("1point3acres","check-in failure","");
            }


        }
    })
    
}
