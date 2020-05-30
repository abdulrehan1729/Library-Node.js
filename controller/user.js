const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/schema").user;
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

  updateUser(req, res) {
    const { id } = req.body;
    User.findByIdAndUpdate(id, (err, docs) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json({ updated: docs });
    });
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
