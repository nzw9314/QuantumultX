/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
    您也可直接在tg中联系@wechatu
*/
// #region 固定头部
let isQuantumultX = $task !== undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient !== undefined; //判断当前运行环境是否是surge
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
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
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

/*
英雄联盟排名
  By @syzzzf
*/

//默认大区：峡谷之巅 31，如需修改自己去wegame抓包解决
const area=31;

//默认显示第一页
const pnum=1;

//默认显示20个
const psize=10;

//rank类型
const rank_type=0;

const title='[峡谷之巅]排名';
getResult();

function getResult(){
    console.log('begin');
    let body={"area_id": 31,"pnum": 1,"psize": 20,"rank_type": 0};
    const lol = {
        url: 'https://m.wegame.com.cn/api/mobile/lua/proxy/index/mwg_lol_proxy/get_score_rank',
        headers: {

            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      };
    $httpClient.post(lol, function (error, response, data) {
        let obj = JSON.parse(data);
        let chanmpion='🔥';
        let retstr='';
        let result=obj.data.data.rank_list;
        console.log(result)
        var order=1;
        for(var i in result){
            retstr=retstr+'排名·';
            retstr=retstr+order;
            retstr=retstr+'   [  ';
            retstr=retstr+result[i].name;
            retstr=retstr+'  ]    分数<'
            retstr=retstr+result[i].win_point;
            retstr=retstr+'>\n';
            order++;
        }   
         
        $notification.post(title, '', retstr);
        $done();
    })
}
