
//参考chavyleung和NobyDa的写法

const sy = init()
//默认大区：峡谷之巅 31，如需修改自己去weegame抓包解决
const area=31;

//默认显示第一页
const pnum=1;

//默认显示10个
const psize=20;

//rank类型
const rank_type=0;

const title='[峡谷之巅]排名';
getResult();

function getResult(){
    console.log('begin');
    let body={"area_id": area,"pnum": pnum,"psize": psize,"rank_type": 0};
    const lol = {
        url: 'https://m.wegame.com.cn/api/mobile/lua/proxy/index/mwg_lol_proxy/get_score_rank',
        headers: {

            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      };
    sy.post(lol, function (error, response, data) {
        let obj = JSON.parse(data);
        let chanmpion='🔥';
        let retstr='';
        let result=obj.data.data.rank_list;
        var order=1;
        for(var i in result){
            retstr=retstr+'排名·'
            if(order<10){
                retstr=retstr+order+' ';
            }
            else{
                retstr=retstr+order;
            }

            retstr=retstr+'·分数·'+result[i].win_point;
            retstr=retstr+'·';
            retstr=retstr+'[ ';
            retstr=retstr+result[i].name;
            retstr=retstr+' ]';
            retstr=retstr+chanmpion;
            retstr=retstr+'\n';
            order++;
        }   
        sy.log(retstr);
        sy.msg(title, '', retstr);
        sy.done();
    })
}


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
        $task.fetch(url).then((resp) => cb(null, {}, resp.body))
      }
    }
    post = (options, callback) => {
      if (isQuanX()) {
        if (typeof options == "string") options = { url: options }
        options["method"] = "POST"
        $task.fetch(options).then(response => {
          response["status"] = response.statusCode
          callback(null, response, response.body)
        }, reason => callback(reason.error, null, null))
      }
      if (isSurge()) $httpClient.post(options, callback)
    }
    done = (value = {}) => {
      $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
  }