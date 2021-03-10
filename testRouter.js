const http = require('http');
const util = require('util');

// 对于req res 最后处理函数
const finalhandler = require('finalhandler');




const router = require('./router/list');

// 导入mongodb
require('./model');

// 导入Users
const Users = require('./model/users');

const fs = require('fs');
const queryString = require('querystring');
const { route } = require('./router/list');

// 接受的是一个函数 不能够写成字符串
const readFile = util.promisify(fs.readFile);


// 获取url参数并对象化
const getUrlParas = (url) => {
    const paramObj = {};
    if (url.indexOf('?') != -1) {
        let paramStr = url.substring(url.indexOf('?') + 1);
        let paramArr = paramStr.split('&');
        paramArr.forEach(item => {
            const param = item.split('=');
            paramObj[param[0]] = param[1];
        });
    }
    return paramObj;
};

/*
 * 根据资源类型设置头部
 * status 响应码
 * url url
 */
const setHead = (res, status, url) => {

    // html
    let htmlRegex = /(.html)$/;

    //javascript 
    let jsRegex = /(.js)$/;

    // css 
    let cssRegex = /(.css)$/;

    if (htmlRegex.test(url)) {
        res.writeHead(status, {
            'content-type': 'text/html;charset=utf-8'
        })
    }
    if (jsRegex.test(url)) {
        res.writeHead(status, {
            'content-type': 'application/javascript;charset=utf-8'
        });
    }
    if (cssRegex.test(url)) {
        res.writeHead(status, {
            'content-type': 'text/css;charset=utf-8'
        });
    }

    // 以上都不满足 使用默认头部
    res.writeHead(status, {
        'content-type': 'text/html;charset=utf-8'
    })
};

// 将请求返回
const responseFn = (res, url) => {
    // 读取服务器的index文件 并将文件返回给客户端 
    fs.readFile(`${__dirname}${url}`, 'utf8', (err, data) => {

        // 请求资源失败
        if (err) {
            setHead(res, 404, url);

            // TODO 必须使用res.end() 来结束本次的返回 否则设置头部没有意义
            res.end('404......');

            // TODO 使用throw 将err抛出，将导致执行意外停止 会影响下面的执行 所以只是简单打印，最好使用一个
            // 错误处理函数来对异常进行处理 
            // throw err;

            console.log(err);

        }
        setHead(res, 200, url);
        res.end(data);
    });
}

// 创建server
const server = http.createServer((req, res) => {
    router(req, res, finalhandler(req, res));
});



server.on('request', async(req, res) => {
    let method = req.method;

    // 如果url中包含参数 只取 ? 前面的url
    let url = req.url.slice(0, req.url.includes('?') ? req.url.indexOf('?') : req.url.length);
    let urlParasObj = getUrlParas(req.url);
    console.log(`URL is: ${url}`);
    console.log(`request is: ${method}`);
    // 根据请求方法进行相应
    // TODO 注意switch的使用方法 break
    switch (method) {
        case 'GET':
            {
                // 设置可访问标识 为true代表是可访问标识
                let flag = false;

                if (url === '/') {
                    try {

                        // 查询数据并拿到数据
                        let users = await Users.find();

                        // let pathname = __dirname + '/views' + '/list.art';


                        // const html = template(pathname, { users });

                        const html = template('list', { users });
                        // console.log('html: ', html);

                        res.end(html);
                    } catch (err) {
                        console.log('readFile failed');
                        console.log(err);
                    }
                    console.log('readFile ok....');
                    // res.end(html);

                    // 添加用户
                } else if (url === '/add') {

                    let addHtml = template('add', {})
                        // addHtml = ``;
                    res.end(addHtml);

                    // 编辑用户信息
                } else if (url === '/edit') {

                    console.log('get request edit ..........');

                    // TODO 结构赋值导致_id 是带有引号的字符串
                    let { _id } = queryString.parse(req.url, '?');
                    console.log(typeof(_id));
                    console.log('_id: ', _id);

                    // TODO ObjectId 必须是可以转成Number类型的数据 
                    _id = _id.replace(/"/g, "");
                    console.log(typeof(_id));
                    console.log(_id);
                    console.log('queryString.parse(req.url): ', queryString.parse(req.url, '?'));
                    // console.log(urlParasObj);
                    let hobbies = ['吃饭', '睡觉', '读书', '看电影', '跑步', '足球', '篮球', '敲代码', '打豆豆'];

                    let editUserData = await Users.findOne({ _id: _id });
                    console.log('editUserData: ', editUserData);

                    // let pathname = __dirname + '/views' + '/edit.art';

                    // 导入模板变量
                    template.defaults.imports.hobbies1 = hobbies;

                    //向模板引擎传递数据
                    let editHtml = template('edit', editUserData);

                    res.end(editHtml);

                    // 删除用户信息
                } else if (url === '/delete') {
                    console.log('request method is get and request url is /delete');

                    let { _id } = queryString.parse(req.url, '?');

                    // TODO ObjectId 必须是可以转成Number类型的数据 
                    _id = _id.replace(/"/g, "");

                    await Users.findOneAndDelete({ _id: _id });

                    res.writeHead(301, {
                        Location: 'http://localhost:3000/'
                    })

                    res.end();
                }

                // 请求css source
                let cssRegex = /[a-zA-z0-9\/]{1,}(.css)$/;
                if (cssRegex.test(url)) {
                    flag = true;
                    responseFn(res, url);
                }

                // 请求JavaScript source
                let jsRegex = /(.js)$/;
                if (jsRegex.test(url)) {
                    flag = true;
                    responseFn(res, url);
                }
            };
            break;
        case 'POST':
            {
                console.log('POST enter.......');

                if (url === '/') {
                    let postData = '';
                    req.on('data', chunk => {
                        postData += chunk;
                    });
                    req.on('end', () => {
                        // 数据插入数据库
                        Users.create(queryString.parse(postData));
                        // res.end('ok');
                        // 重定向到首页
                        res.writeHead(301, {
                            Location: 'http://localhost:3000/'
                        });
                        res.end();
                    })

                    // 编辑处理
                } else if (url === '/edit') {
                    // urlParasObj
                    let editData = '';
                    console.log('urlParasObj: ', urlParasObj);

                    let { _id } = queryString.parse(req.url, '?');

                    // TODO ObjectId 必须是可以转成Number类型的数据 
                    _id = _id.replace(/"/g, "");

                    // 监听数据post数据的传输 
                    req.on('data', async(chunk) => {
                        editData += chunk;

                        // 对数据库数据进行更新
                        await Users.findOneAndUpdate({ _id: _id }, queryString.parse(editData));

                        res.writeHead(301, {
                            Location: 'http://localhost:3000/'
                        });
                        res.end();
                    });
                    req.on('end', () => {})
                    console.log('post request edit  .......................');
                }
            }
            break;
    }
})

// 监听服务
server.listen(3000, () => {
    console.log('server start access.....');
});