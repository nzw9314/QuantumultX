var tel = "";
//上行引号内填入联通号码，使用前请登陆一次联通支付宝小程序
//有问题请通过Telegram反馈 https://t.me/Leped_Bot
var remainTime = "-";
var remainFee = "-";
var remainFlow = "-";
var queryTime = "-";

function get_basic(tel) {
    console.log("get_basic")
    let basicurl = {
        url: "https://mina.10010.com/wxapplet/bind/getIndexData/alipay/alipaymini?user_id=" + tel,
        headers: {},
    };
    $task.fetch(basicurl).then(response => {
        console.log(response.body)
        var obj = JSON.parse(response.body);
        remainFee = obj.dataList[0].number;
        remainTime = obj.dataList[2].number;
        get_detail(remainFee, remainTime, tel)
    }, reason => {
    $notify("10010", tel + '登录失败', reason.error);
    });
}

function get_detail(remainFee, remainTime, tel) {
    let used = [0, 0, 0];
    let quota = [1, 1, 1];
    let remain = [1, 1, 1];
    let pieData = [
        [],
        [],
        [],
        []
    ];
    let dataurl = {
        url: "https://mina.10010.com/wxapplet/bind/getCombospare/alipay/alipaymini?stoken=&user_id=" + tel,
        headers: {},
    };
    $task.fetch(dataurl).then(response => {
        var obj1 = JSON.parse(response.body);
        queryTime = obj1.queryTime;
        var det = obj1.woFeePolicy;
        console.log(det);
        (used = [0, 0, 0]), (quota = [0, 0, 0]), (remain = []);
        for (const i in det) {
            if (i == "indexVf") {
                $notification.post("error", "AOBH! Restart or Clear APP Cache!", "");
                return;
            }
            var allVal = det[i].addUpUpper;
            if (allVal != 0) {
                var type = det[i].elemType,
                    useVal = det[i].xUsedValue,
                    typeName = det[i].feePolicyName,
                    canUseVal = det[i].canUseResourceVal,
                    unit = det[i].totalUnitVal;
                if (type == 3) {
                    quota[2] += parseFloat(allVal);
                    if (canUseVal != 0) {
                        if (det[i].canUseUnitVal == "GB") canUseVal = canUseVal * 1024;
                        pieData[2].push([typeName, Number(canUseVal), "MB"]);
                    }
                    if (useVal != 0) {
                        if (det[i].usedUnitVal == "GB") useVal = useVal * 1024;
                        used[2] += parseFloat(useVal);
                        pieData[2].unshift([typeName + " 已用", Number(useVal), "MB"]);
                    }
                } else {
                    quota[type - 1] += parseInt(allVal);
                    used[type - 1] += parseInt(useVal);
                    if (canUseVal != 0)
                        pieData[type - 1].push([typeName, Number(canUseVal), unit]);
                    if (useVal != 0)
                        pieData[type - 1].unshift([
                            typeName + " 已用",
                            Number(useVal),
                            unit
                        ]);
                }
            }
        }
        used.forEach((ele, i) => {
            remain.push(quota[i] - ele);
        });
        var setUnit = i => {
            if (i < 1024) return i.toFixed(2) + " MB";
            else return (i / 1024).toFixed(2) + " GB";
        };
        var rFlow = setUnit(remain[2]).split(" ");
        $notify("10010", "截止至 " + queryTime, "剩余语音 " + remainTime + "分" + "\n话费余额 " + remainFee + "元" + "\n流量剩余 " + rFlow[0] + rFlow[1]);
    }, reason => {
    $notify("10010", tel + '登录失败', reason.error);
    });
}

get_basic(tel)