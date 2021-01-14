**二进制**

​	以`0b`开头

**八进制**

​	以`oO`开头

**十六进制**

​	以`0x`

**进制转化**

​	**当前位所在的值** * 进制^**所在位**,累加可以转换为10进制

```
11111111
1*2^8
```



​	一个字节由八个位组成,最大转换成十进制是255

​	`ASCII`就是一个字节

​	`gb2312`一个汉字由2个字节组成,用了一部分来设计汉字

​	gb2312扩展后->gbk扩展后 - >gb18030

​	unicode => utf8包含所有汉字 一个汉字就是三个字节(JS 语言 用的是utf16) 





**buffer**

​	展现方式为`16`进制

​	声明方式

```js
var buffer = Bufffer.alloc(6)
var buffer = Buffer.from('珠峰架构')

```

​	修改buffer内容,可以通过索引更改

```

```

​	想更改buffer的大小,是无法更改的,可以在声明一个空间将结果拷贝过去

```js
var buf = Buffer.alloc(12)
var buffer1 = Buffer.from('珠峰');
var buffer2 = Buffer.from('培训');

Buffer.prototype.copy = function (targetBuffer,targetStart,sourceStart=0,sourceEnd = this.length) {
    for(let i = sourceStart; i< sourceEnd ;i++){
        targetBuffer[targetStart++] = this[i]
    }
}
buffer1.copy(buf,0,0,6)
buffer2.copy(buf,6,0,6)

```

**buffer转64**

```js
Buffer.from('珠').toString('base64') 
```



**JS进制转化方法**

​	parseInt,其余进制转化为10进制



**base64**

​	数据传递;替代url

一个汉字是三个字节,一个字节是8位转成二进制就是3 * 8 再拆分成 4 * 6,再转换为10进制,再去特定的64个字符中取值,得到结果

```js
//base64 是如何转换出来的  数据传递  替代url  node不支持gbk编码 只支持utf8  转化的结果比以前大1/3
let r = Buffer.from('珠');
console.log(r) // e7 8f a0   3*8
console.log(0xe7.toString(2));
console.log(0x8f.toString(2));
console.log(0xa0.toString(2));

// 00111001  00111000  00111110  00100000  // 将 3 * 8的格式 拆分成 4 * 6

console.log(parseInt('111001', 2)) // 57 
console.log(parseInt('111000', 2))// 56 
console.log(parseInt('111110', 2)) // 62
console.log(parseInt('100000', 2)) // 32

let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
str+=str.toLowerCase();
str+='0123456789+/';

console.log(str[57] + str[56] + str[62] + str[32]);
```

**Base64**

​	一种编码方式,通常用于把二进制数据编码为可写的字符形式的数据,这是一种可逆的编码方式

​	Base64编码之所以称为Base64,是因为其使用64个字符来对任意数据进行编码

​	Base64编码原理是每3个原始字符编码成4个字符,如果原始字符串长度不能被3整除,则使用0值来补充原始字符串



