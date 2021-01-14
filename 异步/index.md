**异步编程目标**

​	就是怎样让它更像同步编程

**异步编程实现**

1. 回调函数
2. 事件监听
3. 发布订阅
4. Promise/A+ 和生成器函数
5. async/await

**回调**

​	回调函数就是把任务的第二段写在一个函数里,等到重新执行这个任务的时候,就直接调用这个函数

```js
fs.readFile('./name.txt',function(err,data){
	if(err)throw err;
	console.log(data)
})
```

**回调的问题**

1. **异常处理**

```js
try{
	//xxx
}catch(e){
	//Todo
}
```

​	异步代码时`try catch`不再生效

```js
let async = fucntion(callback){
	try{
		setTimeout(function(){
			callback()
		},1000)
	}catch(e){
        console.log('捕获错误',e)
    }
}
async(function(){
	console.log(t)
})

```

​	因为回调函数被存放了起来,直到下一个时间环的时候才会取出,`try`只能捕获当前循环内的异常,对`callback`异步无能为力

​	异步方法也要遵循两个原则

1. 必须在异步之后调用传入的回调函数
2. 如果出错了要向回调函数传入异常供调用者判断

```js
#node
//Node在处理异常有一个约定,将异常作为回调的第一个实参传回,如果为空表示没有出错
async(function(err,data){
    if(err){
        console.log(err)
    }
})

#
let async = function(callback){
    try{
        setTimeout(function(){
            if(success){
                callback(null)
            }else{
                callback('错误')
            }
        })
    }catch(e){
        sonsole.log('捕获错误',e)
    }
}
```

2. **回调地狱**

   异步多级依赖的情况下嵌套非常深,代码难以阅读的维护

   ```js
   let fs = require('fs')
   fs.readFile('template.txt','utf8',function(err,template){
   	fs.readFile('data.text','utf8',function(err,data){
   		console.log(template +'' +data)
   	})
   })
   ```

### 异步流程解决方案

**事件发布/订阅模型**

​	订阅事件实现了一个事件与多个回调函数的关联

```js
let fs = require('fs')
let EventEmitter = require('events')
let eve = new EventEmitter()
let html = {}
eve.on('ready',function(key,value){
    html[key] = value;
    if(Object.keys(html).length ==2){
        console.log(html)
    }	
})

function render(){
    fs.readFile('template.txt','utf8',function(err,template){
        eve.emit('ready','template',template)
    })
    fs.readFile('data.txt','utf8',function(key,value){
        eve.emit('ready','data',data)
    })
}
render()

```

**哨兵变量**

```js
let fs = require('fs')
function after(times,callback){
	let result = {}
    return fucntion (key,value){
        result [key] = value
        if(Object.keys(result).length == times){
           		callback(result)
           }	
    }
}

let done = after(2,function(result){
	console.log(result)
})

function render(){
	fs.readFile('template.txt','utf8',function(err,template){
		done('template',template)
	})
	fs.readFile('data.txt','utf8',function(err,data){
		done('data',data)
	})
}
```

**Promise/Deferred 模式**

​	 promise中有很多问题 内部还是采用回调的方式 ，如果逻辑过多还是可能会导致 回调地狱

**生成器Generator/yield**

​	回调函数,时间监听,发布/订阅,Promise等解决异步方案,实际还是以回调函数作为基础,并没有从语法结构来改变异步写法

​	当你在执行一个函数的时候,你可以在某个点暂停函数的执行,并且做一些其他工作,然后再返回这个函数继续执行,甚至是携带一些新的值,然后继续执行

​	上面描述的场景正是`JavaScript`生成器函数所致力于解决的问题,当我们调用一个生成器函数的时候,它并不会立即执行,而是需要我们手动去执行迭代操作(next方法).也就是说你调用生成器函数,它会返回给你一个迭代器,迭代器会遍历每个中断点

​	`next`方法返回值`value`属性,是`Generator`函数向外输出数据;`next`方法还可以接受参数,这是向`Generator`函数体内输入数据

```js
#异步代码写法趋近于同步
function* main(){ // 通过 Ajax 操作获取数据
    var result = yield request("http://some.url");
    var res = JSON.parse(result);
    console.log(res.value);
}
function request(url){
    makeAjaxCall(url, function(res){
        it.next(res);
    })
}
var it = main();
console.log(it.next());
```



