const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const multer = require("multer");
// import user model here
const User = require("../models/user");
const SupportTicket = require("../models/support");
const Student = require("../models/student");
const StudentResult = require("../models/processResult");
const SaveStudentPosition = require("../models/saveResult");
const AddNewProduct = require("../models/buyProduct");
const salesProduct = require("../models/salesProduct");
const mongoose = require("mongoose");
const fs = require("fs");
const mime = require("mime");
const OnlineProduct = require("../models/productImages");

// parse application/x-www-form-urlencoded

//const db = "mongodb+srv://bank_user:rWKBghDmKHhryTPY@cluster0.b8zfxbx.mongodb.net/bnk_appDB?retryWrites=true&w=majority";
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
router.use(express.urlencoded({ extended: true }));
// route 1
router.get("/", (req, res) => {
  res.send("From backend api call");
});

// function to verify token

function verifyToken(req, res, next) {
  // check if token present
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1]; // this check if token then take only the token without anyother string attached
  // again check if the header/token has empty
  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }

  // this verify if the token is valid/correct
  let payload = jwt.verify(token, "secretkey");
  // if not valid show error
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }

  // if everything is find
  req.userId = payload.subject;
  next();
}

// router.get('/register', (req, res) =>{
//     res.send('From backend api register')
// });

// route register
router.post("/register", (req, res) => {
  let userData = req.body;
  let user = new User(userData);
  user.save((error, registeredUser) => {
    if (error) {
      console.log(error);
    } else {
      // generate jwt token
      let payload = { subject: registeredUser._id }; // subject is the key, registerUser._id the value
      let token = jwt.sign(payload, "secretkey"); // 'secretkey' can be anything of your choice and you can put it in .env file
      //res.status(200).send(registeredUser);
      console.log(token);
      res.status(200).send({ token });
    }
  });
});

// route register new student
router.post("/students", async (req, res) => {
  //console.log(req.body);
  const userId = req.body.tick_createdBy;
  try {
    let studentDetails = await Student.findOne({
      reg_number: req.body.tid_name,
    }); // here I am checking if student exist then I will show error

    if (studentDetails) {
      res.status(400).send({ msg: "400" });
      // student reg number alread exist show error
    } else if (
      req.body.student_name == "" ||
      req.body.sch_type == "" ||
      req.body.student_class == "" ||
      req.body.tick_createdBy == null
    ) {
      res.status(403).send({ msg: "403" }); // All fields are required
      console.log("fields required");
    } else if (!studentDetails) {
      const isFormCreated = await Student.create({
        name: req.body.student_name,
        student_class: req.body.class,
        sch_category: req.body.sch_type,
        reg_number: req.body.tid_name,
        addedby: req.body.tick_createdBy,
      });
      if (!isFormCreated) {
        console.log("ERROR ::", isFormCreated);
        res.status(503).send({ msg: "503" });
        // student record failed to create
      } else {
        // const userId = req.body.createdBy;
        //console.log("Student created ", isFormCreated);
        res.status(200).send({ msg: "200" });
      }
    }
  } catch (err) {
    res.status(500).send({ msg: "500" });
  }
});

// route support ticket
router.post("/support", async (req, res) => {
  let ticketData = req.body;
  const userId = req.body.tick_createdBy;
  let ticket = new SupportTicket(ticketData);
  try {
    let userDetails = await User.findOne({ _id: userId }); // here I am checking if user exist then I will get user details

    if (!userDetails) {
      res.status(402).send({ msg: "402" });
      // user account not found then show error
    } else if (
      req.body.tick_subject == "" ||
      req.body.tick_subject == null ||
      req.body.tick_sender_name == "" ||
      req.body.tick_sender_name == null ||
      req.body.tick_message == "" ||
      req.body.tick_message == null
    ) {
      res.status(404).send({ msg: "404" }); // cot code reguired
      console.log("fields required");
    } else if (userDetails) {
      resultTicket = await ticket.save();
      res.status(200).send({ msg: "200" });
    }
    //console.log(req.body);
    //fundsend.createdBy = (User._id); // get current user ID
  } catch (err) {
    res.status(500).send({ msg: "500" });
  }
});

const uploadLocation = "public/images"; // this is the image store location in the project
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, uploadLocation);
  },
  filename: (req, file, callBack) => {
    var img_name = Date.now() + "." + file.mimetype.split("/")[1];
    callBack(null, img_name);
  },
});

var upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res, next) => {
  const file = req.file;
  const filter = { _id: req.body.user_id };
  // console.log(req.file.filename);
  // console.log(req.body.user_id);
  // console.log(file.filename);

  try {
    const userID = await User.findOne({ _id: req.body.user_id });
    if (!userID) {
      res.status(402).send({ msg: "402" });
      // user account not found then show error
    } else if (!file) {
      res.status(404).send({ msg: "404" }); // cot code reguired
      return next(error);
    }
    const updateUserPotoDoc = {
      $set: {
        photo: "/images/" + file.filename,
      },
    };
    const result = await User.updateOne(filter, updateUserPotoDoc);
    res.send({ file, result });
  } catch (err) {
    res.status(500).send({ msg: "500" });
  }
});

// upload product multiple images here...

router.post("/upload_thumb", upload.array("files"), async (req, res, next) => {
  const file = req.files; // coming from client request
  const filter = { _id: req.body.user_id };
  //console.log(file);
  try {
    const userID = await User.findOne({ _id: req.body.user_id });
    if (!userID) {
      res.status(402).send({ msg: "402" });
      // user account not found then show error
    } else if (!file) {
      res.status(404).send({ msg: "404" }); // cot code reguired
      return next(error);
    }
    // here is for updating image record in db
    // const updateUserPotoDoc = {
    //   $set: {
    //     photo: "/images/" + file.filename,
    //   },
    // };
    // const result = await OnlineProduct.updateOne(filter, updateUserPotoDoc);

    // get the selected dynamic image here to save independently.
    const docs2 = req.files.map((channel) => {
      let image_name = channel.filename;
      let location = channel.destination;
      let image_path = channel.path;
      return {
        product_photo: "/images/" + image_name,
        product_image_des: location,
        product_image_path: image_path,
        product_name: "Product Name",
        product_id: "Product ID",
        addedby: req.body.user_id,
        product_reg_id: req.body.reg_code,
      };
    });

    //save the images dynamically here;
    const result = await OnlineProduct.insertMany(docs2);
    //console.log("Result details: ", file[5]);
    //const result2 = await DynamicDataInsert.insertMany(docs2); //
    res.status(200).send({ msg: "200" });
  } catch (err) {
    res.status(500).send({ msg: "500" });
  }

  // const images = [];
  // if (Array.isArray(req.files)) {
  //   for (let a = 0; a < req.files.length; a++) {
  //     images.push(req.files[a]);
  //     console.log("Result images: ", req.files);
  //   }
  // } else {
  //   images.push(req.files);
  // }

  // fs.writeFileSync(
  //   "public/images/" + Date.now() + "filename.jpeg",
  //   base64Data,
  //   "base64",
  //   function (err, data) {
  //     if (err) {
  //       console.log("err", err);
  //     }
  //     console.log("data ", data);
  //   }
  // );
});

//upload multiple images testing here..
router.post("/multiplefiles", upload.array("files"), async (req, res, next) => {
  const files = req.files;
  //const filter = { _id: req.body.user_id };
  if (!files) {
    res.status(404).send({ msg: "404" }); // no file selected
    return next(error);
  }
  console.log(req.files);
  res.status(200).send({ msg: "200" });
});
//login route
router.post("/login", (req, res) => {
  let userData = req.body;
  //check if user email exist in database
  User.findOne({ email: userData.email }, (error, user) => {
    // console.log(user);
    if (error) {
      console.log(error);
    } else {
      // check is it found any user with the email entered
      if (!user) {
        res.status(401).send("invalid email entered");
      } else {
        //check if password match
        if (user.password !== userData.password) {
          res.status(401).send("Invalid password");
        } else {
          // generate token
          //  let payload = {subject: user._id}
          //  let token = jwt.sign(payload, 'secretkey')
          //everything is fine
          //res.status(200).send(user);
          // generate jwt token
          let payload = { subject: user._id }; // subject is the key, User._id the value
          let token = jwt.sign(payload, "secretkey"); // 'secretkey' can be anything of your choice and you can put it in .env file
          const { password, ...others } = user._doc; // this will remove password from the details send to server.
          //res.status(200).send({token});
          res.status(200).send({ token: token, userData: others });
        }
      }
    }
  });
});

