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