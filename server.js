const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000;

const app = express();

if ("development" == app.get("env")) {
  app.use(require("morgan")("dev"));
  require("dotenv").config();
}

app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(`mongodb+srv://usmantheadmin:${process.env.DB_PASSWORD}@cluster0.ztv1h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});