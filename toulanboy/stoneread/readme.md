> 📌 不定期更新各种签到、有趣的脚本，欢迎star🌟

🌧 **6月16日 下午2点 ，下雨天：经过多次测试，非常遗憾地发现石头的参数是每天变化且加密的，只能弃坑。**

### 配置步骤 （请先认真阅读配置，再进行操作）
 1. 根据你当前的软件，配置好srcipt。Tips:由于是远程文件，记得顺便更新文件。
 2. 打开石头读书，点击`签到`。点击签到后，有一个`日历`的页面，建议再次点击`今天的日期`，确保获取成功。
 3. 回到quanx等软件，关掉获取cookie的rewrite。（loon是关掉获取cookie的脚本）



### 配置文件
```c
Surge:
Rewrite: 石头读书 = type=http-request,pattern=^https?:\/\/app.stoneread.com\/api\/apiClient\/index,script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js,requires-body=true
Tasks: 石头读书 = type=cron,cronexp="5 0  * * *",script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js,wake-system=true,timeout=600
  
QuanX:
[rewrite]
^https?:\/\/app.stoneread.com\/api\/apiClient\/index url script-request-body https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js
[task]
5 0 * * * https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js, img-url=https://raw.githubusercontent.com/Orz-3/task/master/stone.png, tag=石头读书
  
Loon:
[script]
cron "5 0 * * *" script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js, timeout=600, tag=石头读书
http-request ^https?:\/\/app.stoneread.com\/api\/apiClient\/index script-path=https://raw.githubusercontent.com/toulanboy/scripts/master/stoneread/stoneread.js,requires-body=true, tag=石头读书cookie获取
 
[MITM]
hostname = *.stoneread.com
```

### 内容声明

该`javascript`仅供交流学习使用，禁止用于非法用途和商业用途，请在下载24小时内删除。

