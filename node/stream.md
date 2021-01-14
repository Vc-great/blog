**概念**

- 流是一组有序的,有起点和终点的字节数据传输手段,而且有不错的效率.借助事件和非阻塞I/O库,流模块允许在其可用的时候动态处理,在其不需要的时候释放掉
- `stream`在`Node.js`中是处理流数据的抽象接口,`stream`模块提供了基础的API.使用这些API可以很容易地来构建实现流接口的对象.比如`HTTP`服务器`request`和`response`对象都是流
- 流可以是可读的,可写的,或是可读可写的.所有的流都是`EventEmitter`的实例

 **为什么使用流**

​	异步读写,不会阻塞程序,多次读取数据到`buffer`(缓冲区中),不占用V8内存,多次写入,对大文件十分友好

|                   | 同异部 | 是否阻塞 | 占用V8内存 | 读取次数 | 备注 |
| ----------------- | ------ | -------- | ---------- | -------- | ---- |
| `fs.readFileSync` | 同     | 是       | 是         | 一       |      |
| `fs.readFile`     | 异     | 否       | 是         | 一       |      |
| `stream`          | 异     | 否       | 否         | 多       |      |

**stream**

- `Stream`继承`EventEmitter`.流可以是可读的,可写的,或是可读可写的

- `Stream`分为:

  - `Readable`可读流
  - `Writable`可写流 如: fs.createWriteStream()
  - `Duplex` 可读可写流  如: net.Socket
  - `Transform`(读写过程中可以修改和变化数据的`Duplex`流) 如: zlib.createDeflate()

  

```js
const EF = require('events')
const util = require('util')
function Stream(){
	EE.call(this)
}
util.inherits(stream,EE)
```

**pipe**

​	封装可读可写,实现边读边写,读快了暂停,写跟上了继续读

```js
Stream.prototype.pipe = function(dest, options){
    var source = this;
    source.on('data', ondata);
    dest.on('drain', ondrain);
    if (!dest._isStdio && (!options || options.end !== false)) {
        source.on('end', onend);
        source.on('close', onclose);
    }
    source.on('error', onerror);
    dest.on('error', onerror);
    source.on('end', cleanup);
    source.on('close', cleanup);  
    dest.on('close', cleanup);
    dest.emit('pipe', source);
    return dest;
};

#ondata
// 如果ReadAable读入数据太快,来不及写入,要暂停读入数据
function ondata(chunk) {
    if (dest.Writable) { //当写完时会赋值false
       //读的太快没有写完,dest.write(chunk)返回false && 暂停写入
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

#ondrain
//订阅drain事件,表示这时才可以继续向流中写入数据,调用source.resume(),触发Wriable的data事件
function ondrain(){
    if(source.Readable && source.resume){
		source.resume()
    }
}
```



**流中的数据模式**

- 二进制模式,每个分块都是`buffer`或者`string`对象

- 对象模式,刘内部处理的是一系列的普通对象

  >所有使用`Node.js API`创建的流对象都只能操作``strings`和`Buffer`对象.但是通过一些第三方流的实现,依然能够处理其它类型的`JavaScript`值(除了`null`,它在流处理中有特殊意义),这些流被认为是工作在**对象模式**(`object mode`).在创建流的实例时,可以通过`objectMode`选项使流的实例切换到对象模式,试图将已经存在的流切换到对象模式是不安全的

**缓存区**

- `Writable`和`Readable`流都会将数据存储到内部的缓冲器(`buffer`)中,这些缓冲期可以通过 `writable._writableState.getBuffer()` 或 `readable._readableState.buffer` 来获取。
- 缓冲器的大小取决于传递流构造函数的`highWaterMark`选项:
  - 普通流:指定了总共的字节数
  - 工作在对象模式的流: 指定了对象的总数
- 可读流调用`stream.push(chunk)`方法时,数据被放到缓冲器中,如果流的消费者没有调用`stream.read()`方法,这些数据会始终存在于内部队列中,直到被消费
- 可读缓冲器的大小达到`highWaterMark`指定的阈值时,流会暂停从底层资源读取数据,直到当前缓冲器的数据被消费(也就是说,流在内部停止调用`readable._read()`来填充可读缓冲器)
- 可写流通过反复调用`writable.write(chunk)`方法将数据放到缓冲器.当内部可写缓冲器的总大小小于`gighWaterMark`指定的阈值时,调用`writable.write()`将返回`true`,一旦内部缓冲器的大小达到或超过`highWaterMark`,调用`writable.write()`将返回`false`
- `stream API`的关键目标,尤其对于`stream.pipe()`方法,就是限制缓冲器数据大小,以达到可接受的程度.这样对于读写速度不匹配的源头和目标,就不会超出可用的内存大小
- `Duplex`和`Transform`都是可读写的.在内部他们都维护了两个相互独立的缓冲器用于读和写.在维持了合理高效的数据流的同时,也使得对于读和写可以独立进行而互不影响





**ReadStream**

- on('data')
- on('open')/on('end')
- on('close')
- pause
- resume

**可读流的两种模式**

- flowing

  在`flowing`模式下,可读流自动从系统底层读取数据,并通过`EventEmitter`接口的事件尽快将数据提供给应用(所有的流都是`EventEmitter`的实例)

- paused

  在`paused`模式下,必须显示调用`stream.read()`方法从流中读取数据片段



​	创建流的`Readable`流.模式是非流动模式(`paused`模式),默认不会读取数据.所有出事工作模式为`paused`的`Readable`流,可以通过下面三种途径切换为`flowing`模式:

- 监听`data`事件
- 调用`stream,resume()`方法
- 调用`stream.pipe()`方法将数据发送到`Writable` 

**可读流的三种状态**

​	在任意时刻,任意可读流应确切处于下面三种状态之一:

```js
readable._readableState.flowing = null
readable._readableState.flowing = false
readable._readableState.flowing = true
```

​	当状态为`false`时,数据可能堆积到流的内部缓存中;		

​	状态为`null`,由于不存在数据消费者,可读流将不会产生数据,在这个状态下,发生以下动作,会改变状态为`true`,这时随着数据生成,可读流开始频繁触发事件:

- 监听`data`事件

- 调用`readable.pipe()`方法

- 调用`readable.resume()`方法

  

**writeStream**

- write()
- on('drain')
- end()