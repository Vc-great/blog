## HTTP

### 三次握手

> 为了准确无误的将数据送达目标处,TCP协议采用了三次握手策略
>
> 握手过程使用了TCP标志`SYN`和`ACK`

1. 发送端发送一个带有`SYN`标志的数据包给对方
2. 接收端收到后,回传一个带有`SYN/ACK`标志的数据包以示传达确认信息
3. 发送端再回传一个`ACK`标志的数据包,代表`握手结束`

### cookice

> HTTP是无状态协议,它不对之前发生过的请求和响应的状态进行管理,也就是说无法根据之前的状态进行本次的请求处理
>
> HTTP保留无状态协议同时又要解决状态的问题(`例如`),于是引入了cookice
>
> 服务端设置cookice 客户端保存cookice   之后的请求客户端会自动在请求报文中加入cookice

`例如:`登陆认证的WEB页面本身无法进行状态管理,每次跳转新页面,就要在请求报文中附加参数来管理登陆状态

HTTP

## 报文

### content-Type

​	用于知识资源的**MIME**类型,说明请求或返回的消息主题是用何种方式编码,声明数据类型

​	在响应中,`content-Type`表头告诉客户端实例返回的内容的内容类型

​	在请求中,客户端告诉服务器实际发送的数据类型

**application/x-www-form-urlencoded**

​	`post`提交数据方式,提交数据按照`key1=value1&key2=value2`的方式进行编码

```
const qs = require('qs');

let value = {
    aa:1,
    bb:2,
    cc:3
}
let a = qs.stringify(value)
console.log(a);  //aa=1&bb=2&cc=3
```



**application/json**

​	`POST`请求以`JSON`的格式想服务请求发起请求或者请求返回`JSON`格式的响应内容