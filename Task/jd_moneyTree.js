// 京东摇钱树 ：https://gitee.com/lxk0301/scripts/raw/master/jd_moneyTree2.js
// 现有功能
// 1、收金果
// 2、每日签到（也就是三餐签到）
// 3、分享
// 4、浏览任务
// 5、自动领取浏览后的奖励
// 6、七天签到（连续不间断签到七天）
// cron 1 */3 * * * *
// 圈X,Loon,surge均可使用
const Notice = 2;//设置运行多少次才通知。
const $hammer = (() => {
  const isRequest = "undefined" != typeof $request,
      isSurge = "undefined" != typeof $httpClient,
      isQuanX = "undefined" != typeof $task;

  const log = (...n) => { for (let i in n) console.log(n[i]) };
  const alert = (title, body = "", subtitle = "", link = "") => {
    if (isSurge) return $notification.post(title, subtitle, body, link);
    if (isQuanX) return $notify(title, subtitle, (link && !body ? link : body));
    log("==============📣系统通知📣==============");
    log("title:", title, "subtitle:", subtitle, "body:", body, "link:", link);
  };
  const read = key => {
    if (isSurge) return $persistentStore.read(key);
    if (isQuanX) return $prefs.valueForKey(key);
  };
  const write = (val, key) => {
    if (isSurge) return $persistentStore.write(val, key);
    if (isQuanX) return $prefs.setValueForKey(val, key);
  };
  const request = (method, params, callback) => {
    /**
     *
     * params(<object>): {url: <string>, headers: <object>, body: <string>} | <url string>
     *
     * callback(
     *      error,
     *      <response-body string>?,
     *      {status: <int>, headers: <object>, body: <string>}?
     * )
     *
     */
    let options = {};
    if (typeof params == "string") {
      options.url = params;
    } else {
      options.url = params.url;
      if (typeof params == "object") {
        params.headers && (options.headers = params.headers);
        params.body && (options.body = params.body);
      }
    }
    method = method.toUpperCase();

    const writeRequestErrorLog = function (m, u) {
      return err => {
        log("=== request error -s--");
        log(`${m} ${u}`, err);
        log("=== request error -e--");
      };
    }(method, options.url);

    if (isSurge) {
      const _runner = method == "GET" ? $httpClient.get : $httpClient.post;
      return _runner(options, (error, response, body) => {
        if (error == null || error == "") {
          response.body = body;
          callback("", body, response);
        } else {
          writeRequestErrorLog(error);
          callback(error);
        }
      });
    }
    if (isQuanX) {
      options.method = method;
      $task.fetch(options).then(
          response => {
            response.status = response.statusCode;
            delete response.statusCode;
            callback("", response.body, response);
          },
          reason => {
            writeRequestErrorLog(reason.error);
            callback(reason.error);
          }
      );
    }
  };
  const done = (value = {}) => {
    if (isQuanX) return isRequest ? $done(value) : null;
    if (isSurge) return isRequest ? $done(value) : $done();
  };
  return { isRequest, isSurge, isQuanX, log, alert, read, write, request, done };
})();

//直接用NobyDa的jd cookie
const cookie = $hammer.read('CookieJD');
let treeMsgTime = $hammer.read('treeMsgTime') >= Notice ? 0 : $hammer.read('treeMsgTime') || 0;
const name = '京东摇钱树';
const JD_API_HOST = 'https://ms.jr.jd.com/gw/generic/uc/h5/m';
let userInfo = null, taskInfo = [], message = '', subTitle = '';
let gen = entrance();
gen.next();
async function* entrance() {
  if (!cookie) {
    return $hammer.alert(name, '请先获取cookie\n直接使用NobyDa的京东签到获取');
  }
  yield user_info();
  yield signEveryDay();//每日签到
  yield dayWork();//做任务
  console.log('开始做浏览任务了')
  console.log(`浏览任务列表：：${JSON.stringify(taskInfo)}`);
  for (let task of taskInfo) {
    if (task.mid && task.workStatus === 0) {
      console.log('开始做浏览任务');
      yield setUserLinkStatus(task.mid);
    } else if (task.mid && task.workStatus === 1){
      console.log(`开始领取浏览后的奖励:mid:${task.mid}`);
      let receiveAwardRes = await receiveAward(task.mid);
      console.log(`领取浏览任务奖励成功：${JSON.stringify(receiveAwardRes)}`)
    } else if (task.mid && task.workStatus === 2) {
      console.log('所有的浏览任务都做完了')
    }
  }
  yield harvest(userInfo);//收获
  // console.log(`----${treeMsgTime}`)
  msgControl();
  console.log('任务做完了');
}

