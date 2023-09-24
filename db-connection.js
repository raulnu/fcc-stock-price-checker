const mongoose = require("mongoose");
require('dotenv').config();

const db = mongoose.connect(String(process.env.DB), {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

module.exports = db;