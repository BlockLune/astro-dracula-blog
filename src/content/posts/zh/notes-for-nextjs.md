---
abbrlink: cca59e58
categories:
  - CS
  - Web
date: 2024-09-06 11:35:57
tags:
  - nextjs
  - react
  - full-stack
  - web-development
  - server-components
  - note
title: NextJS 笔记
---

这是一篇课堂笔记，课程为 Udemy [React - The Complete Guide 2024](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)。该笔记包含了该课程中有关 NextJS 的部分内容。

<!--more-->

NextJS 允许你使用 React 开发全栈应用。

## 服务端组件

在 NextJS 中，你使用常规的 JSX 语法创建组件。但在默认情况下，这些组件都是服务端组件（React Server Components, RSC），这意味着，如果你在其中添加一句 `console.log()`，然后打开浏览器的控制台，你并不能在此处看到任何输出。相反，你可以在你运行这个 NextJS App 的终端中看到它们。

```jsx
export default function Page() {
  // console.log("My component!"); // no output on client side
  return <p>My component!</p>;
}
```

原生 React 中就存在着客户端与服务端组件的区分，但是当我们使用 Vite 等构建系统时，默认都使用客户端组件。
使用服务端组件的好处是：服务端会将最后渲染完成的代码发给客户端显示，它们更小，并且对 SEO 更友好（因为如果使用客户端组件，页面实际上都是空的，其中的内容都是其中的 JS 代码在填充；而使用服务端组件，右键查看源代码，可以看到显示的就是已经渲染的组件的代码）。
但是，不是所有的 React 功能都在服务端组件可用，例如 Hooks、事件处理就仅在客户端组件中可用（这是合理的）。

为了在 NextJS 中使用客户端组件，需要在组件文件首行添加：

```jsx
"use client";
```

## App 路由

NextJS 使用一个基于目录的路由，默认推荐使用的是 App Router。在项目目录中，你可以找到一个名为 `app` 的目录。通过在此目录下创建相应的文件，就可以创建出路由。例如，如果希望创建 `/about` 页面，就需要在 `app` 中创建 `about` 目录，并在其中添加 `page.js`。你必须遵循特定的名称，这些特定名称的文件对应不同的功能：

- `page.js`：定义页面组件
- `layout.js`：定义页面的包装器
- `not-found.js`：定义 404 页面
- `error.js`：定义错误页面
- `loading.js`：定义加载页面
- `route.js`：创建 API 路由，它不返回 JSX 代码，而直接返回 JSON 数据
- ...（更多见 [文档](https://nextjs.org/docs/app/api-reference/file-conventions)）

顺便一说，既可以使用 `.js`，也可以使用 `.jsx`。
现在你可以在 `app/about/page.js` 中定义关于页面的组件了。该组件的名称是无关紧要的：

```jsx
export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

为了在 NextJS 中切换路由，可以这样做：

```jsx
import Link from "next/link";
// ...
<Link href="/about">Go to about</Link>;
```

## 动态路由

如果我们有很多博客文章，它们位于 `/posts/post-1` 、`/posts/post-2` 等等路由下。我们可以在`posts` 目录下，创建一个特殊的以 `[]` 包裹的目录，例如 `[slug]`，然后在其中编辑 `page.js`：

```jsx
export default function BlogPostPage({ params }) {
  return <h1>{params.slug}</h1>;
}
```

> "Slug" 指的是一种用于生成 URL 的字符串。它是一个较短的、可读的、通常是唯一的标识符，用于在 URL 中表示某个特定的资源。它通常是从资源的标题或名称中派生出来的，并且通常是小写字母、数字和连字符的组合，以便在浏览器中更容易阅读和理解。
>
> 例如，如果你有一篇博客文章标题为 “如何学习编程”，那么对应的 slug 可能是 “ru-he-xue-xi-bian-cheng”。

## 获取路由的路径

为了获取当前路由，可以使用 `usePathname`:

```jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const path = usePathname();
  return (
    <Link href={href} className={path.startsWith(href) ? "active" : undefined}>
      {" "}
      {children}{" "}
    </Link>
  );
}
```

## Layout

NextJS 允许你使用 `layout.js` 来决定页面应该如何显示在什么位置。项目中必须包含一个 `RootLayout`，它定义在 `app/layout.js` 中：

```jsx
import "./global.css";