**生成器的使用**

```js
function* foo(){
	var index = 0
    while(index<2){
       yield index++ //暂停函数执行,并执行yield后的操作   
	}
}
var bar = foo() //返回的其实是一个迭代器
console.log(bar.next()) // {value:0,done:false}
console.log(bar.next()) // {value:1,done:false}
console.log(bar.next()) // {value:undefined,done:true}
```

**Co**

​	`Generator`函数把异步操作表示得很简洁,但是流程管理却不方便,需要额外手动添加运行时代码

​	通常为了省略额外的手动流程管理,会引入自动执行函数辅助运行,常用的自动流程管理`Thunk`函数模式和`Co`函数

**自动流程难点:**

​	如果生成器函数中的`yield`关键字后全部为同步操作,很容易递归判断返回值`done`是否为`true`运行至函数结束.

​	但更复杂的是异步操作,需要异步完成后执行迭代器`next(data)`方法,传递异步结果并恢复接下来的执行,但以何种方式在异步完成时执行`next()`,需要提前约定异步操作形式

​	`co`是一个为`Node.js`和游览器打造的基于生成器的流程控制工具,借助于`Promise`,你可以使用更加优雅的方式编写非阻塞代码

```js
let fs = require('fs');
function readFile(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function (err, data) {
      if (err)
        reject(err);
      else
        resolve(data);
    })
  })
}

function *read() {
  let template = yield readFile('./template.txt');
  let data = yield readFile('./data.txt');
  return template + '+' + data;
}

co(read).then(function (data) {
  console.log(data);
}, function (err) {
  console.log(err);
});
```

```js
function co(gen) {
  let it = gen();
  return new Promise(function (resolve, reject) {
    !function next(lastVal) {
      let {value, done} = it.next(lastVal);
      if (done) {
        resolve(value);
      } else {
        value.then(next, reason => reject(reason));
      }
    }();
  });
}

```

**Async/await**

​	使用`async`关键字,你可以轻松地打成之前使用生成器和函数所做的工作

**Async优点**

- 内置执行器
- 更好的语义
- 更广的适用性

```js
let fs = require('fs');
function readFile(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err)
        reject(err);
      else
        resolve(data);
    })
  })
}

async function read() {
  let template = await readFile('./template.txt');
  let data = await readFile('./data.txt');
  return template + '+' + data;
}
let result = read();
result.then(data=>console.log(data));
```

**async函数的实现**

​	`async`函数的实现,就是将`Generator`函数和自动执行器,包装在一个函数里

```js
async function read() {
  let template = await readFile('./template.txt');
  let data = await readFile('./data.txt');
  return template + '+' + data;
}

// 等同于
function read(){
  return co(function*() {
    let template = yield readFile('./template.txt');
    let data = yield readFile('./data.txt');
    return template + '+' + data;
  });
}
```

`await`后面的代码,相当于后面会把`await`下面的代码放到`then`中

```js
console.log(1);
async function async () {
    console.log(2);
    //  new Promise((resolve)=>resolve().then();
    // 默认新版本 await 后面的代码 相当于后面会把await下面的代码放到then中
    // 老的版本 会被解析出两个then
    await console.log(3)// Promise.resolve( console.log(3);).then()
    console.log(4)
}
setTimeout(() => {
	console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
	console.log(res)//7
})
async(); 
console.log(8);
```

题

```js
Promise.resolve().then(() => {
    console.log("then1");
    Promise.resolve().then(() => {
        console.log("then1-1");
       return Promise.resolve(); // x.then().then()
    }).then(() => {
        console.log("then1-2");
    });
})
.then(() => {
    console.log("then2");
})
.then(() => {
    console.log("then3");
})
.then(() => {
    console.log("then4");
})
.then(() => {
    console.log("then5");
})
```

1

```js
async function async1() {
    console.log('async1 start');
    await async2();
}

async function async2() {
    console.log('async2');
}

console.log('script start');
setTimeout(function () {
    console.log('setTimeout');
}, 0);
async1();
new Promise(function (resolve) {
    console.log('promise1');
    resolve();
}).then(function () {
    console.log('promise2');
});
```

