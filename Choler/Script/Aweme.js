/*
[Script]
# Surge
http-request ^https:\/\/.*\.amemv\.com\/aweme\/v.*\/(feed|post) script-path=https://Choler.github.io/Surge/Script/Aweme.js
http-response ^https:\/\/.*\.amemv\.com\/aweme\/v.*\/(feed|post) requires-body=true,script-path=https://Choler.github.io/Surge/Script/Aweme.js

#QuanX
^https:\/\/.*\.amemv\.com\/aweme\/v.*\/(feed|post) url script-response-header Aweme.js
^https:\/\/.*\.amemv\.com\/aweme\/v.*\/(feed|post) url script-response-body Aweme.js

[MITM]
hostname = *.amemv.com
*/
 
if (typeof $response != "undefined") {
  var obj = JSON.parse($response.body);
  if (obj.data) {
    for (var i = obj.data.length - 1; i >= 0; i--) {
      if (obj.data[i].aweme.video) {
        obj.data[i].aweme.status.reviewed = 1;
        obj.data[i].aweme.video_control.allow_download = true;
        var play = obj.data[i].aweme.video.play_addr.url_list;
        obj.data[i].aweme.video.download_addr.url_list = play;
        var download = obj.data[i].aweme.video.download_addr;
        if (obj.data[i].aweme.video.download_suffix_logo_addr) {
          obj.data[i].aweme.video.download_suffix_logo_addr = download;
        }
      } else {
        obj.data.aweme.splice(i, 1);
      }
    }
  }
  if (obj.aweme_list) {
    for (var i = obj.aweme_list.length - 1; i >= 0; i--) {
      if (obj.aweme_list[i].video) {
        obj.aweme_list[i].status.reviewed = 1;
        obj.aweme_list[i].video_control.allow_download = true;
        var play = obj.aweme_list[i].video.play_addr.url_list;
        obj.aweme_list[i].video.download_addr.url_list = play;
        var download = obj.aweme_list[i].video.download_addr;
        if (obj.aweme_list[i].video.download_suffix_logo_addr) {
          obj.aweme_list[i].video.download_suffix_logo_addr = download;
        }
        if (obj.aweme_list[i].is_ads != false) {
          obj.aweme_list.splice(i, 1);
        }
      } else {
        obj.aweme_list.splice(i, 1);
      }
    }
  }
  $done({ body: JSON.stringify(obj) });
} else {
  $done({ url: $request.url.replace(/\/v\d\//, "/v1/") });
}
