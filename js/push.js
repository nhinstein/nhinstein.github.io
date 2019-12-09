var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BEQn4TjApSIU-b_wp5nOYeFTFKGFOd_G-Akf3XA4YcVlYdVrOkQXpXu0Z_1ha-o64vrcGjqnkFJmC2kSt8Z4x_I",
   "privateKey": "6omwCv18n3kyVSyyYtHfF9Vvobp8vD5U9KrKAWvXXNQ"
};
 
 
webPush.setVapidDetails(
   'mailto:sriwahyuni112492@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "<Endpoint URL>",
   "keys": {
       "p256dh": "<p256dh Key>",
       "auth": "<Auth key>"
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '1010252627316',
   TTL: 60
};