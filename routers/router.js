const router = require("express").Router();
const userController = require("../controller/user");
const bookController = require("../controller/book");

router.get("/test", (req, res) => {
  res.json({ ok: 200 });
});

// Creating new user
router.post("/user/create", userController.createUser);

router.get("/user/all-users", userController.getAllUsers);

router.post("/user/update", userController.updateUserHistory);

router.post("/user/remove", userController.removeUser);

// Book Api's
router.post("/book/create", bookController.createBook);

router.get("/book/all-books", bookController.getAllBooks);

router.post("/book/return", bookController.updateBookReturn);

module.exports = router;
