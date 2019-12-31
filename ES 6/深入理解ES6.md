# 深入理解ES6

## var let const

- `最佳实践`

  >    const 是声明变量的默认方式，仅当你明确哪些变量之后需要修改的情况下再用 let 声明那些变量
  >
  > `原因:`
  >
  > ​		这个实践的缘由是大部分变量在初始化之后不应该被修改，因为这样做是造成 bug 的根源之一。
  >
  > ​		保证代码中最基本的不可变性能防止错误的发生。

- 块级作用域

  > `引入目的:`让变量的生命周期更加可控
  >
  > `作用:`让所声明的变量在指定块的作用域外无法被访问
  >
  > `位置:`
  >
  > - 在一个函数内部
  >
  > - 子啊一个代码块(由一对花括号包裹)内部
  >
  
- 暂时性死区

  > 用于描述let 或者 const 声明的变量为何在声明处之前无法被访问
  >
  > 任何在暂时性死区内访问的变量的企图都会导致'运行时'错误,只有执行到变量的声明的语句时,该变量才会从暂时性死区内被移除并可以安全使用
  >
  > 暂时性死区只是快捷绑定的一个独特表现,而另一个独特表现则是在循环中使用它

- const

  > const 声明默认值，const 声明的变量`不能被重新赋值`，但是如果 const `声明的值是对象`，那么这个`对象是可以修改`了。
  >
  > const 阻止的是绑定的修改，而不是绑定值的修改。
  >

- 循环内

  > `var:`变量i在循环中每次迭代中都被共享了,循环内创建的函数都拥有对于同一变量的引用
  >
  > `let:`
  >
  > - 每次迭代都会创建一个新的同名变量并对其进行初始化
  > - let声明在循环内部的行为是在规范中特别定义的,而与不提升变量声明的特征没有必然联系

|             功能             | var  | let  | const |
| :--------------------------: | :--: | :--: | :---: |
|           变量提升           |  会  |      |       |
|          块级作用域          |      | 存在 | 存在  |
|          暂时性死区          |      | 存在 | 存在  |
|           重复声明           | 可以 | 报错 | 报错  |
| 全局声明<br />会在window绑定 |  会  | 不会 | 不会  |

## 字符串

-  repeat () 方法

  ```js
  console.log("x".repeat(3));         // "xxx"
  console.log("hello".repeat(2));     // "hellohello"
  console.log("abc".repeat(4));       // "abcabcabcabc"
  ```

  

## 函数

### 默认参数

-  可以任意指定一个函数参数的默认值，如果之后的参数未设定默认值也是允许的

- 只有`undefined`才会使用默认值                 `  null 是有效的 `

- 可以是`表达式`

  ```js
  function aa(a,b=1,c=2) {
      console.log(a, b, c);
  }
  aa(4,5,6)   //4 5 6
  aa('',null,undefined)   //null 2
  aa('','',undefined)     //2
  aa('','',0)      //0
  ```

-  默认参数引用其它参数的场景只发生在引用之前的参数，即前面的参数不能访问后面的参数 

  >  调用 add(undefined, 1) 发生错误是因为 second 在 first 之后定义，所以 first 无法访问 second 的值，要想知道缘由，就需要重温一重要概念：暂存性死区。 

  ```js
  function add(first = second, second) {
      return first + second;
  }
  
  console.log(add(1, 1));         // 2
  console.log(add(undefined, 1)); // 抛出错误
  ```

  

###  arguments   `少用`

- 无默认参数,arguments和形参有映射---->改1个另一个自动修改
- 有默认参数(`至少一个`)无映射关系,`  arguments 总是反映出函数的首次调用状态 `



### 剩余参数

>  设计剩余参数的目的是用来替代 ECMAScript 中的 arguments。 

-  使用数组来包含所有的剩余参数 

- 函数只能有一个剩余参数，且必须放在最后的位置

