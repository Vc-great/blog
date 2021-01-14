> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.zhufengpeixun.com](http://www.zhufengpeixun.com/grow/html/87.postcss.html#t85.4%20%E7%9B%B4%E6%8E%A5%E8%B0%83%E7%94%A8postcss%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E4%B8%8B%E7%9A%84%E6%96%B9%E6%B3%95)

1. PostCSS [#](#t01. PostCSS)
-----------------------------

*   [PostCSS](https://www.postcss.com.cn/)是一个用 JavaScript 工具和插件转换 CSS 代码的工具
*   增强代码的可读性
*   将未来的 CSS 特性带到今天！
*   终结全局 CSS
*   避免 CSS 代码中的错误
*   强大的网格系统
*   postcss会帮我们分析出css的抽象语法树

2. 流程

-------------------

![图片描述](postCSS.assets/bVbndee)

步骤：

1. 将`CSS`解析成抽象语法树（`AST`树）
2. 将`AST`树传递给任意数量的插件处理
3. 将处理完毕的`AST`树重新转换成字符串

流程:

Source string ->Tokenizer ->Parser -> AST -> Processor -> Stringifer

**source string**

```js
.className { color: #FFF; }
```

**Tokenizer**

​	将原`css`字符串进行分词

```js
#通过tokenizer后得到结果
[
    ["word", ".className", 1, 1, 1, 10]
    ["space", " "]
    ["{", "{", 1, 12]
    ["space", " "]
    ["word", "color", 1, 14, 1, 18]
    [":", ":", 1, 19]
    ["space", " "]
    ["word", "#FFF" , 1, 21, 1, 23]
    [";", ";", 1, 24]
    ["space", " "]
    ["}", "}", 1, 26]
]
```

```js
#以word类型为例,参数如下
const token = [
     // token 的类型，如word、space、comment
    'word',
    // 匹配到的词名称
    '.className',
    // 代表该词开始位置的row以及column，但像 type为`space`的属性没有该值
    1, 1,
    // 代表该词结束位置的row以及column，
    1, 10
]
```

**Parser**

​	经过`Tokenizer`之后,需要`Parser`将结果初始化`AST`

```js
this.root = {
    type: 'root',
    source: { input: {css: ".className { color: #FFF; }", hasBOM: false, id: "<input css 1>"},
                   start: { line: 1, column: 1 } ,
                  end: { line: 1, column: 27 }
    },
   raws:{after: "", semicolon: false}
   nodes // 子元素
}
```



**Processor**

​	经过`AST`之后,`PostCSS`提供了大量`JSAPI`给插件用

**Stringifier**

​	插件处理后,比如加游览器前缀,会重新`stringifier.stringify`为一般`CSS`





1. 文档 [#](#t12. 文档)
-------------------

*   [api](http://api.postcss.org)
*   [astexplorer](https://astexplorer.net/#/2uBU1BLuJ1)

3. 类型 [#](#t23. 类型)
-------------------

*   CSS AST主要有3种父类型
    *   `AtRule` @xxx的这种类型，如@screen
    *   `Comment` 注释
    *   `Rule` 普通的css规则
*   子类型
    *   `decl` 指的是每条具体的css规则
    *   `rule` 作用于某个选择器上的css规则集合

4.AST节点 [#](#t34.AST节点)
-----------------------

*   nodes: CSS规则的节点信息集合
    *   decl: 每条css规则的节点信息
    *   prop: 样式名,如width
    *   value: 样式值,如10px
*   type: 类型
*   source: 包括start和end的位置信息，start和end里都有line和column表示行和列
*   selector: type为rule时的选择器
*   name: type为atRule时@紧接rule名，譬如@import 'xxx.css'中的import
*   params: type为atRule时@紧接rule名后的值，譬如@import 'xxx.css'中的xxx.css
*   text: type为comment时的注释内容

5.操作方法 [#](#t45.操作方法)
---------------------

### 5.1 遍历 [#](#t55.1 遍历)

*   walk: 遍历所有节点信息，无论是atRule、rule、comment的父类型，还是rule、 decl的子类型
*   walkAtRules：遍历所有的AtRules
*   walkComments 遍历所有的Comments
*   walkDecls 遍历所有的Decls
*   walkRules 遍历所有的Rules

```
root.walkDecls(decl => {
    decl.prop = decl.prop.split('').reverse().join('');
}); 
```

### 5.2 处理 [#](#t65.2 处理)

*   postCss给出了很多操作css规则的方法
*   [api](http://api.postcss.org/AtRule.html)
*   处理css的方式其实有2种：编写postcss plugin，如果你的操作非常简单也可以直接利用`postcss.parse`方法拿到`css ast`后分析处理

### 5.3 postcss plugin [#](#t75.3 postcss plugin)

*   postcss插件如同babel插件一样，有固定的格式
*   注册个插件名，并获取插件配置参数`opts`
*   返回值是个函数，这个函数主体是你的处理逻辑，有2个参数，一个是root,AST的根节点。另一个是result，返回结果对象，譬如`result.css`，获得处理结果的css字符串

```
export default postcss.plugin('postcss-plugin-name', function (opts) {
  opts = opts || {};
  return function (root, result) {
    // 处理逻辑
  };
}); 
```

### 5.4 直接调用postcss命名空间下的方法 [#](#t85.4 直接调用postcss命名空间下的方法)

*   可以用postcss.parse来处理一段css文本，拿到css ast，然后进行处理，再通过调用toResult().css拿到处理后的css输出
