# mixin

```js
//node_modules/vue/src/core/global-api/mixin.js
import { mergeOptions } from '../util/index'

export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}

```

**mergeOptions**

```

```



## 优先级

1. 混合对象和组件存在`同名`的生命周期方法时,它们都会合并到一个数组中
   - 混合对象的生命周期`优先`执行
   - 组件的同名生命周期方法`后`执行

2. 混合对象的其他选项如`methods`中定义了和组件同名的方法时
   - 组件会覆盖混合对象的同名方法