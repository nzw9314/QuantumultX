/*
Server Info
 
关于作者

NavePnow
    Telegram: NavePnow
    GitHub: NavePnow
*/

var token = "";
var chat_id = "";
var api = "";

var url = "https://api.telegram.org/bot" + token;

function originalData(estring) {
    var payload = {
        "method": "sendMessage",
        "chat_id": chat_id,
        "text": estring,
        "parse_mode": "Markdown",
    };
    sendMsg(payload)
}

function sendMsg(payload) {
    var options = {
        'method': 'post',
        'payload': payload
    };

    UrlFetchApp.fetch(url + "/", options)
}

var server_url = "https://nodequery.com/api/servers?api_key=" + api;

function launch() {
    getInfo(server_url)
}

function getInfo(server_url) {
    var options = {
        'method': 'get',
    };
    var dataResults = UrlFetchApp.fetch(server_url, options);
    var data = JSON.parse(dataResults.getContentText());
    if (data.status == "OK") {
        var length = data.data[0].length;
        var server = data.data[0]
        for (var i = 0; i < length; i++) {
            tmp = server[i]
            id = Math.round(parseInt(tmp.id));
            name = tmp.name;
            load_percent = tmp.load_percent;
            ram_total = Math.round(tmp.ram_total / Math.pow(1024, 2));
            ram_usage = Math.round(tmp.ram_usage / Math.pow(1024, 2));
            disk_total = Math.round(tmp.disk_total / Math.pow(1024, 3));
            disk_usage = Math.round(tmp.disk_usage / Math.pow(1024, 3));

            getDetails(id, name, load_percent, ram_total, ram_usage, disk_total, disk_usage)
        }
    } else {
        originalData("*NodeQuery*\n" + '获取信息失败');
    }
}

function getDetails(id, name, load_percent, ram_total, ram_usage, disk_total, disk_usage) {
    var detail_url = "https://nodequery.com/api/servers/" + id + "?api_key=" + api;
    var options1 = {
        'method': 'get',
    };
    var dataResults = UrlFetchApp.fetch(detail_url, options1);
    var data = JSON.parse(dataResults.getContentText());
    if (data.status == "OK") {
        var details = data.data[0];
        processes = details.processes_array;
        swap_total = Math.round(details.swap_total / Math.pow(1024, 2));
        swap_usage = Math.round(details.swap_usage / Math.pow(1024, 2));
        Logger.log(processes)
        proc = ""
        for (var i = 0; i < 5; i++) {
            tmp_proc = processes[i].command + '\n';
            proc += tmp_proc;
        }
        originalData("*" + name + "*\n" + 'Load: *' + load_percent + "%*\nRAM: *" + ram_usage + 'MB* of ' +
            ram_total + 'MB\nSwap: *' + swap_usage + 'MB* of ' + swap_total + 'MB\nDisk: *' + disk_usage + 'GB* of ' + disk_total + 'GB\nProcesses: \n' +
            proc);

        Logger.log(proc)

    } else {
        originalData("*NodeQuery*\n" + '获取信息失败');
    }
}