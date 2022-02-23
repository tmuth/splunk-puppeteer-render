const puppeteer = require("puppeteer");

const generatePdf = async (url) => {
  // Browser actions & buffer creator
  const browser = await puppeteer.launch({ headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // SEE BELOW WARNING!!!
  });
  const url2 = "http://192.168.5.2:8000/en-US/app/search/internal_metrics_2"
  
        //await page.goto('http://192.168.5.2:8000')
        //await page.goto('http://192.168.5.2:8000/en-US/app/search/internal_metrics_2')
        //await page.type('#username', process.env.SPLUNK_USER)
        //await page.type('#password', process.env.SPLUNK_PWD)



  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(url2);
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  await page.type('#username', 'admin');
  await page.type('#password', 'welcome1');
  await page.click('input[type="submit"]');

  //await page.waitForSelector('body > div.main-section-body.dashboard-body');          // Method to ensure that the element is loaded
  //const dashboardBody = await page.$('body > div.main-section-body.dashboard-body'); 
   
  //await page.waitForNavigation({waitUntil: 'networkidle2'});
  await page.waitForSelector('rect.highcharts-plot-background',{visible: true});   
  //await new Promise(r => setTimeout(() => r(), 2000));
  const dashboard = await page.$('body > div.main-section-body.dashboard-body'); 
  //await logo.screenshot({});
  //const pdf = await logo.pdf();

  //const pdf = await page.pdf();
  const img = await dashboard.screenshot();
  await browser.close();
  // Return Buffer
  //return pdf;
  return img;
};

/******************** WARNING ********************* WARNING ********************* WARNING *********************
 
 If you absolutely trust the content you open in Chrome, you can launch Chrome with the --no-sandbox argument...
 Running without a sandbox is strongly discouraged. Consider configuring a sandbox instead!!!

 More Info Here: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md

******************** WARNING ********************* WARNING ********************* WARNING *********************/

module.exports = generatePdf;
