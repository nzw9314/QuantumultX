/*
微信小程序"活动抽奖"自动签到，支持 Quantumult X（理论上也支持 Surge，未尝试）。
请先按下述方法进行配置，进入"活动抽奖"，手动签到一次或点击"已签到"，若弹出"首次写入活动抽奖 Token 成功"即可正常食用，其他提示或无提示请发送日志信息至 issue。
到 cron 设定时间自动签到时，若弹出"活动抽奖 - 签到成功"即完成签到，其他提示或无提示请发送日志信息至 issue。

注意⚠️：此脚本用于在 2020.03.19 及之后需获取过 token 的用户，且需要更换 rewrite 及 hostname。
注意⚠️：非手动完成签到、抽奖、完成任务，请自行评估封号危险，此脚本仅用于学习交流，对其余事件概不负责。

⚠️免责声明：
1. 此脚本仅用于学习研究，不保证其合法性、准确性、有效性，请根据情况自行判断，本人对此不承担任何保证责任。
2. 由于此脚本仅用于学习研究，您必须在下载后 24 小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。
3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。
4. 此脚本涉及应用与本人无关，本人对因此引起的任何隐私泄漏或其他后果不承担任何责任。
5. 本人对任何脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害。
6. 如果任何单位或个人认为此脚本可能涉嫌侵犯其权利，应及时通知并提供身份证明，所有权证明，我们将在收到认证文件确认后删除此脚本。
7. 所有直接或间接使用、查看此脚本的人均应该仔细阅读此声明。本人保留随时更改或补充此声明的权利。一旦您使用或复制了此脚本，即视为您已接受此免责声明。

Author: zZPiglet

----------
更新日志：
- 2020/03/30：
增加"自助福利"列表中的一堆-无用-抽奖、分享获得幸运币。
修改部分细节。
若有大佬中奖"幸运大礼"，希望可以抓包开奖过程并提交至 issue。
步骤：进微信小程序 -> 打开 Thor（或可导入 Thor 查看记录的抓包软件）-> 使用默认的全局抓包 -> 点小程序里的"我的-中奖纪录-中奖的幸运大礼（一般为 100 幸运币）-开奖" -> 关 Thor -> 导出此次抓包所有记录

- 2020/03/28：
更新接口 v1 -> v2，注意更改 rewrite，若有问题请先自行回滚并提交日志 / 抓包至 issue。 若 token 未失效可不更新。
修改部分细节。

- 2020/03/26：
修复日志显示，新增获取所有任务奖励，参与幸运大礼，部分自动开奖（瓜分现金红包、各类无用优惠券）。
由于开奖部分每类接口不统一，若出现非瓜分现金红包、优惠券类的中奖，可抓包开奖过程反馈至 issue，后续进行更新补充。
过程：进微信小程序 -> 打开 Thor（或可导入 Thor 查看记录的抓包软件）-> 使用默认的全局抓包 -> 点小程序里的"我的-中奖纪录-中奖的条目-开奖" -> 关 Thor -> 导出此次抓包所有记录（或自行排除敏感信息后的记录） -> 提交issue

已知 bug：中奖得券不通知，暂未找到错误点，大佬可帮忙指正。关键参数：datainfo.couponCnt

- 2020/03/23：
新增自动参与首页抽奖、进行参与 3 个首页抽奖后的随即兑换、领取参与 5 个首页抽奖后的每日任务奖励。
----------

咕咕咕：
其余开奖
触发分享得幸运币（随缘碰到，忘了抓包。有哪位小伙伴碰到了可以帮忙抓个包反馈至 issue。）
设置延迟
多账号

Quantumult X (TestFlight 190+, App Store 1.0.5+):
[task_local]
1 0 * * * WeChatLottery_new.js
or remote
1 0 * * * https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery_new.js

[rewrite_local]
^https:\/\/api-hdcj\.9w9\.com\/v2\/sign url script-request-header WeChatLottery_new.js
or remote
^https:\/\/api-hdcj\.9w9\.com\/v2\/sign url script-request-header https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery_new.js

Surge 4.0+:
[Script]
cron "1 0 * * *" script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery_new.js
http-request ^https:\/\/api-hdcj\.9w9\.com\/v2\/sign script-path=https://raw.githubusercontent.com/zZPiglet/Task/master/WeChatLottery/WeChatLottery_new.js


All app:
[mitm]
hostname = api-hdcj.9w9.com

获取完 Token 后可不注释 rewrite / mitm，Token 更新时会弹窗。若因 mitm 导致该小程序网络不稳定，可注释掉 mtim。
*/


