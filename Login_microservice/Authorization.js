const User = require("../models/Users");
const patientdb = require("../models/Patient");
const treatmentdb = require("../models/Treatment");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {SECRET} = require('../config');
const passport = require('passport');
const morgon = require('morgan');

//register a patient func

const patientregister = async(userDetails, role, res) => {
    try{
        let usernamecheck = await(checkusername(userDetails.username));
        if(!usernamecheck){
            return res.status(400).json({
                message: `Username is already taken`,
                success: false
            });
        }
        let emailcheck = await(checkuseremail(userDetails.email));
        if(!emailcheck){
            return res.status(400).json({
                message: `Email is already registered`,
                success: false
            });
        }
    
        const password = await bcrypt.hash(userDetails.password, 12);
        const username = userDetails.username;
        const name = userDetails.name;
        const email = userDetails.email;
        const phno = userDetails.phno;
        const firstname = userDetails.firstname;
        const lastname = userDetails.lastname;
        const dateofbirth = userDetails.dateofbirth;
        const age = userDetails.age;
        const address = userDetails.address;
        const roomnumber = "N/A", disease = "N/A", wardname = "N/A", prescription= "N/A", prescriptiondate= "N/A", doctorname= "N/A", state= "N/A",  nextvisit= "N/A";
        const condition = "Admitted";
        //create a new patient
        const newpatient = new User({
            username, email, phno,name,
            password,
            role
        });    
        await newpatient.save();

        const newpatientdb = new patientdb({
            username, firstname, lastname, dateofbirth, age, address, condition
        });
        await newpatientdb.save();

        const newtreatmentdb = new treatmentdb({
            username, roomnumber, disease, wardname, prescription, prescriptiondate, doctorname, state, nextvisit
        })
        await newtreatmentdb.save();

        return res.status(201).json({
            message: "New patient Registered",
            success: true
        });
    }catch(err){
        return res.status(500).json({
            message: `Unable to register the Patient with error: ${err}`,
            success: false
        });
    }
};

//Middleware for passport

const userAuth = passport.authenticate('jwt', { session: false });

// Middleware to check the role

const checkRole = roles => (req, res, next) => {
    if(roles.includes(req.user.role)){
        return next()
    }
    return res.status(401).json({
        message: "You are not authorized to access this webpage",
        success: false
    });
};


// to check if the sma eusername is already there
const checkusername = async username => {
    let user = await User.findOne({username});
    if(user){
        return false;
    }else{
        return true;
    }
};

// to check email repeat 
const checkuseremail = async email => {
    let user = await User.findOne({email});
    if(user){
        return false;
    }else{
        return true;
    }
};

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
    patientregister,
    login,
    userAuth,
    checkRole,
    
}