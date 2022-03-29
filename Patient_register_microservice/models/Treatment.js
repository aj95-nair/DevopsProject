const { Schema, model } = require("mongoose");

// this is just a model to specify how a user will look like
// add access control based on roles later...

const UserSchema = new Schema(
  { //no extra fields are added
    prescription: { 
      type: String,
      required: true
    },
    doctorname: {
        type: String,
        required: true
    },
    username: {
      type: String,
      required: true
    },
    state: {
      type: String, 
      required: true
    },
    prescriptiondate: {
      type: String,
      required: true
    },
    nextvisit: {
      type: String,
      required: true
    },
    roomnumber: {
        type: String,
        required: true
      },
      disease: {
        type: String,
        required: true
      },
      wardname: {
        type: String,
        required: true
      },   
  });

module.exports = model("treatment", UserSchema);