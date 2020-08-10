> 📌 不定期更新各种签到、有趣的脚本，欢迎star🌟

### 配置步骤 （请先认真阅读配置，再进行操作）
 1. 根据你当前的软件，配置好srcipt。Tips:由于是远程文件，记得顺便更新文件。
 2. 打开小木虫app => 发现页面 => 签到领红包 => 拆红包。弹出通知，即获取成功。
 3. 回到quanx等软件，关掉获取cookie的rewrite。（loon是关掉获取cookie的脚本）
 4. 手动跑1次，看看是否能获取到今天签到的金币数。



### 配置文件
```c
Surge:
Rewrite: 小木虫论坛 = type=http-request,pattern=^https?:\/\/mapi.xmcimg.com\/bbs\/memcp.php\?action,script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js,requires-body=false
Tasks: 小木虫论坛 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js,wake-system=true,timeout=600
  
QuanX:
[rewrite]
^https?:\/\/mapi.xmcimg.com\/bbs\/memcp.php\?action url script-request-header https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js
[task]
5 0 * * * https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js, tag=小木虫论坛
  
Loon:
[script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js, timeout=600, tag=小木虫论坛
http-request ^https?:\/\/mapi.xmcimg.com\/bbs\/memcp.php\?action script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/muchong/muchong.js,requires-body=false, tag=小木虫论坛cookie获取
 
[MITM]
hostname = *.xmcimg.com
```

### 内容声明

该`javascript`仅供交流学习使用，禁止用于非法用途和商业用途，请在下载24小时内删除。



