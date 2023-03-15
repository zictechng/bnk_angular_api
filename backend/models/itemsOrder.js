const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemsOrderSchema = new Schema({
  product_name: String,
  product_description: String,
  product_sale_price: Number,
  product_qty: Number,
  product_total_amt: Number,
  product_id: String,
  reg_code: String,
  product_order_id: String,
  addedby: String,
  product_status: {
    type: String,
    default: "Ordered",
  },
  createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("items_order", itemsOrderSchema);
