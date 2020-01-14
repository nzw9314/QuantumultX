var obj = JSON.parse($response.body);
obj={
	"request_date": "2020-01-04T13:45:50Z",
	"request_date_ms": 1578145550873,
	"subscriber": {
		"entitlements": {},
		"first_seen": "2020-01-03T15:21:58Z",
		"non_subscriptions": {},
		"original_app_user_id": "22683069",
		"original_application_version": "475",
		"original_purchase_date": "2019-11-10T14:07:55Z",
		"other_purchases": {},
		"subscriptions": {
			"12m_freetrial_2018": {
				"billing_issues_detected_at": null,
				"expires_date": "2120-01-10T15:35:13Z",
				"is_sandbox": false,
				"original_purchase_date": "2020-01-03T15:35:13Z",
				"period_type": "trial",
				"purchase_date": "2020-01-03T15:35:13Z",
				"store": "app_store",
				"unsubscribe_detected_at": null
		}
	}
}
};

$done({body: JSON.stringify(obj)});

// Descriptions
