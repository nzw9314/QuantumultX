/*
[Script]
^https://[\s\S]*\.googlevideo\.com/.*&(oad|ctier) url script-response-body https://raw.githubusercontent.com/LvGuChuJiu/QuantumultXScripts/master/YouTube
[MITM]
hostname = *.googlevideo.com
*/

var data = {
  body: "{}",
  headers: {
    "Content-Type": "multipart/byteranges"
  }
};
$done({response: data});