function user_info() {
  console.log('初始化摇钱树个人信息');
  const params = {
    "sharePin":"",
    "shareType":1,
    "channelLV":"",
    "source":0,
    "riskDeviceParam":{"eid":"","dt":"","ma":"","im":"","os":"","osv":"","ip":"","apid":"","ia":"","uu":"","cv":"","nt":"","at":"1","fp":"","token":""}
  }
  params.riskDeviceParam = JSON.stringify(params.riskDeviceParam);
  request('login', params).then((res) => {
    console.log(`登录信息:${JSON.stringify(res)}\n`);
    if (res && res.resultCode === 0) {
      console.log('resultCode为0')
      if (res.resultData.data) {
        console.log('res.resultData.data有值')
        userInfo = res.resultData.data;
        if (userInfo.realName) {
          console.log(`助力码sharePin为：：${userInfo.sharePin}`);
          subTitle = `${userInfo.nick}的${userInfo.treeInfo.treeName}`;
          message += `【我的金果数量】${userInfo.treeInfo.fruit}\n`;
          message += `【我的金币数量】${userInfo.treeInfo.coin}\n`;
          message += `【距离${userInfo.treeInfo.level + 1}级摇钱树还差】${userInfo.treeInfo.progressLeft}\n`;
          gen.next();
        } else {
          return $hammer.alert(name, `当前京东账号${userInfo.nick}未实名认证，不可参与此活动`);
          gen.return();
        }
      }
    } else {
      console.log('走了else');
      gen.return();
    }
  });
}

async function dayWork() {
  console.log(`开始做任务userInfo了\n`)
  const data = {
    "source":0,
    "linkMissionIds":["666","667"],
    "LinkMissionIdValues":[7,7],
    "riskDeviceParam":{"eid":"","dt":"","ma":"","im":"","os":"","osv":"","ip":"","apid":"","ia":"","uu":"","cv":"","nt":"","at":"1","fp":"","token":""}
  };
  let response = await request('dayWork', data);
  console.log(`获取任务的信息:${JSON.stringify(response)}\n`)
  let canTask = [];
  taskInfo = [];
  if (response.resultCode === 0) {
    if (response.resultData.code === '200') {
      response.resultData.data.map((item) => {
        if (item.prizeType === 2) {
          canTask.push(item);
        }
        if (item.workType === 7 && item.prizeType === 0) {
          // missionId.push(item.mid);
          taskInfo.push(item);
        }
        // if (item.workType === 7 && item.prizeType === 0) {
        //   missionId2 = item.mid;
        // }
      })
    }
  }
  console.log(`canTask::${JSON.stringify(canTask)}\n`)
  console.log(`浏览任务列表taskInfo::${JSON.stringify(taskInfo)}\n`)
  for (let item of canTask) {
    if (item.workType === 1) {
      //  签到任务
      // let signRes = await sign();
      // console.log(`签到结果:${JSON.stringify(signRes)}`);
      if (item.workStatus === 0) {
        // const data = {"source":2,"workType":1,"opType":2};
        // let signRes = await request('doWork', data);
        let signRes = await sign();
        console.log(`三餐签到结果:${JSON.stringify(signRes)}`);
      } else if (item.workStatus === 2) {
        console.log(`三餐签到任务已经做过`)
      }
    } else if (item.workType === 2) {
      // 分享任务
      if (item.workStatus === 0) {
        // share();
        const data = {"source":0,"workType":2,"opType":1};
        //开始分享
        // let shareRes = await request('doWork', data);
        let shareRes = await share(data);
        console.log(`开始分享的动作:${JSON.stringify(shareRes)}`);
        await sleep(2);
        const b = {"source":0,"workType":2,"opType":2};
        // let shareResJL = await request('doWork', b);
        let shareResJL = await share(b);
        console.log(`领取分享后的奖励:${JSON.stringify(shareResJL)}`)
      } else if (item.workStatus === 2) {
        console.log(`分享任务已经做过`)
      }
    }
  }
  // console.log(`浏览任务列表：：${JSON.stringify(taskInfo)}`);
  // for (let task of taskInfo) {
  //   if (task.mid && task.workStatus === 0) {
  //     await setUserLinkStatus(task.mid);
  //   } else {
  //     console.log('所有的浏览任务都做完了')
  //   }
  // }
  gen.next();
}

