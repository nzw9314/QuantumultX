/**********
  
  👨‍💻功能描述
  1、支持监控某仓库是否有新release。（有更新才弹窗）
  2、支持监控某仓库的指定文件是否有更新。（有更新才弹窗）

  🐬主要作者：Peng-YM   （负责：API获取、整体仓库监控、多平台支持 等主要内容）
  📕地址：https://github.com/Peng-YM/QuanX

  🐬次要作者: toulanboy （负责：具体文件监控）
  📕地址：https://github.com/toulanboy/scripts
  
  📌不定期更新各种签到、有趣的脚本，欢迎star🌟

  Quanx、loon等配置方法：
  1、由于要修改内容，建议下载会本地，使用本地js。
  2、自己设置cron即可。


  文件配置方法：
  1. 建议自行申请token在github > settings > developer settings > personal access token 里面生成一个新token。
  2、默认TOKEN用的是@Peng-YM的，请不要请求过于频繁，每天一两次即可。例如：cron "0 9 * * *"
  3、配置仓库地址的格式如下：
  {
    name: "",     //填写仓库名称，可自定义
    file_names:[],//可选参数。若需要监控具体文件或目录，请填写路径（具体看下面示例）。
    url: ""       //仓库的url
  }
  📌 如果希望监控某个分支的Commit，请切换到该分支，直接复制URL填入；
  📌 如果希望监控Release，请切换至Release界面，直接复制URL填入；
 */

const token = "784a03feb07989d3339dfa41c7eb41777436cbfa";

//🌟🌟🌟监控仓库样例，请修改成你的需求🌟🌟🌟
const repositories = [
  {
    name: "ClashX",
    url: "https://github.com/yichengchen/clashX/releases",//模板🌟, 监控release
  },
  {
    name: "Chavy 脚本",
    file_names:["wps"],//路径模板🌟, 监控wps目录
    url: "https://github.com/chavyleung/scripts",
  },
  {
    name: "Qure 图标",
    url: "https://github.com/Koolson/Qure",//模板🌟, 监控整个仓库
  },
  {
    name: "yichahucha -- 微博广告",
    file_names: ["wb_ad.js", "wb_launch.js"],//路径模板🌟， 监控指定文件
    url: "https://github.com/yichahucha/surge/tree/master",
  },
  {
    name: "NobyDa",
    file_names: ["JD-DailyBonus/JD_DailyBonus.js", "52pojie-DailyBonus"],//路径模板🌟， 监控某目录下的文件 或者 监控指定目录
    url: "https://github.com/NobyDa/Script/tree/master",
  }
];

const $ = API("github", false);

const parser = {
  commits: new RegExp(
    /^https:\/\/github.com\/([\w|-]+)\/([\w|-]+)(\/tree\/([\w|-]+))?$/
  ),
  releases: new RegExp(/^https:\/\/github.com\/([\w|-]+)\/([\w|-]+)\/releases/),
};
const headers = {
  Authorization: `token ${token}`,
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36",
};
function hash(str) {
  let h = 0,
      i,
      chr;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      h = (h << 5) - h + chr;
      h |= 0; // Convert to 32bit integer
    }
    return String(h);
}
function parserPath(path) {
  // console.log(path.split('/'))

  if (path.match(/\//) == undefined) {
    result = []
    result.push(path)
    // console.log(result)
    return result
  }
  return path.split('/')
}
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
    $.log(repo);
    return repo;
  } catch (error) {
    $.notify("Github 监控", "", `❌ URL ${url} 解析错误！`);
    throw error;
  }
}

function needUpdate(url, timestamp) {
  const storedTimestamp = $.read(hash(url));
  $.log(`Stored Timestamp for ${hash(url)}: ` + storedTimestamp);
  return storedTimestamp === undefined || storedTimestamp !== timestamp
    ? true
    : false;
}

