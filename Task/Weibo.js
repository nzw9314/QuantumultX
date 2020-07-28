/*
本脚本为弥补第三方微博、微博特别关注无通知或通知杂乱的问题，并通过通知减少刷微博时间，故“好友圈”、“时间线”功能随缘添加，欢迎 PR。
由于微博登陆采取 RSA 加密，暂未找到在此脚本中使用合适的 RSA 脚本，故仍需先获取 Cookie：
请先进入 https://m.weibo.cn 并登陆，再按注释内容配置好后，回到网页刷新即可。

本脚本在 Quantumult X(build 316+) 中可做到显示第一个图片、文章封面、投票图标、GIF、Live Photo 或视频，并可点击通知跳转。
本脚本在 Loon(build 163+) 中可做到显示第一个多媒体链接，并可点击通知跳转。
本脚本在 Surge 中会提示多媒体链接及跳转链接，需长按通知再点击链接进行跳转。

跳转可选定指定客户端，默认为 Safari，请在 BoxJs 中进行配置更改，如需加入想要的客户端，请提供该客户端打开指定微博的 URL Scheme，反馈至 @zZPiglet_bot，或提交 issue，或进行 PR。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author：zZPiglet
Acknowledgements: Peng-YM, evilbutcher

Quantumult X:
[task_local]
0 * * * * https://raw.githubusercontent.com/zZPiglet/Task/master/Weibo/Weibo.js, tag=微博通知

[rewrite_local]
^https:\/\/m\.weibo\.cn\/feed\/ url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/Weibo/Weibo.js


Surge & Loon:
[Script]
cron "0 * * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Weibo/Weibo.js
http-request ^https:\/\/m\.weibo\.cn\/feed\/ script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Weibo/Weibo.js

All app:
[mitm]
hostname = m.weibo.cn
（请注意自己的 hostname 配置中是否有 -*.weibo.c* 或类似字样，如有请暂时删除，或使用资源解析器 / API 去除重写订阅中的去微博广告）

获取完 Cookie 后可不注释 rewrite / hostname，Cookie 更新时会弹窗。若因 MitM 导致该软件网络不稳定，可注释掉 hostname。
*/

const mainURL = 'https://m.weibo.cn/feed/'
const configURL = 'https://m.weibo.cn/api/config/'
const uidURL = 'https://m.weibo.cn/profile/info?uid='
const searchURL = 'https://m.weibo.cn/api/container/getIndex?containerid=100103type%3D3%26t%3D1%26q%3D'
const listURL = configURL + 'list'
const groupURL = mainURL + 'group?gid='
// const circleURL = mainURL + 'circle' // 好友圈，待做，🐦  
// const timelineURL = mainURL + 'friends //时间线，待做，🐦

const $ = new API('Weibo')
$.debug = [true, 'true'].includes($.read('debug')) || false
const CookieKey = 'WeiboNotice'
const reg = /SUB=(\S*);/

const groupdat = $.read('Group') || 'Special'
$.choosegroup = [undefined, null, 'null', ''].includes(groupdat) ? [] : groupdat.split(',')
const uiddat = $.read('Weibo_uids')
$.uids = [undefined, null, 'null', ''].includes(uiddat) ? [] : uiddat.replace(/\n/, '').split(',')
const nicknamedat = $.read('Weibo_nicknames')
$.nicknames = [undefined, null, 'null', ''].includes(nicknamedat) ? [] : nicknamedat.replace(/\n/, '').split(',')

$.client = $.read('chooseClient') || 'Safari'
if ($.client == 'Safari') {
    $.openlink = 'https://m.weibo.cn/detail/'
} else if ($.client == 'Sinaweibo') {
    $.openlink = 'sinaweibo://detail?mblogid='
} else if ($.client == 'Weibointernational') {
    $.openlink = 'weibointernational://detail?mblogid='
}

$.interval = Number($.read('interval') || 1000)

$.update = $.debug ? 0 : Number($.read('update') || 0)
$.log('debug update time: ' + $.update)
$.info('update time: ' + $.read('update'))

if ($.isRequest) {
    GetCookie()
    $.done
} else {
    !(async () => {
        if (!$.read(CookieKey)) {
            throw new ERR.CookieError("❌ 未获取或填写Cookie")
        } else {
            await checkCookie()
            if ($.validCookie) {
                if ($.choosegroup.includes('Special')) Special()
                // if ($.choosegroup.includes('Circle')) await Circle()
                // if ($.choosegroup.includes('Timeline')) await Timeline()
                if ($.choosegroup.includes('Spider')) await Spider()
            } else {
                throw new ERR.CookieError("❌ Cookie 失效")
            }
        }
    })().catch((err) => {
        if (err instanceof ERR.CookieError) {
            $.notify("微博通知 - Cookie 错误", "", err.message, 'https://m.weibo.cn')
        } else {
            $.notify("微博通知 - 出现错误", "", err.message)
            $.error(err)
        }
    }).finally($.done())
}

