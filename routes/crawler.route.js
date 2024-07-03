

function routes(router, controller){

    router.route('/').get(controller)

    router.route('start')
    router.route('stop')

    return router 
}







module.exports = routes