-  剩余函数不能被用在对象字面量中的 setter 上 

  >  对象字面量中的 setter 只被允许接受单个参数，而规范中的剩余参数可以接受无限个数的参数，所以它是不被允许的。 



```js
function fn(a,...b){
	console.log(a,b)  //1,[2,3,4]
}
fn(1,2,3,4)	
```

```js
// 语法错误：剩余参数后不应有命名参数
function pick(object, ...keys, last) {

}
```

```js
let object = {

    // 语法错误：不能在 setter 上使用剩余参数
    set name(...value) {
        // do something
    }
};
```

### 函数 name

> 　 name 属性的作用是为了在调试时获得有用的相关信息，所以 name 属性值是获取不到相关函数的引用的 

```js
function doSomething() {
    // ...
}

var doAnotherThing = function() {
    // ...
};

console.log(doSomething.name);          // "doSomething"
console.log(doAnotherThing.name);       // "doAnotherThing"
```

### 函数调用方式

>  如何判断函数的调用方式，ES5 的判断方式`instanceof`，ES6 会有 `new.target` 用于判断 

```js
function Person(name) {
    if (this instanceof Person) {
        this.name = name;   // 使用 new
    } else {
        throw new Error("你必须使用 new 来调用 Person。")
    }
}

var person = new Person("Nicholas");
var notAPerson = Person("Nicholas");  // 抛出错误
```

```js
function Person(name) {
    if (typeof new.target !== "undefined") {
        this.name = name;   // 使用 new
    } else {
        throw new Error("你必须使用 new 来调用 Person。")
    }
}

var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael");    // 错误！
```

### 箭头函数

> ​     this 的值很容易丢失，使得程序以意想之外的方式运行，而箭头函数解决了该问题
>
> ​     箭头函数被定义为 `“用完即扔”` 的函数，所以不能被用来定义新类型  , 证据是箭头函数不存在一般函数中包含的 prototype 属性。使用 new 来调用箭头函数会发生错误 

-  没有 this，super，arguments 和 new.target 绑定 `由上下文决定`
-   不能更改 this `  call()，apply() 或 bind()  `
- 没有 prototype,不能被 new 调用
-  没有 arguments 对象   
-  不允许重复的命名参数 - 不论是在严格模式还是非严格模式下，箭头函数都不允许重复的命名参数存在，相比传统的函数，它们只有在严格模式下才禁止该种行为。 

#### 写法

>  当不想使用传统的函数主体形式返回一个对象字面量的时候，必须将该对象放在括号中 
>
>  将对象字面量放在括号内代表其并非为函数主体。 

```js
var getTempItem = id => ({ id: id, name: "Temp" });

// 等同于：

var getTempItem = function(id) {

    return {
        id: id,
        name: "Temp"
    };
};
```

### 尾调优化

>  尾调用优化允许某些函数的调用被优化，以便减少调用栈的大小和内存占用，防止堆栈溢出。当符合相应条件时该优化会由引擎自动实现，然而你可以有目的地重写某些函数以便利用它。 

该优化需要如下条件：

1. 尾调用不能引用当前堆栈帧中的变量（即尾调用的函数不能是闭包）
2. 使用尾调用的函数在尾调用结束后不能做额外的操作
3. 尾调用函数值作为当前函数的返回值

## 对象

### 对象类别

- 常规对象（ordinary object）拥有 JavaScript 对象所有的默认行为。
- 特异对象（exotic object）的某些内部行为和默认的有所差异。
- 标准对象（standard object）是 ECMAScript 6 中定义的对象，例如 Array, Date 等，它们既可能是常规也可能是特异对象。
- 内置对象（built-in object）指 JavaScript 执行环境开始运行时已存在的对象。标准对象均为内置对象。

### 计算属性名

- 总结:`属性名可以是变量`

>  对象字面量内的方括号说明该属性名需要计算得到，得出的结果是以一个字符串。

​		 这些属性名的计算结果为 "first name" 和 "last name"，而且这些名称可以晚些时候用来引用属性。填入紧跟在对象实例后的方括号中的值同样能引用对象字面量中动态的计算属性名。 

