const tel = "";

//上行引号内填入联通号码，使用前请登陆一次联通支付宝小程序
//有问题请通过Telegram反馈 https://t.me/Leped_Bot
var remainTime = "-";
var remainFee = "-";
var remainFlow = "-";
var queryTime = "-";
let used = [0, 0, 0];
let quota = [1, 1, 1];
let remain = [1, 1, 1];
let pieData = [[], [], [], []];
async function launch() {
    await get_basic(tel);
    $done();
}

launch()

function get_basic(tel) {
    let basic = {
        url: "https://mina.10010.com/wxapplet/bind/getIndexData/alipay/alipaymini?user_id=" + tel,
        headers: {},
    }
    $httpClient.get(basic, async function (error, response, data) {
        if (error) {
            console.log(error);
            $notification.post("10010", tel + '登录失败', error,);
        } else {
            //var remainFee = data.dataList[0].number;
            //$notification.post(remainFee);
            var obj = JSON.parse(data);
            remainFee = obj.dataList[0].number;
            remainTime = obj.dataList[2].number;
            //console.log(obj);
            //$notification.post(remainFee, remainTime);
            await get_detail(remainFee, remainTime, tel)
        }
    });
}

function get_detail(remainFee, remainTime, tel) 
{
    let data = {
        url: "https://mina.10010.com/wxapplet/bind/getCombospare/alipay/alipaymini?stoken=&user_id=" + tel,
        headers: {
        },
    }
    $httpClient.get(data, async function (error, response, data) {
        if (error) {
            console.log(error);
            $notification.post("10010", tel + '登录失败', error);
        } else {
            //var remainFee = data.dataList[0].number;
            //$notification.post(remainFee);
            var obj1 = JSON.parse(data);
            //console.log(obj1);
            queryTime = obj1.queryTime;
            let det = obj1.woFeePolicy;
            //$notification.post(queryTime);
            console.log(det);
            (used = [0, 0, 0]), (quota = [0, 0, 0]), (remain = []);
            for (const i in det) {
                if (i == "indexVf") {
                    $notification.post("error", "AOBH! Restart or Clear APP Cache!", "");
                    return;
                }
                let allVal = det[i].addUpUpper;
                if (allVal != 0) {
                    let type = det[i].elemType,
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
            const setUnit = i => {
                if (i < 1024) return i.toFixed(2) + " MB";
                else return (i / 1024).toFixed(2) + " GB";
            };
            let rFlow = setUnit(remain[2]).split(" ");
            $notification.post("10010", "截止至 " + queryTime, "剩余语音 " + remainTime + "分" + "\n话费余额 " + remainFee + "元" + "\n流量剩余 " + rFlow[0] + rFlow[1]);
        }
    });
}