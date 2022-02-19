/**
 *  * @name Splunk Dashboard
 *   *
 *    * @desc Logs into Github. Provide your username and password as environment variables when running the script, i.e:
 *     * `SPLUNK_USER=myuser SPLUNK_PWD=mypassword node github.js`
 *      *
 *       */
const puppeteer = require('puppeteer')
const screenshot = 'splunk.png';
(async () => {
	  const browser = await puppeteer.launch({ headless: true })
	  const page = await browser.newPage()
	  await page.setViewport({ width: 1280, height: 800 })
	  //await page.goto('http://192.168.5.2:8000')
	  await page.goto('http://192.168.5.2:8000/en-US/app/search/internal_metrics_2')
	  await page.type('#username', process.env.SPLUNK_USER)
	  await page.type('#password', process.env.SPLUNK_PWD)
	  //await page.click('[name="commit"]')
	  //await page.click('input[class="splButton-primary"]');
	/*   await Promise.all([
		page.waitForNavigation(),
		await page.click('input[type="submit"]')
	]);
	*/
	  await page.click('input[type="submit"]');
	  //await page.waitForNavigation()
	  //await page.goto('http://192.168.5.2:8000/en-US/app/search/internal_metrics_2')
	  //await page.waitForNavigation()
	  await page.waitForNavigation({waitUntil: 'networkidle2'});
	  //await page.screenshot({ path: screenshot })
	  await page.waitForSelector('body > div.main-section-body.dashboard-body');          // Method to ensure that the element is loaded
  	  const logo = await page.$('body > div.main-section-body.dashboard-body');        // logo is the element you want to capture
  	  await logo.screenshot({
    	path: 'dash.png'
      });

	  browser.close()
	  console.log('See screenshot: ' + screenshot)
})()
