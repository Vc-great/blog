1. 两种模块都要支持时,需调整配置

   ```js
   //相当于commonJS  module.exports 顶级导出
   export.c = 1 //次级导出
   module.exports = {} //顶级导出  顶级导出会覆盖次级导出
   export = function(){
   
   }
   
   //导入一
   let a = require('./a')
   //导入二  需要修改tsconfig.json   'esModuleInterop': true
   import a from './a'
   ```

   