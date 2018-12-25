const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//for JWT
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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


app.get('/', (req, response)=>{
    AUTH.getUserByEmail('cakra.ds@gmail.com').then(result=>{
        console.log(result);
        response.status(200).send("Alhamdulillah");
    });
});

app.post('/', (req, response)=>{
    let body = req.body;
    let resMessage = {
        success:false,
        message:'',
        user:{}
    };
    if(body.uid != null){
        AUTH.getUser(req.body.uid).then(result=>{
            resMessage.success = true;
            resMessage.message = 'success';
            resMessage.user = result;
            response.status(200).json(resMessage);
        }).catch(err=>{
            resMessage.message = err.message;
            response.status(200).json(resMessage);
        });
    }
    else{
        resMessage.message = 'no post data';
        response.status(200).json(resMessage);;        
    }
});

module.exports = app;