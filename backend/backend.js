const express = require('express');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require("firebase-admin");
const serviceAccount = require("./cert.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
const db = getFirestore(app);

app.get('/markers', async (req, res) => {

    //get data from firestore.
    const snapshot = await db.collection('markers').get();

    //transforms the data we receive into a convenient form.
    let arr = [];
    snapshot.forEach((doc) => {
        arr.push({
            id: doc.id,
            name: doc.data().name,
            lat: doc.data().location._latitude,
            lng: doc.data().location._longitude,
            poster: doc.data().poster,
        });
    });

    //for the 'poster' fields, since they're references to users, we
    //make more requests to firestore to get the data about the users they
    //refer to.
    for (const marker of arr) {
        marker.poster = await marker.poster.get().then(res => res.data());
    }

    //send the data to the frontend.
    res.appendHeader("Access-Control-Allow-Origin", "*")
    res.json(arr);
});

const server = app.listen(3001, () => {
    console.log("backend started");
});
