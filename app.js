const express = require('express')
const routes = require('./routes/crawler.route')
const controller = require('./controller/crawlerController')
const seed = require('./seed/seed.json')

const app = express()
const route = express.Router()


app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));


app.use('/', routes(route, controller.getHome(seed)))



module.exports = app;