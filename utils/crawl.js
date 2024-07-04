const cheerio = require('cheerio');
const {useFetch}  = require('./useFetch')
const axios = require('axios')

const getUrl = (url) => {
    console.log('receved', url)
    if(url.indexOf('https') < 0){
    return `https://cleartax.in/${url}`
    }
    return url
}

const set = new Set()
const crawler = async (url, host) => {
    console.log(url,host)
     if(set.has(url)) return null
     if(!url) {
        return null
     }

     set.add(url)
    const [data,err] = await useFetch(axios, 'GET', url)
  
    const $ = cheerio.load(data);

    let links =  $('a').map((i, link) => link.attribs.href).get()
    console.log('k', links)
    links = links.filter((link) => new URL(link).hostname === host)
    links = links.map((link) => getUrl(link))
    console.log(links)
    console.log(getUrl(links))
    links.forEach((link) => crawler(getUrl(link), host))

}


module.exports = crawler