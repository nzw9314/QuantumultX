/**
 * 每周Epic游戏限免提醒。
 * @author: Peng-YM
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/epic.js
 * 📌 注意 rsshub.app 需要代理访问，将下面的配置加到分流规则中：
 * 1. QX
 * host, rsshub.app, proxy
 * 2. Loon & Surge
 * domain, rsshub.app, proxy
 */


/******************** 转换器 ********************/
let qx=null!=$task,sg=null!=$httpClient,ln=sg&&null!=typeof $loon;var $task=qx?$task:{},$httpClient=sg?$httpClient:{},$prefs=qx?$prefs:{},$persistentStore=sg?$persistentStore:{},$notify=qx?$notify:{},$notification=sg?$notification:{};if(qx){var errorInfo={error:""};$httpClient={get:(t,o)=>{var r;r="string"==typeof t?{url:t}:t,$task.fetch(r).then(t=>{o(void 0,t,t.body)},t=>{errorInfo.error=t.error,o(errorInfo,response,"")})},post:(t,o)=>{var r;r="string"==typeof t?{url:t}:t,t.method="POST",$task.fetch(r).then(t=>{o(void 0,t,t.body)},t=>{errorInfo.error=t.error,o(errorInfo,response,"")})}}}sg&&($task={fetch:t=>new Promise((o,r)=>{"POST"==t.method?$httpClient.post(t,(t,r,e)=>{r?(r.body=e,o(r,{error:t})):o(null,{error:t})}):$httpClient.get(t,(t,r,e)=>{r?(r.body=e,o(r,{error:t})):o(null,{error:t})})})}),qx&&($persistentStore={read:t=>$prefs.valueForKey(t),write:(t,o)=>$prefs.setValueForKey(t,o)}),sg&&($prefs={valueForKey:t=>$persistentStore.read(t),setValueForKey:(t,o)=>$persistentStore.write(t,o)}),qx&&($notify=(t=>(function(o,r,e,n){t(o,r,e=void 0===n?e:`${e}\n点击链接跳转: ${n}`)}))($notify),$notification={post:(t,o,r,e)=>{$notify(t,o,r=void 0===e?r:`${r}\n点击链接跳转: ${e}`)}}),sg&&!ln&&($notification.post=(t=>(function(o,r,e,n){t(o,r,e=void 0===n?e:`${e}\n点击链接跳转: ${n}`)}))($notification.post),$notify=((t,o,r,e)=>{r=void 0===e?r:`${r}\n点击链接跳转: ${e}`,$notification.post(t,o,r)})),ln&&($notify=((t,o,r,e)=>{$notification.post(t,o,r,e)}));
/******************** 转换器 ********************/

checkUpdate().then(() => $done());

async function checkUpdate() {
  const html = await $task
    .fetch({ url: "https://rsshub.app/epicgames/freegames" })
    .then((resp) => resp.body);
  const itemRegex = new RegExp(/<item>[\s\S]*?<\/item>/g);
  html.match(itemRegex).forEach(async (item) => {
    let name = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)[1];
    let url = item.match(/<link>([\s\S]*?)<\/link>/)[1];
    let time = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)[1];
    let { description, publisher } = await fetchGameInfo(url);
    $notify(
        `🎮 [Epic 限免]  ${name}`,
        `⏰ 发布时间: ${formatTime(time)}`,
        `💡 游戏简介:\n${description}`,
url
    );
  });
}

async function fetchGameInfo(url) {
  const html = await $task.fetch({ url }).then((resp) => resp.body);
  const description = html.match(/"og:description" content="([\s\S]*?)"/)[1];
  const publisher = html.match();
  return {
    description,
    publisher
  };
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}年${
    date.getMonth() + 1
  }月${date.getDate()}日${date.getHours()}时`;
}