function checkCookie() {
    return $.get({
        url: configURL,
        headers: {
            'Cookie': 'SUB=' + $.read(CookieKey)
        }
    })
        .then((resp) => {
            $.log('Cookie: SUB=' + $.read(CookieKey))
            $.write(new Date().getTime(), 'update')
            let obj = JSON.parse(resp.body)
            $.validCookie = obj.data.login
        })
        .catch((err) => {
            throw err
        })
}

function ParseWeibo(obj) {
    let wbs = obj.data.statuses
    for (let i = wbs.length - 1; i >= 0; i--) { // 试图改变时间线顺序，都是混乱的
//  for (let i = 0; i< wbs.length; i++) {
        $.wait($.interval).then(()=>{
            let Title = '@' + wbs[i].user.screen_name
            let releaseTime = new Date(wbs[i].created_at).getTime()
            let subTitile = '⌚️ ' + new Date(wbs[i].created_at).Format("MM/dd hh:mm:ss")
            let open = $.openlink + wbs[i].bid
            let showimg = wbs[i].user.profile_image_url
            let detail = ''
            let newlineReg = /<br \/>/g
            let ignoreReg = /<[^>]+>/g
            detail += wbs[i].text.replace(newlineReg, '\n').replace(ignoreReg, '').trim()
            if (wbs[i].retweeted_status) {
                detail += '\n\n↪️ 转发自 @' + wbs[i].retweeted_status.user.screen_name + '：\n' + wbs[i].retweeted_status.text.replace(newlineReg, '\n').replace(ignoreReg, '').trim()
                if (wbs[i].retweeted_status.live_photo) {
                    showimg = wbs[i].retweeted_status.live_photo[0]
                } else if (wbs[i].retweeted_status.original_pic) {
                    showimg = wbs[i].retweeted_status.original_pic
                } else if (wbs[i].retweeted_status.page_info) {
                    let type = wbs[i].retweeted_status.page_info.type
                    if (type == 'video') {
                        showimg = wbs[i].retweeted_status.page_info.media_info.stream_url_hd
                    } else {
                        showimg = wbs[i].retweeted_status.page_info.page_pic.url
                        $.log(JSON.stringify(wbs[i].retweeted_status.page_info))
                    }
                } 
            } else {
                if (wbs[i].live_photo) {
                    showimg = wbs[i].live_photo[0]
                } else if (wbs[i].original_pic) {
                    showimg = wbs[i].original_pic
                } else if (wbs[i].page_info) {
                    let type = wbs[i].page_info.type
                    if (type == 'video') {
                        showimg = wbs[i].page_info.media_info.stream_url_hd
                    } else {
                        showimg = wbs[i].page_info.page_pic.url
                        $.log(JSON.stringify(wbs[i].page_info))
                    }
                }
            }
            detail += '\n\n👉🏼 点击跳转至全文及原微博。'
            if (releaseTime > $.update) $.notify(Title, subTitile, detail, open, showimg)
        })
    }
}

async function Special() {
    await getSpecialId()
    await getSpeicalMessage()
}

function getSpecialId() {
    return $.get({
        url: listURL,
        headers: {
            'Cookie': 'SUB=' + $.read(CookieKey)
        }
    })
        .then((resp) => {
            let obj = JSON.parse(resp.body)
            let groups = obj.data.groups
            for (let gIdx of groups) {
                let gid = gIdx.gid
                if (gIdx.name == '特别关注') $.gid = gid
            }
        })
        .catch((err) => {
            throw err
        })
}

function getSpeicalMessage() {
    return $.get({
        url: groupURL + $.gid,
        headers: {
            'Cookie': 'SUB=' + $.read(CookieKey)
        }
    })
        .then((resp) => {
            let obj = JSON.parse(resp.body)
            ParseWeibo(obj)
        })
        .catch((err) => {
            throw err
        })
}

async function Spider() {
    await getUid()
    await getSpiderMessage()
}

