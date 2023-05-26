const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const app = express();

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use(express.json());

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "AJwefD809uasdj29a8ASasj28S";

console.log(process.env.MONGO_URL);
//0n772csUcpn9EfCI
mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(422).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const checkPs = bcrypt.compareSync(password, userDoc.password);
      if (checkPs) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {},
          (error, token) => {
            if (error) {
              throw error;
            }
            res
              .cookie("token", token, {
                httpOnly: true,
                maxAge: 3600 * 1000,
                secure: true,
                sameSite: "strict",
              })
              .json("pass ok");
            console.log("ok");
          }
        );
      } else {
        res.status(422).json("pass is not same");
      }
    } else {
      res.json("user not found");
    }
  } catch (error) {}
});

app.listen(4000);
