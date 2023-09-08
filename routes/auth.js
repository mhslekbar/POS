const router = require("express").Router();
const { login, signup, refreshToken, logout } = require("../controllers/AuthController");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/login", login);
router.post("/signup", signup);
router.post("/refreshToken",  verifyToken, refreshToken);
router.post("/logout", logout);

module.exports = router;
