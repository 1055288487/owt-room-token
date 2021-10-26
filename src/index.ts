import * as Koa from 'koa';
import * as http from 'http';
import * as  KoaRouter from 'koa-router';
import * as logger from 'koa-logger';
import * as  json from 'koa-json';
import * as Bodyparser from 'koa-bodyparser';
import * as controllers from './controllers/index';
import config from './config'
const app = new Koa(),
  staticServe = require('koa-static'),
  convert = require('koa-convert'),
  bodyparser = Bodyparser(),
  router = new KoaRouter({ prefix: '/api/v1' }),
  // config = require('./config'),
  path = require('path'),
  DEBUG = require('debug'),
  debug = DEBUG('index:debug'),
  logError = DEBUG('index:error');
const staticPath = '../../storage'
let allowedMethodsWithoutAuth = ['/api/v1/owt/createToken', '/api/v1/owt/createRoom', '/api/v1/owt/detail']
app.use(async function (ctx: Koa.Context, next: Function) {
  try {
    ctx.set('server', 'WSS/V8');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with,content-type,authorization');
    if (ctx.method === 'OPTIONS') {
      ctx.status = 200;
      return
    }
    await next();
  } catch (err: any) {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.set('WWW-Authenticate', 'Basic');
      ctx.body = '未授权的访问';
    } else {
      ctx.status = 200;
      ctx.body = {
        ret: 0,
        msg: err.message
      }
    }
  }
});

app.use(router.allowedMethods())
  .use(convert(bodyparser))
  .use(Bodyparser({
    'jsonLimit': '10mb',
  }))
  .use(convert(json()))
  .use(convert(logger()))
  .use(staticServe(
    path.join(__dirname, '../static')
  ))
  .use(staticServe(
    path.join(__dirname, staticPath)
  ))
  .use(router.routes())

router.all('/', (ctx: Koa.Context) => {
  ctx.body = 'i\'m ok';
  ctx.res.writeHead(200, {})
});

router.use('/', async function (ctx: Koa.Context, next: Function) {
  let self: any = ctx;
  if (allowedMethodsWithoutAuth.indexOf(self._matchedRoute) > -1) {
    await next();
    return;
  }

  if (!self.user) {
    return no_Auth();
  }
  await next();

  function no_Auth() {
    self.status = 401;
    self.set('WWW-Authenticate', ' Basic');
    self.body = '身份验证失败';
  }

});

let cs: any = controllers;
let keys = Object.keys(controllers);
keys.forEach(e => {
  let controller: IRouter = cs[e] as IRouter;
  controller.init(router);
})

app.on('error', (err: Error, ctx: Koa.Context) => {
  logError('%s - error occured:%s', ctx.url, err);
})

let port = process.env.PORT || config.server.port;
const server = http.createServer(app.callback());

// let num: any = process.env.NODE_APP_INSTANCE
// let ioPort = 3011 + parseInt(num);

server.listen(port);

server.on('error', (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  if (error.code) {
    if (error.code === 'EACCES') {
      logError(port + ' requires elevated privileges');
      process.exit(1);
    } else if (error.code === 'EADDRINUSE') {
      logError(port + ' is already in use');
      process.exit(1);
    }
    throw error
  }
});

server.on('listening', () => {
  debug('app listening on:%j', server.address());
})
