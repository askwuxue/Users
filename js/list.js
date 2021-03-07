const main = () => {
    // console.log('list.js access...');
    // 获得添加btn
    let addBtn = document.querySelector('.btn-primary');
    let editBtn = document.querySelector('.btn-dark');

    // 使用箭头函数导致this指向的是window
    // 点击添加按钮触发函数
    function handClickAddBtn() {
        // console.log(this);
        console.log(this);
        window.location.href = 'http://localhost:3000/add'
    }

    // 点击修改按钮触发函数
    // function handClickEditBtn(e) {

    // }


    // 监听点击添加用户事件
    addBtn.addEventListener('click', handClickAddBtn);


}

addEventListener('DOMContentLoaded', main);