async function getUid() {
    if ($.nicknames.length) {
        for (let nameIdx = 0; nameIdx < $.nicknames.length; nameIdx++) {
            await $.get({
                url: searchURL + encodeURIComponent($.nicknames[nameIdx].trim()),
                headers: {
                    'Cookie': 'SUB=' + $.read(CookieKey)
                }
            })
                .then((resp) => {
                    let obj = JSON.parse(resp.body)
                    if (obj.ok) {
                        $.uids.push(obj.data.cards[1].card_group[0].user.id.toString())
                    } else {
                        $.notify('微博通知 - 微博昵称填写有误', '', '请在 BoxJs 检查填写的微博昵称是否正确', 'https://8.8.8.8/home')
                    }
                })
                .catch((err) => {
                    throw err
                })
        }
    }
}

async function getSpiderMessage() {
    $.log($.uids)
    if ($.uids.length) {
        for (let uidIdx = 0; uidIdx < $.uids.length; uidIdx++) {
            await $.get({
                url: uidURL + $.uids[uidIdx].trim(),
                headers: {
                    'Cookie': 'SUB=' + $.read(CookieKey)
                }
            })
                .then((resp) => {
                    let obj = isJSON(resp.body)
                    if (obj) {
                        ParseWeibo(obj)
                    } else {
                        $.notify('微博通知 - uid 填写有误', '', '请在 BoxJs 检查填写的 uid 是否正确', 'https://8.8.8.8/home')
                    }
                })
                .catch((err) => {
                    $.error(err)
                    throw err
                })
        }
    } else {
        $.notify('微博通知 - 填写信息不全', '', '请在 BoxJs 填写需要关注人微博 uid，或取消针对个人的勾选！', 'https://8.8.8.8/home')
    }
}

function GetCookie() {
    if (reg.exec($request.headers['Cookie'])[1]) {
        let CookieValue = reg.exec($request.headers['Cookie'])[1]
        if ($.read(CookieKey) != (undefined || null)) {
            if ($.read(CookieKey) != CookieValue) {
                let cookie = $.write(CookieValue, CookieKey)
                $.notify("更新 " + $.name + " Cookie 成功 🎉", "", "")
            }
        } else {
            let cookie = $.write(CookieValue, CookieKey)
            $.notify("首次写入 " + $.name + " Cookie 成功 🎉", "", "")
        }
    } else {
        $.notify("写入" + $.name + "Cookie 失败‼️", "", "配置错误, 无法读取请求头, ")
    }
}

// isJSON
function isJSON(t){if("string"==typeof t)try{let r=JSON.parse(t);return!("object"!=typeof r||!r)&&r}catch(t){return!1}return!1}
// Format Date by meizz
Date.prototype.Format=function(t){var e={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(var s in/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t};
// OpenAPI by Peng-YM, modified by zZPiglet
function API(s="untitled",e=!1){return new class{constructor(s,e){this.name=s,this.debug=e,this.isRequest="undefined"!=typeof $request,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){const s="undefined"!=typeof $request?void 0:require("request"),e=require("fs");return{request:s,fs:e}}return null})(),this.initCache();const t=(s,e)=>new Promise(function(t){setTimeout(t.bind(null,e),s)});Promise.prototype.delay=function(s){return this.then(function(e){return t(s,e)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((e,t)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?t(s):e({status:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?t(s):e({...i,status:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((e,t)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?t(s):e({status:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?t(s):e({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,e){this.log(`SET ${e}`),-1!==e.indexOf("#")?(e=e.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(s,e),this.isQX&&$prefs.setValueForKey(s,e),this.isNode&&(this.root[e]=s)):this.cache[e]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge&this.isLoon?$persistentStore.read(s):this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),delete this.cache[s],-1!==s.indexOf("#")?(s=s.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(null,s),this.isQX&&$prefs.setValueForKey(null,s),this.isNode&&delete this.root[s]):this.cache[s]=data,this.persistCache()}notify(e=s,t="",i="",o,n){const h=i+(null==o?"":`\n\n跳转链接：${o}`)+(null==n?"":`\n\n多媒体链接：${n}`),r=i+(null==n?"":`\n\n多媒体链接：${n}`);if(this.isQX&&$notify(e,t,i,{"open-url":o,"media-url":n}),this.isSurge&&$notification.post(e,t,h),this.isLoon&&$notification.post(e,t,r,o),this.isNode)if(this.isJSBox){const s=require("push");s.schedule({title:e,body:t?t+"\n"+i:i})}else console.log(`${e}\n${t}\n${h}\n\n`)}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(e=>setTimeout(e,s))}done(s={}){this.isQX?this.isRequest&&$done(s):this.isLoon||this.isSurge?this.isRequest?$done(s):$done():this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,e)}