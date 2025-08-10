---
title: cURL 和 httpie 常用命令速查表
tags:
  - cheat-sheet
  - curl
  - httpie
  - terminal
  - tool
date: 2024-12-03 13:29:17
updated: 2024-12-08 20:42:00
---

[cURL](https://curl.se/) 是一个历史悠久、功能强大的发送和接受数据的工具，而 [httpie](https://httpie.io/) 是一个更加现代化的 HTTP 客户端，提供了更加人性化的命令行体验。本文记录了 cURL 和 httpie 的常用命令和选项，带您快速上手。

<!--more-->

## cURL

`curl` 取自 Client for URLs，是一个命令行工具，支持以包括 HTTP、HTTPS、FTP、SCP 在内的超多种协议进行数据传输。

最简单的用法如下，它将向指定 `URL` 发送一个 GET 请求，并将结果输出到标准输出（`stdout`）：

```bash
curl URL
```

使用 `-v` 或 `--verbose` 选项可以显示请求和响应的详细信息：

```bash
curl -v URL
```

使用 `-V` 或 `--version` 选项可以显示 cURL 的版本信息：

```bash
curl -V
```

### 保存为文件

使用 `-o` 或 `--output` 选项并指定文件名，可以将结果保存到文件：

```bash
curl -o FILENAME URL
```

如果希望使用服务器返回的文件名，可以使用 `-O` 或 `--remote-name` 选项：

```bash
curl -O URL
```

### 请求方法、请求头与请求体

使用 `-X` 或 `--request` 选项指定请求方法，并使用 `-d` 或 `--data` 选项指定请求体：

```bash
curl -X POST -d 'key1=value1&key2=value2' URL
```

在使用 `-d` 的情况下，cURL 默认发送 POST 请求，所以 `-X POST` 可以省略。默认的 Content Type 是 `application/x-www-form-urlencoded`，如果需要发送 JSON 数据，可以使用 `-H` 或 `--header` 选项：

```bash
curl -d '{"key1":"value1"}' -H 'Content-Type: application/json' URL
```

可以使用 `-I` 或 `--head` 选项来仅显示响应头，这实际上是发送了一个 HEAD 请求（`-X HEAD`）：

```bash
curl -I URL
```

### curl 中的跟随重定向

使用 `-L` 或 `--location` 选项可以让 cURL 自动跟随重定向，如果不开启这个选项，cURL 将只显示重定向这样一个响应：

```bash
curl -L URL
```

### curl 中的代理

如果您已经配置了 `http_proxy` 等环境变量，cURL 会自动使用它们。如果需要手动指定代理，可以使用 `-x` 或 `--proxy` 选项：

```bash
curl -x http://proxy:port URL
```

### 典型示例解释

在 GitHub 上您可能经常会看到类似于下面格式的使用 `curl` 的安装命令：

```bash
curl -fsSL https://example.com/install.sh | sh
```

让我们来拆解一下它的含义：

- `-f` 或 `--fail` 选项表示如果请求失败，不输出错误信息；
- `-s` 或 `--silent` 选项表示不输出进度信息；
- `-S` 或 `--show-error` 选项表示显示错误信息；
- `-L` 或 `--location` 选项表示跟随重定向。

最后，如果成功获取了数据，通过管道 `|` 将数据传递给 `sh` 命令执行。

## httpie

`curl` 支持众多协议，而 `httpie` 则专注于 HTTP 协议，提供了更加人性化的命令行体验。

### 安装

使用 `pipx` 来安装 `httpie`：

```bash
pipx install httpie
```

更多安装方式请见 [httpie 官方文档](https://httpie.io/docs/cli/installation)。

### 基本用法

使用 `http` 命令发送 GET 请求：

```bash
http URL
```

使用 `-v` 或 `--verbose` 选项可以显示请求和响应的详细信息：

```bash
http -v URL
```

### 下载文件

使用 `-d` 或 `--download` 将响应保存到文件，文件名将自动猜测：

```bash
http -d URL
```

如果希望指定文件名，使用 `--output` 选项：

```bash
http --output FILENAME URL
```

当然，也可以通过重定向的方式。

### 指定请求方法

为了指定不同的请求方法，可以直接将方法名作为命令行参数：

```bash
http DELETE URL
```

### 修改请求头与请求体

使用 `:` 分隔的键值对来指定请求头，使用 `=` 分隔的键值对来指定 JSON 请求体，下面是一个来自官方文档中的例子：

```bash
http PUT pie.dev/put X-API-Token:123 name=John
```

如果是非字符串的 JSON 数据，可以使用 `:=` 分隔的键值对。下面是来自官方文档中的另一个例子：

```bash
http PUT pie.dev/put \
    name=John \                        # String (default)
    age:=29 \                          # Raw JSON — Number
    married:=false \                   # Raw JSON — Boolean
    hobbies:='["http", "pies"]' \      # Raw JSON — Array
    favorite:='{"tool": "HTTPie"}' \   # Raw JSON — Object
    bookmarks:=@files/data.json \      # Embed JSON file
    description=@files/text.txt        # Embed text file
```

```json
{
  "age": 29,
  "hobbies": ["http", "pies"],
  "description": "John is a nice guy who likes pies.",
  "married": false,
  "name": "John",
  "favorite": {
    "tool": "HTTPie"
  },
  "bookmarks": {
    "HTTPie": "https://httpie.org"
  }
}
```

对于多级 JSON 数据，还可以使用下面这样的格式（同样来自官方文档）：

```bash
http pie.dev/post \
  platform[name]=HTTPie \
  platform[about][mission]='Make APIs simple and intuitive' \
  platform[about][homepage]=httpie.io \
  platform[about][homepage]=httpie.io \
  platform[about][stars]:=54000 \
  platform[apps][]=Terminal \
  platform[apps][]=Desktop \
  platform[apps][]=Web \
  platform[apps][]=Mobile
```

```json
{
  "platform": {
    "name": "HTTPie",
    "about": {
      "mission": "Make APIs simple and intuitive",
      "homepage": "httpie.io",
      "stars": 54000
    },
    "apps": ["Terminal", "Desktop", "Web", "Mobile"]
  }
}
```

### 认证

如果是要进行 `Authorization` 认证，可以组合使用 `-a` 或 `--auth`、`-A` 或 `--auth-type` 选项。

如果只使用 `-a` 或 `--auth` 选项，表示使用 Basic 认证：

```bash
http -a username:password pie.dev/basic-auth/username/password
```

如果希望使用其他认证方式，可以使用 `-A` 或 `--auth-type` 选项：

```bash
https -A bearer -a token pie.dev/bearer
```

### httpie 中的跟随重定向

使用 `-F` 或 `--follow` 选项可以让 `httpie` 跟随重定向：

```bash
http -F URL
```

### httpie 中的代理

`httpie` 同样会读取环境变量以自动设置代理，如果需要手动指定代理，可以使用 `--proxy` 选项：

```bash
http --proxy=http:socks5://user:pass@host:port --proxy=https:socks5://user:pass@host:port example.org
```

## 更多信息

- `man curl`
- `man http`
- [httpie 官方文档](https://httpie.io/docs/cli)
