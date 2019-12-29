# Profiles
📖 文档 | 📖 [Docs](https://github.com/NavePnow/Profiles/blob/master/README_EN.md)

## Filter - Surge and QuantumultX 规则集

## Scripts

### filter_conversion.js
**By [NavePnow](https://github.com/NavePnow)**
**powered by CLOUDFLARE Workers**

<img src="https://raw.githubusercontent.com/NavePnow/blog_photo/master/process.jpeg" height="60%" width="60%">

1. 特点
    1. 从 QuantumultX 分流链接生成 Surge 规则集，反之亦然。
    2. 如果源链接改变，生成的分流链接自动改变。
2. Instructions
    1. 在 CloudFlare 网站中创建新的 Workers
    2. 粘贴所有脚本内容到编辑器中
    3. 填充并修改必要的内容 (url 和 正则)
    4. 保存和部署
   
### checkin.js
**By [Neurogram](https://github.com/Neurogram-R) feat [NavePnow](https://github.com/NavePnow)**

<img src="https://raw.githubusercontent.com/NavePnow/blog_photo/master/IMAGE 2019-11-12 19:57:53.jpg" height="40%" width="40%">

1. 特点
   1. 展示已用流量，剩余流量和到期时间
   2. 利用 Cron 定时运行脚本
2. 步骤
   1. `https://www.notion.so/Check-in-0797ec9f9f3f445aae241d7762cf9d8b`
   2. 如果内容出错，检查返回数据的内容以及格式并修改正则表达式

### checkin_1point.js
**By [NavePnow](https://github.com/NavePnow) feat [wangfei021325](https://t.me/wangfei021325)**

<img src="https://raw.githubusercontent.com/NavePnow/blog_photo/master/IMAGE 2019-11-12 19:58:49.jpg" height="40%" width="40%">
一亩三分地论坛自动签到脚本

[教程](https://nave.work/%E4%B8%80%E4%BA%A9%E4%B8%89%E5%88%86%E5%9C%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.html)

### 10010+.js/10010+_qx.js
**By [NavePnow](https://github.com/NavePnow)**
根据作者[coo11](https://t.me/coo11) 的 Jsbox 脚本进行修改

<img src="https://raw.githubusercontent.com/NavePnow/blog_photo/master/IMG_0666.PNG" height="40%" width="40%">

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

### weather.js/weather_qx.js
**By [NavePnow](https://github.com/NavePnow)**
**powered by Dark Sky**

<img src="https://raw.githubusercontent.com/NavePnow/blog_photo/master/IMG_0886.jpg" height="40%" width="40%">

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

### weibo
**By [NavePnow](https://github.com/NavePnow)**
**inspired by [Nobyda](https://t.me/nubida)**

<img src="https://raw.githubusercontent.com/NavePnow/blog_photo/master/IMG_1189.JPG" height="40%" width="40%">
微博超话自动签到脚本

[教程](https://nave.work/微博超话自动签到脚本.html)

# Tip Jar

| PayPal                                                                                                                                                                       | 微信赞赏 WeChat Pay                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=DSZJCN4ZUEW74&currency_code=USD&source=url) | <img src="https://raw.githubusercontent.com/NavePnow/blog_photo/master/1234.JPG" width="200">
