# Promise

## promise出现之前

### 回调地狱

> 回调函数,一个嵌套一个,业务代码通常是同步异步混合在一起,最后形成一个三角形的样子
>
> `缺点:`可阅读性差,意味着可维护性,可扩展性,可迭代性都会很差

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

1. 调用过早
2. 调用过晚或者未调用
3. 调用次数过少或过多

### Promise如何解决的

1. 调用过早
   - Promise将同步异步统一成异步模式,无法被同步观察到

2. 调用过晚

   - res()或rej()时会立即决议,通过then()注册的回调会在下一个异步时机依次被立即调用,并且相互之间无法影响或延误调用的时机 

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

   `没懂,需查阅资料`

   **P1的决议值用的另一个Promise P3,P3的决议值是'B'**

   **你永远都不应该依赖于不同Promise间回调的顺序和调度.**

   ### 回调未调用

   ​		没有任何东西能阻止Promise向你通知它的决议(如果它决议了了的话),成功和拒绝的回调都进行注册,谁在`前面`,执行谁

   ​		如果回调函数本身包含`JS错误`,这样会看不到你期望的结果,错误不会被吞掉

   ​		如果`永远不决议`,也promise也提供解决方案,`竞态机制`,防止永远挂住程序

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

   

   

 https://www.jianshu.com/p/8e0fb4c2bc44 