/*
Weibo Super Talk Check in Get Cookie.
Made by NavePnow
The following URL check in once
https: //weibo.com/p/:id/super_index

[Script]
http-request https:\/\/weibo\.com\/p\/aj\/general\/button\?ajwvr=6&api=http:\/\/i\.huati\.weibo\.com\/aj\/super\/checkin max-size=0,script-path=get_cookie.js

MITM = weibo.com
*/
if ($request.headers['Cookie']) {
    var url = $request.url;
    var super_id = url.match(/id.*?(?=&loc)/)
    super_id = super_id[0].replace("id=", "")
    var cookie = $request.headers['Cookie'];
    //$notification.post("", super_id, super_cookie)
    var super_cookie = $persistentStore.write(cookie, "super_cookie");
    if(!super_cookie)
    {
        $notification.post("写入微博超话Cookie失败！", "超话id: " + super_id, "请重试")
    }
    else {
            $notification.post("写入微博超话Cookie成功🎉", "超话id: " + super_id, "您可以手动禁用此脚本")
    }
    } else {
            $notification.post("写入微博超话Cookie失败！", "超话id: " + super_id, "请退出账号, 重复步骤")
        }
    
$done({})