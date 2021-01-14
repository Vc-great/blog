1

```js
"scripts": {
   "hello": "echo hello",
   "build": "webpack"
}
```

我们可以使用 `npm run hello`执行脚本,也可以使用 `npm run build`执行`node_modules/.bin`目录下的webpack文件

- `npm run` 命令执行时，会把 `./node_modules/.bin/` 目录添加到执行环境的 `PATH` 变量中，因此如果某个**命令行包**未全局安装，而只安装在了当前项目的 node_modules 中，通过 `npm run` 一样可以调用该命令。

- 执行 npm 脚本时要传入参数，需要在命令后加 `--` 标明, 如 `npm run hello -- --port 3000` 可以将 `--port` 参数传给`hello` 命令

  

  可以通过打印`全局env`和 在项目下执行`npm run env`来对比`PATH`属性，不难发现在执行npm run 的时候确实会将 `./node_modules/.bin/` 目录添加到`PATH中`

**MIT许可证**

![img](npm.assets/bg2011050101.png)

**npx用法**

​	npx命令是npm v5.2之后引入新命令,npx可以帮我们直接执行`node_modules/.bin`

- npx 想要解决的主要问题，就是调用项目内部安装的模块

```js
npm install -D mocha
```

> 一般来说，调用mocha只能在`package.json`的scripts字段里面使用

```js
"scripts": {
    "test": "mocha -version"
}
npx mocha --version
```

> npx 的原理很简单，就是运行的时候，会到node_modules/.bin路径和环境变量$PATH里面，检查命令是否存在

####  避免全局安装模块

- 除了调用项目内部模块，npx 还能避免全局安装的模块。比如，`create-react-app`这个模块是全局安装,npx 可以运行它,而且不进行全局安装

```js
$ npx create-react-app my-react-app
```

> 上面代码运行时，npx 将create-react-app下载到一个临时目录，使用以后再删除

####  --no-install 参数和--ignore-existing 参数

- 如果想让 npx 强制使用本地模块，不下载远程模块，可以使用`--no-install`参数。如果本地不存在该模块，就会报错
- 反过来，如果忽略本地的同名模块，强制安装使用远程模块，可以使用`--ignore-existing`参数