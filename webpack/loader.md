**loader解决了什么问题**

​	通过使用不同的`loader`,`webpack`可以把不同的文件都转成JS文件

- test : 匹配处理文件的扩展名的正则表达式
- use: loader名称,就是你要使用模块的名称
- include/exclude: 手动置顶必须处理的文件夹或屏蔽不需要处理的文件夹
- query: 为`loader`提供额外的设置选项

**loader执行顺序和module.rules顺序关系**



**loader为什么是自右向左执行**

webpack选择了`compose`方式,而不是`pipe`方式                         