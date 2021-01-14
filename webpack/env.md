# 环境变量

- `--mode`用来设置模块内的`process.env.NODE_ENV`
- `--env`用来设置webpack配置文件的函数参数
- `cross-env`用来设置node环境的`process.env.NODE_ENV`
- `DefinePlugin`用来设置模块内的全局变量

**mode**

​	`webpack`默认`production`,`webpack server`默认为`development`

​	可以在模块内通过`process.env.NODE_ENV`获取当前的环境变量，无法在`webpack`配置文件中获取此变量

```js
//配置方式
#  一
"scripts": {
    "build": "webpack",
    "start": "webpack serve"
  },
      
# 二
"scripts": {
  "build": "webpack --mode=production",
  "start": "webpack --mode=development serve"
},
 #三
module.exports = {
	mode: 'development'
}
```

index.js

```js
#模块内可以获取变量
console.log(process.env.NODE_ENV);// development | production
```

webpack.config.js

```js
#webpack内部无法获取
console.log('NODE_ENV',process.env.NODE_ENV);// undefined
```

**env**

​	无法在模块内通过`process.env.NODE_ENV`访问

​	可以在`webpack`配置文件中通过函数获取当前环境变量

```js
#配置方式
"scripts": {
   "dev": "webpack serve --env=development",
   "build": "webpack --env=production",
}
```

index.js

```js
#模块内无法访问 
onsole.log(process.env.NODE_ENV);// undefined
```

webpack.config.js

```js
#改变的不是nodejs中的环境变量
console.log('NODE_ENV',process.env.NODE_ENV);// undefined
```

 ```js
#webpack写成函数形式通过参数获取到在命令行配置的env变量
module.exports = (env,argv) => {
  console.log('env',env);// development | production
};
 ```

**DefinePlugin**

​	设置全局变量(不是`window`),所有模块中通过`process-env`.

​	可以在任意模块通过`key`获取当前环境变量.

​	但无法在`node`环境(webpack配置中获取当前的环境变量)

```js
#webpack.config.js 设置环境变量
plugins:[
   new webpack.DefinePlugin({
      'process.env.NODE_ENV':JSON.stringify('development'),
      'NODE_ENV':JSON.stringify('production'),
   })
] 
```

index.js

```js
console.log(NODE_ENV);//  production
```

webpack.config.js

```js
console.log('process.env.NODE_ENV',process.env.NODE_ENV);// undefined
console.log('NODE_ENV',NODE_ENV);// error ！！！
```

**cross-env**

​	只能设置`node`环境下的变量 NODE_ENV

package.json

```js
#设置
"scripts": {
  "build": "cross-env NODE_ENV=development webpack"
}
```

webpack.config.js

```js
#获取
console.log('process.env.NODE_ENV',process.env.NODE_ENV);// development
```

