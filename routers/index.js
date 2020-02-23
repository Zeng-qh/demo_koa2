const router = require('koa-router')
const Controller = require('../Controller/Controller_demo')
module.exports = (app) => {
    // const router_ = new Router()   在引入的时候初始初始化了  所以就不用new 了
    //const router2 = new Router().prefix('/api')// 加上前缀 也可以在router.use('/api')
    router_demo = new router()
    router_main = new router()

    router_demo.prefix('/demo')
        .get('/', Controller.index)
        .get('/getdata', Controller.getdata)
        .get('/get', Controller.Get)
        .get('/:aid/:bid', Controller.get_aid)
        .post('/post', Controller.post)
        .get('/cookies', Controller.cookies)
        .get('/getsession', Controller.getsession) // http://localhost:3000/demo/getsession
        .get('/setsession', Controller.setsession) // http://localhost:3000/demo/setsession?name=admin&age=20
        .get('/home', Controller.home)
        

    router_main
        .get('/', async (ctx, next) => {
            ctx.redirect('/demo/') // 重定向
        })
        .get('/redirect', async (ctx, next) => {
            ctx.response.redirect('http://baidu.com') //测试重定向
        })
        .post('/registered', Controller.registered)
        .post('/login', Controller.login)
        .get('/gtemanagement',Controller.gtemanagement)


    // router.use(router.routes(), router.allowedMethods())
    // router.use('/api', router.routes(), router.allowedMethods())

    app //挂载路由
        .use(router_main.routes())
        .use(router_main.allowedMethods())
        .use(router_demo.routes())
        .use(router_demo.allowedMethods())

}