```js
var suffix = " name";

var person = {
    ["first" + suffix]: "Nicholas",
    ["last" + suffix]: "Zakas"
};

console.log(person["first name"]);      // "Nicholas"
console.log(person["last name"]);       // "Zakas"
```

### 新增方法

#### Objcet.is()

>  `目的:`ECMAScript 6 引入了 Object.is() 方法来补偿严格等于操作符怪异行为的过失。 
>
> `定义:` 该函数接受两个参数并在它们相等的返回 true 。只有两者在`类型`和`值`都相同的情况下才会判为相等。 

```js
console.log(+0 == -0);              // true
console.log(+0 === -0);             // true
console.log(Object.is(+0, -0));     // false

console.log(NaN == NaN);            // false
console.log(NaN === NaN);           // false
console.log(Object.is(NaN, NaN));   // true

console.log(5 == 5);                // true
console.log(5 == "5");              // true
console.log(5 === 5);               // true
console.log(5 === "5");             // false
console.log(Object.is(5, 5));       // true
console.log(Object.is(5, "5"));     // false
```

- 使用场景

  >  	很多情况下 Object.is() 的表现和 === 是相同的。它们之间的`区别`是前者认为 +0 和 -0 不相等而 NaN 和 NaN 则是相同的。不过弃用后者是完全没有必要的。何时选择 Object.is() 与 == 或 === 取决于代码的实际情况。 

#### Object.assign()

## 解构:更方便的数据访问

> `由来:`若有一个嵌套的数据结构需要遍历以寻找信息,你可能会为了一点数据而挖掘整个结构,这就是WS6要给对象与数组添加解构

### 总结

- 通用
  1. 未声明过的变量需要声明,声明过的`最外层`需要加`()`
  
   ```js
     ({ type, name } = node); //必须加括号
   ```
  
  2. 右侧可以设置默认值 `let { loc: { start }} = {}; `
  
- 对象

1. `:`修改变量名  左侧是解构出来的值  右侧是`自己想改成的变量名`
2. `:{}`向下继续解构   `let { loc: { start }} = node;    //提取node.loc.start`

- 数组
  1. 交换变量      `[a,b] = [b,a]`
  2. `=`  右侧填写默认值
  3. 忽略项用`,`跳过
  4. `...`剩余项,`浅克隆`

### 对象解构

1. var  let const 

   - 未声明过的变量需要进行声明  `const不使用解构也必须赋值(定义为常量)`

   - 已声明变量利用解构重新赋值时必须加括号

     > 注意你必须在`圆括号`内才能使用解构表达式。这是因为`暴露的花括号`会被解析为`块声明语句`，而该语句不能存在于赋值操作符的左侧。圆括号的存在预示着之后的花括号不是块声明语句而应该被看作表达式，这样它才能正常工作。解构赋值表达式会计算右侧的值（= 右侧）

   ```js
   let node = {
           type: "Identifier",
           name: "foo"
       },
       type = "Literal",
       name = 5;
   # 加括号
   ({ type, name } = node); //必须加括号
   ```

 2. 默认值

    - 本地变量在对象中没有找到同名属性,赋值undefined

      ```js
      let node = {
              type: "Identifier",
              name: "foo"
      }
      let {type,name,value }= node
      console.log(type);      // "Identifier"
      console.log(name);      // "foo"
      console.log(value);     // undefined
      
      ```
    
    - 选择性定义默认值,属性不存在时使用该值 
    
      > 对应属性  `缺失` 或`undefined`, 变量为`null`不会赋值默认值


~~~js
  let node = {
          type: "Identifier",
          name: "foo"
  }
  let {type,name,value=true }= node
  console.log(type);      // "Identifier"
        console.log(name);      // "foo"
        console.log(value);     // true
~~~

