/**
 *  @author: Peng-YM
 *  更新地址: https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/zongheng.js
 *  使用方法：进入纵横小说页面，例如<<剑来>>：http://book.zongheng.com/book/672340.html 则id为672340，将id添加到列表即可。
 */

// 书籍id列表
const ids = [408586];
/********************************* CONVERTER START *******************************************************/
// #region 固定头部
let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
  var errorInfo = {
    error: "",
  };
  $httpClient = {
    get: (url, cb) => {
      var urlObj;
      if (typeof url == "string") {
        urlObj = {
          url: url,
        };
      } else {
        urlObj = url;
      }
      $task.fetch(urlObj).then(
        (response) => {
          cb(undefined, response, response.body);
        },
        (reason) => {
          errorInfo.error = reason.error;
          cb(errorInfo, response, "");
        }
      );
    },
    post: (url, cb) => {
      var urlObj;
      if (typeof url == "string") {
        urlObj = {
          url: url,
        };
      } else {
        urlObj = url;
      }
      url.method = "POST";
      $task.fetch(urlObj).then(
        (response) => {
          cb(undefined, response, response.body);
        },
        (reason) => {
          errorInfo.error = reason.error;
          cb(errorInfo, response, "");
        }
      );
    },
  };
}
if (isSurge) {
  $task = {
    fetch: (url) => {
      //为了兼容qx中fetch的写法,所以永不reject
      return new Promise((resolve, reject) => {
        if (url.method == "POST") {
          $httpClient.post(url, (error, response, data) => {
            if (response) {
              response.body = data;
              resolve(response, {
                error: error,
              });
            } else {
              resolve(null, {
                error: error,
              });
            }
          });
        } else {
          $httpClient.get(url, (error, response, data) => {
            if (response) {
              response.body = data;
              resolve(response, {
                error: error,
              });
            } else {
              resolve(null, {
                error: error,
              });
            }
          });
        }
      });
    },
  };
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
  $persistentStore = {
    read: (key) => {
      return $prefs.valueForKey(key);
    },
    write: (val, key) => {
      return $prefs.setValueForKey(val, key);
    },
  };
}
if (isSurge) {
  $prefs = {
    valueForKey: (key) => {
      return $persistentStore.read(key);
    },
    setValueForKey: (val, key) => {
      return $persistentStore.write(val, key);
    },
  };
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
  $notification = {
    post: (title, subTitle, detail) => {
      $notify(title, subTitle, detail);
    },
  };
}
if (isSurge) {
  $notify = function (title, subTitle, detail) {
    $notification.post(title, subTitle, detail);
  };
}
// #endregion
/********************************* CONVERTER END *******************************************************/

/********************************* SCRIPT START *******************************************************/
const DB_KEY = "zongheng_books";
const parsers = {
  title: new RegExp(/bookname=(\S+)/, "i"),
  latestChapter: new RegExp(/class="tit"><a[^>]*>([^<]*)/, "i"),
  updateCount: new RegExp(/(今日更新[\d]+章)/, "i"),
};
// load books from database
let books = $prefs.valueForKey(DB_KEY);
if (books === "" || books === undefined) {
  books = {};
} else {
  books = JSON.parse(books);
}
// check update
checkUpdate(books);

async function checkUpdate(books) {
  await Promise.all(
    ids.map(async (id) => {
      // check update from each book
      let config = {
        url: `http://book.zongheng.com/book/${id}.html`,
headers: {
"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36"
}
      };

      await $task
        .fetch(config)
        .then((response) => {
          html = response.body;
          // parse html
          title = html.match(parsers.title)[1];
          updateCount = html.match(parsers.updateCount)[1];
          latestChapter = html.match(parsers.latestChapter)[1];

          //console.log(`title: ${title}, latest chapter: ${latestChapter}, ${updateCount}`);

          book = books[id];
          if (book === undefined || latestChapter !== book.latestChapter) {
            // upate database
            books[id] = { title, updateCount, latestChapter };
            // push notifications
            $notify(title, "", `最新章节: ${latestChapter}\n${updateCount}`);
          }
          return Promise.resolve();
        })
        .catch((e) => console.log(e));
    })
  );

  // update database
  $prefs.setValueForKey(JSON.stringify(books), DB_KEY);
}

$done();
/********************************* SCRIPT END *******************************************************/