function harvest(userInfo) {
  // console.log(`收获的操作:${JSON.stringify(userInfo)}\n`)
  const data = {
    "source": 2,
    "sharePin": "",
    "userId": userInfo.userInfo,
    "userToken": userInfo.userToken
  }
  request('harvest', data).then((res) => {
    console.log(`收获金果:${JSON.stringify(res)}`);
    gen.next();
  })
}
function sign() {
  console.log('开始三餐签到')
  const data = {"source":2,"workType":1,"opType":2};
  return new Promise((rs, rj) => {
    request('doWork', data).then(response => {
      rs(response);
    })
  })
}
function signIndex() {
  const params = {
    "source":0,
    "riskDeviceParam":{"eid":"","dt":"","ma":"","im":"","os":"","osv":"","ip":"","apid":"","ia":"","uu":"","cv":"","nt":"","at":"1","fp":"","token":""}
  }
  return new Promise((rs, rj) => {
    request('signIndex', params).then(response => {
      rs(response);
    })
  })
}
async function signEveryDay() {
  let signIndexRes = await signIndex();
  console.log(`每日签到条件查询:${JSON.stringify(signIndexRes)}`);
  if (signIndexRes.resultCode === 0) {
    if (signIndexRes.resultData && signIndexRes.resultData.data.canSign == 2) {
      console.log('准备每日签到')
      let signOneRes = await signOne(signIndexRes.resultData.data.signDay);
      console.log(`每日签到结果:${JSON.stringify(signOneRes)}`);
    } else {
      console.log('走了signOne的else')
    }
  }
  gen.next();
}
function signOne(signDay) {
  const params = {
    "source":0,
    "signDay": signDay,
    "riskDeviceParam":{"eid":"","dt":"","ma":"","im":"","os":"","osv":"","ip":"","apid":"","ia":"","uu":"","cv":"","nt":"","at":"1","fp":"","token":""}
  }
  return new Promise((rs, rj) => {
    request('signOne', params).then(response => {
      rs(response);
    })
  })
}
// 浏览任务
async function setUserLinkStatus(missionId) {
  let resultCode = 0, code = 200, index = 0;
  do {
    const params = {
      "missionId": missionId,
      "pushStatus": 1,
      "keyValue": index,
      "riskDeviceParam":{"eid":"","dt":"","ma":"","im":"","os":"","osv":"","ip":"","apid":"","ia":"","uu":"","cv":"","nt":"","at":"1","fp":"","token":""}
    }
    let response = await request('setUserLinkStatus', params)
    console.log(`missionId为${missionId}：：第${index + 1}次浏览活动完成: ${JSON.stringify(response)}`);
    resultCode = response.resultCode;
    code = response.resultData.code;
    // if (resultCode === 0) {
    //   let sportRevardResult = await getSportReward();
    //   console.log(`领取遛狗奖励完成: ${JSON.stringify(sportRevardResult)}`);
    // }
    index++;
  } while (index < 7) //不知道结束的条件，目前写死循环7次吧
  console.log('浏览店铺任务结束');
  console.log('开始领取浏览后的奖励');
  let receiveAwardRes = await receiveAward(missionId);
  console.log(`领取浏览任务奖励成功：${JSON.stringify(receiveAwardRes)}`)
  gen.next();
}
// 领取浏览后的奖励
function receiveAward(mid) {
  if (!mid) return
  mid = mid + "";
  const params = {
    "source":0,
    "workType": 7,
    "opType": 2,
    "mid": mid,
    "riskDeviceParam":{"eid":"","dt":"","ma":"","im":"","os":"","osv":"","ip":"","apid":"","ia":"","uu":"","cv":"","nt":"","at":"1","fp":"","token":""}
  }
  return new Promise((rs, rj) => {
    request('doWork', params).then(response => {
      rs(response);
    })
  })
}
function share(data) {
  if (data.opType === 1) {
    console.log(`开始做分享任务\n`)
  } else {
    console.log(`开始做领取分享后的奖励\n`)
  }
  return new Promise((rs, rj) => {
    request('doWork', data).then(response => {
      rs(response);
    })
  })
  // const data = 'reqData={"source":0,"workType":2,"opType":1}';
  // request('doWork', data).then(res => {
  //   console.log(`分享111:${JSON.stringify(res)}`)
  //   setTimeout(() => {
  //     const data2 = 'reqData={"source":0,"workType":2,"opType":2}';
  //     request('doWork', data2).then(res => {
  //       console.log(`分享222:${JSON.stringify(res)}`)
  //     })
  //   }, 2000)
  // })
  // await sleep(3);
}
function msgControl() {
  console.log('控制弹窗');
  console.log(treeMsgTime);
  // console.log(typeof (treeMsgTime));
  treeMsgTime++;
  // console.log(treeMsgTime);
  $hammer.write(`${treeMsgTime}`, 'treeMsgTime');
  console.log(`${$hammer.read('treeMsgTime')}`);
  // console.log(`${typeof (Number($hammer.read('treeMsgTime')))}`)
  // console.log(`${($hammer.read('treeMsgTime') * 1) === Notice}`)
  if (($hammer.read('treeMsgTime') * 1) === Notice) {
    $hammer.alert(name, message, subTitle);
    $hammer.write('0', 'treeMsgTime');
  }
}
//等待一下
function sleep(s) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, s * 1000);
  })
}