3. 赋值本地不同的变量名

   冒号`左侧`标识符代表需要`检查的位置`,冒号`右侧`是`赋值的目标`

   ```js
   let node = {
           type: "Identifier",
           name: "foo"
       };
   
   let { type: localType, name: localName } = node;
   
   console.log(localType);     // "Identifier"
   console.log(localName);     // "foo"
   ```

4. 默认值+改变量名

   ```js
   let node = {
           type: "Identifier"
       };
   
   let { type: localType, name: localName = "bar" } = node;
   
   console.log(localType);     // "Identifier"
   console.log(localName);     // "bar"
   ```

5. 嵌套解构

   冒号`右侧`存在`花括号`时,表示目标`被嵌套`在对象的`更深一层`中

   `注意:`空白的花括号在对象解构中是合法的,但是不会做任何事

   ```js
   let node = {
           type: "Identifier",
           name: "foo",
           loc: {
               start: {
                   line: 1,
                   column: 1
               },
               end: {
                   line: 1,
                   column: 4
               }
           }
       };
   
   let { loc: { start }} = node;    //提取node.loc.start
   
   console.log(start.line);        // 1
   console.log(start.column);      // 1
   ```

### 数组解构

1. 变量名为任意值

2. 赋的值与位置有关
3. 忽略项用`,`跳过
4. 首次使用需要`声明 var let const`
5. 数组本身并为改变

#### 交换变量

```js
// 在 ECMAScript 6 中交换变量的值
let a = 1,
    b = 2;

[ a, b ] = [ b, a ];

console.log(a);     // 2
console.log(b);     // 1
```



#### 默认值

> 当指定位置不存在、或其值为`undefined`,那么该默认值就会被使用

```js
let colors = [ "red" ];

let [ firstColor, secondColor = "green" ] = colors;

console.log(firstColor);        // "red"
console.log(secondColor);       // "green"
```

#### 嵌套解构

> 解构中插入另一个数组模式,解构操作就会下行到嵌套的数组中

```js
let colors = [ "red", [ "green", "lightgreen" ], "blue" ];

// 之后

let [ firstColor, [ secondColor ] ] = colors;

console.log(firstColor);        // "red"
console.log(secondColor);       // "green"
```

#### 剩余项

> ...语法将剩余的项目赋值给一个指定的变量

1. 指定变量 `放在解构模式的最后,之后不能有 , 否则报错`
2. 克隆数组 `浅克隆`
   - 数组包含对象 `慎用`
   - 数组包含数组 `慎用`

```js
let colors = [ "red", "green", "blue" ];

let [ firstColor, ...restColors ] = colors;

console.log(firstColor);        // "red"
console.log(restColors.length); // 2
console.log(restColors[0]);     // "green"
console.log(restColors[1]);     // "blue"
```

```js
// ECMAScript 6 中克隆数组的方法
let colors = [ "red", "green", "blue" ];
let [ ...clonedColors ] = colors;

console.log(clonedColors);      //"[red,green,blue]"
```



### 混合解构

```js
let node = {
        type: "Identifier",
        name: "foo",
        loc: {
            start: {
                line: 1,
                column: 1
            },
            end: {
                line: 1,
                column: 4
            }
        },
        range: [0, 3]
    };

let {
    loc: { start },
    range: [ startIndex ]
} = node;

console.log(start.line);        // 1
console.log(start.column);      // 1
console.log(startIndex);        // 0
```

### 参数解构

1. 解构参数在没有传递值的情况下类似与常规参数,它们会被设为undefined
2. 可以使用`默认参数` `混合参数`  `使用与属性不同的变量名`

### 解构的参数是必须的(右侧)

1. 赋值右侧为`null`或`undefined`时,解构会抛出错误
2. 赋值右侧可以设置`默认值`

```js
function setCookie(name, value, { secure, path, domain, expires } = {}) {

    // ...
}
```

## 符号

## set与map	

### Object

- key不会区分`数值`和`字符串`,`数值类型`的key会在内部转换为`字符串`,因此`obj['5']`和`obj[5]`引用的是同一个属性

