const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  let user;
  let email;
  let foundUser;
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  let refreshToken = cookies.jwt;
 // console.log("rr",refreshToken);
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
   
    foundUser = await User.findOne({ username: decoded.username }).exec();

    if (foundUser) {
      user = decoded.username;
      email = foundUser.email;
      
    } else {
      // If the user is not found by username, search by email
      foundUser = await User.findOne({ email: decoded.email }).exec();
    
      if (foundUser) {
        user = foundUser.username;
        email = decoded.email;
       
      } else {
        return res.sendStatus(403); // Forbidden
      }
    }
    
    // const foundEmployee = await Employee.findOne({ eid: foundUser.username }).exec();
    const roles = Object.values(foundUser.roles);
    

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: user,
          email:email,
          roles: roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
     refreshToken = jwt.sign(
      { "username": user, email: email, },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
  );
  console.log("rft",refreshToken);
  // Saving refreshToken with current user
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();
  
  // Creates Secure Cookie with refresh token
  res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
    res.json({ user,email,roles, accessToken });
  } catch (error) {
    
    res.sendStatus(403);
  }
};

module.exports = { handleRefreshToken };
