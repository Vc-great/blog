# 客户端识别

- 承载用户身份信息的HTTP首部
- 客户端IP地址跟踪,通过用户的IP地址对其进行识别
- 用户登录,用认证方式来识别用户
- 胖URL,一种在URL中嵌入识别信息的技术

**Cookie**

​	来源于计算机变成里的术语`Magic Cookie`意思是不透明的数据,并不是小甜饼的含义

**有效期**

**Expires**

​	过期时间,用的是绝对时间点,可以理解为截止日期

`不推荐使用,很多服务器时间是不同步的`

**Max-Age**

​	相对时间,单位是秒,游览器用收到报文的时间点再加上`Max-age`,就可以得到失效的绝对时间

​	若`Max-Age`属性设置为0,服务器0秒就让`Cookie`失效,即立即失效,服务器不存`Cookie`

​	`Expires`和`Max-age`可以同时出现,两者的失效时间可以一致,也可以不一致,但游览器会优先采用`Max-Age`计算失效期

​	如果不指定`Expires`或`Max-Age`属性,那么`Cookie`仅在游览器运行时有效,一旦游览器关闭就会失效,这被称为会话`Cookie`(session cookie)或内存Cookie(in-memory cookie),在`chrome`里过期时间会显示为`Session`或`N/A`



​	下面`Expires`标记的过期时间是:GMT 2019 年 6 月 7 号 8 点 19 分,而`Max-Age`则只有10秒,优先采用`Max-Age`10秒后失效

```js
#response
Set-Cookie: favorite=hamburger; Max-Age=10; Expires=Sun, 30-Aug-20 01:08:31 GMT; Domain=www.chrono.com; Path=/; HttpOnly; SameSite=Strict

```

**作用域**

​	让游览器仅发送给特定的服务器和URI,避免被其他网站盗用

**Domain**

​	针对某个域名设置,不允许跨域,(**父子域可以设置**),可以限制`cookie`传输的范围

**Path**

​	`Cookie`所属的域名和路径,游览器在发送`Cookie`前会从`URI`中提取`host`和`path`部分,对比`Cookie`的属性,如果不满足条件,就不会在请求头里发送`Cookie`

​	使用这两个属性可以为不同域名和路径分别设置各自的`Cookie`,比如`/19-1`用一个`Cookie`,`/19-2`再用另外一个`Cookie`,两者互补干扰,现实中为了省事,通常`Path`就用一个`/`或者直接省略,表示域名下的任意路径都允许使用`Cookie`,让服务器自己去挑

**安全性**

**XSS**

​	用户A提交评论`「<script>console.log(document.cookie)</script>」`,然后用户B来访问网站,这段脚本在B的游览器直接执行,用户A的脚本就可以操作`cookie`,用户A就可以伪造用户B的登陆信息,随意访问用户B的隐私

**XSRF**

1. 用户登陆银行网站,没有登出;

2. 用户访问恶意网站,恶意网站向银行发起请求并携带`cookie;`

**HttpOnly**

​	这个`Cookie`只能通过游览器`HTTP`协议传输,禁止其他方式访问,游览器的JS引擎就会禁用`document.cookie`等一切相关的`API`,可以阻止XSS脚本攻击	

**SameSite**

​	设置成`SameSite=Strict`可以严格限定`Cookie`不能随着跳转链接跨站发送,而`SameSite=Lax`则略宽松一点,允许`GET/HEAD`等安全方法,但禁止`POST`跨站发送

**Secure**

​	这个`Cookice`仅能用`HTTPS`协议加密传输,明文的`HTTP`协议会禁止发送,但`Cookie`本身不是加密的,游览器里还是以明文的形式存在

