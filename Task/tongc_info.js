const chen = init()
const cookieName = '同程小程序结果'
const bodyKey = 'chen_body_tc'
const headerKey = 'chen_header_tc'
//const signinfo = {}
let bodyVal = chen.getdata(bodyKey)
let headerVal = chen.getdata(headerKey)
getinfo()
function getinfo() {
    const url = {url: 'https://wx.17u.cn/wcsign/sign/GetSignInfo',headers: JSON.parse(headerVal),body: bodyVal}
    chen.post(url, (error, response, data) => {
      chen.log(`${cookieName}, data: ${data}`)
      let subTitle = ``
      let detail = ``
        const getinfo = JSON.parse(data)
        if(getinfo.rspCode == 0 &&getinfo.message =='获取成功'){
        subTitle = `获取签到信息成功`
        detail = `总计签到：${getinfo.data.totalSignDays}天,总里程:${getinfo.data.totalMileage},本次签到获得：${getinfo.data.todayMileage}里程,连续签到：${getinfo.data.continuedSignDays}天,明天签到可获得:${getinfo.data.tomorrowMileage}里程`
    } else if(getinfo.reqCode == 8000) {
        subTitle = `获取签到信息失败`
        detail = `${signinfo.getinfo.message}`
    }
        chen.msg(cookieName, subTitle, detail)
        hen.done()
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
        post = (url, cb) => {
          if (isSurge()) {
            $httpClient.post(url, cb)
          }
          if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
          }
        }
        done = (value = {}) => {
          $done(value)
        }
        return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
      }
      chen.done()
    