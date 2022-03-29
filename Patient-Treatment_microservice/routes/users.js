const router = require("express").Router();
const Patient = require("../models/Patient");
const treatment = require("../models/Treatment");
const { userAuth, checkRole } = require('../utils/Authorization');


/**********Auth routers************/

//only authorized patient can access it
router.get("/patient-details", userAuth, checkRole(['patient']), async(req, res, next)=> {
  const username = req.user.username;

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
});

//only authorized doctor can access it
router.patch("/doctor-update-patient", userAuth, checkRole(['doctor']), async(req, res)=> {
  const username = req.body.username;
  console.log(username);
  const update= {};
  if(req.body.prescription) update.prescription = req.body.prescription;
  if(req.body.prescriptiondate) update.prescriptiondate = req.body.prescriptiondate;
  if(req.body.state) update.state = req.body.state;
  if(req.body.doctorname) update.doctorname = req.body.doctorname;
  if(req.body.nextvisit) update.nextvisit = req.body.nextvisit;
  if(req.body.disease) update.disease = req.body.disease;
  if(req.body.wardname) update.wardname = req.body.wardname;
  if(req.body.roomnumber) update.roomnumber = req.body.roomnumber;
  await treatment.updateMany({username: username}, {
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


//Both authorized doctor can access it
router.get("/all-patients-doctor", userAuth, checkRole(['doctor']), async(req, res)=> {
  treatment.find({}, function(err,result)
    {
        if (err){
            console.log(err);        
        }
        else {
            res.status(200).json(result)
        }
    });
})

// authorized Doctor can access it
router.get("/:username", userAuth, checkRole(['doctor']), async(req, res)=> {
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
