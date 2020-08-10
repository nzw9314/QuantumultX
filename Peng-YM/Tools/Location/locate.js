/**
自动定位脚本
@author: Peng-YM
更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tools/Location/locate.js
(1). Quantumult X
[MITM]
hostname=weather-data.apple.com, api.weather.com
[rewrite_local]
https:\/\/((weather-data\.apple)|(api.weather))\.com url script-request-header https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/caiyun.js

(2). Loon
[MITM]
hostname=weather-data.apple.com, api.weather.com
[Script]
http-request https:\/\/((weather-data\.apple)|(api.weather))\.com script-path=https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/caiyun.js, require-body=false

(3). Surge
[MITM]
hostname=weather-data.apple.com, api.weather.com
[Script]
type=http-request, pattern=https:\/\/((weather-data\.apple)|(api.weather))\.com, script-path=https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/caiyun.js, require-body=false

即可定时获取当前位置，注意需要安装自带的天气应用。此重写不要禁用。
在脚本中即可通过 "latitude" 和 ”longitude" 这两个字段引用当前的经纬度了。
*/

const url = $request.url;
const res = url.match(/weather\/.*?\/(.*)\/(.*)\?/);
const latitude = res[1];
const longitude = res[2];
// console.log(`当前位置：纬度${latitude}，经度${longitude}`);

// write data
if (typeof $prefs !== 'undefined'){
    // QX
    $prefs.setValueForKey(latitude, "latitude");
    $prefs.setValueForKey(longitude, "longitude");
}else{
    // Loon & Surge
    $persistentStore.write(latitude, "latitude");
    $persistentStore.write(longitude, "longitude");
}

$done();