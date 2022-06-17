const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
var jwt = require("jsonwebtoken");
const success = false;
// Route 1 : Create a user using POST /"api/auth/createUser". Dosen't require Auth

const JWT_SECRET = "fuck_Your_mom_a$$";
router.post(
  "/createUser",
  [
    body("name", "Enter a Valid Name !").isLength({ min: 3 }),
    body("email", "Enter a Valid Email !").isEmail(),
    body("password", "Enter a Valid Password !").isLength({ min: 8 }),
  ],
  async (req, res) => {
    //If there are error return bad reauest and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    // Get user data form body
    let user = await User.findOne({ email: req.body.email });

    // Check whether user email already exsist in DB
    if (user) {
      //If user email alredy exsist in DB show error

      console.log("Email is already exsist in DB : " + user.email);
      return res
        .status(400)
        .json({ sucess: success, err: "Email is already exsist in DB" });
    }

    // Hashing Password
    const { name, email, password } = req.body;
    // const salt = await bcrypt.genSalt(10);
    // const secPass = await bcrypt.hash(password, salt);

    // if there are no user with this emmail create a new user
    try {
      user = await User.create({
        name: name,
        email: email,
        password: password,
      });
      console.log("User is Created !");

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ success: !success, authToken: authToken });
    } catch (error) {
      res.json({ sucess: success, err: " Internal server error 1" });
      console.log("Internal server error 1");
      res.status(500);
    }
  }
);

// Route 2 :  Create a user using POST /"api/auth/login". Dosen't require Auth

router.post(
  "/login",
  [
    body("email", "Enter a Valid Email !").isEmail(),
    body("password", "Password can't be blank !").exists(),
    body("password", "Enter a Valid Password !").isLength({ min: 8 }),
  ],
  async (req, res) => {
    //If there are error return bad reauest and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, err: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        console.log("Login Unsucessfully");
        return res
          .status(400)
          .json({ success: success, err: "Email dons't exist in DB ! " });
      }

      // const passwordCompare = await bcrypt.compare(password, user.password);
      const passwordCompare = await (user.password === password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success: success, err: "Incorrect Password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ success: !success, authToken });

      console.log("Login Sucessfully");
    } catch (error) {
      console.log("Login Unsucessfully");
      console.log("Internal server error 2");
      res.status(500);
      res.json({ success: success, err: " Internal server error 2" });
    }
  }
);

// Route 3 : Get Loginned details of User Details Using POST . Login Required

router.post("/getUser", fetchUser, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    if (user === null) {
      return res.status(404).send({ success: success, err: "User Not found" });
    }

    res.json({ success: !success, user: user });
  } catch (error) {
    res.send("Internal server error").status(400);
  }
});

module.exports = router;
