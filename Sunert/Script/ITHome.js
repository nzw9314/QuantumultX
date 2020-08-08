/**
 * @supported 
 */

function indexAD(obj) {
  // 去除 IT 之家首页滚动板块广告
  let del_num = [];
  for (item of obj) {
    if (item["isad"]) {
      del_num.unshift(obj.indexOf(item));
    }
  }
  for (n of del_num) {
    obj.splice(n, 1);
  }
  return obj;
}

function newslistAD(obj) {
  // 去除 IT 之家新闻列表广告
  let data = obj["newslist"];
  let del_num = [];
  for (item of data) {
    if ("aid" in item) {
      del_num.unshift(data.indexOf(item));
    }
  }
  for (n of del_num) {
    data.splice(n, 1);
  }
  obj["newslist"] = data;
  return obj;
}

let obj = JSON.parse($response.body);
if (obj["newslist"] == undefined) {
  $done({ body: JSON.stringify(indexAD(obj)) });
} else {
  $done({ body: JSON.stringify(newslistAD(obj)) });
}