async function checkUpdate(item) {
  const baseURL = "https://api.github.com";
  const { name, url } = item;
  try {
    const repository = parseURL(url);
    if (repository.type === "releases") {
      await $.get({
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
            const notificationURL = {
              "open-url": `https://github.com/${repository.owner}/${repository.repo}/releases`,
              "media-url": `https://raw.githubusercontent.com/Orz-3/task/master/github.png`
            }
            if (needUpdate(url, published_at)) {
              $.notify(
                `🎉🎉🎉 [${name}] 新版本发布`,
                `📦 版本: ${release_name}`,
                `⏰ 发布于: ${formatTime(
                  published_at
                )}\n👨🏻‍💻 发布者: ${author}\n📌 更新说明: \n${body}`,
                notificationURL
              );
              $.write(published_at, hash(url));
            }
          }
        })
        .catch((e) => {
          $.error(e);
        });
    } else {
      const { author, body, published_at, file_url } = await $.get({
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
          $.error(e);
        });
      $.log({ author, body, published_at, file_url });
      const notificationURL = {
        "open-url": `https://github.com/${repository.owner}/${repository.repo}/commits/${repository.branch}`,
        "media-url": `https://raw.githubusercontent.com/Orz-3/task/master/github.png`
      }
      //监控仓库是否有更新
      if (!item.hasOwnProperty("file_names")) {
        if (needUpdate(url, published_at)) {
          $.notify(
            `🎈🎈🎈 [${name}] 新提交`,
            "",
            `⏰ 提交于: ${formatTime(
              published_at
            )}\n👨🏻‍💻 发布者: ${author}\n📌 更新说明: \n${body}`,
            notificationURL
          );
          // update stored timestamp
          $.write(published_at, hash(url));
        }
      }
      //找出具体的文件是否有更新
      else {
        const file_names = item.file_names;
        for (let i in file_names) {
          
          paths = parserPath(file_names[i])
          $.log(paths)
          await findFile(name, file_url, paths, 0, url)
        }
      }
    }
  } catch (e) {
    $.error(`❌ 请求错误: ${e}`);
    return;
  }
  return;
}
function findFile(name, tree_url, paths, current_pos, jump_url) {
  
  if (current_pos == paths.length) {
    $.notify(`🐬 [${name}]`, "", `🚫 仓库中没有该文件：${paths[paths.length-1]}`);
  }
  $.get({
    url: tree_url,
    headers
  }).then((response) => {
      const file_detail = JSON.parse(response.body);
      // console.log(file_detail)
      const file_list = file_detail.tree;
      isFind = false;
      for (let i in file_list) {
        if (file_list[i].path == paths[current_pos]) {

          fileType = file_list[i].type
          isDir = paths[current_pos].match(/\.(js|py|cpp|c|cpp|html|css|jar|png|jpg|bmp|exe)/) == null ? true : false;
          $.log(`🔍正在判断：${paths[current_pos]} is a ${isDir?"directory":"file"}`)
          if (current_pos == paths.length - 1 && fileType == 'blob' && !isDir) {
            isFind = true;
            let file_hash = file_list[i].sha;
            let last_sha = $.read(hash(name + paths[current_pos]));
            if (file_hash != last_sha) {
              $.notify(`🐬 [${name}]`, "", `📌 ${paths[current_pos]}有更新`,jump_url);
              $.write(file_hash, hash(name + paths[current_pos]));
            }
            $.log(
              `🐬 ${paths[current_pos]}：\n\tlast sha: ${last_sha}\n\tlatest sha: ${file_hash}\n\t${file_hash == last_sha ? "✅当前已是最新" : "🔅需要更新"}`
            );
          }
          else if (current_pos == paths.length - 1 && fileType == 'tree' && isDir) {
            isFind = true;
            let file_hash = file_list[i].sha;
            let last_sha = $.read(hash(name + paths[current_pos]));
            if (file_hash != last_sha) {
              $.notify(`🐬 [${name}]`, "", `📌 ${paths[current_pos]}有更新`, jump_url);
              $.write(file_hash, hash(name + paths[current_pos]));
            }
            $.log(
              `🐬 ${paths[current_pos]}：\n\tlast sha: ${last_sha}\n\tlatest sha: ${file_hash}\n\t${file_hash == last_sha ? "✅当前已是最新" : "🔅需要更新"}`
            );
          } else if (fileType == 'tree') {
            isFind = true;
            tree_url = file_list[i].url
            findFile(name, tree_url, paths, current_pos + 1, jump_url)
          }
        }

      }
      if (isFind == false) {
        $.notify(`🐬 [${name}]`, "", `🚫 仓库中没有该文件：${paths[paths.length-1]}\n🚫 请检查你的路径是否填写正确`);
      }
    },
    (error) => {
      console.log(error)
    })
}
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日${date.getHours()}时`;
}

Promise.all(
  repositories.map(async (item) => await checkUpdate(item))
).finally(() => $.done());

// prettier-ignore
/*********************************** API *************************************/
function API(t="untitled",e=!1){return new class{constructor(t,e){this.name=t,this.debug=e,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.node=(()=>this.isNode?{request:require("request"),fs:require("fs")}:null)(),this.cache=this.initCache(),this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`),Promise.prototype.delay=function(t){return this.then(function(e){return((t,e)=>new Promise(function(s){setTimeout(s.bind(null,e),t)}))(t,e)})}}get(t){return this.isQX?("string"==typeof t&&(t={url:t,method:"GET"}),$task.fetch(t)):new Promise((e,s)=>{this.isLoon||this.isSurge?$httpClient.get(t,(t,i,o)=>{t?s(t):e({...i,body:o})}):this.node.request(t,(t,i,o)=>{t?s(t):e({...i,status:i.statusCode,body:o})})})}post(t){return this.isQX?("string"==typeof t&&(t={url:t}),t.method="POST",$task.fetch(t)):new Promise((e,s)=>{this.isLoon||this.isSurge?$httpClient.post(t,(t,i,o)=>{t?s(t):e({...i,body:o})}):this.node.request.post(t,(t,i,o)=>{t?s(t):e({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX)return JSON.parse($prefs.valueForKey(this.name)||"{}");if(this.isLoon||this.isSurge)return JSON.parse($persistentStore.read(this.name)||"{}");if(this.isNode){const t=`${this.name}.json`;return this.node.fs.existsSync(t)?JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(t,JSON.stringify({}),{flag:"wx"},t=>console.log(t)),{})}}persistCache(){const t=JSON.stringify(this.cache);this.log(`FLUSHING DATA:\n${t}`),this.isQX&&$prefs.setValueForKey(t,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(t,this.name),this.isNode&&this.node.fs.writeFileSync(`${this.name}.json`,t,{flag:"w"},t=>console.log(t))}write(t,e){this.log(`SET ${e} = ${t}`),this.cache[e]=t,this.persistCache()}read(t){return this.log(`READ ${t} ==> ${this.cache[t]}`),this.cache[t]}delete(t){this.log(`DELETE ${t}`),delete this.cache[t],this.persistCache()}notify(t,e,s,i){const o="string"==typeof i?i:void 0,n=s+(null==o?"":`\n${o}`);this.isQX&&(void 0!==o?$notify(t,e,s,{"open-url":o}):$notify(t,e,s,i)),this.isSurge&&$notification.post(t,e,n),this.isLoon&&$notification.post(t,e,s),this.isNode&&("undefined"==typeof $jsbox?console.log(`${t}\n${e}\n${n}\n\n`):require("push").schedule({title:t,body:e?e+"\n"+s:s}))}log(t){this.debug&&console.log(t)}info(t){console.log(t)}error(t){this.log("ERROR: "+t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){this.log("DONE"),this.isNode||$done(t)}}(t,e)}
/*****************************************************************************/
