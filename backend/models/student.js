const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  email: String,
  name: String,
  phone: String,
  password: String,
  photo: String,
  student_class: String,
  sch_category: String,
  acct_pin: String,
  acct_status: String,
  acct_type: String,
  country: String,
  reg_number: String,
  dob: String,
  address: String,
  addedby: String,
  student_role: {
    type: String,
    default: "student",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("student", studentSchema);
