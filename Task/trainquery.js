
/**
本脚本可查询火车余票及列车时刻表
1.可更改出发地、目的地及列车车次
2.K值为列车车次所对应的序号，请不要填错，详情请看日志
3.部分列车无法查到列车时刻信息，部分列车总计时间有误，以时刻表为准
4.仅提供硬座、硬卧、软卧、一等座和二等座余票信息，测试阶段，请仔细核对
5.借鉴sazs34大佬的smart脚本

[task_local]
0 * * * * trainquery.js

 */


const leftstation ='深圳'  //出发地
const tostation = '上海'   //目的地
const leftdate = '2020-05-12' //出发日期
const K = '5'  //车次序号!!

let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            //为了兼容qx中fetch的写法,所以永不reject
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}

all()
async function all() 
{ 
  await namecheck();
  await trainscheck();
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

// 获取车次列表
function trainscheck() {
 return new Promise((resolve, reject) =>{
   setTimeout(() => {
   const myRequest = {
    url: `https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2020-05-11&leftTicketDTO.from_station=${statno}&leftTicketDTO.to_station=${tostat}&purpose_codes=ADULT`,
    method: 'GET',
    headers: {'Cookie' : 'JSESSIONID=1B1CEADF1B9F831C25E71D7F2D996294'}
};
$task.fetch(myRequest).then(response => {
    //console.log(response.statusCode + "\n\n" + response.body);
  let ress = JSON.parse(response.body)
    train =ress.data.result[0].split("|")[3]
      starttime = ress.data.result[0].split("|")[8]
      arrivetime = ress.data.result[0].split("|")[9]
      total = ress.data.result[0].split("|")[10].split(":")[0]+'小时'+ress.data.result[0].split("|")[10].split(":")[1]+'分钟'
    yingzuo = ress.data.result[0].split("|")[29]
    yingwo = ress.data.result[0].split("|")[28]
    ruanwo = ress.data.result[0].split("|")[26]
    //trainno = ress.data.result[0].split("|")[2]
    yideng = ress.data.result[0].split("|")[31]
    erdeng = ress.data.result[0].split("|")[30]
    trainlist =  '[1] 车次:'+train+" "+ starttime + '--' + arrivetime+" 总计时间:"+total+'\n一等座:'+yideng+' 二等座:'+erdeng+ ' 硬座:'+yingzuo+" 硬卧:"+yingwo+ " 软卧:"+ ruanwo

  for (i=1;i<ress.data.result.length;i++){
      train =ress.data.result[i].split("|")[3]
      starttime = ress.data.result[i].split("|")[8]
      arrivetime = ress.data.result[i].split("|")[9]
      total = ress.data.result[i].split("|")[10].split(":")[0]+'小时'+ress.data.result[i].split("|")[10].split(":")[1]+'分钟'
    yingzuo = ress.data.result[i].split("|")[29]
  yingwo = ress.data.result[i].split("|")[28]
  ruanwo = ress.data.result[i].split("|")[26]
  yideng = ress.data.result[i].split("|")[31]
  erdeng = ress.data.result[i].split("|")[30]
    trainlist +=  '\n'+'['+(i+1)+'] 车次:'+train+" "+starttime+"--"+ arrivetime+" 总计时间:"+total+'\n一等座:'+yideng+' 二等座:'+erdeng+ ' 硬座:'+yingzuo+" 硬卧:"+yingwo+ " 软卧:"+ ruanwo
   //trainno += ress.data.result[i].split("|")[2]
   }
   console.log(trainlist)
if (K<=ress.data.result.length){
  //console.log(ress.data.result[K-1].split("|"))
  traincode = ress.data.result[K-1].split("|")[3]
  trainno = ress.data.result[K-1].split("|")[2]
  fromstation = ress.data.result[K-1].split("|")[4]
  endstation = ress.data.result[K-1].split("|")[5]
  totaltime  = ress.data.result[K-1].split("|")[10].split(":")[0]+'小时'+ress.data.result[K-1].split("|")[10].split(":")[1]+'分钟'
}
else {
    $notify(`火车车次错误❌`,"共"+ress.data.result.length+"列火车经过", '请检查后重试')
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
   if (result.status == true) {
const traincode = result.data.data[0].station_train_code
const arrivetime = result.data.data[0].arrive_time
   starttime = result.data.data[0].start_time
   stationname = result.data.data[0].station_name
   startstation = result.data.data[0].start_station_name
   endstation = result.data.data[0].end_station_name

  detail = '到达目的地'+tostation+'需用'+totaltime+'\n'+arrivetime +'--'+starttime+ '  '+stationname
for (i=1;i<result.data.data.length;i++){
    detail  += `\n`+result.data.data[i].arrive_time +'--'+result.data.data[i].start_time+ '  '+result.data.data[i].station_name
}
const title = traincode+ "次列车时刻表"
const subTitle = '始发站: '+startstation+ ' -- 终点站: '+endstation
 $notify(title, subTitle, detail)
console.log(detail)
  }
} catch (e){
   console.log(traincode)
  $notify('列车查询失败‼️', '无'+traincode+'列车信息', e)
}
  })
$done()
 })
}
