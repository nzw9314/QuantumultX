# Surge
Remove weibo ads
```properties
[Script]
http-response ^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/wb_launch.js
http-response ^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)(mix)?timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|!/photos/pic_recommend_status) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/wb_ad.js
[MITM]
hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com
```

Display netflix ratings（IMDb、douaban）
```properties
[Script]
http-request ^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D script-path=https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js
http-response ^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js
[MITM]
hostname = ios.prod.ftl.netflix.com
```

Display jd historical price
```properties
# 不生效或失效的检查一下配置有没有这两条复写，删除试试
# ^https?:\/\/api\.m\.jd.com\/client\.action\?functionId=start - reject
# ^https?:\/\/api\.m\.jd.com\/client\.action\?functionId=(start|queryMaterialAdverts) - reject
[Script]
http-response ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/jd_price.js
[MITM]
hostname = api.m.jd.com
```

Display taobao historical price
```properties
# 不生效或失效的需要卸载 tb 重装，注意不开脚本进 tb 会失效
[Script]
http-response ^http://amdc\.m\.taobao\.com/amdc/mobileDispatch requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/tb_price.js
http-response ^https?://trade-acs\.m\.taobao\.com/gw/mtop\.taobao\.detail\.getdetail requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/tb_price.js
[MITM]
hostname = trade-acs.m.taobao.com

# 以上还不生效或者频繁失效的可以添加以下规则，使用规则有可能误伤其他功能或者应用（一般不需要添加规则就能正常使用）
# [Rule]
# IP-CIDR, 203.119.144.0/23, REJECT, no-resolve
# IP-CIDR, 203.119.175.0/24, REJECT, no-resolve
# IP-CIDR, 106.11.162.0/24, REJECT, no-resolve
# IP-CIDR, 47.102.83.0/24, REJECT, no-resolve
```

DingDing clock in
```properties
[Script]
cron "0 9,18 * * 1-5" script-path=https://raw.githubusercontent.com/yichahucha/surge/master/clock_in.js
```

Script management tool
```properties
[Script]
cron "0 0 * * *" eval_script.js
```

# Quan-X

Remove weibo ads
```properties
[rewrite_local]
^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) url script-response-body wb_launch.js
^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)(mix)?timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|!/photos/pic_recommend_status) url script-response-body wb_ad.js
[mitm]
hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com
```

Display netflix ratings（IMDb、douaban）
```properties
[rewrite_local]
^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D url script-request-header nf_rating.js
^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D url script-response-body nf_rating.js
[mitm]
hostname = ios.prod.ftl.netflix.com
```

Display jd historical price
```properties
[rewrite_local]
^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body jd_price.js
[mitm]
hostname = api.m.jd.com
```

Display taobao historical price
```properties
# 不生效或失效的需要卸载 tb 重装，注意不开脚本进 tb 会失效
[rewrite_local]
^http://amdc\.m\.taobao\.com/amdc/mobileDispatch url script-response-body tb_price.js
^https?://trade-acs\.m\.taobao\.com/gw/mtop\.taobao\.detail\.getdetail url script-response-body tb_price.js
[mitm]
hostname = trade-acs.m.taobao.com

# 以上还不生效或者频繁失效的可以添加以下规则，使用规则有可能误伤其他功能或者应用（一般不需要添加规则就能正常使用）
# [filter_local]
# ip-cidr, 203.119.144.0/23, reject
# ip-cidr, 203.119.175.0/24, reject
# ip-cidr, 106.11.162.0/24, reject
# ip-cidr, 47.102.83.0/24, reject
```

DingDing clock in
```properties
[task_local]
0 9,18 * * 1-5 clock_in.js
```

Script management tool
```
[task_local]
0 0 * * * eval_script.js
```

# 脚本管理 eval_script.js 使用示例
```properties
1.在 App 中添加配置如下，第一次需手动执行任务更新脚本，脚本多的情况下有可能更新失败（Surge 和 QX 橙色按钮更新成功率最高），确保脚本更新成功

Surge:

[Script]
cron "0 0 * * *" debug=1,script-path=eval_script.js

http-request ^https://.*(?<!\.(png|jpg|jpeg|gif|bmp|webp|heic))$ requires-body=0,script-path=eval_script.js
http-response ^https://.*(?<!\.(png|jpg|jpeg|gif|bmp|webp|heic))$ requires-body=1,script-path=eval_script.js

# request body
# http-request ^http://.+/amdc/mobileDispatch requires-body=1,script-path=eval_script.js

# http
http-response ^http://amdc\.m\.taobao\.com/amdc/mobileDispatch requires-body=1,script-path=eval_script.js

[MITM]
hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com,  api.m.jd.com, ios.prod.ftl.netflix.com, trade-acs.m.taobao.com

QX:

[task_local]
0 0 * * * eval_script.js

[rewrite_local]
^https?://.*(?<!\.(png|jpg|jpeg|gif|bmp|webp|heic))$ url script-request-header eval_script.js
^https?://.*(?<!\.(png|jpg|jpeg|gif|bmp|webp|heic))$ url script-response-body eval_script.js

# request body
# ^https?://.+/amdc/mobileDispatch url script-request-body eval_script.js

[mitm]
hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com,  api.m.jd.com, ios.prod.ftl.netflix.com, trade-acs.m.taobao.com


2.在 eval_script.js 中配置需要管理的脚本，支持本地和远程配置，格式为: 脚本类型(request/response) 匹配正则 eval 脚本连接

[eval_local]
# 添加 eval_script 格式脚本 或者 使用 surge、qx 脚本配置
# response ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) eval https://raw.githubusercontent.com/yichahucha/surge/master/jd_price.js

[eval_remote]
# 添加 eval_script 格式远程 或者 使用 qx 远程复写
https://raw.githubusercontent.com/yichahucha/surge/master/sub_eval.conf


3.以上都配置好，示例脚本生效，以后大部分情况下只需要在 eval_script.js 添加新脚本或者订阅新脚本，在对应 App 添加脚本的 hostname 即可


注意：

^https?://.*(?<!\.(png|jpg|jpeg|gif|bmp|webp|heic))$

!这个正则会对所有 http 请求（目前大部分都是 https 请求） 和 配置了 hostname 的 https 请求执行 eval_script.js 脚本，请求执行一遍，响应执行一遍，一些本不应该执行脚本的请求，也执行了 eval_script.js 脚本（有点资源浪费，个别请求可能还会报错，有问题的需要自己排查），所以按需配置 hostname，不需要的 hostname 尽量删除掉

!另外以上配置不包含修改请求体的脚本 ，也就是你在 eval_script.js 配置的对应脚本不会生效，需要单独配置这类脚本来命中 eval_script.js，让 eval_script.js 执行目标脚本，参考 request body 配置示例

!由于未知原因在 Surge 中部分请求使用脚本会导致请求报错，为了缩小报错范围，在 Surge 配置中排除 http 请求的脚本（^https://.*(?<!\.(png|jpg|jpeg|gif|bmp|webp|heic))$），http 请求的脚本需要在 Surge 中单独配置，参考 Surge 示例

```
