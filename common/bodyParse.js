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

module.exports = bodyParse;