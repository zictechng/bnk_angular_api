const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// import user model here
const User = require('../models/user');

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



// route 1
router.get('/', (req, res) =>{
    res.send('From backend api call')
});

// function to verify token 

function verifyToken(req, res, next){
    // check if token present
   if(!req.headers.authorization){
      return res.status(401).send('Unauthorized request');
   }
   let token = req.headers.authorization.split(' ')[1] // this check if token then take only the token without anyother string attached
   // again check if the header/token has empty
   if(token === 'null'){
    return res.status(401).send('Unauthorized request');
   }
  
   // this verify if the token is valid/correct
   let payload = jwt.verify(token, 'secretkey')
   // if not valid show error
   if(!payload){
    return res.status(401).send('Unauthorized request');
   }
  
   // if everything is find
   req.userId = payload.subject
   next();
  
  }

// router.get('/register', (req, res) =>{
//     res.send('From backend api register')
// });

// route register
router.post('/register', (req, res) =>{
    let userData = req.body;
    let user = new User(userData);
    user.save((error, registeredUser) =>{
        if(error){
            console.log(error)
        }
        else{
            // generate jwt token
          let payload = {subject: registeredUser._id} // subject is the key, registerUser._id the value
          let token = jwt.sign(payload, 'secretkey'); // 'secretkey' can be anything of your choice and you can put it in .env file
          //res.status(200).send(registeredUser);
          console.log(token)
          res.status(200).send({token});
        }
    })
    });

//login route
router.post('/login', (req, res) =>{
    let userData = req.body;
    //check if user email exist in database
    User.findOne({email: userData.email}, (error, user) =>{
        if(error){
            console.log(error)
        }
        else{
         // check is it found any user with the email entered
         if(!user){
            res.status(401).send('invalid email entered')
         }
         else{
            //check if password match
            if(user.password !== userData.password){
                res.status(401).send('Invalid password');
            }
            else{
             // generate token
            //  let payload = {subject: user._id}
            //  let token = jwt.sign(payload, 'secretkey')
            //everything is fine
            //res.status(200).send(user);
            // generate jwt token
          let payload = {subject: user._id} // subject is the key, registerUser._id the value
          let token = jwt.sign(payload, 'secretkey'); // 'secretkey' can be anything of your choice and you can put it in .env file
          //res.status(200).send(registeredUser);
          //console.log(token)
         
          res.status(200).send({token});
            }
         }
        }
    })
})

module.exports = router;