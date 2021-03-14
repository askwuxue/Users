// 获取url参数并对象化
// TODO 为什么返回对象的时候返回了[object Object]
const getUrlParas = (reqUrl = '') => {
    const paramObj = {};
    // paramObj.url = '123';
    // Object.defineProperty(paramObj, 'url', {
    //     value: '123',
    //     writable: false,
    //     enumerable: true,
    //     configurable: false
    // });
    let decodeReqUrl = decodeURIComponent(reqUrl);

    if (decodeReqUrl.indexOf('?') !== -1) {
        let paramStr = decodeReqUrl.substring(decodeReqUrl.indexOf('?') + 1);
        paramObj.url = decodeReqUrl.substring(0, decodeReqUrl.indexOf('?'));
        let paramArr = paramStr.split('&');
        paramArr.forEach(item => {
            const param = item.split('=');
            // console.log('param[1]: ', param[1]);
            paramObj[param[0]] = param[1].replace(/"/g, '');

        });
    } else {
        paramObj.url = reqUrl;
    }
    // return JSON.stringify(paramObj);
    return paramObj.url;
};
module.exports = getUrlParas;