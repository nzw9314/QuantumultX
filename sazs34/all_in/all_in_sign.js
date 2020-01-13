const global = {
    log: 1, //日志模式:0不显示 1全部显示 2精简显示,推荐值:1
    sign: { //用于设置哪些需要进行签到,哪些不处理
        baidu_tieba: true,
        iqiyi: true,
        _52pojie: true,
        netease_music: true,
        v2ex: true,
        weibo_super: true,
        china_telecom: true
    },
    data: {
        weibo_super: [
     ["IU", "100808d4151ccebfbae55e8f7c0f68f6d18e4d"],
     ["SWITCH", "1008084239f063a3d4fb9d38a0182be6e39e76"],
     ["林允儿", "1008080c5fb650788fe5c7577f0b6ec4a34038"],
     ["泰妍", "100808377e60b6bf5ffc9cdc603cc93b75c663"],
     ["Apple", "1008089f6290f4436e5a2351f12e03b6433c3c"],
     ["周杰伦", "1008087a8941058aaf4df5147042ce104568da"],
     ["Lisa", "1008084b3f3945e087a0dd32f56c3603b7d153"],

        ],
        china_telecom: '' //此处输入要签到的手机号码
    }
}
//#region 签到配置,请勿修改
const config = {
    baidu_tieba: {
        cookie: 'CookieTB',
        name: '百度贴吧',
        provider: {
            list: {
                url: "https://tieba.baidu.com/mo/q/newmoindex",
                headers: {
                    "Content-Type": "application/octet-stream",
                    Referer: "https://tieba.baidu.com/index/tbwise/forum",
                    Cookie: '',
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366"
                }
            },
            sign: {
                url: "https://tieba.baidu.com/sign/add",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Cookie: '',
                    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14B100 UCBrowser/10.7.5.650 Mobile"
                },
                body: ""
            }
        },
        data: {
            total: 0,
            progress: 0,
            result: [],
            notify: ''
        }
    },
    iqiyi: {
        cookie: 'CookieQY',
        name: '爱奇艺',
        provider: {
            url: 'https://tc.vip.iqiyi.com/taskCenter/task/queryUserTask?autoSign=yes&P00001='
        },
        data: {
            notify: ''
        }
    },
    _52pojie: {
        cookie: 'CookieWA',
        name: '吾爱破解',
        provider: {
            url: `https://www.52pojie.cn/home.php?mod=task&do=apply&id=2&mobile=no`,
            headers: {
                Cookie: ''
            }
        },
        data: {
            notify: ''
        }
    },
    netease_music: {
        cookie: 'CookieWY',
        name: '网易云音乐',
        provider: {
            app: {
                url: `http://music.163.com/api/point/dailyTask?type=0`,
                headers: {
                    Cookie: ''
                }
            },
            pc: {
                url: `http://music.163.com/api/point/dailyTask?type=1`,
                headers: {
                    Cookie: ''
                }
            }
        },
        data: {
            app: '',
            pc: '',
            notify: ''
        }
    },
    v2ex: {
        cookie: 'CookieV2ex',
        name: 'V2EX',
        provider: {
            check: {
                url: `https://www.v2ex.com/mission/daily`,
                method: 'GET',
                headers: {
                    Cookie: ''
                }
            },
            sign: {
                url: `https://www.v2ex.com/mission/daily/redeem?once=`,
                method: 'GET',
                headers: {
                    Cookie: ''
                }
            }
        },
        data: {
            notify: ''
        }
    },
    weibo_super: {
        cookie: 'super_cookie',
        name: '微博超话',
        provider: {
            url: '',
            headers: {
                Cookie: ''
            }
        },
        data: {
            notify: '',
            result: []
        }
    },
    china_telecom: {
        cookie: 'cookie.10000',
        name: '中国电信',
        provider: {
            url: 'https://wapside.189.cn:9001/api/home/sign',
            method: 'POST',
            headers: {
                "Content-Type": `application/json;charset=utf-8`,
                "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;7.6.0;iOS;13.3;iPhone XR`,
                "Host": `wapside.189.cn:9001`,
                "Origin": `https://wapside.189.cn:9001`,
                "Referer": `https://wapside.189.cn:9001/resources/dist/signInActivity.html?cmpid=jt-khd-my-zygn&ticket=0ab000281b4a8139f264620ae1d8b1ce067a6587921f90a6260dca4389a4e01a&version=7.6.0`,
                Cookie: ''
            },
            body: JSON.stringify({
                phone: global.data.china_telecom
            })
        },
        data: {
            notify: ''
        }
    }
}
//#endregion