// get student details here..
router.get("/fetch_students", async (req, res) => {
  try {
    const acct_student = await Student.find().sort({ reg_number: -1 }).limit(4);
    if (!acct_student) {
      console.log("ERROR :: No record found");
      res.status(404).send({ msg: "404" });
      // student record failed to create
    } else {
      res.status(200).send(acct_student);
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});

// get student details here..
router.get("/fetch_studentsData", async (req, res) => {
  try {
    const result_student = await StudentResult.aggregate([
      {
        $group: {
          _id: "$student_reg",
          grand_total: {
            $sum: "$total_score",
          },
          grand_total_rank: {
            $sum: "$total_score",
          },
          student_reg: { $first: "$student_reg" },
          tca_score: { $first: "$tca_score" },
          exam_score: { $first: "$exam_score" },
          total_score: { $first: "$total_score" },
          student_name: { $first: "$student_name" },
          student_reg: { $first: "$student_reg" },
          class_name: { $first: "$class_name" },
          term_name: { $first: "$term_name" },
          year_name: { $first: "$year_name" },
          subject_name: { $first: "$subject_name" },
          reg_code: { $first: "$reg_code" },
          addedby: { $first: "$addedby" },
        },
      },
    ]);

    if (!result_student) {
      console.log("ERROR :: No record found");
      res.status(404).send({ msg: "404" });
      // student record failed to create
    } else {
      res.status(200).send(result_student);
      //console.log("result ::", result_student);
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});

// post dynamic form table data here
router.post("/student-position", async (req, res) => {
  //console.log("here is body === >>", req.body);
  const lengthCount = Object.keys(req.body).length;
  //console.log(lengthCount);
  //console.log("This is body: ", req.body);
  try {
    //console.log("here is body === >>", req.body);
    // update the table variable data
    const docs = req.body.map((_d) => {
      let obj = {
        student_reg: _d.student_reg,
        student_name: _d.student_name,
        class_name: _d.class_name,
        term_name: _d.term_name,
        year_name: _d.year_name,
        subject_name: _d.subject_name,
        total_ca: _d.tca_score,
        exam_score: _d.exam_score,
        stu_position: _d.grand_total,
        final_total: _d.grand_total_rank,
        reg_code: _d.reg_code,
        addedby: _d.addedby,
      };
      return obj;
    });
    const saveResult = await SaveStudentPosition.insertMany(docs);
    //console.log(saveResult);
    res.status(200).send({ msg: "200" });
  } catch (err) {
    console.log("ERROR ::", err);
    res.status(500).send({ msg: "500" });
  }
});

// route register new product here
router.post("/add-product", async (req, res) => {
  console.log(req.body);
  const userId = req.body.tick_createdBy;
  try {
    let productDetails = await AddNewProduct.findOne({
      product_code_number: req.body.product_code,
    }); // here I am checking if product code exist then I will show error

    if (productDetails) {
      res.status(400).send({ msg: "400" });
      // student reg number alread exist show error
    } else if (
      req.body.product_name == "" ||
      req.body.sale_price == "" ||
      req.body.product_qty == "" ||
      req.body.product_code == null ||
      req.body.product_code == ""
    ) {
      res.status(403).send({ msg: "403" }); // All fields are required
      console.log("fields required");
    } else if (!productDetails) {
      const isFormCreated = await AddNewProduct.create({
        product_name: req.body.product_name,
        product_description: req.body.product_desc,
        product_category: req.body.product_category,
        product_cost_price: req.body.cost_price,
        product_sale_price: req.body.sale_price,
        product_qty: req.body.product_qty,
        product_code_number: req.body.product_code,
        product_expiration_date: req.body.expire_date,
        product_buy_date: req.body.buy_date,
        reg_code: req.body.reg_code,
        addedby: req.body.user_createdBy,
      });
      if (!isFormCreated) {
        console.log("ERROR ::", isFormCreated);
        res.status(503).send({ msg: "503" });
        // student record failed to create
      } else {
        // const userId = req.body.createdBy;
        //console.log("Student created ", isFormCreated);
        res.status(200).send({ msg: "200" });
      }
    }
  } catch (err) {
    res.status(500).send({ msg: "500" });
  }
});

//
// search for product with multiple condition here
AddNewProduct.createIndexes({
  product_name: "text",
  product_sale_price: "text",
  product_code_number: "text",
});

router.get("/fetch_product/:key", async (req, res) => {
  let searchValue = req.params.key;
  const regx = new RegExp(searchValue);

  try {
    // const query = [{ $match: { $text: { $search: searchValue } } }];
    const query = [
      {
        $match: {
          $or: [
            {
              product_name: {
                $regex: regx,
              },
            },
            { product_sale_price: parseInt(searchValue) },
            {
              product_code_number: {
                $regex: regx,
              },
            },
          ],
        },
      },
    ];

    // const searchProduct = await AddNewProduct.find(query);
    const searchProduct = await AddNewProduct.aggregate(query);

    // const searchProduct = await AddNewProduct.find({
    //   product_name: searchValue,
    // });
    // const searchProduct = await AddNewProduct.aggregate({
    //   $match: {
    //     $or: [{ product_name: searchValue }, { product_category: searchValue }],
    //   },
    // });

    if (!searchProduct) {
      console.log("ERROR :: No record found");
      res.status(404).send({ msg: "404" });
      // student record failed to create
    } else {
      res.status(200).send(searchProduct);
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});

router.post("/checkout", async (req, res) => {
  const response = await salesProduct.insertMany(req.body);

  if (!response) {
  } else {
    res.status(200).send(response);
  }
});

// pos product search here
module.exports = router;
