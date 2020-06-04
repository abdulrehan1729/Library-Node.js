const router = require("express").Router();
const userController = require("../controller/user");
const bookController = require("../controller/book");
const jwtAuth = require("../middleware/middleware").jwtAuthenticate;

router.get("/test", (req, res) => {
  res.json({ ok: 200 });
});

// Creating new user
router.post("/user/login", userController.login);

router.post("/user/create", userController.createUser);

// router.use(jwtAuth);

router.post("/user/logout", userController.signOut);

router.get("/user/all-users", userController.getAllUsers);

router.get("/user/history", userController.userHistory);

router.post("/user/request-book-and-update", userController.updateUserHistory);

router.post("/user/history/delete", userController.deleteUserHistory);

router.post("/user/remove", userController.removeUser);

// Book Api's
router.post("/book/create", bookController.createBook);

router.get("/book/all-books", bookController.getAllBooks);

router.get("/book/requests", userController.bookRequests);

router.post("/book/return", bookController.updateBookReturn);

router.post("/book/delete", bookController.removeBook);

module.exports = router;
