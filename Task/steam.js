/**
 * 查询游戏的中国区Steam价格。
 * @author: Peng-YM
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/steam.js
 * 配置方法：
 * 1. 浏览器打开steam网站：https://store.steampowered.com/，搜索你想添加的游戏。
 * 2. 以GTA5为例，GTA5的STEAM商店链接为：https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/。
 * 3. id中填写271590即可, name中填写名字。
 *
 * 📌 注意 https://steamdb.info 需要直连访问，将下面的配置加到分流规则中：
 * 1. QX
 * host, steamdb.info, direct
 * 2. Loon & Surge
 * domain, steamdb.info, DIRECT
 */
const games = [
  {
    id: 271590,
    name: "GTA V",
  },
  {
    id: 814380,
    name: "只狼：影逝二度"
  },
  {
    id: 292030,
    name: "巫师 3：狂猎"
  }
];

const debug = false;
/******************** 转换器 ********************/
let q=null!=$task,s=null!=$httpClient;var $task=q?$task:{},$httpClient=s?$httpClient:{},$prefs=q?$prefs:{},$persistentStore=s?$persistentStore:{},$notify=q?$notify:{},$notification=s?$notification:{};if(q){var errorInfo={error:""};$httpClient={get:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})},post:(t,r)=>{var e;e="string"==typeof t?{url:t}:t,t.method="POST",$task.fetch(e).then(t=>{r(void 0,t,t.body)},t=>{errorInfo.error=t.error,r(errorInfo,response,"")})}}}s&&($task={fetch:t=>new Promise((r,e)=>{"POST"==t.method?$httpClient.post(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})}):$httpClient.get(t,(t,e,o)=>{e?(e.body=o,r(e,{error:t})):r(null,{error:t})})})}),q&&($persistentStore={read:t=>$prefs.valueForKey(t),write:(t,r)=>$prefs.setValueForKey(t,r)}),s&&($prefs={valueForKey:t=>$persistentStore.read(t),setValueForKey:(t,r)=>$persistentStore.write(t,r)}),q&&($notification={post:(t,r,e)=>{$notify(t,r,e)}}),s&&($notify=function(t,r,e){$notification.post(t,r,e)});
/******************** 转换器 ********************/

Promise.all(games.map(async (item) => check(item))).then(() => $done());

async function check(item) {
  const {id, name} = item;
  if (debug) {
    console.log(`正在检查：${item.id}...`);
  }
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36",
  };
  await $task
    .fetch({ url: `https://steamdb.info/app/${id}/`, headers })
    .then((response) => {
      const html = response.body;
      const prices = getPrice(html);
      const info = getInfo(html);

      $notify(
        `🎮 [Steam 日报] ${name}`,
        `${info.name}`,
        `💰 [价格]:\n📉 历史最低:${prices.lowestPrice}元\n📌 当前价格: ${prices.currentPrice}元\n💡 [基本信息]:\n🎩 发行商: ${info.publisher}\n❤️ 评分: ${info.rating}\n🤖 在线人数: ${info.inGame}`
      );
    });
}

function getPrice(html) {
  try {
    const regexp = new RegExp(
      /<tr class="table-prices-current">([\s\S]+?)<\/tr>/
    );
    const row = html.match(regexp)[1];
    const prices = row.match(/¥ \d+/g);
    const currentPrice = prices[0];
    const lowestPrice = prices[1];
    const discount = row.match(/-\d+%/)[0];
    if (debug) {
      console.log({ currentPrice, lowestPrice, discount });
    }
    return {
      currentPrice,
      lowestPrice,
      discount,
    };
  } catch (e) {
    console.error("❌ 无法获取游戏信息 " + e);
  }
}

function getInfo(html) {
  try {
    const name = html.match(/<td itemprop=\"name\">([\s\S]+?)<\/td>/)[1];
    const publisher = html.match(
      /<span itemprop=\"publisher\">([\s\S]+?)<\/span>/
    )[1];
    const header = Array.from(
      html.matchAll(
        /<div class=\"header-thing-number header-thing-good\">([\s\S]+?)<\/div/g
      ),
      (m) => m[1]
    );
    const rating = header[0];
    const inGame = header[1];
    if (debug) {
      console.log({ name, publisher, rating, inGame });
    }
    return {
      name,
      publisher,
      rating,
      inGame,
    };
  } catch (e) {
    console.error("❌ 无法获取游戏信息 " + e);
  }
}
