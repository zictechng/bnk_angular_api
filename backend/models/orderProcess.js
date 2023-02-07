const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderProcessSchema = new Schema({
  customer_email: String,
  customer_name: String,
  customer_phone: String,
  customer_address: String,
  order_name: String,
  order_qty: String,
  order_amt: String,
  order_total: String,
  reg_id: String,
  addedby: String,
  order_status: {
    type: String,
    default: "Processing",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("order", orderProcessSchema);
