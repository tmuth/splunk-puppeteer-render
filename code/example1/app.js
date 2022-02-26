const express = require("express");
const path = require("path");
const logLevel = 'info'; // error | warn | info | debug https://github.com/winstonjs/winston#using-logging-levels
const logger = require('./utils/logger');


const port = 8888
const indexRouter = require("./index.js");

const app = express();

//app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;

app.listen(port, () => {
    //console.log(`Express app listening on port ${port}`)
    logger.info(`Express app listening on port ${port}`);
  })
