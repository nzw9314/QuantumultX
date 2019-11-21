let obj = JSON.parse($response.body);
let sub= obj["subscriber"];
sub["subscriptions"]["blocker.ios.subscription.lifetime"]= 
{
        "is_sandbox": false,
        "period_type": "false",
        "billing_issues_detected_at": null,
        "unsubscribe_detected_at": null,
        "expires_date": null,
        "original_purchase_date": "2019-11-09T14:03:59Z",
        "purchase_date": "2019-11-09T14:03:59Z",
        "store": "app_store"
      };
    
   sub["entitlements"]["premium"]= 
   {
        "expires_date": "2099-11-23T14:03:59Z",
        "product_identifier": "blocker.ios.subscription.lifetime",
        "purchase_date": "2019-11-09T14:03:59Z"
};

$done({body: JSON.stringify(obj)});

// Descriptions