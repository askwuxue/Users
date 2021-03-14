// 获得路由对象
const Router = require('router');

// 创建路由实例
const router = new Router();

// 引入model
const Users = require('../model/users.js');

// 引入art-template 
const template = require('art-template');

const queryString = require('querystring');

// 引入获取url参数并对象化模块
const getUrlParas = require('../common/getUrlParas');

// 引入处理post请求参数模块
const bodyParse = require('../common/bodyParse');

router.use(async(req, res, next) => {

    // 获取请求地址 不包括参数
    let url = getUrlParas(req.url);

    if (req.method === 'POST') {

        if (url === '/') {
            let postData = '';

            req.on('data', chunk => {
                postData += chunk;
            })

            req.on('end', () => {

                Users.create(bodyParse(postData));

                // 重定向到首页
                res.writeHead(301, {
                    Location: 'http://localhost:3000/'
                });

                res.end();
            })
        } else if (url === '/edit') {

            let { _id } = queryString.parse(req.url, '?');

            // TODO ObjectId 必须是可以转成Number类型的数据 
            _id = _id.replace(/"/g, "");

            // 监听数据post数据的传输 
            let editData = '';
            req.on('data', async(chunk) => {
                editData += chunk;

                // 对数据库数据进行更新
                await Users.findOneAndUpdate({ _id: _id }, queryString.parse(editData));
                console.log('queryString.parse(editData): ', queryString.parse(editData));

                res.writeHead(301, {
                    Location: 'http://localhost:3000/'
                });
                res.end();
            });
        }
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

    editUserData.id = editUserData.id.replace(/"/g, '');

    //向模板引擎传递数据
    const editHtml = template('edit', editUserData);

    res.end(editHtml);

})

// /delete
router.get('/delete', async(req, res) => {

    let { _id } = queryString.parse(req.url, '?');

    _id = _id.replace(/"/g, "");

    await Users.findOneAndDelete({ _id: _id });

    res.writeHead(301, {
        Location: 'http://localhost:3000/'
    })

    res.end();
})

module.exports = router;