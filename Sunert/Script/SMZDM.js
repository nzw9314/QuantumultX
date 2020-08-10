let body = JSON.parse($response.body);
if (body.data.hasOwnProperty('banner')) {
  delete body.data.banner.big_banner;
  delete body.data.banner.tonglan_banner;
  delete body.data.banner.calendar_banner;
}
if (body.data.hasOwnProperty('big_banner')) {
  delete body.data.big_banner;
}
if (body.data.hasOwnProperty('notice')) {
  delete body.data.notice;
}
body.data.rows = body.data.rows.filter(function(item) {
  if (item.article_channel_id == -1 || item.model_type == "ads") {
    return false;
  }
  return true;
});
$done({
  body: JSON.stringify(body)
})
