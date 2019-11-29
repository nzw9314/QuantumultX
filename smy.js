var obj = JSON.parse($response.body);
 obj={
 "status": "1000",
 "msg": "请求成功",
 "result": {
  "isvip": "true",
  "romspace": "200",
  "nickname": "大雄脚本组",
  "expiretime": "2099-11-24",
  "registertime": "2019-11-24",
  "ocrtimes": "8",
  "tel": "",
  "openid": "o-mlS1LoIQf9gVWRzJbVnoD27ujE",
  "sessionid": "211CCEE5BD0EC77BA9ACB21A13ED46FA",
  "userid": "196757",
  "token": "fca54885bb27d82844256ccb705c892e0cf7e2d095246e2ef44e6057",
  "password": "",
  "headimg": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573121472669&di=2c11ef9ea7c89c76d14632e9e456c67f&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F170826%2F04451MY6-2.jpg",
  "iosversionid": "false",
  "logintype": "3",
  "state": "1",
  "comment": "true",
  "share": "true",
  "signcount": "0",
  "signstate": "false",
  "message": "登录成功",
  "messagestate": "false",
  "totalocrtimes": "99",
  "checked": 0,
  "cloud_count": "0"
 }
};
$done({body: JSON.stringify(obj)});
//
