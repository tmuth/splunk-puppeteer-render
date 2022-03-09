const puppeteer = require("puppeteer");
const fs = require('fs');
const getCredentials = require("./getCredentials");
const util = require('util');
const logger = require('./utils/logger');

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}


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

const getTraditionalDashboard = async (page) => {
  logger.info("getTraditionalDashboard...");
  await page.waitForSelector('div.highcharts-container');
  //await page.waitForSelector('#dashboard1'); 
  await page.waitForFunction('document.querySelector("div.alert-info") === null');
  
  //await page.waitForNavigation({waitUntil: 'networkidle0'});
  //await new Promise(r => setTimeout(() => r(), 4000));
 
  // This section waits for each dashpanel to finish loading
  let visiblePanels = await page.$$('div.progress-animation:not([style*="display: none;"])');
  //logger.info(visiblePanels.length);
  while(visiblePanels.length > 0  )
  {
    logger.info("Waiting in loop...");
    logger.info(visiblePanels.length);
    //logger.info(util.inspect(visiblePanels, false, null, true /* enable colors */));
    await delay(500);
    visiblePanels = await page.$$("div.progress-animation:not([style*='display: none;'])");
  }

  const dashboard = await page.$('body > div.main-section-body.dashboard-body'); 
  return dashboard;
}

const getStudioDashboard = async (page) => {

}

const renderDashboard = async (name,width = 1280,height = 800) => {

  //console.log(name);
  const renderProfiler = logger.startTimer();
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
  await page.goto(dashboardDetails.url,{waitUntil: 'load', timeout: 15000});
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  await page.type('#username', dashboardDetails.username);
  await page.type('#password', splunkPassword);
  await page.click('input[type="submit"]');
  
  var dashboard = {};
  if((dashboardDetails.style === undefined) || (dashboardDetails.style === 'traditional')){
    await logger.info("Traditional Style Dashboard");
    dashboard = await getTraditionalDashboard(page);
  } 
  /*
  else{
    logger.info("Dashboard Studio Style Dashboard");
    const dashboard = await getTraditionalDashboard(page);
  }
  */
  
  const img = await dashboard.screenshot({type: 'jpeg'});
  await browser.close();
  //logger.info("Render done");
  renderProfiler.done({message: 'Render timer done'})
  return img;
};

module.exports = renderDashboard;
