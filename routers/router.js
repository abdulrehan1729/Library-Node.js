const router = require("express").Router();
const userController = require("../controller/user");

router.get("/test", (req, res) => {
  res.json({ ok: 200 });
});

// Creating new user
router.post("/user/create", userController.createUser);

router.get("/user/all-users", userController.getAllUsers);

router.post("/user/remove", userController.removeUser);
module.exports = router;
