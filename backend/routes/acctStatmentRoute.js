
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// import user model here
const User = require('../models/user');
const TransferFund = require('../models/fundTransfer');

const mongoose = require('mongoose');
const fundTransfer = require('../models/fundTransfer');

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

// get account statement here..
router.get("/statement", async(req, res) =>{
    try {
        const acctStatement = await TransferFund.find().sort( { createdOn: -1 } );
        res.status(200).send(acctStatement);
    } catch (err) {
        res.status(500).json(err);
        console.log(err.message);
    }
});


// get account history statement here..
router.get("/history", async(req, res) =>{
    try {
        const acctStatement = await TransferFund.find().sort( { createdOn: -1 } );
        res.status(200).send(acctStatement);
    } catch (err) {
        res.status(500).json(err);
        console.log(err.message);
    }
});

// get current user account details/profile here..
router.get("/profile/:id", async(req, res) =>{
    let userId = req.params.id;
   try {
        const userDetails = await User.findOne({_id: userId});
       
        const userTransacSuccess = await TransferFund.aggregate([ 
            { $match:{ createdBy: userId}}, 
            { $group:{ _id: '$transaction_status', totalAmount: { $sum: '$amount' } } 
        }])

        const {password, ...others} = userDetails._doc; // this will remove password from the details send to server.
       
        res.status(200).send({others, userTransacSuccess});
        
    } catch (err) {
        res.status(500).json(err.message);
        console.log(err.message);
    }
});


router.get("/income_details/:id", async (req, res) => {
    let userId = req.params.id;
    try {
        const userTransacPending = await  TransferFund.aggregate([
        { $match : { createdBy: userId } },
        { $sort : {amount:-1}  },
        {$group:{ _id:'$transac_nature', totalAmount: { $sum: '$amount' } }},
    ]);
    res.status(200).send(userTransacPending);
   
} catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
}
});


// get delete single record here..
router.get("/delete-history/:id", async(req, res) =>{
    let userId = req.params.id;
   try {
    // find record by the post ID
    const query = TransferFund.findOne(req.params.id);

    // delete the record found here
    const result = await TransferFund.deleteOne(query);

    if (result.deletedCount === 1) {
     res.status(200).send({msg: '200'});
    } else {
        res.status(403).send({msg: '403'});
        console.log("No documents matched the query id.");
    }
        } catch (err) {
        res.status(500).json(err.message);
        console.log(err.message);
    }
});

    // delete multiple with checkbox here
router.post('/history_delete', async(req, res) =>{
    let arrayIds = req.body;
    try {
    // delete multiple record here
    const result = await TransferFund.deleteMany({_id: { $in: arrayIds } });
    res.status(200).send({msg: '200'});
    
    } catch (err) {
    res.status(500).json(err.message);
}
});

    // search for product with multiple condition here
router.get('/product-search/:id', async(req, res) =>{
        let searchValue = req.params.id;
       try {
        console.log(searchValue);

        //searchResult = await fundTransfer.find({transac_nature: searchValue})
        searchResult = await fundTransfer.find({
            "$or": [
                    //{amount: {$regex:req.params.id, $options: "i"}},
                    {transac_nature:{$regex:req.params.id,$options: "i"}},
                    {tran_type:{$regex:req.params.id, $options: "i"}},
                    {bank_name:{$regex:req.params.id, $options: "i"}},
                ]
        })
        
        res.status(200).json(searchResult);

        console.log(searchResult);
        }catch (err) {
        res.status(500).json(err.message);
        }

});

module.exports = router;