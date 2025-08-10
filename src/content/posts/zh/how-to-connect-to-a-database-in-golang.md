---
title: 如何在 Golang 中连接数据库
tags:
  - programming-language
  - golang
  - database
date: 2024-11-11 19:05:00
updated: 2024-11-28 17:03:00
---

本文以 MySQL 和 PostgreSQL 为例，介绍了如何在 Golang 中连接数据库。我将从使用 Docker 创建一个 MySQL 或 PostgreSQL 容器等准备工作开始，逐步引导您完成连接数据库的过程。我会介绍四种方法：使用 `database/sql` 包，使用 `GORM`，使用 `sqlx`，以及使用 `sqlc`。

<!--more-->

## 准备数据库（以 Docker 为例）

您需要准备一个 MySQL 和/或一个 PostgreSQL。

如果您安装了 Docker，可以使用以下命令快速创建即用即删的 MySQL 或 PostgreSQL 容器以供测试。我写了一篇[文章](/zh/posts/docker-what-why-how)简单介绍了 Docker，如果您不清楚什么是 Docker，可以看一看。

下面的命令创建一个名为 `mysql-server` 的 MySQL 容器，用户名为 `root`，密码为 `password`，使用 `3306` 端口，并附带一个名为 `example_db` 的数据库：

```bash
docker run --rm --name mysql-server -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=example_db -p 3306:3306 -d mysql
```

下面的命令创建一个名为 `postgres-server` 的 PostgreSQL 容器，用户名为 `postgres`，密码为 `password`，使用 `5432` 端口，并附带一个名为 `example_db` 的数据库：

```bash
docker run --rm --name postgres-server -e POSTGRES_PASSWORD=password -e POSTGRES_DB=example_db -p 5432:5432 -d postgres
```

## 准备环境变量

为了在 Go 中连接数据库，我们需要一些连接信息，这些信息包括：

- 主机名 HOST
- 端口 PORT
- 数据库名 NAME
- 用户名 USER
- 用户密码 PASSWORD

出于安全和可配置等原因，我们不应将这些信息直接写入源代码中。一个推荐的做法是使用环境变量进行管理。我创建了如下环境变量：

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

如果您使用的是上面所说的以 Docker 方式创建的数据库，这些信息应当如下：

MySQL 版本：

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=example_db
DB_USER=root
DB_PASSWORD=password
```

PostgreSQL 版本：

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=example_db
DB_USER=postgres
DB_PASSWORD=password
```

## 第一种方法：使用标准库的 `database/sql` 包

### 创建示例项目并连接数据库

创建一个目录 `go-db-example` 并在其中运行下面的命令来创建一个 Go 项目：

```bash
go mod init example/db
```

