const Book = require("../model/schema").book;
const User = require("../model/schema").user;

module.exports = {
  createBook(req, res) {
    console.log(req.body);
    const { title, author, publisher } = req.body;
    console.log(title);
    const book = { title: title, author: author, publisher: publisher };
    Book.create(book, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json(docs);
    });
  },

  getAllBooks(req, res) {
    let query = Book.find({});
    query.exec((err, docs) => {
      if (err) {
        return res.status(500).json({ error: "internal server error" });
      }
      return res.json(docs);
    });
  },
  updateBookReturn(req, res) {
    // console.log(req);
    const { _id, issued_to } = req.body;
    Book.findByIdAndUpdate(
      _id,
      { $set: { status: "available" } },
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Internal server error" });
        }
        User.findOneAndUpdate(
          {
            _id: issued_to,
            book_issued: { $elemMatch: { id: _id, status: "active" } },
          },
          {
            $set: {
              "book_issued.$.return_date": new Date(),
              "book_issued.$.status": "return",
            },
          },
          (err, docs) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ error: "Internal server error" });
            }
            return res.json({ Book: data, User: docs });
          }
        );
      }
    );
  },
  removeBook(req, res) {
    const { id } = req.body;
    Book.findByIdAndDelete(id, (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json({ Deleted: docs });
    });
  },
};
