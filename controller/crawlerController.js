
const puppeteer = require('puppeteer');
const path = require('path')
const downloadPDF = require('../utils/downloadPdf')
const { readConfig } = require('../config/readConfig')
const config = require('config')
const nodeDB = require('node-cache')
const saveToDatabase = require('../utils/saveToDatabase')
const fs = require('fs')
const cache= new nodeDB()

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
      
       //To avoid memery flooding
       cache.flushAll()
    

      // Clears the directory and subfiles
      fs.rmSync(DOWNLOAD_DIR, { recursive: true, force: true });

       // creates new directory to avoid error
      if (!fs.existsSync(DOWNLOAD_DIR)) {
        fs.mkdirSync(DOWNLOAD_DIR);
      }
    
      //library used to mimic browser and user interactions
      const browser = await puppeteer.launch({headless:true});

      const page = await browser.newPage();


      await page.goto(readConfig(config, 'targetUrl'),
         {  waitUntil: 'domcontentloaded' });

         // selects all the clickable div's
        elements = await page.$$('.styles__Results-sc-h5vg7w-2'); 
    

   

    async function getAllLinks(count = 0){
      try {     
        
          console.info('fetching')

          /**
           * When page naviagtion occurs, we need to persist the elements
           * referrence 
           */
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
 
          /**
           * This will throw error if not found.
           * We will skip the corresponding element
          */
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

        /**
         * 
         * Some div's dosent contain pdf links, hence pupeteer 
         * will throw error. Here we skip corresponding link index
         * and call the next item from the array
         * 
         */
        await page.goBack({ waitUntil: 'domcontentloaded' });
        await getAllLinks(count + 1); 
       }
    }

     await getAllLinks(0)

      await browser.close();

      /**
       * This will download all the pdf files using
       * likes stored in set.
       * 
       * To avoid any chance of duplication, set is preferred
       */
      for(let item of uniqUrls){
        const {url} = JSON.parse(item)
        const filename = path.basename(url);
        await downloadPDF(url,filename, DOWNLOAD_DIR)
      }


      saveToDatabase(DOWNLOAD_DIR, cache, uniqUrls)


      res.json({urls:[...uniqUrls].map((doc) => JSON.parse(doc))})
    };


}