//参加幸运大奖，默认关闭，若需使用请改为 true（关注"活动抽奖"公众号，并在小程序中手动参与一次即可设置自动参与，并不需要使用脚本）
const luckgift = false //true

const mainURL = 'https://api-hdcj.9w9.com/v2/'
const CheckinURL = mainURL + 'sign/sign'
const CheckindataURL = mainURL + 'sign'
const DataURL = mainURL + 'informations'
const IndexURL = mainURL + 'index?type=0&gzh_number='
const Index2URL = mainURL + 'index?type=1'
const LotteryURL = mainURL + 'lotteries/'
const CouponURL = mainURL + 'coupons/'
const ExchangeURL = mainURL + 'limit_red_envelopes/453'
const GetTaskURL = mainURL + 'task'
const TaskURL = mainURL + 'tasks/'
const WinURL = mainURL + 'users/list/2'
const ShareURL = mainURL + 'share_lucky_get'
const LuckyGiftURL = mainURL + 'lucky_gift'
const TokenName = '活动抽奖'
const TokenKey = 'wclotterynew'
const UidKey = 'wcluid'
const datainfo = {}
const $cmp = compatibility()

async function Sign() {
    await Checkin()
    await Join()
    await Exchange()
    await Task()
    await Win()
    await Share()
    await GetData()
    await notify()
}

if ($cmp.isRequest) {
    GetToken()
    $cmp.done()
} else {
    Sign()
    $cmp.done()
}

function GetToken() {
    if ($request && $request.method == 'GET') {
        var TokenKeyValue = $request.headers['token']
        var UIDValue = $request.headers['uid']
        $cmp.write(UIDValue, UidKey)
        if ($cmp.read(TokenKey) != (undefined || null)) {
            if ($cmp.read(TokenKey) != TokenKeyValue) {
                var token = $cmp.write(TokenKeyValue, TokenKey)
                if (!token) {
                    $cmp.notify("更新" + TokenName + " Token 失败‼️", "", "")
                } else {
                    $cmp.notify("更新" + TokenName + " Token 成功 🎉", "", "")
                }
            }
        } else {
            var token = $cmp.write(TokenKeyValue, TokenKey);
            if (!token) {
                $cmp.notify("首次写入" + TokenName + " Token 失败‼️", "", "")
            } else {
                $cmp.notify("首次写入" + TokenName + " Token 成功 🎉", "", "")
            }
        }
    } else {
        $cmp.notify("写入" + TokenName + "Token 失败‼️", "", "配置错误, 无法读取请求头, ")
    }
}

