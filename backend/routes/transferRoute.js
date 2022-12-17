const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// import user model here
const User = require('../models/user');
const TransferFund = require('../models/fundTransfer');

const mongoose = require('mongoose');

const db = "mongodb://localhost:27017/bank_appdb";

mongoose.set('strictQuery', false); // this is to suppress some db error

// db connection here
mongoose.connect(db, err =>{
    if(err){
        console.error('Error ' + err);
    } else{
        console.log('database connected to mongodb')
    }
});


// function to verify token 

// function verifyToken(req, res, next){
//     // check if token present
//    if(!req.headers.authorization){
//       return res.status(401).send('Unauthorized request');
//    }
//    let token = req.headers.authorization.split(' ')[1] // this check if token then take only the token without anyother string attached
//    // again check if the header/token has empty
//    if(token === 'null'){
//     return res.status(401).send('Unauthorized request');
//    }
  
//    // this verify if the token is valid/correct
//    let payload = jwt.verify(token, 'secretkey')
//    // if not valid show error
//    if(!payload){
//     return res.status(401).send('Unauthorized request');
//    }
  
//    // if everything is find
//    req.userId = payload.subject
//    next();
  
//   }

// router.get('/register', (req, res) =>{
//     res.send('From backend api register')
// });

// route register
router.post('/sendfund', (req, res) =>{
    let fundData = req.body;
    let fundsend = new TransferFund(fundData);
    fundsend.save((error, registeredUser) =>{
        if(error){
            console.log(error)
        }
        else{
        res.status(200).send({msg: '200'});
        //   console.log(token)
        //   res.status(200).send({token});
        }
    })
    });



module.exports = router;