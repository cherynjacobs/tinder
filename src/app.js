const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/userModel");
const { validateSignUp } = require("./utils/ValidateSignUp");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/userAuth");

app.use(express.json());
app.use(cookieParser());
connectDB();

//signup
app.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.send({ message: error.message });
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Please enter a valid email address");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create jwt token

      const token = await jwt.sign({ _id: user._id }, "HEHHhsa12hsh");

      res.cookie("token", token);
      res.send("Login successfull");
    } else {
      res.send("Invalid credentials");
    }
  } catch (error) {
    res.send({ message: error.message });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.send({ message: error.message });
  }
});

//get user by email

app.get("/user", async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.find({ emailId });
    if (user.length === 0) {
      return res.json({
        message: "User not found",
      });
    }

    res.send({
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    res.send({ message: error.message });
  }
});

//show all user

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.send({ message: error.message });
  }
});

//update the user data

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const ALLOWED_UPDATES = [
      "photoURL",
      "about",
      "gender",
      "skills",
      "age",
      "password",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      return res.status(400).json({
        message: "Update not allowed",
      });
    }

    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    res.send(updateUser);
  } catch (error) {
    res.send({ message: error.message });
  }
});

//delete the user data

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;

    const updateUser = await User.findByIdAndDelete(userId);
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.send({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server started at port 3000");
});
