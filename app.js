const http = require('http');
const util = require('util');
const mongoose = require('mongoose');
const fs = require('fs');
const { timeEnd } = require('console');
const { start } = require('repl');

// 接受的是一个函数 不能够写成字符串
const readFile = util.promisify(fs.readFile);

// Schema
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/Users', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('mongodb connect access....')
    })
    .catch(err => {
        console.log('mongodb connect failed.....');
        console.log(err);
    })

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
const server = http.createServer();

// 创建模式
const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 16,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 14,
        max: 75
    },
    hobbies: {
        type: [String],
        required: true,
        min: 3,
        max: 16
    },
    email: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 16,
        trim: true
    }
})

// 创建Model
const Users = mongoose.model('Users', usersSchema);

// 创建一个文档
// Users.create({
//         name: 'wuxue',
//         age: 24,
//         hobbies: ['red book', 'basketball', 'movie'],
//         email: '972523419@qq.com'
//     }).then(data => {
//         console.log('create data access......');
//         console.log(data);
//     })
//     .catch(err => {
//         console.log('create data failed......');
//         console.log(err);
//     })

// 删除已经添加的测试数据
Users.deleteMany({ name: 'wuxue' }).then(data => {
        console.log('name is wuxue delete all and access......');
        console.log(data);
    })
    .catch(err => {
        console.log('name is wuxue delete all failed');
        console.log(err);
    })


server.on('request', async(req, res) => {
    let method = req.method;

    // 如果url中包含参数 只取 ? 前面的url
    let url = req.url.slice(0, req.url.includes('?') ? req.url.indexOf('?') : req.url.length);
    let urlParasObj = getUrlParas(req.url);

    // 根据请求方法进行相应
    switch (method) {
        case 'GET':
            {
                // 设置可访问标识 为true代表是可访问标识
                let flag = false;

                if (url === '/') {
                    let list;
                    try {
                        // index = await readFile('./router/list.html', 'utf8');
                        list = `<!DOCTYPE html>
                        <html lang="en">
                        
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
                            <link rel="stylesheet" href="../css/list.css">
                            <title>List</title>
                        </head>
                        <div class="container">
                            <!-- Content here -->
                            <button type="button" class="btn btn-primary">添加</button>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">编号</th>
                                        <th scope="col">姓名</th>
                                        <th scope="col">年龄</th>
                                        <th scope="col">兴趣爱好</th>
                                        <th scope="col">邮箱</th>
                                        <th scope="col">操作</th>
                                    </tr>
                                </thead>
                                <tbody>`;
                        // 查询数据并拿到数据
                        let users = await Users.find();
                        // console.log('find database access.......');
                        // console.log(users);
                        users.forEach((item, index) => {
                                console.log(item);
                                console.log(index);
                                list += `<tr><th scope="row">${index}</th><td>${item.name}</td><td>${item.age}</td><td>`;
                                item.hobbies.forEach(value => {
                                        list += `${value}`
                                    })
                                    // TODO 有哪些坑
                                    // for (let key in item) {
                                    //     console.log(key);
                                    //     console.log(item[key]);
                                    //     list += `<td>${key}</td>`;
                                    // }
                                    // item.forEach(value => {
                                    //     list += `<td>${value}</td>`;
                                    // })
                                    // for (let value of Object.values(item)) {
                                    //     // list += `<td>${value}</td>`;
                                    //     console.log('use for of start ........');
                                    //     console.log(value);
                                    // }
                                    // console.log('use for of start ........');
                                    // console.log(Object.values(item));
                                list += `</td><td>${item.email}</td><td>
                                <button type="button" class="btn btn-dark">修改</button>
                                <button type="button" class="btn btn-danger">删除</button>
                            </td></tr>`;
                                // console.log(list);
                            })
                            // Users.find().then(data => {
                            //         console.log('find database access.......');
                            //         console.log(data);

                        //     })
                        //     .catch(err => {
                        //         console.log('find database failed......');
                        //         console.log(data);
                        //     })

                        list += ` </tbody>
                        </table>
                    </div>
                    
                    <body>
                    </body>
                    
                    </html>`;
                        // console.log(index);
                        // index = ``
                    } catch (err) {
                        console.log('readFile failed');
                        console.log(err);
                    }
                    console.log('readFile ok....');
                    res.end(list);
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

                // TODO1 判断有误导致报错
                // 返回以上之外的地址时 .认为是非合法地址
                // if (!flag) {
                //     setHead(res, 404, url);
                //     res.end('您访问的地址不存在.......');
                // }

                // TODO2 如何优雅的在此处使用switch 使用switch支持正则表达式
                // switch (url) {
                //     case '/':
                //         {
                //             console.log('enter ......   /')
                //             let index;
                //             try {
                //                 let start = new Date();
                //                 console.log(start.getTime());
                //                 index = await readFile('../router/list.html', 'utf8');
                //                 let end = new Date();
                //                 console.log(end.getTime() - start.getTime());
                //             } catch (err) {
                //                 console.log('readFile failed');
                //                 console.log(err);
                //             }
                //             console.log('readFile ok....');
                //             res.end(index);

                //         }
                //         break;
                //         // case 'favicon.ico':
                // }
            }
    }
    // console.log(req);
    // res.end('ok');
})

// 监听服务
server.listen(3000, () => {
    console.log('server start access.....');
});