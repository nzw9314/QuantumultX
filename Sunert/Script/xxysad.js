/*
小小影视去广告
https:\/\/.*\/getGlobalData
*/


let obj = JSON.parse($response.body);
delete obj.data.adrows
delete obj.data.iOS_adgroups
$done({body: JSON.stringify(obj)});
