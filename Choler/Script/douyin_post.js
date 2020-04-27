let body = JSON.parse($response.body);
let obj = body.aweme_list;
for (var i = obj.length - 1; i >= 0; i--) {
  if (obj[i].status.reviewed != 1) {
    obj[i].status.reviewed = 1;
    obj[i].video_control.allow_download = true;
  }
  if (obj[i].video.download_addr) {
    let play = obj[i].video.play_addr.url_list;
    obj[i].video.download_addr.url_list = play;
  }
  if (obj[i].video.download_suffix_logo_addr) {
    let download = obj[i].video.download_addr;
    obj[i].video.download_suffix_logo_addr = download;
  }
}
$done({ body: JSON.stringify(body) });