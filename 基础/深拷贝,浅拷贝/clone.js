const cloneFunction = require('./func');

//可遍历类型
const mapTag = "[object Map]";
const setTag = "[object Set]";
const arrayTag = "[object Array]";
const objectTag = "[object Object]";
const argsTag = "[object Arguments]";
//不可遍历类型

const dateTag = "[object Date]";
const symbolTag = "[object symbol]";
const errorTag = "[object Error]";
const regexpTag = "[object Regexp]";
const funTag = "[object Function]";

const deepTag = [mapTag,setTag,arrayTag,objectTag,arrayTag];

const otherTag =(target,type,Ctor)=> {
    let obj={
    numberTag:null,
    stringTag:null,
    boolTag:null,
    errorTag:null,
    dateTag:new Ctor(target),
    symbolTag:cloneSymbol(target),
    regexpTag:cloneReg(target),
    funTag:cloneFunction(target)
};
return obj[type]
};

//Todo cloneReg 没理解
function cloneReg(target) {
    const reFlags = /\w*$/;
    const result = new target.constructor(target.source,reFlags.exec(target));
    result.lastIndex = target.lastIndex;
    return result
}

//vualeof 方法返回当前 symbol 对象所包含的 symbol原始值
//Todo cloneSymbol 没理解
function cloneSymbol(target) {
    return Object(Symbol.prototype.valueOf(target))
}

const map_set_Tag=(type,target,cloneTarget,map)=> {
    let obj = {
        setTag:map_set_clone(target,cloneTarget,map,'add'),
        mapTag:map_set_clone(target,cloneTarget,map,'set')
    }
    return obj[type]
}
function map_set_clone(target,cloneTarget,map,method){
    target.forEach(value=>{
        cloneTarget[method](clone(value));
    });
    return cloneTarget
}
function forEach(target,cloneTarget,isArray,map) {
    let index = -1;
    let keys = isArray?target:Object.keys(target);
    let length = keys.length;
    while(++index <length){
        let key =isArray?index:keys[index];
        cloneTarget[key] = clone(target[key],map)
    }
}

function isObject(target) {
    const type = typeof target;
    return target !==null &&(type === 'object' || type ==='function')
}

function getType(target) {
    return Object.prototype.toString.call(target)
}

function cloneOtherType(target,type) {
    const Ctor = target.constructor;
    otherTag(target,type,Ctor)

}

function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor
}

function map_set_type(map,target,cloneTarget,type) {
    if (map.get(target)){
        return map.get(target)
    }
    map.set(target,cloneTarget);
    map_set_Tag(type,target,cloneTarget,map)
}


function clone(target,map=new Map()) {
    //不是引用类型 直接返回
    if (!isObject(target)){
        return target
    }
    const type = getType(target);
    let cloneTarget;
    if(deepTag.includes(type)){
        //获得原型 属性
        cloneTarget = getInit(target,type);
    }else{
        return cloneOtherType(target,type);
    }

    map_set_type(map,target,cloneTarget,type);
        let isArray = type ===arrayTag;
        forEach(target,cloneTarget,isArray,map);
        return cloneTarget

}

