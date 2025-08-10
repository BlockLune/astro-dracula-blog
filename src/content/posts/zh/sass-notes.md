---
title: Sass 笔记
tags:
  - css
  - sass
  - web
date: 2024-12-23 12:48:09
---

[Sass](https://sass-lang.com/) 是 Syntactically Awesome StyleSheets（语法强大的样式表）之意，是 CSS 的拓展，提供了一些在基本 CSS 中没有的功能，允许您使用变量、嵌套、混合（mixins）、导入等特性来编写更简洁、模块化和可维护的样式表。本文是一篇学习笔记。

<!--more-->

## 语法风格

Sass 有两种[语法风格](https://sass-lang.com/documentation/syntax)：缩进风格（Indented Syntax）和 SCSS（Sassy CSS）。前者使用 `.sass` 扩展名，后者使用 `.scss` 扩展名。SCSS 语法类似于 CSS，几乎就是 CSS 的超集，所以更容易学习和使用。在本文中，我们主要使用 SCSS 语法。

```html
<style type="text/scss"></style>
```

## 变量

使用 `$` 来定义和使用变量。

> [!Tip]
> 注意这儿是 CSS，所以是 `:` 而不是 `=`。

定义：

```scss
$main-fonts: Arial, sans-serif;
$headings-color: green;
```

使用：

```scss
h1 {
  font-family: $main-fonts;
  color: $headings-color;
}
```

## 嵌套

**过去** CSS 不支持嵌套规则：

```css
article {
  height: 200px;
}

article p {
  color: white;
}

article ul {
  color: blue;
}
```

而 Sass 允许您嵌套：

```scss
article {
  height: 200px;

  p {
    color: white;
  }

  ul {
    color: blue;
  }
}
```

> [!Tip]
> 较新版本的 CSS 已经原生支持了[嵌套](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_nesting)功能：
>
> ```css
> /* traditional */
> .header {
>   background: lightcoral;
> }
> .header h1 {
>   font-size: 4rem;
> }
>
> /* new */
> .header {
>   background: lightcoral;
>   h1 {
>     font-size: 4rem;
>   }
> }
> ```

## 规则复用

Sass 中的 mixin 是一组可复用的 CSS 规则。您可以使用 `@mixin` 来定义 mixin，并使用 `@include` 来复用 mixin。例如：

```scss
@mixin reset-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav ul {
  @include reset-list;
}
```

上面的 Sass 的编译结果为：

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

mixin 可以带参数，并设置默认值：

```scss
@mixin text-color($color: black) {
  color: $color;
}

p {
  @include text-color(); /* color: black */
}

nav a {
  @include text-color(orange);
}
```

## 条件判断

可以使用 `@if`、`@else if`、`@else` 等来进行条件判断：

```scss
@mixin text-effect($val) {
  @if $val == danger {
    color: red;
  } @else if $val == alert {
    color: yellow;
  } @else if $val == success {
    color: green;
  } @else {
    color: black;
  }
}
```

## 循环

### for 循环

Sass 中可以使用 `@for` 来进行 for 循环。

有两种用法，`through` 或者 `to`：

- `through` 包含最后一个元素
- `to` 不包括最后一个元素

```scss
@for $i from 1 through 12 {
  .col-#{$i} {
    width: 100%/12 * $i;
  }
}
```

产生如下 CSS：

```css
.col-1 {
  width: 8.33333%;
}

.col-2 {
  width: 16.66667%;
}

... .col-12 {
  width: 100%;
}
```

另一个例子：

```scss
@for $j from 1 to 6 {
  .text-#{$j} {
    font-size: 15px * $j;
  }
}
```

### each 循环

Sass 中另一种循环是 `@each`，用于对列表（List）或映射（Map）进行中的元素进行循环。

列表：

```scss
@each $color in blue, red, green {
  .#{$color}-text {
    color: $color;
  }
}
```

映射：

```scss
$colors: (
  color1: blue,
  color2: red,
  color3: green,
);

@each $key, $color in $colors {
  .#{$color}-text {
    color: $color;
  }
}
```

### while 循环

Sass 中也有 while 循环：

```scss
$x: 1;
@while $x < 13 {
  .col-#{$x} {
    width: 100%/12 * $x;
  }
  $x: $x + 1;
}
```

## 模块文件（Partials）

Sass 中的 _Partials_ 是存放 CSS 代码段的独立文件。

用 `_` 开始的 `*.scss` 文件表明它是一个 Partial，可以在其他 scss 文件中使用 `@import` 导入。例如，有一个 partial 名为 `_mixins.scss`，就可以使用 `@import 'mixins'` 来引入（注意 `_` 和文件后缀名在 import 时需要略去）。

## 扩展

Sass 的 `extend` 特性，允许您基于一个元素的 CSS 规则构建其他规则。用法如下：

```scss
.panel {
  background-color: red;
  height: 70px;
  border: 2px solid green;
}

.big-panel {
  @extend .panel;
  width: 150px;
  font-size: 2em;
}
```

## 参考资料

- [Sass Official Site](https://sass-lang.com/)
- [Sass | Front End Development Libraries | freeCodeCamp](https://www.freecodecamp.org/learn/front-end-development-libraries/#sass)
- [Sass 中文网](https://www.sass.hk/)