//#region SMARTJS 用于兼容QuantumultX和Surge
/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最[前面]追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
    您也可直接在tg中联系@wechatu
*/
// #region 固定头部
let isQuantumultX = $task !== undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient !== undefined; //判断当前运行环境是否是surge
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
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            //为了兼容qx中fetch的写法,所以永不reject
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
// #endregion
//#endregion

//#region 百度贴吧

function sign_baidu_tieba() {
    try {
        if (!global.sign.baidu_tieba) {
            record(`[${config.baidu_tieba.name}]未开启签到`);
            return;
        }
        let cookieVal = $prefs.valueForKey(config.baidu_tieba.cookie);
        let process = config.baidu_tieba.data;
        let checkIsAllProcessed = () => {
            if (process.total > process.result.length) return;
            let totalNotify = `[${config.baidu_tieba.name}]签到结果`;
            for (const res of process.result) {
                if (res.errorCode == -1) {
                    totalNotify += `
[${res.bar}] 已经签到，当前等级${res.level},经验${res.exp}`;
                } else {
                    totalNotify += `
[${res.bar}] ${res.errorCode==0?'签到成功':'签到失败'}，${res.errorCode==0?res.errorMsg:('原因：'+res.errorMsg)}`;
                }
            }
            record(totalNotify);

            process.notify = `[${config.baidu_tieba.name}] 总签${process.result.length}个,成功${process.result.filter(it=>{return it.errorCode==-1||it.errorCode==0}).length}个,失败${process.result.filter(it=>{return it.errorCode>=1}).length}个`
            finalNotify("baidu_tieba");
        }
        let signBars = (bars, tbs, index) => {
            if (index >= bars.length) {
                checkIsAllProcessed();
            } else {
                let bar = bars[index];
                if (bar.is_sign == 1) {
                    process.result.push({
                        bar: `${bar.forum_name}`,
                        level: bar.user_level,
                        exp: bar.user_exp,
                        errorCode: -1,
                        errorMsg: "已签到"
                    });
                    signBars(bars, tbs, ++index);
                } else {
                    config.baidu_tieba.provider.sign.body = `tbs=${tbs}&kw=${bar.forum_name}&ie=utf-8`;
                    config.baidu_tieba.provider.sign.headers.Cookie = cookieVal;
                    $task.fetch(config.baidu_tieba.provider.sign).then(response => {
                        try {
                            var addResult = JSON.parse(response.body);
                            if (addResult.no == 0) {
                                process.result.push({
                                    bar: bar.forum_name,
                                    errorCode: 0,
                                    errorMsg: `获得${addResult.data.uinfo.cont_sign_num}积分,第${addResult.data.uinfo.user_sign_rank}个签到`
                                });
                            } else {
                                process.result.push({
                                    bar: bar.forum_name,
                                    errorCode: addResult.no,
                                    errorMsg: addResult.error
                                });
                            }
                        } catch (e) {
                            process.result.push({
                                bar: bar.forum_name,
                                errorCode: 998,
                                errorMsg: '不应存在的错误'
                            })
                        }
                        signBars(bars, tbs, ++index);
                    }, reason => {
                        process.result.push({
                            bar: bar.forum_name,
                            errorCode: 999,
                            errorMsg: '接口错误'
                        });
                        signBars(bars, tbs, ++index);
                    });
                }
            }
        }
        let getList = () => {
            if (!cookieVal) {
                process.notify = `[${config.baidu_tieba.name}] 未获取到Cookie⚠️`;
                record(process.notify);
                finalNotify("baidu_tieba");
            } else {
                config.baidu_tieba.provider.list.headers.Cookie = cookieVal;
                $task.fetch(config.baidu_tieba.provider.list).then(response => {
                    var body = JSON.parse(response.body);
                    var isSuccessResponse = body && body.no == 0 && body.error == "success" && body.data.tbs;
                    if (isSuccessResponse) {
                        process.total = body.data.like_forum.length;
                        if (body.data.like_forum && body.data.like_forum.length > 0) {
                            signBars(body.data.like_forum, body.data.tbs, 0);
                        } else {
                            process.notify = `[${config.baidu_tieba.name}] 签到失败-请确认您有关注的贴吧⚠️`
                            record(process.notify);
                            finalNotify("baidu_tieba");
                        }
                    } else {
                        process.notify = `[${config.baidu_tieba.name}] 签到失败-${(body && body.error) ? body.error : "接口数据获取失败"}⚠️`;
                        record(process.notify);
                        finalNotify("baidu_tieba");
                    }
                }, reason => {
                    process.notify = `[${config.baidu_tieba.name}] 签到失败-未获取到签到列表⚠️`;
                    record(`${process.notify}-${reason.error}`);
                    finalNotify("baidu_tieba");
                });
            }
        }
        getList();
    } catch (e) {
        progress.notify = `[${config.baidu_tieba.name}] 脚本错误,详见日志`
        finalNotify("baidu_tieba");
        console.log(`AIO-BaiduTieba-${JSON.stringify(e)}`)
    }
}

