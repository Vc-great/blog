**location**

提供当前文档地址的详细信息

**history**		

提供对游览器历史的访问,`window.history`返回一个`History`对象,可以用它对游览器历史进行一些操作

| 名称                         | 说明                                                   | 返回   |
| ---------------------------- | ------------------------------------------------------ | ------ |
| back()                       | 后退一步                                               | void   |
| forward                      | 前进一步                                               | void   |
| go(index)                    | 转到相对于当前文档的某个游览历史位置,正值前进,负值后退 | void   |
| length                       | 游览历史的项目数量                                     | number |
| pushState(state,title,url)   | 游览历史添加一个条目                                   | void   |
| replaceSate(state,title,url) | 替换游览器历史当前条目                                 | void   |
| state                        | 游览器历史中关联当前文档的状态数据                     | object |







​	游览器会对当前页面中访问的网址进行记录,不管我们是通过以下哪种方式改变网页,游览器都会把改变后的网址记录下来,`history`的`length`可以查看当前窗口存储的历史记录总数

1. 直接在地址栏输入网址
2. 网页内的超链接
3. 改变`location.href`跳转到其他网页
4. 改变锚点
    - 手动更改游览器地址,在最后增加或改变`#hash`
    - 改变`location.hash`或`location.href`
    - 点击带锚点的连接
    - 游览器前进后退可能导致`hash`的变化,(**前提:**两个网址的`hash`不同)

**历史记录图解:**

![image](https://images2015.cnblogs.com/blog/459873/201610/459873-20161010141538024-734568915.png)



​		当我们通过游览器的前端后退功能(按钮,快,右键等)或者是`history`提供的`go/back/forward`方法,都不会改变历史记录栈的内容,只是改变访问指针 

![image](https://images2015.cnblogs.com/blog/459873/201610/459873-20161010141540727-763005808.png)

​	`history.go(n)`可以改变指针到任意位置,超出历史记录栈范围时,指针不会移动

**中间添加**

游览器向历史记录里面压入新的记录时,是直接在当前指针后面压入的,如果当前指针后面还有其他的记录项,会被丢弃掉

![image](https://images2015.cnblogs.com/blog/459873/201610/459873-20161010184405852-2092767860.png)

**总数限制**

历史记录栈储存总数有限制为50,超出这个限制后,历史记录的存储就好采取滚动方式进行存储,新的记录会压入栈的顶部,最底部的记录会从栈的底部移除出去

**hashChange**

​	锚点变化会在历史记录栈添加新记录,所以`history.length`也会在锚点变化之后改变,每当锚点发生变化的时候,还会出发`window`对象的`onhashchange`事件

```js
#hashchange 获得以下参数
window.onhashchange = function(event) {
    console.log(event.oldURL); //完整地址
    console.log(event.newURL);
    console.log(location.hash); //变化后锚点值
};
```



![image](https://images2015.cnblogs.com/blog/459873/201610/459873-20161014155747562-1970766655.png)



**pushState**

`pushState`包含三个东西 : 2个`api`和一个事件

   **API:**

​	`pushState`和`replaceState`都不会触发`hashChange`

1. `hisstory.pushState`

    增加历史,当前指针后面还有旧的条目时,在增加新的历史后会被废弃掉,改变游览器地址,但是不会改变网页内容

    ![image](https://images2015.cnblogs.com/blog/459873/201610/459873-20161020215910826-1874159974.png)

2. `history.replaaceState`

   **事件 : window.onpopstate**

​	`history.pushSate`和`history.replaceState`都不会出发这个事件

​		仅在游览器前进后端,`history.go/back/forward`调用,`hashchange`的时候触发

​	

参考

https://www.cnblogs.com/lyzg/p/5941919.html

https://www.cnblogs.com/lyzg/p/5960609.html