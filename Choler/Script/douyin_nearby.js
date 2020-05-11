let obj = JSON.parse($response.body);
if (obj.aweme_list) {
  for (var i = obj.aweme_list.length - 1; i >= 0; i--) {
    if (obj.aweme_list[i].video) {
      if (obj.aweme_list[i].status.reviewed != 1) {
        obj.aweme_list[i].status.reviewed = 1;
        obj.aweme_list[i].video_control.allow_download = true;
      }
      if (obj.aweme_list[i].video.download_addr) {
        let play = obj.aweme_list[i].video.play_addr.url_list;
        obj.aweme_list[i].video.download_addr.url_list = play;
      }
      if (obj.aweme_list[i].video.download_suffix_logo_addr) {
        let download = obj.aweme_list[i].video.download_addr;
        obj.aweme_list[i].video.download_suffix_logo_addr = download;
      }
    }
  }
}
$done({ body: JSON.stringify(obj) });