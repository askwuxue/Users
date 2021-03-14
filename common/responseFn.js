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

            console.log(err);

        }
        setHead(res, 200, url);
        res.end(data);
    });
}
nodule.exports = responseFn;