//#endregion

//#region 爱奇艺会员签到

function sign_iqiyi() {
    if (!global.sign.iqiyi) {
        record(`[${config.iqiyi.name}]未开启签到`);
        return;
    }
    let cookieVal = $prefs.valueForKey(config.iqiyi.cookie);
    if (!cookieVal) {
        config.iqiyi.data.notify = `[${config.iqiyi.name}]未获取到Cookie⚠️`;
        record(config.iqiyi.data.notify);
        finalNotify("iqiyi");
        return;
    }
    config.iqiyi.provider.url += cookieVal;
    $task.fetch(config.iqiyi.provider).then(response => {
        var obj = JSON.parse(response.body);
        if (obj.msg == "成功") {
            if (obj.data.signInfo.code == "A00000") {
                config.iqiyi.data.notify = `[${config.iqiyi.name}]${obj.data.signInfo.msg}！${obj.data.signInfo.data.acquireGiftList[0]}, 连续签到${obj.data.signInfo.data.continueSignDaysSum}天 🎉`;
                record(config.iqiyi.data.notify)
            } else {
                // console.log("failure response: \n" + response.body);
                config.iqiyi.data.notify = `[${config.iqiyi.name}]${obj.data.signInfo.msg}⚠️`;
                record(`${config.iqiyi.data.notify}${obj.data.signInfo.msg}`);
            }
        } else {
            config.iqiyi.data.notify = `[${config.iqiyi.name}]签到失败⚠️`;
            record(`${config.iqiyi.data.notify}${obj.msg}`);
        }
        finalNotify("iqiyi");
    }, reason => {
        config.iqiyi.data.notify = `[${config.iqiyi.name}]签到失败！网络请求异常⚠️`;
        finalNotify("iqiyi");
        record(`${config.iqiyi.data.notify} : ${reason.error}`);
    });
}

//#endregion

//#region 网易云音乐

