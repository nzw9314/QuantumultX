const global = {
    log: 1, //日志模式:0不显示 1全部显示 2精简显示,推荐值:1
    parallel: false, //是否顺序签到(true则同时签到,可能会出现内存占用过高导致执行失败的情况;false则签到速度会慢一些,但是很稳)
    sign: { //用于设置哪些需要进行签到,哪些不处理
        baidu_tieba: true,
        iqiyi: true,
        _52pojie: true,
        netease_music: true,
        v2ex: false,
        china_telecom: false,
        rrtv: false,
        eleme: false
    },
    data: {
        china_telecom: "" //此处输入要签到的手机号码,半角双引号中间
    }
}

//#region smartjs,用于兼容Surge和QuantumultX

/*
本作品用于QuantumultX和Surge之间js执行方法的转换
您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
尚未测试是否支持import的方式进行使用,因此暂未export
如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
您也可直接在tg中联系@wechatu
*/
// #region 固定头部
let isQuantumultX = typeof $task != 'undefined'; //判断当前运行环境是否是qx
let isSurge = typeof $httpClient != 'undefined'; //判断当前运行环境是否是surge
let isRequest = typeof $request != "undefined"; //判断是否是请求
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};


var done = (value = {}) => isQuantumultX ? (isRequest ? $done(value) : null) : ((isRequest ? $done(value) : $done()));
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
//#endregion

//#endregion

let master = () => {
    if (typeof $request != "undefined") {
        getCookie();
    } else {
        execute();
    }
}

let getCookie = () => {
    //#region 基础配置
    const config = {
        baidu_tieba_h5: {
            cookie: 'CookieTB',
            name: '百度贴吧Cookie-H5',
            Host: 'tieba.baidu.com'
        },
        baidu_tieba_app: {
            cookie: 'CookieTB',
            name: '百度贴吧Cookie-App',
            Host: 'c.tieba.baidu.com'
        },
        iqiyi_app: {
            cookie: 'CookieQY',
            name: '爱奇艺Cookie-App',
            Host: 'passport.iqiyi.com'
        },
        _52pojie: {
            cookie: 'CookieWA',
            name: '吾爱破解Cookie',
            Host: 'www.52pojie.cn'
        },
        netease_music: {
            cookie: 'CookieWY',
            name: '网易云音乐Cookie',
            Host: 'music.163.com'
        },
        v2ex: {
            cookie: 'CookieV2ex',
            name: 'V2EX-Cookie',
            Host: 'www.v2ex.com'
        },
        jd: {
            cookie: 'CookieJD',
            name: '京东Cookie',
            Host: 'api.m.jd.com'
        },
        china_telecom: {
            cookie: 'cookie.10000',
            name: '电信营业厅',
            Host: 'wapside.189.cn'
        },
        eleme: {
            cookie: "CookieELM",
            name: '饿了么Cookie',
            Host: 'ele.me'
        },
        rrtv: {
            cookie: 'chavy_cookie_rrtv',
            name: '人人视频Cookie',
            Host: 'rr.tv'
        }
    }
    //#endregion

    //#region 查重方法,用于检测Cookie值是否发生变化以便于更新Cookie

    let updateCookie = (config, newVal) => {
        if (!newVal || !config) return;
        var historyCookie = $prefs.valueForKey(config.cookie);
        if (historyCookie) {
            if (historyCookie != newVal) {
                if ($prefs.setValueForKey(newVal, config.cookie)) {
                    $notify(`更新 ${config.name} 成功🎉`, "", "无需禁用脚本，仅Cookie改变时才会重新获取");
                } else {
                    $notify(`更新 ${config.name} 失败!!!`, "", "");
                }
            } else {
                //cookie未发生变化,不执行更新
            }
        } else {
            if ($prefs.setValueForKey(newVal, config.cookie)) {
                $notify(`首次写入 ${config.name} 成功🎉`, "", "无需禁用脚本，仅Cookie改变时才会重新获取");
            } else {
                $notify(`首次写入 ${config.name} 失败!!!`, "", "");
            }
        }
    }

    //#endregion

    //#region 正式开始写入cookie
    let request = $request;
    var isValidRequest = request && request.headers && request.headers.Cookie
    if (isValidRequest) {
        let headers = request.headers;
        // console.log(`【Cookie触发】${headers.Host}-${headers.Cookie}`)
        //#region 百度贴吧-H5
        if (headers.Host == config.baidu_tieba_h5.Host) {
            var regex = /(^|)BDUSS=([^;]*)(;|$)/;
            var matchInfo = headers.Cookie.match(regex);
            if (matchInfo) {
                var headerCookie = headers.Cookie.match(regex)[0];
                updateCookie(config.baidu_tieba_h5, headerCookie);
            }
        }
        //#endregion
        //#region 百度贴吧-APP
        if (headers.Host == config.baidu_tieba_app.Host) {
            var regex = /(^|)BDUSS=([^;]*)(;|$)/;
            var matchInfo = headers.Cookie.match(regex);
            if (matchInfo) {
                var headerCookie = headers.Cookie.match(regex)[0];
                updateCookie(config.baidu_tieba_app, headerCookie);
            }
        }
        //#endregion
        //#region 爱奇艺-APP
        if (headers.Host == config.iqiyi_app.Host) {
            var regex = /authcookie=([A-Za-z0-9]+)/;
            if (regex.test(request.url)) {
                var headerCookie = regex.exec(request.url)[1];
                updateCookie(config.iqiyi_app, headerCookie);
            }
        }
        //#endregion
        //#region 吾爱破解
        if (headers.Host == config._52pojie.Host) {
            var headerCookie = headers.Cookie;
            updateCookie(config._52pojie, headerCookie);
        }
        //#endregion
        //#region 网易云音乐
        if (headers.Host == config.netease_music.Host) {
            var headerCookie = headers.Cookie;
            //这个cookie很调皮,会将WM_TID放置到最前面一次,导致cookie会检测到变化,实际值始终是一样的
            if (headerCookie.indexOf("WM_TID=") > 0)
                updateCookie(config.netease_music, headerCookie);
        }
        //#endregion
        //#region V2EX
        if (headers.Host == config.v2ex.Host) {
            var headerCookie = headers.Cookie;
            updateCookie(config.v2ex, headerCookie);
        }
        //#endregion
        //#region 京东
        if (headers.Host == config.jd.Host) {
            var headerCookie = headers.Cookie;
            updateCookie(config.jd, headerCookie);
        }
        //#endregion
        //#region 中国电信
        if (headers.Host.indexOf(config.china_telecom.Host) >= 0) {
            var headerCookie = headers.Cookie;
            updateCookie(config.china_telecom, headerCookie);
        }
        //#endregion
        //#region 饿了么
        if (headers.Host.indexOf(config.eleme.Host) >= 0) {
            var headerCookie = headers.Cookie;
            var cookieVal = helper.getCookieByName(headerCookie, "USERID");
            updateCookie(config.eleme, cookieVal);
        }
        //#endregion
        //#region 人人视频
        if (headers.Host.indexOf(config.rrtv.Host) >= 0) {
            var headerToken = headers.token;
            updateCookie(config.rrtv, headerToken);
        }
        //#endregion
    }
    $done();

    //#endregion

}

