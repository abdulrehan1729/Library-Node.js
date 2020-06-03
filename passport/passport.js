const bcrypt = require("bcrypt");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../model/schema").user;

require("dotenv").config();

passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    try {
      User.find(
        {
          username: username,
        },
        (err, user) => {
          if (err) {
            console.log(err);
            return res.json("Ineternal server error");
          }
          if (!user.length) {
            return done(null, false, { message: "bad username" });
          }
          bcrypt.compare(password, user[0].password).then((response) => {
            if (response !== true) {
              console.log("passwords do not match");
              return done(null, false, { message: "passwords do not match" });
            }
            console.log("user found & authenticated");
            return done(null, user);
          });
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("bearer"),
  secretOrKey: process.env.JWT_SECRET || "53cr3t-k3y",
};

passport.use(
  "jwt",
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
      User.find(
        {
          _id: jwt_payload.sub,
        },
        (err, user) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
          }
          if (user[0]) {
            console.log("user found in db in passport");
            done(null, user);
          } else {
            console.log("user not found in db");
            done(null, false);
          }
        }
      );
    } catch (err) {
      done(err);
    }
  })
);