function sign_netease_music() {
    if (!global.sign.netease_music) {
        record(`[${config.netease_music.name}] 未开启签到`);
        return;
    }
    let cookieVal = $prefs.valueForKey(config.netease_music.cookie);
    if (!cookieVal) {
        config.netease_music.data.notify = `[${config.netease_music.name}] 未获取到Cookie`;
        record(config.netease_music.data.notify);
        finalNotify('netease_music');
        return;
    }
    let sign = (type) => {
        record(`网易云-sign-${type}`)
        config.netease_music.provider[type].headers.Cookie = cookieVal;
        $task.fetch(config.netease_music.provider[type]).then(response => {
            let result = JSON.parse(response.body);
            combain(result, type);
        }, reason => {
            var signInfo = {};
            signInfo.code = 999;
            signInfo.msg = reason.error;
            combain(signInfo, type);
        });
    }
    let combain = (result, type) => {
        record(`网易云-combain-${type}-${JSON.stringify(result)}`)
        try {
            if (result.code == 200) {
                //success
                config.netease_music.data[type] = '签到成功🎉';
            } else if (result.code == -2) {
                //signed
                config.netease_music.data[type] = '重复签到🎉';
            } else if (result.code == 301) {
                //signed
                config.netease_music.data[type] = 'Cookie失效⚠️';
            } else {
                //failed
                config.netease_music.data[type] = '未知错误⚠️';
            }
            checkIsAllProcessed();
        } catch (e) {
            record(`网易云报错-${JSON.stringify(e)}`);
        }

    }
    let checkIsAllProcessed = () => {
        record(`网易云-check-${config.netease_music.data.pc}-${config.netease_music.data.app}`)
        if (config.netease_music.data.pc && config.netease_music.data.app) {
            config.netease_music.data.notify = `[${config.netease_music.name}] APP-${config.netease_music.data.app} PC-${config.netease_music.data.pc}`;
            finalNotify('netease_music');
        }
    }

    sign('app');
    sign('pc');
}

//#endregion

//#region 吾爱破解

function sign_52pojie() {
    if (!global.sign._52pojie) {
        record(`[${config._52pojie.name}]未开启签到`);
        return;
    }
    let cookieVal = $prefs.valueForKey(config._52pojie.cookie);
    if (!cookieVal) {
        config._52pojie.data.notify = `[${config._52pojie.name}] 未获取到Cookie⚠️`;
        record(config._52pojie.data.notify);
        finalNotify("_52pojie");
        return;
    }
    config._52pojie.provider.headers.Cookie = cookieVal;
    $task.fetch(config._52pojie.provider).then(response => {
        if (response.body.match(/\u606d\u559c\u60a8/)) {
            //success
            config._52pojie.data.notify = `[${config._52pojie.name}] 签到成功🎉`;
        } else if (response.body.match(/\u4e0b\u671f\u518d\u6765/)) {
            //repeat
            config._52pojie.data.notify = `[${config._52pojie.name}] 重复签到🎉`;
        } else if (response.body.match(/\u9700\u8981\u5148\u767b\u5f55/)) {
            //cookie
            config._52pojie.data.notify = `[${config._52pojie.name}] 未获取到Cookie⚠️`;
        } else {
            //script need update
            config._52pojie.data.notify = `[${config._52pojie.name}] 脚本需更新⚠️`;
        }
        record(config._52pojie.data.notify);
        finalNotify("_52pojie");
    }, reason => {
        config._52pojie.data.notify = `[${config._52pojie.name}] 签到失败！网络请求异常⚠️`;
        finalNotify("_52pojie");
        record(`${config._52pojie.data.notify} : ${reason.error}`);
    });
}

//#endregion

//#region V2EX

