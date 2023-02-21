const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const saveResultSchema = new Schema({
  exam_score: String,
  total_ca: Number,
  final_total: Number,
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
  stu_position: String,
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("result_position", saveResultSchema);
