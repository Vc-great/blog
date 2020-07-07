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

1. 传参
   - 多层组件传参
   - 兄弟组件传参
2. 不同组件引用同一状态

**什么时候用vuex**

1. 多层组件依赖同一状态
2. 不同组件引用同一状态

**vuex的核心概念**

state getter mutations actions mudules

