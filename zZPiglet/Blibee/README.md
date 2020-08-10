# 便利蜂

>  便利蜂便利店目前开店城市：北京市、天津市、南京市、常州市、嘉兴市、上海市、无锡市、苏州市、金华市、深圳市、合肥市、扬州市、宁波市、廊坊市、济南市、青岛市、温州市、杭州市
>
> 便利蜂的门店主要分布于北京、天津、上海、南京等8个大中城市在内的华北、华东都市圈，并正在加速完成对这两大城市群的高密度渗透。

在这些城市居住并想使用此脚本的可以走我 aff，(可能)会有一些优惠券，当然目前来看新用户优惠活动暂未结束(50 元券包)，但是推广方得到的好像没啥了（写脚本时发现只给 5.9 折门店蒸包折扣券，然而并不吃。。）

> **aff：[短链](http://be3.cc/s/mhndZwo) 或 [原链](https://d.bianlifeng.com/c/a/s4?type=pages&path=%2Fpages%2FdistributeManager%2Findex%3Fp%3D%252Fpages%252FinviteNewUserCity%252Findex%253FshareCode%253D3130056365815256%2526baseCode%253D31%2526floor%253DNaN%2526entrySource%253Dfacecode%26source%3D31&webview=1&url=https%3A%2F%2Fh5.bianlifeng.com%2Fbond%2FinviteCity%2Findex%3FshareCode%3D3130056365815256%26baseCode%3D31%26floor%3DNaN%26entrySource%3Dfacecode&appViewName=InviteNewUserCity&il=true&source=poster_share&defaultNavBar=true)**

便利蜂 app 或微信小程序"便利蜂"自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。

1. 请先按下述方法进行配置，进入"便利蜂"，点击"签到赚礼金"，若弹出"首次写入便利蜂 Cookie 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
2. 若 Cookie 失效，请确认配置后重新进入"便利蜂"，点击"签到赚礼金"，若弹出"更新便利蜂 Cookie 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
3. 到 cron 设定时间自动签到时，若弹出"便利蜂 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。
4. 软件基本使用方法 issue 会直接关闭，建议查看 [Quantumult X 不完全教程](https://www.notion.so/kopshawn/Quantumult-X-1d32ddc6e61c4892ad2ec5ea47f00917) 及 [Surge 配置详解](https://zhuangzhuang.cf/2018-11-14/surge/)。提 issue 请带截图 / 视频 / 日志，不要一句 "不行 / 不能 / 用不了"。当你提出一个问题时，最终是否能得到回答，[往往取决于你所提问的方式](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way/blob/master/README-zh_CN.md)。

----------

# ⚠️免责声明：

1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author: zZPiglet

----------
更新日志：
- 2020/06/29:  
增加签到得会员信息判断，修复自动领取任务错误，尝试修复不会完成任务。  
鉴于目前礼金有效期为获取后一年，兑换蜂蜜或优惠券有效期为兑换后一周，故取消自动兑换的计划，请使用时先手动兑换优惠。
- 2020/04/29：  
    增加自动签到领礼金（礼金可兑换蜂蜜付款时抵扣，或兑换门店满减券），增加自动领取所有任务，增加自动完成除消费、邀请类任务。  
    脚本中使用了我的邀请签到 aff（每日最多 5 次 1～6 礼金），若不希望使用，可将 shareCode 改空。  
    已知 bug：通知数值不正确，未完成任务不通知（但有日志）。不影响正常运行，后续改正。  
    待办：修改 bug，自动兑换判断。  
----------



## Quantumult X (TestFlight 190+, App Store 1.0.5+):
```properties
[task_local]
1 0 * * * Blibee.js
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/Blibee/Blibee.js

[rewrite_local]
^https:\/\/h5\.bianlifeng\.com\/meepo\/taskCenter\/home\/v\d url script-request-header Blibee.js
or remote
^https:\/\/h5\.bianlifeng\.com\/meepo\/taskCenter\/home\/v\d url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/Blibee/Blibee.js
```

## Surge 4.0+:
```properties
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Blibee/Blibee.js
http-request ^https:\/\/h5\.bianlifeng\.com\/meepo\/taskCenter\/home\/v\d script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/Blibee/Blibee.js
```

## All apps:
```properties
[mitm]
hostname = h5.bianlifeng.com
```



获取完 Cookie 后可不注释 rewrite / hostname，Cookie 更新时会弹窗。若因 MitM 导致该软件或小程序网络不稳定，可注释掉 hostname。

----------

## 感谢

[@NobyDa](https://github.com/NobyDa)
[@yichahucha](https://github.com/yichahucha)
[@chavyleung](https://github.com/chavyleung)