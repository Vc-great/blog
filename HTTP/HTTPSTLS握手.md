​	`HTTP`X协议里,建立连接后,游览器会立即发送去年请求报文,但`HTTPS`协议需要再用另外一个握手过程,在`TCP`上建立安全连接,之后才是收发`HTTP`报文

**TLS1.2协议**

1. 记录协议

   规定了`TLS`手法数据的基本单位,记录(record)

2. 警报协议

   向对方发出警报信息,有点像HTTP协议里的状态码,如:`protocol_cersion`就是不支持旧版本,`bad_certificate`就是证书有问题,收到警报后另一方可以选择继续,也可以立即终止连接

3. 握手协议

   `TLS`里最复杂的子协议,要比`TCP`的`SYN/ACK`复杂的多,游览器和服务器会在握手过程中协商`TLS`版本号,随机数,密码套件等信息,然后交换证书和密钥参数,最终双方协商得到会话密钥,用于后续的混合加密系统

4. 变更密码规范协议

   ​	通知,告诉对方,后续的数据都将使用加密保护,在它之前,数据都是明文的



**流程**

![https握手1](HTTPSTLS握手.assets/https握手1.png)

​	在`TCP`建立连接之后,游览器会首先发一个`Client Hello`消息,里面有客户端的版本号,支持的密码套件,还有一个**随机数(client Random)**,用于后续生成会话密钥

```js
Handshake Protocol: Client Hello
    Version: TLS 1.2 (0x0303)
    Random: 1cbf803321fd2623408dfe…
    Cipher Suites (17 suites)
        Cipher Suite: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (0xc02f)
        Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)
```

​	服务器收到`Client Hello`后,会返回一个`Server Hello`消息,把版本号对一下,也给出一个**随机数(Server Random)**,然后从客户端的列表里选一个作为本次通信使用的密码套件,在这里它选择了`TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`

```js
Handshake Protocol: Server Hello
    Version: TLS 1.2 (0x0303)
    Random: 0e6320f21bae50842e96…
    Cipher Suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (0xc030)
```

​	上面代码块意思就是版本号对上了,可以加密,你的密码套挺多的,我选择一个最合适的,用椭圆曲线加`RSA`,`AES`,`SHA384`.我也给你一个随机数,你也留着

​	然后服务器为了证明自己的身份,就把证书也发给了客户端`(Server Certificate)`

​	接下来是**关键**操作,因为服务器选择了`ECDHE`算法,所以它会在证书后发送`Server Key Exchange`消息里面是**椭圆曲线的公钥(Server Params)**,用来实现密钥交换算法,再加上自己的私钥签名认证

```js
Handshake Protocol: Server Key Exchange
    EC Diffie-Hellman Server Params
        Curve Type: named_curve (0x03)
        Named Curve: x25519 (0x001d)
        Pubkey: 3b39deaf00217894e...
        Signature Algorithm: rsa_pkcs1_sha512 (0x0601)
        Signature: 37141adac38ea4...
```

​		这相当于说:刚才我选的密码套件有点复杂,所以再给你个算法的参数,和刚才的随机数一样有用,别丢了,为了防止别人冒充,我又盖了个章

​	之后是**Server Hello Done**消息,服务器说:我的信息就是这些,打招呼完毕

​	第一个消息往返就结束了(两个TCP包),结果是客户端和服务器通过明文共享了三个信息:`Client Random`,`Server Random`,`Server Params`

​		客户端拿到了服务器的证书,开始走证书链逐级验证,确认证书的真实性,再用证书公钥验证签名,就确认了服务器的身份

​	客户端按照密码套件的要求,也生成一个**椭圆曲线的公钥(Client Params)**,用`Client Key Exchange`消息发给服务器

```js
Handshake Protocol: Client Key Exchange
    EC Diffie-Hellman Client Params
        Pubkey: 8c674d0e08dc27b5eaa…
```

​	现在客户端和服务器手里都拿到了密钥交换算法的两个参数`(Client Parans,Server Params)`就用`ECDHE`算法一阵算,算出了一个新的东西,叫`Pre-Master`,也是一个随机数

​	现在客户端和服务器手里有了三个随机数`Client Random` `Server Random` `Pre-Master`,用这三个作为原始材料,就可以生成用于加密会话的主密钥,叫`Master Secret`,而黑客因为拿不到`Pre-Master`,所以也就得不到主密钥

​	为什么要三个随机数?

​	`TLS`的设计者不信任客户端或服务端伪随机数的可靠性,为了保证真正的完全随机,不可预测,把三个不可靠的随机数混合起来,那么随机的程度就非常搞了,足够让黑客难以猜测

​	有了主密钥和派生的会话密钥,握手就快结束了.客户端发一个`Change Cipher Spec`然后再发一个`Finished`的消息,把之前所有发送的数据做个摘要,再加密一下,让服务器做个验证

​	意思就是告诉服务器:后面都改用对称算法加密通信了,用的就是打招呼时说的`AES`,加密对不对还得你测一下

​	服务器也是同样的操作,发`Change Cipher Spec`和`Finished`消息,双方都验证加密解密`OK`,握手证书结束,后面就收被加密的HTTP请求和响应了

​	

**RSA握手过程**

​	与`TLS`握手不同:

1. 使用`ECDHE`实现密钥交换,而不是`RSA`,所以会在服务器端发出`Server Key Exchange`消息
2. 因为使用了`ECDHE`,客户端可以不用等到服务器发出`finished`确认握手完毕,立即就发出`HTTP`报文,省去了一个消息往返的时间浪费.这个叫`TLS False Start`,意思就是抢跑,和`TCP Fast Open`有点像,都是不等连接完全建立就提前发应用数据,提高传输效率

![RSA](HTTPSTLS握手.assets/RSA.png)

​	大体的流程没有变,只是`Pre-Master`不再需要用算法生成,而是客户端直接生成随机数,然后用服务器的公钥加密,通过`Client Key Exchange`消息发给服务器.服务器再用私钥解密,这样双方也实现额共享三个随机数,就可以生成主密钥



**双向认证**

​	双向认证的流程只是在`Serve Hello Done`之后,`Client Key Exchange`之前,客户端要发送`Client Certificate`消息,服务器收到后也把证书链走一遍,验证客户端的身份

​	常用:U盾

**小结:**

1. `HTTPS`协议会先于服务器执行`TCP`握手,然后执行`TLS`握手,才能建立安全连接
2. 握手的目标是安全地交换对称密钥,需要三个随机数,第三个随机数`Pre-Master`必须加密阐述,决定不能让黑客破解
3. `Hello`消息交换随机数,`Key Exchange`消息交换`Pre-Master`
4. `Change Cipher Spec`之前传输的都是明文,之后都是对称密钥加密的密文