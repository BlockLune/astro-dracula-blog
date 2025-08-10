---
title: "Docker: 是什么? 为什么? 怎么用?"
abbrlink: 86a70735
categories:
  - CS
  - Tools
tags:
  - docker
  - containerization
  - software-engineering
  - tool
  - devops
date: 2024-09-03 16:35:32
updated: 2024-12-06 14:46:00
---

作为一个喜欢折腾新玩意儿的人，在网上冲浪时，我经常会去寻找各种各样新式的软件或服务。如果您和我一样也喜欢寻找这些软件，那您可能也会注意到，在安装指南中，越来越多的软件提供了一种使用 Docker 的安装或部署方法。这是什么东西？为什么现在流行使用它？我们又能如何使用它？这篇文章，带您入门 Docker。

<!--more-->

题外话: 这篇文章的标题模仿了朋友的[《RSS: 是什么？为什么？怎么用？》](https://yfi.moe/post/all-about-rss)。那是一篇很不错的文章，推荐您也去看一看。

## 是什么？

维基百科这样描述 Docker：

> Docker is a set of platform as a service (PaaS) products that use OS-level virtualization to deliver software in packages called containers. The service has both free and premium tiers. The software that hosts the containers is called Docker Engine. It was first released in 2013 and is developed by Docker, Inc.
>
> Docker is a tool that is used to automate the deployment of applications in lightweight containers so that applications can work efficiently in different environments in isolation.

简单地讲，借助 Docker 平台，软件开发者可以将应用程序与其依赖项打包到一个可移植的容器中。这些容器可以在任何支持 Docker 的环境中运行，无需担心底层系统的差异。

您可以将 Docker 理解为一种轻量级的虚拟机:

- 这个虚拟机已经配置好了运行特定软件所需的全部或大部分条件，无需您再花时间配置，开箱即用。

但 Docker 又不完全等同于传统虚拟机:

- 传统虚拟机通常很大，因为它在操作系统层面创建一个完整的、与宿主机隔离的环境。我们通常在单个虚拟机环境中做多件事，比如在 Windows 电脑上安装 Ubuntu 虚拟机来学习 Linux 时，我们会在这个虚拟机里安装各种软件、进行各种操作。
- 而 Docker 容器通常很小，因为容器内不包含完整的操作系统，容器之间共享宿主机的操作系统内核。由于它足够轻量、启动速度快、资源利用效率高，我们通常在一个容器中只运行一个特定的应用及其所需服务。

## 为什么？

新工具的诞生总是为了解决现有的问题和痛点。如果您也喜欢折腾，您肯定也经历过，照着网站上的部署和配置指南一步一步走下来，走着走着就走不通了，跑着跑着就报错了等等一系列问题。本身，“折腾” 这个词也就是在说您需要在这个过程中不停地解决问题嘛。造成这些问题的很大一部分原因，就是您的本地环境与开发者预设的环境不一致。而 Docker 允许开发者将他们的运行环境直接打包分享，大大简化了您的 “折腾” 过程。

当然，Docker 的功能不止于此。从更专业一点的角度说，Docker 的流行有几个关键原因:

1. 一致的运行环境：Docker 确保应用程序在开发、测试和生产环境中的一致性，有效解决了 “在我的机器上可以运行” 的问题。
2. 快速部署和扩展：容器可以在几秒钟内启动和停止，使得应用程序的部署和扩展变得更加简单和快速。
3. 资源隔离和优化：Docker 容器提供了良好的资源隔离，同时允许更有效地利用底层硬件资源。
4. 版本控制和可重复性：Docker 镜像可以被版本化，确保应用程序的不同版本可以被精确地重现和部署。

## 怎么用？

### 安装 Docker

上面提到，Docker 容器会共用操作系统的内核。但实际上，Docker 只能使用 Linux Kernel。为了在 macOS 或 Windows 上使用 Docker，实际上需要借助其他方法。在官方文档中推荐使用的是 Docker Desktop，它使用了一个轻量级的虚拟机来运行 Docker。在 macOS 上，您也可以试试 [OrbStack](https://orbstack.dev/)。

对于服务器使用场景，实际上您需要的只是 Docker Engine（以及相应的命令行工具 Docker CLI），具体的安装步骤请参考[这份官方文档](https://docs.docker.com/engine/install/ubuntu/)。

这里特别说一下在国内服务器上安装的情况。由于一些网络问题，您可能无法访问 Docker 官方源。下面是使用阿里云镜像的一种解决方案：

1. 设置 Docker 的 `apt` 存储库：

```bash
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] http://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

2. 安装最新版本：

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3. 修改 Docker 的镜像源（您可以在以下链接中找到您自己的加速器地址：[阿里云](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors) / [华为云](https://console.huaweicloud.com/swr/#/swr/mirror)，也可以参考[这份华为云文档](https://support.huaweicloud.com/usermanual-swr/swr_01_0045.html)）：

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://your-mirror-address.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

4. 检查镜像源是否生效：

```bash
docker info
```

5. 检查是否安装成功：

```bash
sudo docker run hello-world
```

> [!Tip]
> 如果您不希望设置镜像（Mirror），或者即使设置了镜像（Mirror）您还是无法成功拉取某个 Docker 镜像（Image），您也可以尝试下面这个网站提供的加速服务：
>
> - [Docker Proxy](https://dockerproxy.net/)

更多信息，请参见[官方文档](https://docs.docker.com/get-started/get-docker/)。

### 关键概念

在继续之前，必须首先解释一些关键概念。您不需要完全理解它们，但要知道它们的存在。后续的例子可能会帮助您更好地理解这些概念。

- 容器 (`Container`): 一个轻量级、可执行的独立软件包，包含运行某个软件所需的所有内容。
- 镜像 (`Image`): 用于创建容器的只读模板。镜像包含了运行应用程序所需的代码、运行时、库、环境变量和配置文件。
- 标签 (`Tag`): 用于标识镜像不同版本的标识符，由数字、字母等组成。除了容易理解的版本号，还有一些标签带有一些单词，例如如果标签中带有 `alpine`，表明该镜像基于 Alpine Linux，一般而言镜像体积会小很多。
- 仓库 (`Repository`): 用于存储和分发 Docker 镜像的地方。
- 卷 (`Volume`): 用于在容器和主机之间共享数据的目录。如前文所述，Docker 容器可以不严谨地视作一个虚拟机，那么卷就是虚拟机和主机之间的共享文件夹。

可以这样区分容器和镜像：**镜像是一个只读的模板，容器是镜像的运行实例。**

下面给出一些常用命令：

- `docker ps`：列出所有正在运行中的容器
- `docker ps -a`：列出所有容器
- `docker rm`：后跟容器名或容器 ID，用于删除指定的容器
- `docker images`：列出所有镜像
- `docker rmi`：后跟镜像名及其标签（`<镜像名称>:<标签名>`），用于删除指定的镜像
- `docker run`：启动一个容器（具体见后面的例子）
- `docker stop`：后跟一个容器名或容器 ID，停止一个容器
- `docker restart`：后跟一个容器名或容器 ID，重启一个已经停止的容器
- `docker exec`：在容器中运行一条指令，如果希望以交互式 Shell 的形式运行，需要添加 `-it` 选项。例如，在一个名为 `ubuntu-container` 的容器中以交互式 Shell 的形式运行 `bash` 可以用 `docker exec -it ubuntu-container /bin/bash`
- `docker logs`：后跟容器名或容器 ID，查看容器中的日志

### 例子：安装 MySQL（一次性使用）

让我们通过一个简单的例子来演示如何使用 Docker。我们将会创建一个一次性使用的 MySQL 容器。所谓的一次性使用，是指只要这个容器停止，它就会消失。这特别适用于测试或临时使用。

首先，确保您已经安装好了 Docker。然后打开终端，输入下面的命令来创建一个 MySQL 容器：

```bash
docker run --rm --name mysql-container -e MYSQL_ROOT_PASSWORD=your_root_password -p 3306:3306 -d mysql
```

让我们来拆解一下这个命令的各个参数：

- `--rm`：当容器停止时，自动删除容器。
- `--name`：指定容器的名称。
- `-e`：设置环境变量。这里设置了 `MYSQL_ROOT_PASSWORD`，效果是将容器中 MySQL 的 root 密码设置为了 `your_root_password`。
- `-p`：映射端口，冒号前的是主机端口号，冒号后的是容器内的端口号。这里将容器的 3306 端口映射到主机的 3306 端口。
- `-d`：以分离（detached）模式运行，即在后台运行容器。
- `mysql`：镜像名称。如果希望指定某个版本，可以使用 `<镜像名称>:<标签>` 的形式来指定。如果不使用冒号添并添加标签，默认使用的标签是 `latest`（即 “最新” 版本）。

接着，使用下面的命令来检查容器是否成功运行，您应该可以看到一个名为 `mysql-container` 的容器：

```bash
docker ps
```

现在，您的 MySQL 服务器正在启动了。稍等一会，等待它启动完成，然后使用 **本地的 `mysql` 客户端** 连接到它：

```bash
mysql -u root -p -h 127.0.0.1 -P 3306
```

参数解释如下：

- `-u`：指定用户名。
- `-p`：指定使用密码登录。
- `-h`：指定主机名，由于是本地连接，所以使用 `127.0.0.1`。
- `-P`：指定端口。

> [!Tip]
> 您可以使用名为 `mysql` 的本地 MySQL 客户端来连接到这个 MySQL 服务器。如果您使用 Homebrew，您可以这样安装它：
>
> ```bash
> brew install mysql-client
> ```
>
> 但是，既然我们已经使用 Docker 技术了，我们也可以直接用上面创建的这个名为 `mysql-container` 的 Docker 容器中的 `mysql` 客户端。下面的命令使用 `docker exec` 命令以交互式 Shell（`-it`）的形式在 `mysql-container` 中运行 `mysql -u root -p`，从而直接使用该容器中的客户端：
>
> ```bash
> docker exec -it mysql-container mysql -u root -p
> ```

### 例子：安装 MySQL（持久化）

在下面这个例子中，我们将克服上个例子中关于持久化的问题。我们将在一台服务器上安装 MySQL 数据库，并使用卷来持久化配置和数据。

在创建容器之前，我们需要准备一些目录和文件。它们将被用作卷，以便我们可以在容器和主机之间共享数据。这样，我们可以在容器中运行 MySQL 数据库，而数据将被保存在主机上。

```bash
# 创建目录
sudo mkdir -p /var/lib/docker/mysql/data
sudo mkdir -p /etc/docker/mysql/conf.d
sudo mkdir -p /var/log/docker/mysql

# 设置权限
# 假设 MySQL 在容器中使用 UID 999 运行（这是 MySQL 官方镜像的默认值）
sudo chown -R 999:999 /var/lib/docker/mysql/data
sudo chown -R 999:999 /var/log/docker/mysql

# 配置文件目录应该由 root 拥有，因为它包含敏感信息
sudo chown -R root:root /etc/docker/mysql/conf.d
sudo chmod 755 /etc/docker/mysql/conf.d
```

接下来，我们将创建一个 MySQL 容器。下面使用 `docker run` 来创建容器，并：

- 使用 `--name` 选项来指定容器的名称，这里我们将其命名为 `mysql-container`；
- 使用 `-e` 选项来设置环境变量（`e` 的意思是 `env`），这里我们设置了 MySQL 的 root 密码；
- 使用 `-d` 选项来在后台运行容器（`d` 的意思是 `detached`）；
- 使用 `-p` 选项来映射容器的端口到主机的端口（`p` 的意思是 `port`，前面的端口是主机的端口，后面的端口是容器的端口）；
- 使用 `-v` 选项来指定卷（`v` 的意思是 `volume`，同样，冒号前为主机的目录，冒号后为容器的目录）；
- 使用 `--restart always` 选项来设置容器自动重启。

```bash
sudo docker run --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=your_root_password \
  -d -p 3306:3306 \
  -v /var/lib/docker/mysql/data:/var/lib/mysql \
  -v /etc/docker/mysql/conf.d:/etc/mysql/conf.d \
  -v /var/log/docker/mysql:/var/log/mysql \
  --restart always \  # 设置自动重启
  mysql:latest
```

如果忘记使用 `--restart always` 选项指定容器自动重启，您可以使用 `docker update` 命令来更新容器的配置：

```bash
sudo docker update --restart always mysql-container
```

在正式开始使用 MySQL 前，您可能还需要一些自定义配置。例如，允许任意 IP 地址连接到 MySQL 服务器。为此，编辑 `/etc/docker/mysql/conf.d/my.cnf` 如下：

```text
[mysqld]
bind-address = 0.0.0.0
```

配置文件的更改需要重启容器才能生效：

```bash
sudo docker restart mysql-container
```

类似地，直接使用容器中的客户端连接到 MySQL 服务器：

```bash
# 进入容器
sudo docker exec -it mysql-container bash
# 登录 mysql
mysql -u root -p
```

我们可能希望直接远程访问位于这个远程服务器上的 MySQL 服务器。为此，可以首先在 MySQL 中添加一个新用户并给予相应的权限（下面的命令授予了所有权限，但您应该按照您的需要自行设置权限）：

```sql
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

您可能还需要设置服务器的防火墙，允许 3306 端口的访问。

最后，您可以在本地机器上使用下面的命令来远程访问（同样，您的本地机器上需要 `mysql` 客户端！）：

```bash
mysql -u remote_user -p --host your_server_ip
```

如果您本地没有安装 MySQL 客户端，那么，用 Docker 来安装一个吧！

下面使用了一个较小的镜像 [`alpine/mysql`](https://hub.docker.com/r/alpine/mysql)，这是一个基于 Alpine 的 MySQL 客户端的镜像：

```bash
docker run -it --rm alpine/mysql -u remote_user -p --host your_server_ip
```

为了方便使用，您可以直接添加如下 alias：

```bash
alias mysql="docker run -it --rm alpine/mysql"
```

然后就可以直接用上面的 `mysql -u remote_user -p --host your_server_ip` 了。

### Docker Compose

您可能已经注意到了，上面的 `docker run` 命令正变得越来越长！以上两个例子仅仅展示了启动单个 Docker 容器的情况。然而，如果您的应用由多个部分组成，例如一个数据库、一个依赖于该数据库的后端，以及一个前端，您希望将这些部分连接起来并进行统一管理，那么单一的 `docker run` 命令会变得异常复杂。

在这种情况下，Docker Compose 可以派上用场。简单（不严谨）地说，它允许您将多个冗长的 `docker run` 命令保存到文件中，并描述它们的依赖关系等。使用 Docker Compose，您可以用非常简短的命令来启动或停止整个应用。

举个例子，针对之前提到的持久化安装 MySQL，您可以这样操作：

1. 创建一个目录，在其中创建 `docker-compose.yml` 文件，并编辑为：

```yaml
services:
  mysql-container:
    image: mysql:latest
    container_name: mysql-container
    environment:
      MYSQL_ROOT_PASSWORD: your_root_password
    ports:
      - "3306:3306"
    volumes:
      - /var/lib/docker/mysql/data:/var/lib/mysql
      - /etc/docker/mysql/conf.d:/etc/mysql/conf.d
      - /var/log/docker/mysql:/var/log/mysql
    restart: always
```

2. 在当前目录内运行下面的命令：

```bash
docker compose up -d # 以分离模式（后台）运行该 Docker Compose
docker compose ps # 查看容器状态
docker compose logs # 查看日志
docker compose down # 结束运行
```

> [!Tip]
> 过去，Docker Compose 需要您安装名为 `docker-compose` 的独立二进制文件（例如使用 `sudo apt install docker-compose` 进行安装），但现在，Docker Compose 已经成为了 Docker CLI 的一部分，命令格式也从原来的 `docker-compose up -d` 变为 `docker compose up -d`。具体请参考[官方文档](https://docs.docker.com/compose/install/)。

## 学习资源

Docker 的[官方文档站](https://docs.docker.com/)提供了大量的文档。如果您遇到问题，您始终可以在官方文档里找到最新的解决方案。

如果您需要的是一门课程，来自 KodeKloud 的这门 _[Docker Training Course for the Absolute Beginner](https://learn.kodekloud.com/user/courses/docker-training-course-for-the-absolute-beginner)_ 课程是我学习 Docker 的入门课。它不仅提供了课程视频，而且还有练习题和实验环境，并且完全免费。非常推荐您去学习。
