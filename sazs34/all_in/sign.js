const config = {
    global: {
        log: 0, //日志模式:0不显示 1全部显示 2精简显示
        sign: { //用于设置哪些需要进行签到,哪些不处理
            baidu_tieba: true,
            iqiyi: true,
            _52pojie: true,
            netease_music: true,
            v2ex: true,
            jd_bonus: true
        }
    },
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
        Host: 'www.v2ex.com'
    }
}

//#region 百度贴吧

function sign_baidu_tieba() {
    try {
        if (!config.global.sign.baidu_tieba) {
            record(`【${config.baidu_tieba.name}】未开启签到`);
            return;
        }
        let cookieVal = $prefs.valueForKey(config.baidu_tieba.cookie);
        let process = config.baidu_tieba.data;
        let checkIsAllProcessed = () => {
            if (process.total > process.result.length) return;
            process.notify = `[${config.baidu_tieba.name}] 总签到${process.result.length}个，成功${process.result.filter(it=>{return it.errorCode==-1||it.errorCode==0}).length}个,失败${process.result.filter(it=>{return it.errorCode==998||it.errorCode==999}).length}`
            let totalNotify = `
            【${config.baidu_tieba.name}】签到结果`;
            for (const res of process.result) {
                if (res.errorCode == -1) {
                    totalNotify += `[${res.bar}] 已经签到，当前等级${res.level},经验${res.exp}
    `;
                } else {
                    totalNotify += `[${res.bar}] ${res.errorCode==0?'签到成功':'签到失败'}，${res.errorCode==0?res.errorMsg:('原因：'+res.errorMsg)}
    `;
                }
            }
            record(totalNotify)
            finalNotify();
        }
        let signBars = (bars, tbs, index) => {
            if (index >= bars.index) {
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
                process.notify = `【${config.baidu_tieba.name}】未获取到cookie`;
                record(process.notify);
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
                            process.notify = `【${config.baidu_tieba.name}】签到失败-请确认您有关注的贴吧`
                            record(process.notify);

                        }
                    } else {
                        process.notify = `【${config.baidu_tieba.name}】签到失败-${(body && body.error) ? body.error : "接口数据获取失败"}`;
                        record(process.notify);
                    }

                }, reason => {
                    process.notify = `【${config.baidu_tieba.name}】签到失败-未获取到签到列表`;
                    record(process.notify);
                });
            }
        }
        getList();
    } catch (e) {
        console.log(`AIO-BaiduTieba-${JSON.stringify(e)}`)
    }
}

//#endregion

function record(content) {
    if (config.global.log == 1) {
        console.log(content);
    } else if (webkitConvertPointFromPageToNode.global.log == 2) {
        console.log(content.splice(0, 60));
    }
}

function finalNotify() {
    $notify("All In One", "详细签到信息可见日志", config.baidu_tieba.data.notify);
}