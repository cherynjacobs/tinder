const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/userModel");

app.use(express.json());
connectDB();

//signup
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({
      message: "User updated successfully",
      data: user,
    });
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