async function request(function_id, body = {}) {
  await sleep(2); //歇口气儿, 不然会报操作频繁
  return new Promise((resolve, reject) => {
    $hammer.request('POST', taskurl(function_id,body), (error, response) => {
      if(error){
        $hammer.log("Error:", error);
      }else{
        console.log('response', response)
        resolve(JSON.parse(response));
      }
    })
  })
}

function taskurl(function_id, body) {
  return {
    url: JD_API_HOST + '/' + function_id + '?_=' + new Date().getTime()*1000,
    body: `reqData=${function_id === 'harvest' || function_id === 'login' || function_id === 'signIndex' || function_id === 'signOne' || function_id === 'setUserLinkStatus' || function_id === 'dayWork' ? encodeURIComponent(JSON.stringify(body)) : JSON.stringify(body)}`,
    headers: {
      'Accept' : `application/json`,
      'Origin' : `https://uua.jr.jd.com`,
      'Accept-Encoding' : `gzip, deflate, br`,
      'Cookie' : cookie,
      'Content-Type' : `application/x-www-form-urlencoded;charset=UTF-8`,
      'Host' : `ms.jr.jd.com`,
      'Connection' : `keep-alive`,
      'User-Agent' : `jdapp;iPhone;9.0.0;13.4.1;e35caf0a69be42084e3c97eef56c3af7b0262d01;network/4g;ADID/F75E8AED-CB48-4EAC-A213-E8CE4018F214;supportApplePay/3;hasUPPay/0;pushNoticeIsOpen/1;model/iPhone11,8;addressid/2005183373;hasOCPay/0;appBuild/167237;supportBestPay/0;jdSupportDarkMode/0;pv/1287.19;apprpd/MyJD_GameMain;ref/https%3A%2F%2Fuua.jr.jd.com%2Fuc-fe-wxgrowing%2Fmoneytree%2Findex%2F%3Fchannel%3Dyxhd%26lng%3D113.325843%26lat%3D23.204628%26sid%3D2d98e88cf7d182f60d533476c2ce777w%26un_area%3D19_1601_50258_51885;psq/1;ads/;psn/e35caf0a69be42084e3c97eef56c3af7b0262d01|3485;jdv/0|kong|t_1000170135|tuiguang|notset|1593059927172|1593059927;adk/;app_device/IOS;pap/JA2015_311210|9.0.0|IOS 13.4.1;Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
      'Referer' : `https://uua.jr.jd.com/uc-fe-wxgrowing/moneytree/index/?channel=yxhd&lng=113.325896&lat=23.204600&sid=2d98e88cf7d182f60d533476c2ce777w&un_area=19_1601_50258_51885`,
      'Accept-Language' : `zh-cn`
    }
  }
}