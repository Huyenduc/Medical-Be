import twilio from 'twilio';


const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
var admin = require("firebase-admin");

var serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://medical-app-f5072-default-rtdb.asia-southeast1.firebasedatabase.app"
});

exports.createRoom = async (name) => {

    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.ACCOUNT_AUTH;
    const client = require('twilio')(accountSid, authToken);

    const room = await client.video.v1.rooms
        .create({
            uniqueName: name
        })
    if (room) {
        const accessToken = new AccessToken(
            process.env.ACCOUNT_SID,
            process.env.API_KEY,
            process.env.API_KEY_SECRET,
        );
        const accessToken2 = new AccessToken(
            process.env.ACCOUNT_SID,
            process.env.API_KEY,
            process.env.API_KEY_SECRET,
        );
        accessToken.identity = "Dr.Min AKhter";
        accessToken2.identity = "Partic";
        var grant = new VideoGrant();
        accessToken.addGrant(grant);
        accessToken2.addGrant(grant);


        // Serialize the token as a JWT
        var jwt = accessToken.toJwt();
        var jwt2 = accessToken.toJwt();
        global.io.emit('token1', {
            token: jwt,
            roomname: room.sid
        });
        global.io.emit('token1', {
            token: jwt2,
            roomname: room.sid
        });
    }

};

export const getToken = async () => {

    return res.send(jwt)
}

export const notification = async () => {
    const a = await admin.messaging().sendToDevice(
        [
            'cixqXTxWSoyJfrCsQba61Z:APA91bFNpl9mWJRmHEHDPEPr0pc_1XKchv6lFkct9nalRAOVNuOHI3Y5EmKkp0rdUD5CP9cGPBugWwNUV4v4aGo6UNjJ__JOrVepdbkbctPHI_nmhC7mP2U65dlU2rgBlHaw7j-QU8j0'
        ], // device fcm tokens...
        {
            data: {
                roomname: "Test2",
                name: "Huyen Duc"
                // owner: JSON.stringify(owner),
                // user: JSON.stringify(user),
                // picture: JSON.stringify(picture),
            },
        },
        {
            // Required for background/quit data-only messages on iOS
            contentAvailable: true,
            priority: 'high',
        },
    );
}