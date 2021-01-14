# vuex

**vuex是什么**

全局唯一状态管理器

**唯一性**

初始化阶段,会向每个实例混入`vuexInit`,引用父组件`$store`

```js
 /*Vuex的init钩子，会存入每一个Vue实例等钩子列表*/
  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      /*存在store其实代表的就是Root节点，直接执行store（function时）或者使用store（非function）*/
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      /*子组件直接从父组件中获取$store，这样就保证了所有组件都公用了全局的同一份store*/
      this.$store = options.parent.$store
    }
  }
```



**vuex解决了哪些问题**

​	父子组件,兄弟组件之间共享状态,往往需要写很多没有必要的代码.

​	如果不对状态进行管理,状态在什么时候,由于什么原因,如何变化就会不受控制,就很难跟踪和测试了

1. 传参
   - 多层组件传参
   - 兄弟组件传参
2. 不同组件引用同一状态

**如何解决的**

​	把组件之间需要共享的状态抽取出来,遵循特定的约定,统一来管理,让状态的变化可以预测

**什么时候用vuex**

1. 多层组件依赖同一状态
2. 不同组件引用同一状态

**vuex的核心概念**

state getter mutations actions mudules