- `对象的`key不能是`对象`,只能是`字符串`,`key1`和`key2`会被转换为字符串`"[objcet object]"`,`key1`和`key2`被转换为同一个字符串,所以打印的value是`同一个值`

  ```js
  let obj = {},
  key1 = {},
  key2 = {};
  obj[key1] = 'str'
  console.log(obj[key2])  //str
  ```

### 为什么新增set与map

- in运算符

  若属性存在返回`true`而无需读取对象的属性值,但是`in`会查找原型,使得在处理原型为`null`的对象时才是`安全的`

  ```js
  #,in会向原型进行查找
  let obj = {
  	a:1
  }
  let a= Object.create(obj)
  a.b = 2
  for(let k in a){
  	console.log(a[k])
  }
  //2
  //1
  
  ```

- 判断

```js
let obj = {};
obj.count = 1
//是想检查count属性是否存在,还是向检查非零值
if	(obj.count){
//...
}

```



### Set

> 无重复值的有序列表,Set允许对它包含的数据进行快速访问,从而增加了一个追踪离散值的更有效的方式
>
> Set构造器可以接收`任意`可迭代`对象`作为参数,能用数组是因为他们默认就是可迭代的
>
> 拥有`size`属性,表示包含多少项
>
> `场景`检查某个值是否存在

**Set特点**

1. Set不会使用强制类型转换来判断值是否重复,可以`5`和`'5'`共存(数值`5`和,字符串`"5"`)

2. Set内部使用object.is()判断两个值是否相等,唯一的例外`+0`和`-0`在Set中被判断为`相等`

   ```js
   # ===比较
   -0 === 0  //true
   #Object.is() 比较
   Object.is(-0,0) // false
   # new Set() 判断
   let a = new Set()
   a.add(-0)    //Set(1) {0}
   a.add(0)    //Set(1) {0}
   ```

3. 由于不会强制类型转换为字符串,所以可以向Set添加对象,不会被合并

4. 多次执行`add()`方法,不会重复添加数据,第一次之后再调用会被忽略掉

**方法**

```js
#操作方法
let set = new Set()
set.add(5)  //添加
set.has(5)   //测试某个值是否存在
set.delete(5) //移除
set.clear()  //移除所有的值


#遍历方法
keys()    //所有键的数组
values()  //所有值的数组
forEach() //遍历
entries() // 返回一个包含所有键值对的数组

#entries 没想到什么场景适用
let a = new Set([1,2,3,4,5,{aa:1}])
let b = a.entries()
let  c = Array.from(b)
//[Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
0: Array(2)
0: 1
1: 1
length: 2
__proto__: Array(0)
1: Array(2)
0: 2
1: 2
length: 2
__proto__: Array(0)
2: Array(2)
0: 3
1: 3
length: 2
__proto__: Array(0)
3: Array(2)
0: 4
1: 4
length: 2
__proto__: Array(0)
4: Array(2)
0: 5
1: 5
length: 2
__proto__: Array(0)
5: Array(2)
0:
aa: 1
__proto__: Object
1:
aa: 1
__proto__: Object
length: 2
__proto__: Array(0)
length: 6
__proto__: Array(0)
```

**forEach**

​		与数组类似,接收三个参数,使用方法与数组相同,回调函数使用this,可以给forEach传递this作为第二个参数

**forEach参数**

1. Set中下个位置的值
2. 与第一个参数相同的值
3. 目标Set自身

**第一个和第二个参数为什么是相同的**

​	数组和Map都会给回调函数传递三个参数,前两个参数分别是`下个位置的值`和`键(数组使用的键是索引)`

​	Set没有键,为了保持参数相同,将Set中的每一项同时认定为`键`与`值`,这样Set前两个参数就相同了,与数组和Map的forEach保持一致了

```js
Set(5) {1, 2, 3, 4, "a"}
[[Entries]]
0: 1
1: 2
2: 3		//键		
value: 3    //值
3: 4
value: 4
4: "a"			//键
value: "a"		//值
size: 5
__proto__: Set
```

