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
      `对应属性缺失` 或`undefined`,`变量为null不会赋值默认值`

      ```js
      let node = {
              type: "Identifier",
              name: "foo"
      }
      let {type,name,value=true }= node
      console.log(type);      // "Identifier"
            console.log(name);      // "foo"
            console.log(value);     // true
      ```

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

