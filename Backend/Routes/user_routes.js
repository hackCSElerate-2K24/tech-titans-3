const express = require('express');
const UserModel = require('../Models/user_models');
const authRoutes = express.Router();


// Create new User 
authRoutes.post('/signUp', async (req, res) => {
    const { userName, userEmail, password } = req.body;
    try {
        const existingUserName = await UserModel.findOne({ userName });
        if (existingUserName) {
            return res.status(400).send('Change UserName, this UserName already exists.');
        }

        const existingUserEmail = await UserModel.findOne({ userEmail });
        if (existingUserEmail) {
            return res.status(400).send('Change UserEmail, this UserEmail is already associated with an existing user.');
        }

        const newUser = new UserModel({
            userName: userName,
            userEmail: userEmail,
            password: password,
        });

        const savedUser = await newUser.save();
        return res.status(200).send('User is Saved');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
});


// SignIn User 
authRoutes.post('/signIn', async (req,res)=>{
     try {
        const {userEmail,password} = req.body;
        const findUser = UserModel.findOne({userEmail});
        if(!findUser){
            return res.status(400).send('User With this Email in not Founeded');
        }
        if(findUser.password != password){
            return res.status(400).send('Password is incorrect');
        }
        return res.status(200).send('LogIn......');
     } catch (error) {
        
     }
});


module.exports = authRoutes;