const {SECRET} = require('../config');
const passport = require('passport');

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


module.exports = {
    userAuth,
    checkRole,
    
}