const axios = require('axios')
const path = require('path')
const fs = require('fs')

module.exports = async function downloadPDF(url, filename, dir) {
    const response = await axios.get(url, { responseType: 'stream' });
    const filePath = path.join(dir, filename);
    response.data.pipe(fs.createWriteStream(filePath));
    return new Promise((resolve, reject) => {
        response.data.on('end', () => resolve(filePath));
        response.data.on('error', reject);
    });
  }