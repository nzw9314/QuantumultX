/*
name: yuba sign
auth: pq
Create At 2020-02-05

USAGE：
1. 关闭QX[close qx]
2. 打开https://yuba.douyu.com/homepage/hotwbs并登陆[open url and login]
3. 打开QX，刷新页面，提示[获取鱼吧关注列表]。[open qx, refresh page]
[task_local]
1 0 * * * path/yubaSign.js
[rewrite_local]
^https://yuba.douyu.com/wbapi/web/group/myFollow url script-request-header own/myQx/js/yubaSign.js
MIMT = yuba.douyu.com
*/

// common func
const commonFunc = {
  isRequest: () => {
    return typeof $request != "undefined";
  },
  getUrl: () => {
    return $request.url;
  },
  setData: (key, value) => {
    $prefs.setValueForKey(value, key);
  },
  getData: key => {
    return $prefs.valueForKey(key);
  },
  notify: (titile, subTitle = "", content = "") => {
    $notify(titile, subTitle, content);
  },
  done: () => {
    typeof $request != "undefined" ? $done({}) : "";
  }
};

// main func
class DouYu {
  constructor(limit) {
    this.limit = limit;
  }
  config() {
    return {
      cookieName: "CookieDY",
      groupName: "GroupDY",
      needUrl: {
        // 登录后获取cookie
        cookieUrl: "https://yuba.douyu.com/wbapi/web/group/myFollow",
        // 关注鱼吧列表
        followRoomUrl: `https://yuba.douyu.com/wbapi/web/group/myFollow?page=1&limit=${
          this.limit
        }&timestamp=${Math.random()}`,
        // 签到
        signUrl: `https://yuba.douyu.com/ybapi/topic/sign?timestamp=${Math.random()}`
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
        referer: "https://yuba.https://yuba.douyu.com/homepage/group.com",
        origin: "https://yuba.douyu.com"
      },
      expectData: {
        status_code: 200,
        message: ""
      }
    };
  }
  getCsrf(str) {
    const regex = /acf_yb_t=(.*?);/gm;
    const csrf = regex.exec(str);
    return csrf.length > 1 ? csrf[1] : "";
  }
  getCookie() {
    const { needUrl, cookieName } = this.config();
    if (commonFunc.getUrl().match(needUrl.cookieUrl)) {
      console.log($request.headers["Cookie"]);
      commonFunc.setData(cookieName, $request.headers["Cookie"]);
      this.getFollowYuBa();
    }
  }
  getFollowYuBa() {
    const {
      headers,
      cookieName,
      groupName,
      needUrl,
      expectData
    } = this.config();
    headers["Cookie"] = commonFunc.getData(cookieName);
    const params = {
      url: needUrl.followRoomUrl,
      method: "GET",
      headers,
      body: ""
    };
    $task.fetch(params).then(
      response => {
        const res = JSON.parse(response.body);
        const { status_code, message, data } = res;
        if (
          parseInt(status_code) === expectData["status_code"] &&
          message == expectData["message"]
        ) {
          let content = "";
          let groupList = [];
          for (const yuba of data["list"]) {
            groupList.push({
              group_id: yuba.group_id,
              group_name: yuba.group_name
            });
            content += `[${yuba.group_name}](${yuba.group_id})\n`;
          }
          commonFunc.notify("获取鱼吧关注列表", "成功", content);
          commonFunc.setData(
            groupName,
            JSON.stringify({
              groupList
            })
          );
        } else {
          commonFunc.notify("获取鱼吧关注列表", "失败", message);
        }
      },
      reason => {
        console.log(reason);
        commonFunc.notify("获取鱼吧关注列表", "失败", err);
      }
    );
  }
  sign() {
    const {
      headers,
      groupName,
      cookieName,
      needUrl,
      expectData
    } = this.config();
    const cookie = commonFunc.getData(cookieName);
    headers["Cookie"] = cookie;
    headers["x-csrf-token"] = this.getCsrf(cookie);
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    const groupList = JSON.parse(commonFunc.getData(groupName))["groupList"];
    const params = {
      url: needUrl.signUrl,
      method: "POST",
      headers
    };
    let content = "";
    for (const groupItem of groupList) {
      const group_id = groupItem["group_id"];
      params["headers"]["referer"] = "https://yuba.douyu.com/group/" + group_id;
      params["body"] = `group_id=${group_id}&cur_exp=10000`;
      $task.fetch(params).then(
        response => {
          const res = JSON.parse(response.body);
          console.log(res)
          const { status_code, message, data } = res;
          if (
            parseInt(status_code) === expectData["status_code"] &&
            message == expectData["message"]
          ) {
            content += `${groupItem["group_name"]}[Lv${data["level"]}]
            (${data["levelScore"]}/${data["exp"]})[${data["count"]}天]\n`;
          } else {
            console.log(message)
            content += `${groupItem["group_name"]}[签到失败], ${message}\n`;
          }
        },
        reason => {
          content += `${groupItem["group_name"]}[网络请求失败]\n`;
        }
      );
    }
    setTimeout(() => {
      commonFunc.notify("鱼吧签到", "", content);
    }, 1500)
  }
}
const start = () => {
  const douyu = new DouYu(20);
  if (commonFunc.isRequest()) {
    console.log("get cookie");
    douyu.getCookie();
  } else {
    console.log("sign");
    douyu.sign();
  }
  commonFunc.done();
};
start();
