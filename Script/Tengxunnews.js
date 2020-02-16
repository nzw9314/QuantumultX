
/*


Cookie登录app签到页获取，第一次获取后可以注释掉。


[rewrite_local]
#腾讯新闻app签到，by红鲤鱼与绿鲤鱼与驴
完全瞎搞，试试先，估计不管用2010.1.31

http:\/\/mtrace\.qq\.com\/mkvcollect* url script-request-header Tengxunnews.js

[task_local]
# 表示每天1分执行一次

[mitm]
hostname = mtrace.qq.com
*/
var note = "";
var tip = "";
const log = true;
const $nobyda = nobyda();
const KEY = $nobyda.read("Cookietxnews");


if ($nobyda.isRequest) {
  GetCookie()
  $nobyda.end()
} else {
  getsign()
  $nobyda.end()
}


function coinget() {
  const coinUrl = {
    url: 'https://api.inews.qq.com/task/v1/usermergetask/list?isJailbreak=0&mac=020000000000&qn-rid=1002_F86D5955-79EA-48EB-B77A-801EA56BF88F&device_model=iPhone11%2C8&device_appin=C507900B-0557-4EF2-9C1A-FDFC25A12DE5&deviceToken=88683183648bc52079c0d050aa85f9b26ad6c579a689d1f6ce40bf2fbe2510f4&currentTabId=user_center&qn-time=1580389149156&isMainUserLogin=1&qqnews_refpage=QNMineViewController&__qnr=23e30a9d5106&qn-sig=C7079B60B7B9C891F54B35BBCE5C56FE&network_type=gsm_2g&startTimestamp=1580389134&hw=iPhone11%2C8&page_type=other&adcode=440118&qimei=67250f12-c779-48eb-97bd-2b02a2108ee2&mainUserUin=ec32e10857a43e39a26ee9b818bd4561ffeae937983cc476b95e37842d3b759855&omgbizid=314f3b09d354604fe3e8dc3630230fd7c5950060114b14&imsi=460-01&screen_height=896&trueVersion=5.9.93&global_session_id=1580389082733&omgid=a67749ce97b56b4fa6ba762033ea8e75c6e30010114b14&user_vip_type=0&idfa=3A2DB012-A169-4787-924F-FE552F99B2D1&qn-newsig=800d489d41369ac9895533d53b37eae87f41078c7763ccc2c61c262b10e74c5e&currentChannelId=user_center&global_info=1%7C1%7C1%7C1%7C1%7C13%7C8%7C1%7C0%7C6%7C1%7C1%7C1%7C%7C0%7CJ309P000000000%3AJ902P000000000%3AJ601P900000000%3AJ601P800000000%3AJ601P700000000%3AB601P600286204%3AA601P500175101%3AA601P400109601%3AA601P300293601%3AJ601P200000000%3AJ601P100000000%3AA601P000261101%3AA601P901291001%3AJ601P811000000%3AA601P701226201%3AA601P621294101%3AA601P620269601%3AA601P109107102%3AA601P105118803%3AA601P019237403%3AA601P016212405%3AJ601P006000000%3AJ603P000000000%3AJ401P100000000%3AJ401P000000000%3AJ602P900000000%3AB602P800276602%3AB602P700269204%3AJ602P600000000%3AJ602P500000000%3AB602P400235103%3AJ602P300000000%3AJ602P200000000%3AB602P100262103%3AB602P000137902%3AA602P901257901%3AA602P613271701%3AA602P611253801%3AA602P516234601%3AA602P414259901%3AA602P307160708%3AJ602P302000000%3AA602P208205801%3AA602P117262101%3AJ602P007000000%3AA602P003136401%3AJ304P000000000%3AJ310P700000000%3AJ310P200000000%3AJ310P100000000%3AA310P000267103%3AB701P000098502%3AJ703P000000000%3AB704P000098802%3AJ702P000000000%3AA064P400225101%3AA064P300243701%3AB064P100240203%3AA064P020290301%3AA064P010290102%3AA064P000286801%3AB085P000087702%3AB074P200238202%3AA074P000243301%3AJ903P000000000%3AB267P300217302%3AJ267P200000000%3AA267P100245302%3AA267P000248301%3AJ073P000000000%3AA060P700222501%3AA060P200293403%3AJ060P100000000%3AJ060P090000000%3AJ060P020000000%3AJ060P010000000%3AJ060P000000000%3AA060P201280406%3AJ060P099000000%3AA060P063275302%3AJ060P016000000%3AJ403P700000000%3AJ403P600000000%3AB403P200282904%3AA403P100265306%3AA403P000253401%3AJ403P602000000%3AJ404P200000000%3AB404P000279104%3AJ055P200000000%3AA055P000274502%3AJ402P200000000%3AA402P100251007%3AA402P010290802%3AA402P000206001%3AB054P300219702%3AA054P200264602%3AA054P100218901%3AA054P090289602%3AB054P080289703%3AA054P030288501%3AB054P020288304%3AB054P010285102%3AA054P000264802%3AJ901P200000000%3AB901P100226405%3AJ901P000000000%7C1402%7C0%7C1%7C24%7C24%7C0%7C0%7C0%7C365%3A1000365%7C3%7C3%7C1%7C1%7C1%7C1%7C1%7C1%7C-1%7C0%7C0%7C0%7C2%7C2%7C1%7C0%7C3%7C0%7C1%7C1%7C0%7C4%7C2%7C0%7C0%7C0%7C0%7C0%7C1%7C0%7C1%7C1%7C1%7C0%7C1%7C1%7C4%7C0%7C0%7C0%7C11%7C20%7C1%7C0%7C1%7C1%7C3%7C0%7C1%7C4%7C0%7C1%7C1%7C41%7C0%7C51%7C60%7C0%7C1%7C0%7C0%7C1%7C0%7C1%7C0%7C0%7C71%7C81%7C0%7C1%7C71&preStartTimestamp=1580389083&screen_scale=2&pagestartfrom=icon&appver=12.4_qqnews_5.9.93&store=1&screen_width=414&devid=67250F12-C779-48EB-97BD-2B02A2108EE2&activefrom=icon&apptype=ios&httpRequestUid=23e30a9d3f2d',
    headers: {
      Cookie: KEY,
    }
  };
  

  $nobyda.get(coinUrl, function(error, response, data) {
    if (error) {
         $nobyda.notify("获取金币失败‼️", "", "");
     if (log) console.log("获取金币" + data)
    } else {
 const jb = JSON.parse(data)
  var notb = "我的金币" + jb.data.points;

      console.log(note+","+notb+ "\n" )
            
    $nobyda.notify(note+ "\n" ,notb, tip)
 
        }
        
      })

                      
}


