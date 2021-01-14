

# babel

**@babel/core**

**baberl-loader **

​	使用`babel`和`webpack`转译`Javascript`文件

### **babel/prset-env **

​	`@babel/preset-env`是作为`babel-preset-es2015`的替代品出现的，主要的作用是用来转换那些已经被正式纳入TC39中的语法。所以它无法对那些还在提案中的语法进行处理，对于处在stage中的语法，需要安装对应的plugin进行处理。

除了语法转换，`@babel/preset-env`另一个重要的功能是对polyfill的处理。新加入标准库的，可能是一些语法特性，比如箭头函数等，还有可能是一些新的API，比如promise、set、inclues等。

对于语法，babel可以通过生成静态语法树，去做一些转换，生成对应的ES5的代码。

但是对于新的API，需要浏览器去原生支持，或者使用大量的代码去进行API的模拟。`@babel/polyfill`就是API的垫片，通过引入这些垫片，使得低版本的浏览器能模拟实现那些新的API。

**useBuiltIns**

- false

  > 不对`polyfill`做操作,如果在js代码第一行`import '@babel/polyfill'`，或在webpack的入口entry中写入模块`@babel/polyfill`，会将@babel/polyfill整个包全部导入； 

- entry  

  >在js代码第一行`import '@babel/polyfill'`，或在webpack的入口entry中写入模块`@babel/polyfill`，会根据browserslist导入；

- usage  

  > 会根据配置游览器兼容,以及代码中用到的API来进行polyfill,实现了按需添加

**usage示例**

webpack.config.js

```js
#安装依赖
yarn add babel-loader @babel/core @babel/preset-env -D
yarn add core-js regenerator-runtime
```



```js
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [["@babel/preset-env",{
+              useBuiltIns: 'usage',
+              corejs: {
                version: 3,
                proposals: true
            },
              targets: "> 0.25%, not dead",
            }], '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        },
      },
```

index.js

```js
console.log(Array.from([]));
```

**babel-polyfill :**

​	`babel`转化新的`JavaScript`语法(箭头函数),不转化`API`(Array.from),需要使用`babael-polyfill`来实现.

​	`babel-polyfill`它是通过向全局对象和内置对象的`prototype`上添加方法来实现的,缺点就是造成全局空间污染

**使用:**

​	 `@babel/polyfill` 不必再安装，转而需要依靠`core-js` 和 `regenerator-runtime`

```js
#安装依赖
yarn add babel-loader @babel/core @babel/preset-env -D
yarn add core-js regenerator-runtime
```



```js
            presets: [["@babel/preset-env",{
+              useBuiltIns: 'usage',
+              corejs: {
                version: 3,
                proposals: true
            },
              targets: "> 0.25%, not dead",
            }], '@babel/preset-react'],
```



**babel/runtime :**

​	将es6编译成es5去执行,不管游览器是否支持es6,只要是es6的语法,它都会进行转码成es5,会生成很多冗余代码.

​	不会污染全局对象和内置对象的原型,它解决了`babel-polyfill`中污染全局对象问题.

- 缺点:
  - 需要手动引入
  - 多处引用同一方法没有进行公共方法抽离

```js
cnpm i babel-runtime -D

import Promise from 'babel-runtime/core-js/promise';
const p = new Promise(()=> {

});
console.log(p);
```

**babel-plugin-transform-runtime**

​	解决`babel/runtime`手动引入`import`和公共方法抽离

​	启用插件,`Babel`会是使用`babel-runtime`下的工具函数

**缺点:** 不支持`browserslist `

```js
#安装依赖
yarn add babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
yarn add @babel/runtime-corejs3
```



```js
 #corejs3

{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": {
          "version": 3,
          "proposals": true
        },
        "useESModules": true
      }
    ]
  ]
}
```



**最佳实践:**

- 类库使用`@babel/plugin-transform-runtime `
- 项目使用`@babel/polyfill`

**参考**



 https://juejin.im/post/5ce693b45188252db303ff23 

https://segmentfault.com/a/1190000020237779

