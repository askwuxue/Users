const http = require('http');
const util = require('util');

const path = require('path');

// 使用静态服务
const serveStatic = require('serve-static');

const serve = serveStatic(path.join(__dirname, 'public'));

// 对于req res 最后处理函数
const finalhandler = require('finalhandler');

// 引入art-template 
const template = require('art-template');

// 配置模板根目录
template.defaults.root = __dirname + '/views/';

// 配置默认的后缀名，配置了之后可以省略后缀名
template.defaults.extname = '.art';

// 引入路由
const router = require('./router/router');

// 导入mongodb
require('./model');

// 导入Users
const Users = require('./model/users');

const fs = require('fs');

const queryString = require('querystring');

const { route } = require('./router/router');

// 接受的是一个函数 不能够写成字符串
const readFile = util.promisify(fs.readFile);

// 创建server
const server = http.createServer();

server.on('request', (req, res) => {
    router(req, res, () => {});
    serve(req, res, () => {});
})

// 监听服务
server.listen(3000, () => {
    console.log('server start access.....');
});