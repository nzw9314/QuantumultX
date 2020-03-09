const EARTH_RADIUS = 6378.137
function GetLocation(){
    let available = $location.available;
    if (available)
    {
        $location.fetch({
            handler: function (resp) {
                var lat = resp.lat
                var lng = resp.lng
                GetNearestLoc(lat, lng)
            }
        }
        )
    }
    else
    {
        ui.toast("获取位置信息失败！")
    }
}
function rad(data){
    return data * Math.PI / 180.0
}

function GetNearestLoc(lat, lng){
    $http.get({
        url: "https://nnextbus.nus.edu.sg/BusStops",
        header: {
            "Authorization": "Basic TlVTbmV4dGJ1czoxM2RMP3pZLDNmZVdSXiJU",
        },
        handler: function (resp) {
            let data = resp.data;
            let name = ""
            let distance = 0;
            if (data.errmsg) {
                alert(data.errmsg);
                return;
            }
            data = resp.data.BusStopsResult.busstops
            // console.log(data)
            count = data.length
            for( let i = 0; i < count; i++){
                tmp_lat = data[i].latitude
                tmp_lng = data[i].longitude
                radLat1 = rad(tmp_lat);
                radLat2 = rad(lat);
                a = radLat1 - radLat2;
                b = rad(tmp_lng) - rad(lng);
                s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                s = s * EARTH_RADIUS;
                tmp_distance = Math.round(s * 10000) / 10000;
                if (i == 0) distance = tmp_distance;
                if (tmp_distance < distance){
                    distance = tmp_distance;
                    name = data[i].name;
                    caption = data[i].caption;
                }
            }
            GetInfo(name, caption)

        }
    });
}

function GetInfo(name, caption){
    $http.get({
        url: "https://nnextbus.nus.edu.sg/ShuttleService?busstopname=" + name,
        header: {
            "Authorization": "Basic TlVTbmV4dGJ1czoxM2RMP3pZLDNmZVdSXiJU",
        },
        handler: function (resp) {
            if (resp.data.errmsg) {
                alert(data.errmsg);
                return;
            }
            let time = resp.data.ShuttleServiceResult.TimeStamp;
            time = time.substring(11, 19)
            data = resp.data.ShuttleServiceResult.shuttles
            count = data.length
            $("BusList").data = [];
            $("BusList").hidden = false;
            $("BusList").data = $("BusList").data.concat({
                label: {
                    text: caption.padEnd(40) + time,
                }
            });
            for (let i = 0; i < count; i++) {
                // A1 33min 63min
                name = data[i].name;
                arrivalTime = data[i].arrivalTime;
                nextArrivalTime = data[i].nextArrivalTime
                string = name.padEnd(25, " ")  + arrivalTime.padEnd(2) + " mins           " + nextArrivalTime.padEnd(2) + " mins"
                $("BusList").data = $("BusList").data.concat({
                    label: {
                        text: string,
                    }
                });
            }
        }
    });
}

const template = {
    views: [{
            type: "label",
            props: {
                id: "label",
                textColor: $color("black"),
                align: $align.left,
                font: $font("San Francisco", 13)
            },
            layout: function (make, view) {
                make.right.top.bottom.inset(0);
                make.left.inset(15);
            },
            events: {
                tapped: function (sender) {
                    GetLocation();
                }
            }
        }
    ]
};

function nusList(temp) {
    return {
        type: "list",
        props: {
            id: "BusList",
            template: temp,
            //data:options
            bgcolor: $color("clear"),
            hidden: true,
            rowHeight: 35
        },
        layout: function (make, view) {
            make.top.equalTo(0);
            make.left.right.top.inset(5);
            make.bottom.inset(0);
        }
    };
}

function show() {
    $ui.render({
        props: {
            title: "NUS NextBus",
            id: "NUS NextBus"
            //      navBarHidden:true,
        },
        views: [nusList(template)]
    });
}

function run() {
    show();
    //getHotSearch();
    GetLocation();
}

run();