**Set转换为数组**

```js
#去重 转为数组
let set = new Set([1,2,3,4,1,2,3]),
ary = [...set];
console.log(ary)   [1, 2, 3, 4]

```

**应用**

- `去重:`利用不会重复添加的特性,可以用来初始化数组

  ```js
  let set = new Set([1,2,3,4,1,2])
  console.log(set) // Set(4) {1, 2, 3, 4}
  ```

- `判断`使用`has()`判断某个值是否存在

**Weak Set**

​		只要对于Set实例的引用仍然存在,所储存的对象就`无法`被垃圾回收机制回收,从而无法释放内存

​		该类型只允许储存`对象`的`弱引用`,而`不能`储存基本类型的`值`,对象的弱引用在它自己称为该对象的`唯一`引用时,不会阻止垃圾回收

```js
#Set 
let set = new Set();
let key = {};

set.add(key)

 console.log(set.size) //1
//取消原始引用
key =  null;
//但是另一份引用仍然存在与set内部
console.log(set.size) //1     
```

​		使用方法与Set类似,都有`add`,`has`,`delete`方法

​		Weak Set和Set最大的`区别`是对象的`弱引用`

```js
#WeakSet
let set = new WeakSet();
let key = {};

set.add(key)

 console.log(set.has(key)) //true
//移除对于键的最后一个引用,同时从Weak Set中移除
key =  null;
```

​		代码执行到key = null后,WeakSet中的key引用就不能再访问了,不可能核实这一点,因为需要把对于该对象的一个引用传递给has()方法,而只要存在其他引用,WeakSet内部的弱引用就不会消失

​	**WeakSet和Set区别**

1. WeakSet调用add()传入非对象参数,会`报错`,has和delete传入非对象参数返回false

 	2. WeakSet不可迭代,所以没有for-of
 	3. WeakSet没有forEach方法
 	4. WeakSet没有size属性
 	5. WeakSet无法暴露出任何迭代器(keys(),value()),因此不能判断WeakSet内容

`WeakSet场景:`

- 正确管理内存
- 若只想追踪对象的引用,应当使用WeakSet而不是set

​		

### map

> Set给你了处理值列表的新方式,不过若需要给这些值添加额外信息,它就没用了,这就是ES6添加Map类型的原因
>
> 键值对的有序列表,键和值都可以是任意类型,有`size`属性,用于指明包含了多少个键值对
>
> `场景`常被用做缓存,储存数据以便此后快速`检索`

**方法**

- set 设置属性
- get  读取属性 , 没有返回`undefined`

```js
# set 设置 get 读取
let map = new Map()
map.set('str','string')

map.get('str')  //"string"

```

**Map与set共用方法**

- has
- delete
- clear

**初始化**

1. 接收数组格式,内部每一项也必须是数组,第一项是`键`,第二项是`值`
2. 键允许为任意数据类型,将键储存在数组中,确保在添加map之前不被强制转换为其他类型的值

```js
let map = new Map([['name','nihao'],['age','18']])
console.log(map)
Map(2) {"name" => "nihao", "age" => "18"}
```

**forEach**

- 下个位置的`值`
- 改值对应的`键`
- 自身

**weak Map**

主要用途关联`数据`与`DOM元素`,功能类似weak Set

**weak Map 与 Map**

1. weak Map不能使用`forEach`,`clear`,`size`
2. 只想使用对象类型的键,选择weak Map,因为会自动销毁,优化内存
3. 需要使用检测功能,Map是更好的选择,注意内存的使用
4. 想使用非对象的键,Map是唯一的选择

## 迭代器

​    大多对目前渣渣的我都用不上,还比较深,选择性写了

### for-of

​		在不可迭代对象 、null 或undefined上使用for-of语句,会抛出错误 

### 集合迭代器

- entrises 包含键与值
- keys 包含键
- values 包含值

## import export

1. export

   >  `export`语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。 

