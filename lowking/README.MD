[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![LICENSE](https://img.shields.io/badge/感谢-Orz3的图标-red.svg)](https://github.com/Orz-3)
# Scripts
### 日志

#### 2020-07-24
> ##### 更新
> - ToolKit支持surge新特性http api
>  > 1. 写法参考[UseToolKitDemo](https://github.com/lowking/Scripts/blob/master/util/example/useToolKitDemo.js)，之后就可以在脚本所在的目录下执行```node useToolKitDemo.js p```，记得命令尾巴加空格p，就可以把当前这个脚本发送到手机端测试了
>  > 2. 执行```node useToolKitDemo.js```可在当前目录下生成BoxJs配置文件，详细实现可以查看ToolKit中的boxJsJsonBuilder方法

#### 2020-07-20
> ##### 更新
> - ToolKit新增randomString和autoComplete方法
> - QQ会员成长值签到改造，使用ToolKit

#### 2020-07-19
> ##### 新增
> - 索尼俱乐部签到，支持自动登录签到
> - 新增ToolKit，根据自己的习惯整合各个开发者而形成的工具包（@NobyDa, @chavyleung）

#### 2020-07-10
> ##### 更新
> - 订阅转换器引用[KOP-XIAO的资源转换器](https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/resource-parser.js)（我就简单的支持了surge，就测试过vmess格式的订阅）

#### 2020-07-08
> ##### 新增
> - 添加Wi-Fi助手（从gist迁移过来，并汉化通知）
#### 2020-07-02
> ##### 新增
> - [Wi-Fi助手模块（Surge专用）](https://gist.githubusercontent.com/lowking/3aa8748416e938528967885bc403b2f1/raw/ssid.sgmodule)：在boxjs中配置需直连的ssid
> - 自用GetCookie、Tasks模块
> - 订阅转换器（目前功能简陋，自用）

> ##### 更新
> - QQ会员成长值签到支持好友列表点赞（每天20点）
> - 微博超话签到支持获取超话关注列表，批量签到

#### 2020-06-16
> ##### 新增
> - QQ会员成长值签到
> - 微博超话签到(原作者NavePnow，因为通知太多进行修改，同时重构了代码)
> - 微博超话签到支持获取关注列表（要是关注很多不知道行不行，没帐号测试）
> - 微博超话签到支持手动清除cookie（isClearCookie改成true之后运行一次脚本）