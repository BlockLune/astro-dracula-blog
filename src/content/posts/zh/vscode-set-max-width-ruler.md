---
abbrlink: bb929dc9
categories:
  - CS
  - Tools
date: 2023-01-13 10:30:04
tags:
  - tool
  - vscode
  - configuration
title: VS Code 中设置显示最大列数边界线
---

很多时候我们会避免一行代码过长，常见的限制有 80 字符、120 个字符等。我希望能在 VS Code 中显示一条边界线来提醒我已经到达这个限制了，需要换行。下边是设置的方法。

<!--more-->

打开设置（快捷键 `Ctrl+,`），搜索 `Editor: Rulers`，点击 “在 settings.json” 中编辑，添加如下内容：

```json
"editor.rulers": [80,120]
```

当然你也可以按照自己的喜好设置字符数。