### 最佳实践

> `export:` 导入 导出 都需要加`括号`
>
> `export default:` 导入 导出 `不`加括号

|          |                       export                       |                     export default                     | 备注                              |
| :------: | :------------------------------------------------: | :----------------------------------------------------: | --------------------------------- |
|    值    |                   export var a=1                   | var a = 1 export default a<br />export default 1<br /> | `default不能接var`                |
|   函数   |                   export func a                    |                  export default func                   |                                   |
|          |         function f() {}<br /> export {f};          |            func aa{}<br />export default aa            |                                   |
|  class   |                  export class bb                   |           class aaa<br />export default  aaa           |                                   |
|          |                                                    |                export default class aaa                |                                   |
| 统一导出 | var a<br />func b<br />class c<br />export {a,b,c} |              声明 a<br />export default a              |                                   |
|          |                                                    |                                                        |                                   |
|  import  |                  import { a,b,c}                   |                  import 自定义变量名                   | `export导出`必须有`括号`          |
|          |                 import * any from                  |                                                        | `export导出的`合并为一个`对象any` |
|    as    |                       a as b                       |                                                        | `用b代替a`                        |



- 导出`值`,`函数`,`class`类型

  > 应该优先考虑使用这种写法。因为这样就可以在脚本尾部，一眼看清楚输出了哪些变量。

  ```js
  #值
  var a = 1;
  var c = 1;
  #函数
  export function f() {
  };
  #class
  class aaa {
      constructor() {
          this.aa = 1
      }
  }
  #导出
  export {
      a,
      c,
      f,
      aaa
  };
  
  //改变导出名称  从出口修改  用b 替换a 导出b
  export {
      a as b,
      c,
  };
  
  import {b, c} from './2.js'
  ```

- 默认导出 `export default`

  >  为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到`export default`命令，为模块指定默认输出。 
  >
  >  - 默认输出
  >  - 其他模块加载该模块时，`import`命令可以为该匿名函数指定`任意名字`
  >  - `import`命令后面，`不`使用`大括号` 
  >  - `export default`命令只能使用`一次 `
  >  - `export default`命令的本质是将后面的值，赋给`default`变量，所以可以直接将一个值写在`export default`之后 --------`第二种写法 导出值`

  ```js
  #第一种写法   不用写名字
  export default function () {
    console.log('foo');
  }
  
  import customName from './export-default';
  customName(); // 'foo'
  
  //导出class  默认导出写名字
  export default class{
      
  }
  
  #第二种写法
  function foo() {
    console.log('foo');
  }
  
  export default foo
  
  
  #第二种写法  导出值
  var a = 1;
  export default a;
  
  
  ```

- 混合写法

  > 正常写

  ```js
  class cc {
  
  }
  export var a =1
  export default cc
  
  import cc, { a } from './2.js';
  ```

- 模块重定向 

  - 第一种  export { foo, bar } from 'my_module';

  >  写成一行以后，`foo`和`bar`实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用`foo`和`bar`。 

  - `第二种`  export * from './1'   导出 export   不能导出export default
  - `第三种`  export {default} from './2'    默认导出

  ```js
  #第一种
  export { foo, bar } from 'my_module';
  
  // 可以简单理解为
  import { foo, bar } from 'my_module';
  export { foo, bar };
  #第二种
  //1.js
  export var b =1
  export var a =22
  //2.js
  export * from './1'   //导出 export   不能导出export default
  //导入
  import {a,b} from './2.js'
  #混用
  //1.js
  export var b =1
  export var a =22
  class cc {}
  export default cc
  //2.js
  export * from './2'
  export {default} from './2'
  //导入
  import cc,{b,a} from './1.js'
  ```

- import * as

  > import * as xxx from ‘xxx’
  >
  > 会将若干`export导出的`内容组合成一个对象返回；

  ```js
  //1.js
  export var b =1
  export var a =22
  //导入
   import * as aaa from './1.js'
    aaa.a   //22
  ```

  

