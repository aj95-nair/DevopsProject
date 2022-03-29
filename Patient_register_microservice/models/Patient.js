const { Schema, model } = require("mongoose");

// this is just a model to specify how a user will look like
// add access control based on roles later...

const UserSchema = new Schema(
  { //no extra fields are added
    firstname: { //Full name
      type: String,
      required: true
    },
    lastname: { //Full name
        type: String,
        required: true
      },

    username: {
      type: String,
      required: true
    },

    dateofbirth: {
      type: String,
      required: true
    },

    age: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    }    
  }, { timestamps: true });

module.exports = model("Patient", UserSchema);