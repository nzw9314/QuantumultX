let obj = JSON.parse($response.body)
obj.mobileProfile.profileStatus = 'PROFILE_AVAILABLE'
obj.mobileProfile.legacyProfile = '{}'
obj.mobileProfile.relationshipProfile = '{}'
$done({body: JSON.stringify(obj)})
//@ImSingee