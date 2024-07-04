
const fs= require('fs')
const pdf = require('pdf-parse');
const path = require('path')

/**
 * 
 * Saves pdf meta data and content into database
 */
module.exports = function saveToDatabase (dir,nodeDB,uniqUrls) {
    for(let item of uniqUrls){
        const {url} = JSON.parse(item)
        const filename = path.basename(url);
        let dataBuffer = fs.readFileSync(path.join(dir, filename));
        pdf(dataBuffer).then(function(data) {

            const details = {
              metaData: data.metadata,
              content: data.text

            }
          nodeDB.set(filename, details)
        }).catch((e) =>{console.log(e)})
      }
}