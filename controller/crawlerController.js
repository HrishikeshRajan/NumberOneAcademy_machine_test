
const puppeteer = require('puppeteer');
const path = require('path')
const seed = require('../seed/seed.json')
const downloadPDF = require('../utils/downloadPdf')
const { readConfig } = require('../config/readConfig')
const config = require('config')

const DOWNLOAD_DIR = './downloads';

exports.getHome = (seed) => {
    return (req, res, next) => {
        return res.render('home.ejs', { heading: 'PDF Crawler', pdfs: [] });
      };
 
}
const uniqUrls = new Set()
let elements = []

exports.getPDFs =  () => {
  return async (req, res, next) => {

      console.log('Crawling started...')

    
      const browser = await puppeteer.launch({headless:true, timeout:0, pipe:true });

      const page = await browser.newPage();


      await page.goto(readConfig(config, 'targetUrl'),
         {  waitUntil: 'networkidle2', timeout:60000});

         console.log('collect elemnst')
        elements = await page.$$('.styles__Results-sc-h5vg7w-2'); 
    

   

    async function getAllLinks(count = 0){
      try {     
        
          console.info('fetching')
          elements = await page.$$('.styles__Results-sc-h5vg7w-2');

          if(count >= elements.length){
            console.log('fetching completed')
            return null
          }

          if (!elements[count]) {
            return;
        }
          const el = elements[count];
    
          const headerElement = await el.$('.header');
          const dateElement = await el.$('.date');
       
          const headerText = await page.evaluate(el => el.textContent, headerElement);
          const dateText = await page.evaluate(el => el.textContent, dateElement);
    
          await el.click()
 
          await page.waitForSelector('a[href$=".pdf"]')
    
          const pdfUrl = await page.evaluate(() => {
            const link = document.querySelector('a[href$=".pdf"]');
            return link ? link.href : null;
        });
    
         const doc = {
          date: dateText,
          header: headerText,
          url: pdfUrl
         }
         uniqUrls.add(JSON.stringify(doc))
     
    
        await page.goBack({ waitUntil: 'domcontentloaded' });
    
        await getAllLinks(count += 1)
      
       } catch (error) {
        await page.goBack({ waitUntil: 'domcontentloaded' });
        await getAllLinks(count + 1); 
       }
    }

     await getAllLinks(0)

      await browser.close();

      for(let item of uniqUrls){
        const {url} = JSON.parse(item)
        const filename = path.basename(url);
        await downloadPDF(url,filename, DOWNLOAD_DIR)
      }
        res.json({urls:[...uniqUrls].map((doc) => JSON.parse(doc))})
    };

}