
/**
本脚本可查询火车余票及列车时刻查询
1.可更改出发地、目的地及列车车次
2.K值为列车车次所对应的序号或者车次，请不要填错，详情请看日志
3.部分列车无法查到列车时刻信息，部分列车总计时间有误，以时刻表为准，部分座席可能无票价，第一次运行会报错，请重新运行
4.提供所有席别余票信息，测试阶段，仅供参考
5.借鉴sazs34大佬的smart脚本
更新日志:
7月28日: 
取消手动座席选择，增加硬卧，软卧，商务座等所有票价信息，优化通知;
支持boxjs远程自定义配置，增加可自定义车次，车次序号设置过大时可显示经过车次，可根据车次序号进行设置，由于苹果限制，车次可能显示不全
增加点击通知链接跳转详情页
～～～～～～～～～～～～～～～～
QX 1.0.6+ :
[task_local]
0 * * * * trainquery.js
# Remote 远程
0 10 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/trainquery.js, tag=火车票及列车时刻
～～～～～～～～～～～～～～～～
Surge 4.0 :  
[Script]
火车票及列车时刻 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/trainquery.js,script-update-interval=0

～～～～～～～～～～～～～～～～～
Loon 2.1.0+
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/trainquery.js, enabled=true, tag=火车票及列车时刻

-----------------

 */


const leftstat ='北京'  //出发地

      tostat = '上海'   //目的地

      peo = 'ADULT'   //乘客类型，'ADULT'是成人，'0X00'是学生

      lefdate = '2020-08-15' //出发日期

      settrain = '1'  //车次序号或者列车车次!!

const $ = new Env('列车时刻查询')

  leftstation = $.getdata('left')||leftstat

  tostation = $.getdata('end')||tostat

  purpose = $.getdata('people')||peo

  leftdate = $.getdata('leavedate')||lefdate

let K = $.getdata('setrain')||settrain

