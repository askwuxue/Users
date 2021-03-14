### User 简易版用户管理系统
#### 1. 项目介绍
  这是一个简易版的用户管理系统，主要实现的功能为用户信息查看，用户信息添加，用户信息修改，用户信息删除。版本分为1.0和1.1。
  1.0 全部用原生的Node实现。
  2.0 全部使用现成的的库实现。
  -  mongoose:  实现Node对mongoDB的操作。
  - router: 实现对路由的控制。
  - querystring:  对用户请求的get，post等进行参数处理。
  - serve- static: 对静态资源进行处理。
  - art-template: 进行模板渲染。

#### 1. 目录结构介绍
```
├─common        存放公共文件,主要为个人封装的函数库
├─log           存放了一些个人项目过程中的一些问题
├─model         数据库相关
│  └─data       数据库文件
├─public        静态资源
│  ├─css
│  ├─html
│  └─js
├─router        路由
└─views         视图文件
```

