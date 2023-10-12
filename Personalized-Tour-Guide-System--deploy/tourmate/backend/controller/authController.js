const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

var nodemailer = require("nodemailer");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  let foundUser;
  let name;
  let email;
  let roles;
 console.log(user);
 console.log(pwd);
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
      try {
      if(user.includes("@gmail.com")){
    foundUser = await User.findOne({ email: user }).exec();
    
    if (!foundUser){
      return res.status(406).json({ 'message': 'Username is not found.' });
    } 
    name = foundUser.username;
     roles = foundUser.roles ? Object.values(foundUser.roles).filter(Boolean) : [];
       email = user;
      }else{
        foundUser = await User.findOne({ username: user }).exec();
        if (!foundUser){
          return res.status(406).json({ 'message': 'Username is not found.' });
        } 
        name = user;
        roles = foundUser.roles ? Object.values(foundUser.roles).filter(Boolean) : [];
       email = foundUser.email;
      }
    
    const match = await bcrypt.compare(pwd, foundUser.password);
    
    if (match) {
        
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "email":email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username, email: email, },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        
        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
       console.log("1");
       console.log(email);
       console.log(accessToken);
    // Send authorization and access token to user
    res.json({ user: name,email,roles, accessToken });
    console.log("2");
  } else {
    return res.status(401).json({ 'message': 'Password mismatching.' });
  }
} catch (error) {
  console.error("An error occurred:", error);
  res.status(500).json({ error: "Internal server error" });
}
};

const forget = async (req, res) => {
  const { user, pwd } = req.body;
  try {
   // const emp = await Employee.findOne({ eid: user });
    const oldUser = await User.findOne({ username: user });
console.log(oldUser)
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }

    const email = oldUser.email;

    const password = crypto.randomBytes(8).toString("hex"); // Generate a random password

    const encryptedPassword = await bcrypt.hash(password, 10);
    oldUser.password = encryptedPassword;
    const result = await oldUser.save();
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "denojanse1009@gmail.com",
        pass: "sdykwrtvbkpqrpxj",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var mailOptions = {
      from: "denojanse1009@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Your new password is: ${password}. \nYou change login using this password and update new password using this as your current password. `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
      }
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { handleLogin, forget };