!(async () => {
  await namecheck()
  await trainscheck()
  await prize()
  await traintime()
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())


//站点编码
function namecheck() {
  return new Promise((resolve, reject) =>{
const stationnocheck = {
    url: `https://kyfw.12306.cn/otn/resources/js/framework/station_name.js`,
    method: 'GET',
};
 $.get(stationnocheck, (err, resp, data) => {
    //console.log(response.statusCode + "\n\n" + data);
    statno =data.split(`${leftstation}`)[1].split("|")[1]
    tostat = data.split(`${tostation}`)[1].split("|")[1]
    resolve()
   })
  })
}

let nowDate = $.time('yyyy-MM-dd');
if (nowDate > leftdate ){
 $.msg(`火车查询错误❌`,"日期错误,请检查后重试",'')
}

// 获取车次列表
function trainscheck() {
 return new Promise((resolve, reject) =>{
   const myRequest = {
    url: `https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=${leftdate}&leftTicketDTO.from_station=${statno}&leftTicketDTO.to_station=${tostat}&purpose_codes=${purpose}`,
    method: 'GET',
    headers: {'Cookie' : 'JSESSIONID=1B1CEADF1B9F831C25E71D7F2D996294'}
};
 $.get(myRequest, (err, resp, data) => {
  //console.log('余票信息' + "\n\n" + data);
  let ress = JSON.parse(data)
try {
    let reg = /^[a-zA-Z][0-9]+$/
  for (i=0;i<ress.data.result.length;i++){
      yupiaoinfo = ress.data.result[i].split("|")
      train = yupiaoinfo[3],
      starttime = yupiaoinfo[8],
      arrivetime = yupiaoinfo[9],
      total = yupiaoinfo[10].split(":")[0]+'小时'+yupiaoinfo[10].split(":")[1]+'分钟',
      yingzuo = yupiaoinfo[29],
      yingwo = yupiaoinfo[28],
      ruanwo = yupiaoinfo[23],
      yideng = yupiaoinfo[31],
      erdeng = yupiaoinfo[30],
      wuzuo = yupiaoinfo[26],
      trainlist =  '['+(i+1)+'] 车次:'+train+" "+starttime+"--"+ arrivetime+" 总计时间:"+total+'\n一等座:'+yideng+' 二等座:'+erdeng+ ' 硬座:'+yingzuo+" 硬卧:"+yingwo+ "  软卧:"+ ruanwo+' 无座:'+wuzuo+'\n'
   //trainno = ress.data.result[i].split("|")[2]
      $.log(trainlist)
if(reg.test(K) && K== ress.data.result[i].split("|")[3]){
   K  = i+1
  }
}
if (K<=ress.data.result.length){
 info = ress.data.result[K-1].split("|")
      //console.log(info)
      traincode = info[3]  //列车车次
      trainno = info[2]    //列车编码
      fromstationno = info[16] //发车站序号
      tostationno = info[17]   //目的地序号
      fromstation = info[4]    //始发站编码
      endstation = info[5]     //终点站编码
      leftstationcode = info[6] //出发站编码
      tostationcode = info[7]   //目的地编码
      setyingzuo = info[29]     //硬座余票
      setyingwo = info[28]      //硬卧余票
      setyideng = info[31]      //一等座余票
      seterdeng = info[30]      //二等座余票
      setruanzuo = info[24]     //软座余票
      setwuzuo = info[26]       //无座余票
      setdongwo = info[33]      //动卧余票
      setshangwu = info[32]      //商务座余票
      setruanwopro = info[21]    //高级软卧余票
      setruanwo = info[23]      //软卧余票
      seattypes = info[35]      //座席代码
      totaltime  = info[10].split(":")[0]+'小时'+info[10].split(":")[1]+'分钟' //运行时间
      resolve()
  }
else if (!reg.test(K) && K>ress.data.result.length){
   var trainlist = ""
for (y=0;y<ress.data.result.length;y++){
   trainlist +=  (y+1)+'. '+ress.data.result[y].split("|")[3]+" "+ress.data.result[y].split("|")[8]+"-"+ ress.data.result[y].split("|")[9]+" 历时"+ress.data.result[y].split("|")[10].split(":")[0]+'时'+ress.data.result[y].split("|")[10].split(":")[1]+'分\n'
    }
 $.msg(`火车查询错误❌`,"共"+ress.data.result.length+"辆列车经过,请检查后重试",trainlist)
 return
}
}catch(e){
      $.msg(`火车查询错误❌`,"无此方向列车经过,请检查后重试",e)
      resolve()
      return 
     }
   })
  })
}


function prize() {
 return new Promise((resolve, reject) =>{
   var timestamp=$.startTime;
   const prizeurl = {
    url: `https://kyfw.12306.cn/otn/leftTicket/queryTicketPrice?train_no=${trainno}&from_station_no=${fromstationno}&to_station_no=${tostationno}&seat_types=${seattypes}&train_date=${leftdate}`,
    method: 'GET',
    headers : {'Accept-Encoding' : `gzip, deflate, br`,
'Connection' : `keep-alive`,
'Accept' : `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
'Host' : `kyfw.12306.cn`,
'Cookie' : `_uab_collina=159587465195914267490366; JSESSIONID=2D2C3ED0892CE56ADB0576B030CC1344; _jc_save_fromDate=${leftdate}; _jc_save_fromStation=${leftstation}%2C${leftstationcode}; _jc_save_toDate=${leftdate}; _jc_save_toStation=${tostation}%2${tostationcode}; _jc_save_wfdc_flag=dc; BIGipServerotn=250610186.64545.0000; route=9036359bb8a8a461c164a04f8f50b252;  RAIL_EXPIRATION=${timestamp}`,
'User-Agent' : `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/13.0 Safari/604.1`,
'Accept-Language' : `zh-cn` }
}
 $.get(prizeurl, (err, resp, data) => {
    //console.log('票价信息: 响应码: ' +resp.statusCode+" \n"+ data+'\n');
    if ( data == -1){
    $.msg('列车查询失败‼️', '该'+traincode+'次列车车票暂停发售或者查询失败,请重试', err)
     return
    }
   let result = JSON.parse(data)
   if (result.data.M){
   setyideng += `(${result.data.M})  `
   }
   if (result.data.O){
   seterdeng += `(${result.data.O})  `
   }
   if (result.data.A3){
   setyingwo += `(${result.data.A3})  `
   }
   if (result.data.F){
   setdongwo += `(${result.data.F})  `
   }
   if (result.data.A1){
   setyingzuo += `(${result.data.A1})  `
   }
   if (result.data.A2){
   setruanzuo += `(${result.data.A2})  `
   }
   if (result.data.WZ){
   setwuzuo += `(${result.data.WZ})  `
   }
   if (result.data.A9){
   setshangwu += `(${result.data.A9})  `
   }
   if (result.data.AI){
   setruanwo += `(${result.data.AI})  `
   }
   if (result.data.A4){
   setruanwo += `(${result.data.A4})  `
   }
   if (result.data.A6){
   setruanwopro += `(${result.data.A6})  `
   }
   if (result.data.AJ){
   setyingwo += `(${result.data.AJ})  `
   }
  })
resolve()
 })
}

function traintime() {
 return new Promise((resolve, reject) =>{
   const myRequest = {
    url: `https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=${trainno}&from_station_telecode=${fromstation}&to_station_telecode=${endstation}&depart_date=${leftdate}`,
    method: 'GET',
}
 $.get(myRequest, (err, resp, data) => {
   var detail = ""
    //console.log(response.statusCode + "\n\n" + data);
   let result = JSON.parse(data)
   if (result.status == true) {
const traincode = result.data.data[0].station_train_code
const arrivetime = result.data.data[0].arrive_time
   starttime = result.data.data[0].start_time
   stationname = result.data.data[0].station_name
   startstation = result.data.data[0].start_station_name
   edstation = result.data.data[0].end_station_name

if (setyideng){
   detail += '一等座: '+setyideng
  }
if (seterdeng){
   detail += ' 二等座: '+seterdeng
  }
if (setshangwu){
   detail += '\n商务座: '+setshangwu
  }
if (setyingzuo){
   detail += '硬座: '+setyingzuo
  }
if (setruanzuo){
   detail += ' 软座: '+setruanzuo  
  }
if (setwuzuo){
   detail += ' 无座: '+setwuzuo
  }
if (setruanwo){
   detail += '\n软卧: '+setruanwo
  }
if (setyingwo){
   detail += ' 硬卧: '+setyingwo
  }
if (setruanwopro){
   detail += ' 高级软卧: '+setruanwopro
  }
if (setdongwo){
  detail += ' 动卧: '+setdongwo
  }
if (purpose=='0X00'){
  purpose = '学生票 '
}
else {
  purpose = '成人票 '
}
  if(detail==""){
    detail += "该列车车票暂停发售或已停运,点击打开详情页查看"
  }
else{
     detail +="\n"+leftstation+'到达目的地'+tostation+'历时'+totaltime+'\n'+arrivetime +'--'+starttime+ '  '+stationname
}
for (i=1;i<result.data.data.length;i++){
    detail  += `\n`+result.data.data[i].arrive_time +'--'+result.data.data[i].start_time+ '  '+result.data.data[i].station_name
  }
  const openurl = encodeURI(`https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=${leftstation},${leftstationcode}&ts=${tostation},${tostationcode}&date=${leftdate}&flag=N,N,Y`)
const title = traincode+ "次列车"
const subTitle = '始发站: '+startstation+ '--终点站: '+edstation+' ('+purpose+ ')'
  $.msg(title+ " - 出行日期: " +leftdate, subTitle, detail, { "open-url": `${openurl}`})
  //console.log(traincode+'次列车  \n'+detail)
  }
  resolve()
  })
 })
}


function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t){return new Promise(s=>{const e=this.getdata("@chavy_boxjs_userCfgs.httpapi");console.log(e);const[i,o]=e.split("@"),h={url:`http://${o}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:5},headers:{"X-Key":i,Accept:"*/*"}};$.post(h,(t,e,i)=>s(i))})}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i),console.log(`${i}: ${JSON.stringify(h)}`)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============📣系统通知📣=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`❗️${this.name}, 错误!`,t.stack):$.log("",`❗️${this.name}, 错误!`,t.message)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${e} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
