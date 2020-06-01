const bcrypt = require("bcrypt");
const User = require("../model/schema").user;
const Book = require("../model/schema").book;
const saltRound = 10;

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
    } = req.body;

    const user = {
      first_name: first_name,
      last_name: last_name || null,
      username: username,
      email: email,
      password: await bcrypt.hash(password, saltRound).then((hash) => {
        return hash;
      }),
      phone: phone || null,
      membership: {
        membership_ends: new Date(membership.membership_ends),
        reading_hours: membership.reading_hours,
      },
    };
    User.create(user, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
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
    const book_status = "not available";
    const allotted_book = {
      id: book_details._id,
      title: book_details.title,
      author: book_details.author,
      status: book_details.status,
    };
    if (book_details.status === "rejected") {
      book_status = "available";
    }
    if (book_details.status === "active") {
      let newDate = new Date();
      allotted_book.issue_date = new Date();

      if (book_details.allotted_days === "7") {
        newDate.setDate(newDate.getDate() + 7);
        allotted_book.return_date = newDate;
      }
      if (book_details.allotted_days === "1") {
        newDate.setHours(17, 00, 00);
        allotted_book.return_date = newDate;
      }
    }
    User.findByIdAndUpdate(
      user_id,
      { $push: { book_issued: allotted_book } },
      (err, user) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal server error" });
        }
        if (book_details.status === "active") {
          Book.findByIdAndUpdate(
            allotted_book.id,
            {
              $set: {
                issued_to: user_id,
                issue_date: allotted_book.issue_date,
                return_date: allotted_book.return_date,
                status: book_status,
              },
            },
            (err, book) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ error: "Internal server error" });
              }
            }
          );
        }
        return res.json({ updated: user });
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
