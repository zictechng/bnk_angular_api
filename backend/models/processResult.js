const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const processResultSchema = new Schema({
  student: {
    type: Schema.ObjectId,
    ref: "student",
  },
  ca1_score: String,
  ca2_score: String,
  tca_score: String,
  exam_score: String,
  total_score: String,
  student_name: String,
  student_reg: String,
  class_name: String,
  term_name: String,
  year_name: String,
  subject_name: String,
  reg_code: String,
  addedby: String,
  status: {
    type: String,
    default: "Pending",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("result", processResultSchema);
