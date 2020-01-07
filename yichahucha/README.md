## Surge

Remove Weibo ads, promotion and recommend
```
[Script]
http-response ^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|\!/photos/pic_recommend_status) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/wb_ad.js
http-response ^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/wb_launch.js
[MITM]
hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com
```

Display Netflix TV series and movie's IMDb ratings, Douban ratings, rotten tomato and country/region
```
[Script]
http-request ^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D script-path=https://raw.githubusercontent.com/yichahucha/surge/master/netflix_ratings.js
http-response ^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/nf_rating.js
[MITM]
hostname = ios.prod.ftl.netflix.com
```

Display commodity historical price

JD
```
[Script]
http-response ^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/jd_price.js
[MITM]
hostname = api.m.jd.com
```

taobao (beta)
```
[Rule]
# 注意优先级（建议放在第一条）
# 这两条规则可以最大程度缩小匹配的 IP 范围，减少干扰其他应用，不一定适用所有人，可以自己抓包调节
IP-CIDR, 203.119.144.0/23, REJECT, no-resolve
IP-CIDR, 203.119.175.0/24, REJECT, no-resolve
# 目前这条规则匹配的是部分阿里云 IP 段，其他使用这些阿里云 IP 的应用可能会有问题，谨慎使用
# IP-CIDR, 203.119.128.0/18, REJECT, no-resolve
[Script]
http-response ^https://trade-acs.m.taobao.com/gw/mtop.taobao.detail.getdetail requires-body=1,script-path=https://raw.githubusercontent.com/yichahucha/surge/master/tb_price.js
[MITM]
hostname = trade-acs.m.taobao.com
```

Daily work check-in reminder
```
[Script]
cron "0 9,18 * * 1-5" script-path=https://raw.githubusercontent.com/yichahucha/surge/master/cron_daily.js
```

## Quan-X

Remove Weibo ads, promotion and recommend
```
[rewrite_local]
^https?://m?api\.weibo\.c(n|om)/2/(statuses/(unread|extend|positives/get|(friends|video)(/|_)timeline)|stories/(video_stream|home_list)|(groups|fangle)/timeline|profile/statuses|comments/build_comments|photo/recommend_list|service/picfeed|searchall|cardlist|page|\!/photos/pic_recommend_status) url script-response-body wb_ad.js
^https?://(sdk|wb)app\.uve\.weibo\.com(/interface/sdk/sdkad.php|/wbapplua/wbpullad.lua) url script-response-body wb_launch.js
[mitm]
hostname = api.weibo.cn, mapi.weibo.com, *.uve.weibo.com
```

Display Netflix TV series and movie's IMDb ratings, Douban ratings, rotten tomato and country/region
```
[rewrite_local]
^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D url request-header languages=(.+?)&(.+)&path=%5B%22videos%22%2C%(\d+)%22%2C%22summary%22%5D request-header languages=en-US&$2&path=%5B%22videos%22%2C%$3%22%2C%22summary%22%5D&path=%5B%22videos%22%2C%$3%22%2C%22details%22%5D
^https?://ios\.prod\.ftl\.netflix\.com/iosui/user/.+path=%5B%22videos%22%2C%\d+%22%2C%22summary%22%5D url script-response-body nf_rating.js
[mitm]
hostname = ios.prod.ftl.netflix.com
```

Display commodity historical price

JD
```
[rewrite_local]
^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig) url script-response-body jd_price.js
[mitm]
hostname = api.m.jd.com
```
taobao (beta)
```
[filter_local]
# 注意优先级（建议放在第一条）
# 这两条规则可以最大程度缩小匹配的 IP 范围，减少干扰其他应用，不一定适用所有人，可以自己抓包调节
ip-cidr, 203.119.144.0/23, reject, no-resolve
ip-cidr, 203.119.175.0/24, reject, no-resolve
# 目前这条规则匹配的是部分阿里云 IP 段，其他使用这些阿里云 IP 的应用可能会有问题，谨慎使用
# ip-cidr, 203.119.128.0/18, reject, no-resolve
[rewrite_local]
^https://trade-acs.m.taobao.com/gw/mtop.taobao.detail.getdetail url script-response-body tb_price.js
[mitm]
hostname = trade-acs.m.taobao.com
```
