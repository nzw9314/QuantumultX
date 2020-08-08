var obj = JSON.parse($response.body);

obj["info"]["subscriptions"]= [
      {
        "status": "active",
        "product": "unlimited",
        "duration_unit": "months",
        "id": 805063,
        "platform": "apple",
        "duration_value": 1,
        "starts_at": 1572617692,
        "ends_at": 4099821292,
        "auto_renew_status": true,
        "plan_id": "lk.ios.s1m.t1m.p15.v1",
        "state": "active"
      }];

$done({body: JSON.stringify(obj)});

// Descriptions