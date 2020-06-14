/**
 * 2020年06月13日
 * 1、监控github仓库的commits和release。
 * 2、监控具体的文件或目录是否有更新。
 * @author: Peng-YM， toulanboy
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/github.js
 * 配置方法：
 * 1. 填写github token, 在github > settings > developer settings > personal access token 里面生成一个新token。
 * 默认TOKEN用的是我自己的，请不要请求过于频繁，每天一两次即可。例如：cron "0 9 * * *"* 2. 配置仓库地址，格式如下：
 * {
 *  name: "",//填写仓库名称，可自定义
 *  file_names:[],//可选参数。若需要监控具体文件或目录。请填写对应的【一级目录】。
 *  url: "" //仓库的url
 * }
 * 📌 如果希望监控某个分支的Commit，请切换到该分支，直接复制URL填入；
 * 📌 如果希望监控Release，请切换至Release界面，直接复制URL填入；
 * 📌 若文件存在某个目录里面，请填写【一级目录】。如 JD-DailyBonus/JD-DailyBonus.js， 那么填写前面的JD-DailyBonus。
 */

const token = "784a03feb07989d3339dfa41c7eb41777436cbfa";

const repositories = [
  {
    name: "NZW9314 脚本",
    url: "https://github.com/nzw9314/QuantumultX/tree/master",
  },
  {
    name: "ClashX",
    url: "https://github.com/yichengchen/clashX/releases",
  },
  {
    name: "Chavy 脚本",
    url: "https://github.com/chavyleung/scripts",
  },
  {
    name: "Qure 图标",
    url: "https://github.com/Koolson/Qure",
  },
  {
    name: "Orz-mini 图标",
    url: "https://github.com/Orz-3/mini",
  },
  {
    name: "yichahucha -- 微博广告",
    file_names: ["wb_ad.js", "wb_launch.js"],
    url: "https://github.com/yichahucha/surge/tree/master",
  },
  {
    name: "NobyDa -- 京豆签到",
    file_names: ["JD-DailyBonus"],
    url: "https://github.com/NobyDa/Script/tree/master",
  },
];

const debug = false;

/******************** 转换器 ********************/
let q=null!=$task,s=null!=$httpClient;var $task=q?$task:{},$httpClient=s?$httpClient:{},$prefs=q?$prefs:{},$persistentStore=s?$persistentStore:{},$notify=q?$notify:{},$notification=s?$notification:{};if(q){var errorInfo={error:""};$httpClient={get:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})},post:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,t.method="POST",$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})}}}s&&($task={fetch:t=>new Promise((r,e)=>{"POST"==t.method?$httpClient.post(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})}):$httpClient.get(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})})})}),q&&($persistentStore={read:t=>$prefs.valueForKey(t),write:(t,r)=>$prefs.setValueForKey(t,r)}),s&&($prefs={valueForKey:t=>$persistentStore.read(t),setValueForKey:(t,r)=>$persistentStore.write(t,r)}),q&&($notification={post:(t,r,e)=>{$notify(t,r,e)}}),s&&($notify=function(t,r,e){$notification.post(t,r,e)});
/******************** 转换器 ********************/

const parser = {
  commits: new RegExp(
    /^https:\/\/github.com\/([\w|-]+)\/([\w|-]+)(\/tree\/([\w|-]+))?$/
  ),
  releases: new RegExp(/^https:\/\/github.com\/([\w|-]+)\/([\w|-]+)\/releases/),
};

const baseURL = "https://api.github.com";

Object.defineProperty(String.prototype, "hashCode", {
  value: function () {
    let hash = 0,
      i,
      chr;
    for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return String(hash);
  },
});

function parseURL(url) {
  try {
    let repo = undefined;
    if (url.indexOf("releases") !== -1) {
      const results = url.match(parser.releases);
      repo = {
        type: "releases",
        owner: results[1],
        repo: results[2],
      };
    } else {
      const results = url.match(parser.commits);
      repo = {
        type: "commits",
        owner: results[1],
        repo: results[2],
        branch: results[3] === undefined ? "HEAD" : results[4],
      };
    }
    if (debug) {
      console.log(repo);
    }
    return repo;
  } catch (error) {
    $notify("Github 监控", "", `❌ URL ${url} 解析错误！`);
    throw error;
  }
}

