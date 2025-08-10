---
title: CommonJS 和 ES Modules（翻译）
tags:
  - commonjs
  - es-modules
  - javascript
  - nodejs
  - translation
  - web
date: 2024-12-23 13:13:58
license: none
---

本文是对 _[Modules in JavaScript – CommonJS and ESmodules Explained](https://www.freecodecamp.org/news/modules-in-javascript/)_ 主要内容的中文翻译（准确而言不是完全的翻译，更像是一篇复述或阅读笔记），原作者是 [German Cocca](https://www.freecodecamp.org/news/author/GerCocca/)。

<!--more-->

CommonJS 和 ES Modules 是 JavaScript 模块化的两种主要标准。

## CommonJS

CommonJS 是由 Mozilla 工程师 Kevin Dangoor 在 2009 年启动的一个项目，它是一系列旨在在 JavaScript 中实现模块的标准。它主要通过 Node 在服务端 JS 中使用。（过去，Node 甚至只支持使用 CommonJS 实现模块，不过现在它也支持 ES Modules 了）

```js
// 使用下面的语法（`module.exports = ...`）来导出模块
const mod1Function = () => console.log("Mod1 is alive!");
module.exports = mod1Function;

// 并在其他文件中使用 `require` 来导入
mod1Function = require("./mod1.js");

// 如果希望从一个模块（一个文件）中导出多个内容
module.exports = { mod1Function1, mod1Function2 }(
  // 一次性导入多个内容
  ({ mod1Function1, mod1Function2 } = require("./mod1.js"))
);
```

可以使用 `*.cjs` 的名字命名一个 CommonJS 模块。

## ES Modules

ES Modules 是在 ES6（ES2015）中引入的功能，除了 Node，浏览器环境也支持它。

为了在 Node 环境中使用它，需要在 `package.json` 中添加 `"type": "module"`（~~"//": "Add the line below!" 那一行是从 [vite 源代码](https://github.com/vitejs/vite/blob/49a6be533085a057457c4e403b46be801e707b26/packages/vite/package.json#L86) 中学来的，233~~）：

```json
{
  "name": "moduletestapp",
  "version": "1.0.0",
  "//": "Add the line below!",
  "type": "module"
}
```

或者直接使用 `*.mjs` 命名文件。

如果不这样做，会报错：

```text
(node:29568) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
...
SyntaxError: Cannot use import statement outside a module
```

然后就可以用 `import` 和 `export` 进行导入和导出了。在导入时，可以使用 `as` 来设置别名：

```js
import { mod1Function1 as func1, mod1Function2 as func2 } from "./mod1.js";

func1();
```

此外，还可以将所有导出一次性导入并作为一个对象使用：

```js
import * as mod1 from "./mod1.js";

mod1.mod1Function1();
mod1.mod1Function2();
```

## 使用

在 HTML 中引入模块时，需要添加 `type="module"`：

```html
<script src="./main.js" type="module"></script>
```

否则会报错：

```text
Uncaught SyntaxError: Cannot use import statement outside a module
```

## 打包模块

分模块的代码有助于开发使用，但是不利于生产部署（浏览器必须请求每个模块）。由此，打包器 Bundler 应运而生，例如 [Webpack](https://webpack.js.org/) 或 [Rollup.js](https://rollupjs.org/)。

### Webpack

使用下面的命令安装 Webpack：

```bash
npm i --save-dev webpack webpack-cli
```

创建一个 `webpack.config.js` 并使用下面的代码：

```js
/* webpack.config.js */
const path = require("path");

module.exports = {
  entry: "./main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
```

此处：

- 通过设置 `entry`，Webpack 将会阅读 `main.js` 并开始分析它的所有依赖
- 通过设置 `output`，Webpack 将打包好的内容输出为 `path` 下的 `filename` 文件
- `path` 中的 `resolve` 函数用于构造绝对地址
- `__dirname` 是一个全局变量，值为脚本所在目录

> [!Tip]
> 除了 `__dirname`，还有 `__filename`，它是当前模块的文件名。不过需要注意：`__dirname` 和 `__filename` 仅在 CommonJS 中可用，在 ES Modules 中，应该使用：
>
> ```js
> import.meta.dirname; // The current module's directory name (__dirname)
> import.meta.filename; // The current module's file name (__filename)
> ```

可以在 `package.json` 中的 `scripts` 中加上 `"build": "webpack"`，这样就可以通过运行 `npm run build` 来打包了。
