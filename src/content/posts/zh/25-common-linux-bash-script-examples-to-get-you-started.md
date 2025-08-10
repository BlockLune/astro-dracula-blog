---
title: 用 25 个例子带您入门 Linux Bash 脚本（翻译）
tags:
  - translation
  - bash
  - shell
  - bash-script
license: none
date: 2024-12-09 10:15:00
updated: 2024-12-09 14:34:00
---

对 _[25 Common Linux Bash Script Examples to Get You Started](https://www.hostinger.in/tutorials/bash-script-example)_ 一文的中文翻译，原作者是 [Ignas R.](https://www.hostinger.in/tutorials/author/ignasr)。

<!--more-->

> 译注：我稍微修改了展示脚本的方式。原文包含了使用 `nano hello.sh` 等使用 `nano` 编辑器打开某个文件进行编辑的步骤，我省略了这些部分。同时，我会直接用文本（而非图像）展示脚本的运行结果。在做出了如上改变的前提下，为了保持文章的通顺，我的翻译会与原文略有出入。

对于 Linux VPS 爱好者来说，Bash (Bourne-again shell) 是最流行的 Shell 之一，Bash 脚本也是最流行的命令语言之一。自它首次于 1989 年发布以来，它就被大部分 [Linux 发行版](https://www.hostinger.in/tutorials/best-linux-distro)用作默认 Shell。
Bash 脚本允许用户和系统管理员实现流程自动化，节省数百小时的手动工作。值得一提的是，Bash 也适用于 Windows 和 macOS。

本教程将向您介绍什么是 Bash 脚本。它包含二十多个有用的 Bash 脚本示例，让您开始 Bash 脚本之旅。

## Bash 脚本是用来干什么的

在继续讨论 Bash 脚本的用例之前，我们需要详细说明一下什么是 Bash，什么是 Bash 脚本。

Bash 是一个 **命令行界面解释器（command-line interface interpreter）**，在文本窗口中运行。用户可以管理和执行 shell 命令。 另一方面，Bash 脚本（或 shell 脚本）是编写在 Linux 系统上执行的一系列命令的过程。包含这些指令的文件称为 Bash 脚本。

简单地说，Bash 解释器在读取 Bash 脚本的同时执行命令。举例而言，Linux 用户只需运行一个脚本就能执行数百条命令，而不用逐条输入。因此，Bash 脚本是提高工作效率、设置自动化和消除重复任务的首选。

## 25 个 Bash 脚本的例子

下文将介绍 25 个最常用的 Bash 脚本示例，包括变量操作和打印各种值。我们还将介绍函数、数组、循环等内容。

### Hello World

**Hello World** 是最简单的 Bash 脚本，适合我们入门。我们将会创建一个名为 `learningbash` 的变量并打印出 **Hello World**。使用您的编辑器创建一个新的脚本文件（例如名为 `hello.sh`），打开它，并编辑如下内容：

```bash
#!/bin/bash
#Creates a new variable with a value of "Hello World"
learningbash="Hello World"
echo $learningbash
```

退出编辑后，键入 `bash hello.sh` 并按下回车来运行这段脚本，输出如下：

```text
Hello World
```

第一行（`/bin/bash`）用于每个 Bash 脚本。它告诉操作系统使用 Bash 作为命令解释器。

> [!Tip]
> 译注：这个第一行内容（形如 `#!/bin/bash` 的内容）叫作 [Shebang](<https://en.wikipedia.org/wiki/Shebang_(Unix)>)。
>
> 此处我们使用 `bash hello.sh` 来运行这段脚本，所以其实不加 Shebang 也无所谓。
>
> 但如果我们使用下面的命令来执行：
>
> ```bash
> chmod +x ./hello.sh # 为 hello.sh 添加执行权限
> ./hello.sh # 直接执行 hello.sh
> ```
>
> 那么 Shebang 就会发挥作用了。
>
> 有时，从兼容性角度考虑，我们也可以将此处的 Shebang 写作：
>
> ```bash
> #!/usr/bin/env bash
> ```
>
> 另一个要提一嘴的内容是变量的定义。必须使用 `<变量名>=<变量值>` 的形式定义变量，注意不能有空格。如果使用了 `<变量名> = <变量值>`，Bash 就会将 `<变量名>` 认作命令，`=` 和 `<变量值>` 认作参数。

### Echo 命令

`echo` 命令可以用于打印文本或变量的值。在下面的例子中，我们将会演示引号是如何影响 `echo` 命令的。创建 `echo.sh`，它创建一个新的变量并打印出来，但使用不同的引号：

```bash
#!/bin/bash
provider="Hostinger"
echo 'The best hosting provider is $provider'
echo "The best hosting provider is $provider"
```

运行结果如下：

```text
The best hosting provider is $provider
The best hosting provider is Hostinger
```

可以看到，如果使用双引号 `"`，那么脚本会打印出变量的实际值；相反，如果使用单引号 `'`，那就只会打印出变量的名称。

> [!Tip]
> 译注：`echo` 支持一个 `-e` 选项，用于启用反斜杠（`\`）转义。

### Sleep 命令

Sleep 命令会停止所有当前运行的 Bash 脚本。创建一个 `sleep.sh` 文件，内容如下：

```bash
#!/bin/bash
sleep 10 && echo "I’ve been sleeping for 10 seconds, I want more" && sleep 10 && echo "I’m done sleeping, thanks!"
```

输出如下：

```text
I’ve been sleeping for 10 seconds, I want more
I’m done sleeping, thanks!
```

上面的示例以一个简单的 `sleep` 命令开始，它会让系统休眠 10 秒钟。然后，我们将之前学习过的 `echo` 命令与 `sleep` 命令结合起来，这样系统就会休眠 10 秒，然后打印出一些单词，再次休眠，再次打印出一些单词并结束运行。

> [!Tip]
> 您可以按下 `Ctrl + C` 来终止一个 Bash 脚本的运行。

### Wait 命令

`wait` 是一条内置的 [Linux 命令](https://www.hostinger.in/tutorials/linux-commands)，用于等待运行中的进程完成。在使用 `wait` 命令时，需要输入特定的进程 ID 或 Job ID。

创建 `wait.sh` 并编辑为：

```bash
#!/bin/bash
wait 1234
echo “Done”
```

> [!Important]
> 如果没有给定 Job ID，`wait` 命令将会等待所有子后台任务完成。

### 注释

用户可以使用 `#` 符号在 Bash 脚本中轻松地添加注释。如果您有一个很长的脚本并需要对其中的某些行进行解释，它会很有用。

创建 `comments.sh` 并编辑为：

```bash
#!/bin/bash
# Define a variable named Hostinger
provider="Hostinger"
# Print out the following text
echo 'The best hosting provider is $provider'
# Print out the following text with $provider variable value
echo "The best hosting provider is $provider"
```

输出如下：

```text
The best hosting provider is $provider
The best hosting provider is Hostinger
```

注意 Bash 脚本中的注释仅在文本编辑器中可见（意思就是 Bash 在解释脚本的时候会忽略它们）。

### 获取用户输入

为了获取用户输入，我们需要使用 `read` 命令。创建 `read.sh` 并编辑为：

```bash
#!/bin/bash
echo "What is your age?"
read age
echo "Wow, you look younger than $age years old"
```

在上面的例子中，用户会输入一个 `age` 值。输出将会通过 `echo` 命令打印出来。

> [!Tip]
> 译注：使用 `-p` 选项来指定一个提示词（Prompt）。例如：
>
> ```bash
> read -p "Enter your age: " age
> ```

### 循环

循环是各种编程语言中必不可少的工具。简单地说，[Bash 循环](https://www.hostinger.in/tutorials/bash-for-loop-guide-and-examples/)重复执行一组指令，直到达到用户指定的条件为止。创建 `whileloop.sh` 并编辑为：

```bash
#!/bin/bash
n=0
while :
do
    echo Countdown: $n
    ((n++))
done
```

这将是一个无限计时器，直到您按下 CTRL + C 停止脚本。

> [!Tip]
> 译注：可以写为：
>
> ```bash
> #!/bin/bash
> n=0
> while :; do
>     echo Countdown: $n
>     ((n++))
> done
> ```
>
> `(())` 是 Bash 中用于整数运算和算术表达式求值的复合命令。可以使用 C 风格的表达式语法，且其中的变量不需要使用 `$`。例如：
>
> ```bash
> i=1
> ((i++))  # 等同于 i=$((i+1))
> ((i--))  # 等同于 i=$((i-1))
>
> # 算术运算符: +, -, *, /, %, **（幂运算）
> ((result = 2 ** 3))  # 2的3次方
>
> # 比较运算符: >, <, >=, <=, ==, !=
> ((5 >= 3))  # 返回真
>
> # 位运算符: &, |, ^, ~, <<, >>
> ((result = 8 >> 1))  # 右移一位
>
> # 赋值运算符: =, +=, -=, *=, /=, %=
> ((x += 5))  # 等同于 x=$((x+5))
>
> # 逻辑运算符: &&, ||, !
> ((a && b))  # 逻辑与
> ```

现在我们已经尝试了 While 循环，再来试试 For 循环吧！创建 `forloop.sh` 并编辑为：

```bash
#!/bin/bash
for ((n = 2; n <= 10; n++))
do
    echo "$n seconds"
done
```

输出如下：

```text
2 seconds
3 seconds
4 seconds
5 seconds
6 seconds
7 seconds
8 seconds
9 seconds
10 seconds
```

脚本会打印出从 2 到 10 的数字，同时添加 `seconds` 后缀。

### 创建数组

[Bash 数组](https://www.hostinger.in/tutorials/bash-array) 是一个设计成使用索引来存取信息的数据结构。如果用户需要快速存储和检索成千上万的数据，它就显得格外有用。Bash 数组的特别之处在于，与其他编程语言不同，它可以存储不同类型的元素。例如，您可以用一个 Bash 数组来同时存储字符串和数字。

创建 `array.sh` 并编辑为：

```bash
#!/bin/bash
# Create an indexed array
IndexedArray=(egg burger milk)
# Iterate over the array to get all the values
for i in "${IndexedArray[@]}"; do
    echo "$i";
done
```

输出如下：

```text
egg
burger
milk
```

脚本会遍历 `IndexedArray` 并打印出所有值。

> [!Tip]
> 译注：`@` 的含意是 “全部参数”，可以理解为 `at all`。下面还会提到一个 `#` 符号，表示长度、个数。
>
> ```bash
> # 脚本参数
> function show_args() {
>     echo "参数个数: $#"
>     echo "所有参数: $@"
> }
> show_args a b c
> # 输出：
> # 参数个数: 3
> # 所有参数: a b c
>
> # 数组操作
> arr=(x y z)
> echo "数组元素个数: ${#arr[@]}"
> echo "所有数组元素: ${arr[@]}"
> # 输出：
> # 数组元素个数: 3
> # 所有数组元素: x y z
> ```

### 条件语句

最流行和广泛使用的条件语句是 `if`。 尽管 `if` 语句易于编写和理解，但它也可用于高级 Shell 脚本。

创建 `if.sh` 并编辑为：

```bash
#!/bin/bash
salary=1000
expenses=800

# Check if salary and expenses are equal
if [ $salary == $expenses ]; then
    echo "Salary and expenses are equal"
# Check if salary and expenses are not equal
elif [ $salary != $expenses ]; then
    echo "Salary and expenses are not equal"
fi
```

该脚本创建了两个变量，并比较它们是否相等。

> [!Tip]
> 译注：`[]` 实际上是 `test` 命令的别名，它是 POSIX 标准的一部分。
>
> ```bash
> # 文件测试
> [ -f "file.txt" ]      # 检查文件是否存在且是普通文件
> [ -d "/path" ]         # 检查目录是否存在
> [ -r "file.txt" ]      # 检查文件是否可读
>
> # 字符串测试
> [ -z "$str" ]         # 检查字符串是否为空
> [ -n "$str" ]         # 检查字符串是否非空
> [ "$a" = "$b" ]       # 字符串相等比较（注意：`=` 两边需要空格）
>
> # 数值比较
> [ "$a" -eq "$b" ]     # 等于
> [ "$a" -ne "$b" ]     # 不等于
> [ "$a" -lt "$b" ]     # 小于
> ```
>
> `[[]]` 是扩展测试命令，它是 Bash 特有的功能，更强大但兼容性相对较差（毕竟不是 POSIX 标准的一部分）。它支持更多的操作符和功能，处理空格和特殊字符更安全，并且支持正则表达式匹配。
>
> ```bash
> # 高级字符串比较
> [[ $str == *"pattern"* ]]   # 模式匹配
> [[ $str =~ ^[0-9]+$ ]]      # 正则表达式匹配
>
> # 逻辑运算
> [[ $a == "yes" && $b == "no" ]]   # 逻辑与
> [[ $a == "yes" || $b == "no" ]]   # 逻辑或
>
> # 文件比较
> [[ -f $file && -r $file ]]   # 文件存在且可读
> ```
>
> 主要区别包括：
>
> ```bash
> file="my file.txt"
> [ -f "$file" ]        # 需要引号（因为文件名中有空格）
> [[ -f $file ]]        # 不需要引号，更安全
>
> # [] 需要使用 -a 和 -o
> [ "$a" = "1" -a "$b" = "2" ]    # 逻辑与
> # [[]] 可以使用 && 和 ||
> [[ $a = "1" && $b = "2" ]]      # 更直观
> ```
>
> 使用 `man test` 来查看更多信息。

### 函数

Bash 函数是一系列可重复使用多次的命令集合。

创建 `function.sh` 并编辑为：

```bash
#!/bin/bash
hello() {
    echo 'Hello World!'
}
hello
```

### 显示字符串长度

在 Bash 中有多种方法来同级字符串的长度。让我们先来看最简单的。

创建 `stringlength.sh` 并编辑为：

```bash
#!/bin/bash
# Create a new string
mystring="lets count the length of this string"
i=${#mystring}
echo "Length: $i"
```

此处的 `#` 操作符被用于获取字符串变量的长度。

### 提取字符串

如果用户需要删除字符串中不必要的部分，可以使用 Bash 字符串提取工具。

创建 `extractstring.sh` 并编辑为下面的内容。这段脚本中有四个值，其中三个是字符串。在这个例子中，我们希望提取出数字部分的值。这可以通过 `cut` 命令来完成。首先，我们使用 `-d` / `--delimiter` 选项告诉 `cut` 命令我们的值是用逗号（`,`）分隔的，接着我们用 `-f` / `--fields` 指示我们希望提取第五个值：

```bash
#!/bin/bash
cut -d , -f 5 <<< "Website,Domain,DNS,SMTP,5005"
```

输出如下：

```text
5005
```

在下面这个例子中，我们有一个混合了一些数字的字符串。我们使用 `expr substr` 命令来提取 **Hostinger** 文本值（第一个 7 表示开始位置，从 1 开始计数；第二个 9 表示长度，Hostinger 长 9 个字符故此处为 9）。

```bash
#!/bin/bash
expr substr "458449Hostinger4132" 7 9
```

输出如下：

```text
Hostinger
```

### 查找并替换字符串

另一个有用的字符串操作是查找并替换。

创建 `findreplace.sh` 并编辑为：

```bash
#!/bin/bash
first="I drive a BMW and Volvo"
second="Audi"
echo "${first/BMW/"$second"}"
```

输出如下：

```text
I drive a Audi and Volvo
```

查找和替换功能不需要任何特殊命令，只需操作字符串即可完成。

### 拼接字符串

拼接（Concatenation）的含意是将一个字符串追加到另一个字符串末尾。

创建 `concatenation.sh` 并编辑为：

```bash
#!/bin/bash
firststring="The secret is..."
secondstring="Bash"
thirdstring="$firststring$secondstring"
echo "$thirdstring"
```

上面的脚本通过创建新的 `thirdstring` 变量 将 `firststring` 和 `secondstring` 拼接起来。

更高级的示例如下：

```bash
#!/bin/bash
firststring="The secret is..."
firststring+="Bash"
echo "$firststring"
```

这个脚本使用 `+=` 操作符来拼接字符串。通过这种方法，您可以仅用一个变量拼接字符串。

### 判断奇数与偶数

可以使用 `if` 语句来轻松地区分奇数与偶数。

创建 `evenoddnumbers.sh` 并编辑为：

```bash
#!/bin/bash
read -p "Enter a number and I will check if its odd or even " mynumber
if [ $((mynumber % 2)) -eq 0 ]; then
    echo "Your number is even"
else
    echo "Your number is odd."
fi
```

脚本使用 `read` 命令来读取输入，然后将其模 2 以判断余数。如果余数为 0，则是偶数，否则是奇数。

### 阶乘

一个数字的阶乘是所有正整数递减的结果。例如，5 的阶乘是 120：

```text
5! = 5 * 4 * 3 * 2 * 1 = 120
```

阶乘脚本有助于我们学习递归。创建 `factorial.sh` 并编辑为：

```bash
#!/bin/bash
echo Enter the number you want to get factorial for
read mynumber
factorial=1
for ((i = 1; i <= mynumber; i++)); do
    factorial=$(($factorial * $i))
done
echo $factorial
```

示例输入和输出如下：

```text
Enter number you want to get factorial for
5
120
```

### 创建目录

除非需要快速创建大量目录，否则在 Bash 中创建目录并不费力。在下面的示例中，我们将使用 Bash 脚本创建一组目录，每个目录都有相同的子目录。

创建 `directories.sh` 并编辑为：

```bash
#!/bin/bash
mkdir -p {Math,English,Geography,Arts}/{notes,examresults,portfolio}
```

该脚本创建了 4 个主目录：**Math**，**English**，**Geography** 和 **Arts**。在每个主目录中，分别又创建了 **nots**，**examresults** 和 **portfolio** 子目录。

### 读入文件

为了演示在 Bash 中读入文件，您需要首先创建一个示例文件。例如，创建 `mysamplefile.txt` 并编辑为：

```text
Out of all scripting languages, bash is the most popular one. It allows programmers to run scripts effortlessly in a variety of Linux distros.
```

然后创建脚本文件 `readfiles.sh`，编辑为：

```bash
#!/bin/bash
myvalue=`cat mysamplefile.txt`
echo "$myvalue"
```

### 打印带有行号的文件

让我们以带行号的形式打印一个文件。首先创建 `cars.txt`，编辑为：

```text
Audi
BMW
Bentley
Maserati
Seat
Volvo
```

创建脚本 `printlines.sh`，编辑为：

```bash

#!/bin/bash
myfile='cars.txt'
i=1
while read lines; do
    echo "$i : $lines"
    i=$((i + 1))
done < $myfile
```

### 删除文件

为了删除一个文件，您可以首先使用 `if` 判断文件是否存在，如果存在就删除它。

创建 `deletefiles.sh` 并编辑为：

```bash

#!/bin/bash
myfile='cars.txt'
touch $myfile
if [ -f $myfile ]; then
    rm cars.txt
    echo "$myfile deleted"
fi
```

### 测试文件是否存在

为了检查指定文件是否存在，用户可以执行条件测试。在本例中，我们将使用带有 `-f` 标志的 `if` 语句。该标记会检查给定文件是否存在，并且是否是常规文件。

创建 `exists.sh` 并编辑为：

```bash
#!/bin/bash
MyFile=cars.txt
if [ -f "$MyFile" ]; then
    echo "$MyFile exists."
else
    echo "$MyFile does not exist."
fi
```

### 检查 Inodes 和磁盘使用情况

Inode 代表物理或虚拟服务器上的数据单元。每个文本文件、视频、文件夹、HTML 文件或脚本都是一个 inode。我们将检查一个目录中有多少个 inode，因为过多的 inode 会导致系统明显变慢。

创建 `inodesdisk.sh` 并编辑为：

```bash
#!/bin/bash
find . -printf "%h\n" | cut -d/ -f-2 | sort | uniq -c | sort -rn
du -shc * | sort -rh
```

输出将会类似于：

```text
     15 .
      3 ./.local
      2 ./cassandra
      1 ./.ssh
      1 ./.config
      1 ./.cache
20K     total
4.0K    readfiles.sh
4.0K    printlines.sh
4.0K    mysamplefile.txt
4.0K    inodesdisk.sh
4.0K    cars.txt
```

这告诉我们目录包含 15 个 inodes，所有文件占用了 20K 大小。

### 发送 Email

通过 Bash 脚本发送 Email 是可能的。为此，用户首先需要一个 Email 传输软件。在 Ubuntu 22.04 上，安装命令如下：

```bash
sudo apt install mailutils
```

一旦您安装好了 Email 传输软件，创建脚本 `mail.sh` 并编辑为：

```bash
#!/bin/bash
Recipient="myawesomeinbox@domain.tld"
Mysubject="Regarding our talk"
Mymessage="Call me"
`mail -s $Mysubject $Recipients <<< $Mymessage`
```

> [!Important]
> 上面的脚本出于测试目的，并不能面向像是 Gmail 这样的服务正常工作。相反，我们推荐使用 [PHPMailer](https://www.hostinger.in/tutorials/send-emails-using-php-mail)。

### 更新包

保持系统及其软件是最新的很重要。您可以创建一个脚本来干这件事情。注意这个脚本需要 `root` 权限才能运行。

创建 `maintenance.sh` 并编辑为：

```bash
#!/bin/bash
apt update
apt upgrade
```

确保您在运行该脚本时使用了 `sudo`：

```bash
sudo bash maintenance.sh
```

> [!Important]
> Apt 包管理器仅在基于 Debian 的发行版上可用。如果您使用不同的发行版，确保您使用了对应的命令。

### 展示服务器信息

下面的脚本会列出一些重要的服务器信息：系统时间，开机时间，内存用量，以及网络用量数据。

创建 `system.sh` 并编辑为：

```bash
#!/bin/bash
echo "Date"
date
echo "Uptime"
uptime
echo "Memory Usage"
free -m
echo "Network Usage"
ip a
```

## 总结

Linux bash 脚本对于希望将复杂的命令序列毫不费力地转换成一个脚本的用户来说非常有用。在本教程中，我们介绍了 bash 脚本的基础知识，以及如何使用它来自动执行任务并提高工作效率。希望本文能帮助您更好地理解 bash 脚本。您还可以查看我们的 bash 脚本教程，了解更多。 如果您有任何问题或意见，请在源地址下面留言。

## 译者附

### 取变量值与参数扩展

在上述第一个例子中，我们定义了变量 `learningbash` 并使用 `$learningbash` 取得了它的值。而在获取字符串长度的例子中，我们定义了变量 `mystring` 并使用了 `${#mystring}` 来取得其长度。

事实上，应该使用 `${learningbash}` 来替代 `$learningbash`，这样更安全、清晰：

```bash
myhello="Hello"
# 这样会出错，shell 会尝试寻找名为 myhelloworld 的变量
echo "$myhelloworld"
# 这样正确，明确界定了变量名的范围
echo "${myhello}world"
```

除了使用 `#` 获得字符串长度，以及上面还提到的查找并替换，还有以下相关用法：

```bash
# 子字符串
echo ${myhello:0:2} # 输出 he

# 替换第一个 l 为 L
echo ${myhello/l/L}

# 默认值
${var:-default}    # 如果 var 未设置或为空，返回 default
${var:=default}    # 如果 var 未设置或为空，将 var 设为 default 并返回
${var:+value}      # 如果 var 已设置且不为空，返回 value，否则返回空
${var:?message}    # 如果 var 未设置或为空，打印错误信息并退出脚本
```

### Case 语句

类似于 C 语言中的 `switch`，语法如下：

```bash
case expression in
    pattern1)
        # 如果匹配 pattern1，执行此处的代码
        ;;
    pattern2)
        # 如果匹配 pattern2，执行此处的代码
        ;;
    *)
        # 上述情况均不满足，执行此处的代码
        ;;
esac
```

### 调试

调试 Bash 脚本最有用的技巧之一是在脚本开头设置 `set -x` 选项。这个选项会启用调试模式，使 Bash 将执行的每一条命令打印到终端，并在前面加上一个 `+` 号。

```bash
#!/bin/bash
set -x
# 您的脚本从此处开始
```

如果您希望您的脚本在出错的地方立刻退出，可以使用 `set -e`：

```bash
#!/bin/bash
set -e
# 您的脚本从此处开始
```

### 相关阅读

- [Bash Scripting Tutorial – Linux Shell Script and Command Line for Beginners](https://www.freecodecamp.org/news/bash-scripting-tutorial-linux-shell-script-and-command-line-for-beginners/#heading-advantages-of-bash-scripting)
