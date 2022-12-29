const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const multer = require('multer');
// import user model here
const User = require('../models/user');
const SupportTicket = require('../models/support');

const mongoose = require('mongoose');

//const db = "mongodb+srv://bank_user:rWKBghDmKHhryTPY@cluster0.b8zfxbx.mongodb.net/bnk_appDB?retryWrites=true&w=majority";
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

const storage = multer.diskStorage({
    destination:(req, file, callBack) =>{
        callBack(null, 'uploads')
    },
    filename:(req, file, callBack) =>{
        callBack(null, `nameOfImage_${file.originalname}`)
    }
})
var upload = multer({ storage: storage});


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

// route support ticket
router.post('/support', async(req, res) =>{
    let ticketData = req.body;
    const userId = req.body.tick_createdBy;
    let ticket = new SupportTicket(ticketData);
    try {
       
         let userDetails = await User.findOne({_id: userId}); // here I am checking if user exist then I will get user details
         
         if(!userDetails){
            res.status(402).send({msg: '402'});
            // user account not found then show error
         }
         else if(req.body.tick_subject == '' || req.body.tick_subject == null || req.body.tick_sender_name == '' || req.body.tick_sender_name == null
         || req.body.tick_message == '' || req.body.tick_message == null){
            res.status(404).send({msg: '404'}); // cot code reguired
            console.log('fields required')
         }
         else if(userDetails){
            resultTicket = await ticket.save();
            res.status(200).send({msg: '200'});
    
         }
        //console.log(req.body);
        //fundsend.createdBy = (User._id); // get current user ID
        } catch (err) {
            res.status(500).send({msg: '500'})
        }
    });

router.post('/upload', upload.single('file'), (req, res, next) =>{
        const file = req.file;
        console.log(req.file.filename);
        console.log(req.body.my_name);
        console.log(file.filename);
        try {
            if(!file){
                res.status(404).send({msg: '404'}); // cot code reguired
                   return next(error)
                }
                res.send(file);
        } catch (err) {
            res.status(500).send({msg: '500'})
        }
    })
    
//login route
router.post('/login', (req, res) =>{
    let userData = req.body;
    //check if user email exist in database
    User.findOne({email: userData.email}, (error, user) =>{
       // console.log(user);
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
          let payload = {subject: user._id} // subject is the key, User._id the value
          let token = jwt.sign(payload, 'secretkey'); // 'secretkey' can be anything of your choice and you can put it in .env file
          const {password, ...others} = user._doc; // this will remove password from the details send to server.
          //res.status(200).send({token});
          res.status(200).send({token:token,userData:others});
            }
         }
        }
    })
})

module.exports = router;