let execute = () => {
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
        },
        eleme: {
            cookie: 'CookieELM',
            name: '饿了么',
            provider: {
                sign: {
                    url: `https://h5.ele.me/restapi/member/v2/users/`,
                    method: 'POST',
                },
                check: {
                    url: `https://h5.ele.me/restapi/member/v1/users/`,
                    method: 'GET',
                },
                prize: {
                    url: `https://h5.ele.me/restapi/member/v2/users/`,
                    method: 'POST',
                    body: ''
                }
            },
            data: {
                notify: ''
            }
        },
        rrtv: {
            cookie: 'chavy_cookie_rrtv',
            name: '人人视频',
            provider: {
                daily: {
                    url: 'https://api.rr.tv/rrtv-activity/sign/sign',
                    method: 'POST',
                    headers: {
                        token: "",
                        clientType: 'ios_rrsp_jzsp',
                        'Accept-Encoding': 'gzip, deflate, br',
                        Connection: 'keep-alive',
                        clientVersion: '4.3.5',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        Origin: 'https://mobile.rr.tv',
                        Referer: 'https://mobile.rr.tv/',
                        Accept: 'application/json, text/plain, */*',
                        Host: 'api.rr.tv',
                        'Accept-Language': 'zh-cn',
                        'Content-Length': '12',
                        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 App/RRSPApp platform/iPhone AppVersion/4.3.5'
                    }
                },
                welfare: {
                    url: 'https://api.rr.tv/dailyWelfare/getWelfare',
                    method: 'POST',
                    headers: {
                        token: "",
                        clientType: 'web',
                        'Accept-Encoding': 'gzip, deflate, br',
                        Connection: 'keep-alive',
                        clientVersion: '0.0.1',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        Origin: 'https://mobile.rr.tv',
                        Referer: 'https://mobile.rr.tv/mission/',
                        Accept: 'application/json, text/plain, */*',
                        Host: 'api.rr.tv',
                        'Accept-Language': 'zh-cn',
                        'Content-Length': '45',
                        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 App/RRSPApp platform/iPhone AppVersion/4.3.5'
                    }
                },
                info: {
                    url: 'https://api.rr.tv/user/profile',
                    method: 'POST',
                    headers: {
                        token: "",
                        clientType: 'ios_rrsp_jzsp',
                        'Accept-Encoding': 'gzip, deflate, br',
                        Connection: 'keep-alive',
                        clientVersion: '4.3.5',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        Origin: 'https://mobile.rr.tv',
                        Referer: 'https://mobile.rr.tv/mission/',
                        Accept: 'application/json, text/plain, */*',
                        Host: 'api.rr.tv',
                        'Accept-Language': 'zh-cn',
                        'Content-Length': '0',
                        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 App/RRSPApp platform/iPhone AppVersion/4.3.5'
                    }
                }
            },
            data: {
                notify: '',
                result: {
                    daily: null,
                    welfare: null
                }
            }
        }
    }
    //#endregion

    //#region 签到开始

    //#region 百度贴吧

    let sign_baidu_tieba = () => {
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

    let sign_iqiyi = () => {
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
            try {
                var obj = JSON.parse(response.body);
                if (obj && obj.msg == "成功") {
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
            } catch (e) {
                config.iqiyi.data.notify = `[${config.iqiyi.name}]签到失败,数据解析失败⚠️`;
                record(`${config.iqiyi.data.notify}-${JSON.stringify(e)}`);
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

    let sign_netease_music = () => {
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
            // record(`网易云-sign-${type}`)
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
            // record(`网易云-combain-${type}-${JSON.stringify(result)}`)
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
            } catch (e) {
                config.netease_music.data[type] = '未知错误见日志⚠️';
                record(`网易云报错-${JSON.stringify(e)}`);
            }
            checkIsAllProcessed();
        }
        let checkIsAllProcessed = () => {
            record(`[${config.netease_music.name}]-check-${config.netease_music.data.pc}-${config.netease_music.data.app}`)
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

    let sign__52pojie = () => {
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
            try {
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
            } catch (e) {
                config._52pojie.data.notify = `[${config._52pojie.name}] 脚本数据解析异常⚠️`;
                record(`${config._52pojie.data.notify}-${JSON.stringify(e)}`)
            }
            finalNotify("_52pojie");
        }, reason => {
            config._52pojie.data.notify = `[${config._52pojie.name}] 签到失败！网络请求异常⚠️`;
            finalNotify("_52pojie");
            record(`${config._52pojie.data.notify} : ${reason.error}`);
        });
    }

    //#endregion

    //#region V2EX

    let sign_v2ex = () => {
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
                try {
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
                } catch (e) {
                    config.v2ex.data.notify = `[${config.v2ex.name}] 签到失败！数据处理异常⚠️`;
                    record(`${config.v2ex.data.notify}-${JSON.stringify(e)}`);
                    finalNotify("v2ex");
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
                try {
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
                        record(`${config.v2ex.data.notify}-签到响应数据中没有检测到'每日登录奖励已领取'字段,判定为签到失败,可自行访问${config.v2ex.provider.sign.url}进行签到`)
                        finalNotify("v2ex");
                    }
                } catch (e) {
                    config.v2ex.data.notify = `[${config.v2ex.name}] 签到失败⚠️详见日志报错`
                    record(`${config.v2ex.data.notify}-${JSON.stringify(e)}`);
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

    //#region 中国电信营业厅
    let sign_china_telecom = () => {
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
            try {
                var body = JSON.parse(response.body);
                if (body.resoultCode == "0") {
                    if (body.data.code == 1) {
                        config.china_telecom.data.notify = `[${config.china_telecom.name}] 签到成功,获得金币${body.data.coin}/金豆${body.data.flow}`;
                    } else if (body.data.code == 0) {
                        config.china_telecom.data.notify = `[${config.china_telecom.name}] 签到成功,${body.data.msg}`;
                    } else {
                        config.china_telecom.data.notify = `[${config.china_telecom.name}] ${body.data.msg}`;
                    }
                } else {
                    config.china_telecom.data.notify = `[${config.china_telecom.name}] 签到失败, ${body.data.msg}-${body.resoultCode}`;
                }
                record(config.china_telecom.data.notify)
            } catch (e) {
                config.china_telecom.data.notify = `[${config.china_telecom.name}] 签到失败-e`;
                record(`${config.china_telecom.data.notify}-error:${JSON.stringify(e)}`);
            }
            finalNotify("china_telecom");
        }, reason => {
            config.china_telecom.data.notify = `[${config.china_telecom.name}] 签到失败,${reason.error}`
            record(config.china_telecom.data.notify)
            finalNotify("china_telecom");
        })
    }
    //#endregion

    //#region 饿了么

    let sign_eleme = () => {
        if (!global.sign.eleme) {
            record(`[${config.eleme.name}] 未开启签到`);
            return;
        }
        let cookieVal = $prefs.valueForKey(config.eleme.cookie);
        if (!cookieVal) {
            config.eleme.data.notify = `[${config.eleme.name}] 未获取到Cookie⚠️`;
            record(config.eleme.data.notify);
            finalNotify("eleme");
            return;
        }
        let eleUserId = cookieVal;

        let sign = () => {
            config.eleme.provider.sign.url += `${eleUserId}/sign_in`;
            $task.fetch(config.eleme.provider.sign).then(response => {
                try {
                    if (response.statusCode == 200) {
                        config.eleme.data.notify = `[${config.eleme.name}] 签到成功🎉`;
                        record(config.eleme.data.notify);
                        finalNotify("eleme");
                        // prize();
                    } else {
                        check();
                    }
                } catch (e) {
                    config.eleme.data.notify = `[${config.eleme.name}] 签到失败！数据解析异常⚠️`;
                    record(`${config.eleme.data.notify} : ${JSON.stringify(e)}`);
                    finalNotify("eleme");
                }
            }, reason => {
                config.eleme.data.notify = `[${config.eleme.name}] 签到失败！网络请求异常⚠️`;
                record(`${config.eleme.data.notify} : ${reason.error}`);
                finalNotify("eleme");
            })
        }
        let check = () => {
            config.eleme.provider.check.url += `${eleUserId}/sign_in/info`;
            $task.fetch(config.eleme.provider.check).then(resp => {
                try {
                    let result = JSON.parse(resp.body);
                    if (result && result.has_signed_in_today) {
                        config.eleme.data.notify = `[${config.eleme.name}] 今日已签到🎉`;
                    } else {
                        config.eleme.data.notify = `[${config.eleme.name}] 签到失败`;
                    }
                    record(config.eleme.data.notify);
                } catch (e) {
                    config.eleme.data.notify = `[${config.eleme.name}] 签到异常`;
                    record(`${config.eleme.data.notify}-${JSON.stringify(e)}`);
                }
                finalNotify("eleme");
            }, err => {
                config.eleme.data.notify = `[${config.eleme.name}] 网络请求异常⚠️`;
                record(`${config.eleme.data.notify} : ${err.error}`);
                finalNotify("eleme");
            })
        }
        let prize = () => {
            config.eleme.data.notify = `[${config.eleme.name}] 签到成功🎉`;
            config.eleme.provider.prize.url += `${eleUserId}/sign_in/daily/prize`;
            $task.fetch(config.eleme.provider.prize).then(resp => {
                let result = JSON.parse(resp.body);
                if (result.message) {
                    //此时是已经领取过奖励了,不处理
                } else if (result.length > 0) {
                    let selectedOne = result.filter(it => it.status == 1);
                    if (selectedOne.length >= 1 && selectedOne[0].prizes) {
                        let reward = `${selectedOne[0].prizes.name}${selectedOne[0].prizes.amount}元`
                        config.eleme.data.notify += ` 翻牌:${reward}`;
                    }
                }
                record(config.eleme.data.notify);
                finalNotify("eleme");
            }, err => {
                record(`${config.eleme.data.notify},翻牌失败-${err.error}`);
                finalNotify("eleme");
            })
        }
        sign();
    }

    //#endregion

    //#region 人人视频
    let sign_rrtv = () => {
        if (!global.sign.rrtv) {
            record(`[${config.rrtv.name}] 未开启签到`);
            return;
        }
        console.log(`[${config.rrtv.name}]开始签到-${config.rrtv.cookie}`)
        let cookieVal = $prefs.valueForKey(config.rrtv.cookie);
        console.log(`[${config.rrtv.name}]cookie-${cookieVal}`)
        if (!cookieVal) {
            console.log(`[${config.rrtv.name}]未获取到cookie`)
            config.rrtv.data.notify = `[${config.rrtv.name}] 未获取到Cookie⚠️`;
            console.log(`[${config.rrtv.name}]未获取到cookie1`)
            record(config.rrtv.data.notify);
            console.log(`[${config.rrtv.name}]未获取到cookie2`)
            finalNotify("rrtv");
            console.log(`[${config.rrtv.name}]未获取到cookie3`)
        }
    
        let daily = () => {
            config.rrtv.provider.daily.headers.token = cookieVal;
            $task.fetch(config.rrtv.provider.daily).then(resp => {
                let result = JSON.parse(resp.body);
                config.rrtv.data.result.daily = result;
                check();
            }, err => {
                config.rrtv.data.result.daily = {
                    code: '9999'
                };
                check();
            })
        }
        let welfare = () => {
            config.rrtv.provider.welfare.headers.token = cookieVal;
            $task.fetch(config.rrtv.provider.welfare).then(resp => {
                let result = JSON.parse(resp.body);
                config.rrtv.data.result.welfare = result;
                check();
            }, err => {
                config.rrtv.data.result.welfare = {
                    code: '9999'
                };
                check();
            })
        }
        let info = () => {
            config.rrtv.provider.info.headers.token = cookieVal;
            $task.fetch(config.rrtv.provider.info).then(resp => {
                let result = JSON.parse(resp.body);
                let infoResult = "";
                let signResult = "失败";
                let swllfareResult = "失败";
                if (config.rrtv.data.result.daily.code == "0000") {
                    signResult = "成功";
                } else if (config.rrtv.data.result.daily.code == "8750") {
                    signResult = "重复";
                }
                if (config.rrtv.data.result.welfare.code == "0000") {
                    swllfareResult = "成功";
                } else if (config.rrtv.data.result.welfare.code == "8623") {
                    swllfareResult = "重复";
                }
                if (result.code == '0000') {
                    const levelStr = '';//result.data.user.levelStr ? ` (${result.data.user.levelStr})` : ``
                    infoResult = `, LV: ${result.data.user.level}${levelStr}, 积分: ${result.data.user.score}`
                }
                config.rrtv.data.notify = `[${config.rrtv.name}] 签到${signResult}, 福利${swllfareResult}${infoResult}`;
                record(config.rrtv.data.notify);
                finalNotify("rrtv");
            }, err => {

            })
        }
        let check = () => {
            if (!config.rrtv.data.result.daily || !config.rrtv.data.result.welfare) return;
            info();
        }
        daily();
        welfare();
    }
    ////#endregion

    //#endregion

    //#region 签到统一管控
    let startSign = () => {
        if (global.parallel) {
            if (global.sign.baidu_tieba) sign_baidu_tieba();
            if (global.sign.iqiyi) sign_iqiyi();
            if (global.sign.netease_music) sign_netease_music();
            if (global.sign._52pojie) sign__52pojie();
            if (global.sign.v2ex) sign_v2ex();
            if (global.sign.china_telecom) sign_china_telecom();
            if (global.sign.eleme) sign_eleme();
            if (global.sign.rrtv) sign_rrtv();
        } else {
            if (global.sign.baidu_tieba) sign_baidu_tieba();
            else if (global.sign.iqiyi) sign_iqiyi();
            else if (global.sign.netease_music) sign_netease_music();
            else if (global.sign._52pojie) sign__52pojie();
            else if (global.sign.v2ex) sign_v2ex();
            else if (global.sign.china_telecom) sign_china_telecom();
            else if (global.sign.eleme) sign_eleme();
            else if (global.sign.rrtv) sign_rrtv();
            else $notify("All In One", "详细签到信息可见日志", "暂无需签到的项目");
        }
    }

    let finalNotify = type => {
        config[type].executed = true;
        var notSignItem = "";
        for (var item in global.sign) {
            if (global.sign[item]) {
                if (!config[item].executed) {
                    notSignItem = item;
                    break;
                }
            }
        }
        if (notSignItem && !global.parallel) {
            record(`准备执行${notSignItem}`);
            eval(`sign_${notSignItem}()`);
            return;
        }
        let sign_detail = '';
        let breakLine = `
`;
        if (!notSignItem) {
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

    let record = content => {
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
}

let helper = {
    getCookieByName: (cookie, name) => {
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        var arr = cookie.match(reg);
        if (arr && arr.length >= 3)
            return arr[2];
        else
            return null;
    }
}

master();
