const passport = require("passport");

module.exports = {
  initialize: function () {
    return passport.initialize();
  },
  jwtAuthenticate: function (req, res, next) {
    return passport.authenticate(
      "jwt",
      {
        session: false,
      },
      (err, user, info) => {
        if (err) {
          console.log(err);
          return res.json({ error: err });
        }
        if (info !== undefined) {
          console.log(info.message);
          return res.json({ error: info.message });
        } else if (user) {
          user = user[0];
          req.user = user;
          next();
        }
      }
    )(req, res, next);
  },
};
