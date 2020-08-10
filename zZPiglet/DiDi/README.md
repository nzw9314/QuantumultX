# 滴滴出行

"滴滴出行" app 自动签到，支持 Quantumult X（理论上也支持 Surge、Loon，未尝试）。  
请先按下述方法进行配置，进入"滴滴出行"，若弹出"首次写入滴滴出行 Token 成功"即可正常食用，先手动运行一次脚本，弹出成功后回到"滴滴出行"，点击右上角"天天领福利"查看福利金是否到账，其他提示或无提示请发送日志信息至 issue。  
到 cron 设定时间自动签到时，若弹出"滴滴出行 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

## ⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。


----------
## 版本记录：
- 2020 / 06 / 13  
    修正 DiDi_reward.js 通知中领取福利金总额的错误。由于暂时想偷懒所以没有采取 `async`、`await` 的写法，若后续考虑合并至主脚本，会更改写法。
- 2020 / 06 / 12  
    增加 [`DiDi_reward.js`](https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_reward.js) ，用于领取打车后忘领取的福利金。由于暂时不确定此福利金领取期限，建议每天 23:59 执行此脚本。此脚本与主脚本暂时区分为两个脚本，未后续 aff 考虑建议主脚本不要太晚运行。若后期测试打车后福利金领取期限更长，考虑将此脚本合并至主脚本。  
    注：[`DiDi_reward.js`](https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_reward.js) 因为最近没有打车所以并未进行任何一次测试，请反馈问题以及时修正。   
    增加 [`DiDi_Tianjin.js`](https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_Tianjin.js) ，用于**天津**地区活动"通勤55折-天天签到"，测试阶段并不完善，且每周活动 id 会进行更新，需及时更新脚本。其余地区可以自行抓包测试，更改 `activity` 及 `batch_id` 即可。  
    增加 [`DiDi_ticket.js`](https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_ticket.js) ，用于按照 [`DiDi.js`](https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js) 正确配置但无法获取 token 且"滴滴出行"主页右上角有"天天领福利"的用户获取 token。请按脚本内配置重写及主机名。
- 2020 / 06 / 09  
    _**测试阶段**_，可能会出现各种问题，希望因脚本出现问题可及时反馈。  
    增加自动签到领取福利金。  
    脚本中使用了我的邀请打卡 aff（每日最多 5 次，每次 60 福利金。），若不希望使用，可将 aff 改为 false。  
    **代办**：增加自动领取打车后未领取的福利金/打车金。  
    **常见错误**：
    1. 若是 Token 获取问题请先自行排查重写及主机名是否正确，若均正确且日志无报错的情况下无法获取，请反馈，并最好能提供抓包记录（打开抓包软件，然后再进入滴滴，进入打车的界面之后关闭抓包的软件，导出这个包私发给我就行）。
    2. 提示"签到失败‼️ 详情请见日志。"，可将日志信息私发给我。若日志信息含有"500 Server internal error"，且着急签到，可尝试将 aff 改为 false 后运行一次脚本，并反馈是否还存在问题。
----------
## 配置
### Quantumult X (App Store:1.0.5+, TestFlight 190+):
```properties
[task_local]
30 0 * * * DiDi.js, tag=滴滴出行
or remote
30 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js, tag=滴滴出行

59 23 * * * DiDi_reward.js
or remote
59 23 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_reward.js 

[rewrite_local]
^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? url script-request-header DiDi.js
or remote
^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js
```
### Surge 4.0+ & Loon:
```properties
[Script]
cron "59 23 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_reward.js
cron "30 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js
http-request ^https:\/\/as\.xiaojukeji\.com\/ep\/as\/toggles\? script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi.js
```
### All apps:
```properties
[mitm]
hostname = as.xiaojukeji.com
```

### 按上述配置无法获取 token 且主页有活动入口可用以下配置
#### Quantumult X (App Store:1.0.5+, TestFlight 190+):
```properties
[rewrite_local]
^https:\/\/bosp-api\.xiaojukeji\.com\/wechat\/benefit\/public\/index\? url script-request-header DiDi_ticket.js
or remote
^https:\/\/bosp-api\.xiaojukeji\.com\/wechat\/benefit\/public\/index\? url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_ticket.js
```
#### Surge 4.0+ & Loon:
```properties
[Script]
http-request ^https:\/\/bosp-api\.xiaojukeji\.com\/wechat\/benefit\/public\/index\? script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/DiDi/DiDi_ticket.js
```
#### All apps:
```properties
[mitm]
hostname = bosp-api.xiaojukeji.com
```

获取完 Token 后可不注释 rewrite / hostname，Token 更新时会弹窗。若因 MitM 导致该软件或小程序网络不稳定，可注释掉 hostname。