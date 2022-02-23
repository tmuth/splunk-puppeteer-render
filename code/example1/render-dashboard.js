const puppeteer = require("puppeteer");
const minimal_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
  ];

const renderDashboard = async (url,width = 1280,height = 800) => {
  // Browser actions & buffer creator
  
  const browser = await puppeteer.launch({ 
    headless: true
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
  console.log(parseInt(height))
  await page.setViewport({ width: parseInt(width), height: parseInt(height) })
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
  const img = await dashboard.screenshot({type: 'jpeg'});
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

module.exports = renderDashboard;