function needUpdate(url, timestamp) {
  const storedTimestamp = $prefs.valueForKey(url.hashCode());
  if (debug) {
    console.log(`Stored Timestamp for ${url.hashCode()}: ` + storedTimestamp);
  }
  return storedTimestamp === undefined || storedTimestamp !== timestamp
    ? true
    : false;
}

async function checkUpdate(item) {
  const { name, url } = item;
  const headers = {
    Authorization: `token ${token}`,
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36",
  };
  try {
    const repository = parseURL(url);
    if (repository.type === "releases") {
      await $task
        .fetch({
          url: `${baseURL}/repos/${repository.owner}/${repository.repo}/releases`,
          headers,
        })
        .then((response) => {
          const releases = JSON.parse(response.body);
          if (releases.length > 0) {
            // the first one is the latest release
            const release_name = releases[0].name;
            const author = releases[0].author.login;
            const { published_at, body } = releases[0];
            if (needUpdate(url, published_at)) {
              $notify(
                `🎉🎉🎉 [${name}] 新版本发布`,
                `📦 版本: ${release_name}`,
                `⏰ 发布于: ${formatTime(
                  published_at
                )}\n👨🏻‍💻 发布者: ${author}\n📌 更新说明: \n${body}`
              );
              if (!debug) {
                $prefs.setValueForKey(published_at, url.hashCode());
              }
            }
          }
        })
        .catch((e) => {
          console.log(e);
          $done();
        });
    } else {
      const { author, body, published_at, file_url } = await $task
        .fetch({
          url: `${baseURL}/repos/${repository.owner}/${repository.repo}/commits/${repository.branch}`,
          headers,
        })
        .then((response) => {
          const { commit } = JSON.parse(response.body);
          const author = commit.committer.name;
          const body = commit.message;
          const published_at = commit.committer.date;
          const file_url = commit.tree.url;
          return { author, body, published_at, file_url };
        })
        .catch((e) => {
          console.log(e);
          $done();
        });
      if (debug) {
        console.log({ author, body, published_at, file_url });
      }
      //监控仓库是否有更新
      if (!item.hasOwnProperty("file_names")) {
        if (needUpdate(url, published_at)) {
          $notify(
            `🎈🎈🎈 [${name}] 新提交`,
            "",
            `⏰ 提交于: ${formatTime(
              published_at
            )}\n👨🏻‍💻 发布者: ${author}\n📌 更新说明: \n${body}`
          );
          // update stored timestamp
          if (!debug) {
            $prefs.setValueForKey(published_at, url.hashCode());
          }
        }
      }
      //找出具体的文件是否有更新
      else {
        const file_names = item.file_names;
        await $task
          .fetch({
            url: file_url,
            headers,
          })
          .then((response) => {
            const file_detail = JSON.parse(response.body);
            const file_list = file_detail.tree;
            for (let i in file_list) {
              for (let j in file_names) {
                if (file_list[i].path == file_names[j]) {
                  let file_hash = file_list[i].sha;
                  let last_sha = $prefs.valueForKey(
                    (item.name + file_names[j]).hashCode()
                  );
                  if (debug) last_sha = "111";
                  if (file_hash != last_sha) {
                    $notify(`🐬 [${name}]`, "", `📌 ${file_names[j]}有更新`);
                    if (!debug)
                      $prefs.setValueForKey(
                        file_hash,
                        (item.name + file_names[j]).hashCode()
                      );
                  }
                  if (debug) {
                    console.log(
                      `🐬 ${
                        file_names[j]
                      }：\n\tlast sha: ${last_sha}\n\tlatest sha: ${file_hash}\n\t${
                        file_hash == last_sha ? "✅当前已是最新" : "🔅需要更新"
                      }`
                    );
                  }
                }
              }
            }
          })
          .catch((e) => {
            console.log(e);
            $done();
          });
      }
    }
  } catch (e) {
    console.log(`❌ 请求错误: ${e}`);
    return;
  }
  return;
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日${date.getHours()}时`;
}

Promise.all(
  repositories.map(async (item) => await checkUpdate(item))
).then(() => $done());
