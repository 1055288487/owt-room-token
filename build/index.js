"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const http = require("http");
const KoaRouter = require("koa-router");
const logger = require("koa-logger");
const json = require("koa-json");
const Bodyparser = require("koa-bodyparser");
const controllers = require("./controllers/index");
const config_1 = require("./config");
const app = new Koa(), staticServe = require('koa-static'), convert = require('koa-convert'), bodyparser = Bodyparser(), router = new KoaRouter({ prefix: '/api/v1' }), 
// config = require('./config'),
path = require('path'), DEBUG = require('debug'), debug = DEBUG('index:debug'), logError = DEBUG('index:error');
const staticPath = '../../storage';
let allowedMethodsWithoutAuth = ['/api/v1/owt/createToken', '/api/v1/owt/createRoom', '/api/v1/owt/detail'];
app.use(function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ctx.set('server', 'WSS/V8');
            ctx.set('Access-Control-Allow-Origin', '*');
            ctx.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
            ctx.set('Access-Control-Allow-Headers', 'x-requested-with,content-type,authorization');
            if (ctx.method === 'OPTIONS') {
                ctx.status = 200;
                return;
            }
            yield next();
        }
        catch (err) {
            if (err.status === 401) {
                ctx.status = 401;
                ctx.set('WWW-Authenticate', 'Basic');
                ctx.body = '未授权的访问';
            }
            else {
                ctx.status = 200;
                ctx.body = {
                    ret: 0,
                    msg: err.message
                };
            }
        }
    });
});
app.use(router.allowedMethods())
    .use(convert(bodyparser))
    .use(Bodyparser({
    'jsonLimit': '10mb',
}))
    .use(convert(json()))
    .use(convert(logger()))
    .use(staticServe(path.join(__dirname, '../static')))
    .use(staticServe(path.join(__dirname, staticPath)))
    .use(router.routes());
router.all('/', (ctx) => {
    ctx.body = 'i\'m ok';
    ctx.res.writeHead(200, {});
});
router.use('/', function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let self = ctx;
        if (allowedMethodsWithoutAuth.indexOf(self._matchedRoute) > -1) {
            yield next();
            return;
        }
        if (!self.user) {
            return no_Auth();
        }
        yield next();
        function no_Auth() {
            self.status = 401;
            self.set('WWW-Authenticate', ' Basic');
            self.body = '身份验证失败';
        }
    });
});
let cs = controllers;
let keys = Object.keys(controllers);
keys.forEach(e => {
    let controller = cs[e];
    controller.init(router);
});
app.on('error', (err, ctx) => {
    logError('%s - error occured:%s', ctx.url, err);
});
let port = process.env.PORT || config_1.default.server.port;
const server = http.createServer(app.callback());
// let num: any = process.env.NODE_APP_INSTANCE
// let ioPort = 3011 + parseInt(num);
server.listen(port);
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    if (error.code) {
        if (error.code === 'EACCES') {
            logError(port + ' requires elevated privileges');
            process.exit(1);
        }
        else if (error.code === 'EADDRINUSE') {
            logError(port + ' is already in use');
            process.exit(1);
        }
        throw error;
    }
});
server.on('listening', () => {
    debug('app listening on:%j', server.address());
});
//# sourceMappingURL=index.js.map