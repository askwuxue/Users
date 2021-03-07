const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

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
        required: true
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

// TODO 使用model.exports.Users 的区别
module.exports = Users;