var obj = JSON.parse($response.body);

obj["subscription_info"]= {
    "type" : "IOS",
    "valid_until" : 1873089612.367564
    };

$done({body: JSON.stringify(obj)});

// Descriptions