## 介绍 

`JavaScript`语言采纳JSC引擎的术语,我们把宿主发起的任务称为宏观任务,把`JavaScript`引擎发起的任务称为微观任务

`JavaScript`引擎等待宿主环境分配宏观任务,在操作系统中,通常等待的行为都是一个事件循环,所有在Node术语中,也会把这个部分称为事件循环

每次执行过程都是一个宏观任务,我们可以大概理解:宏观任务的队列就相当于事件循环

在宏观任务中,`JavaScript`的`Promise`还会乘车异步代码,`JavaScript`必须保证这些异步代码在一个宏观任务中完成,因此,每个宏观任务中又包含一个微观任务队列

​	`Promise`永远在队列尾部添加微观任务,`setTimeout`等宿主API,则会添加宏观任务

> https://juejin.im/post/5c9a43175188252d876e5903
>
> main Script 运行完成后,会有微任务和宏任务队列.
>
> `微任务先执行,之后是宏任务`

- main Script

  > JS第一次执行的任务;
  >
  > main Script中产生的微任务和宏任务,分别清空,这个时候是`先清空微任务队列,再清空宏任务队列`

- 宏任务

  - script，

  - setTimeout，

  - setImmediate，

  - MessageChannel

  - i/o脚本

  - ui

  - requestFrameAnimation

  - ajax

  - ...

  

- 微任务

  > `注意顺序 process.nextTick > Promise.then `
  >
  > process.nextTick([node api](https://link.juejin.im/?target=http%3A%2F%2Fnodejs.cn%2Fapi%2Fprocess.html%23process_process_nexttick_callback_args))
  >
  > Promise.then
  >
  > MutationObserver

## 总结

在处理一段evenloop执行顺序的时候：

- 第一步确认宏任务，微任务
  - 宏任务：script，setTimeout，setImmediate，promise中的executor
  - 微任务：promise.then，process.nextTick
- 第二步解析“拦路虎”，出现async/await不要慌，他们只在标记的函数中能够作威作福，出了这个函数还是跟着大部队的潮流。
- 第三步，根据Promise中then使用方式的不同做出不同的判断，是链式还是分别调用。
- 最后一步记住一些特别事件
  - 比如，`process.nextTick`优先级高于`Promise.then`

## promise

### 执行顺序

```js
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})

promise1
then11
promise2
then21		//21在 12 前面 是因为 代码是从上向下执行的
then12
then23
```

```js
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    return new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{		//这里Promise的第二个then相当于是挂在新Promise的最后一个then的返回值上。
    console.log("then12")
})

promise1
then11
promise2
then21
then23
then12


```

```js
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})
new Promise((resolve,reject)=>{
    console.log("promise3")
    resolve()
}).then(()=>{
    console.log("then31")
})
promise1
VM136:18 promise3
VM136:5 then11
VM136:7 promise2
VM136:21 then31
VM136:10 then21
VM136:15 then12
VM136:12 then23
```

```js
async/await仅仅影响的是函数内的执行，而不会影响到函数体外的执行顺序。也就是说async1()并不会阻塞后续程序的执行，await async2()相当于一个Promise
async function async1() {
    console.log("async1 start");
    await  async2();
    console.log("async1 end");
}

async  function async2() {
    console.log( 'async2');
}

console.log("script start");

setTimeout(function () {
    console.log("settimeout");
},0);

async1();

new Promise(function (resolve) {
    console.log("promise1");
    resolve();
}).then(function () {
    console.log("promise2");
});
console.log('script end'); 

console.log('script end'); 

VM223:11 script start
VM223:2 async1 start
VM223:8 async2
VM223:20 promise1
VM223:25 script end
VM223:4 async1 end
VM223:23 promise2
VM223:14 settimeout
```

### async await

```js
async本身是一个Promise，然后await肯定也跟着一个Promise，那么新建两个function，各自返回一个Promise。
async1()
async function async1() {
    console.log("async1 start");
    await  async2();
    console.log("async1 end");
}
async  function async2() {
    console.log( 'async2');
}
// 用于test的promise，看看await究竟在何时执行
new Promise(function (resolve) {
    console.log("promise1");
    resolve();
}).then(function () {
    console.log("promise2");
}).then(function () {
    console.log("promise3");
}).then(function () {
    console.log("promise4");
}).then(function () {
    console.log("promise5");
});

VM245:3 async1 start
VM245:8 async2
VM245:12 promise1
VM245:5 async1 end
VM245:15 promise2
VM245:17 promise3
VM245:19 promise4
VM245:21 promise5
```

