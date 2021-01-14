**方法**

1. 同步 sync
2. 异步 没有sync



​	读取文件,读取到的结果默认都是`buffer`类型,写入的时候会清空文件内容,并且以`uft8`格式类型写入

​	读取的内容都会放到内存中,如果文件过大会浪费内存,淹没可用内存,大型文件不能采用这种方式来进行操作,`64k`以上的文件做拷贝操作尽量要不使用`readFile`来实现

**手动读写文件**

​	读一点写入一点,通过`open`,`read`,`write`,`close`实现

```js
fs.open
fs.read
fs.write
fs.close
```

​	

**Readable Stream**