function Checkin() {
    return new Promise(resolve => {
        const LotteryCheckin = {
            url: CheckinURL,
            headers: {
                "token" : $cmp.read('wclotterynew'),
                "uid" : $cmp.read('wcluid'),
            }
        }
        $cmp.get(LotteryCheckin, function(error, response, data) {
            try{
                if (error) {
                    datainfo.error = 1
                    datainfo.errormessage = error
                } else {
                    datainfo.checkin = JSON.parse(data)
                    let LotteryCheckindata = {
                        url: CheckindataURL,
                        headers: {
                            "token" : $cmp.read('wclotterynew'),
                            "uid" : $cmp.read('wcluid'),
                        }
                    }
                    $cmp.get(LotteryCheckindata, function(error, response, data) {
                        try{
                            const checkindata = JSON.parse(data)
                            let day = checkindata.data.cycle
                            datainfo.luckcoin = checkindata.data.sign_lucky[day - 1]
                            resolve('done')
                        } catch (e) {
                            $cmp.notify("活动抽奖签到结果"+e.name+"‼️", JSON.stringify(e), e.message)
                            resolve('done')
                        }
                    })
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动抽奖"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Join() {
    return new Promise(resolve => {
        const commonheaders = {
            "token" : $cmp.read('wclotterynew'),
            "uid" : $cmp.read('wcluid'),
        }
        const LotteryIndex = {
            url: IndexURL,
            headers: commonheaders
        }
        const LotteryIndex2 = {
            url: Index2URL,
            headers: commonheaders
        }
        datainfo.joinCnt = 0
        datainfo.skipedCnt = 0
        datainfo.failCnt = 0
        $cmp.get(LotteryIndex, function(error, response, data) {
            try{
                const index = JSON.parse(data)
                let list = index.data.mr_data
                for (var l of list) {
                    if (l.join_status == true) {
                        datainfo.skipedCnt += 1
                    } else {
                        const LotteryJoin = {
                            url: LotteryURL + l.id + '/join',
                            headers:  commonheaders,
                            body: { "template": "" }
                        }
                        $cmp.post(LotteryJoin, function (error, response, data) {
                            try{
                                const joindata = JSON.parse(data)
                                if (joindata.success == true) {
                                    datainfo.joinCnt += 1
                                } else {
                                    datainfo.failCnt += 1
                                    $cmp.log('\n' + l.sponsor_name + '：' + joindata.message.error)
                                }
                                resolve('done')
                            } catch (e) {
                                $cmp.notify("活动抽奖参与\"${l.sponsor_name}\"抽奖"+e.name+"‼️", JSON.stringify(e), e.message)
                                resolve('done')
                            }
                        })
                    }
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动抽奖获取抽奖列表"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
        $cmp.get(LotteryIndex2, function(error, response, data) {
            try{
                const index = JSON.parse(data)
                let list = index.data.tj_data
                for (var l of list) {
                    if (l.join_status == true) {
                        datainfo.skipedCnt += 1
                    } else {
                        const LotteryJoin = {
                            url: LotteryURL + l.id + '/join',
                            headers:  commonheaders,
                            body: { "template": "" }
                        }
                        $cmp.post(LotteryJoin, function (error, response, data) {
                            try{
                                const joindata = JSON.parse(data)
                                if (joindata.success == true) {
                                    datainfo.joinCnt += 1
                                } else {
                                    datainfo.failCnt += 1
                                    $cmp.log('\n' + l.sponsor_name + '：' + joindata.message.error)
                                }
                                resolve('done')
                            } catch (e) {
                                $cmp.notify("活动抽奖参与\"${l.sponsor_name}\"抽奖"+e.name+"‼️", JSON.stringify(e), e.message)
                                resolve('done')
                            }
                        })
                    }
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动抽奖获取抽奖列表"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
        if (luckgift) {
            const LotteryLuckGift = {
                url: LuckyGiftURL,
                headers: commonheaders
            }
            $cmp.get(LotteryLuckGift, function(error, response, data) {
                try{
                    const luckgiftindex = JSON.parse(data)
                    let lglist = luckgiftindex.data.hb_data
                    for (var lgl of lglist) {
                        if (lgl.join_status == 0) {
                            datainfo.skipedCnt += 1
                        } else {
                            const LotteryJoin = {
                                url: LotteryURL + lgl.id + '/join',
                                headers:  commonheaders,
                                body: { "template": "" }
                            }
                            $cmp.post(LotteryJoin, function (error, response, data) {
                                try{
                                    const joindata = JSON.parse(data)
                                    if (joindata.success == true) {
                                        datainfo.joinCnt += 1
                                    } else {
                                        datainfo.failCnt += 1
                                        $cmp.log('\n' + lgl.sponsor_name + '：' + joindata.message.error)
                                    }
                                    resolve('done')
                                } catch (e) {
                                    $cmp.notify("活动抽奖参与\"${lgl.sponsor_name}\"抽奖"+e.name+"‼️", JSON.stringify(e), e.message)
                                    resolve('done')
                                }
                            })
                        }
                    }
                    resolve('done')
                } catch (e) {
                    $cmp.notify("活动抽奖获取抽奖列表"+e.name+"‼️", JSON.stringify(e), e.message)
                    resolve('done')
                }
            })
        }
    })
}

function Exchange() {
    return new Promise(resolve => {
        const LotteryExchange = {
            url: ExchangeURL,
            headers: {
                "token" : $cmp.read('wclotterynew'),
                "uid" : $cmp.read('wcluid'),
            }
        }
        $cmp.post(LotteryExchange, function(error, response, data) {
            try{
                if (error) {
                    datainfo.exchangeerror = 1
                    datainfo.exchangeerrormessage = error
                } else {
                    datainfo.exchange = JSON.parse(data)
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动抽奖兑换结果"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Task() {
    return new Promise(resolve => {
        const commonheaders = {
            "token" : $cmp.read('wclotterynew'),
            "uid" : $cmp.read('wcluid'),
        }
        const LotteryGetTask = {
            url: GetTaskURL,
            headers: commonheaders
        }
        $cmp.get(LotteryGetTask, function(error, response, data) {
            try{
                const gettask = JSON.parse(data)
                datainfo.taskcoin = 0
                datainfo.taskCnt = 0
                datainfo.taskfailCnt = 0
                let newlist = gettask.data.task_new.list
                let daylist = gettask.data.task_day.list
                let weeklist = gettask.data.task_week.list
                for (var newl of newlist) {
                    const LotteryTask = {
                        url: TaskURL + newl.id,
                        headers:  commonheaders
                    }
                    $cmp.post(LotteryTask, function (error, response, data) {
                        try{
                            const task = JSON.parse(data)
                            if (task.success == true && task.data) {
                                datainfo.taskCnt += 1
                                datainfo.taskcoin += Number(task.data.lucky_count)
                            } else if (task.success == false) {
                                datainfo.taskfailCnt += 1
                                $cmp.log('\n' + newl.name + '：' + task.message.error)
                            }
                            resolve('done')
                        } catch (e) {
                            $cmp.notify("活动抽奖\"${newl.name}\"任务"+e.name+"‼️", JSON.stringify(e), e.message)
                            resolve('done')
                        }
                    })
                }
                for (var dayl of daylist) {
                    const LotteryTask = {
                        url: TaskURL + dayl.id,
                        headers:  commonheaders
                    }
                    $cmp.post(LotteryTask, function (error, response, data) {
                        try{
                            const task = JSON.parse(data)
                            if (task.success == true && task.data) {
                                datainfo.taskCnt += 1
                                datainfo.taskcoin += Number(task.data.lucky_count)
                            } else if (task.success == false) {
                                datainfo.taskfailCnt += 1
                                $cmp.log('\n' + dayl.name + '：' + task.message.error)
                            }
                            resolve('done')
                        } catch (e) {
                            $cmp.notify("活动抽奖\"${dayl.name}\"任务"+e.name+"‼️", JSON.stringify(e), e.message)
                            resolve('done')
                        }
                    })
                }
                for (var weekl of weeklist) {
                    const LotteryTask = {
                        url: TaskURL + weekl.id,
                        headers:  commonheaders
                    }
                    $cmp.post(LotteryTask, function (error, response, data) {
                        try{
                            const task = JSON.parse(data)
                            if (task.success == true && task.data) {
                                datainfo.taskCnt += 1
                                datainfo.taskcoin += Number(task.data.lucky_count)
                            } else if (task.success == false) {
                                datainfo.taskfailCnt += 1
                                $cmp.log('\n' + weekl.name + '：' + task.message.error)
                            }
                            resolve('done')
                        } catch (e) {
                            $cmp.notify("活动抽奖\"${weekl.name}\"任务"+e.name+"‼️", JSON.stringify(e), e.message)
                            resolve('done')
                        }
                    })
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动抽奖任务列表"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Win() {
    return new Promise(resolve => {
        const commonheaders = {
            "token" : $cmp.read('wclotterynew'),
            "uid" : $cmp.read('wcluid'),
        }
        const LotteryWin = {
            url: WinURL,
            headers: commonheaders
        }
        $cmp.get(LotteryWin, function(error, response, data) {
            try{
                const win = JSON.parse(data)
                datainfo.winCnt = 0
                datainfo.winmoney = 0
                datainfo.couponCnt = 0
                let winlist = win.data.data
                for (var winl of winlist) {
                    if (winl.sponsor_name == '活动抽奖福利君') {
                        const LotteryWin = {
                            url: LotteryURL + winl.id + '/split',
                            headers:  commonheaders
                        }
                        $cmp.post(LotteryWin, function (error, response, data) {
                            try{
                                const winmoney = JSON.parse(data)
                                if (winmoney.success == true) {
                                    datainfo.winCnt += 1
                                    datainfo.winmoney += Number(winmoney.data.money)
                                }
                                resolve('done')
                            } catch (e) {
                                $cmp.notify("活动抽奖\"${winl.sponsor_name}\"开奖"+e.name+"‼️", JSON.stringify(e), e.message)
                                resolve('done')
                            }
                        })
                    } else if (winl.sponsor_name == '活动抽奖') {
                        // to do
                    } else {
                        const LotteryInfo = {
                            url: LotteryURL + winl.id + '?qrcode_id=',
                            headers: commonheaders
                        }
                        $cmp.get(LotteryInfo, function (error, response, data) {
                            const linfo = JSON.parse(data)
                            if (linfo.data.bags_info.id) {
                                const LotteryWin = {
                                    url: CouponURL + linfo.data.bags_info.id,
                                    headers:  commonheaders
                                }
                                $cmp.post(LotteryWin, function (error, response, data) {
                                    try{
                                        const wincoupon = JSON.parse(data)
                                        if (wincoupon.success == true && wincoupon.data.data.mark == true) {
                                            datainfo.winCnt += 1
                                            datainfo.couponCnt += 1
                                        }
                                        resolve('done')
                                    } catch (e) {
                                        $cmp.notify("活动抽奖\"${winl.sponsor_name}\"开奖"+e.name+"‼️", JSON.stringify(e), e.message)
                                        resolve('done')
                                    }
                                })
                            }
                        })
                    }
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动抽奖任务列表"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function Share() {
    return new Promise(resolve => {
        const LotteryShare = {
            url: ShareURL,
            headers: {
                "token" : $cmp.read('wclotterynew'),
                "uid" : $cmp.read('wcluid'),
            }
        }
        $cmp.get(LotteryShare, function(error, response, data) {
            try{
                if (error) {
                    datainfo.shareerror = 1
                    datainfo.shareerrormessage = error
                } else {
                    datainfo.share = JSON.parse(data)
                }
                resolve('done')
            } catch (e) {
                $cmp.notify("活动抽奖分享"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })
}

function GetData() {
    return new Promise(resolve => {
        let LotteryData = {
            url: DataURL,
            headers: {
                "token" : $cmp.read('wclotterynew'),
            }
        }
        $cmp.get(LotteryData, function (error, response, data) {
            try {
                const obj = JSON.parse(data)
                datainfo.allluckcoin = obj.data.user_info.lucky_count;
                datainfo.luckmoney = obj.data.user_info.money;
                resolve ('done')
            } catch (e) {
                $cmp.notify("活动抽奖结果"+e.name+"‼️", JSON.stringify(e), e.message)
                resolve('done')
            }
        })
    })

}

function notify() {
    return new Promise(resolve => {
        try {
            let Title = '活动抽奖 - '
            let subTitle = ''
            let detail = ''
            let coupon = ''
            let em = ''
            let a = true
            if (datainfo.error == 1) {
                $cmp.log("wclcheckin failed response: \n" + datainfo.errormessage)
                Title += '签到接口请求失败️'
                em += '\n签到接口请求失败,详情请看日志。'
            } else if (datainfo.checkin) {
                if (datainfo.checkin.success == true) {
                    Title += '签到成功！🎉'
                    detail += '签到获得 ' + datainfo.luckcoin + ' 币，'
                } else if (datainfo.checkin.message.code == 1) {
                    Title += '重复签到！😊'
                } else if (datainfo.checkin.message.error == 'token expired') {
                    Title += 'Token 失效❗️'
                    em += '签到 Token 失效，请重新获取。'
                    a = false
                } else if (datainfo.checkin.message.error == 'token missing') {
                    Title += '未获取 Token⚠️️'
                    em += '请先获取 Token。'
                    a = false
                } else {
                    $cmp.log("wclcheckin failed response: \n" + JSON.stringify(datainfo.checkin))
                    Title += '签到失败‼️'
                    em += '\n签到失败：' + datainfo.checkin.message.error + '，详情请看日志。'
                }
            }
            if (datainfo.shareerror == 1) {
                $cmp.log("wclshare failed response: \n", datainfo.shareerrormessage)
                subTitle += '分享失败 '
                em += '\n分享接口请求失败，详情请看日志。'
            } else if (datainfo.share) {
                if (datainfo.share.success == true) {
                    subTitle += '分享成功 '
                    detail += '分享获得 ' + datainfo.share.data.count + ' 币，'
                } else if (datainfo.share.message.code == 1) {
                    subTitle += '分享重复 '
                } else if (datainfo.share.message.error == 'token missing' || datainfo.share.message.error == 'token expired') {

                } else {
                    $cmp.log("wclshare failed response: \n" + JSON.stringify(datainfo.share))
                    subTitle += '分享失败 '
                    em += '\n分享失败：' + datainfo.share.message.error + '，详情请看日志。'
                }
            }
            if (datainfo.taskCnt > 0) {
                subTitle += '任务 ' + datainfo.taskCnt + ' 个 '
                detail += '任务获得 ' + datainfo.taskcoin + ' 币，'
            }
            if (datainfo.taskfailCnt > 0) {
                em += '\n任务失败共' + datainfo.taskfailCnt + ' 个，详情请看日志。'
            }
            if (datainfo.exchangeerror == 1) {
                $cmp.log("wclexchange failed response: \n", datainfo.exchangeerrormessage)
                subTitle += '兑换失败 '
                em += '\n兑换接口请求失败，详情请看日志。'
            } else if (datainfo.exchange) {
                if (datainfo.exchange.success == true) {
                    subTitle += '兑换成功 '
                    detail += '花费 20 币兑换获得 ' + datainfo.exchange.data.money + ' 元，'
                } else if (datainfo.exchange.message.code == 1) {
                    subTitle += '兑换重复 '
                } else if (datainfo.exchange.message.error == 'token missing' || datainfo.exchange.message.error == 'token expired') {

                } else {
                    $cmp.log("wclexchange failed response: \n" + JSON.stringify(datainfo.exchange))
                    subTitle += '兑换失败 '
                    em += '\n兑换失败：' + datainfo.exchange.message.error + '，详情请看日志。'
                }
            }
            if (datainfo.winCnt > 0) {
                subTitle += '中奖 ' + datainfo.winCnt + ' 个 '
                if (datainfo.winmoney > 0) {
                    detail += '中奖获得 ' + datainfo.winmoney.toFixed(2) + ' 元，'
                }
                if (datainfo.couponCnt > 0) {
                    coupon += '\n中奖获得 ' + datainfo.couponCnt + ' 张券，详情请进入小程序查看（大概率无用）'
                }
            }
            if (a) {
                detail += '账户共有 ' + datainfo.allluckcoin + " 币及 " + datainfo.luckmoney + " 元。💰"
            }
            if (datainfo.joinCnt > 0) {
                subTitle += '参与抽奖 ' + datainfo.joinCnt + ' 个 '
            }
            if (datainfo.failCnt > 0 ) {
                em += '\n抽奖失败共' + datainfo.failCnt + ' 个，详情请看日志。'
            }
            if (datainfo.skipedCnt > 0) {
                detail += '\n跳过 ' + datainfo.skipedCnt +' 个已参与的抽奖。'
            }
            $cmp.notify(Title, subTitle, detail + coupon + em)
            resolve('done')
        } catch (e) {
            $cmp.notify("通知模块 " + e.name + "‼️", JSON.stringify(e), e.message)
            resolve('done')
        }
    })
}

function compatibility() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
    const isNode = typeof require == "function" && !isJSBox;
    const node = (() => {
        if (isNode) {
            const request = require('request');
            return ({request})
        } else {
            return (null)
        }
    })()
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (isNode) log(title+subtitle+message)
        if (isJSBox) $push.schedule({title: title, body: subtitle?subtitle+"\n"+message:message})
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
        if (isNode) {
            node.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data);
                callback(error, adapterStatus(resp.response), body)
            };
            $http.get(options);
        }
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options);
        }
    }
    const log = (message) => console.log(message)
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return { isQuanX, isSurge, isJSBox, isRequest, notify, write, read, get, post, log, done }
}