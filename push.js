var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BOA36LTbRpTawoc1Z98mVxd3gJCHnikWW1MR50FF6MTCMIcygzSRskPg6-s0LXsgBliVGCvN8QL9hOqnGxLrfyA",
   "privateKey": "jwSzf1QuvcOxT_unmXlzUfdMaUQgdI-XwQFJfto5riE"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/e738YYCp340:APA91bFzBQ643dpL4f2F0F0_ngRM5ickHsFcXSRZDacLyb2fq8X5tOwido2WXawgmE2CpelXEZNPBwdm1VwkSj5a9wBBHtWwIFxTnY-i9VMANtSyKVHSnOT3Iut68i0n3a0iKGLCl64S",
   "keys": {
       "p256dh": "BKEcab8tjzH80CPwF7Z4r0DJFODYofnWX9NxgDr3CSIctDEPtCrqJQ0x5U9PeIKIGFCzOzFHNUE/EjWKNlJWHNY=",
       "auth": "nRM4TKTnmP3TQ4tb2nc8cQ=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '1010252627316',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
)
.then(function (statusCode, headers, body) {
 console.log('tes', statusCode);
})
.catch(function (statusCode, headers, body) {
 console.log('tes2', statusCode);
})