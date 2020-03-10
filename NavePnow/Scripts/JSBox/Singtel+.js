let Authorization = "";

let Cookie = "";


// 1. 利用 thor 进行 hi!App 软件的抓包测试（打开thor-> 打开 hi!App -> 数据加载完成 -> 结束抓包）
// 2. 在网络请求中找到 https://hiapp.aws.singtel.com/api/v2/usage/dashboard
// 3. 记下请求头中的 Authorization 和 Cookie， 代替脚本中的关键词
// 作者 NavePnow 有问题请通过Telegram反馈 https://t.me/DarrenLepe_ent

let queryTime = "-";

let miniData = [
    ["Balance", "?", "$"],
    ["Data", "?", "GB"],
    ["Calls", "?", "MINS"],
    ["SMS", "?", "SMS"]
];

let feeLabel = $objc("UILabel").invoke("alloc.init");
feeLabel.invoke("setFont", $font(18));

let Micheal = $objc("UILabel").invoke("alloc.init");
let Gabriel = $objc("UILabel").invoke("alloc.init");
let Lucifer = $objc("UILabel").invoke("alloc.init");
let Evan = $objc("UILabel").invoke("alloc.init");
setupMiniLabel(miniData[0], Micheal);
setupMiniLabel(miniData[1], Gabriel);
setupMiniLabel(miniData[2], Lucifer);
setupMiniLabel(miniData[3], Evan);


$http.get({
    url: 'https://hiapp.aws.singtel.com/api/v2/usage/dashboard',
    header: {
        "Authorization": Authorization,
        "Cookie": Cookie,
        "Content-Type": "application/json",
        "X-APP-DEVICE-PLATFORM": "iOS",
        "X-APP-DEVICE-VERSION": "13.3.1",
        "X-APP-VERSION": "3.2.2",
    },
    handler: function (resp) {
        let obj = resp.data;
        console.log(obj)
        var number = obj.accountInfo.number;
        var balance = obj.accountInfo.balance;
        var expiry = obj.accountInfo.expiry;
        var total_text = "MAIN ACCOUNT " + number + " " + balance + " " + expiry;
        var local_data = obj.cards[0].items[0].amount;
        queryTime = obj.accountInfo.expiry;

        var i = 0;
        var local_calls;
        var local_sms;
        var idd_calls;
        for (var i; i < obj.cards[1].items.length; i++) {
            if (obj.cards[1].items[i].description == "LOCAL CALLS") local_calls = obj.cards[1].items[i].amount;
            if (obj.cards[1].items[i].description == "LOCAL SMS") local_sms = obj.cards[1].items[i].amount;
            if (obj.cards[1].items[i].description == "IDD CALLS") idd_calls = obj.cards[1].items[i].amount;
        }
        miniData[0][1] = balance.replace("$", "");
        miniData[1][1] = local_data;
        miniData[2][1] = local_calls;
        miniData[3][1] = local_sms;
        updateStatus();
    }
});

const updateStatus = () => {
    $delay(0.0, () => {
        $("super")
            .runtimeValue()
            .$layoutSubviews();
    });
    $("banner").views[0].text = `${queryTime}`;
    setupMiniLabel(miniData[0], Micheal);
    setupMiniLabel(miniData[1], Gabriel);
    setupMiniLabel(miniData[2], Lucifer);
    setupMiniLabel(miniData[3], Evan);

};

