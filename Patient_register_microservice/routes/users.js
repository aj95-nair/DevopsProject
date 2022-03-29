const router = require("express").Router();
const Patient = require("../models/Patient");
const treatment = require("../models/Treatment");
const { patientregister, userAuth, checkRole } = require('../utils/Authorization');

/**********Auth routers************/


//only authorized clerk can access it
router.post("/register-patient", userAuth, checkRole(['clerk']), async(req, res)=> {
  await patientregister(req.body,"patient", res);
})

//only authorized clerk can access it
router.patch("/clerk-update-patient", userAuth, checkRole(['clerk']), async(req, res)=> {
  const username = req.body.username;
  console.log(username);
  const update= {};
  if(req.body.lastname) update.lastname = req.body.lastname;
  if(req.body.firstname) update.firstname = req.body.firstname;
  if(req.body.age) update.age = req.body.age;
  if(req.body.address) update.address = req.body.address;
  if(req.body.dateofbirth) update.dateofbirth = req.body.dateofbirth;
  if(req.body.condition) update.condition = req.body.condition;
  await Patient.updateMany({username: username}, {
    $set: update
  })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(`Details of Patient with username ${username} have been saved`);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: `error is: ${err}`
            });
        });
})

//only authorized clerk can access it
router.get("/all-patients-clerk", userAuth, checkRole(['clerk']), async(req, res)=> {
  Patient.find({}, function(err,result)
    {
        if (err){
            console.log(err);        
        }
        else {
            res.status(200).json(result)
        }
    });
})

//only authorized clerk can access it
router.get("/:username", userAuth, checkRole(['clerk']), async(req, res)=> {
  const username = req.params.username;
  Patient.findOne({"username": username}).exec().then(doc => {
    PatientDetails = doc;
  }).catch(err => {
    res.status(403).json({
      message: `Not Authorized with error ${err}`,
      success: false
    })
  });
  treatment.findOne({"username": username}).exec().then(PatientTreatment => {
    res.status(200).json({PatientDetails, PatientTreatment});
  }).catch(err => {
    res.status(403).json({
      message: `Not Authorized with error ${err}`,
      success: false
    })
  });
})

/**********Auth routers************/


module.exports = router;
