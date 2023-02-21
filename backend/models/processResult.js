const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const processResultSchema = new Schema({
  student: {
    type: Schema.ObjectId,
    ref: "student",
  },
  ca1_score: Number,
  ca2_score: Number,
  tca_score: Number,
  exam_score: Number,
  total_score: Number,
  student_name: String,
  student_reg: String,
  class_name: String,
  term_name: String,
  year_name: String,
  subject_name: String,
  reg_code: String,
  addedby: String,
  f_position: String,
  status: {
    type: String,
    default: "Pending",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("result", processResultSchema);
