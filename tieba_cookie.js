if ($request.headers["Cookie"]) {
  var headerTB = $request.headers["Cookie"];
  var cookie = $prefs.setValueForKey(headerTB, "CookieTB");
  if (!cookie) {
    $notify("写入贴吧Cookie失败‼️‼️", "", "请重试");
  } else {
    $notify("写入贴吧Cookie成功🎉", "", "您可以手动禁用此脚本");
    //console.log("京东Cookie : \n" + $prefs.valueForKey("CookieJD"))
  }
} else {
  $notify("写入贴吧Cookie失败‼️‼️", "", "请退出账号, 重复步骤");
}
$done({});
