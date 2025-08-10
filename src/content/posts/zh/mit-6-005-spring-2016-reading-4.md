---
abbrlink: 703bb2b0
categories:
  - CS
  - Software Engineering
date: 2024-09-11 15:00:00
mathjax: true
tags:
  - code-hygiene
  - code-review
  - dry
  - java
  - mit-6-005
  - software-engineering
title: 阅读材料 4 - 代码审查 | MIT 6.005 学习笔记
---

MIT 6.005 Spring 2016 的 [OCW](https://ocw.mit.edu/courses/6-005-software-construction-spring-2016/) 版本的学习笔记。此篇笔记涉及的内容为 Reading 4 Code Review。

<!--more-->

## 课程目标

在今天的课程中，我们将练习：

- 代码审查：阅读并讨论他人写的代码
- 良好编码的一般原则：无论编程语言或程序目的如何，您都可以在每次代码审查中发现的问题

## 代码审查

代码审查是由非代码原作者的人员对源代码进行仔细、系统的研究。 它类似于学期论文的校对。

代码审查实际上有两个目的：

- **改进代码的水平**。查找错误、预测可能出现的错误、检查代码的清晰度以及与项目风格标准的一致性。
- **提升程序员的水平**。代码审查是程序员相互学习新语言特性、项目设计或编码标准变化以及新技术的重要途径。特别是在开源项目中，很多对话都是在代码审查的背景下进行的。

代码审查在 Apache 和 [Mozilla](https://blog.humphd.org/vocamus-1569/?p=1569) 等开源项目中得到广泛应用。代码审查在行业领域也得到广泛应用。在谷歌，只有在其他工程师通过代码审查签字后，才能将任何代码推送到主仓库。

在 6.005 中，我们将按照课程网站上的 [代码审查](https://ocw.mit.edu/ans7870/6/6.005/s16/general/code-review.html) 文档中的描述，对问题集进行代码审查。

### 风格标准

大多数公司和大型项目都有编码风格标准（例如 [Google Java Style](https://google.github.io/styleguide/javaguide.html)）。这些标准可以非常详细，甚至规定了空白（缩进多深）以及大括号和小括号的位置。这类问题往往会引发 "[圣战](https://www.outpost9.com/reference/jargon/jargon_23.html#TAG897)"，因为它们最终会成为品味和风格的问题。

对于 Java，有一个通用的[风格指南](https://www.oracle.com/technetwork/java/javase/documentation/codeconvtoc-136057.html)（遗憾的是没有针对最新版本的 Java 进行更新）。其中有些建议非常具体：

- 开头括号应位于复合语句起始行的末尾；结尾括号应开始一行，并缩进到复合语句的起始处。

在 6.005 中，我们没有此类的官方风格指南。我们不会告诉你把大括号放在哪里。这是每个程序员的个人决定。不过，保持自我一致性很重要，而且遵循你所从事项目的惯例也非常重要。如果你是一个程序员，为了迎合自己的个人风格而修改你所接触的每一个模块，你的队友会讨厌你的，这也是理所当然的。

但有一些规则是非常合理的，它们针对我们的三大属性，比放置大括号更有效。本阅读材料的其余部分将讨论其中的一些规则，至少是与本课程目前的内容相关的规则，在本课程中，我们主要讨论的是编写基本的 Java。当你审阅其他同学的代码时，当你检查自己的代码以求改进时，这些都是你应该开始注意的一些事情。但不要认为这是一份详尽的代码风格指南清单。在本学期的课程中，我们将讨论更多内容 —— 规范、带有表示不变式的抽象数据类型、并发和线程安全 —— 这些都将成为代码审查的素材。

## 恶臭的例子 #1

程序员经常把糟糕的代码形容为有一种需要去除的 "恶臭 (bad smell)"。 "代码卫生 (Code hygiene)" 是另一种说法。 让我们从一些恶臭的代码开始。

```java
public static int dayOfYear(int month, int dayOfMonth, int year) {
    if (month == 2) {
        dayOfMonth += 31;
    } else if (month == 3) {
        dayOfMonth += 59;
    } else if (month == 4) {
        dayOfMonth += 90;
    } else if (month == 5) {
        dayOfMonth += 31 + 28 + 31 + 30;
    } else if (month == 6) {
        dayOfMonth += 31 + 28 + 31 + 30 + 31;
    } else if (month == 7) {
        dayOfMonth += 31 + 28 + 31 + 30 + 31 + 30;
    } else if (month == 8) {
        dayOfMonth += 31 + 28 + 31 + 30 + 31 + 30 + 31;
    } else if (month == 9) {
        dayOfMonth += 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31;
    } else if (month == 10) {
        dayOfMonth += 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30;
    } else if (month == 11) {
        dayOfMonth += 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31;
    } else if (month == 12) {
        dayOfMonth += 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 31;
    }
    return dayOfMonth;
}
```

接下来的几节和练习将指出这段代码示例中的恶臭的地方。

## 不要重复你自己（DRY）

重复的代码是一种安全风险。如果你在两个地方都有相同或非常相似的代码，那么最根本的风险就是两个副本中都有一个错误，而某个维护者修复了其中一个地方的错误，却没有修复另一个地方的错误。

避免重复就像避免过马路时不看路一样。复制粘贴是一种极具诱惑力的编程工具，每次使用它时，你都会感到脊背发凉。复制的代码块越长，风险就越大。

[不要重复自己（Don't Repeat Yourself）](https://en.wikipedia.org/wiki/Don't_repeat_yourself)，简称 DRY，已经成为程序员的口头禅。`dayOfYear` 的例子中充满了相同的代码。 你会如何 DRY 呢？

## 必要时添加注释

关于注释，我想简单说几句。优秀的软件开发人员会在他们的代码中写入注释，而且写得很明智。好的注释应该使代码更容易理解、更安全（因为重要的假设已经记录在案）、更便于修改。

其中一种关键注释是规范，它出现在方法或类的上方，记录了方法或类的行为。 在 Java 中，这种注释通常写成 Javadoc 注释，即以 `/**` 开头并包含 `@`-语法，如方法的 `@param` 和 `@return`。下面是一个规范示例：

```java
/**
 * Compute the hailstone sequence.
 * See http://en.wikipedia.org/wiki/Collatz_conjecture#Statement_of_the_problem
 * @param n starting number of sequence; requires n > 0.
 * @return the hailstone sequence starting at n and ending with 1.
 *         For example, hailstone(3)=[3,10,5,16,8,4,2,1].
 */
public static List<Integer> hailstoneSequence(int n) {
    ...
}
```

规范记录假设 (?)。我们已经多次提到过规范，在以后的阅读中将会有更多关于规范的内容。

另一个关键的注释是说明从别处复制或改编的代码的出处或来源。 这对于软件开发人员来说至关重要，而且当您改编从网上找到的代码时，[6.005 协作政策](https://ocw.mit.edu/ans7870/6/6.005/s16/general/collaboration.html)也要求这样做。下面是一个例子：

```java
// read a web page into a string
// see http://stackoverflow.com/questions/4328711/read-url-to-string-in-few-lines-of-java-code
String mitHomepage = new Scanner(new URL("http://www.mit.edu").openStream(), "UTF-8").useDelimiter("\\A").next();
```

记录源代码的一个原因是避免侵犯版权。 Stack Overflow 上的小型代码片段通常属于公共领域，但从其他来源复制的代码可能是专有代码，或受其他类型的开源许可证保护，这些许可证的限制性更强。记录代码来源的另一个原因是，代码可能会过时。在 Stack Overflow 上，这些代码所来源的答案在首次回答后的几年中已经发生了很大的变化。

有些注释既糟糕又不必要。例如，直接将代码音译为英语，无助于加深理解，因为你应该假设读者至少懂 Java：

```java
while (n != 1) { // test whether n is 1   (don't write comments like this!)
   ++i; // increment i
   l.add(n); // add n to l
}
```

但晦涩难懂的代码应该有注释：

```java
sendMessage("as you wish"); // this basically says "I love you"
```

`dayOfYear` 代码需要一些注释 —— 您会把它们放在哪里？例如，您会在哪里记录 `month` 是从 0 到 11 还是从 1 到 12？

## 快速失败（Failing Fast）

_快速失败 (Failing Fast)_ 意味着代码应尽早暴露其错误。越早发现问题（越接近问题的起因），就越容易发现和修复问题。正如我们在第一次阅读材料中看到的，静态检查比动态检查失败得更快，而动态检查比产生一个可能会破坏后续计算的错误答案失败得更快。

`dayOfYear` 函数不会快速失效 —— 如果你以错误的顺序传递参数，它会安静地返回错误的答案。事实上，按照 `dayOfYear` 的设计方式，非美国人极有可能按错误的顺序传递参数！它需要更多的检查 —— 静态检查或动态检查。

## 避免魔法数字（Avoid Magic Numbers）

计算机科学家认为只有两个常量本身是有效的：0、1，也许还有 2（好吧，三个常量）。

所有其他常量之所以被称为[魔法常量](<https://en.wikipedia.org/wiki/Magic_number_(programming)#Unnamed_numerical_constants>)，是因为它们就像凭空出现的一样，没有任何解释。解释数字的一种方法是使用注释，但更好的方法是将数字声明为一个命名常量，并取一个好听、清晰的名字。

`dayOfYear` 充满了魔法数字：

- 月份 2、......、12 如果用 FEBRUARY、......、DECEMBER 会更好读。
- 如果将月的天数 30、31、28 放在数组、列表或映射等数据结构中，例如 `MONTH_LENGTH[month]`，则会更易读（并消除重复代码）。
- 神秘的数字 59 和 90 是特别有害的神奇数字。它们不仅没有注释和文档，实际上还是程序员 _手工计算的结果_。不要对手工计算的常量进行硬编码。Java 比你更擅长算术。像 31 + 28 这样的显式计算会让这些神秘数字的出处更加清晰。 `MONTH_LENGTH[JANUARY] + MONTH_LENGTH[FEBRUARY]` 就更清楚了。

## 让每个变量只用作一个目的

在 `dayOfYear` 的例子中，参数 `dayOfMonth` 被重复用于计算一个截然不同的值，即函数的返回值，而这个返回值并不是月份的日期。

不要重复使用参数，也不要重复使用变量。变量并不是编程中的稀缺资源。自由引入变量，给它们起个好名字，当你不再需要它们时就停止使用。如果一个变量在几行之后突然有了不同的含义，就会使读者感到困惑。

这不仅是一个易于理解的问题，也是一个防止错误和随时更改的问题。

特别是方法参数，一般来说不应修改。(这对于随时准备更改非常重要 —— 将来，方法的其他部分可能想知道方法的原始参数是什么，所以在计算时不应该把它们删除）。对于方法参数和其他尽可能多的变量，使用 `final` 是个好主意。 `final` 关键字表示该变量永远不得重新赋值，Java 编译器会静态检查该变量。 例如：

```java
public static int dayOfYear(final int month, final int dayOfMonth, final int year) {
    ...
}
```

## 恶臭的例子 #2

在 `dayOfYear` 中存在一个潜在的错误。它完全不处理闰年。 为了解决这个问题，假设我们编写了一个闰年方法。

```java
public static boolean leap(int y) {
    String tmp = String.valueOf(y);
    if (tmp.charAt(2) == '1' || tmp.charAt(2) == '3' || tmp.charAt(2) == 5 || tmp.charAt(2) == '7' || tmp.charAt(2) == '9') {
        if (tmp.charAt(3)=='2'||tmp.charAt(3)=='6') return true; /*R1*/
        else
            return false; /*R2*/
    }else{
        if (tmp.charAt(2) == '0' && tmp.charAt(3) == '0') {
            return false; /*R3*/
        }
        if (tmp.charAt(3)=='0'||tmp.charAt(3)=='4'||tmp.charAt(3)=='8')return true; /*R4*/
    }
    return false; /*R5*/
}
```

这些代码中隐藏了哪些错误？ 又隐藏了哪些已经讨论过的风格问题？

## 使用良好的名字

好的方法和变量名都很长，而且具有自我描述性。通常情况下，通过使用更好的名称来描述方法和变量，使代码本身更具可读性，就可以完全避免注释。

例如，你可以重写下面的代码：

```java
int tmp = 86400;  // tmp is the number of seconds in a day (don't do this!)
```

为：

```java
int secondsPerDay = 86400;
```

一般来说，像 `tmp`、`temp` 和 `data` 这样的变量名非常糟糕，是程序员极度懒惰的表现。每个局部变量都是临时的，每个变量都是数据，所以这些名称通常毫无意义。最好使用更长、描述性更强的名称，这样代码本身就能读得很清楚。

遵循语言的词法命名约定。在 Python 中，类通常是大写的，变量是小写的，并且单词用 `_` 分隔（words_are_separated_by_underscores ）。在 Java 中：

- `methodsAreNamedWithCamelCaseLikeThis`（方法名使用小驼峰）
- `variablesAreAlsoCamelCase`（变量也使用小驼峰）
- `CONSTANTS_ARE_IN_ALL_CAPS_WITH_UNDERSCORES`（常量使用全大写，并用下划线分隔）
- `ClassesAreCapitalized`（类名单词首字母大写）
- `packages.are.lowercase.and.separated.by.dots`（包名为全小写，使用点分隔）

方法名通常是动词短语，如 `getDate` 或 `isUpperCase`，而变量名和类名通常是名词短语。选择短词，简明扼要，但要避免缩写。例如，`message` 比 `msg` 更清楚，`word` 比 `wd` 好得多。请记住，在课堂上和现实生活中，你的许多队友都不是以英语为母语的人，缩写对于非母语的人来说可能更难。

`leap` 方法名称很糟糕：方法名称本身和局部变量名称。 你会怎么称呼它们呢？

## 使用空格来帮助读者

使用一致的缩进。`leap` 示例在这方面做得很差。而 `dayOfYear` 示例则要好得多。事实上，`dayOfYear` 很好地将所有数字排成了一列，便于人类读者进行比较和检查。

在代码行内留出空格，便于阅读。`leap` 示例中有一些行是挤在一起的 —— 请在其中加入一些空格。

切勿使用制表符缩进，只能使用空格符。注意，我们说的是 _字符_，而不是按键。我们并不是说你永远都不应该按 Tab 键，只是说你的编辑器永远都不应该在你按 Tab 键时在源文件中加入制表符。制定这条规则的原因是，不同的工具对制表符的处理方式不同，有时会将其扩展为 4 个空格，有时会扩展为 2 个空格，有时会扩展为 8 个空格。如果您在命令行上运行 "git diff"，或者在不同的编辑器中查看源代码，那么缩进可能会完全错乱。使用空格即可。在按下 Tab 键时，一定要将编程编辑器设置为插入空格字符。

## 恶臭的例子 #3

下面是第三个恶臭的代码示例，它将说明本次阅读材料的其余要点。

```java
public static int LONG_WORD_LENGTH = 5;
public static String longestWord;

public static void countLongWords(List<String> words) {
   int n = 0;
   longestWord = "";
   for (String word: words) {
       if (word.length() > LONG_WORD_LENGTH) ++n;
       if (word.length() > longestWord.length()) longestWord = word;
   }
   System.out.println(n);
}
```

## 不要使用全局变量

避免使用全局变量。让我们来解释一下全局变量的含义。全局变量是：

- 一个 _变量_，一个其含义可以更改的名称
- 它是全局的，可以从程序的任何地方访问和更改

[Why Global Variables Are Bad](https://c2.com/cgi/wiki?GlobalVariablesAreBad) 展示了使用全局变量的诸多风险。

在 Java 中，全局变量声明为 `public static`。修饰符 `public` 使之可以在任何地方访问，而 `static` 是这个变量只有一个实例。

一般来说，请将全局变量改为参数和返回值，或者将它们放在要调用方法的对象中。在以后的阅读材料中，我们会看到很多这样做的技巧。

## 方法应该返回结果，而非打印它们

`countLongWords` 还没有做好改变的准备。它将部分结果发送到控制台 `System.out` 中。这意味着，如果你想在另一种情况下使用它 —— 在这种情况下，数字需要用于其他目的，比如计算而不是给你看 —— 就必须重新编写。

一般来说，只有程序的最高层部分才应该与人类用户或控制台交互。低级部分应将输入作为参数，将输出作为结果返回。唯一的例外是调试输出，它当然可以打印到控制台。但这种输出不应该是设计的一部分，而只能是调试设计的一部分。

## 总结

代码审查是一种广泛使用的通过人工检查来提高软件质量的技术。代码审查可以发现代码中的多种问题，但作为入门读物，本阅读材料讲述的是良好代码的一般原则：

- 不要重复你自己（DRY）
- 必要时添加注释
- 快速失败
- 避免魔法数字
- 让每个变量只用作一个目的
- 使用良好的名字
- 不要使用全局变量
- 返回结果，而非打印它们
- 使用空格以增强可读性

今天阅读材料的主题与优秀软件的三个关键属性的关联如下：

- **远离 Bugs**。一般来说，代码审查是由人工审查员来发现错误的。DRY 代码可以让你只在一个地方修复错误，而不用担心错误会传播到其他地方。清楚地注释你的假设会降低其他程序员引入错误的可能性。快速失败原则可以尽早发现错误。避免使用全局变量可以更容易地定位与变量值相关的错误，因为非全局变量只能在代码中有限的地方更改。
- **易于理解**。代码审查是发现晦涩或混乱代码的唯一途径，因为其他人也在阅读并试图理解这些代码。使用明智的注释、避免神奇的数字、为每个变量保留一个目的、使用好的名称以及良好地使用空白空间，这些都能提高代码的可理解性。
- **为变化做好准备**。如果由经验丰富的软件开发人员进行代码审查，就能帮助我们预测可能发生的变化，并提出防范措施。DRY 代码更易于更改，因为只需在一处进行更改。返回结果而不是打印结果能让代码更容易适应新的用途。
