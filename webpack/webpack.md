# webpack 4

>  webpack4不再支持Node 4，由于使用了JavaScript新语法，Webpack的创始人之一，Tobias，建议用户使用`Node版本 >= 8.94`，以便使用最优性能。

## 前言

### 什么是webpack

`JS打包工具` 核心功能是解决模块之间的依赖,把各个模块按照特定的规则和顺序组织在一起,最终合并为一个或多个JS文件

### 为什么需要webpack

- 模块化思想

  按照特定的功能进行拆分为多个代码段,每个代码段实现一个特定的目的.你可以对其进行独立的设计,开发和测试,最后通过接口将它们组合在一起

- 为什么用模块化思想

  - 之前
    1. 页面达到一定体量后,很难清晰的指明依赖关系
    2. 每个script都会向服务器请求资源,HTT2之前连接成本很高,过多请求会拖慢网页渲染速度
    3. 每个script标签中,顶级作用域就是全局作用域,容易造成全局作用域污染
  - 之后

  1. 导入导出清晰看到模块间的依赖关系
  2. 借助工具进行打包,在页面只需要加载合并后的资源,减少网络开销
  3. 多个模块之间作用域是隔离的,彼此不会有命名冲突

- 解决方案

  - AMD   

    1.   `RequireJS` 在推广过程中对模块定义的规范化产出 

  - CMD

    1.  `SeaJS` 在推广过程中对模块定义的规范化产出 

    2. 与AMD类似,只不是在模块定义的方式和模块`加载时机`上不同

  - AMD和CMD

    > [前端模块化,AMD与CMD的区别](https://www.cnblogs.com/futai/p/5258349.html)

    - 解决问题相同
      1. 多个js文件可能有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器
      2. js加载的时候浏览器会停止页面渲染，加载文件越多，页面失去响应时间越长

    - 对依赖的`处理时机`不同
      1. AMD推崇依赖前置，在定义模块的时候就要声明其依赖的模块
      2. CMD推崇就近依赖，只有在用到某个模块的时候再去require

  - CommonJS   

    >  服务器端模块规范.初产生于服务端，并引申到客户端 ,一个单独的文件就是一个模块,使用`require()` 语句`动态(运行阶段)加载`

    - 解决问题

      1. 变量命名冲突
      2. 文件依赖复杂度增高
      3. 页面载入过多依赖傻傻分不清，不利于维护

    - ```
      变量命名冲突
      文件依赖复杂度增高
      页面载入过多依赖傻傻分不清，不利于维护
      ```

      

  - ES6 Module 
    
    1. 优点:
    
       - 静态加载是提高效率
       - 导入模块是值的`映射`
    
       - 不再需要UMD模块格式了，将来服务器和浏览器都会支持 ES6 模块格式。目前，通过各种工具库，其实已经做到了这一点
    
       - 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者navigator对象的属性
    
       - 不再需要对象作为命名空间（比如Math对象），未来这些功能可以通过模块提供

  - commonJS 和  ES6

    1. commonJS是`动态加载(运行阶段)`,ES6是`静态加载(编译阶段)`
    2. commonJS是值的`拷贝`,ES6是值的`映射`
    3. ES 6 Module 更好的支持`循环依赖`

  - UMD

    严格讲UMD不是模块标准,它是一组模块(`AMD`和`CommonJS`

    )形式的集合

    `目标`是一个模块能运行在各种环境下

    先判断`AMD`环境, `AMD`模块`无法`使用`CommonJS`和`ES6 Module`

    场景:

    ​		webpack同时支持AMD和CommonJS,当UMD发现当前有AMD环境时会使用AMD方式导出,这会使得模块导入出错,可以更改UMD模块的`判断顺序`,使其以CommonJS的形式导出

- 打包工具

  **为什么用工具:**使用模块化的同时也能正常运行在游览器中

  **做了什么:**

  1. 存在依赖关系的模块按照特定的规则合并为单个JS文件,一次全部加载进页面
  2. 在页面初始化时候加载一个入口模块,其他模块异步的进行加载

  #### 补充知识

  - require
    - 第一次被加载.这是会首先执行该模块,然后导出内容
    - require的模块曾被加载过.这时该模块的代码不会再次执行,而是`直接导出上次执行后得到的结果`

  - CommonJS与ES 6 Module区别

    - commonJS是`动态`,模块依赖关系的建立发生在代码运行阶段
    - ES 6 Module 是`静态`,模块依赖关系的建立发生在代码编译阶段
    - commonJS获取的是导出值的`拷贝`,ES 6 Module则是值的`动态映射`,并且这个映射是`只读的`
    - ES 6 Module`优势`
      1. `死代码检测和排除.`通过静态分析可以在打包时去掉未曾使用过的模块,减小打包资源体积
      2. `模块类型变量检查.`JS属于动态类型语言,不会在代码执行前进行类型检查.静态模块结构有助于确保模块之间传递的值或接口类型是正确的
      3. `编译器优化.`在CommonJS等动态模块系统中,无论采用哪种方式,本质上导入的都是一个对象,而`ES6 Module`支持直接导入变量,减少了`引用层级`,程序效率`更高`

  - 循环依赖

    > A模块依赖于B,同时B模块又依赖A

    1. commonJS 由于是值的拷贝,不会动态映射,循环引时,不会获取到正确的结果
    2. ES6 Module 动态映射会在依赖改变后跟随更新,只是需要开发者保证导入的值被使用时已经设置好正确导出的值

    ```js
    #A
    const B= require('./B.js')
    console.log('导出',B);
    module.exports = 'A.js'
    #B
    const A = require('./A.js')
    console.log('导出A',A);
    module.exports = 'B.js'
    #index
    require('./A.js')
    
    导出A {}
    导出 B.js
    //执行A.js---->加载B---->导入A,但是A没有加载完默认导出{}---->在继续执行A---->打印B
    
    ```

  - AMD 

    - 与CommonJS和ES6 Module 最大的区别在于它加载模块的方式是异步的

    - AMD异步加载的方式并不如同步显得清晰,并且容易造成回调地狱

    - 目前`应用的越来越少`

  - UMD

    - 通用模块标准,一个模块能运行在各种环境下
    - UMD根据当前全局对象中的值判断目前处于哪种模块环境
    - `注意:`webpack中,由于它同时支持AMD及CommonJS,也许工程所有模块都是commonJS,而UMD标准却发现当前有AMD环境,并使用了AMD方式导出,这会使得模块导入时出错.当需要这样做时,我们可以更改UMD模块中判断的顺序,使其已CommonJS的形式导出

    

### 为什么选择weback

>  Webpack parcel Rollup

- 优势
  1. 默认支持多种模块标准,AMD 、 CommonJS 、 ES6,其他工具大多只能支持一到两种
  2. `懒加载:`有完备的代码分割解决方案,分割打包后资源,首屏只加载必要的部分,不太重要功能放到后面动态的加载
  3. 可以处理各种类型的资源,样式 、模版 、图片等
  4. 周边生态好,大部分需求都有解决方案

## 管道符号

webpack默认入口文件为 webpack.config.js

手动设置需要在package.js中script 对应命令增加 `--config`设置入口文件

```js
  "scripts": {
    "dev": " webpack-dev-server --config build/webpack.dev.conf.js",
  }
```



## entry chunk bundle

### chunk

​		代码块,webpack包装了一层依赖树,形成了chunk

### bundle

​		由chunk得到打包产物叫bundle

 ![entry-chunk-bundle.png](https://github.com/Vc-great/blog/blob/master/webpack/webpack.assets/entry-chunk-bundle.png?raw=true) 

## context

资源入口`路径前缀`,在配置时要求必须使用绝对路径,只能为字符串

`目的:`让entry的编写更加简洁,尤其在多入口的情况下

context`可以省略`,默认值为当前工程的`根目录`

```js
入口为<工程根路径>/src/scripts/index.js
两种配置效果相同
#第一种
module.exports = {
	context:path.join(__dirname,'./src')
	entry:'./scripts/index.js'
}
#第二种
module.exports = {
	context:path.join(__dirname,'./src/scripts')
	entry:'./index.js'
}

```



## 入口 (Entry)

> 默认值为  `./src/index.js`

### 类型

- 字符串

  ```js
  #单个入口
  entry: './app.js'
  #等价于 
  entry: {
      main: './app.js'
  }
  
  ```

- 数组

   数组里所有文件打包成一个js文件

  打包时webpack会将数组中的最后一个元素作为实际的入口路径

  ```js
   app: ["babel-polyfill", "./src/main.js"]
  ```

- 对象

   把对象里的文件分别打包成多个文件

  常见情景:`多页面应用`

  entry的`key`对应output.filename的`[name]`变量

  ```js
  
  entry: {
      chunk name 为app  路径为'./src/main.js'
      'app': './src/main.js'
  },
  output: {
      filename: '[name].js'
  }
  ```

  ### 知识补充

  #### chunk name

  ​	在使用字符串和数组定义单入口时,并没有办法更改chunk name,只能为默认值'main'

  [令人困惑的 webpack 之 entry](https://juejin.im/entry/58a54d0861ff4b0069875b50)

## 出口 (output)

> 　 默认值为 `./dist/main.js` 

### 单入口

单入口文件可以将出口的`filename`写死

### 　多入口

多入口或配置创建多个`chunk`,需要确保每个文件具有唯一的名称`[name]`



```js
module.exports = {
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
};

// 写入到硬盘：./dist/app.js, ./dist/search.js
```

1. `publicPath:`JS文件内部引用其他文件的路径

### filname

`filname`中的`[name]`会被`替换`为`chunk name`

| 变量名称    | 功能描述                              |
| ----------- | ------------------------------------- |
| [hash]      | 指代webpack此次打包所有资源生成的hash |
| [chunkhash] | 指代当前chunk内容的hash               |
| [id]        | 指代当前chunk的id                     |

- 作用

  - 区分不同的chunk
  - `控制客户端缓存:`当chunk内容改变时,客厅同事引起资源文件名的更改,从而使用用户在下一次请求资源文件时会`立即`下载`新的`版本而不会使用本地缓存

- 注意:

  - 更新缓存一版只用在生产环境的配置下,在开发环境中可以不必
  - 

  ```js
  #开发环境
  filname:[name].js
  #生产环境 为了用户访问的是最新的文件增加chunkhash
  output:{
  filname:'[name]@[chunkhash].js'
  }
  ```


### chunkFilename

用来指定异步chunk的文件名,命名规则与filename基本一致

```js
output:{
filname:'[name]@[chunkhash].js'
chunkFilename:'[name]@[chunkhash].js'
}
```

### hash 、chunkhash 、 contenthash 

- hash : 编译的时候生成的hash有文件修改,就会编译一下创建新的hash,每当代码发送变化时响应的hash也会变化

- chunkhash :  根据chunk生成的hash值,每个chunk单独计算依次hash,不同的`entry`会生成不同的`chunkhash`,JS一般采用`chunkhash`

- contenthash :   contenthash可以解决的是，js模块修改后，css哈希值变动的问题。

  ( contenthash并不能解决moduleId自增的问题 ) 

### 持久化缓存方案        `需实践`

[[基于webpack4[.3+\]构建可预测的持久化缓存方案]](https://github.com/jiangjiu/blog-md/issues/49) 

[基于 webpack 的持久化缓存方案]( https://github.com/pigcan/blog/issues/9 )

### path

指定资源的`输出位置`,要求值必须为觉得路径

output.path`默认值为dist目录`

### publicPath

指定资源的`请求位置`

> `请求位置:`由JS或CSS所请求的间接资源路径.页面资源分为`两种`,第一种由`HTML页面直接请求的`,比如通过`script标签加载的JS`,另一种由`JS或者CSS请求的`,如`异步加载的JS,从CSS请求的图片字体`等

publicPath共有`三种`形式

1. HTML相关   (**相对路径**)
   以当前页面HTML所在的**路径**`加上`**相对路径**,构成实际请求的URL

2. Host相关   (**相对路径**)

   若publicPath的值以`'/'开始`,则代表此时publicPath是`以当前页面的hosts name为基础路径`

3. CDN相关  (**绝对路径**)

```js
当前地址 abc.com/app/index.html
异步加载1.js
#HTML  app+js   app/js
publucPath:''   //     abc.com/app/1.js
publucPath:'./js'  //      abc.com/app/js/1.js
publucPath:'../assets/'   //     abc.com/assets/1.js
#Host    abc.com/js
publucPath:'/'   //     abc.com/1.js
publucPath:'/js/'  //      abc.com/js/1.js
publucPath:'/dist/'   //     abc.com/dist/1.js
#CDN   cdn.com/1.js
publucPath:'http://cdn.com'   //    http://cdn.com/1.js
publucPath:'https:cdn.com'  //      https:cdn.com/1.js
publucPath:'//cdn.com/assets'   //     //cdn.com/assets/1.js
```

`webpack-dev-server`的配置中也有一个`publicPath`,值得注意的是,这个publicPath与`webpack`的配置项含义`不同`,它的作用是`指定`webpack-dev-server的`静态资源服务路径`

建议`webpack-dev-server`的publicPath与webpack中的output.path`保持一致`,这样在任何环境下资源的输出的目录都是相同的

## 文件指纹hash 、chunkhash 、 contenthash 

- hash : 编译的时候生成的hash有文件修改,就会编译一下创建新的hash,每当代码发送变化时响应的hash也会变化

- chunkhash :  根据chunk生成的hash值,每个chunk单独计算依次hash,不同的`entry`会生成不同的`chunkhash`,JS一般采用`chunkhash`

- contenthash :   contenthash可以解决的是，页面中js模块修改后，css哈希值变动的问题。CSS一般采用`contenthash`

  ( contenthash并不能解决moduleId自增的问题 ) 

图片:使用`hash`

![img-hash](D:\个人\Blog\webpack\webpack.assets\img-hash.png)

## Moudule

模块,最多用的是rules配置项,匹配对应的后缀,按照规则进行转换



### 插件

loader只能用于转换模块,插件可以处理`整个编译生命周期`中各类任务

## loader

​    webpack自身只理解Javascript,`loader`可以把其余类型文件转换为webpack能识别的内容

​	每个loader的本质都是一个函数

​	在`import`或`加载`模块时预处理文件

1. `test:`用于标识出需要被loader转换的文件 (`正则表达式或正则表达式的数组`)

   >  确保转译尽可能少的文件。你可能使用 `/\.m?js$/` 来匹配，这样也许会去转译 `node_modules` 目录或者其他不需要的源代码 
   >
   >  你也可以通过使用 `cacheDirectory` 选项，将 babel-loader 提速至少两倍。这会将转译的结果缓存到文件系统中

2. `use:`进行转换时,应该使用哪个loader  (数组)  `从左向右`

3. `options:`配置项

4. `exclude`和`include`同时存在,`exclude`的优先级`更高`

   ```js
   #排除node_modules中除了foo和bar以外的所有模块
   rules :[
   	{
   	test:/\.css$/,
   	use:['style-loader','css-loader'],
   	//排除node_modules中除了foo和bar以外的所有模块
   	excluede:/node_modules\/(?!(foo|bar)\/).*/
       }
   ]
   #仅对src生效 但仍然可以通过exclude排除其中的src/lib目录
   rules:[
       {
           test:'\.css$',
           use:['style-loader','css-loader'],
           excluede:/src\/lib/,
           inclue:/src/
    }
   ]
   ```

5. `resource和issuer:`更加精确的确定模块规则的作用范围

6. `enforce:`用来指定一个loader种类,只接收`pre`或`post`两种字符串类型的值

   > **目的:**使模块规则更加清晰,可读性更强
   >
   >   loader执行顺序分为:`pre` `inline`  `normal`  `post`
   >
   > `pre`将在所有正常loader之前执行 如 eslint-loaeder 确保代码没有被其他loader修改过
   >
   > `post`将在所有loader之后执行 
   >
   > 直接定义的都属于 `normal`
   >
   > `inline`官方不推荐使用
   >
   > 

### 特点

1. 链式传递,解析`从左到右`
2. loader可以是`同步`,也可以时`异步`

3. loader能够产生额外的任意文件

### 样式

- [`style-loader`](https://webpack.docschina.org/loaders/style-loader) 将模块的导出作为样式添加到 DOM 中
- [`css-loader`](https://webpack.docschina.org/loaders/css-loader) 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
- [`less-loader`](https://webpack.docschina.org/loaders/less-loader) 加载和转译 LESS 文件
- [`sass-loader`](https://webpack.docschina.org/loaders/sass-loader) 加载和转译 SASS/SCSS 文件
- [`postcss-loader`](https://webpack.docschina.org/loaders/postcss-loader) 使用 [PostCSS](http://postcss.org/) 加载和转译 CSS/SSS 文件

​					(`postcss`支持变量和混入（mixin），增加浏览器相关的声明前缀，或是把使用将来的 CSS 规范的样式规则转译（transpile）成当前的 CSS 规范支持的格式) 

- [`vue-loader`](https://github.com/vuejs/vue-loader) 加载和转译 [Vue 组件](https://vuejs.org/v2/guide/components.html) 
- `file-loader`打包文件类型的资源,并返回其`publicPath`
-  `url-loader:`与`file-loader`唯一不同在于用户可以设置一个文件大小的阈值(`limit`),当大于该阈值时与`file-loader`一样返回`publicPath`而小于该阈值时则返回文件`base64`形式编码,内联进`html`中,减少网络请求

## 常用loader

![often-loader](D:\个人\Blog\webpack\webpack.assets\often-loader.png)

### babel-loader

- `babel-loader` 使babel与webpack协同工作的模块
- `@babel/core` babel编译器的核心模块
- `@babel/prest-env`Babel官方推荐的预置器,可根据用户设置的`目标环境`自动`添加`所需的`插件`和`补丁`来编译`ES6+`代码

​    babel-loader会将所有JS文件都进行编译,所以需要在exclude中添加`node_modules`,否则会令babel-loader编译其中的所有模块,会严重`拖慢打包速度`,并且有可能`修改第三方模块原有的行为`

​    `cacheDirectory`启用缓存机制,在重复打包没有改变过的的模块时`防止二次编译`,还可以加快`打包速度`.可以接收`字符串类型的路径`作为缓存路径,也可以时`true`,此时的缓存路径为`node_modules/.cache/babel-loader`

​    `@babel/presr-env`将ES6 Module 转化为CommonJS的形式,这会导致webpack的TRee-shaking失效.将@babel/prest-env的modules配置项设置为false会禁用模块语句的转化并且将es Moudle的语法交给webpack本身处理

​		babel-loader支持`.babelrc`文件读取到Babel配置,可以将`presets`和`plugins`从webpack配置文件`提取`出来,也能达到`相同的效果`

### sass-loader

​		`Sass`两种语法,现在,现在使用更多的是`SCSS`,所以在安装和配置loader的时都是sass-loader,而实际的文件后缀是`.scss`

​		`sass-loader`就是将scss编译为css,`sass-loader`相当于核心库与webpack的连接器(类似babel-loader),`node-sass`是核心库用来编译scss

​		游览器`调试源码`需要分别在sass-loader和css-loader单独添加`source map`的配置项

```js
module:{
	rules:[
		test:/\/scss/,
		use:[
			'style-loader',
			{
				loader:'css-loader',
				options:{
					sourceMap:true
				}
			},
			{
				loader:'sass-loader',
				options:{
					sourceMap:true
				}
			}
		]
		
	]
}
```







## 插件  (plugins)

用于接收一个数组插件,我们可以使用Webpack内部提供的一些插件,也可以加载外部插件.Webpack为插件提供了各种API,使其可以在打包的各个环节中添加一些额外任务



### 插件

loader只能用于转换模块,插件可以处理`整个编译生命周期`中各类任务

### 常用插件

![ofen-pubins](D:\个人\Blog\webpack\webpack.assets\ofen-pubins.png)

> 主要是`JS`和`CSS`,包含`提取`,`压缩`,`去除无用代码`
>
> html
>
> - JS插入html中: html-webpack-plugin  `minify设置压缩参数`
>
> CSS
>
> - 提取: mini-css-extract-plugiin 
> - 压缩: optimize-css-assets-webpack-plugin  `用于优化\最小化CSS的CSS处理器，默认为[cssnano]` 
> - 去除未使用的选择器 : purifycss-webpack
>
> JS
>
> - 提取: 内置  entry
> - 压缩: 内置  terser-webpack-plugin
> - tree-shaking  : 内置 terser-webpack-plugin

#### CSS

> 提示
>
> 请只在生产环境下使用 CSS 提取，这将便于你在开发环境下进行热重载。

 设置`optimization.minimizer`会覆盖webpack提供的默认设置，确保还指定JS压缩器： 

```js
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
}

```



- extract-text-webpack-plugin
  专门用于提取样式到CSS文件的,将样式存在css文件中而不是style标签中,`利于客户端进行缓存`

- mini-css-extract-plugiin

  `extract-text-webpack-plugin`升级版,Webpack4启用,支持`按需加载`
  
   需要注意的是 `MiniCssExtractPlugin.loader` 和 `style-loader` 由于某种原因不能共存。 

#### extract 和 mini区别

1. `优点:` 

- 异步加载
-  不重复编译，性能更好 
- loader规则设置的形式不同,并且` mini-css-extract-plugiin`支持配置`publicPath`,用来指定异步CSS的加载路径
- 在`plugins`设置中,除了指定同步加载的CSS资源名(`filename`),还要指定异步加载CSS资源名(`chunkFilename`)
- 不需要设置`fallback`

2. `缺点:`
   - `不支持CSS热更新,开发环境引入`css-hot-loader`以便支持css热更新

#### 压缩CSS和JS

​		weebpack4 内置CSS压缩和JS压缩

 虽然webpack 5可能内置了CSS最小化器，但是对于webpack 4，您需要自带。要缩小输出，请使用诸如[optimize-css-assets-webpack-plugin之类的插件](https://github.com/NMFR/optimize-css-assets-webpack-plugin)。设置`optimization.minimizer`会覆盖webpack提供的默认设置，因此请确保还指定JS最小化器： 

```

```



#### SplitChunks

```js
#默认配置
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', //从哪些chunks里面抽取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks
      minSize: 30000, //抽取出来的文件在压缩前的最小大小
      maxSize: 0,  //抽取出来的文件在压缩前的最大大小,默认为 0，表示不限制最大大小
      minChunks: 1,  //被引用次数
      maxAsyncRequests: 5,  //最大的按需(异步)加载次数
      maxInitialRequests: 3,  //最大的初始化加载次数
      automaticNameDelimiter: '~',  //抽取出来的文件的自动生成名字的分割符
      name: true,  //抽取出来文件的名字，默认为 true，表示自动生成文件名
# cacheGroups 缓存策略   关键配置
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10  //权重
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

****

chunks

​		有三个可选值,

- `async(默认):` 只提取异chunk
- `initial:`  只对入口的chunk有效(如果配置了inital则上面异步的例子将失效)
- `all:`  两种模式同事开启

**cacheGroups`**

​		上面的那么多参数，其实都可以不用管，cacheGroups 才是我们配置的关键。它可以继承/覆盖上面 `splitChunks` 中所有的参数值，除此之外还额外提供了三个配置，分别为：`test`, `priority` 和 `reuseExistingChunk`。

- test: 表示要过滤 modules，默认为`所有的 modules`，可匹配模块路径或 chunk 名字，当匹配的是 chunk 名字的时候，其里面的所有 modules 都会选中；
- priority：表示抽取权重，数字越大表示优先级越高。因为一个 module 可能会满足多个 cacheGroups 的条件，那么抽取到哪个就由权重最高的说了算；
- reuseExistingChunk：表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的`没有默认值(未证实)`。

####  terser-webpack-plugin 

​		压缩JS工具,减小包的体积,提升加载效率,通常配置在生产环境

- 之前

​		` uglifyjs-webpack-plugin `不支持ES6语法,ES6需求需要配合babel进行转义

​		webpack在`4.26.0`将默认压缩插件从	` uglifyjs-webpack-plugin `改成` terser-webpack-plugin `,

​		**原因:** `uglifyjs-webpack-plugin` 使用的` uglify-es `已经`不再被维护`，取而代之的是一个名为 terser 的分支。所以 webpack 官方放弃了使用 uglifyjs-webpack-plugin，建议使用 terser-webpack-plugin。 

### 补充知识

#### 热更新相关

- [[webpack 热加载原理探索]]( http://shepherdwind.com/2017/02/07/webpack-hmr-principle/ )

- [[webpack之输出]](  https://juejin.im/post/5ce4ab2c5188252b79423b05 )

  

## 模式 (mode)

![Mode](D:\个人\Blog\webpack\webpack.assets\Mode.png)

> 设置mode配置名称,webpack会启用内置优化
>
> `默认:`production

###  development 

> 　 会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `development`。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`。 

```js
// webpack.development.config.js
module.exports = {
+ mode: 'development'
- devtool: 'eval',
- cache: true,
- performance: {
-   hints: false
- },
- output: {
-   pathinfo: true
- },
- optimization: {
-   namedModules: true,
-   namedChunks: true,
-   nodeEnv: 'development',
-   flagIncludedChunks: false,
-   occurrenceOrder: false,
-   sideEffects: false,
-   usedExports: false,
-   concatenateModules: false,
-   splitChunks: {
-     hidePathInfo: false,
-     minSize: 10000,
-     maxAsyncRequests: Infinity,
-     maxInitialRequests: Infinity,
-   },
-   noEmitOnErrors: false,
-   checkWasmTypes: false,
-   minimize: false,
- },
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.NamedChunksPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
```



###  production 

>  会将 `DefinePlugin` 中 `process.env.NODE_ENV` 的值设置为 `production`。启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` 和 `TerserPlugin`  　　

ModuleConcatenationPlugin : `scope hoisting` 减少函数声明代码和内存开销

```js
// webpack.production.config.js
module.exports = {
+  mode: 'production',
- performance: {
-   hints: 'warning'
- },
- output: {
-   pathinfo: false
- },
- optimization: {
-   namedModules: false,
-   namedChunks: false,
-   nodeEnv: 'production',
-   flagIncludedChunks: true,
-   occurrenceOrder: true,
-   sideEffects: true,
-   usedExports: true,
-   concatenateModules: true,
-   splitChunks: {
-     hidePathInfo: true,
-     minSize: 30000,
-     maxAsyncRequests: 5,
-     maxInitialRequests: 3,
-   },
-   noEmitOnErrors: true,
-   checkWasmTypes: true,
-   minimize: true,
- },
- plugins: [
-   new TerserPlugin(/* ... */),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-   new webpack.optimize.ModuleConcatenationPlugin(),
-   new webpack.NoEmitOnErrorsPlugin()
- ]
}
```

### none

```js
// webpack.custom.config.js
module.exports = {
+ mode: 'none',
- performance: {
-  hints: false
- },
- optimization: {
-   flagIncludedChunks: false,
-   occurrenceOrder: false,
-   sideEffects: false,
-   usedExports: false,
-   concatenateModules: false,
-   splitChunks: {
-     hidePathInfo: false,
-     minSize: 10000,
-     maxAsyncRequests: Infinity,
-     maxInitialRequests: Infinity,
-   },
-   noEmitOnErrors: false,
-   checkWasmTypes: false,
-   minimize: false,
- },
- plugins: []
}
```

## webpack-dev-server

- 令webpack进行模块打包,并处理打包结果的资源请求
- 作为普通的web Server,处理静态资源文件请求
- 打包结果会放到`内存中`,
- 接收到请求时,都知识将内存中的打包结果返回给游览器

> 开发环境服务,可以不build查看页面
>
> 主要工作就是接收游览器请求,然后将资源返回,`启动服务`的时候会让webpack进行模块化打包并将资源准备好,`webpack-dev-server`接收到游览器的资源请求时,首先进行`URL地址校验`,如果地址为资源服务地址(`publicPath`),就会从webpack的打包结果中寻找该资源并返回给游览器.如果`不属于`资源服务地址,则直接读取硬盘中的源文件并将其返回

## source map

![source-map](D:\个人\Blog\webpack\webpack.assets\source-map.png)

​		`eval`代码块的最后添加source map的url,指定对应的文件



​		source map 是指将`编译` 、`打包` 、`压缩`后的代码`映射`会源代码的`过程`

​		webpack在编译过程中,如果我们启用了`devtool`,source map就会跟随源代码被传递,最后生成`.map`文件

​		调试代码时,会加载对应的`.map`文件找到对应的源代码

- 安全问题

  不打开开发者工具不会加载,任何人都能看到

  webpack提供了两种hidden-source-map和nosources-source-map来提升source map的安全性

- hidden-source-map

  产出完成的map文件,但是不会在bundle文件中添加对于map文件的引用,开发者工具中看不到map文件,需要`第三方服务`将map文件上传到上面,`Sentry(错误跟踪平台)`能实现

- nosources-source-map

  文件被隐藏,可以在控制台中查看报错信息

- nginx设置白名单

  将`.map文件只对白名单开放`



| 名称                         | 说明                                         |      |
| ---------------------------- | -------------------------------------------- | ---- |
| source map                   | 大和全,单独文件,显示行和列                   |      |
| eval-source-map              | 不会产生单独文件,显示行和列                  |      |
| cheap-module-source-map      | 不会产生列,单独文件,可以保留                 |      |
| cheap-module-eval-source-map | 不会产生文件,集成在打包后的文件中,不会产生列 |      |

 ![img](https://user-gold-cdn.xitu.io/2019/7/24/16c21c32ae73d7c0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1) 

##  sideEffects 

 `sideEffects` 是说模块内有没有立即执行的代码, 此类代码通常会产生副作用 

```js
// a.js 文件

// 副作用, 在 import a 时发生
document.body.appendChild(document.createElement('div')); 

// 导出的模块
export default function foo() {};
#摇树后  去除了export d但是副作用代码被保留了下来
document.body.appendChild(document.createElement('div')); 

```

 通过 `sideEffects` 标记, 可以通知 `webpack` 使用一种更简便高效的方式来实现代码裁剪. 

 如果我们引入的 包/模块 被标记为 `sideEffects: false` 了，那么不管它是否真的有副作用，只要它没有被引用到，整个 模块/包 都会被完整的移除 

[Webpack 中的 sideEffects 到底该怎么用]( https://zhuanlan.zhihu.com/p/40052192 )

## tree-shaking

> 打包过程中检测工程没有被引用过的模块,webpack会对其进行标记,在压缩时将他们从最终的bundle中去掉

**前提**

  1. 只能对ES6 Module 生效 (`require`导入的`不支持`去除 )

  2.  工程中使用了`babel-loader`,一定要禁用他的模块依赖解析.因为如果有`babel-looader`来做依赖解析,webpack接收到的就都是转化过的`CommonJS`形式的模块

     `测试发现modules不设置为false 也可以进行tree shaking, 不知是否与版本或其他因素有关`
     
     ```js
     #.babelrc 
     "presets": [
         ["@babel/preset-env",{
           "modules": false
         }]
  ],
     ```

**DCE(Elimination)**

- 代码不会被执行,不可到达 `if(false){}`
- 代码执行的结果不会被用到
- 代码只会影响死变量(只写不读)

**使用压缩工具去除死代码**

​		webpack将mode设置为`production`启用`terser-webpack-plugin`去除死代码

```js
# 摇树前
// a.js
export function a() {}
// b.js
export function b(){}
// package/index.js
import a from './a'
import b from './b'
export { a, b }
// app.js
import {a} from 'package'
console.log(a)

```

```js
#摇树后
// a.js
export function a() {}
// b.js 不再导出 function b(){}
function b() {}
// package/index.js 不再导出 b 模块
import a from './a'
import './b'
export { a }  --------	//b 模块的痕迹会被完全抹杀掉

// app.js
import {a} from 'package'
console.log(a)

```

### 知识补充

[Tree-Shaking性能优化实践 - 原理篇](https://juejin.im/post/5a4dc842518825698e7279a9)

[你的Tree-Shaking并没什么卵用](https://juejin.im/post/5a5652d8f265da3e497ff3de)

## scope hosting

​		 作用域提示, 在webpack中 简化代码

​		 webpack4 production mode会自动开启ModuleConcatenationPlugin，实现作用域提升

## 热更新原理

![hot](D:\个人\Blog\webpack\webpack.assets\hot.png)

Bundle server: 以服务器的方式进行访问 如:`localhost:8080/bundle.js`

启动路径: 1-2-A-B

更新路径:1-2-3-4-5

## 分析

### 速度

### 体积

## 优化

### 多进程/多实例

happyPack 维护越来月少,webpack4内置thead-loader,可以替换happyPack

**原理:**thead-loader原理与happyPack类似,每次`webpack`解析一个模块,thead-loader会将它及它的依赖分配给`worker`线程中,达到多进程目的

### 并行压缩

webpack4采用`terser-webpackplugin`需要开启parallel参数,生产环境默认为`false`

### 预编译资源模块 DLLPlugin

使用DLLPlugin进行分包,DllReferencePlugin对manifest.json引用

### 缓存

提升二次构建速度

1. `babel-loader`开启缓存

   ```js
   cacheDirectory: true
   ```

2. `terser-webpack-plugin`开启缓存

3. 使用`cache-loader`或者`hard-source-webpack-plugin`

### 缩小构建目标

减少文件的搜索范围

1. 减少模块搜索层级  优化resolve.modules
2. 指定入口文件    优化resolve.mainFields
3. 减少查找范围    优化resolve.extensions `webpack只支持js和json的读取`  

### 图片压缩

`image-webpack-loader`

### 去除无用的CSS

`purgecss-webpack-plugin`需要和`mini-css-extract-plugin`配合使用

### 动态polyfill

![动态polyfill](D:\个人\Blog\webpack\webpack.assets\动态polyfill.png)

