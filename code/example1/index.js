const express = require("express");
const router = express.Router();
const generatePdf = require("./generatePdf2");
const renderDashboard = require("./render-dashboard");

// Home Page
router.get("/", (req, res) => {
  //res.sendFile("index.html");
  res.setHeader('Content-Type', 'text/html');
  res.write('Hello World!<br />')
  res.write('id: ' + req.query.id);
  res.end();
});

// Download PDF Route
router.get("/generate-pdf", async (req, res) => {
  let result = await generatePdf(req.query.url);
  //res.attachment(`node-express-puppeteer-pdf-example.pdf`);
  //res.contentType("application/pdf");
  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(result);
});

// Download Image Route
router.get("/render-dashboard", async (req, res) => {
  try{
    let result = await renderDashboard(req.query.name,req.query.width,req.query.height);
    //res.attachment(`node-express-puppeteer-pdf-example.pdf`);
    //res.contentType("application/pdf");
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(result);
  }
catch (error) {
  console.error(error);
  res.sendStatus(500);
}
});


// Catch All
router.get("*", (req, res) => {
  res.redirect("/");
});

module.exports = router;
