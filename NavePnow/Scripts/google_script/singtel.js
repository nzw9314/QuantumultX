/*
Your personal Singtel bot
Description :
1. Create a bot from [BotFather](https://telegram.me/BotFather) and replace BOT_TOKEN with token received from bot father
2. Get your personal chat id from https://telegram.me/get_id_bot and replace CHAT_ID with it
3. Install http capture app like [HTTP Catcher](https://apps.apple.com/us/app/http-catcher/id1445874902) on your phone
4. Install [hi!App](https://apps.apple.com/us/app/singtel-prepaid-hi-app/id1034712778) app from app store and log in by your phone number
5. Open the http capture app and refresh the hi!App (reopen)
6. Find request `https://hiapp.aws.singtel.com/api/v2/usage/dashboard`
7. Write down `Authorization` and `Cookie` and replace them in the script
8. Copy all content to the `Google Script Editor`
9. Set a proper time to trigger it

Feedback: https://t.me/Leped_Bot

*/

var token = 'BOT_TOKEN';
var chat_id = "CHAT_ID";
var Authorization = 'AUTH';
var Cookie = 'COOKIE';

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

function getMe(id, text) {
    var response = UrlFetchApp.fetch(url + "/getMe");
    Logger.log(response.getContentText())
    //parse_mode = parse_mode || '';
    //return this.getResponse("sendMessage", {chat_id: ''+chatId, text: text, parse_mode: parse_mode}).getContentText();
}

function getUpdates(id, text) {
    var response = UrlFetchApp.fetch(url + "/getUpdates");
    Logger.log(response.getContentText())
    //parse_mode = parse_mode || '';
    //return this.getResponse("sendMessage", {chat_id: ''+chatId, text: text, parse_mode: parse_mode}).getContentText();
}

function singtel() {
    var formData = {
        'Authorization': Authorization,
        'Content-Type': 'application/json',
        'Cookie': Cookie,
        'X-APP-DEVICE-PLATFORM': 'iOS',
        'X-APP-DEVICE-VERSION': '13.3.1',
        'X-APP-VERSION': '3.2.2'
    }
    var options = {
        'method': 'get',
        'headers': formData
    };
    var response = UrlFetchApp.fetch('https://hiapp.aws.singtel.com/api/v2/usage/dashboard', options);
    if (!response) {
        originalData("Singtel error: failed to fetch data!");
    } else {
        //Logger.log(response.getContentText())
        var obj = JSON.parse(response.getContentText());
        //Logger.log(obj)
        var number = obj.accountInfo.number;
        var balance = obj.accountInfo.balance;
        var expiry = obj.accountInfo.expiry;
        var total_text = "MAIN ACCOUNT " + number + " " + balance + " " + expiry;
        var local_data = obj.cards[0].items[0].amount;
        var i = 0;
        var local_calls;
        var local_sms;
        var idd_calls;
        for (var i; i < obj.cards[1].items.length; i++) {
            if (obj.cards[1].items[i].description == "LOCAL CALLS") local_calls = obj.cards[1].items[i].amount;
            if (obj.cards[1].items[i].description == "LOCAL SMS") local_sms = obj.cards[1].items[i].amount;
            if (obj.cards[1].items[i].description == "IDD CALLS") idd_calls = obj.cards[1].items[i].amount;
        }
        Logger.log(i)
        Logger.log(local_data)
        Logger.log(local_calls)
        Logger.log(local_sms)
        Logger.log(idd_calls)
        var info_text;
        if(idd_calls) info_text= "\*Singtel* 90508390\n" + balance + " " + expiry + " \nLOCAL DATA: " + local_data + "\nLOCAL CALLS: " + local_calls + "\nLOCAL SMS: " + local_sms + "\nIDD CALLS: " + idd_calls;
        else info_text= "\*Singtel* 90508390\n" + balance + " " + expiry + " \nLOCAL DATA: " + local_data + "\nLOCAL CALLS: " + local_calls + "\nLOCAL SMS: " + local_sms;
        originalData(info_text);

    }
}
