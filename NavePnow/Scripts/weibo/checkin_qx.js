/*
Weibo Super Talk Check in
Made by NavePnow

[task_local]
0 12 * * * checkin_qx.js
https:\/\/weibo\.com\/p\/aj\/general\/button\?ajwvr=6&api=http:\/\/i\.huati\.weibo\.com\/aj\/super\/checkin url script-response-body get_cookie_qx.js

MITM = weibo.com
*/
var accounts = [
           ["IU", "100808d4151ccebfbae55e8f7c0f68f6d18e4d"],
        //["SWITCH", "1008084239f063a3d4fb9d38a0182be6e39e76"],
           ["林允儿", "1008080c5fb650788fe5c7577f0b6ec4a34038"],
        //["泰妍", "100808377e60b6bf5ffc9cdc603cc93b75c663"],
           ["Apple", "1008089f6290f4436e5a2351f12e03b6433c3c"],
           ["周杰伦", "1008087a8941058aaf4df5147042ce104568da"],
           ["英雄联盟", "10080854838a6bbae2a14b0fb0c7905f6a070a"],
           ["Lisa", "1008084b3f3945e087a0dd32f56c3603b7d153"],

]
function launch() {
    for (var i in accounts) {
        let name = accounts[i][0]
        let super_id = accounts[i][1]
        weibo_super(name, super_id)
    }
    //$done();
}

launch()

function weibo_super(name, super_id) {
    //$notification.post(name + "的微博超话签到", super_id, "")
    let super_url = {
        url: "https://weibo.com/p/aj/general/button?ajwvr=6&api=http://i.huati.weibo.com/aj/super/checkin&texta=%E7%AD%BE%E5%88%B0&textb=%E5%B7%B2%E7%AD%BE%E5%88%B0&status=0&id=" + super_id + "&location=page_100808_super_index&timezone=GMT+0800&lang=zh-cn&plat=MacIntel&ua=Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_15)%20AppleWebKit/605.1.15%20(KHTML,%20like%20Gecko)%20Version/13.0.4%20Safari/605.1.15&screen=375*812&__rnd=1576850070506",
        headers: {        
            Cookie: $prefs.valueForKey("super_cookie"),
            }
    };

    $task.fetch(super_url).then(response => {
            var obj = JSON.parse(response.body);
            //console.log(obj);
            var code = obj.code;
            var msg = obj.msg;
            //console.log(msg);
            if (code == 100003) {   // 行为异常，需要重新验证
                //console.log("Cookie error response: \n" + data)
                $notify(name + "的微博超话签到", "❕" + msg, obj.data.location)
            } else if (code == 100000) {
                tipMessage = obj.data.tipMessage;
                alert_title = obj.data.alert_title;
                alert_subtitle = obj.data.alert_subtitle;
                $notify(name + "的微博超话签到", "签到成功" + " 🎉", alert_title + "\n" + alert_subtitle)

            } else if (code == 382004){
                msg = msg.replace("(382004)", "")
                $notify(name + "的微博超话签到", "", msg + " 🎉")
            } else{
                $notify(name + "的微博超话签到", "", msg)
            }

        }, reason => {
    //$notify("京东签到错误‼️‼️", "", reason.error);
        $notify(name + "的微博超话签到错误！", "", reason.error)
  });
}