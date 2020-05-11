let obj = JSON.parse($response.body);
if (obj.data) {
  for (var i = obj.data.length - 1; i >= 0; i--) {
    if (obj.data[i].aweme.video) {
      if (obj.data[i].aweme.status.reviewed != 1) {
        obj.data[i].aweme.status.reviewed = 1;
        obj.data[i].aweme.video_control.allow_download = true;
      }
      if (obj.data[i].aweme.video.download_addr) {
        let play = obj.data[i].aweme.video.play_addr.url_list;
        obj.data[i].aweme.video.download_addr.url_list = play;
      }
      if (obj.data[i].aweme.video.download_suffix_logo_addr) {
        let download = obj.data[i].aweme.video.download_addr;
        obj.data[i].aweme.video.download_suffix_logo_addr = download;
      }
    }
  }
}
$done({ body: JSON.stringify(obj) });