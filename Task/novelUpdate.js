/**
 *  原author: Peng-YM
 *  原项目地址: https://github.com/Peng-YM/QuanX/blob/master/Tasks/zongheng.js#L20
 *  更新数据来源: 优书网
 *  优书网查询书籍后复制id填入id列表，弹窗跳转爱阅书香
 */

// 书籍id列表
const ids = ["169413"];
const alwaysNotice = false; // 设置为true则每次运行通知，否则只通知更新

/********************************* SCRIPT START *******************************************************/
const $ = API("yousuu");

// check update
checkUpdate($.read("books") || {}).finally(() => $.done());

async function checkUpdate(books) {
  await Promise.all(
    ids.map(async (id) => {
      $.log(`Handling book with id: ${id}...`);
      // check update from each book
      const config = {
        url: `https://www.yousuu.com/api/book/${id}`,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36",
        },
      };

      await $.get(config)
        .then((response) => {
          const datas = JSON.parse(response.body);
          // parse json
          const book = {
            title: datas.data.bookInfo.title,
            score: datas.data.bookInfo.score,
            coverURL: datas.data.bookInfo.cover,
            updateTime: getDateDiff(datas.data.bookInfo.updateAt),
            author: datas.data.bookInfo.author,
          };
          
          $.log(book);
          const cachebook = books[id];
          if (
            cachebook === undefined ||
            alwaysNotice ||
            updateTime !== cachebook.updateTime
          ) {
            // upate database
            books[id] = book;
            // push notifications
            $.notify(
              `🎉🎉🎉 《${book.title}》更新`,
              `⏰ 更新时间: ${book.updateTime}`,
              `🎩作者: ${book.author}\n🎈评分: ${book.score}`,
              {
                "open-url": `iFreeTime://bk/a=${encodeURIComponent(book.author)}&n=${encodeURIComponent(book.title)}&d=0`,
                "media-url": book.coverURL,
              }
            );
          }
        })
        .catch((e) => $.error(e));
    })
  );

  // update database
  $.write(books, "books");
}

function getDateDiff(time) {
  time = time.substring(0, 19);
  time = time.replace(/-/g, "/").replace(/T/, " ");
  let timeStamp = new Date(time).getTime();
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let now = new Date().getTime();
  let diff = now - timeStamp;
  if (diff < 0) {
    return;
  }
  let minD = diff / minute;
  let hourD = diff / hour;
  let dayD = diff / day;
  let weekD = diff / (7 * day);
  let monthD = diff / month;
  if (monthD > 1) {
    return `${parseInt(monthD)}月前`;
  } else if (weekD > 1) {
    return `${parseInt(weekD)}周前`;
  } else if (dayD > 1) {
    return `${parseInt(dayD)}天前`;
  } else if (hourD > 1) {
    return `${parseInt(hourD)}小时前`;
  } else if (minD > 1) {
    return `${parseInt(minD)}分钟前`;
  } else return "刚刚更新";
}


/********************************* SCRIPT END *******************************************************/

// prettier-ignore
/*********************************** API *************************************/
function API(t="untitled",e=!1){return new class{constructor(t,e){this.name=t,this.debug=e,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.node=(()=>this.isNode?{request:require("request"),fs:require("fs")}:null)(),this.cache=this.initCache(),this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`),Promise.prototype.delay=function(t){return this.then(function(e){return((t,e)=>new Promise(function(s){setTimeout(s.bind(null,e),t)}))(t,e)})}}get(t){return this.isQX?("string"==typeof t&&(t={url:t,method:"GET"}),$task.fetch(t)):new Promise((e,s)=>{this.isLoon||this.isSurge?$httpClient.get(t,(t,i,o)=>{t?s(t):e({...i,body:o})}):this.node.request(t,(t,i,o)=>{t?s(t):e({...i,status:i.statusCode,body:o})})})}post(t){return this.isQX?("string"==typeof t&&(t={url:t}),t.method="POST",$task.fetch(t)):new Promise((e,s)=>{this.isLoon||this.isSurge?$httpClient.post(t,(t,i,o)=>{t?s(t):e({...i,body:o})}):this.node.request.post(t,(t,i,o)=>{t?s(t):e({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX)return JSON.parse($prefs.valueForKey(this.name)||"{}");if(this.isLoon||this.isSurge)return JSON.parse($persistentStore.read(this.name)||"{}");if(this.isNode){const t=`${this.name}.json`;return this.node.fs.existsSync(t)?JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(t,JSON.stringify({}),{flag:"wx"},t=>console.log(t)),{})}}persistCache(){const t=JSON.stringify(this.cache);this.log(`FLUSHING DATA:\n${t}`),this.isQX&&$prefs.setValueForKey(t,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(t,this.name),this.isNode&&this.node.fs.writeFileSync(`${this.name}.json`,t,{flag:"w"},t=>console.log(t))}write(t,e){this.log(`SET ${e} = ${t}`),this.cache[e]=t,this.persistCache()}read(t){return this.log(`READ ${t} ==> ${this.cache[t]}`),this.cache[t]}delete(t){this.log(`DELETE ${t}`),delete this.cache[t],this.persistCache()}notify(t,e,s,i){const o="string"==typeof i?i:void 0,n=s+(null==o?"":`\n${o}`);this.isQX&&(void 0!==o?$notify(t,e,s,{"open-url":o}):$notify(t,e,s,i)),this.isSurge&&$notification.post(t,e,n),this.isLoon&&$notification.post(t,e,s),this.isNode&&("undefined"==typeof $jsbox?console.log(`${t}\n${e}\n${n}\n\n`):require("push").schedule({title:t,body:e?e+"\n"+s:s}))}log(t){this.debug&&console.log(t)}info(t){console.log(t)}error(t){this.log("ERROR: "+t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){this.log("DONE"),this.isNode||$done(t)}}(t,e)}
/*****************************************************************************/