function setupMiniLabel(arr, miniLabel) {
    let miniText = `${arr[0]}\n ${arr[1]} ${arr[2]}`;
    let string = $objc("NSMutableAttributedString").invoke(
        "alloc.initWithString",
        miniText
    );
    string.invoke(
        "setAlignment:range:",
        $align.center,
        $range(0, string.invoke("length"))
    );
    string.invoke(
        "addAttribute:value:range:",
        "NSFont",
        $font("HiraMinProN-W3", 20),
        $range(miniText.indexOf(arr[0]), arr[0].length)
    );
    string.invoke(
        "addAttribute:value:range:",
        "NSFont",
        $font("Georgia-Bold", 18),
        $range(miniText.indexOf(arr[1]), arr[1].length)
    );
    string.invoke(
        "addAttribute:value:range:",
        "NSFont",
        $font("HiraMinProN-W3", 16),
        $range(miniText.indexOf(arr[2]), arr[2].length)
    );
    string.invoke(
        "addAttribute:value:range:",
        "NSColor",
        $color("darkGray"),
        $range(0, string.invoke("length"))
    );
    string.invoke(
        "addAttribute:value:range:",
        "NSColor",
        $color("black"),
        $range(miniText.indexOf(arr[1]), arr[1].length)
    );
    let para = $objc("NSMutableParagraphStyle").invoke("alloc.init");
    para.invoke("setParagraphSpacing", 5);
    para.invoke("setAlignment", $align.center);
    string.invoke(
        "addAttribute:value:range:",
        "NSParagraphStyle",
        para,
        $range(0, string.invoke("length"))
    );
    miniLabel.invoke("setAttributedText", string);
}

$ui.render({
    props: {
        id: "super",
        title: "Singtel+",
    },
    layout: $layout.fillSafeArea,
    events: {
        layoutSubviews: view => {
            if ($app.env == $env.today) {
                $ui.animate({
                    duration: 0.3,
                    animation: () => {
                        $("banner").updateLayout((make, view) => {
                            make.bottom.equalTo(view.super.top).offset(view.super.frame.height);
                            make.height.equalTo(view.super.frame.height);
                        });
                        $("banner").relayout();
                        if ($("blur")) $("blur").alpha = 0;
                    },
                    completion: () => {
                        if ($("blur")) $("blur").remove();
                    }
                });
            }
        }
    },
    views: [{
        type: "view",
        props: {
            id: "banner",
            bgcolor: $rgba(255, 255, 255, 0.28)
        },
        layout: (make, view) => {
            make.left.right.inset(0);
            make.bottom.equalTo(view.super.top);
        },
        views: [{
            type: "label",
            props: {
                text: "Loading…",
                textColor: $color("darkGray"),
                font: $font("HiraMinProN-W3", 12)
            },
            layout: (make, view) => {
                make.centerX.equalTo(view.super);
                make.top.inset(0);
            }
        },
        {
            type: "runtime",
            props: {
                view: Micheal,
                lines: 2,
                align: $align.center
            },
            layout: (make, view) => {
                make.height.equalTo(view.super);
                make.width.equalTo(view.super).dividedBy(4);
                make.left.top.inset(0);
            }
        },
        separateLine(),
        {
            type: "runtime",
            props: {
                view: Gabriel,
                lines: 2,
                align: $align.center
            },
            layout: (make, view) => {
                make.height.equalTo(view.super);
                make.width.equalTo(view.super).dividedBy(4);
                make.left.equalTo(90);
            }
        },
        separateLine(),
        {
            type: "runtime",
            props: {
                view: Lucifer,
                lines: 2,
                align: $align.center
            },
            layout: (make, view) => {
                make.height.equalTo(view.super);
                make.width.equalTo(view.super).dividedBy(4);
                make.left.equalTo(180);
            }
        },
        separateLine(),
        {
            type: "runtime",
            props: {
                view: Evan,
                lines: 2,
                align: $align.center
            },
            layout: (make, view) => {
                make.height.equalTo(view.super);
                make.width.equalTo(view.super).dividedBy(4);
                make.right.top.inset(0);
            }
        }
        ]
    }
    ]
});

function separateLine() {
    return {
        type: "label",
        props: {
            radius: 1,
            bgcolor: $color("darkGray")
        },
        layout: (make, view) => {
            make.width.equalTo(1);
            make.height.equalTo(view.super).multipliedBy(0.6);
            make.left.equalTo(view.prev.right).offset(-0.5);
            make.centerY.equalTo(view.super);
        }
    };
}
