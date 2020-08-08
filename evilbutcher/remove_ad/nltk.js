/*

能力天空去开屏、推荐广告Quantumult X配置
[mitm]
ai.ablesky.com, api.weibo.com, mobile.ablesky.com, www.ablesky.com

[rewrite_local](注意路径）
#微博广告
https:\/\/api\.weibo\.com\/oauth2\/getaid url reject
#开屏时间
https:\/\/ai\.ablesky\.com\/ajax\/ads\/appads url script-response-body local/Quantumult_X/remove_ad/nltk.js
#今日热学
https:\/\/www\.ablesky\.com\/s\/sr\.do\?action\=single\&appRandom url reject
#推荐页面
https:\/\/mobile\.ablesky\.com\/course\.do\?action\=recommended\&appRandom url reject
#首页推荐
https:\/\/www\.ablesky\.com\/ajax\/ableskytag\/account\/getTabMenuList url reject
#杂七杂八
https:\/\/www\.ablesky\.com\/ajax\/account\/history\/list\?\&appRandom url reject
https:\/\/www\.ablesky\.com\/taskTrigger\.do\?appRandom url reject
https:\/\/ai\.ablesky\.com\/ajax\/orgPublicImg\/show\?appRandom url reject

*/

let obj=JSON.parse($response.body);

obj={
  "success": true,
  "id": 0,
  "result": {
    "list": [{
      "startDate": 1585065600000,
      "duration": "0",
      "showLocation": null,
      "endDate": 1619366399000,
      "adType": "0",
      "courseId": null,
      "photoUrl": "",
      "showPage": null,
      "url": ""
    }]
  }
}

$done({body: JSON.stringify(obj)})
