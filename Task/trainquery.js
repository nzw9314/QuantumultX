
/**
本脚本可查询火车余票及列车时刻查询
1.可更改出发地、目的地及列车车次
2.K值为列车车次所对应的序号，请不要填错，详情请看日志
3.部分列车无法查到列车时刻信息，部分列车总计时间有误，以时刻表为准，部分座席可能无票价，第一次运行会报错，请重新运行
4.提供所有席别余票信息，测试阶段，仅供参考
5.借鉴sazs34大佬的smart脚本
更新日志:
5月22日: 取消手动座席选择，增加硬卧，软卧，商务座等所有票价信息，优化通知

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
const leftstation ='北京'  //出发地
const tostation = '上海'   //目的地
const purpose = 'ADULT'   //乘客类型，'ADULT'是成人，'0X00'是学生
const leftdate = '2020-07-29' //出发日期
const K = ' 1 '  //车次序号!!
//const traincode = ""
const $sy = init()


all()
async function all() 
{ 
  await namecheck();
  await trainscheck();
  await prize();
  await traintime();
}

//站点编码
function namecheck() {
  return new Promise((resolve, reject) =>{
const stationnocheck = {
    url: `https://kyfw.12306.cn/otn/resources/js/framework/station_name.js`,
    method: 'GET',
};
$task.fetch(stationnocheck).then(response => {
    //console.log(response.statusCode + "\n\n" + response.body);
   //let result = JSON.parse(response.body)
    statno = response.body.split(`${leftstation}`)[1].split("|")[1]
    tostat = response.body.split(`${tostation}`)[1].split("|")[1]
resolve()
   })
  })
}
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate()+1;
if (month < 10) {
    month = "0" + month;
}
if (day < 10) {
    day = "0" + day+1;
}
var nowDate = year + "-" + month + "-" + day;
if (nowDate > leftdate ){
 $notify(`火车查询错误❌`,"日期错误,请检查后重试",''),
$done()
}

// 获取车次列表
function trainscheck() {
 return new Promise((resolve, reject) =>{
   setTimeout(() => {
   const myRequest = {
    url: `https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=${leftdate}&leftTicketDTO.from_station=${statno}&leftTicketDTO.to_station=${tostat}&purpose_codes=${purpose}`,
    method: 'GET',
    headers: {'Cookie' : 'JSESSIONID=1B1CEADF1B9F831C25E71D7F2D996294'}
};

$task.fetch(myRequest).then(response => {
  //console.log('余票信息' + "\n\n" + response.body);
  let ress = JSON.parse(response.body)
try{
    train0 = ress.data.result[0].split("|")
      train =train0[3]
      starttime = train0[8]
      arrivetime = train0[9]
      total = train0[10].split(":")[0]+'小时'+train0[10].split(":")[1]+'分钟'
    //trainno = train0[2]
      ruanwopro = train0[21]
      dongwo = train0[33]
      yingzuo = train0[29]
      yingwo = train0[28]
      ruanwo = train0[23]
      shangwu = train0[32]
      yideng = train0[31]
      erdeng = train0[30]
      wuzuo = train0[26]
    trainlist =  '[1] 车次:'+train+" "+ starttime + '--' + arrivetime+" 总计时间:"+total+'\n一等座:'+yideng+' 二等座:'+erdeng+ ' 硬座:'+yingzuo+" 硬卧:"+yingwo+ " 软卧:"+ ruanwo+' 无座:'+wuzuo+'\n'
  for (i=1;i<ress.data.result.length;i++){
      yupiaoinfo = ress.data.result[i].split("|")
      train =yupiaoinfo[3]
      starttime = yupiaoinfo[8]
      arrivetime = yupiaoinfo[9]
      total = yupiaoinfo[10].split(":")[0]+'小时'+yupiaoinfo[10].split(":")[1]+'分钟'
      yingzuo = yupiaoinfo[29]
      yingwo = yupiaoinfo[28]
      ruanwo = yupiaoinfo[23]
      yideng = yupiaoinfo[31]
      erdeng = yupiaoinfo[30]
      wuzuo = yupiaoinfo[26]
      trainlist +=  '\n'+'['+(i+1)+'] 车次:'+train+" "+starttime+"--"+ arrivetime+" 总计时间:"+total+'\n一等座:'+yideng+' 二等座:'+erdeng+ ' 硬座:'+yingzuo+" 硬卧:"+yingwo+ "  软卧:"+ ruanwo+' 无座:'+wuzuo+'\n'
   //trainno += ress.data.result[i].split("|")[2]
   }
   console.log(trainlist)
if (K<=ress.data.result.length){
const info=ress.data.result[K-1].split("|")
      //console.log(info)
      traincode = info[3]
      trainno = info[2]
      fromstationno = info[16]
      tostationno = info[17]
      fromstation = info[4]
      endstation = info[5]
      leftstationcode = info[6]
      tostationcode = info[7]
      setyingzuo = info[29]
      setyingwo = info[28]
      setyideng = info[31]
      seterdeng = info[30]
      setruanzuo = info[24]
      setwuzuo = info[26]
      setdongwo = info[33]
      setshangwu = info[32]
      setruanwopro = info[21]
      setruanwo = info[23]
      seattypes = info[35]
      totaltime  = info[10].split(":")[0]+'小时'+info[10].split(":")[1]+'分钟'
}
else {
    $notify(`火车车次错误❌`,"共"+ress.data.result.length+"列火车经过", '请检查后重试')
}
}catch(e){
 $notify(`火车查询错误❌`,"无此方向直达列车经过,请检查后重试",e)}
   resolve()
   })
  })
 })
}
function prize() {
 return new Promise((resolve, reject) =>{
  setTimeout(() => {
   const myRequest = {
    url: `https://kyfw.12306.cn/otn/leftTicket/queryTicketPrice?train_no=${trainno}&from_station_no=${fromstationno}&to_station_no=${tostationno}&seat_types=${seattypes}&train_date=${leftdate}`,
    method: 'GET',
    headers: {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'}
}
$task.fetch(myRequest).then(response => {
 try {
    console.log('票价信息: ' + response.body+'\n');
   let result = JSON.parse(response.body)
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
}
catch (e){
  //$notify('列车票价查询失败‼️', '无'+traincode+'列车票价信息', e)
   }
resolve()
  })
  })
 })
}

function traintime() {
 return new Promise((resolve, reject) =>{
   const myRequest = {
    url: `https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=${trainno}&from_station_telecode=${fromstation}&to_station_telecode=${endstation}&depart_date=${leftdate}`,
    method: 'GET',
}

$task.fetch(myRequest).then(response => {
 try {
    //console.log(response.statusCode + "\n\n" + response.body);
   let result = JSON.parse(response.body)
  var detail = ""
   if (result.status == true) {
const traincode = result.data.data[0].station_train_code
const arrivetime = result.data.data[0].arrive_time
   starttime = result.data.data[0].start_time
   stationname = result.data.data[0].station_name
   startstation = result.data.data[0].start_station_name
   endstation = result.data.data[0].end_station_name
if (setyideng){
   detail += '一等座: '+setyideng
  }
if (seterdeng){
   detail += '二等座: '+seterdeng
  }
if (setshangwu){
   detail += '\n商务座: '+setshangwu
  }
if (setyingzuo){
   detail += '硬座: '+setyingzuo
  }
if (setruanzuo){
   detail += '软座: '+setruanzuo  
  }
if (setwuzuo){
   detail += '无座: '+setwuzuo
  }
if (setruanwo){
   detail += '\n软卧: '+setruanwo
  }
if (setyingwo){
   detail += '硬卧: '+setyingwo
  }
if (setruanwopro){
   detail += '高级软卧: '+setruanwopro
  }
if (setdongwo){
  detail += '动卧: '+setdongwo
  }
  detail +=' (如票价无显示请重试)\n'+leftstation+'到达目的地'+tostation+'历时'+totaltime+'\n'+arrivetime +'--'+starttime+ '  '+stationname
for (i=1;i<result.data.data.length;i++){
    detail  += `\n`+result.data.data[i].arrive_time +'--'+result.data.data[i].start_time+ '  '+result.data.data[i].station_name
}
const title = traincode+ "次列车"
const subTitle = '始发站: '+startstation+ '--终点站: '+endstation
 $notify(title+ " - 出行日期: " +leftdate, subTitle, detail)
  console.log(traincode+'次列车  \n'+detail)
  }
} catch (e){
   console.log(traincode)
  $notify('列车查询失败‼️', '无'+traincode+'列车信息', e)
}
  })
$done()
 })
}


function init(){isSurge=()=>{return undefined===this.$httpClient?false:true}
isQuanX=()=>{return undefined===this.$task?false:true}
getdata=(key)=>{if(isSurge())return $persistentStore.read(key)
if(isQuanX())return $prefs.valueForKey(key)}
setdata=(key,val)=>{if(isSurge())return $persistentStore.write(key,val)
if(isQuanX())return $prefs.setValueForKey(key,val)}
msg=(title,subtitle,body)=>{if(isSurge())$notification.post(title,subtitle,body)
if(isQuanX())$notify(title,subtitle,body)}
log=(message)=>console.log(message)
get=(url,cb)=>{if(isSurge()){$httpClient.get(url,cb)}
if(isQuanX()){url.method='GET'
$task.fetch(url).then((resp)=>cb(null,resp,resp.body))}}
post=(url,cb)=>{if(isSurge()){$httpClient.post(url,cb)}
if(isQuanX()){url.method='POST'
$task.fetch(url).then((resp)=>cb(null,resp,resp.body))}}
done=(value={})=>{$done(value)}
return{isSurge,isQuanX,msg,log,getdata,setdata,get,post,done}}
