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

1. Promise将同步异步统一成异步模式,无法被同步观察到
2. res()时会立即执行

 https://www.jianshu.com/p/8e0fb4c2bc44 