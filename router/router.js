// 获得路由对象
const Router = require('router');

// 创建路由实例
const router = new Router();

// 引入model
const Users = require('../model/users.js');

// 引入art-template 
const template = require('art-template');

const queryString = require('querystring');

router.use(async(req, res, next) => {

    if (req.method === 'POST') {

        let postData = '';

        req.on('data', chunk => {
            postData += chunk;
        })

        req.on('end', () => {

            // 将post参数处理进行封装
            const bodyParse = (postData = []) => {

                // 将被转义的字符串进行处理
                let decodePostData = decodeURIComponent(postData);

                // 使用&进行分割形成数组
                let tmp = decodePostData.split('&');

                // 处理checkbox
                let tempObj = {};

                // 通过遍历已分割数组，通过=进行二次分割
                for (let i = 0; i < tmp.length; i++) {

                    let tempArr = tmp[i].split('=');

                    // TODO 正确的使用解构赋值
                    let [objKey, objValue] = tempArr;

                    if (!tempObj.hasOwnProperty(objKey)) {

                        tempObj[objKey] = objValue;

                        // 如果有多个相同的属性值 处理checkbox
                    } else {

                        // TODO 属性值是数组
                        if (Array.isArray(tempObj[objKey])) {

                            tempObj[objKey].push(objValue);

                        } else {

                            let firstValue = tempObj[objKey];

                            let arr = [firstValue];

                            arr.push(objValue);

                            tempObj[objKey] = arr;

                        }
                    }
                }

                return tempObj;

            }

            console.log('bodyParse: ', bodyParse(postData));

            res.end('ok');
        })


    } else {
        next();
    }

})

// list
router.get('/', async(req, res) => {

    // 查询数据并拿到数据
    let users = await Users.find();

    const html = template('list', { users });

    res.end(html);
})

// add
router.get('/add', async(req, res) => {

    const addHtml = template('add', {})

    res.end(addHtml);
})

// /edit
router.get('/edit', async(req, res) => {

    // TODO 结构赋值导致_id 是带有引号的字符串
    let { _id } = queryString.parse(req.url, '?');

    // TODO ObjectId 必须是可以转成Number类型的数据 
    _id = _id.replace(/"/g, "");

    let hobbies = ['吃饭', '睡觉', '读书', '看电影', '跑步', '足球', '篮球', '敲代码', '打豆豆'];

    let editUserData = await Users.findOne({ _id: _id });

    // 导入模板变量
    template.defaults.imports.hobbies1 = hobbies;

    //向模板引擎传递数据
    const editHtml = template('edit', editUserData);

    res.end(editHtml);

})

// /delete
router.get('/delete', async(req, res) => {

    let { _id } = queryString.parse(req.url, '?');

    // TODO ObjectId 必须是可以转成Number类型的数据 
    _id = _id.replace(/"/g, "");

    await Users.findOneAndDelete({ _id: _id });

    res.writeHead(301, {
        Location: 'http://localhost:3000/'
    })

    res.end();
})

// 处理post请求
// router.use('/', (req, res) => {
//     if (req.method === 'POST') {
//         console.log('get............................................................');
//     } else {
//         console.log('post..................................................................');
//         res.end();


//     }
// })



module.exports = router;