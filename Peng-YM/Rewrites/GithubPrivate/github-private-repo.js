/**
允许引用Github私有仓库/gist中的订阅分流，重写，脚本等配置文件。❗️目前仅Surge可用
@author: Peng-YM
🛎[配置说明]
0️⃣ 使用Surge模块:
https://raw.githubusercontent.com/Peng-YM/QuanX/master/Rewrites/GithubPrivate/github-private-repo.sgmodule
1️⃣ 登陆Github > 点击头像下拉菜单 > 选择Settings > 左边菜单栏选择最后一个Developer settings > 选择Personal access tokens > Generate new token > Note里面填写token名字 > ☑️下面的勾选框选择第一项repo打钩（所有子项目自动勾选）> 点击Generate token按钮保存并返回。
2️⃣ 在BoxJS里面填入用户名（打开Github，浏览器地址栏应该会显示https://github.com/这里是你的用户名/）和上面的token。
🔘[QX无法使用的说明]
QX下载配置文件的请求不会触发脚本MITM重写。故无法使用。
🔘[Loon无法使用的说明]
Loon目前无法通过脚本修改请求头。故无法使用
*/

// 如果不使用BoxJS配置，可以在这里修改
let config = {
  username: "Peng-YM", // 用户名
  token: "Your token", // token
};

// load user prefs from box
const boxConfig = $persistentStore.read("github_private_repo");
if (boxConfig) {
  config = JSON.parse(boxConfig);
}

// load user prefs from box
const boxConfig = $persistentStore.read("surge_private_repo");
if (boxConfig) {
  config = JSON.parse(boxConfig);
}

const username = $request.url.match(
  /https:\/\/(?:raw|gist)\.githubusercontent\.com\/([^\/]+)\//
)[1];
// rewrite headers for specific user
if (username == config.username) {
  console.log(`ACCESSING PRIVATE REPO: ${$request.url}`);
  $done({ headers: {...$request.headers, Authorization: `token ${config.token}`} });
} else $done({});
