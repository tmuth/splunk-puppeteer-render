const puppeteer = require("puppeteer");
const fs = require('fs');
const getCredentials = require("./getCredentials");
const util = require('util');


const findDashboardByName = async (dashboardsIn, nameIn) => {
  const key = Object.keys(dashboardsIn).find(dashboard => dashboardsIn[dashboard].name === nameIn)
  return dashboardsIn[key]
}


const readUrlMap = async (dashNameIn) => {
  //console.log("Top of readUrlMap2");
  var dashboards = {};
  const readFile = util.promisify(fs.readFile);
  const buf = await readFile('url-map.json');
  dashboards = JSON.parse(buf);

  var dashDetails = await findDashboardByName(dashboards, dashNameIn);
  if(dashDetails === undefined){
    throw (`Unable to find entry in url-map.json for ${dashNameIn}`);
  }
  //console.log('dashDetails: '+dashDetails);
  return dashDetails;
}


const renderDashboard = async (name,width = 1280,height = 800) => {

  //console.log(name);
  const dashboardDetails = await readUrlMap(name);
  const splunkPassword = await getCredentials(dashboardDetails.username);

  //console.log('The splunkPassword: '+splunkPassword);

  const browser = await puppeteer.launch({ 
    headless: true
    //slowMo: 1500
    //userDataDir: './cache',
    //args: minimal_args
    //args: ["--no-sandbox", "--disable-setuid-sandbox"], // SEE BELOW WARNING!!!
  });



  const page = await browser.newPage();
  await page.setViewport({ width: parseInt(width), height: parseInt(height) })
  await page.goto(dashboardDetails.url);
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  await page.type('#username', dashboardDetails.username);
  await page.type('#password', splunkPassword);
  await page.click('input[type="submit"]');

  //await page.waitForSelector('body > div.main-section-body.dashboard-body');          // Method to ensure that the element is loaded
  //const dashboardBody = await page.$('body > div.main-section-body.dashboard-body'); 
   
  await page.waitForSelector('rect.highcharts-plot-background',{visible: true});   
  //await new Promise(r => setTimeout(() => r(), 8000));
  const dashboard = await page.$('body > div.main-section-body.dashboard-body'); 
  //const dashboard = await page.$('div[data-test="fullscreen-layout"]'); 

  const img = await dashboard.screenshot({type: 'jpeg'});
  await browser.close();
  // Return Buffer
  //return pdf;
  console.log("Render done");
  return img;
};

module.exports = renderDashboard;
