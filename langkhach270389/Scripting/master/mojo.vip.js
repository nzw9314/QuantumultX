var obj = JSON.parse($response.body);

obj= {
  "request_date_ms": 1572490296249,
  "request_date": "2019-10-31T02:51:36Z",
  "subscriber": {
    "first_seen": "2019-10-12T00:37:49Z",
    "original_application_version": "194",
    "other_purchases": {
    },
    "subscriptions": {
      "video.mojo.pro.yearly": {
        "is_sandbox": false,
        "period_type": "trial",
        "billing_issues_detected_at": null,
        "unsubscribe_detected_at": null,
        "expires_date": "2099-12-01T03:51:32Z",
        "original_purchase_date": "2019-10-31T02:51:33Z",
        "purchase_date": "2019-10-31T02:51:32Z",
        "store": "app_store"
      }
    },
    "entitlements": {
      "pro": {
        "expires_date": "2099-12-01T03:51:32Z",
        "product_identifier": "video.mojo.pro.yearly",
        "purchase_date": "2019-10-31T02:51:32Z"
      }
    },
    "original_purchase_date": "2019-10-12T00:03:39Z",
    "original_app_user_id": "lTNT8zWozfXUzstQM02ZqqkoSh03",
    "non_subscriptions": {
    }
  }
};

$done({body: JSON.stringify(obj)});

// Descriptions