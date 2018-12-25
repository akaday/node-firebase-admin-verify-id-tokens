const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//for JWT
const jwt = require('jsonwebtoken');
const config = require('./config');

// for firebase
const ADMIN = require('firebase-admin');
const serviceAccount = require("./fb-key.json");

ADMIN.initializeApp({
    credential: ADMIN.credential.cert(serviceAccount),
    databaseURL: "https://vue-social-auth.firebaseio.com/"
});
const AUTH = ADMIN.auth();
const DB = ADMIN.firestore();


app.get('/', (req, response) => {
    let resMessage = {
        success: false,
        message: '',
        jwt: ''
    };

    // create a token
    let token = jwt.sign({
        uid: ' mo4lP5HPKPYdKOHIzPA9fcWgM5o2',
        name: 'Cakra Danu Sedayu'},
        config.secret,
        { expiresIn: 86400 // expires in 24 hours
    });
    resMessage.success = true;
    resMessage.message = 'success';
    resMessage.jwt = token;
    response.status(200).json(resMessage);
});

app.post('/', (req, response) => {
    let body = req.body;
    let resMessage = {
        success: false,
        message: '',
        jwt: ''
    };
    if (body.uid != null) {
        AUTH.verifyIdToken(body.firebaseToken).then(decodedToken => {
            let uid = decodedToken.uid;
            if (uid == body.uid) {
                // create a token
                let token = jwt.sign({
                    uid: body.uid,
                    name: body.name },
                    config.secret,
                    { expiresIn: 86400 // expires in 24 hours
                });
                resMessage.success = true;
                resMessage.message = 'success';
                resMessage.jwt = token;

                response.status(200).json(resMessage);
            } else {
                resMessage.message = 'Failed to authenticate token.';
                response.status(200).json(resMessage);
            }
        }).catch(err => {
            resMessage.message = err.message;
            response.status(200).json(resMessage);
        });
    } else {
        resMessage.message = 'no post data';
        response.status(200).json(resMessage);;
    }
});

module.exports = app;
