/*
mimt: daojia.jd.com
rewrite_local
^https:\/\/daojia\.jd\.com\/client? url script-request-header jddj_cookie.js

task
0 0 * * * jddj.js

注意：需要抓包调试
手动挡
cookie失效时间未知

将签到的链接粘贴到签到脚本的url后面，数据包是：/client，在锤子里面是GET>.json
响应内容为
{
 "code": "0",
 "msg": "成功",
 "result": {
  "userInfoResponse": {
   "points": 86,
   "hasSign": true,
   "rule": "<p>一、签到规则</p><p>\n    1.每天签到都可获得鲜豆奖励，鲜豆值为1—100个随机发放。鲜豆可以在下单结算的时候抵扣现金，1000个鲜豆=1元，满100鲜豆可用。你可在我的>鲜豆>鲜豆说明中查看详细规则。</p><p>\n    2.签到好礼送不停，连续签到以7天为一个周期，每个周期的第2、4、7天都可获得神秘惊喜大礼。</p><p>\n    3.如果中途断签，记录会自动清零。</p>\n    4.京东到家签到功能处于测试阶段，活动规则可能会出现调整。</p>\n<p>二、鲜豆使用说明</p><p>\n       1.鲜豆抵扣不得超过每笔订单商品优惠后金额的50%</p><p>\n       2.鲜豆不可用于抵扣配送费、包装费、餐盒费、自提服务费</p><p>\n       3.单个账号使用鲜豆下单的订单量 >=3单，则不允许使用鲜豆抵扣下单；</p><p>\n       4.每笔订单使用鲜豆的数量>=40000（40元）,则不允许使用鲜豆抵扣下单；</p>\n",
这就是了
@chavy
@nobyda
*/
const cookieName = '京东到家'
const cookieKey = 'chen_cookie_dj'
const chen = init()
const cookieVal = $request.headers['Cookie']
if (cookieVal) {
  if (chen.setdata(cookieVal, cookieKey)) {
    chen.msg(`${cookieName}`, '获取Cookie: 成功', '')
    chen.log(`[${cookieName}] 获取Cookie: 成功, cookie: ${cookieVal}`)
  }
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
