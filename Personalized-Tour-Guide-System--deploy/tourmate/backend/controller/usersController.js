const User = require('../models/User');
const bcrypt = require('bcrypt');


const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
  
  const { user } = req.params;

    if (!user) {
        return res.status(400).json({ "message": 'username required' });
      }
      try {

        const userr = await User.findOne({ username: user }).exec();
        console.log(userr);
        if (!userr) {
            return res.status(402).json({ 'message': `still not registered` });
        }
        

        const match = await bcrypt.compare(req.body.password, userr.password);
        console.log(match)
        if(match){
          const result = await userr.deleteOne({ username: user });
          console.log(result)
          res.json(result);  
    }
    else{
         return res.status(406).json({ 'message': 'Confirm password is not matched.' });
    }
        
      } catch (err) {
        res.status(500).json({ message: 'An error occurred while deleting the account.' });
      }


}

const getUser = async (req, res) => {
    const { username } = req.params;
    if (!username) return res.status(400).json({ "message": 'Username required' });
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `Username ${req.params.id} not found` });
    }
    res.json(user);
}


const updateUsername = async (req, res) => {
  console.log("username changed");
    const { user } = req.params;
    const { username,password } = req.body;
    if (!user) {
      return res.status(400).json({ 'message': 'username is required.' });
    }
    try {
        const userr = await User.findOne({ username: user });
        const match = await bcrypt.compare(password, userr.password);
        if(match){
      
            if (username === userr.username ) {
                return res.status(402).json({ message: 'No changes made to the profile.' });
              }
            
              
              const existingUsername = await User.findOne({
                _id: { $ne: userr._id },
               username: username,
              }).exec();
          console.log(existingUsername);
              if (existingUsername) {
                return res.status(406).json({ message: 'Username is already used.' });
              }
          

              if (username) userr.username = username;
          
              const result = await userr.save();
              res.json(result);
        
    }
    else{
         return res.status(409).json({ 'message': 'Confirm password is not matched.' });
    }
        
      } catch (err) {
        res.status(500).json({ message: 'An error occurred while updating username.' });
      }
   

    
   
   
  };

  const updateUserEmail = async (req, res) => {
    const { user } = req.params;
    const { email,password } = req.body;
    console.log("g",email);
    console.log("g",user);
    if (!user) {
      return res.status(400).json({ 'message': 'username is required.' });
    }
    try {
        const userr = await User.findOne({ username: user });
        const match = await bcrypt.compare(password, userr.password);
        console.log(userr.email);
        if(match){
      
              if (email === userr.email ) {
                return res.status(402).json({ message: 'No changes made to the profile.' });
              }
              
          
              const existingUserEmail = await User.findOne({
                _id: { $ne: userr._id },
                 email: email,
              }).exec();
              console.log("existingUserEmail");
              console.log(existingUserEmail);
              if (existingUserEmail) {
                return res.status(418).json({ message: 'Email is already used.' });
              }

             
              if (email) userr.email = email;
          
              const result = await userr.save();
              res.json(result);
        
    }
    else{
         return res.status(409).json({ 'message': 'Confirm password is not matched.' });
    }
        
      } catch (err) {
        res.status(500).json({ message: 'An error occurred while updating the profile.' });
      }
   

    
   
   
  };

  const updateUserpass = async (req, res) => {
    const { user } = req.params;
    const { confirmPwd , pwd, matchPwd } = req.body;
    if (!user) {
      return res.status(400).json({ 'message': 'username is required.' });
    }
  
    const userr = await User.findOne({ username: user });
    const match = await bcrypt.compare(confirmPwd, userr.password);

    if(match){
        if(pwd===matchPwd){
        const hashedPwd = await bcrypt.hash(pwd, 10);
        userr.password=hashedPwd;
        const result = await userr.save();
        res.json(result);
    }else{
         return res.status(406).json({ 'message': 'New and Re-password is not matched.' });
    }
}
else{
     return res.status(409).json({ 'message': 'Confirm password is not matched.' });
}
   
   
  };

  const updateUserimage = async (req, res) => {
    const { user } = req.params;
    const { image } = req.body;
    if (!user) {
      return res.status(400).json({ 'message': 'username is required.' });
    }
  
    const userr = await User.findOne({ username: user });
    
   
        userr.image=image;
        const result = await userr.save();
        res.json(result);
   
  };

  const removeUserImage = async (req, res) => {
  
    const { user } = req.params;
  
      if (!user) {
          return res.status(400).json({ "message": 'username required' });
        }
        try {
  
          const userr = await User.findOne({ username: user }).exec();
          console.log(userr);
          if (!userr) {
              return res.status(402).json({ 'message': `still not registered` });
          }
          
  
          
          userr.image = null;
          await userr.save();
            res.json({ message: 'Image removed successfully' });  
      
     
          
        } catch (err) {
          res.status(500).json({ message: 'An error occurred while deleting the account.' });
        }
  
  
  }
module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    updateUsername,
    updateUserEmail,
    updateUserpass,
    updateUserimage,
    removeUserImage
}