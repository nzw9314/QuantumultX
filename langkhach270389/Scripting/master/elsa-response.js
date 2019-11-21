
var obj = JSON.parse($response.body);

obj["subscriptions"] = [
    {
      "expire_at": "21190505",
      "subscription": "lifetime_membership",
      "days_to_end": 36469,
      "created_at": "20190529151809"
    }
  ];
$done({body: JSON.stringify(obj)});