**可选地**，您可以安装一个 [godotenv](https://github.com/joho/godotenv) 来使程序自动地从项目中的 `.env` 文件中读取环境变量：

```bash
go get github.com/joho/godotenv
```

为了连接数据库，您需要一个 **驱动程序（Driver）**：

- MySQL：[github.com/go-sql-driver/mysql](https://github.com/go-sql-driver/mysql)
- PostgreSQL: [github.com/lib/pq](https://github.com/lib/pq)

运行下面的命令将这些依赖项添加到项目中：

```bash
go get github.com/go-sql-driver/mysql
```

```bash
go get github.com/lib/pq
```

然后这样编辑 `main.go` 来连接数据库：

> [!Caution]
> 注意：下面的代码注释了 Postgres 版本的内容，也注释了使用了 godotenv 的代码

```go
package main

import (
    "database/sql"
    "fmt"
    "os"

    // _ "github.com/joho/godotenv/autoload"
    _ "github.com/go-sql-driver/mysql"
    // _ "github.com/lib/pq"
)

var db *sql.DB

func initDb() {
    // get config from env variables
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbName := os.Getenv("DB_NAME")
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")

    // construct the connection string
    // mysql
    connStr := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPassword, dbHost, dbPort, dbName)
    // postgres
    // connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)

    // connect
    var err error
    db, err = sql.Open("mysql", connStr) // mysql
    // db, err = sql.Open("postgres", connStr) // postgres
    if err != nil {
       panic(err)
    }

    // check the connection
    err = db.Ping()
    if err != nil {
       panic(err)
    }
    fmt.Println("Successfully connected to database!")
}

func main() {
    initDb()

    // do something ...

    db.Close()
}
```

测试运行一下：

```bash
go run .
```

如果 `Successfully connected to database!` 成功输出了，那就说明数据库成功连接了。

### 初始化表

下面让我们来创建一张示例表 `users`，表中的数据项定义如下：

```go
type User struct {
    ID       int64
    Email    string
    Password string
}
```

对应的 MySQL 建表语句如下：

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

对应的 PostgreSQL 建表语句如下：

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

> [!Tip]
> PostgreSQL 中的 SERIAL 对应于 MySQL 中的 INT AUTO_INCREMENT 类型

在 Golang 中，使用 [`Exec()`](https://pkg.go.dev/database/sql#DB.Exec) 来执行这样一条建表语句（如果您使用 PostgreSQL，请自行替换）：

```go
func createUsersTable() {
    query := `
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
    `

    _, err := db.Exec(query)
    if err != nil {
        panic(err)
    }
}
```

### 常用操作 CRUD

下面演示四种常用操作，即

- Create
- Read
- Update
- Delete

#### Create

让我们来用 INSERT 插入一条记录，相应的语句无论在 MySQL 中还是在 PostgreSQL 中都是一样的：

```sql
INSERT INTO users (email, password)
VALUES ('i@blocklune.cc', 'password123');
```

但是 Go 代码略微有些区别，体现在占位符上：

首先是 MySQL：

```go
func addUser(email, password string) error {
    query := `
    INSERT INTO users (email, password)
    VALUES (?, ?)
    `

    _, err := db.Exec(query, email, password)
    if err != nil {
        return err
    }

    return nil
}
```

接着是 PostgreSQL：

```go
func addUser(email, password string) error {
    query := `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    `

    _, err := db.Exec(query, email, password)
    if err != nil {
        return err
    }

    return nil
}
```

可以看到 MySQL 中使用 `?` 作为占位符，而 PostgreSQL 中用的是 `$1`, `$2` 等。

> [!Important]
> 从现在开始到这第一种方法结束的代码均 **默认使用 MySQL 语句**，您需要替换占位符以适配 PostgreSQL。

事实上，`Exec()` 的执行结果返回了两个值。我们上面一直只使用了第二个 `error` 类型的值，判断语句执行是否出错。而第一个值的类型为 [`Result`](https://pkg.go.dev/database/sql#Result)，借助它，我们可以获取诸如 “最后插入记录的 ID” 等信息：

```go
result, err := db.Exec(query, email, password)
if err != nil {
    return err
}

userId, err := result.LastInsertId()
if err != nil {
    return err
}
```

> [!Caution]
> 需要注意 PostgreSQL **不支持** 这个 `LastInsertId()`。

如果我们需要执行许多插入操作，我们可以先 “准备” 一下查询语句，以提高性能：

```go
stmt, err := db.Prepare(query)
if err != nil {
    return err
}
defer stmt.Close()

// assumming that there are a lot of records to insert
_, err = stmt.Exec(email, password)
if err != nil {
    return err
}
```

#### Read

可以使用 [`Query()`](https://pkg.go.dev/database/sql#DB.Query) 或 [`QueryRow()`](https://pkg.go.dev/database/sql#DB.QueryRow) 来进行查询，区别在于前者返回任意多行，后者返回至多一行：

```go
func getUsers() ([]User, error) {
    query := `
    SELECT id, email, password
    FROM users
    `

    rows, err := db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var user User
        err := rows.Scan(&user.ID, &user.Email, &user.Password)
        if err != nil {
            return nil, err
        }
        users = append(users, user)
    }

    if err = rows.Err(); err != nil {
        return nil, err
    }

    return users, nil
}
```

```go
func getUserByEmail(email string) (*User, error) {
    query := `
    SELECT id, email, password
    FROM users
    WHERE email = ?
    `

    row := db.QueryRow(query, email)

    var user User
    err := row.Scan(&user.ID, &user.Email, &user.Password)
    if err != nil {
        return nil, err
    }

    return &user, nil
}
```

#### Update

```go
func updateUserPassword(email, newPassword string) error {
    query := `
    UPDATE users
    SET password = ?
    WHERE email = ?
    `

    _, err := db.Exec(query, newPassword, email)
    if err != nil {
        return err
    }

    return nil
}
```

#### Delete

```go
func deleteUserByEmail(email string) error {
    query := `
    DELETE FROM users
    WHERE email = ?
    `

    _, err := db.Exec(query, email)
    if err != nil {
        return err
    }

    return nil
}
```

### 完整示例

示例仓库：[BlockLune/go-db-example](https://github.com/BlockLune/go-db-example)

## 第二种方法：使用 `GORM`

在实际工程中，连接数据库更多地采用 ORM 方式。ORM（Object-Relational Mapping，对象关系映射）是一种在面向对象编程语言中实现数据持久化的一种技术。它的基本思想是将关系数据库中的数据表映射到编程语言中的对象，从而允许开发者使用面向对象的编程技术来操作数据库。

[GORM](https://gorm.io/zh_CN/) 是面向 Golang 的一个全功能 ORM 库。下面演示了使用连接 PostgreSQL 并进行 CRUD 操作的流程：

```go
package main

import (
    "fmt"
    "os"

    _ "github.com/joho/godotenv/autoload"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

type User struct {
    ID       uint
    Email    string
    Password string
}

func main() {
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbName := os.Getenv("DB_NAME")
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")

    // dsn means Data Source Name
    dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic(err)
    }

    db.AutoMigrate(&User{})

    // C
    db.Create(&User{Email: "i@blocklune.cc", Password: "password123"})

    // R
    var user User
    db.First(&user, 1)
    fmt.Printf("User with ID 1: %s %s\n", user.Email, user.Password)
    db.First(&user, "email = ?", "i@blocklune.cc")
    fmt.Printf("User with email i@blocklune.cc: %d, %s\n", user.ID, user.Password)

    // U
    db.Model(&user).Update("Password", "password456")
    db.First(&user, 1)
    fmt.Printf("User with ID 1: %s %s\n", user.Email, user.Password)

    // D
    db.Delete(&user, 1)
}
```

## 第三种方法：使用 `sqlx`

TODO

## 第四种方法：使用 `sqlc`

[`sqlc`](https://github.com/sqlc-dev/sqlc) 是一个用于生成 Go 代码的工具，它可以根据 SQL 查询语句生成相应的类型安全的 Go 代码。

具体的步骤请参考：

- [Getting started with MySQL — sqlc 1.27.0 documentation](https://docs.sqlc.dev/en/latest/tutorials/getting-started-mysql.html#)
- [Getting started with PostgreSQL — sqlc 1.27.0 documentation](https://docs.sqlc.dev/en/latest/tutorials/getting-started-postgresql.html)

## 如何选择

下面是各个方法的特点，帮助您进行选择：

- 标准库 `database/sql`：
  - 快速 & 直接
  - 需要手动将 SQL 字段映射到 Go 结构体
  - 容易出错，并且在运行时才会发现它们
- 使用 `GORM`：
  - CRUD 操作已经实现好了，生产环境代码中使用它非常方便
  - 必须学会使用 GORM 的 API 来对数据库进行操作
  - 在高负载情况下，可能会出现性能问题（比标准库慢 3-5 倍）
- 使用 `sqlx`：
  - 非常快速 & 易于使用
  - 通过查询文本和结构体标签来映射字段
  - 运行时才会发现错误
- 使用 `sqlc`：
  - 非常快速 & 易于使用
  - 您只需要定义 SQL 查询，相应的 Go 代码会自动生成
  - 在生成代码前捕获错误

来自 [Udemy 课程](https://www.udemy.com/course/backend-master-class-golang-postgresql-kubernetes/) 的讲师建议优先使用 `sqlc`，否则使用 `sqlx`。

## 参考资料

- [6. Generate CRUD Golang code from SQL | Compare db/sql, gorm, sqlx & sqlc | Learn everything about backend web development: Golang, Postgres, Redis, Gin, gRPC, Docker, Kubernetes, AWS, CI/CD | Udemy](https://www.udemy.com/course/backend-master-class-golang-postgresql-kubernetes/)
- [GORM 指南 | GORM - The fantastic ORM library for Golang, aims to be developer friendly.](https://gorm.io/zh_CN/docs/)
- [Golang MySQL CRUD Example - Golang Docs](https://golangdocs.com/mysql-golang-crud-example)
- [Golang PostgreSQL Example - Golang Docs](https://golangdocs.com/golang-postgresql-example)
- [Tutorial: Accessing a relational database - The Go Programming Language](https://go.dev/doc/tutorial/database-access)
