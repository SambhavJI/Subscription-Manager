const express = require("express")
const { registerUser, loginUser, logout } = require("./controllers/authcontroller")
const {addSub,removeSub,updateSub}  = require("./controllers/subscriptionController")
const userAuth = require("./middleware/auth")
require("dotenv").config()
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")

const app = express()
app.use(express.json());
app.use(cookieParser());

app.post("/signUp", registerUser);
app.post("/login", loginUser);
app.post("/logout", logout);

app.post("/Add",userAuth,addSub)
app.post("/remove/:subId",userAuth,removeSub)
app.patch("/update/:subId",userAuth,updateSub)

connectDB()
  .then(() => {
    console.log("Database Connected Successfully...");

    app.listen(3000, () => {
      console.log("The server was connected successfully at port 3000");
    });
  })
  .catch((err) => {
    console.error("An error occurred while connecting to the database:", err);
  });