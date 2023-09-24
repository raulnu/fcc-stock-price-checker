const mongoose = require("mongoose");
const { Schema } = mongoose;

const StockSchema = new Schema({
  stock: { type: String, required: true },
  likes: { type: [String], default: [] }
})
const Stock = mongoose.model("Stock", StockSchema);

exports.Stock = Stock;