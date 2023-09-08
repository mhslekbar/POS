const CryptoJS = require("crypto-js");
const UserModel = require("../models/UserModel")
const jwt = require("jsonwebtoken");
const RefreshTokenModel = require("../models/RefreshTokenModel")

const generateRefreshToken = (user) => jwt
  .sign(
    {id: user._id},
    process.env.JWT_REFRESH_SEC,
  )

const generateAccessToken = (user) => jwt
  .sign(
    { id: user._id },
    // { expiresIn: "3d" },
    process.env.JWT_SEC
  )

let arrOfTokens = []

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await UserModel.findOne({ username});
        if(!user) {
            res.json({formErrors: "Username is Wrong"});
        } else {
            // start get password and decrypt it 
            const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
            const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            // end get password and decrypt it 
           
            if (OriginalPassword !== password) {
                res.json({formErrors: "Wrong Password"});
            } else {
                const accessToken = generateAccessToken(user)
                const refreshToken = generateRefreshToken(user)
                // await RefreshTokenModel.create({token: refreshToken})
                arrOfTokens.push(refreshToken)
                // console.log("arrOfTokens: ", arrOfTokens)
                const {password, ...others} = user._doc
                res.status(200).json({success: {...others, accessToken, refreshToken}});
            }
        }

    } catch(err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }
}

const refreshToken  =  async (req, res) => {
  // Take the refresh token from user
  const { token } = req.body
  console.log("arrOfTokens", arrOfTokens)
  console.log("token", token)
  // send error if there is no token or it's invalid
  if(!token) return res.status(300).json("You Are not authenticateddd");
  // const refreshTokenData = await RefreshTokenModel.findOne({ token }) // 
  // const refreshTokenData = arrOfTokens.filter(token => token !== token) // 
  // console.log("refreshTokenData: ", refreshTokenData)

  if(!arrOfTokens.includes(token)) {
    return res.status(300).json("Refresh Token is not valid")
  }
  //  if everything is okay
  jwt.verify(token, process.env.JWT_REFRESH_SEC, async (err, user) => {
    if(err) {
      console.log(err)
    } else {
      arrOfTokens = arrOfTokens.filter(token => token !== token) // 
      const newAccessToken = generateAccessToken(user)
      const newRefreshToken = generateRefreshToken(user)
      arrOfTokens.push(newRefreshToken)
      // refreshTokenData.token = newRefreshToken 
      // refreshTokenData.save();
      // console.log("newRefreshToken: ", newRefreshToken)
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      })
    }
  })
}

const logout = async (req, res) => {
  try {
    // const { token } = req.body
    // const RefreshTokenData = await RefreshTokenModel.deleteMany()
    arrOfTokens = []
    res.status(200).json({success: arrOfTokens})
  } catch (err) {
    res.status(500).json({err: err.message})
  }
}

const signup = async (req, res) => {
    try {
        const { username, password, phone, groups } = req.body
        const checkExist = await UserModel.findOne({username});
        const formErrors = []
        
        if(checkExist) {
            formErrors.push("le nom deja existe essayer avec un autre !!!");
        }
        if(username.length === 0) {
            formErrors.push("le nom est obligatoire");
        }
        if(password.length === 0) {
            formErrors.push("le mot de passe est obligatoire");
        }
        
        if(formErrors.length === 0) {
            const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC)
            const newUser = await UserModel.create({username, password: encryptedPassword, phone, groups});
            res.status(200).json({success: newUser});
        } else {
            res.status(300).json({formErrors});
        }

    } catch(err) {
        res.status(500).json({ err : err.message });
    }    
};


module.exports = { login, signup, refreshToken, logout }
