# Surge
Remove weibo ads
```
[Script]
http-response ^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/wb_launch.js
http-response ^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)(mix)?timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|!/photos/pic_recommend_status) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/wb_ad.js
[MITM]
hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com
```

Display netflix ratings（IMDb、douaban）
```
[Script]
http-request ^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D script-path=https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js
http-response ^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js
[MITM]
hostname = ios.prod.ftl.netflix.com
```

Display jd historical price
```
# 不生效或失效的检查一下配置有没有这两条复写，删除试试
# ^https?:\/\/api\.m\.jd.com\/client\.action\?functionId=start - reject
# ^https?:\/\/api\.m\.jd.com\/client\.action\?functionId=(start|queryMaterialAdverts) - reject
[Script]
http-response ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/jd_price.js
[MITM]
hostname = api.m.jd.com
```

Display taobao historical price
```
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
```
[Script]
cron "0 9,18 * * 1-5" script-path=https://raw.githubusercontent.com/yichahucha/surge/master/clock_in.js
```

Script management tool
```
[Script]
cron "0 0 * * *" eval_script.js
```

# Quan-X

Remove weibo ads
```
[rewrite_local]
^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) url script-response-body wb_launch.js
^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|!/photos/pic_recommend_status) url script-response-body wb_ad.js
[mitm]
hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com
```

Display netflix ratings（IMDb、douaban）
```
[rewrite_local]
^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D url script-request-header nf_rating.js
^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D url script-response-body nf_rating.js
[mitm]
hostname = ios.prod.ftl.netflix.com
```

Display jd historical price
```
[rewrite_local]
^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body jd_price.js
[mitm]
hostname = api.m.jd.com
```

Display taobao historical price
```
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
```
[task_local]
0 9,18 * * 1-5 clock_in.js
```


Script management tool

简单使用示例

1.设置定时任务更新脚本，第一次需手动更新，确保脚本更新成功

```
[task_local]
0 0 * * * eval_script.js
```


2.在 eval_script.js 中配置需要管理的脚本，可以配置远程和配置本地，提供一个复写订阅适配 eval_script 的远程示例

```

远程格式为: ####脚本类型(request/response) 匹配正则 eval 脚本连接
本地格式为: 脚本类型(request/response) 匹配正则 eval 脚本连接

[eval_remote]
https://raw.githubusercontent.com/yichahucha/surge/master/sub_script.conf

[eval_local]
// custom local...

```

3.添加复写订阅，更新复写订阅

```
[rewrite_remote]
https://raw.githubusercontent.com/yichahucha/surge/master/sub_script.conf, tag=eval, enabled=true
```
4.以上都配置好，示例脚本生效
