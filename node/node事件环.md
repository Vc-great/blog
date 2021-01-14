

​	每个阶段都对应一个时间队列,当eventloop执行到某个阶段时,会将当前阶段对应的队列一次执行.当该队列已用尽或达到回调限制,事件循环将移到下一阶段

​	`process.nextTick()`从技术上讲不是事件循环的一部分.每次执行栈运行完成后会立即调用`nextTickQueue`

```js
    本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
   ┌───────────────────────────┐
┌─>│           timers          │ 
│  └─────────────┬─────────────┘
|   执行延迟到下一个循环迭代的 I/O 回调。
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
|   仅系统内部使用。
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      
|  检索新的I/O事件;执行与 I/O相关的回调  ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  setImmediate() 回调函数在这里执行。  └───────────────┘
│  ┌─────────────┴─────────────┐      
│  │           check           │
│  └─────────────┬─────────────┘
|  一些关闭的回调函数
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

​	`timer`和`setImmediate`调用时机不同,`setImmediate`用的非常少

​	`poll`里面有很多回调`node`中有执行的最大个数,超过最大个数会被延迟到下一轮循环执行

**setImmediate和setTimeout**

​	`setImmediate()` 和 `setTimeout()` 很类似，但是基于被调用的时机，他们也有不同表现。	

​	`setImmediate`设计为一旦在当前轮询阶段完成,就执行脚本

​	`setTimeout`在最小阈值(ms单位)过后运行脚本

​	计时器将受进程性能的约束,如运行一下不在I/O周期(主模块) 内的脚本,则执行两个计时器的顺序市非确定性的,因为它受进程性能的约束

```js
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```



```js
$ node timeout_vs_immediate.js
timeout
immediate

$ node timeout_vs_immediate.js
immediate
timeout
```

​	如果你把这两个函数放入一个I/O循环内调用,`setImmediate`总是被优先调用

```js
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```js
$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout
```

​	使用`setImmediate`相对于`setTimeout`的主要优势是,如果`setImmediate`是在I/O周期内被调用,那它将会在其中任何的定时器之前执行,跟这里存在多少个定时器无关

**参考**

https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/

