const router = require("express").Router();
const { login }= require('../utils/Authorization');

/********Login route********/
router.post("/login", async (req, res) => {
  await login(req.body, res);
});
/********Login route********/

module.exports = router;
