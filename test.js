const template = require('art-template');


let pathname = __dirname + '/views' + '/list.art';

console.log(pathname);

const html = template(pathname, {});


console.log(html);