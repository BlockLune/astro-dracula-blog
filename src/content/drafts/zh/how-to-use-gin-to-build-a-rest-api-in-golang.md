---
title: 如何在 Golang 中使用 Gin 创建 REST API
tag:
  - programming-language
  - golang
  - gin
---

本文介绍了 REST API 的基本概念，并使用 Golang 中的 Gin 框架创建一个简单的 REST API。

<!--more-->

## 什么是 REST API

REST 是 Representational State Transfer 的缩写，翻译过来叫做[表现层状态转换](https://zh.wikipedia.org/wiki/%E8%A1%A8%E7%8E%B0%E5%B1%82%E7%8A%B6%E6%80%81%E8%BD%AC%E6%8D%A2)。听名字可唬人了，但通过例子就很好理解。

假如我们有一个学生服务，我们希望实现以下功能：

1. 查询所有学生信息
2. 查询指定学生信息
3. 添加学生信息
4. 更新学生信息
5. 删除学生信息

我们可以通过以下方式实现：

1. 查询所有学生信息：`GET /students`
2. 查询指定学生信息：`GET /students/{id}`
3. 添加学生信息：`POST /students`
4. 更新学生信息：`PUT /students/{id}`
5. 删除学生信息：`DELETE /students/{id}`

其中，`GET`、`POST`、`PUT`、`DELETE` 是 HTTP 请求方法，`/students` 是资源路径，`{id}` 是路径参数。

我们想要获取（Get）相关信息，就用 `GET` 方法，想要删除（Delete）内容，就用 `DELETE` 方法；这些操作都是与学生（Student）相关的，所以资源路径是 `/students`。您看，这样的设计非常直观，符合人类的思维方式，也符合 HTTP 协议的设计原则，所以被广泛应用。

类似这样的 API，就是 REST API（或者也可以叫 RESTful API）。

> [!Tip]
> **单数还是复数？**
> 在上面的例子中，资源路径是 `/students`，而不是 `/student`。这更多的是一种风格偏好，但是建议使用复数形式。

## 创建 REST API 的多种选择

我们可以使用 Golang 的标准 `net/http` 来实现一个 REST API，但是使用现有的框架会容易很多，这些框架包括：

- [Gin](https://github.com/gin-gonic/gin)
- [beego](https://github.com/beego/beego)
- [echo](https://github.com/labstack/echo)

这些框架提供了包括路由、参数绑定、验证、中间件等功能，其中有的甚至内置了 ORM。而如果您只是想要一个 HTTP Router，那么可以使用：

- [FastHttp](https://github.com/valyala/fasthttp)
- [gorilla/mux](https://github.com/gorilla/mux)
- [HttpRouter](https://github.com/julienschmidt/httprouter)
- [chi](https://github.com/go-chi/chi)

在本文中，我们将使用其中最为流行的 Gin 来创建一个简单的 REST API。

## 使用 Gin 创建 REST API

首先，我们需要安装 Gin：

```bash
go get -u github.com/gin-gonic/gin
```

然后像这样编辑 `main.go` 文件：

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
}
```
