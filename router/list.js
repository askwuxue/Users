// 获得路由对象
const Router = require('router');

// 创建路由实例
const router = new Router();

// 引入model
const Users = require('../model/users.js');

// 引入art-template 
const template = require('art-template');

router.get('/', async(req, res) => {

    // 查询数据并拿到数据
    let users = await Users.find();

    const html = template('list', { users });

    res.end(html);
})

module.exports = router;