function sign_v2ex() {
    if (!global.sign.v2ex) {
        record(`[${config.v2ex.name}] 未开启签到`);
        return;
    }
    let cookieVal = $prefs.valueForKey(config.v2ex.cookie);
    if (!cookieVal) {
        config.v2ex.data.notify = `[${config.v2ex.name}] 未获取到Cookie⚠️`;
        record(config.v2ex.data.notify);
        finalNotify("v2ex");
        return;
    }
    let checkSign = () => {
        config.v2ex.provider.check.headers.Cookie = cookieVal;
        $task.fetch(config.v2ex.provider.check).then(response => {
            let data = response.body;
            if (data.indexOf('每日登录奖励已领取') >= 0) {
                config.v2ex.data.notify = `[${config.v2ex.name}] 重复签到🎉`
                record(config.v2ex.data.notify);
                finalNotify("v2ex");
            } else {
                let regex = /<input[^>]*\/mission\/daily\/redeem\?once=(\d+)[^>]*>/g;
                let code = regex.exec(data);
                if (code) {
                    signMission(code[1])
                }
            }
        }, reason => {
            config.v2ex.data.notify = `[${config.v2ex.name}] 签到失败！网络请求异常⚠️`;
            record(`${config.v2ex.data.notify}-${reason.error}`);
            finalNotify("v2ex");
        })
    }
    let signMission = code => {
        config.v2ex.provider.sign.headers.Cookie = cookieVal;
        config.v2ex.provider.sign.url = `https://www.v2ex.com/mission/daily/redeem?once=${code}`;
        $task.fetch(config.v2ex.provider.sign).then(response => {
            let data = response.body;
            if (data.indexOf('每日登录奖励已领取') >= 0) {
                let days = 0;
                let daysRegex = /已连续登录 (\d{1,10}) 天/;
                if (daysRegex.test(data)) {
                    days = daysRegex.exec(data)[1]
                }
                config.v2ex.data.notify = `[${config.v2ex.name}] 签到成功🎉${days>0?`已连续签到${days}天`:''}`
                record(config.v2ex.data.notify);
                finalNotify("v2ex");
            } else {
                config.v2ex.data.notify = `[${config.v2ex.name}] 签到失败⚠️`
                record(`${config.v2ex.data.notify}-${data}`)
                finalNotify("v2ex");
            }
        }, reason => {
            config.v2ex.data.notify = `[${config.v2ex.name}] 签到失败！网络请求异常⚠️⚠️`;
            record(`${config.v2ex.data.notify}-${reason.error}`);
            finalNotify("v2ex");
        })
    }
    checkSign();
}

//#endregion

//#region 微博超话
function sign_weibo_super() {
    if (!global.sign.weibo_super) {
        record(`[${config.weibo_super.name}]未开启签到`);
        return;
    }
    if (global.data.weibo_super.length <= 0) {
        config.weibo_super.data.notify = `[${config.weibo_super.name}] 未配置超话ID`;
        record(config.weibo_super.data.notify);
        finalNotify("weibo_super");
        return;
    }
    let cookieVal = $prefs.valueForKey(config.weibo_super.cookie);
    if (!cookieVal) {
        config.weibo_super.data.notify = `[${config.weibo_super.name}] 未获取到Cookie⚠️`;
        record(`${config.weibo_super.data.notify}, 请在文件最上方的glabal-data-weibo_super中配置相应ID, 前往https://nave.work/%E5%BE%AE%E5%8D%9A%E8%B6%85%E8%AF%9D%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.html 进行查看具体教程`);
        finalNotify("weibo_super");
        return;
    }
    let sign = index => {
        if (global.data.weibo_super.length <= index) {
            combain();
            finalNotify('weibo_super');
        }
        let name = global.data.weibo_super[index][0];
        let super_id = global.data.weibo_super[index][1];
        config.weibo_super.provider.url = `https://weibo.com/p/aj/general/button?ajwvr=6&api=http://i.huati.weibo.com/aj/super/checkin&texta=%E7%AD%BE%E5%88%B0&textb=%E5%B7%B2%E7%AD%BE%E5%88%B0&status=0&id=${super_id}&location=page_100808_super_index&timezone=GMT+0800&lang=zh-cn&plat=MacIntel&ua=Mozilla/5.0%20(Macintosh;%20Intel%20Mac%20OS%20X%2010_15)%20AppleWebKit/605.1.15%20(KHTML,%20like%20Gecko)%20Version/13.0.4%20Safari/605.1.15&screen=375*812&__rnd=1576850070506`
        config.weibo_super.provider.headers.Cookie = cookieVal;
        let result = {
            name,
            success: true,
            icon: '🎉'
        };
        $task.fetch(config.weibo_super.provider).then(response => {
            var obj = JSON.parse(response.body);
            var code = obj.code;
            var msg = obj.msg;
            if (code == 100003) { // 行为异常，需要重新验证
                result.success = false;
                result.icon = '⚠️';
                config.weibo_super.data.result.push(result);
                record(`[${config.weibo_super.name}] ${name}  ${msg}, ${obj.data.location}`);
            } else if (code == 100000) {
                config.weibo_super.data.result.push(result)
                record(`[${config.weibo_super.name}] ${name} 签到成功🎉`);
            } else if (code == 382004) {
                config.weibo_super.data.result.push(result)
                record(`[${config.weibo_super.name}] ${name} ${msg.replace("(382004)", "")}🎉`);
            } else {
                result.success = false;
                result.icon = '❕';
                config.weibo_super.data.result.push(result);
                record(`[${config.weibo_super.name}] ${name} ${msg}❕`);
            }
            sign(++index);
        }, reason => {
            result.success = false;
            result.icon = '❌';
            config.weibo_super.data.result.push(result);
            record(`[${config.weibo_super.name}] ${name} 签到错误,${reason.error}`);
            sign(++index);
        });
    }
    let combain = () => {
        config.weibo_super.data.notify = `[${config.weibo_super.name}]`;
        for (item of config.weibo_super.data.result) {
            config.weibo_super.data.notify += ` 「${item.name}」${item.icon}`;
        }
    }
    sign(0);
}
//#endregion

