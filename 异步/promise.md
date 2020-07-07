# Promise

## Promise

### 回调地狱

> 回调函数,一个嵌套一个,业务代码通常是同步异步混合在一起,最后形成一个三角形的样子
>
> `缺点:`可阅读性差,意味着`可维护性`,`可扩展性`,`可迭代性`都会很差

```js
    function a(){
        function b() {
           function c() {
              function d() {
                 function e() {
                 
                 } 
                 e()
              } 
              d()
           } 
           c()
        }
        b()
    }
    a()
```

### 信任问题

把一个回调函数交给别人使用可能会出现以下问题:

1. 调用过早  `可能同步, 可能异步`
2. 调用过晚或者未调用  
3. 调用次数过少或过多
4. 未能传递所需的环境和参数
5. 吞掉可能出现的错误和异常

### Promise如何解决的

1. 调用过早
   
- Promise将同步异步统一成异步模式,无法被同步观察到,then的回调总是异步回调
  
2. 调用过晚

   - 调用res()或rej()时会立即决议,通过then()注册的回调会在下一个异步时机依次被立即调用,并且`相互`之间`无法影响`或`延误`调用的时机 

   ```js
   //5 无法打断3
   let p =new Promise((res,rej)=>{
       console.log(1);
       res()
   })
   p.then(()=>{
       p.then(()=>{
           console.log(5);
       })
       console.log(3);
   })
   p.then(()=>{
       console.log(4);
   })
   console.log(2);
   1
   2
   3
   4
   5
   ```

   **注意:**

   ```js
   var p3 = new Promise( function(resolve, reject){
       resolve( "B" );
   });
   var p1 = new Promise(function(resolve, reject){
       resolve( p3 );
   })
   p2 = new Promise(function(resolve, reject){
       resolve( "A" );
   })
   
   p1.then( function(v){
       console.log( v );
   })
   p2.then( function(v){
       console.log( v );
   })
   
   // A B , 而不是像你认为的 B A
   ```

   P1的决议值用的另一个Promise,立即resolve的Promise会在本轮`事件循环`的结束时调用

   和promise.resolve()行为一致

   `永远都不应该依赖于不同Promise间回调的顺序和调度`

   
```js
   var p3 = new Promise( function(resolve, reject){
    resolve( "B" );
   });
var p1 = new Promise(function(resolve, reject){
       resolve( p3 );
})
   p2 = new Promise(function(resolve, reject){
       resolve( "A" );
   })

   setTimeout(()=>{console.log(123)})
   p1.then( function(v){
       console.log( v );
   })
   p2.then( function(v){
       console.log( v );
   })
   //A
   //B
   //123
```



```js
   setTimeout(function () {
       console.log(3);
   }, 0);
   Promise.resolve().then(function () {
       console.log(2);
});
   console.log(1);
//1
   //2
   //3
```


   3. 回调未调用

   		没有任何东西能阻止Promise向你通知它的决议(如果它决议了了的话),成功和拒绝的回调都进行注册,谁在`前面`,执行谁

   		如果回调函数本身包含`JS错误`,这样会看不到你期望的结果,错误不会被吞掉

   		如果`永远不决议`,promise也提供解决方案,`竞态机制`,防止`永远挂住程序`

   ```js
   Promise.race([
       foo(),
       timeoutPromise(3000)])
       .then(()=>{
           //foo 完成
       },(err)=>{
           //foo()被拒绝,或者超时
           //查看err了解是哪种情况
       })
   
   //用于超时Promise工具
   function timeoutPromise(delay) {
       return new Promise((res,rej)=>{
           setTimeout(()=>{
               rej('Timeout')
           },delay)
       })
   }
   ```

   4. 调用次数过少或过多

   ​		正确的调用次数应该是`1`,过少就是没有被调用过

   ​		Promise在创建的时候调用`res(`)或者`rej()`,或者`两个`都调用,Promise只接受第一次的决议,后面的都会被忽略

   ​		一旦状态改变,任何时候都能得到这个结果,任何通过then()注册的回调只会被调用一次,如果把同一个回调注册了不止一次,调用的次数就会和注册次数相同,响应函数只会被调用一次

   5. 未能传递参数/环境

   ​		决议值会向下传递给观察回调,没有任何决议值,返回`undefined`

   ​		JS的函数的作用域在函数定义的时候决定,传递函数不会影响函数的环境(`作用域`)

   6. 吞掉错误或异常

   ​		Promise在任意流程中出现JS异常错误,这个异常会被捕获,并且会使这个Promise被决议`rej()`

   ```js
   #定义阶段
   var p = new Promise((res,rej)=>{
   	aa()
   	rej(1)
   
   })
   console.log(2)
   p.then(()=>{},(rej)=>{
   console.log(rej)
   })
   //2
   //ReferenceError: aa is not defined
   
   #then 回调阶段
   var p = new Promise((res,rej)=>{
   	res(1)
   })
   var p1 = p.then((res)=>{
   	console.log(res)
   	aa()
   })
   var p2 = p1.then(()=>{},(rej)=>{
   	console.log(rej)
   })
   //1
   //aa is not defined
   ```

   ### 是可信任的Promise么

   ​		 Promise.resolve()  ,将现有对象转为Promise对象

   1. 参数是Promise实例,`Promise.resolve()`将不做任何修改,原封不动返回这个实例,需要注意的是, 立即`resolve`的` Promise `对象，是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时 
   
   2. 参数是`thenable`对象(`拥有then方法的对象`),Promise.resolve()会转为Promise对象,会`立即`执行`thenable`对象的then方法
   
      ```js
      let thenable= {
      	then:(res,rej)=>{
        	  res(123)
      	}
      }
      let p = Promise.resolve(thenable)
      
      p.then((res)=>{
      	console.log(res)
      })
      //123
      ```
   
   3. 参数为其他类型`立即值`,如`number`,`string`,则`Promise.resolve()`会返回新的Promise对象,状态为`res`
   
      ```js
      let p = Promise.resolve(123)
      
      p.then((res)=>{
      	console.log(res)  //123
      },(rej)=>{
      	console.log(rej)
      })
      ```

### 与try/catch区别

1. try/catch`无法`捕获异步的`异常`
2. new Promise代码出错,会被认为是一个拒绝的决议,并且立即执行,向回调中传递异常信息,Promise还可以通过catch回调捕获回调中的异常

### 控制反转再反转

- 控制反转

  回调成功后的操作写在回调函数内,但是回调函数的调用由第三方控制

- Promise 控制反转再反转

  回调只负责通知成功或失败,回调之后的业务操作放在then里面,控制权又回到自己手中



