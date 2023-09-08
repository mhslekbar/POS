const express = require("express");
const app = express();

// include .env file
const dotenv = require("dotenv");
dotenv.config();


const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3291",
  optionsSuccessStatus: 200,
  credentials: true
};

const { verifyToken } = require("./middlewares/verifyToken");
const { setCacheControl } = require("./middlewares/setCacheControl");
const { checkComputer } = require("./middlewares/allowedComputer")

app.use(cors(corsOptions));

const bodyParser = require("body-parser");
const expressMongoSanitize = require("express-mongo-sanitize");

const port = process.env.PORT || 9000;

// start database connection
const mongoose = require("mongoose");
  mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connect successfull");
  })
  .catch((err) => {
    console.log(err);
  });
// end database connection

// Middleware to sanitize input and output to and from MongoDB
app.use(expressMongoSanitize());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use("/auth",        checkComputer, setCacheControl, require("./routes/auth"));
app.use("/setting",     checkComputer, setCacheControl, require("./routes/setting"));
app.use("/company",     checkComputer, setCacheControl, require("./routes/company"));
app.use("/permission",  checkComputer, setCacheControl, require("./routes/permission"));
app.use("/user",        checkComputer, verifyToken, setCacheControl, require("./routes/user"));
app.use("/group",       checkComputer, verifyToken, setCacheControl, require("./routes/group"));
app.use("/product",     checkComputer, verifyToken, setCacheControl, require("./routes/product"));
app.use("/category",    checkComputer, verifyToken, setCacheControl, require("./routes/category"));
app.use("/supplier",    checkComputer, verifyToken, setCacheControl, require("./routes/supplier"));
app.use("/purchase",    checkComputer, verifyToken, setCacheControl, require("./routes/purchase"));
app.use("/client",      checkComputer, verifyToken, setCacheControl, require("./routes/client"));
app.use("/sale",        checkComputer, verifyToken, setCacheControl, require("./routes/sale"));
app.use("/consumption", checkComputer, verifyToken, setCacheControl, require("./routes/consumption"));

// Start the server
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});




