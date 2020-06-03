const User = require("../model/schema").user;
const Book = require("../model/schema").book;
const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports = {
  async createUser(req, res) {
    const {
      first_name,
      last_name,
      username,
      email,
      phone,
      password,
      membership,
      role,
    } = req.body;

    const user = {
      first_name: first_name,
      last_name: last_name || null,
      username: username,
      email: email,
      password: password,
      phone: phone || null,
      membership: {
        membership_ends: new Date(membership.membership_ends),
        reading_hours: membership.reading_hours,
      },
      role: role,
    };
    User.create(user, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  },

  login(req, res, next) {
    try {
      if (!req.body.username || !req.body.password) {
        return res.status(400).send({
          message: "username or passpword required",
        });
      }
      passport.authenticate("login", (err, user, info) => {
        if (err) {
          console.error(`error ${err}`);
        }
        if (info !== undefined) {
          console.error(info.message);
          if (info.message === "bad username") {
            res.status(401).json({ message: info.message });
          } else {
            res.status(403).json({ message: info.message });
          }
        } else {
          user = user[0];
          req.logIn(user, () => {
            const token = jwt.sign(
              { sub: user._id, username: user.username, role: user.role },
              "53cr3t-k3y",
              {
                expiresIn: 60 * 60 * 24,
              }
            );
            res.status(200).send({
              auth: true,
              username: user.userName,
              token,
              message: "user found & logged in",
            });
          });
        }
      })(req, res, next);
    } catch (err) {
      console.log(err);
    }
  },
  signOut(req, res) {
    try {
      const { user } = req;
      if (user) {
        req.logout();
        res.status(200).send({ msg: "logging out" });
      } else {
        console.log(user);
        res.send({ msg: "no user to log out" });
      }
    } catch (e) {
      throw e;
    }
  },

  getAllUsers(req, res) {
    User.find({}, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server error" });
      }
      return res.json(docs);
    });
  },

  bookRequests(req, res) {
    User.aggregate(
      [
        { $match: { "book_issued.status": "pending" } },
        {
          $project: {
            book_issued: {
              $filter: {
                input: "$book_issued",
                as: "book_issued",
                cond: { $eq: ["$$book_issued.status", "pending"] },
              },
            },
            _id: 0,
          },
        },
      ],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal server error" });
        }
        if (!data.length) {
          return res.json({ message: "No book issue requests" });
        }
        let book_requests = new Array();
        data.map((request) => {
          let [...book_objects] = request.book_issued;
          book_requests.push(...book_objects);
        });
        return res.json(book_requests);
      }
    );
  },

  userHistory(req, res) {
    // console.log(req);
    const { id } = req.query;
    let query = User.findById(id).select("book_issued");

    query.exec((err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!data) {
        return res.json({ message: "No History" });
      }
      return res.json(data);
    });
  },

  /**
  book_details:{
    id,
    title,
    author,
    allotted_days: [1,7],
    status: ['pending', 'active', 'rejected', 'return']
  }
   */
  updateUserHistory(req, res) {
    const { user_id, book_details } = req.body;
    const allotted_book = {
      id: book_details._id,
      title: book_details.title,
      author: book_details.author,
      allotted_days: book_details.allotted_days,
      status: book_details.status,
    };

    if (book_details.status === "pending") {
      User.findByIdAndUpdate(
        user_id,
        { $push: { book_issued: allotted_book } },
        (err, user) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
          }
          return res.json({ updated: user.book_issued });
        }
      );
    }
    if (book_details.status === "rejected") {
      User.findOne({
        "book_issued._id": book_details._id,
        "book_issued.status": "pending",
      })
        .then((doc) => {
          doc.book_issued = doc.book_issued.map((book) => {
            if (book.id == book_details.id && book.status === "pending") {
              book.status = "rejected";
            }
            return book;
          });
          doc.save();
          return res.json(doc.book_issued);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (book_details.status === "active") {
      let newDate = new Date();
      if (newDate.getHours() >= 17 || newDate.getHours() <= 9) {
        return res.json({
          error: "Books can only be issue between 9AM to 5PM",
        });
      }
      allotted_book.issue_date = new Date();

      if (book_details.allotted_days == "7") {
        newDate.setDate(newDate.getDate() + 7);
        allotted_book.return_date = newDate;
      }
      if (book_details.allotted_days == "1") {
        newDate.setHours(17, 00, 00);
        allotted_book.return_date = newDate;
      }
      Book.findOneAndUpdate(
        { _id: book_details.id },
        {
          $set: {
            issued_to: user_id,
            issue_date: allotted_book.issue_date,
            return_date: allotted_book.return_date,
            status: "not available",
          },
        },
        (err, docs) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
          }
          console.log(book_details.id);
          console.log(docs);
          User.findOne({
            "book_issued._id": book_details._id,
            "book_issued.status": "pending",
          })
            .then((doc) => {
              doc.book_issued = doc.book_issued.map((book) => {
                if (book.id == book_details.id && book.status === "pending") {
                  book.status = "active";
                  book.issue_date = allotted_book.issue_date;
                  book.return_date = allotted_book.return_date;
                }
                return book;
              });
              doc.save();
              return res.json(doc.book_issued);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    }
  },

  deleteUserHistory(req, res) {
    const { user_id, book_data } = req.body;
    User.updateOne(
      { _id: user_id },
      {
        $pull: {
          book_issued: { id: book_data.id, status: book_data.status },
        },
      },
      (err, resp) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal server error" });
        }
        return res.json(resp);
      }
    );
  },

  removeUser(req, res) {
    const { id } = req.body;
    User.findByIdAndDelete(id, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json({ Deleted: docs });
    });
  },
};
