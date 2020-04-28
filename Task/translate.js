
/**
 * @fileoverview Example to compose HTTP reqeuest
 * and handle the response.
 
[task_local]
0 * * * * translate.js, tag=谷歌中英互译(需quantumult x1.0.8+)

 * 谷歌中英互译，适合简单的中英短语单词互译
 */

const ENword = 'CL Online network Technology Co.LTD'  //翻译内容填入引号内

const word = encodeURI(ENword)
const cnToenUrl = {url: "http://translate.google.cn/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q="+word}
const enTocnUrl = {url: "http://translate.google.cn/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q="+word}

Translate(ENword)
function Translate(ENword) {
   if (/[^a-zA-Z.]+$/.test(ENword))
{
    $task.fetch(cnToenUrl).then(response => { 
      if(/[\u4e00-\u9fa5]/.test(response.body)) {
       const res = response.body.match(/[^\u4e00-\u9fa5]+/g)[0]
       const rest = res.replace(/[\,\[\"]/g, "")
       console.log(`谷歌翻译`+`\n原文:`+ENword+`\n翻译结果: `+ rest)
       $notify(`谷歌翻译  中译英`,`🇨🇳 中文原文:   `+ENword,`🇬🇧 翻译结果 :  `+ rest)
      }
   })
}
  else  {
    $task.fetch(enTocnUrl).then(response => { 
       console.log(response.body)
      if(/[a-zA-Z]/.test(response.body)) {
        const rest = response.body.match(/[\u4e00-\u9fa5a-zA-Z]+/)
        console.log(`谷歌翻译`+`\n原文: `+ENword+`\n翻译结果: `+ rest)
        $notify(`谷歌翻译 英译中`,`🇬🇧 英文原文:   `+ENword,`🇨🇳 翻译结果 :  `+ rest)
      }
    })
   }
 }

init()
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
