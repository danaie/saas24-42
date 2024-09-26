const {User} = require('../connect_db.js');
const { verifyToken } = require('../services/googleAuthService');
const {publishMsg} = require('./pubController.js')

const loginWithGoogle = async (req, res) => {
  console.log(req.body);
  try{
  const { idToken } = req.body; // Getting the idToken sent from the frontend
  console.log(idToken);
  
    const payload = await verifyToken(idToken);
    console.log("token verified");

    const { sub: googleId, email } = payload;    

    // Check if the user already exists in the database
    let user = await User.findOne({ _id: googleId });
    console.log(user);

    

    if (!user) {
      console.log("user not found");
      // If user doesn't exist, create a new user
      const uname = email.substring(0, email.indexOf('@'));
      if (uname === 'fachrimag'){
        user = new User ({
            _id: googleId,
            username: uname,
            role: 'admin'
        })
    }
    else{
        user = new User({
            _id: googleId,
            username: uname,
            role: 'user'
          });
    }

    publishMsg(googleId);
    
    await user.save();
    console.log("user saved");
    }


    // Send user info and role back to frontend
    res.status(200).json({
      message: 'Login successful',
      user: {
        googleId: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).json({ error: 'Invalid ID Token or User creation failed', error,  token: idToken});
  }
};

module.exports = { loginWithGoogle };