const router = require('../routers') //路由
const static = require('koa-static') // 静态资源处理 更多参照express_demo
const session = require('koa-session') // session  
const staticCache = require('koa-static-cache') // 静态缓存
const auth = require('koa-basic-auth') // 身份验证中间件
const mount = require('koa-mount') // 指定路由添加权限
const log4js = require('./logger/index') // logs4js
const views = require('koa-views') //模板引擎 中间件  要安装ejs
const path = require('path')
const bodyParser = require('koa-bodyparser')// 获取post 参数
const ip = require('ip') // 

//#region 
const GetPostData = (app) => { app.use(bodyParser()) }
const Identity_verification = (app) => {
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            if (401 == err.status) {
                ctx.status = 401;
                ctx.set('WWW-Authenticate', 'Basic');
                ctx.body = '401';
            } else {
                throw err;
            }
        }
    })
    // app.use(auth({ name: 'admin', pass: 'admin' })) //访问全局
    app.use(mount('/images', auth({ name: 'root', pass: 'root' }))) // 访问特定路由
}

const sessions = (app) => {
    app.keys = ['some secret hurr']
    const config = {
        key: 'koa:sess',   //cookie key (default is koa:sess)
        maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
        overwrite: true,  //是否可以overwrite    (默认default true)
        httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
        signed: true,   //签名默认true
        rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
        renew: false,  //(boolean) renew session when session is nearly expired,
    }
    app.use(session(config, app))
}

const Render_pages = (app) => {
    app.use(views(path.join(__dirname, '../view/'), {
        extension: 'ejs'
    }))  //模板渲染要在 router 之前 
}

const Static_resource = (app) => {
    app.use(staticCache(path.join(__dirname, '../public/'), {// 静态资源缓存
        maxAge: 365 * 24 * 60 * 60
    }))
    app.use(static(path.join(__dirname, '../public/'))) // __dirname 当前路径 相当于 linux pwd 命令
    // http://localhost:3000/images/bg.jpg
}

const logger = (app) => {
    app.use(log4js({
        env: app.env,
        projectName: 'demo_koa2',
        appLogLevel: 'all',
        dir: 'logs',
        serverIp: ip.address()
    }))
}

const routers = (app) => {
    router(app)
}
//#endregion

module.exports = {
    logger,
    Static_resource,
    Render_pages,
    sessions,
    Identity_verification,
    GetPostData,
    routers
}