/*
[Script]
http-request ^https:\/\/.*\.amemv\.com\/aweme\/v.*\/(feed|post) script-path=https://Choler.github.io/Surge/Script/Aweme.js
http-response ^https:\/\/.*\.amemv\.com\/aweme\/v.*\/(feed|post) requires-body=true,script-path=https://Choler.github.io/Surge/Script/Aweme.js

[MITM]
hostname = *.amemv.com
*/

if (typeof $response != "undefined") {
  response();
} else {
  request();
}

function request() {
  $done({ url: $request.url.replace(/\/v\d\//, "/v1/") });
}

function response() {
  var re = /\u0026watermark=1/g;
  var obj = JSON.parse($response.body);
  if (obj.aweme_list) {
    for (var i = obj.aweme_list.length - 1; i >= 0; i--) {
      obj.aweme_list[i].status.reviewed = 1;
      obj.aweme_list[i].video_control.allow_download = true;
      obj.aweme_list[i].video_control.allow_dynamic_wallpaper = true;
      if (obj.aweme_list[i].is_ads != false) {
        obj.aweme_list.splice(i, 1);
      }
    }
  }
  if (obj.data) {
    for (var i = obj.data.length - 1; i >= 0; i--) {
        obj.data[i].aweme.status.reviewed = 1;
        obj.data[i].aweme.video_control.allow_download = true;
        obj.data[i].aweme.video_control.allow_dynamic_wallpaper = true;
    }
  }
  $done({ body: JSON.stringify(obj).replace(re, "") });
}