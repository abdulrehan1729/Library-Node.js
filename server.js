const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routers/router");
const passport = require("passport");
require("./passport/passport.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8081;

//mongo connection and config
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/libraryNode";
const connectOptions = {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, connectOptions, (err, db) => {
  if (err) console.log(`Error`, err);
  console.log(`Connected to MongoDB`);
});

//body parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//passport
app.use(passport.initialize());

//Routes
app.use("/", router);

app.listen(port, console.log(`Server is ruuning on ${port}`));