function getsign() {
  const llUrl = {
    url: 'https://api.inews.qq.com/task/v1/user/signin/add?isJailbreak=0&mac=020000000000&qn-rid=1002_BF38F921-CC8F-4B12-AAB4-23C79DA21559&device_model=iPhone11%2C8&device_appin=C507900B-0557-4EF2-9C1A-FDFC25A12DE5&deviceToken=88683183648bc52079c0d050aa85f9b26ad6c579a689d1f6ce40bf2fbe2510f4&currentTabId=user_center&qn-time=1580436160730&isMainUserLogin=1&qqnews_refpage=QNMineViewController&__qnr=23e3c2403669&qn-sig=CFD640D3CCD87494E0306FA1C997B617&network_type=wifi&startTimestamp=1580436158&hw=iPhone11%2C8&page_type=other&adcode=440118&qimei=67250f12-c779-48eb-97bd-2b02a2108ee2&mainUserUin=ec32e10857a43e39a26ee9b818bd4561ffeae937983cc476b95e37842d3b759855&omgbizid=314f3b09d354604fe3e8dc3630230fd7c5950060114b14&imsi=460-01&screen_height=896&trueVersion=5.9.93&global_session_id=1580433913761&omgid=a67749ce97b56b4fa6ba762033ea8e75c6e30010114b14&user_vip_type=0&idfa=3A2DB012-A169-4787-924F-FE552F99B2D1&qn-newsig=5fc7ed2cd55184246a924634cdf40396463f8a1ab7ce1892c6aafa893e16c0ed&currentChannelId=user_center&global_info=1%7C1%7C1%7C1%7C1%7C13%7C8%7C1%7C0%7C6%7C1%7C1%7C1%7C%7C0%7CJ309P000000000%3AJ902P000000000%3AJ601P900000000%3AJ601P800000000%3AJ601P700000000%3AB601P600286204%3AA601P500175101%3AA601P400109601%3AA601P300293601%3AJ601P200000000%3AJ601P100000000%3AA601P000261101%3AA601P901291001%3AJ601P811000000%3AA601P701226201%3AA601P621294101%3AA601P620269601%3AA601P109107102%3AA601P105118803%3AA601P019237403%3AA601P016212405%3AJ601P006000000%3AJ603P000000000%3AJ401P100000000%3AJ401P000000000%3AJ602P900000000%3AB602P800276602%3AB602P700269204%3AJ602P600000000%3AJ602P500000000%3AB602P400235103%3AJ602P300000000%3AJ602P200000000%3AB602P100262103%3AB602P000137902%3AA602P901257901%3AA602P613271701%3AA602P611253801%3AA602P516234601%3AA602P414259901%3AA602P307160708%3AJ602P302000000%3AA602P208205801%3AA602P117262101%3AJ602P007000000%3AA602P003136401%3AJ304P000000000%3AJ310P700000000%3AJ310P200000000%3AJ310P100000000%3AA310P000267103%3AB701P000098502%3AJ703P000000000%3AB704P000098802%3AJ702P000000000%3AA064P400225101%3AA064P300243701%3AB064P100240203%3AA064P020290301%3AA064P010290102%3AA064P000286801%3AB085P000087702%3AB074P200238202%3AA074P000243301%3AJ903P000000000%3AB267P300217302%3AJ267P200000000%3AA267P100245302%3AA267P000248301%3AJ073P000000000%3AA060P700222501%3AA060P200293403%3AJ060P100000000%3AJ060P090000000%3AJ060P020000000%3AJ060P010000000%3AJ060P000000000%3AA060P201280406%3AJ060P099000000%3AA060P063275302%3AJ060P016000000%3AJ403P700000000%3AJ403P600000000%3AB403P200282904%3AA403P100265306%3AA403P000253401%3AJ403P602000000%3AJ404P200000000%3AB404P000279104%3AJ055P200000000%3AA055P000274502%3AJ402P200000000%3AA402P100251007%3AA402P010290802%3AA402P000206001%3AB054P300219702%3AA054P200264602%3AA054P100218901%3AA054P090289602%3AB054P080289703%3AA054P030288501%3AB054P020288304%3AB054P010285102%3AA054P000264802%3AJ901P200000000%3AB901P100226405%3AJ901P000000000%7C1402%7C0%7C1%7C24%7C24%7C0%7C0%7C0%7C365%3A1000365%3A11%7C3%7C3%7C1%7C1%7C1%7C1%7C1%7C1%7C-1%7C0%7C0%7C0%7C2%7C2%7C1%7C0%7C3%7C0%7C1%7C1%7C0%7C4%7C2%7C0%7C0%7C0%7C0%7C0%7C1%7C0%7C1%7C1%7C1%7C0%7C1%7C1%7C4%7C0%7C0%7C0%7C11%7C20%7C1%7C0%7C1%7C1%7C3%7C0%7C1%7C4%7C0%7C1%7C1%7C41%7C0%7C51%7C60%7C0%7C1%7C0%7C0%7C1%7C0%7C1%7C0%7C0%7C71%7C81%7C0%7C1%7C71&preStartTimestamp=1580436035&screen_scale=2&pagestartfrom=icon&appver=12.4_qqnews_5.9.93&store=1&screen_width=414&devid=67250F12-C779-48EB-97BD-2B02A2108EE2&activefrom=icon&apptype=ios&httpRequestUid=23e3c240bb0c',
    headers: {
      Cookie: KEY,
    }
  };
  

  $nobyda.post(llUrl, function(error, response, data) {
    if (error) {
         $nobyda.notify("腾讯新闻签到失败‼️", "", "");
       if (log) console.log("腾讯新闻签到失败" + data)
    } else {
const obj = JSON.parse(data)
    //console.log("原始数据:"+data)
      if (obj.info=="success"){
        
        
        console.log("腾讯新闻签到成功，已连续签到" + obj.data.signin_days+"天"+"\n")
       note = "腾讯新闻签到成功，已连续签到" + obj.data.signin_days+"天"
       tip = obj.data.tip_soup
       coinget()

    

} else {
    $nobyda.notify("签到失败，🉐登录腾讯新闻app获取cookie", "", "")

    console.log("签到失败，🉐登录腾讯新闻app获取cookie"+data)

}
}
})
}




      
                   

function GetCookie() {
  var CookieName = "腾讯新闻签到";
  if ($request.headers) {
    var CookieKey = "Cookietxnews";
    var CookieValue = $request.headers['Cookie'];
    if ($nobyda.read(CookieKey) != (undefined || null)) {
      if ($nobyda.read(CookieKey) != CookieValue) {
        var cookie = $nobyda.write(CookieValue, CookieKey);
        if (!cookie) {
          $nobyda.notify("更新" + CookieName + "Cookie失败‼️", "", "");
        } else {
          $nobyda.notify("更新" + CookieName + "Cookie成功 🎉", "", "");
        }
      }
    } else {
      var cookie = $nobyda.write(CookieValue, CookieKey);
      if (!cookie) {
        $nobyda.notify("首次写入" + CookieName + "Cookie失败‼️", "", "");
      } else {
        $nobyda.notify("首次写入" + CookieName + "Cookie成功 🎉", "", "");
      }
    }
  } else {
    $nobyda.notify("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
  }
    console.log("cookie输出成功？" + cookie);
}



function nobyda() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};
