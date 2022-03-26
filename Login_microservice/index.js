const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const {connect} = require("mongoose"); // if problem occurs use mongoose.connect
const { success, error } = require("consola");
const morgan = require("morgan");

const { DB, PORT } = require("./config");

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use("/api/users", require("./routes/users"));

const runApp = async () => { //make async to connect to db first 
  try {
    // Connection With DB
    await connect(DB, { // nodejs version issue causing deadlock
      useUnifiedTopology: true,
      useFindAndModify: true,
      useNewUrlParser: true
    });
    success({
      message: `Connected to Database: ${DB} Successful`,
      badge: true
    });
    app.listen(PORT, () =>
      success({ message: `Starting server on port ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `Cannot connect to Database ${DB} \nError Found: ${err}`,
      badge: true
    });
    runApp(); // keep on trying again until connected to the db
  }
};

runApp();
