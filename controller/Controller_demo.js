const db = require('../Data/mysql_help')

let index = async (ctx, next) => {
    let h1_txt = 'hello koa2'
    let span_txt = 'ejs 渲染'
    await ctx.render('index', { h1_txt, span_txt })
}

let Get = async (ctx, next) => {
    let url = ctx.url
    // 从上下文的request对象中获取
    let request = ctx.request
    let req_query = request.query
    let req_querystring = request.querystring

    // 从上下文中直接获取
    let ctx_query = ctx.query
    let ctx_querystring = ctx.querystring

    ctx.body = {
        url,
        req_query,
        req_querystring,
        ctx_query,
        ctx_querystring
    }
}

let post = async (ctx, next) => {
    ctx.body = ctx.request.body //  获取post 参数
}

let cookies = async (ctx, next) => {
    ctx.cookies.set(
        'cid',
        'hello world',
        {
            domain: 'localhost',  // 写cookie所在的域名
            // path: '/index',       // 写cookie所在的路径
            maxAge: 1000 * 5, // cookie有效时长
            // expires: new Date('2021-02-15'),  // cookie失效时间
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: false  // 是否允许重写
        }
    )
    ctx.body = 'cookie is ok'
}

let setsession = async (ctx, next) => {
    try {
        ctx.session.username = ctx.query.name
        ctx.session.age = ctx.query.age
        ctx.body = { status: 200, msg: 'session设置成功' };
    } catch (e) {
        ctx.body = { status: 200, msg: 'session设置失败', err: e };
    }
}

const Getsession = async (ctx, next) => {
    try {
        let name = ctx.session.username,
            age = ctx.session.age;
        ctx.body = {
            status: 200,
            msg: 'session获取成功',
            name: name,
            age: age
        };
    } catch (e) {
        ctx.body = {
            status: 200,
            msg: 'session获取失败',
            err: e
        };
    }
}

module.exports = {
    index, Get, post, cookies, setsession, Getsession,
    home: async (ctx, next) => {
        let h1_txt = 'hello koa2'
        let span_txt = 'ejs 渲染'
        await ctx.render('index', { h1_txt, span_txt })
    },
    GetData: async (ctx, next) => {
        let request = ctx.request
        let page = request.query.page == 0 ? 1 : request.query.page
        let size = request.query.size
        ctx.body = await db.query('select * from city limit ' + (page - 1) * size + ',' + size, '')
        // http://localhost:3000/demo/getdata?page=6&size=20
    },
    Get_aid: async (ctx, next) => {// 动态路由传入多个参数
        // console.dir(ctx);            http://localhost:3000/demo/aid=12/bid=20
        ctx.body = ctx.params  // 获取动态路由传值  {"aid": "aid=12","bid": "bid=20"}
    }
}