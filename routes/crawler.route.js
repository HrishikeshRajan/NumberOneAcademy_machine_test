const controller = require('../controller/crawlerController')
const seed  = require('../seed/seed.json')


function routes(router){

    router.route('/').get(controller.getHome(seed))
    router.route('/list').get(controller.getPDFs())

    router.route('start')
    router.route('stop')

    return router 
}







module.exports = routes