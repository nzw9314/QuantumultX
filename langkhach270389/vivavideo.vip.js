var obj = JSON.parse($response.body);

obj= {
  "autoRenewProductId": "premium_platinum_yearly",
  "iosDeviceProductVo": {
    "premiumVipWeekly": 3,
    "premiumGoldMonthly": 3,
    "premiumPlatinumMonthly": 3,
    "premiumGoldYearly": 3,
    "premiumPlatinumYearly": 2,
    "premiumPlatinumHalfYearly": 3,
    "premiumVipYearly": 3
  },
  "isTrialPeriod": true,
  "endTime": 4081109070000,
  "platform": 2,
  "vipType": "premium_platinum_yearly",
  "duidDgest": "DIIe86X35",
  "autoRenewStatus": 1,
  "startTime": 1556241871000,
  "systemDate": 1556965441014
};

$done({body: JSON.stringify(obj)});

// Descriptions
