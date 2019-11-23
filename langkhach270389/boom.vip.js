var obj = JSON.parse($response.body);
obj= {
 "status": "0",
 "receipt-data": {
  "status": 0,
  "environment": "Production",
  "receipt": {
   "receipt_type": "Production",
   "adam_id": 1065511007,
   "app_item_id": 1065511007,
   "bundle_id": "com.globaldelight.iBoom",
   "application_version": "1.4.70002",
   "download_id": 22057166984396,
   "version_external_identifier": 832251566,
   "receipt_creation_date": "2019-10-25 01:51:02 Etc/GMT",
   "receipt_creation_date_ms": "1571968262000",
   "receipt_creation_date_pst": "2019-10-24 18:51:02 America/Los_Angeles",
   "request_date": "2019-10-25 01:53:35 Etc/GMT",
   "request_date_ms": "1571968415590",
   "request_date_pst": "2019-10-24 18:53:35 America/Los_Angeles",
   "original_purchase_date": "2019-10-25 01:43:54 Etc/GMT",
   "original_purchase_date_ms": "1571967834000",
   "original_purchase_date_pst": "2019-10-24 18:43:54 America/Los_Angeles",
   "original_application_version": "1.4.70002",
   "in_app": [
    {
     "quantity": "1",
     "product_id": "com.globaldelight.iBoom.7DayFree1YearIntroPack",
     "transaction_id": "20000617694038",
     "original_transaction_id": "20000617694038",
     "purchase_date": "2019-10-25 01:50:51 Etc/GMT",
     "purchase_date_ms": "1571968251000",
     "purchase_date_pst": "2019-10-24 18:50:51 America/Los_Angeles",
     "original_purchase_date": "2019-10-25 01:50:51 Etc/GMT",
     "original_purchase_date_ms": "1571968251000",
     "original_purchase_date_pst": "2019-10-24 18:50:51 America/Los_Angeles",
     "expires_date": "2029-11-01 01:50:51 Etc/GMT",
     "expires_date_ms": "1888167051000",
     "expires_date_pst": "2029-10-31 18:50:51 America/Los_Angeles",
     "web_order_line_item_id": "20000194718574",
     "is_trial_period": "true",
     "is_in_intro_offer_period": "false"
    }
   ]
  },
  "latest_receipt_info": [
   {
    "quantity": "1",
    "product_id": "com.globaldelight.iBoom.7DayFree1YearIntroPack",
    "transaction_id": "20000617694038",
    "original_transaction_id": "20000617694038",
    "purchase_date": "2019-10-25 01:50:51 Etc/GMT",
    "purchase_date_ms": "1571968251000",
    "purchase_date_pst": "2019-10-24 18:50:51 America/Los_Angeles",
    "original_purchase_date": "2019-10-25 01:50:51 Etc/GMT",
    "original_purchase_date_ms": "1571968251000",
    "original_purchase_date_pst": "2019-10-24 18:50:51 America/Los_Angeles",
    "expires_date": "2029-11-01 01:50:51 Etc/GMT",
    "expires_date_ms": "1888167051000",
    "expires_date_pst": "2029-10-31 18:50:51 America/Los_Angeles",
    "web_order_line_item_id": "20000194718574",
    "is_trial_period": "true",
    "is_in_intro_offer_period": "false",
    "subscription_group_identifier": "20461753"
   }
  ],
  "pending_renewal_info": [
   {
    "auto_renew_product_id": "com.globaldelight.iBoom.7DayFree1YearIntroPack",
    "original_transaction_id": "20000617694038",
    "product_id": "com.globaldelight.iBoom.7DayFree1YearIntroPack",
    "auto_renew_status": "1"
   }
  ]
 };

$done({body: JSON.stringify(obj)});

// Descriptions