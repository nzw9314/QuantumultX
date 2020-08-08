var obj = JSON.parse($response.body);

obj= {
  "data": {
    "id": "2354993",
    "type": "ios_subscriptions",
    "attributes": {
      "intro_offer_period": false,
      "created_at": "2019-04-26T18:59:13.664Z",
      "expires_at": "2119-05-03T18:59:11.000Z",
      "trial": true,
      "validated_on_request": true,
      "renewal_info": {
        "auto_renew": true,
        "auto_renew_product_type": "instasize_premium_plus_subscription"
      },
      "original_transaction_id": "540000371928348",
      "updated_at": "2019-04-26T18:59:23.144Z",
      "pay_as_you_go": false,
      "updated_by": "validation",
      "payments_count": 0,
      "product_type": "instasize_premium_plus_subscription",
      "environment": "Production",
      "status": "active",
      "intro_price_expires_at": null
    }
  }
};

$done({body: JSON.stringify(obj)});

// Mô tả
