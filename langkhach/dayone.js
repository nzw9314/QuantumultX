if ($response.statusCode == 200) {
        if ($request.url.endsWith("account-status")) {

            $done({body: JSON.stringify({
  "expirationDate": 1893427199000,
  "startDate": 1546272000000,
  "subscriptionPlan": "com.bloombuilt.dayoneios.subscription.premium.yearly_discounted_trial",
  "lastRenewalDate": 1546531200000,
  "subscriptionName": "premium",
  "bundleReason": "purchase",
  "cancellationDate": 0
} )});

        } else {
	     const bodyJson = JSON.parse($response.body);

	     bodyJson.featureBundle = {"bundleName":"premium","features":[{"name":"imagesPerEntry","limit":30,"canUpgrade":false},{"name":"printingDiscount","canUpgrade":false},{"name":"syncMac","canUpgrade":false},{"name":"prioritySupport","canUpgrade":false},{"name":"sync","canUpgrade":false},{"name":"journalLimit","limit":100,"canUpgrade":false},{"name":"audioPerEntry","limit":10,"canUpgrade":false}]};

	    $done({body: JSON.stringify(bodyJson)});
        }
} else {
	$done({});
}
