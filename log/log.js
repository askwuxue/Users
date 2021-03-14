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




// server.on('request', async(req, res) => {
//     let method = req.method;

//     // 如果url中包含参数 只取 ? 前面的url
//     let url = req.url.slice(0, req.url.includes('?') ? req.url.indexOf('?') : req.url.length);
//     let urlParasObj = getUrlParas(req.url);
//     console.log(`URL is: ${url}`);
//     console.log(`request is: ${method}`);
//     // 根据请求方法进行相应
//     // TODO 注意switch的使用方法 break
//     switch (method) {
//         case 'GET':
//             {
//                 // 设置可访问标识 为true代表是可访问标识
//                 let flag = false;

//                 if (url === '/') {
//                     try {

//                         // 查询数据并拿到数据
//                         let users = await Users.find();

//                         // let pathname = __dirname + '/views' + '/list.art';


//                         // const html = template(pathname, { users });

//                         const html = template('list', { users });
//                         // console.log('html: ', html);

//                         res.end(html);
//                     } catch (err) {
//                         console.log('readFile failed');
//                         console.log(err);
//                     }
//                     console.log('readFile ok....');
//                     // res.end(html);

//                     // 添加用户
//                 } else if (url === '/add') {

//                     let addHtml = template('add', {})
//                         // addHtml = ``;
//                     res.end(addHtml);

//                     // 编辑用户信息
//                 } else if (url === '/edit') {

//                     console.log('get request edit ..........');

//                     // TODO 结构赋值导致_id 是带有引号的字符串
//                     let { _id } = queryString.parse(req.url, '?');
//                     console.log(typeof(_id));
//                     console.log('_id: ', _id);

//                     // TODO ObjectId 必须是可以转成Number类型的数据 
//                     _id = _id.replace(/"/g, "");
//                     console.log(typeof(_id));
//                     console.log(_id);
//                     console.log('queryString.parse(req.url): ', queryString.parse(req.url, '?'));
//                     // console.log(urlParasObj);
//                     let hobbies = ['吃饭', '睡觉', '读书', '看电影', '跑步', '足球', '篮球', '敲代码', '打豆豆'];

//                     let editUserData = await Users.findOne({ _id: _id });
//                     console.log('editUserData: ', editUserData);

//                     // let pathname = __dirname + '/views' + '/edit.art';

//                     // 导入模板变量
//                     template.defaults.imports.hobbies1 = hobbies;

//                     //向模板引擎传递数据
//                     let editHtml = template('edit', editUserData);

//                     res.end(editHtml);

//                     // 删除用户信息
//                 } else if (url === '/delete') {
//                     console.log('request method is get and request url is /delete');

//                     let { _id } = queryString.parse(req.url, '?');

//                     // TODO ObjectId 必须是可以转成Number类型的数据 
//                     _id = _id.replace(/"/g, "");

//                     await Users.findOneAndDelete({ _id: _id });

//                     res.writeHead(301, {
//                         Location: 'http://localhost:3000/'
//                     })

//                     res.end();
//                 }

//                 // 请求css source
//                 let cssRegex = /[a-zA-z0-9\/]{1,}(.css)$/;
//                 if (cssRegex.test(url)) {
//                     flag = true;
//                     responseFn(res, url);
//                 }

//                 // 请求JavaScript source
//                 let jsRegex = /(.js)$/;
//                 if (jsRegex.test(url)) {
//                     flag = true;
//                     responseFn(res, url);
//                 }
//             };
//             break;
//         case 'POST':
//             {
//                 console.log('POST enter.......');

//                 if (url === '/') {
//                     let postData = '';
//                     req.on('data', chunk => {
//                         postData += chunk;
//                     });
//                     req.on('end', () => {
//                         // 数据插入数据库
//                         Users.create(queryString.parse(postData));
//                         // res.end('ok');
//                         // 重定向到首页
//                         res.writeHead(301, {
//                             Location: 'http://localhost:3000/'
//                         });
//                         res.end();
//                     })

//                     // 编辑处理
//                 } else if (url === '/edit') {
//                     // urlParasObj
//                     let editData = '';
//                     console.log('urlParasObj: ', urlParasObj);

//                     let { _id } = queryString.parse(req.url, '?');

//                     // TODO ObjectId 必须是可以转成Number类型的数据 
//                     _id = _id.replace(/"/g, "");

//                     // 监听数据post数据的传输 
//                     req.on('data', async(chunk) => {
//                         editData += chunk;

//                         // 对数据库数据进行更新
//                         await Users.findOneAndUpdate({ _id: _id }, queryString.parse(editData));

//                         res.writeHead(301, {
//                             Location: 'http://localhost:3000/'
//                         });
//                         res.end();
//                     });
//                     req.on('end', () => {})
//                     console.log('post request edit  .......................');
//                 }
//             }
//             break;
//     }
// })
// test conflict branch is Router