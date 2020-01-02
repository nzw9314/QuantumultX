var obj = JSON.parse($response.body);

obj=
{
  "accessDays": 999999999,
  "allSets": 1,
  "error": 0,
  "m": {
    "r": "999999999",
    "useSubscriptions": true,
    "expiredSubscription": "999999999",
    "subscription": "com.planner5d.planner5d.subscription.yearly"
  }
};

$done({body: JSON.stringify(obj)});

// Descriptions
