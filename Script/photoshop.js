/*
解锁 Photoshop for iPad

^https:\/\/lcs-mobile-cops\.adobe\.io\/mobile_profile\/nul\/v1$ url script-response-body photoshop.js

Mitm = lcs-mobile-cops.adobe.io

作者 @ImSingee，请勿分享此脚本

*/

const bodyJson = JSON.parse($response.body)

bodyJson.mobileProfile.profileStatus = 'PROFILE_AVAILABLE'

bodyJson.mobileProfile.legacyProfile = '{}'
bodyJson.mobileProfile.relationshipProfile = '{}'

JSON.stringify(bodyJson)