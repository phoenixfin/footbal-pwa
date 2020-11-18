var webPush = require('web-push');
// {"privateKey":"T5_BhZuBLEbTFzjdYynOaA7EhGhW7MHLToPSdT2e20A"}

public_key = "BGbGDriiaAah3cOjoY8BHdJOuiTb3EgWkco3QGJfs9wkYpXH3SKsae11IebzQ-aKPevbFFtvSFwiYZjgnPpTRPg"

const vapidKeys = {
    "publicKey": "BGbGDriiaAah3cOjoY8BHdJOuiTb3EgWkco3QGJfs9wkYpXH3SKsae11IebzQ-aKPevbFFtvSFwiYZjgnPpTRPg",
    "privateKey": "T5_BhZuBLEbTFzjdYynOaA7EhGhW7MHLToPSdT2e20A"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/dZHmEjkobZc:APA91bGH48c3juSu9OG-ubWZGfzP_JJauzkYqgf9VPB82Jqmz7mjICem3XdpUgqtnPi6_En-JHdOyTCsgiyv-lFkc5RcBss_l4J4-uCJKnFhO6Ds-uX4_Dw3gCRl0yItwp2MAVaE9AUP",
    "keys": {
        "p256dh": "BLVhCkYn5AmehJq56TdQ/E45JVLog/8cuRs4VRiv90xDUcZHQ9zf1eGSF0REmMes+l3dhwYjNdoypMbFGQXcyEc=",
        "auth": "0pA89INDKSahu/EiGEjGQw=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '627520178017',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);