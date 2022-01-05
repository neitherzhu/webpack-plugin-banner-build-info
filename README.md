# webpack-plugin-banner-build-info

> 打包之后加上一些打包信息（分支，人员，时间等），方便排查问题与找到对应负责人

## Install

Using npm:

```sh
npm install --save-dev webpack-plugin-banner-build-info
```
## Usage

在`webpack`的`plugins`中增加代码
```js
const BannerBuildInfo = require('webpack-plugin-banner-build-info');

"plugins": [
  new BannerBuildInfo({
    email: true, // 从git中获取的email
    author: true, // 从git中获取的name
    branch: true, // 从git中获取的当前的分支
    date: true, // 当前打包时间戳
    mixup: true, // 是否需要混淆
  })
]
```

## 打包后效果

### mixup效果 
```js
/*!
  main%2524%2524%25u8BF8%25u709C%2524%2524zhuw%40shinemo.com%2524%25241641384387312
*/
```

### 普通效果 
```js
/*!
  branch: main
  author: 诸炜
  email: zhuw@shinemo.com
  date: 2022-01-05 20:09:04
*/
```