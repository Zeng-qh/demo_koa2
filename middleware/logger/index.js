const log4js = require('log4js') // 引入 log4js
const access = (ctx, message, commonInfo) => {
    const {
        method,  // 请求方法 get post或其他
        url,		  // 请求链接
        host,	  // 发送请求的客户端的host
        headers	  // 请求中的headers
    } = ctx.request;
    const client = {
        method,
        url,
        host,
        message,
        referer: headers['referer'],  // 请求的源地址
        userAgent: headers['user-agent']  // 客户端信息 设备及浏览器信息
    }
    return JSON.stringify(Object.assign(commonInfo, client));
}
const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"]


const logger = (options) => {
    const contextLogger = {}
    const appenders = {}
    // const opts = Object.assign({}, baseInfo, options || {})
    const { env, appLogLevel, dir, serverIp, projectName } = options
    const commonInfo = { projectName, serverIp }

    appenders.cheese = {
        type: 'dateFile',
        filename: `${dir}/log`,
        pattern: 'yyyy-MM-dd.log', // 文件名增加后缀
        alwaysIncludePattern: true  // 是否总是有后缀名
    }

    if (env === "dev" || env === "local" || env === "development") {
        appenders.out = {
            type: "console"
        }
    }
    let config = {
        appenders,
        categories: {
            default: {
                appenders: Object.keys(appenders),
                level: appLogLevel
            }
        }
    }

    const logger = log4js.getLogger('cheese');

    return async (ctx, next) => {
        const start = Date.now()

        log4js.configure(config)
        methods.forEach((method, i) => {
            contextLogger[method] = (message) => {
                logger[method](access(ctx, message, commonInfo))
            }
        })
        ctx.log = contextLogger;

        await next()
        const responseTime = Date.now() - start;
        logger.info(access(ctx, {
            responseTime: `响应时间为${responseTime / 1000}s`
        }, commonInfo))
    }

}

module.exports = (options) => {
    const loggerMiddleware = logger(options)
    return (ctx, next) => {
        return loggerMiddleware(ctx, next)
            .catch((e) => {
                if (ctx.status < 500) {
                    ctx.status = 500;
                }
                ctx.log.error(e.stack);
                ctx.state.logged = true;
                ctx.throw(e);
            })
    }
}
