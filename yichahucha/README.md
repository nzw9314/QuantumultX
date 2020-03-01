# Surge
Remove weibo ads
```
[Script]
http-response ^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/wb_launch.js
http-response ^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|\!/photos/pic_recommend_status) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/wb_ad.js
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
# lite
# http-response ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/jd_price_lite.js
[MITM]
hostname = api.m.jd.com
```

Display taobao historical price
```
# 不生效或失效的需要卸载 tb 重装，注意不开脚本进 tb 大概率会失效
[Script]
http-request ^https?://.+/amdc/mobileDispatch requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/tb_price.js
http-response ^https?://trade-acs\.m\.taobao\.com/gw/mtop\.taobao\.detail\.getdetail requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/tb_price.js
[MITM]
hostname = trade-acs.m.taobao.com,amdc.m.taobao.com

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

# Quan-X

Remove weibo ads
```
[rewrite_local]
^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) url script-response-body wb_launch.js
^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|\!/photos/pic_recommend_status) url script-response-body wb_ad.js
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
# lite
# ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body jd_price_lite.js
[mitm]
hostname = api.m.jd.com
```

Display taobao historical price
```
# 不生效或失效的需要卸载 tb 重装，注意不开脚本进 tb 大概率会失效
[rewrite_local]
# 1.0.5（商店版）
^https?://(trade-acs|amdc)\.m\.taobao\.com/(gw/mtop\.taobao\.detail\.getdetail|amdc/mobileDispatch) url script-response-body tb_price.js
# 1.0.6（TF版）
^https?://.+/amdc/mobileDispatch url script-request-body tb_price.js
^https?://trade-acs\.m\.taobao\.com/gw/mtop\.taobao\.detail\.getdetail url script-response-body tb_price.js
[mitm]
hostname = trade-acs.m.taobao.com,amdc.m.taobao.com

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
```
# 远程脚本管理，脚本内添加配置
[task_local]
0 0 * * * eval_script.js
```