//#region 中国电信营业厅
function sign_china_telecom() {
    if (!global.sign.china_telecom) {
        record(`[${config.china_telecom.name}]未开启签到`);
        return;
    }
    if (!global.data.china_telecom) {
        config.china_telecom.data.notify = `[${config.china_telecom.name}] 未配置对应的签到手机号`;
        record(config.china_telecom.data.notify);
        finalNotify("china_telecom");
        return;
    }
    let cookieVal = $prefs.valueForKey(config.china_telecom.cookie);
    if (!cookieVal) {
        config.china_telecom.data.notify = `[${config.china_telecom.name}] 未获取到Cookie⚠️`;
        record(`${config.china_telecom.data.notify}`);
        finalNotify("china_telecom");
        return;
    }
    config.china_telecom.provider.headers.Cookie = cookieVal;
    $task.fetch(config.china_telecom.provider).then(response => {
        var body = JSON.parse(response.body);
        if (body.resoultCode == "0") {
            if (body.data.code == 1) {
                config.china_telecom.data.notify = `[${config.china_telecom.name}] 签到成功,获得金币${body.data.coin}/金豆${body.data.flow}`
            } else if (body.data.code == 0) {
                config.china_telecom.data.notify = `[${config.china_telecom.name}] 签到成功,${body.data.msg}`
            } else {
                config.china_telecom.data.notify = `[${config.china_telecom.name}] ${body.data.msg}`
            }
        } else {
            config.china_telecom.data.notify = `[${config.china_telecom.name}] 签到失败, ${body.data.msg}-${body.resoultCode}`
        }
        record(config.china_telecom.data.notify)
        finalNotify("china_telecom");
    }, reason => {
        config.china_telecom.data.notify = `[${config.china_telecom.name}] 签到失败,${reason.error}`
        record(config.china_telecom.data.notify)
        finalNotify("china_telecom");
    })
}
//#endregion

//#region 签到统一管控
function startSign() {
    if (global.sign.baidu_tieba) sign_baidu_tieba();
    if (global.sign.iqiyi) sign_iqiyi();
    if (global.sign.netease_music) sign_netease_music();
    if (global.sign._52pojie) sign_52pojie();
    if (global.sign.v2ex) sign_v2ex();
    if (global.sign.weibo_super) sign_weibo_super();
    if (global.sign.china_telecom) sign_china_telecom();
}

function finalNotify(type) {
    config[type].executed = true;
    var isAllProcessed = true;
    for (var item in global.sign) {
        if (global.sign[item]) {
            if (!config[item].executed) {
                isAllProcessed = false;
                break;
            }
        }
    }
    let sign_detail = '';
    let breakLine = `
`;
    if (isAllProcessed) {
        for (var item in global.sign) {
            // record(`提醒消息-${item}-${global.sign[item]}`)
            if (global.sign[item]) {
                // record(`提醒消息-${config[item].data.notify}`)
                sign_detail += `${sign_detail?breakLine:''}${config[item].data.notify}`;
            }
        }
        $notify("All In One", "详细签到信息可见日志", sign_detail);
    }
}

function record(content) {
    if (global.log == 1) {
        console.log(`
${content}`);
    } else if (global.log == 2) {
        console.log(`
${content.splice(0, 60)}`);
    }
}
//#endregion

startSign();
