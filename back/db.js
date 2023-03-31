
const firebase = require("firebase-admin");
require('dotenv').config()
const firebase_client = require("firebase");

var serviceAccount = require("./key.json");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  });

firebase_client.initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
})


const db = firebase.firestore()


module.exports = {firebase,db,firebase_client}
