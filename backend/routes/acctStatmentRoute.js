const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// import user model here
const User = require("../models/user");
const TransferFund = require("../models/fundTransfer");
const orderProcess = require("../models/orderProcess");
const mongoose = require("mongoose");
const fundTransfer = require("../models/fundTransfer");
const invoiceData = require("../models/processDynamicData");

const { response } = require("express");

const db = "mongodb://localhost:27017/bank_appdb";
mongoose.set("strictQuery", false); // this is to suppress some db error

// db connection here
mongoose.connect(db, (err) => {
  if (err) {
    console.error("Error " + err);
  } else {
    console.log("database connected to mongodb");
  }
});

// get finance details here..
router.get("/finance", async (req, res) => {
  try {
    const financeStatement = await TransferFund.find().sort({ createdOn: -1 });
    res.status(200).send(financeStatement);
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});
// get wallet finance chart details here..
router.get("/wallet-finance/:id", async (req, res) => {
  let myId = req.params.id;
  try {
    const userWalletChart = await TransferFund.aggregate([
      { $match: { createdBy: myId } },
      { $group: { _id: "$transac_nature", totalAmount: { $sum: "$amount" } } },
    ]);
    res.status(200).send(userWalletChart);
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});
// get account statement here..
router.get("/statement", async (req, res) => {
  try {
    const acctStatement = await TransferFund.find().sort({ createdOn: -1 });
    res.status(200).send(acctStatement);
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});

router.get("/statement-details", async (req, res, next) => {
  let page = req.query.page;
  let limit = req.query.pageSize;
  console.log(page, limit);
  try {
    if (req.query.page && req.query.pageSize) {
      const statementPaginate = await TransferFund.paginate(
        {},
        { page: page, limit: limit }
      );
      res.status(200).send(statementPaginate);
    } else {
      const statementPaginate = await TransferFund.find();
      res.status(200).send(statementPaginate);
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occured: " + error,
      error,
    });
  }
});

// router.get("/statement", async(req, res) =>{
//     try {
//         const acctStatement = await TransferFund.find().sort( { createdOn: -1 } );
//         res.status(200).send(acctStatement);
//     } catch (err) {
//         res.status(500).json(err);
//         console.log(err.message);
//     }
// });

// get account history statement here..

router.get("/history", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.pageSize;
  const totalItems = 0;
  const skip = (page - 1) * limit;
  //console.log(limit, page);
  try {
    const acctStatement = await TransferFund.find()
      .sort({ createdOn: -1 })
      .skip(skip);
    const totalItems = await TransferFund.countDocuments();
    res.status(200).send({ data: acctStatement, total_record: totalItems });
    // console.log(acctStatement, totalItems);
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});

// get account history statement here..
router.get("/history-wallet/:id", async (req, res) => {
  let userId = req.params.id;
  //console.log(userId);
  try {
    const walletStatement = await TransferFund.find({ createdBy: userId })
      .sort({ createdOn: -1 })
      .limit(5);
    //const totalItems =  await TransferFund.countDocuments()
    res.status(200).send(walletStatement);
    //console.log(walletStatement);
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});

// get history details here..
router.get("/histories", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.pageSize;
  const skip = (page - 1) * limit;
  try {
    const acctStatement = await TransferFund.find().sort({ createdOn: -1 });
    // console.log(page);
    res.status(200).send(acctStatement);
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});

// get current user account details/profile here..
router.get("/profile/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    const userDetails = await User.findOne({ _id: userId });

    const userTransacSuccess = await TransferFund.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: "$transaction_status",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const { password, ...others } = userDetails._doc; // this will remove password from the details send to server.

    res.status(200).send({ others, userTransacSuccess });
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
});

router.get("/income_details/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    const userTransacPending = await TransferFund.aggregate([
      { $match: { createdBy: userId } },
      { $sort: { amount: -1 } },
      { $group: { _id: "$transac_nature", totalAmount: { $sum: "$amount" } } },
    ]);
    res.status(200).send(userTransacPending);
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
});

// get delete single record here..
router.get("/delete-history/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    // find record by the post ID
    const query = TransferFund.findOne(req.params.id);

    // delete the record found here
    const result = await TransferFund.deleteOne(query);

    if (result.deletedCount === 1) {
      res.status(200).send({ msg: "200" });
    } else {
      res.status(403).send({ msg: "403" });
      console.log("No documents matched the query id.");
    }
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
});

// delete multiple with checkbox here
router.post("/history_delete", async (req, res) => {
  let arrayIds = req.body;
  try {
    // delete multiple record here
    const result = await TransferFund.deleteMany({ _id: { $in: arrayIds } });
    res.status(200).send({ msg: "200" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// search for product with multiple condition here
router.get("/product-search/:id", async (req, res) => {
  let searchValue = req.params.id;
  try {
    //console.log(searchValue);
    //searchResult = await fundTransfer.find({transac_nature: searchValue})
    searchResult = await fundTransfer.find({
      $or: [
        //{amount: {$regex:req.params.id, $options: "i"}},
        { transac_nature: { $regex: req.params.id, $options: "i" } },
        { tran_type: { $regex: req.params.id, $options: "i" } },
        { bank_name: { $regex: req.params.id, $options: "i" } },
        { amount: parseInt(req.params.id) },
      ],
    });

    // if (typeof searchResult == "number") {
    //   searchResult = await fundTransfer.find({
    //     $or: [
    //       //{amount: {$regex:req.params.id, $options: "i"}},
    //       { amount: parseFloat(req.params.id) },
    //     ],
    //   });
    // }
    res.status(200).json(searchResult);
    //console.log(searchResult);
  } catch (err) {
    res.status(500).json(err.message);
    console.log("error message: ", err.message);
  }
});

router.post("/order/create", async (req, res) => {
  try {
    let orderDetail = [...req.body];
    const order = await orderProcess.insertMany(orderDetail);
    if (!order) {
      console.log("ERROR ::", order);
      res.status(503).send({ msg: "503" });
    } else {
      console.log("Success ::", order);
      res.status(200).send({ msg: "200" });
    }
  } catch (err) {
    res.status(500).send({ msg: "500" });
  }
});

// get invoice data details here..
router.post("/create-invoice", async (req, res) => {
  const lengthCount = Object.keys(req.body).length;
  const discount = 10; //percentage
  try {
    let {
      fname,
      lname,
      email,
      phone,
      contact,
      ca1,
      ca2,
      ca3,
      ca_total,
      created_by,
    } = req.body;
    if (!fname || !lname || !email || !phone) {
      res.status(400).json({ msg: "400" }); // Required some more data
      console.log("fields required");
      //console.log("Data lenght ", lengthCount);
    } else {
      //console.log(req.body);
      const contact = req.body.contact;

      const docs = req.body.contact.map((element) => {
        let total_amt = +element.ca1 + +element.ca2 + +element.ca3;
        // if (element.ca1 == "" || element.ca1 == null) {
        //   res.status(400).json({ msg: "400" });
        //   console.log("CA1 fields required");
        // }
        return {
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          phone: req.body.phone,
          ...element,
          total_amt: total_amt,
          discount_amt: total_amt - (total_amt * discount) / 100,
        };
      });
      //console.log("Data lenght ", req.body.contact);
      const result = await invoiceData.insertMany(docs);
      res.status(200).send({ msg: "200" });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});
module.exports = router;
