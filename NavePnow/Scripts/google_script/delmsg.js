/*
Server Info
 
关于作者

NavePnow
    Telegram: NavePnow
    GitHub: NavePnow
*/

var token = '';
var chat_id = "";

var url = "https://api.telegram.org/bot" + token;

var excel_url = 'https://docs.google.com/spreadsheets/d/XXXXX'
var name = 'tg'
var SpreadSheet = SpreadsheetApp.openByUrl(excel_url);
var SheetName = SpreadSheet.getSheetByName(name);
var LastRow = SheetName.getLastRow();

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

    console.log(UrlFetchApp.fetch(url + "/", options))
}

function deleteMsg() {
    var options = {
        'method': 'get',
    };

    // print wipe memory
    var startRst = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + chat_id + "&text=Memories%20are%20wiped%20now!", options);
    startID = JSON.parse(startRst.getContentText()).result.message_id;

    // delete welcome to eastworld
    endID = SheetName.getSheetValues(1, 1, 1, 1)[0][0];
    try {
        UrlFetchApp.fetch(url + "/deleteMessage?chat_id=" + chat_id + "&message_id=" + endID, options);
    } catch (e) {
    }

    // delete message
    value = 0
    var dataResults = UrlFetchApp.fetch(url + "/getUpdates", options);
    var data = JSON.parse(dataResults.getContentText()).result;
    while (data != "") {
        for (i = 0; i < data.length; i++) {
            try {
                rst = UrlFetchApp.fetch(url + "/deleteMessage?chat_id=" + chat_id + "&message_id=" + data[i].message.message_id, options);
            } catch (e) {
                //count += 1
                //if (count >= 3) break;
            }
        }

        // update link for getUpdate
        value = data[data.length - 1].update_id + 1
        updateResults = UrlFetchApp.fetch(url + "/getUpdates?offset=" + value, options);
        data = JSON.parse(updateResults.getContentText()).result;
    }

    // delete wipe memory
    UrlFetchApp.fetch(url + "/deleteMessage?chat_id=" + chat_id + "&message_id=" + startID, options);

    // print welcome to eastworld
    var endRst = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + chat_id + "&text=Welcome%20to%20Eastworld!", options);
    endID = JSON.parse(endRst.getContentText()).result.message_id;
    SheetName.getRange(LastRow, 1).setValue(endID);
}