export const metadata = {
  title: "NextJS Course App",
  description: "Your first NextJS app!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

注意到两件事情：

- 我们在该函数组件中使用了 `<html>` 和 `<body>`，这在一般的 React 项目中是没有的；
- 我们没有在 `<html>` 中包含 `<head>` 并定义一些 metadata，相反，我们导出了一个名为 `metadata` 的变量，并在其中配置了一些 metadata。事实上，变量 `metadata` 在 NextJS 中是保留的，它会自动地插入到最后生成的 HTML 中。

你也可以创建一个嵌套的 Layout，只需要在子目录中创建一个 `layout.js`。这个 Layout 始终会嵌套在上层 Layout 中。

## 网站图标

通过在 `app` 目录下直接添加一个名为 `icon` 的文件（例如 `icon.png`），就可以将该图片作为 NextJS App 的 Favicon。

## 自定义组件

可以创建一个与 `app` 同级的目录 `components` 专门用于存放自定义组件，例如，如果存在 `components/header.js`，可以在需要使用它的地方按如下方法使用：

```jsx
import Header from "@/components/header";
// ...
<Header />;
```

导入语句中的 `@` 用于标识根目录。它实际上是个别名，定义于根目录下的 `jsconfig.json` 文件中。

## 图像

就像在原生 React 中那样，你可以使用类似于下面的语句导入一张图片：

```jsx
import logoImg from "@/assets/logo.png";
```

但是，与原生 React 不同的是，你不能这样做：

```jsx
<!-- wrong way in next.js -->
<img src={logoImg} alt="Logo" />
```

而必须使用其 `src` 属性：

```jsx
<img src={logoImg.src} alt="Logo" />
```

但是更建议的做法是，使用 NextJS 提供的 `<Image>`。它提供了**自动的懒加载**、**自动检测图片大小**、**自动为不同设备提供不同大小的图片**、**自动以 WebP 格式传输以提高效率**以及大量其他高级功能（这里添加了 `priority` 关闭了懒加载功能，因为这是个 Logo，始终应该显示）：

```jsx
import Image from 'next/image';
import logoImg from '@/assets/logo.png';

<!-- pass the object directly -->
<Image src={logoImg} alt="Logo" priority />
```

可以使用 `fill` prop，来指定图片填充于父组件定义的空间中。这种方法适用于需要显示长宽未知的图片的情况。

## CSS

在前面我们已经看到了全局 CSS 的导入方法，在我们的 Root Layout 中：

```jsx
import "./global.css";
```

NextJS 还支持 CSS 模块，只需要使用类似 `*.module.css` 的命名方式，就可以使用下面的方法导入并使用该 CSS 定义的内容，并且将其限定在特定的组件中：

```css
.header {
  /* ... */
}

.logo {
  /* ... */
}
```

```jsx
import classes from './header.module.css'; // you can choose any name
// ...
<header className={classes.header}>
  <Link className={classes.logo}>
    <!-- ... -->
  </Link>
</header>
```

## 配置 SQLite 数据库

下面使用 `better-sqlite3` 配置了一个 SQLite 数据库供后面使用：

```bash
npm install better-sqlite3
```

```js
const sql = require("better-sqlite3");
const db = sql("meals.db");

const dummyMeals = [
  {
    title: "Juicy Cheese Burger",
    slug: "juicy-cheese-burger",
    image: "/images/burger.jpg",
    summary: "...",
    instructions: `...`,
    creator: "John Doe",
    creator_email: "johndoe@example.com",
  },
  // ...
];

db.prepare(
  `
   CREATE TABLE IF NOT EXISTS meals (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       slug TEXT NOT NULL UNIQUE,
       title TEXT NOT NULL,
       image TEXT NOT NULL,
       summary TEXT NOT NULL,
       instructions TEXT NOT NULL,
       creator TEXT NOT NULL,
       creator_email TEXT NOT NULL
    )
`
).run();

async function initData() {
  const stmt = db.prepare(`
      INSERT INTO meals VALUES (
         null,
         @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creator_email
      )
   `);

  for (const meal of dummyMeals) {
    stmt.run(meal);
  }
}

initData();
```

## 获取数据

在 NextJS 中，你仍然可以像原生 React 中做的那样，使用 `useEffect` 配合 `fetch` 用请求的方式从某个后端获取数据。
但是，由于我们在使用 NextJS 这样一个全栈框架，我们已经拥有了一个后端。所以，在这里直接操作数据库也是安全的。

创建 `meals.js`：

```js
import sql from "better-sqlite3";
const db = sql("meals.db");

export async function getMeals() {
  // 模拟该操作会花费一些时间
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare("SELECT * FROM meals").all();
}
```

然后，在需要使用它的组件代码中：

- 与原生 React 不同，你可以将组件函数使用 `async` 修饰

```jsx
import { getMeals } from "@/lib/meals";

export default async function MealsPage() {
  const meals = await getMeals();
  // ...
}
```

## 加载

为了添加加载页面，只需要在对应路由的目录下，添加 `loading.js`，并编辑一些自定义的加载代码即可：

```jsx
export default function MealsLoadingPage() {
  return <p>Fetching meals...</p>;
}
```

这样的加载是面向整个页面组件的。如果我们希望只是加载部分元素，可以使用 `Suspense`：

```jsx
import { Suspense } from "react";

async function Meals() {
  const meals = await getMeals();
  // ...
}

// ...

<Suspense fallback={<p>Fetching meals...</p>}>
  <Meals />
</Suspense>;
```

## 错误

通过在对应路由目录下添加 `error.js`，可以创建错误页面。该组件必须是客户端组件：

```jsx
"use client";

export default function Error({ error }) {
  return <h1>An error occured!</h1>;
}
```

## Not Found

通过在对应路由目录下添加 `not-found.js`，可以创建 Not Found 页面。

```jsx
export default function NotFound() {
  return <h1>Not Found</h1>;
}
```

如果希望以编程方式手动切换到 Not Found 组件，可以使用：

```jsx
import { notFound } from "next/navigation";

if (!meal) {
  notFound();
}
```

## Server Action

通过在函数中添加 `'use server';` 可以确保某个函数在服务器上执行，此外，还必须将该函数使用 `async` 修饰。
顺便一说，这个功能在原生 React 中是存在的。但为了让其生效，你必须使用一个像是 NextJS 这样的框架。

```jsx
export default function ShareMealPage() {
  async function shareMeal(formData) {
    'use server';
    const meal = {
      title: formData.get('title'),
      // ...
    };
    // ...
  }

  return (
    <form action={shareMeal}>
      <!-- ... -->
    </form>
  );
}
```

`'use server';` 无法在客户端组件中使用，所以你可能需要将 Server Actions 存储到单独的文件中：

```js
"use server";
import { redirect } from "next/navigation";

export async function shareMeal(formData) {
  const meal = {
    title: formData.get("title"),
    // ...
  };

  // ... server-side validation

  await saveMeal(meal);
  redirect("/meals");
}
```

## 添加 XSS 保护

如果我们需要将用户填写的内容创建为 HTML，就必须添加 XSS 保护。下面的例子还使用 Slugify 来根据标题创建 Slug：

```jsx
// npm install slugify xss
export function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);
}
```

## 保存文件和数据

使用 NodeJS 提供的 `fs`，可以存储将文件存储到服务器本地：

```jsx
import fs from 'node:fs';

export function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('Saving image failed!');
    }
  });

  meal.image = `/images/${fileName}`;
  db.prepare(`
    INSERT INTO meals ...
  `).run(meal);
}
```

但这不是推荐的做法。为了存储文件，最好还是使用像是 AWS S3 这样的服务。

## 使用 `useFormStatus` 管理表单提交状态

```jsx
"use client";

import { useFormStatus } from "react-dom";

export default function MealsFormSubmit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? "Submitting..." : "Share Meal"}
    </button>
  );
}
```

## 使用 `useFormState` 来接受 Server Action Response

注意这里是 `useFormState`，与 `useFormStatus` 区分。它有点像 `useState`。

- 它接受两个参数：第一个是实际应当在表单提交时触发的 Server Action；第二个是表单的初始值。
- 它返回两个参数：第一个是表单初始值，或者 Server Action 的响应；第二个用于和 `form` 绑定。
  需要注意 `useFormState` 仅在客户端组件中可用。

```jsx
'use client';
import { useFormState } from 'react-dom';

export default function ShareMealPage() {
  const [state, formAction] = useFormState(shareMeal, { message: null });
  return (
    <form action={formAction}>
      <!-- ... -->
      { state.message && <p>{ state.message }</p> }
    </form>
  );
}
```

我们还需要更改我们的 Server Action `shareMeal`（添加 `prevState` 作为第一个参数）：

```jsx
export async function shareMeal(prevState, formData) {
  // ...
}
```

## 生产部署和缓存

运行下面的命令来创建生产环境的部署，并启动生产环境的服务器：

```bash
npm run build
npm start
```

我们会遇到一个问题，即我们新添加的内容并不显示。这是因为 NextJS 默认情况下采取一个非常激进的缓存策略，即在创建生产环境的项目文件时，默认静态生成所有页面以供缓存。
为了解决这个问题，我们可以使用 `revalidatePath` ：

```jsx
import revalidatePath from "next/cache";
// ...
await saveMeal(meal);
revalidatePath("/meals"); // only that path, no nest path
redirect("/meals");
```

默认情况下，`revalidatePath` 仅会对 exact 那个目录生效，这是因为它其实可以接受第二个参数，默认值为 `page`。如果希望对当前路由及其子路由均生效，可以使用 `layout`：

```jsx
revalidatePath("/meals", "layout");
```

## 元数据

通过在 Root Layout 中导出 `metadata` 这一变量，我们已经为整个站点设置了元数据：

```jsx
export const metadata = {
  title: "NextLevel Food",
  description: "Delicious meals, shared by a food-loving community.",
};
```

我们也可以为页面单独设置元数据，只需要在对应页面中导出名为 `metadata` 的变量即可。

对于动态页面，你可能希望添加动态的元数据，可以这样做：

```jsx
export async function generateMetadata({ params }) {
  // ...
  return {
    title: /* ... */,
    description: /* ... */,
  };
}
```
