require("dotenv").config();
const seeder = require("mongoose-seed");
const db = process.env.MONGODB_URI || "mongodb://localhost/libraryNode";
const bcrypt = require("bcrypt");
const saltRound = 10;

seeder.connect(db, function () {
  // Load Mongoose models
  seeder.loadModels(["./model/schema"]);

  // Clear specified collections
  seeder.clearModels(["User", "Book"], function () {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function (err, done) {
      if (err) {
        return console.log(err);
      }

      seeder.disconnect();
    });
  });
});

// Data array containing seed data - documents organized by Model
var data = [
  {
    model: "User",
    documents: [
      {
        first_name: "admin",
        last_name: "",
        username: "admin",
        email: "admin@this.com",
        password: "administrator",
        phone: "123457890",
        membership: {
          membership_ends: "2020-07-31",
          reading_hours: "50",
        },
        role: "admin",
      },
      {
        first_name: "user1",
        last_name: "",
        username: "user1",
        password: "user123",
        email: "user1@this.com",
        phone: "123457890",
        membership: {
          membership_ends: "2020-07-31",
          reading_hours: "50",
        },
        role: "user",
      },
      {
        first_name: "user2",
        last_name: "",
        username: "user2",
        password: "user123",
        email: "user2@this.com",
        phone: "123457890",
        membership: {
          membership_ends: "2020-07-31",
          reading_hours: "50",
        },
        role: "user",
      },
      {
        first_name: "user3",
        last_name: "",
        username: "user3",
        password: "user123",
        email: "user3@this.com",
        phone: "123457890",
        membership: {
          membership_ends: "2020-07-31",
          reading_hours: "50",
        },
        role: "user",
      },
      {
        first_name: "user4",
        last_name: "",
        username: "user4",
        email: "user4@this.com",
        password: "user123",
        phone: "123457890",
        membership: {
          membership_ends: "2020-07-31",
          reading_hours: "50",
        },
        role: "user",
      },
    ],
  },
  {
    model: "Book",
    documents: [
      {
        title: "Eloquent JavaScript, Second Edition",
        author: "Marijn Haverbeke",
        publisher: "No Starch Press",
        status: "available",
      },
      {
        title: "Learning JavaScript Design Patterns",
        author: "Addy Osmani",
        publisher: "O'Reilly Media",
        status: "available",
      },
      {
        title: "Speaking JavaScript",
        author: "Axel Rauschmayer",
        publisher: "O'Reilly Media",
        status: "available",
      },
      {
        title: "Programming JavaScript Applications",
        author: "Eric Elliott",
        publisher: "O'Reilly Media",
        status: "available",
      },
      {
        title: "Understanding ECMAScript 6",
        author: "Nicholas C. Zakas",
        publisher: "No Starch Press",
        status: "available",
      },
      {
        title: "You Don't Know JS",
        author: "Kyle Simpson",
        publisher: "O'Reilly Media",
        status: "available",
      },
      {
        title: "Git Pocket Guide",
        author: "Richard E. Silverman",
        publisher: "O'Reilly Media",
        status: "available",
      },
      {
        title: "Designing Evolvable Web APIs with ASP.NET",
        author: "Glenn Block, et al.",
        publisher: "O'Reilly Media",
        status: "available",
      },
    ],
  },
];
