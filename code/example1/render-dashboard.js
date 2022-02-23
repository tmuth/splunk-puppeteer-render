const puppeteer = require("puppeteer");
const fs = require('fs');


const findDashboardByName = (dashboardsIn, nameIn) => {
  const key = Object.keys(dashboardsIn).find(dashboard => dashboardsIn[dashboard].name === nameIn)
  return dashboardsIn[key]
}
/*
const findStudentByName = (studentsIn, nameIn) => {
    const key = Object.keys(studentsIn).find(student => studentsIn[student].name === nameIn)
    return studentsIn[key]
  }
*/



/*
fs.readFile('student2.json', (err, data) => {
  if (err) throw err;
  let students = JSON.parse(data);
  console.log(students);
  console.log(findStudentByName(students,'Dave'));

  let theStudent = findStudentByName(students,'Dave');
  console.log('Car: '+theStudent.car)
});
*/

const renderDashboard = async (name,width = 1280,height = 800) => {
  // Browser actions & buffer creator

  var dashboardDetails = {}

  fs.readFile('url-map.json', (err, data) => {
      if (err) throw err;
      let dashboards = JSON.parse(data);
      //console.log(dashboards);
      //console.log(findDashboardByName(dashboards,name));

      //let theDashboard = findDashboardByName(dashboards,name);
      dashboardDetails = findDashboardByName(dashboards,name)
      //console.log('URL: '+dashboardDetails.url)
  });
  
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
  await page.setViewport({ width: parseInt(width), height: parseInt(height) })
  await page.goto(dashboardDetails.url,{waitUntil: "networkidle2"});
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  await page.type('#username', dashboardDetails.username);
  await page.type('#password', dashboardDetails.password);
  await page.click('input[type="submit"]');

  //await page.waitForSelector('body > div.main-section-body.dashboard-body');          // Method to ensure that the element is loaded
  //const dashboardBody = await page.$('body > div.main-section-body.dashboard-body'); 
   
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  
  
  await page.waitForSelector('rect.highcharts-plot-background',{visible: true});   
  //page.$$('#zero_click_wrapper img[src^="//external-content"]')
  //await new Promise(r => setTimeout(() => r(), 8000));
  const dashboard = await page.$('body > div.main-section-body.dashboard-body'); 
  //const dashboard = await page.$('div[data-test="fullscreen-layout"]'); 
  //const dashboard = page;
  //await logo.screenshot({});
  //const pdf = await logo.pdf();

  //const pdf = await page.pdf();
  const img = await dashboard.screenshot({type: 'jpeg'});
  await browser.close();
  // Return Buffer
  //return pdf;
  console.log("Render done");
  return img;
};

/******************** WARNING ********************* WARNING ********************* WARNING *********************
 
 If you absolutely trust the content you open in Chrome, you can launch Chrome with the --no-sandbox argument...
 Running without a sandbox is strongly discouraged. Consider configuring a sandbox instead!!!

 More Info Here: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md

******************** WARNING ********************* WARNING ********************* WARNING *********************/

module.exports = renderDashboard;
