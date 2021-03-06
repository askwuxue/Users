const http = require('http');
const util = require('util');
const mongoose = require('mongoose');
const fs = require('fs');
const { timeEnd } = require('console');
const { start } = require('repl');
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

    // 根据请求方法进行相应
    switch (method) {
        case 'GET':
            {
                // 设置可访问标识 为true代表是可访问标识
                let flag = false;

                if (url === '/') {
                    let index;
                    try {
                        index = await readFile('./router/list.html', 'utf8');
                    } catch (err) {
                        console.log('readFile failed');
                        console.log(err);
                    }
                    console.log('readFile ok....');
                    res.end(index);
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