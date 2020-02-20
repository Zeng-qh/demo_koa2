const all_middleware = require('./all_middleware')// 所有中间件
module.exports = (app) => {
    all_middleware.logger(app)
    all_middleware.Static_resource(app)
    all_middleware.GetPostData(app)
    all_middleware.Identity_verification(app)
    all_middleware.Render_pages(app)
    all_middleware.sessions(app)
    all_middleware.routers(app)
}