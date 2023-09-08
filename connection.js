// start database connection
const mongoose = require("mongoose");
const connection = mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connect successfull");
  })
  .catch((err) => {
    console.log(err);
  });
// end database connection

module.exports = connection