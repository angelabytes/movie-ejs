const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
    logonShow,
    registerShow,
    registerDo,
    logoff,
} = require("../controllers/sessionController");
const csrf = require("host-csrf");

router
    .route("/logon")
    .get(logonShow)
    .post(
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/sessions/logon",
            failureFlash: true,
        })
    );

router.route("/register").get(registerShow).post(registerDo);
router.route("/logoff").post(logoff);

module.exports = router;
