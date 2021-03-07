const http = require('http');
const util = require('util');

// 导入mongodb
require('./model');

// 导入Users
const Users = require('./model/users');

const fs = require('fs');
const queryString = require('querystring');

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
const server = http.createServer();

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
                    let list;
                    try {
                        list = `<!DOCTYPE html>
                        <html lang="en">
                        
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
                            <link rel="stylesheet" href="../css/list.css">
                            <script src="../js/list.js"></script>
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
                        users.forEach((item, index) => {
                            list += `<tr><th scope="row">${index}</th><td>${item.name}</td><td>${item.age}</td><td>`;
                            item.hobbies.forEach(value => {
                                list += `${value}`
                            })

                            list += `</td><td>${item.email}</td><td>
                                <button type="button" class="btn btn-dark"><a href="http://localhost:3000/edit?_id=${item._id}" style="color: #fff;text-decoration: none">修改</a></button>
                                <button type="button" class="btn btn-danger"><a href="http://localhost:3000/delete?_id=${item._id}" style="color: #fff;text-decoration: none">删除</a></button>
                            </td></tr>`;
                            // console.log(list);
                        })

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

                    // 添加用户
                } else if (url === '/add') {
                    let addHtml;
                    addHtml = `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
                        <title>Add User</title>
                    </head>
                    
                    <body>
                        <div class="container">
                            <!-- Content here -->
                            <h2>添加用户信息</h2>
                            <form method="POST" action="/" enctype="application/x-www-form-urlencoded">
                                <div class="form-group">
                                    <label for="exampleInputEmail1"></label>姓名</label>
                                    <input type="input" name="name" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">年龄</label>
                                    <input type="number" name="age" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">邮箱</label>
                                    <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">密码</label>
                                    <input type="password" name="password" class="form-control" id="exampleInputPassword1">
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" name="hobbies" type="checkbox" value="吃饭" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck1">
                                      吃饭
                                    </label>
                                    <input class="form-check-input" name="hobbies" type="checkbox" value="睡觉" style="margin-left: 10px;" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck2" style="margin-left: 30px;">
                                      睡觉
                                    </label>
                                    <input class="form-check-input" name="hobbies" type="checkbox" value="读书" style="margin-left: 10px;" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck3" style="margin-left: 30px;">
                                      读书
                                    </label>
                                    <input class="form-check-input" name="hobbies" type="checkbox" value="看电影" style="margin-left: 10px;" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck4" style="margin-left: 30px;">
                                      看电影
                                    </label>
                                    <input class="form-check-input" name="hobbies" type="checkbox" value="跑步" style="margin-left: 10px;" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck5" style="margin-left: 30px;">
                                      跑步
                                    </label>
                                    <input class="form-check-input" name="hobbies" type="checkbox" value="足球" style="margin-left: 10px;" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck6" style="margin-left: 30px;">
                                      足球
                                    </label>
                                    <input class="form-check-input" name="hobbies" type="checkbox" value="篮球" style="margin-left: 10px;" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck7" style="margin-left: 30px;">
                                      篮球
                                    </label>
                                    <input class="form-check-input" name="hobbies" type="checkbox" value="敲代码" style="margin-left: 10px;" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck8" style="margin-left: 30px;">
                                      敲代码
                                    </label>
                                    <input class="form-check-input" name="hobbies" type="checkbox" value="打豆豆" style="margin-left: 10px;" id="defaultCheck1">
                                    <label class="form-check-label" for="defaultCheck9" style="margin-left: 30px;">
                                      打豆豆
                                    </label>
                                </div>
                                <button type="submit" class="btn btn-primary" style="margin-top: 20px;">提交</button>
                    
                            </form>
                        </div>
                    </body>
                    
                    </html>`;
                    res.end(addHtml);

                    // 编辑用户信息
                } else if (url === '/edit') {
                    console.log('get request edit ..........');
                    console.log(urlParasObj);
                    let hobbies = ['吃饭', '睡觉', '读书', '看电影', '跑步', '足球', '篮球', '敲代码', '打豆豆'];

                    let editUserData = await Users.findOne({ _id: urlParasObj._id });

                    let edit = `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
                        <title>Add User</title>
                    </head>
                    
                    <body>
                        <div class="container">
                            <!-- Content here -->
                            <h2>编辑用户信息</h2>
                            <!--TODO 此表单通过post提交 action中拼接的id是通过get请求的方式发出的 也可以被获得 -->
                            <form method="POST" action="http://localhost:3000/edit?_id=${urlParasObj._id}" enctype="application/x-www-form-urlencoded">
                                <div class="form-group">
                                    <label for="exampleInputEmail1"></label>姓名</label>
                                    <input type="input" name="name" value=${editUserData.name} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">年龄</label>
                                    <input type="number" name="age" value=${editUserData.age} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">邮箱</label>
                                    <input type="email" name="email" value=${editUserData.email} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">密码</label>
                                    <input type="password" name="password" value=${editUserData.password} class="form-control" id="exampleInputPassword1">
                                </div>
                                <div class="form-check">
                                    `;

                    // 判断哪些hobby在用户的已选择范围内
                    hobbies.forEach(item => {
                        let isHobby = editUserData.hobbies.includes(item);

                        // 是用户已选择的hobby
                        if (isHobby) {
                            edit += `<input class="form-check-input" name="hobbies" type="checkbox" value="${item}" checked="${isHobby}" style="margin-left: 10px;" id="defaultCheck1">
                            <label class="form-check-label" for="defaultCheck2" style="margin-left: 30px;">
                              ${item}
                            </label>`
                        } else {
                            edit += `<input class="form-check-input" name="hobbies" type="checkbox" value="${item}" style="margin-left: 10px;" id="defaultCheck1">
                            <label class="form-check-label" for="defaultCheck2" style="margin-left: 30px;">
                            ${item}
                            </label>`;
                        }
                    })
                    edit += `
                    </div>
                    <button type="submit" class="btn btn-primary" style="margin-top: 20px;">提交</button>
                </form>
            </div>
        </body>
        </html>`
                    res.end(edit);

                    // 删除用户信息
                } else if (url === '/delete') {
                    console.log('request method is get and request url is /delete');

                    await Users.findOneAndDelete({ _id: urlParasObj._id });

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
                    // console.log('/');
                    let postData = '';
                    req.on('data', chunk => {
                        postData += chunk;
                        console.log('postData: ', queryString.parse(postData));
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

                    // 监听数据post数据的传输 
                    req.on('data', async(chunk) => {
                        editData += chunk;

                        // 对数据库数据进行更新
                        await Users.findOneAndUpdate({ _id: urlParasObj._id }, queryString.parse(editData));

                        res.writeHead(301, {
                            Location: 'http://localhost:3000/'
                        });
                        res.end();
                    });
                    req.on('end', () => {
                        // console.log('ok');
                    })
                    console.log('post request edit  .......................');
                }
            }
            break;
    }
    // console.log(req);
    // res.end('ok');
})

// 监听服务
server.listen(3000, () => {
    console.log('server start access.....');
});