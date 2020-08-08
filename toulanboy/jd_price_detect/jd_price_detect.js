/**********
  🐬Author: Github@toulanboy 
  
  📕地址：https://github.com/toulanboy/scripts
  📌不定期更新各种签到、有趣的脚本，欢迎star🌟
  
  📕更多有趣脚本：https://t.me/cool_scripts

  【配置步骤，请认真阅读】
  1. 根据你当前的软件，配置好srcipt。 Tips:由于是远程文件，记得顺便更新文件。
  2. 前往boxjs，订阅应用（地址见下方），填写你需要监控的京东链接和目标价格。
  
  🔅BoxJs订阅地址：https://raw.githubusercontent.com/toulanboy/scripts/master/toulanboy.boxjs.json
  🔅BoxJs使用教程：https://t.me/chavyscripts/91

  💢注1： 如果检测价格 高于 目标价格，则不会通知！但是日志里面有输出。
  💢注2： 脚本数据来源于慢慢买app。显示的价格是优惠后的价格，所有数据仅供参考。

  [Loon]
  cron "5 0 * * *" script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/jd_price_detect/jd_price_detect.js, tag=京东价格提醒

  [Quanx]
  5 0 * * * https://raw.githubusercontent.com/toulanboy/scripts/master/jd_price_detect/jd_price_detect.js, tag=京东价格提醒

  [Surge]
  京东价格提醒 = type=cron,cronexp="5 0 * * *",script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/jd_price_detect/jd_price_detect.js,wake-system=true,timeout=600

  *********/

 const $ = new Env('⏰ 京东价格提醒')

 $.timeout = 3000 //超时限制，单位ms
 $.debug = false
 $.public = true
 
 !(async () => {
     $.log('', `🔔 ${$.name}, 开始!`, '')
     get_setting()
     if (!env_detect()) return
     for (var i in $.detect_url) {
         await get_price($.detect_url[i], $.target_price[i])
     }
     env_finish()
     $.done()
 })()
 .catch((e) => {
     $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
 })
 .finally(() => {
     $.log('', `🔔 ${$.name}, 结束!`, '')
     return
 })
 
 function env_detect() {
     if ($.detect_url.length == 0) {
         $.msg($.name, "", "🚫客官，你还没有设置需要检测的商品，请前往BoxJs进行配置。")
         return false;
     }
     if ($.detect_url.length != $.target_price.length) {
         $.msg($.name, "", "🚫客官，商品链接和目标价格是成对填写的。麻烦请前往BoxJs补充完整。")
         return false;
     }
     return true;
 }
 
 function env_finish() {
     new_cache_list = {}
     for (var i in $.detect_url) {
         new_cache_list[$.detect_url[i]] = $.cache_list[$.detect_url[i]]
     }
     if ($.debug) console.log(new_cache_list)
     $.setdata(JSON.stringify(new_cache_list), 'tlb_cache_list')
 
 }
 
 function get_setting() {
     $.detect_url = []
     $.target_price = []
     $.cache_list = {}
     for (var i = 1; i <= 3; ++i) {
         url_name = "tlb_jd_detect_url" + (i == 1 ? "" : i)
         price_name = "tlb_jd_detect_price" + (i == 1 ? "" : i)
         if ($.getdata(url_name) != undefined && $.getdata(url_name) != "")
             $.detect_url.push($.getdata(url_name))
         if ($.getdata(price_name) != undefined && $.getdata(price_name) != "")
             $.target_price.push($.getdata(price_name))
     }
     $.debug = JSON.parse($.getdata("tlb_jd_debug") || $.debug);
     $.timeout = $.getdata("tlb_jd_timeout") * 1 || $.timeout;
     if ($.public) {
         $.headers = "{\"Accept\":\"*/*\",\"Connection\":\"keep-alive\",\"Content-Type\":\"application/x-www-form-urlencoded; charset=utf-8\",\"Accept-Encoding\":\"gzip, deflate, br\",\"Host\":\"apapia-history.manmanbuy.com\",\"User-Agent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 - mmbWebBrowse - ios \",\"Accept-Language\":\"zh-cn\"}"
         $.headers = JSON.parse($.headers)
         $.body = "methodName=getHistoryTrend&p_url=loveyou&t=1594629654371"
     } else {
         $.headers = $.getdata('tlb_jd_headers')
         $.headers = JSON.parse($.headers)
         $.body = $.getdata('tlb_jd_body')
     }
     $.cache_list = $.getdata('tlb_cache_list')
     if ($.cache_list != undefined) {
         $.cache_list = JSON.parse($.cache_list);
     } else {
         $.cache_list = {}
     }
 }
 
 function get_price(goods_url, target_price) {
     return new Promise((resolve) => {
         try {
 
             url1 = {
                 url: `https://apapia-history.manmanbuy.com/ChromeWidgetServices/WidgetServices.ashx`,
                 headers: $.headers
             }
             current_t = new Date().getTime()
             url1.body = $.body.replace(/p_url=loveyou/, `p_url=${encodeURIComponent(goods_url)}`)
             if ($.debug) console.log(url1)
             $.post(url1, (error, response, data) => {
                 if (error) {
                     if ($.debug) $.msg($.name, "", "🚫请求出现错误，具体看日志")
                     console.log("🚫请求出现错误，具体如下：")
                     console.log(error)
                     resolve()
                 }
                 if ($.debug) console.log(response.body)
                 data = JSON.parse(response.body)
                 title = ""
                 title_list = data.single.title.split(' ')
                 for (var i = 0; i < title_list.length && i < 3; ++i)
                     title += `${title_list[i]} `
                 youhui = data.single.currentPriceyhStatus
                 price_status_new = eval(data.single.jiagequshiyh.match(/.*(\[.*?\]).*?(\[.*?\])$/)[2])
                 price_status_old = eval(data.single.jiagequshiyh.match(/.*(\[.*?\]).*?(\[.*?\])$/)[1])
                 if (price_status_new[0] < current_t) {
                     price_status = price_status_new;
                 } else {
                     console.log("🐬 返回的数据存在干扰，已切回到第2新的数据。")
                     price_status = price_status_old;
                 }
                 current_t += 8 * 3600 * 1000
                 price_status[0] += 8 * 3600 * 1000
                 current_day = new Date(current_t).toJSON().substr(5, 5).replace('-', '') //获取当前的月日
                 price_day = new Date(price_status[0]).toJSON().substr(5, 5).replace('-', '') //获取价格的月日
                 //为了更容易识别，使用 今天、昨天。有个BUG，跨月份的问题，晚点再修。
                 day_alias = current_day - price_day == 0 ? "今天" : (current_day - price_day == 1 ? "昨天" : new Date(price_status[0]).toJSON().substr(5, 5)+" ")
                 result = `💰价格：${price_status[1]}元，检测时间：${day_alias}${new Date(price_status[0]).toJSON().replace("T", " ").substr(11, 5)}\n`
                 result += `✨状态：${price_status[1] < target_price ? "已低于" : "没有低于"}目标价格${target_price}元\n`
                 if ($.debug) console.log(price_status)
                 if (price_status[2] != "") result += `✨优惠：${price_status[2]}\n`
 
                 //2020年07月15日02:09 新增 最近优惠
                 lastest_info = data.recentlyZK
                 has_recentZK = false
                 if ($.debug) console.log(lastest_info)
                 if(lastest_info.hasOwnProperty('spprice')){
                    has_recentZK = true
                    youhui_price = lastest_info.spprice.replace(/<\/?p><\/?p>/g, "，").replace(/<\/?p>/g, "")
                    current_price = lastest_info.currentprice
                    goods_time = parseInt(lastest_info.dt.match(/(\d+)/)[1])
                    goods_time += 8 * 3600 * 1000
                    price_day = new Date(goods_time).toJSON().substr(5, 5).replace('-', '') //获取价格的月日
                    day_alias = current_day - price_day == 0 ? "今天" : (current_day - price_day == 1 ? "昨天" : new Date(goods_time).toJSON().substr(5, 5)+" ")
                    result_2 = `💰价格：${current_price}元，检测时间：${day_alias}${new Date(goods_time).toJSON().replace("T", " ").substr(11, 5)}\n`
                    result_2 += `✨状态：${current_price < target_price ? "已低于" : "没有低于"}目标价格${target_price}元\n`
                    result_2 += `✨其他说明：${youhui_price}\n`
                }
                 //2020年07月18日01:36 查询该优惠之前是否已展示给用户
                 console.log(`\n🛒商品检测结果如下`)
                 is_price_show = false //最新价格状态
                 is_youhui_showed = false //最新优惠
                 //1、 检查最新价格 和 最新优惠，是否展示过
                 if ($.cache_list.hasOwnProperty(goods_url) && $.cache_list[goods_url].hasOwnProperty('price_time') && $.cache_list[goods_url]['price_time'] == price_status[0]) {
                     is_price_show = true;
                     $.log(`\n--------start--------\n💢以下价格数据之前已用过，不做2次提醒\n${title}\n${result}--------end--------\n`)
                 }
                 if(!has_recentZK){//如果没有优惠，那么不用展示
                     is_youhui_showed = true
                 }
                 else if ($.cache_list.hasOwnProperty(goods_url) && $.cache_list[goods_url].hasOwnProperty('youhui_time') && $.cache_list[goods_url]['youhui_time'] == goods_time) {
                     is_youhui_showed = true;
                     $.log(`\n--------start--------\n💢以下优惠之前已用过，不做2次提醒\n${title}\n${result_2}--------end--------\n`)
                 }
                 is_notify = false;
                 //2. 开始通知。 只提醒 未展示过的低价
                 if (price_status[1] < target_price) {
                     final_result = ""
                     if (is_price_show == false && is_youhui_showed == false) {
                         final_result = result + "\n最近优惠:\n" + result_2
                     } else if (is_price_show == false && is_youhui_showed == true) {
                         final_result = result
                     }
                     if (final_result != "") {
                         is_notify = true
                         $.msg($.name, `${title}`, final_result, goods_url)
                     }
                 }
                 else if (has_recentZK && current_price < target_price) {
                    final_result = ""
                    if (is_youhui_showed == false) {
                        final_result = result_2
                    }
                    if (final_result != "") {
                        is_notify = true
                        $.msg($.name, `${title}`, final_result, goods_url)
                    }
                }
                 if (!is_notify) {
                     console.log(`\n--------start--------\n💢此次检测的情况，不存在最新的低价，【不弹】通知。\n--------end--------\n`)
                 }
                 $.cache_list[goods_url] = {
                     'price_time': price_status[0],
                     'youhui_time': has_recentZK? goods_time : 0
                 }
                 resolve()
             })
         } catch (e) {
             console.log(e)
             resolve()
         }
         setTimeout(() => {
             if ($.debug) console.log("🚨 (防长时间堵塞用)请求已达时间上限，已释放某函数。")
             resolve()
         }, $.timeout);
     })
 }
 // prettier-ignore, @chavyleung
 function Env(s) {
     this.name = s, this.data = null, this.logs = [], this.isSurge = (() => "undefined" != typeof $httpClient), this.isQuanX = (() => "undefined" != typeof $task), this.isLoon = (() => "undefined" != typeof $loon), this.isNode = (() => "undefined" != typeof module && !!module.exports), this.log = ((...s) => {
         this.logs = [...this.logs, ...s], s ? console.log(s.join("\n")) : console.log(this.logs.join("\n"))
     }), this.msg = ((s = this.name, t = "", i = "", opts = "") => {
         this.isLoon() && $notification.post(s, t, i, opts), this.isSurge() && !this.isLoon() && $notification.post(s, t, i), this.isQuanX() && $notify(s, t, i, {
             "open-url": opts
         });
         const e = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
         s && e.push(s), t && e.push(t), i && e.push(i), console.log(e.join("\n"))
     }), this.getdata = (s => {
         if (this.isSurge()) return $persistentStore.read(s);
         if (this.isQuanX()) return $prefs.valueForKey(s);
         if (this.isNode()) {
             const t = "box.dat";
             return this.fs = this.fs ? this.fs : require("fs"), this.fs.existsSync(t) ? (this.data = JSON.parse(this.fs.readFileSync(t)), this.data[s]) : null
         }
     }), this.setdata = ((s, t) => {
         if (this.isSurge()) return $persistentStore.write(s, t);
         if (this.isQuanX()) return $prefs.setValueForKey(s, t);
         if (this.isNode()) {
             const i = "box.dat";
             return this.fs = this.fs ? this.fs : require("fs"), !!this.fs.existsSync(i) && (this.data = JSON.parse(this.fs.readFileSync(i)), this.data[t] = s, this.fs.writeFileSync(i, JSON.stringify(this.data)), !0)
         }
     }), this.wait = ((s, t = s) => i => setTimeout(() => i(), Math.floor(Math.random() * (t - s + 1) + s))), this.get = ((s, t) => this.send(s, "GET", t)), this.post = ((s, t) => this.send(s, "POST", t)), this.send = ((s, t, i) => {
         if (this.isSurge()) {
             const e = "POST" == t ? $httpClient.post : $httpClient.get;
             e(s, (s, t, e) => {
                 t && (t.body = e, t.statusCode = t.status), i(s, t, e)
             })
         }
         this.isQuanX() && (s.method = t, $task.fetch(s).then(s => {
             s.status = s.statusCode, i(null, s, s.body)
         }, s => i(s.error, s, s))), this.isNode() && (this.request = this.request ? this.request : require("request"), s.method = t, s.gzip = !0, this.request(s, (s, t, e) => {
             t && (t.status = t.statusCode), i(null, t, e)
         }))
     }), this.done = ((s = {}) => this.isNode() ? null : $done(s))
 }