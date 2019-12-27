var KEY = $prefs.valueForKey("CookieWY");

var pc = "http://music.163.com/api/point/dailyTask?type=1";
var mobile = "http://music.163.com/api/point/dailyTask?type=0";


//$notify(KEY);

function sign() {
  var urlmobile = {
    url: mobile,
    method: "POST",
    headers: {
      Cookie: KEY
    }
  };

  $task.fetch(urlmobile).then(
    response => {
      log("网易云音乐(ios端)", response.body);
    },
    reason => {}
  );

  var urlpc = {
    url: mobile,
    method: "POST",
    headers: {
      Cookie: KEY
    }
  };

  $task.fetch(urlpc).then(
    response => {
      log("网易云音乐(PC端)", response.body);
    },
    reason => {}
  );
}

function log(title, data) {
  let result = JSON.parse(data);
  if (result.code == 200) {
     $notify(`签到成功: ${title}`);
  } else {
   $notify(
      `签到失败: ${title}`, `错误编码: ${result.code}`, `错误原因: ${result.msg}`
    );
  }
}

sign()
