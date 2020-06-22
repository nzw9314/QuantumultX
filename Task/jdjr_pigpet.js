


//直接用NobyDa的jd cookie
const cookie = $prefs.valueForKey('CookieJD')
const name = '京东金融养猪猪'
const riskDeviceParam = '{"eid":"6SKBMUMVTFW7SZWJNOUAQTHDZQKR33O3NEN7VXMYKUTMCSPTP76PXZGGFEBLQUYAREEFCV3GCFEUGWQKFX6HM7DNIU","fp":"3fb5ce1c99c6460f36f9fee4e371b13d","sdkToken":"jdd01PSGPMTEGQ63URA2LPS46IKGMC7EZ4X6F7UYOK57Z7J6IY3K6NXLOLQ7H3CUG3RN365XM633NJZ4MK7KQQFC3XTUO4DF4RJ3R2HQYWCI01234567","token":"7GEZQ6DOTYLKVQYD64BHXESJWVYZ4DGDXSEUKT3OD72LUGTVHHFZKPV6PZWIZVNYUHG3E2VBWWFZS","jstub":"E37S6JKIWQTHZJR6ZIB5PTKZLREML3EIL5THKNWOVASOASWAHAZMHC6XZKFRIHUWOMEMR3C3WMUQY6TA7SL4J5V2GMAJMLMORN65YCA"}'
var Task = step();
Task.next();
function* step() {
    let message = ''
    //判断有没有登录
    if (!cookie) {
        //todo
        return
    }
    //需要获取一次riskDeviceParam
    if (!riskDeviceParam) {
        //todo
        return
    }

    let loginResult = yield login()
    console.log(`loginResult,${JSON.stringify(loginResult)}`)

    if (loginResult.resultData.resultCode != 0) {

    }
    //获取任务列表
    let missionList = yield pigPetMissionList()
    console.log(`missionList,${JSON.stringify(missionList)}`)

    if (missionList.resultCode != 0) {
        //todo
        return
    }
    if (missionList.resultData.resultCode != 0) {
        //todo
        return
    }
    for (let mission of missionList.resultData.resultData.missions) {
        console.log(`${mission.missionName}`)
        if (mission.status == 3) {
            var missionId = /(\d+)/.exec(mission.mid)[1]
            let queryMissionResult = yield queryMissionReceiveAfterStatus(missionId)
            console.log(`${mission.missionName}queryMissionReceiveAfterStatus结果${JSON.stringify(queryMissionResult)}`)
            let finishReadMissionResult = yield finishReadMission(missionId)

            console.log(`${mission.missionName}结果${JSON.stringify(finishReadMissionResult)}`)
            let doMissionResult = yield pigPetDoMission(mission.mid)
            console.log(`领取${mission.missionName}结果2${JSON.stringify(doMissionResult)}`)
        } else if (mission.status == 4) {
            let doMissionResult = yield pigPetDoMission(mission.mid)
            console.log(`领取${mission.missionName}结果2${JSON.stringify(doMissionResult)}`)
        }

    }
    console.log('结束')
}
// https://ms.jr.jd.com/gw/generic/mission/h5/m/queryMissionReceiveAfterStatus?reqData={%22missionId%22:%22347%22}
//  `${}reqData=${escape(JSON.stringify(body))}`
function queryMissionReceiveAfterStatus(missionId) {
    request(`https://ms.jr.jd.com/gw/generic/mission/h5/m/queryMissionReceiveAfterStatus?reqData=${escape(JSON.stringify({ missionId: missionId }))}`)
}

function pigPetDoMission(mid) {
    requestPost(`https://ms.jr.jd.com/gw/generic/uc/h5/m/pigPetDoMission?_=${Date.now()}`, { mid: mid })
}

function finishReadMission(missionId) {
    console.log(`missionId:${missionId}`)
    requestPost(`https://ms.jr.jd.com/gw/generic/mission/h5/m/finishReadMission`, { missionId: missionId, readTime: 10 })
}

function pigPetMissionList() {
    requestPost(`https://ms.jr.jd.com/gw/generic/uc/h5/m/pigPetMissionList?_=${Date.now()}`, {})
}

function login() {
    requestPost(`https://ms.jr.jd.com/gw/generic/uc/h5/m/pigPetLogin?_=${Date.now()}`, {
        shareId: "",
        helpId: "",
        cardId: "",
    })
}

function request(url) {
    $task.fetch({
        url: url,
        headers: {
            Cookie: cookie,
        },
        method: "GET",
    }).then(
        (response) => {
            return JSON.parse(response.body)
        },
        (reason) => console.log(reason.error, reason)
    ).then((response) => sleep(response))
}

function requestPost(url, body, ContentType) {
    body.channelLV = ""
    body.source = 2
    body.riskDeviceParam = riskDeviceParam

    $task.fetch({
        url: url,
        body: `reqData=${escape(JSON.stringify(body))}`,
        headers: {
            Cookie: cookie,
            reqSource: 'h5',
            'Content-Type': ContentType,
        },
        method: "POST",
    }).then(
        (response) => {
            return JSON.parse(response.body)
        },
        (reason) => console.log(reason.error, reason)
    ).then((response) => sleep(response))
}

function sleep(response) {
    console.log('休息一下');
    setTimeout(() => {
        console.log('休息结束');
        Task.next(response)
    }, 3000);
}