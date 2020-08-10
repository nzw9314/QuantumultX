[![Anurag's github stats](https://github-readme-stats.vercel.app/api?username=evilbutcher)](https://github.com/anuraghazra/github-readme-stats)

# Quantumult X脚本和规则整理

绝大多数代码都用到了@chavyleung的Env.js和@Peng-YM的OpenAPI.js，感谢！

## 脚本类
### [BoxJs](https://github.com/evilbutcher/Quantumult_X/blob/master/evilbutcher.boxjs.json)
订阅地址：https://raw.githubusercontent.com/evilbutcher/Quantumult_X/master/evilbutcher.boxjs.json

### [微博超话（单账号）](https://github.com/evilbutcher/Quantumult_X/tree/master/check_in/weibo)
#### 功能特点
1、自动获取最新超话列表。  
2、自动签到。  
3、如果超话数量大于100，可以先检查签到情况，未签到才会执行，更好解决签到频繁问题。  
4、支持BoxJs。  

### [自用签到](https://github.com/evilbutcher/Quantumult_X/tree/master/check_in/glados)
#### 功能特点
1、自动签到。  
2、查看流量信息。  
3、支持BoxJs。  
4、checkin_env.js修改自@Neurogram-R，增加了多平台支持。
 
### [热门监控](https://github.com/evilbutcher/Quantumult_X/tree/master/check_in/hotsearch/hot.js)
#### 功能特点
1、可以选择性监控榜单。  
2、可以分别设定每个榜单的最热内容数量。  
3、可以选择是否附带话题链接。  
4、可以自定每个榜单是匹配关键词还是获取最新内容。  
5、可以自定每个榜单内容独立推送还是合并推送。  
6、一些榜单单独推送时支持封面。   
7、支持BoxJs。  
8、监控微博热搜关键词。  
9、监控知乎热榜关键词。  
10、监控百度风云榜关键词。  
11、监控B站日榜关键词（对应关系：0全站，1动画，3音乐，4游戏，5娱乐，36科技，119鬼畜，129舞蹈）。  
12、监控豆瓣电影关键词。  
13、监控抖音视频关键词。  
14、监控36氪关键词。  
15、监控Kindle图书关键词。  
16、监控RSSHub订阅。  

### [App价格监控](https://github.com/evilbutcher/Quantumult_X/blob/master/check_in/appstore/AppMonitor.js)
#### 功能特点
1、app可单独设置区域，未单独设置区域，则采用reg默认区域。  
2、设置区域方式“1443988620:hk，1443988620/us，1443988620-uk，1443988620_jp，1443988620 au”。  
3、支持BoxJs by evilbutcher。  

## 规则类
### [去广告](https://github.com/evilbutcher/Quantumult_X/tree/master/remove_ad)
#### 功能特点
[readme](https://github.com/evilbutcher/Quantumult_X/tree/master/remove_ad/README.md)  

### 免责声明
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。
