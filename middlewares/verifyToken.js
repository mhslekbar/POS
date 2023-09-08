const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // console.log("ss")
  const authHeaders = req.headers.token;
  if(authHeaders) {
      const token = authHeaders.split(' ')[1];
    //   console.log("token: ", token)
      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
          if(err) {
              return res.status(300).json("Token is not valid!!")
          }else {
              req.user = user
              return next();
          }
      })
  } else {
      return res.status(300).json("You are not authenticated!!");
  }
}

module.exports = { verifyToken }