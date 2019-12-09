## babel

```js
babel-loader   //编译JS文件
@babel/core    //babel 基础包

#babel 
@babel/runtime    //生产环境依赖   
@babel/plugin-transform-runtime   //可以避免编译构建时重复的 helper 代码 
```

### @babel/preset-env

 https://juejin.im/post/5ce693b45188252db303ff23 

@babel/preset-env是作为babel-preset-es2015的替代品出现的，主要的作用是用来转换那些已经被正式纳入TC39中的语法。所以它无法对那些还在提案中的语法进行处理，对于处在stage中的语法，需要安装对应的plugin进行处理。

除了语法转换，@babel/preset-env另一个重要的功能是对polyfill的处理。新加入标准库的，可能是一些语法特性，比如箭头函数等，还有可能是一些新的API，比如promise、set、inclues等。

对于语法，babel可以通过生成静态语法树，去做一些转换，生成对应的ES5的代码。

但是对于新的API，需要浏览器去原生支持，或者使用大量的代码去进行API的模拟。@babel/polyfill就是API的垫片，通过引入这些垫片，使得低版本的浏览器能模拟实现那些新的API。

而今天的主角core-js就是@babel/polyfill的核心依赖，它现在已经发布了3.0的版本，而且@babel/preset-env在7.4.0的版本已经支持这个最新的版本。大版本的升级，会带来一些破坏性，但是相应的也会带来很多优势。

- core-js
-  polyfill会额外引入一些函数  配合  @babel/transform-runtime   使用