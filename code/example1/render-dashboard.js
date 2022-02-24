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
  return dashDetails;
}


const renderDashboard = async (name,width = 1280,height = 800) => {

  console.log(name);
  const dashboardDetails = await readUrlMap(name);
  const splunkPassword = await getCredentials(dashboardDetails.username);

  console.log('The splunkPassword: '+splunkPassword);

  

  //console.log(dashboardDetails.username);

  

  const browser = await puppeteer.launch({ 
    headless: true
    //slowMo: 1500
    //userDataDir: './cache',
    //args: minimal_args
    //args: ["--no-sandbox", "--disable-setuid-sandbox"], // SEE BELOW WARNING!!!
  });
  const url2 = "http://192.168.5.2:8000/en-US/app/search/internal_metrics_2"
  
        //await page.goto('http://192.168.5.2:8000')
        //await page.goto('http://192.168.5.2:8000/en-US/app/search/internal_metrics_2')
        //await page.type('#username', process.env.SPLUNK_USER)
        //await page.type('#password', process.env.SPLUNK_PWD)



  const page = await browser.newPage();
  //console.log(parseInt(height))
  //console.log("Here2");
  await page.setViewport({ width: parseInt(width), height: parseInt(height) })
  await page.goto(dashboardDetails.url);
  //console.log("Here3");
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  await page.type('#username', dashboardDetails.username);
  //console.log("Here4");
  await page.type('#password', splunkPassword);
 
  await page.click('input[type="submit"]');

  //await page.waitForSelector('body > div.main-section-body.dashboard-body');          // Method to ensure that the element is loaded
  //const dashboardBody = await page.$('body > div.main-section-body.dashboard-body'); 
   
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  
  //console.log("Here5");
  await page.waitForSelector('rect.highcharts-plot-background',{visible: true});   
  //page.$$('#zero_click_wrapper img[src^="//external-content"]')
  //await new Promise(r => setTimeout(() => r(), 8000));
  const dashboard = await page.$('body > div.main-section-body.dashboard-body'); 
  //const dashboard = await page.$('div[data-test="fullscreen-layout"]'); 

  //const pdf = await page.pdf();
  const img = await dashboard.screenshot({type: 'jpeg'});
  await browser.close();
  // Return Buffer
  //return pdf;
  console.log("Render done");
  return img;
};

module.exports = renderDashboard;
