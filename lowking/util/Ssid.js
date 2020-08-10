const SSID = $network.wifi.ssid;
const proxywifi = !$persistentStore.read("lkWifiSsids")?["ssid填这里！！！","这是第二个ssid"]:JSON.parse($persistentStore.read("lkWifiSsids"));
let res = proxywifi.some(val => val === (!!SSID ? SSID : "cellular"));
let lkWifiLast = !$persistentStore.read("lkWifiLast")?"abcdefghijklmnopqrstuvwxyz":$persistentStore.read("lkWifiLast");
if (lkWifiLast!=(!!SSID ? SSID : "cellular")){
    !$persistentStore.write((!!SSID ? SSID : "cellular"), "lkWifiLast")
    if (res) {
        $surge.setOutboundMode("direct");
        notify(1);
    } else {
        $surge.setOutboundMode("rule");
        notify(0);
    }
}

function notify(mode) {
    setTimeout(function () {
        !!mode ? $notification.post("Wi-Fi助手", "切换到【直接连接】", `${!!SSID ? "你的Wi-Fi：【" + SSID + "】" : "你正在使用流量"}`) : $notification.post("Wi-Fi助手", "切换到【规则模式】", `${!!SSID ? "你的Wi-Fi：【" + SSID + "】" : "你正在使用流量"}`)
    })
}

$done();