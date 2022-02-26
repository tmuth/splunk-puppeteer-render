const express = require("express");
const path = require("path");
const logger = require('./utils/logger');
//const cookieParser = require("cookie-parser");
//const logger = require("morgan");
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
