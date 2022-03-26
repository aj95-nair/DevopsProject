const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {SECRET} = require('../config');

const login = async (userdata ,res) => {
    let {username, password} = userdata;

    const user = await User.findOne({username});
    if(!user){
        return res.status(404).json({
            message: "No User is registered by this username",
            success: false
        });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if(isMatch){
        // give JWT token 
        let token = jwt.sign({
            user_id: user._id, 
            role: user.role,
            username: user.username,
            email:user.email
        }, SECRET, {expiresIn: "2 days"});

        let otoken = {
            username: user.username,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 48
        };
        return res.status(200).json({
            otoken,
            message: `${user.role} Logging Successful`,
            success: true
        });

    }else{
        return res.status(404).json({
            message: "you have entered the wrong password",
            success: false
        });
    }
}

module.exports = {
    login
}