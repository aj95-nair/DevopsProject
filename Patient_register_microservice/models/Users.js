const { Schema, model } = require("mongoose");

// this is just a model to specify how a user will look like
// add access control based on roles later...

const UserSchema = new Schema(
  { //no extra fields are added
    name: { //Full name
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true
    },

    phno: {
        type: String,
        required: true
    },

    role: {
      type: String,
      default: "patient", // will be a patient until specified
      enum: ["clerk", "doctor", "patient"], // admin to be added later...
      required: true
    },

    username: {
      type: String,
      required: true
    },

    password: {
      type: String, 
      required: true
    }    
  }, { timestamps: true });

module.exports = model("users", UserSchema);