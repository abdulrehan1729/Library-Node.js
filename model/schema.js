const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: false },
  phone: { type: Number },
  password: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  membership: {
    membership_ends: { type: Date, require: true },
    reading_hours: { type: Number, require: true },
  },
  book_issued: [
    {
      id: { type: ObjectId, ref: "Books" },
      title: { type: String },
      author: { type: String },
      allotted_days: { type: Number },
      issue_date: { type: Date },
      return_date: { type: Date },
      status: {
        type: String,
        enum: ["pending", "active", "rejected", "return"],
        default: "pending",
      },
    },
  ],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String },
  publisher: { type: String },
  issued_to: { type: ObjectId, ref: "User" },
  issue_date: { type: Date },
  return_date: { type: Date },
  status: {
    type: String,
    enum: ["available", "not available"],
    default: "available",
  },
  created_at: { type: Date, default: Date.Now },
  updated_at: { type: Date },
});

userSchema.pre("save", function (next) {
  now = new Date();
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(this.password, salt);
  this.password = hashedPassword;
  this.updated_at = now;
  next();
});

bookSchema.pre("save", function (next) {
  now = new Date();
  this.updated_at = now;
  next();
});

const Book = mongoose.model("Book", bookSchema);
const User = mongoose.model("User", userSchema);
module.exports = { book: Book, user: User };
