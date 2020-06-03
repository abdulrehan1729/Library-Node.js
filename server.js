require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routers/router");
const passport = require("passport");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8081;
require("./passport/passport.js");
//Static

app.use(express.static(path.join(__dirname, "client", "build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// enables cors
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
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
