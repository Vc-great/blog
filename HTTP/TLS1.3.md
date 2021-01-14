​	`TLS1.3`在2018年发布,再次确立了信息安全领域的新标准,三个主要改进目标:**兼容,安全与性能**

**最大化兼容性**

​	通过在记录末尾添加一系列的**扩展字段**来增加新的功能,老版本的`TLS`可以直接忽略,这就实现了**后向兼容**	在记录头的`Version`字段被兼容性**固定**的情况下,只要是`TLS1.3`协议,握手的`Hello`消息后面就必须由`supported_versions`扩展,它标记了`TLS`的版本号,使用它就能区分新旧协议

```js
Handshake Protocol: Client Hello
    Version: TLS 1.2 (0x0303)
    Extension: supported_versions (len=11)
        Supported Version: TLS 1.3 (0x0304)
        Supported Version: TLS 1.2 (0x0303)
```

​	`TLS1.3`利用扩展实现了许多重要的功能,比如`supported_groups` `key_share` `signature_algorithms` `server_name`等



**强化安全**

​	`TLS1.3`就在协议里修复了这些不安全因素,密码套件只有5个套件

如:

- 伪随机数函数有`PRF`升级为`HKDF`

- 明确禁止在记录协议里使用压缩;

- 废除了`RC4` `DES`对称加密算法

- 废除了 ECB、CBC 等传统分组模式；

- 废除了 MD5、SHA1、SHA-224 摘要算法；

- 废除了 RSA、DH 密钥交换算法和许多命名曲线

  游览器默认会使用`ECDHE`而不是`RSA `做密钥交换,这是因为它不具有**前向安全**

**前向安全**

​	长期使用的主密钥泄露不会导致过去的回话密钥泄露,前向安全能够保护过去进行的通信不受密码或密钥在未来暴漏的威胁

​	`ECDHE`算法在每次握手时都会生成一对临时的公钥和私钥,每次通信的密钥对都是不同的,也就是**一次一密**,即使

​	