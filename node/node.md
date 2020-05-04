**exports&modules.exports**

require()返回的是module.exports而不是exports

**exports**

指向module.exports的引用

**modules.exports**

始值为一个空对象{}

module.exports可以对外提供单个变量,函数或者对象

```js
#1
//test1.js
exports.a = 1;

module.exports = {
    b:2
}

//test2.js
const a = require('./test1.js')

console.log(a); //{ b: 2 }  require()返回的是module.exports而不是exports

#2
//test1.js
exports.a = 1;
module.exports.b=2

//test2.js
const a = require('./test1.js')
console.log(a); //{ a: 1, b: 2 }

#3 导出单个变量
//test1.js
module.exports = function fn() {

}
//test2.js
const a = require('./test1.js')
console.log(a); //[Function: fn]



```

