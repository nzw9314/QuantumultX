/* 
本脚本为电视节目预告
1.数据从电视家数据库获取
2.常用卫视代码
北京: btv1 | 湖南: hunan | 浙江: zhejiang
河南: henan| 江苏: jiangsu|广东: guangdong
更多电视台请参加电视家网络列表
3.需要更换电视台的，建议本地使用
4.借鉴sazs34大佬的smart脚本
～～～～～～～～～～～～～～～～
QX 1.0.6+ :

[task_local]
1 10 * * * tvpreview.js

～～～～～～～～～～～～～～～～
Surge 4.0 :  
[Script]
tvpreview.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/tvpreview.js,script-update-interval=0

～～～～～～～～～～～～～～～～～
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/tvpreview.js, enabled=true, tag=电视节目预告

-----------------

By Macsuny                   
*/
const c = "cctv1"  //修改电视台
const sy = init()
const tvnum = sy.getdata(c)
const method = "GET"
       d = new Date();
       M = d.getMonth()+1, D = d.getDate();
       h = ("0" + (d.getHours())).slice(-2);            
       m = ("0" + (d.getMinutes())).slice(-2);
      weekday = new Array(7);
      weekday[0]="星期日";
      weekday[1]="星期一";
      weekday[2]="星期二";
      weekday[3]="星期三";
      weekday[4]="星期四";
      weekday[5]="星期五";
      weekday[6]="星期六";
  n = weekday[d.getDay()]
const wurl = {
    url: "http://api.cntv.cn/epg/epginfo?serviceId=cbox&c="+tvnum,
    headers: {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'}
}
   sy.get(wurl, (error,response, data) => {    
   try { 
      let result = JSON.parse(data)                              
const title = `${result[`${tvnum}`].channelName}频道节目  ` + M +'月'+ D +'日' + n + h +':'+ m
      detail = `正在播出: ${result[`${tvnum}`].isLive}\n${result[`${tvnum}`].program[0].showTime} ${result[`${tvnum}`].program[0].t}`
      for (i = 1; i < result[`${tvnum}`].program.length; i++)
       {      
         detail += `\n${result[`${tvnum}`].program[i].showTime} ${result[`${tvnum}`].program[i].t}`
       }
      var l = result[`${tvnum}`].program.length
      if (l > 1) {
       for (i = 0; i < l && result[`${tvnum}`].program[i].showTime.split(':')[0] < result[`${tvnum}`].program[l-1].showTime.split(':')[0]; i++)
       { 
        if (result[`${tvnum}`].liveSt == result[`${tvnum}`].program[i].st)
         {   
         subTitle = `即将播出: ${result[`${tvnum}`].program[i+1].t}`
         } 
        }
      }
    else {
      subTitle = ``
       }      
   sy.msg(title, subTitle, detail)
   console.log(title+`\n`+subTitle+`\n`+detail)
  } catch(err) { 
     sy.msg("无此频道节目信息或者台号错误❌", "请检查后重试", err)
     console.log(err)
    }
$done()
 })
function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}

