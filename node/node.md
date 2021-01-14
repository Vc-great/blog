**全局对象**

​	`node`中的全局对象,游览器中的`this`指代的是`window`,服务端中`this`指代的是`global`

​	默认我们访问是在文件中访问的`this`,内部被更改了,所以不是`global`而是`module.exports`

**this 为什么不是 global**

​	`NodeJs`的每个文件是被当作一个模块来封装的

```js
function fn(){
	console.log(this)
}
//定义模块
var module = {
	fn:fn
}
//构建模块
module.fn()
```

​	直接打印this,不是`global`而是`module.exports`,在函数中打印this就是global

```js
function fn() {
    console.log(this === global) //true
}
fn() 
```



**platform**

​	区分操作系统

```js
// 用途：根据不同平台 操作系统文件的 
console.log(process.platform); // win32  windows /  drawin linux   /etc/usr/
```

**cwd**

​	获取当前执行node命令目录,可以找到当前目录下的某个文件

​	curren working directory 可以改变的

```js
console.log(process.cwd())
D:\个人\study\jiagouke2node\5.node
```

**cwd与__dirname**

​	文件位置`d:dir\index.js`

```js
console.log(`cwd: ${process.cwd()}`);
console.log(`dirname: ${__dirname}`);
```

| 命令              | process.cwd() | __dirname |
| ----------------- | ------------- | --------- |
| node index.js     | d:\dir        | d:\dir    |
| node dir\index.js | d:            | d:\dir    |

**env**

​	设置环境变量,可以根据不同环境变量做配置

```js
// 如果是window可以通过 set xxx=xxx  / mac export xxx=xxx  
// cross-env这是一个第三方模块用于设置环境变量
// 用webpack 区分开发还是生产  

if(process.env.NODE_ENV === 'production'){
    console.log('生产环境')
}else{
    console.log('开发环境')
}
// console.log(process.env.A); // 当前系统环境变量 
```

**argv**

​	可以获取到当前用户的所有传入参数 `--port` `--config`

​	简写一个`-`,`-port` = =`--port`

```js
let config = process.argv.slice(2).reduce((memo,current,index,arr)=>{ // [--port,3000,--config,xx.js]
    if(current.startsWith('--')){
        memo[current.slice(2)] = arr[index+1];
    }
    return memo;
},{})
```

**commander**

​	编写Node命令行工具(cli),解析用户传递的参数

```js
 const program = require('commander'); // 解析用户传递的参数 
 program.name('zf')
 program.usage('[options]')
 program.command('rm').action(function () {
     console.log('删除')
 })
 program.option('-p, --port <v>','set server port') 
 program.parse(process.argv)
```









**exports&modules.exports**

require()返回的是module.exports而不是exports

**exports**

​	指向module.exports的引用,同一个地址

​	禁止`exports`=XXX,会修改指针,不和`module.exports`指向同一个地址

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

console.log(a); //{ b: 2 }  module.exports和exports 引用地址改变了

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



**resolve和join**

​	遇到`/`,`resolve`会解析为根路径;`join`会直接拼接在一起

​	`join`使用平台特定的分隔符(`Unix`系统是`/`,Windows系统是`\`)把全部给定的`path`片段连接到一起,规范化生成路径

```js
__dirname
// __dirname返回当前文件所在的绝对路径
const path = require('path');

const path1 = path.join(__dirname, '/foo');
const path2 = path.join(__dirname, './foo/bar');
const path3 = path.join('/foo', 'bar', '/baz/apple', 'aaa', '..');
const path4 = path.join('foo', 'bar', 'baz');


console.log(path1);
console.log(path2);
console.log(path3);
console.log(path4);

// 输出结果
/Users/xiao/work/test/foo
/Users/xiao/work/test/foo/bar
/foo/bar/baz/apple
foo/bar/baz

```

​	`resolve`会把一个路径或路径片段的序列解析为一个绝对路径,`resolve`操作相当于进行了一系列的cd操作

```js
const path = require('path');

const path1 = path.resolve('/a/b', '/c/d');
// 结果： /c/d
const path2 = path.resolve('/a/b', 'c/d');
// 输出： /a/b/c/d
const path3 = path.resolve('/a/b', '../c/d');
// 输出： /a/c/d
const path4 = path.resolve('a', 'b');
// 输出： /Users/xiao/work/test/a/b

```

**extname**

​	获取后缀名

```js
console.log(path.extname('a.min.js')); // .js 

```



**relative**

​	去掉相同的部分

```js
console.log(path.relative('bb','bb/a.js')); // a.js
```



**runInThisContext**

​	让字符串直接执行,并且在沙箱环境中,模版引擎用哪个的是`new Function + width`

**require文件查找**

​	引入的js和文件夹不要重名,如果文件不是绝对路径或者相对路径(不是核心模块)会去当前文件夹下的`node_module`下查找,如果当前`node_module`找不到会继续向上层查找,知道根目录位置,找不到报错

**查找规则:**

1. 默认会先查找当前文件夹下的`js	`文件
2. 找不到找`json`
3. 在找不到找文件夹,会查找`package.json`中的`main`字段,找到对应结果,如果没有`package.json`,找`index.js`



**模块分类**

-  核心模块
  http fs path ...
- 文件模块
  我们自己写的
- 第三方模块
  npm安装

​	