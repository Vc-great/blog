const map = new Map([
    ['normal',cloneNormalFunc],
    ['arrows',cloneArrowsFunc],
    ['body',cloneBody],
    ['params',cloneParams],
]);

module.exports= function cloneFunction(func) {
    const funcString = func.toString();
    const isArrows =func.prototype?'normal':'arrows';
    [...map].filter(([key])=>key===isArrows).forEach(([key,value])=>{value(funcString)})
}

function cloneNormalFunc(funcString) {
    console.log('普通函数');
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const body_params = {
        params : paramReg.exec(funcString),
        body : bodyReg.exec(funcString)
    };
    const obj = {
        body:'',
        params:'',
    };
    Object.keys(body_params).forEach(x=>{
        [...map].filter(([test])=>test===x).forEach(([key,value])=>{obj[key]=value(body_params[key])
    })
    });
    console.log(obj);
    return new Function(obj.params,obj.body);
}

function cloneArrowsFunc(funcString) {
    console.log('箭头函数');
    return eval(funcString);
}

function cloneBody(body) {
    return body ? body[0] : ''
}

function cloneParams(params) {
    const paramArr =params ? params[0].split(',') : '';
    console.log('匹配到参数：', paramArr);
    return paramArr
}




