/* 
[rewrite_local]
^https:\/\/app\.bilibili\.com\/x\/v2\/space\?access_key url script-response-body bilibili_space_qx.js
[mitm]
hostname = app.bilibili.com
*/

let url = $request.url
let regex = /vmid=(\d*)/
let vmid= regex.exec(url)
let mid = vmid[1]
let api = `https://space.bilibili.com/ajax/member/getSubmitVideos?mid=${mid}&pagesize=10&order=stow`
var Url = {
    url: api,
    method: "GET"
};

$task.fetch(Url).then(response => {
  body=JSON.parse(response.body)
  let info=""
  body['data']['vlist'].forEach((element, index)=> {
      index++
      let scheme=`bilibili://av/${element['aid']}`
      info+=index+": "+element['title']+"\n"+scheme+"\n"
  })
  $notify('收藏排行前10','长按进入', info);
  $done({});
}, reason => {
  $notify("收藏排行获取失败", "", reason.error);
  $done({});
});