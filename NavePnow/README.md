<p align="center">
<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/trans123.png" alt="Evan" width="200">
</p>
<h1 align="center">Profiles</h1>

[![Generic badge](https://img.shields.io/badge/dynamic/json?color=lightgray&label=Followers&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dgithub%26queryKey%3DNavePnow&logo=github)](https://t.me/Leped_Channel) [![](https://img.shields.io/github/stars/NavePnow/Profiles.svg?logo=github&color=lightgrey)](https://github.com/NavePnow/Profiles) [![](https://img.shields.io/github/forks/NavePnow/Profiles.svg?logo=github&color=lightgrey)](https://github.com/NavePnow/Profiles) [![Generic badge](https://img.shields.io/badge/dynamic/json?color=blue&label=Channel&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dtelegram%26queryKey%3DLeped_Channel&logo=telegram)](https://t.me/Leped_Channel) [![Generic badge](https://img.shields.io/badge/Bot-Feedback-blue.svg?logo=telegram)](https://t.me/Leped_Bot) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/) 

[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://GitHub.com/NavePnow)

📖 文档 | 📖 [Docs](https://github.com/NavePnow/Profiles/blob/master/README_EN.md)

[![](https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/english.svg)](https://github.com/NavePnow/Profiles/blob/master/README_EN.md)

目录
=================

   * [Profiles](#profiles)
   * [Table of Contents](#table-of-contents)
      * [Filter - Surge and QuantumultX 规则集](#filter---surge-and-quantumultx-规则集)
      * [Scripts](#scripts)
         * [Surge/QuantumultX](#surgequantumultx)
            * [filter_conversion.js](#filter_conversionjs)
            * [checkin.js](#checkinjs)
            * [checkin_1point.js](#checkin_1pointjs)
            * [10010 .js/10010 _qx.js](#10010js10010_qxjs)
            * [weather.js/weather_qx.js](#weatherjsweather_qxjs)
            * [weibo](#weibo)
         * [Google Apps Script](#google-apps-script)
            * [google_script/singtel.js](#google_scriptsingteljs)
            * [google_script/calendar.js](#google_scriptcalendarjs)
            * [google_script/ss-checkin.js](#google_scriptss-checkinjs)
         * [JSBox](#jsbox)
            * [JSBox/NUS_NextBus.js](#jsboxnus_nextbusjs)
            * [JSBox/Singtel .js](#jsboxsingteljs)
      * [Tip Jar](#tip-jar)

## Filter - Surge and QuantumultX 规则集

## Scripts

### Surge/QuantumultX

#### filter_conversion.js
**By [NavePnow](https://github.com/NavePnow)**

**powered by CLOUDFLARE Workers**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/process.jpeg" height="60%" width="60%">

1. 特点
    1. 从 QuantumultX 分流链接生成 Surge 规则集，反之亦然。
    2. 如果源链接改变，生成的分流链接自动改变。
2. Instructions
    1. 在 CloudFlare 网站中创建新的 Workers
    2. 粘贴所有脚本内容到编辑器中
    3. 填充并修改必要的内容 (url 和 正则)
    4. 保存和部署
   
#### checkin.js
**By [Neurogram](https://github.com/Neurogram-R) feat [NavePnow](https://github.com/NavePnow)**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/IMAGE 2019-11-12 19:57:53.jpg" height="40%" width="40%">

1. 特点
   1. 展示已用流量，剩余流量和到期时间
   2. 利用 Cron 定时运行脚本
2. 步骤
   1. `https://www.notion.so/Check-in-0797ec9f9f3f445aae241d7762cf9d8b`
   2. 如果内容出错，检查返回数据的内容以及格式并修改正则表达式

#### checkin_1point.js
**By [NavePnow](https://github.com/NavePnow) feat [wangfei021325](https://t.me/wangfei021325)**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/IMAGE 2019-11-12 19:58:49.jpg" height="40%" width="40%">
一亩三分地论坛自动签到脚本

[教程](https://medium.com/navepnow/一亩三分地自动签到脚本-c718734111ac)

#### 10010+.js/10010+_qx.js
**By [NavePnow](https://github.com/NavePnow)**
根据作者[coo11](https://t.me/coo11) 的 Jsbox 脚本进行修改

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/IMG_0666.PNG" height="40%" width="40%">

1. 特点
   1. 显示剩余流量，话费余额和流量剩余
   2. 利用 Cron 定时运行脚本
2. 步骤
   1. 在支付宝小程序“中国联通”设置你的联通手机号 (提供 api)
   2. 在 Surge/QuantumultX Scripts目录下创建 10010+.js 并复制 [链接](https://raw.githubusercontent.com/NavePnow/Profiles/master/Scripts/10010%2B.js) 所有内容到脚本中 [QuantumultX](https://raw.githubusercontent.com/NavePnow/Profiles/master/Scripts/10010%2B_qx.js) 同理
   3. 在指定地方添加联通手机号
   4. 在编辑模式下打开 Surge, 并在配置文件最后(Scripts内容下)添加`cron "00 12 * * *" debug=1,script-path=10010+.js` 
      QuantumultX([[task_local] 标签下): `00 12 * * * 10010+.js`
   5. 保存
    
3. 注意⚠️
    1. 如果你想把文件放在云端，确保该文件是私密的，因为支付宝api返回的数据包含了你的真实姓名。
    2. 如果有问题，欢迎 [反馈](https://t.me/Leped_Bot) 

#### weather.js/weather_qx.js
**By [NavePnow](https://github.com/NavePnow)**

**powered by Dark Sky**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/IMG_0886.jpg" height="40%" width="40%">

1. 特点
   1. 显示天气图标，当天温度，降雨概率以及实时天气信息总结
   2. 利用 Cron 定时运行脚本(8am-8pm 每隔3小时运行一次)
2. 步骤
   1. 在 [Dark Sky 网站](https://darksky.net/dev)注册账号，获得免费的 api
   2. 下载并运行 [捷径](https://www.icloud.com/shortcuts/11d347ed592f4b67847403a9052666f4)
   3. 在捷径中添加第一步生成的 Secret Key
   4. 在编辑模式下打开 Surge, 并在配置文件最后(Scripts内容下)添加`cron "0 0 8-20/3 * * *" debug=1,script-path=weather_dark.js` 
       QuantumultX([[task_local] 标签下): `0 8-20/3 * * * weather_dark.js`
   5. 保存
    
3. 注意⚠️
    1. 如果你想把文件放在云端，确保该文件是私密的，因为Dark Sky api 免费的调用次数不是无限的，具体请参考 API Usage
    2. 如果想自定义功能，请参考 [Dark Sky API](https://darksky.net/dev/docs#overview)
    3. 该脚本的目的是每天早上进行今天一天的天气提醒，因为 Dark Sky Api 有 US 极端天气警告，所以后续脚本会做相应的修改以适应本人的需求
    4. 如果有问题，欢迎 [反馈](https://t.me/Leped_Bot) 

#### weibo
**By [NavePnow](https://github.com/NavePnow)**

**inspired by [Nobyda](https://t.me/nubida)**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/IMG_1189.JPG" height="40%" width="40%">
微博超话自动签到脚本

[教程](https://medium.com/navepnow/微博超话自动签到脚本-4826bff2112c)

### Google Apps Script

#### google_script/singtel.js
**By [NavePnow](https://github.com/NavePnow)**

**powered by Google Script**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/IMG_1888.jpg" height="40%" width="40%">

1. 特点
   1. 显示剩余话费，流量，短信和电话相关信息
   2. 云端运行脚本`Google Script`, 无需消耗本地资源和流量
2. 步骤
   1. 从 [BotFather](https://telegram.me/BotFather) 创建一个bot，记下 `token`，代替脚本中的关键词 `BOT_TOKEN`
   2. 从 [get_id_bot](https://telegram.me/get_id_bot) 得到用户 `id`，代替脚本中的关键词 `CHAT_ID`
   3. 安装抓包软件，例如 [HTTP Catcher](https://apps.apple.com/us/app/http-catcher/id1445874902)
   4. 安装 [hi!App](https://apps.apple.com/us/app/singtel-prepaid-hi-app/id1034712778) 软件，并利用自己的手机号进行登录
   5. 打开抓包软件进行抓包，刷新 `hi!App` (重新打开)
   6. 在网络请求中找到 `https://hiapp.aws.singtel.com/api/v2/usage/dashboard`
   7. 记下请求头中的 `Authorization` 和 `Cookie`，代替脚本中的关键词
   8. 拷贝脚本内容到 [Google Script](https://script.google.com/home/my) 的编辑器中
   9. 设置一个合适的时间去触发脚本
   > Edit -> Current project's triggers -> Add Trigger
3.  注意⚠️
    1. 如果有问题，欢迎 [反馈](https://t.me/Leped_Bot) 

#### google_script/calendar.js
**By [NavePnow](https://github.com/NavePnow)**

**powered by Google Script and Google Developers Console**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/IMG_1925.jpg" height="35%" width="35%">

1. 特点
   1. 根据 `Google Calendar Api` 可同时设置多个日历进行每日提醒
   2. 云端运行脚本`Google Script`, 无需消耗本地资源和流量
2. 步骤
   1. 从 [BotFather](https://telegram.me/BotFather) 创建一个bot，记下 `token`，代替脚本中的关键词
   2. 从 [get_id_bot](https://telegram.me/get_id_bot) 得到用户 `id`，代替脚本中的关键词
   3. 在 [Google Developers Console](https://console.developers.google.com) 中登录并激活你的 Google 账户
   4. 在 [Google Developers Console](https://console.developers.google.com) 激活 Google Calendar API
   5. 打开 [Google Developers Console](https://console.developers.google.com), 在凭证标签下创建新的 `Public API access key`， 代替脚本中的关键词 `API_KEY`
   6. 在 `[Google Calendar] -> [Setting and Sharing] -> [Calendar Setting]` 下找到你的 `Calendar ID` ,添加到脚本 `calendar_id` 中
   7. 拷贝脚本内容到 [Google Script](https://script.google.com/home/my) 的编辑器中
   8. 设置一个合适的时间去触发脚本
   > Edit -> Current project's triggers -> Add Trigger
3.  注意⚠️
    1. 如果有问题，欢迎 [反馈](https://t.me/Leped_Bot) 

#### [google_script/ss-checkin.js](https://raw.githubusercontent.com/NavePnow/Profiles/master/Scripts/google_script/ss-checkin.js)
**By [Neurogram](https://github.com/Neurogram-R) feat [NavePnow](https://github.com/NavePnow)**

**powered by Google Script and Google Developers Console**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/ss-checkin.jpg" height="40%" width="40%">

1. 特点
   1. 展示已用流量，剩余流量和到期时间
   2. 云端运行脚本`Google Script`, 无需消耗本地资源和流量
2. 步骤
   1. 从 [BotFather](https://telegram.me/BotFather) 创建一个bot，记下 `token`，代替脚本中的关键词 `BOT_TOKEN`
   2. 从 [get_id_bot](https://telegram.me/get_id_bot) 得到用户 `id`，代替脚本中的关键词 `CHAT_ID`
   3. 在脚本的 `accounts` 中进行账号的添加，内容顺序依次为 `站点名称`、`站点登录网址`、`邮箱`、`密码`，内容均需要用双引号 " " 或单引号  '' 括起来
   4. 拷贝脚本内容到 [Google Script](https://script.google.com/home/my) 的编辑器中
   5. 设置一个合适的时间去触发脚本
   > Edit -> Current project's triggers -> Add Trigger -> Choose which function to run(launch)
3.  注意⚠️
    1. 关于签到 Surge 和 Shortcuts 的[详细教程](https://www.notion.so/Check-in-0797ec9f9f3f445aae241d7762cf9d8b)
    2. 如果内容出错，检查返回数据的内容 `Logger.log()` 以及格式并修改正则表达式
    3. 如需进行测试，可以在编辑器中 `Run -> Debug function -> launch` 进行调试
    4. 如果有问题，欢迎 [反馈](https://t.me/Leped_Bot) 


### JSBox

#### JSBox/NUS_NextBus.js
**By [NavePnow](https://github.com/NavePnow)**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/nus_nextbus.jpg" height="30%" width="30%">

1. 特点
   1. 检测用户所在位置信息进行公交站点筛选
   2. 显示公交站点详细信息
2. 步骤
   1. 利用`Erots`商店进行脚本的下载 [脚本链接](https://liuguogy.github.io/JSBox-addins/?q=show&objectId=5e64e01e73f4b700096a1fd9)
   2. 在小组件中进行设置，调整高度 (推荐: 180)
3.  注意⚠️
    1. 如果有问题，欢迎 [反馈](https://t.me/Leped_Bot) 

#### JSBox/Singtel+.js
**By [NavePnow](https://github.com/NavePnow)**

**UI inspired by [lchreal6](https://github.com/lchreal6)**

<img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/singtel+.jpg" height="30%" width="30%">

1. 特点
   1. 显示剩余话费，流量，短信和电话相关信息
2. 步骤
   1. 利用`Erots`商店进行脚本的下载 [脚本链接](https://liuguogy.github.io/JSBox-addins/?q=show&objectId=5e67326840595e0008b5481f)
   2. 安装抓包软件，例如 [HTTP Catcher](https://apps.apple.com/us/app/http-catcher/id1445874902)
   3. 安装 [hi!App](https://apps.apple.com/us/app/singtel-prepaid-hi-app/id1034712778) 软件，并利用自己的手机号进行登录
   4. 打开抓包软件进行抓包，刷新 `hi!App` (重新打开)
   5. 在网络请求中找到 `https://hiapp.aws.singtel.com/api/v2/usage/dashboard`
   6. 记下请求头中的 `Authorization` 和 `Cookie`，代替脚本中的关键词
   7. 在小组件中进行设置，调整高度 (推荐: 180)
3.  注意⚠️
    1. 如果有问题，欢迎 [反馈](https://t.me/Leped_Bot) 

## Tip Jar

| PayPal                                                                                                                                                                       | 微信赞赏 WeChat Pay                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=DSZJCN4ZUEW74&currency_code=USD&source=url) | <img src="https://cdn.jsdelivr.net/gh/NavePnow/blog_photo@private/1234.JPG" width="200">
