---
abbrlink: 848a7d31
categories:
  - CS
  - Tools
date: 2022-09-15 14:11:07
mathjax: true
tags:
  - latex
  - math
  - note
  - programming-language
title: LaTeX 公式基础
toc: true
---

用 LaTeX 写数学公式的时候，总记不住一些写法，故在此记录学习笔记。

<!--more-->

**注意：由于我博客的一些问题（博客使用 MathJax 渲染，但有些 LaTeX 符号 MathJax 并不支持），这篇文章里有些符号没有被正确渲染出来，请见谅。**

## 常见符号

### 希腊字母

大小写希腊字母的写法区别就在于 LaTeX 符号的首字母大小写。而如果使用 MathJax，这样直接将小写希腊字母的首字母大写的写法是无效的（表中带有"或 \mathrm{...}"的那些），必须使用 `\mathrm{...}`。

若要使用斜体可以在前面加上 `var` 前缀，例如 `\varGamma` 可以用来显示 $\varGamma$ 。也可以使用 `\mathit{...}`，例如使用 `\mathit{\Gamma}` 来显示 $\mathit{\Gamma}$，使用 `\mathit{A}` 来显示 $\mathit{A}$ 。

| 大写字母     | LaTeX 写法             | 小写字母   | LaTeX 写法 |
| ------------ | ---------------------- | ---------- | ---------- |
| $\mathrm{A}$ | \Alpha 或 \mathrm{A}   | $\alpha$   | \alpha     |
| $\mathrm{B}$ | \Beta 或 \mathrm{B}    | $\beta$    | \beta      |
| $\Gamma$     | \Gamma                 | $\gamma$   | \gamma     |
| $\Delta$     | \Delta                 | $\delta$   | \delta     |
| $\mathrm{E}$ | \Epsilon 或 \mathrm{E} | $\epsilon$ | \epsilon   |
| $\mathrm{Z}$ | \Zeta 或 \mathrm{Z}    | $\zeta$    | \zeta      |
| $\mathrm{H}$ | \Eta 或 \mathrm{H}     | $\eta$     | \eta       |
| $\Theta$     | \Theta                 | $\theta$   | \theta     |
| $\mathrm{I}$ | \Iota 或 \mathrm{I}    | $\iota$    | \iota      |
| $\mathrm{K}$ | \Kappa 或 \mathrm{K}   | $\kappa$   | \kappa     |
| $\Lambda$    | \Lambda                | $\lambda$  | \lambda    |
| $\mathrm{M}$ | \Mu 或 \mathrm{M}      | $\mu$      | \mu        |
| $\mathrm{N}$ | \Nu 或 \mathrm{N}      | $\nu$      | \nu        |
| $\Xi$        | \Xi                    | $\xi$      | \xi        |
| $\mathrm{O}$ | \Omicron 或 \mathrm{O} | $\omicron$ | \omicron   |
| $\Pi$        | \Pi                    | $\pi$      | \pi        |
| $\mathrm{P}$ | \Rho 或 \mathrm{P}     | $\rho$     | \rho       |
| $\Sigma$     | \Sigma                 | $\sigma$   | \sigma     |
| $\mathrm{T}$ | \Tau 或 \mathrm{T}     | $\tau$     | \tau       |
| $\Upsilon$   | \Upsilon               | $\upsilon$ | \upsilon   |
| $\Phi$       | \Phi                   | $\phi$     | \phi       |
| $\mathrm{X}$ | \Chi 或 \mathrm{X}     | $\chi$     | \chi       |
| $\Psi$       | \Psi                   | $\psi$     | \psi       |
| $\Omega$     | \Omega                 | $\omega$   | \omega     |

### 运算符

| 渲染结果            | LaTeX 写法        | 记法                                                  |
| ------------------- | ----------------- | ----------------------------------------------------- |
| $\pm$               | \pm               | 英文：**P**lus + **M**inus                            |
| $\mp$               | \mp               | 英文：**M**inus + **P**lus                            |
| $\times$            | \times            | **times** 就有“乘”的意思                              |
| $\div$              | \div              | $6 \div 3=2$ 表述为：Six **div**ided by two is three. |
| $\geq$              | \geq              | “大于等于”的英文：**g**reater than or **eq**ual to    |
| $\leq$              | \leq              | “小于等于”的英文：**l**ess than or **eq**ual to       |
| $\neq$              | \neq              | “不等于”的英文：**n**ot **eq**ual to                  |
| $\approx$           | \approx           | “约等于”的英文：**approx**imately equal to            |
| $\propto$           | \propto           | “正比于”的英文：be **prop**ortional **to**            |
| $\lceil x \rceil$   | \lceil x \rceil   |                                                       |
| $\lfloor x \rfloor$ | \lfloor x \rfloor |                                                       |

### 圈与点

| 渲染结果   | LaTeX 写法          |
| ---------- | ------------------- |
| $^{\circ}$ | \degree 或 ^{\circ} |
| $\circ$    | \circ               |
| $\cdot$    | \cdot               |
| $\cdotp$   | \cdotp              |
| $\cdots$   | \cdots              |
| $\ddots$   | \ddots              |
| $\bullet$  | \bullet             |
| $\dot{a}$  | \dot{a}             |

### 箭头

参考 [MathJax 支持的 Latex 符号总结 (各种箭头符号)\_liyuanbhu 的博客-CSDN 博客](https://blog.csdn.net/liyuanbhu/article/details/51473886)

### 数理逻辑

| 名称     | 渲染结果  | LaTeX 写法      |
| -------- | --------- | --------------- |
| 否定     | $\neg$    | \neg            |
| 合取     | $\land$   | \land 或 \wedge |
| 析取     | $\lor$    | \lor 或 \vee    |
| 双条件   | $\iff$    | \iff            |
| 全称量词 | $\forall$ | \forall         |
| 存在量词 | $\exists$ | \exists         |

### 集合论

| 名称   | 渲染结果      | LaTeX 写法  |
| ------ | ------------- | ----------- |
| 属于   | $\in$         | \in         |
| 不属于 | $\notin$      | \notin      |
| 包含   | $\subseteq$   | \subseteq   |
| 真包含 | $\subset$     | \subset     |
|        | $\supseteq$   | \supseteq   |
|        | $\supset$     | \supset     |
| 空集   | $\varnothing$ | \varnothing |
| 全集   | $\mathit{E}$  | \mathit{E}  |
| 幂集   | $\mathcal{P}$ | \mathcal{P} |
| 交     | $\cap$        | \cap        |
| 并     | $\cup$        | \cup        |
| 差     | $-$           | -           |
| 绝对补 | $\sim$        | \sim        |
| 对称差 | $\oplus$      | \oplus      |

### 序关系

| 渲染结果       | LaTeX 写法   |
| -------------- | ------------ |
| $\prec$        | \prec        |
| $\succ$        | \succ        |
| $\preccurlyeq$ | \preccurlyeq |
| $\succcurlyeq$ | \succcurlyeq |

## 上下标的输入方法

上标 `^` ，下标 `_`，例如：

```latex
X_1 = a^2,X_2 = b^2
```

$$
X_1 = a^2,X_2 = b^2
$$

同时上下标，只要连续输入 `_` 和 `^` 即可，例如:

```latex
X_3^2 = 9,X_4^2 = 16
```

$$
X_3^2 = 9,X_4^2 = 16
$$

上下标如果由多字符组成，则需要加上花括号，例如：

```latex
X_{i+j}^{k+l}
```

$$
X_{i+j}^{k+l}
$$

左边的上下标只要写在前面就行了，例如：

```latex
^a_bX^c_d
```

$$
^a_bX^c_d
$$

所以除了通过 `\degree` 的方法写度数，也可以通过上标的方法达到类似效果：

```latex
45\degree,90^{\circ}
```

$$
45\degree,90^{\circ}
$$

“上升”：

```latex
X^{X^{X^{X^{X^{X}}}}}
```

$$
X^{X^{X^{X^{X^{X}}}}}
$$

”下降“：

```latex
X_{X_{X_{X_{X_{X}}}}}
```

$$
X_{X_{X_{X_{X_{X}}}}}
$$

### 分式

```latex
\frac{a}{b}
```

$$
\frac{a}{b}
$$

### 根式

| 渲染结果      | LaTeX 写法  |
| ------------- | ----------- |
| $\sqrt{2}$    | \sqrt{2}    |
| $\sqrt[3]{2}$ | \sqrt[3]{2} |

```latex
\sqrt[b]{a}
```

$$
\sqrt[b]{a}
$$

## 矩阵

使用 `\left` 和 `\right` 来指定左右两边用什么框；`&` 是对齐符号；`\\` 表示换行（有的时候要转义的话则是四个）。

```latex
\left[
\begin{matrix}
0      &0      &0      &\cdots &0      \\\\
0      &1      &0      &\cdots &0      \\\\
0      &0      &1      &\cdots &0      \\\\
\vdots &\vdots &\vdots &\ddots &\vdots \\\\
0      &0      &0      &\cdots &1
\end{matrix}
\right]
```

$$
\left[
\begin{matrix}
0      &0      &0      &\cdots &0      \\\\
0      &1      &0      &\cdots &0      \\\\
0      &0      &1      &\cdots &0      \\\\
\vdots &\vdots &\vdots &\ddots &\vdots \\\\
0      &0      &0      &\cdots &1
\end{matrix}
\right]
$$

## 分段

```latex
Cost(h_\theta(x), y)=
\begin{cases}
-log(h_\theta(x)) & \text{if }y=1 \\\\
-log(1-h_\theta(x)) & \text{if }y=0 \\\\
\end{cases}
```

$$
Cost(h_\theta(x), y)=
\begin{cases}
-log(h_\theta(x)) & \text{if }y=1 \\\\
-log(1-h_\theta(x)) & \text{if }y=0 \\\\
\end{cases}
$$

## 其他常用符号写法

| 渲染结果         | LaTeX 写法      | 记法                                              |
| ---------------- | --------------- | ------------------------------------------------- |
| $\to$            | \to             |                                                   |
| $\infty$         | \infty          | ”无穷“的英文：**inf**ini**ty**                    |
| $\sum_{i=0}^{5}$ | \sum\_{i=0}^{5} |                                                   |
| $\lim_{x \to 0}$ | \lim\_{x \to 0} |                                                   |
| $\int_a^b$       | \int_a^b        | “积分”的英文：**int**egral                        |
| $\partial$       | \partial        |                                                   |
| $\bot$           | \bot            |                                                   |
| $\perp$          | \perp           | ”相互垂直“的英文：**perp**endicular to each other |
| $\dot{a}$        | \dot{a}         |                                                   |
| $\hat{a}$        | \hat{a}         |                                                   |
| $\bar{a}$        | \bar{a}         |                                                   |
| $\vec{a}$        | \vec{a}         | ”向量“的英文：**vec**tor                          |
| $\tilde{a}$      | \tilde{a}       | ”波浪号“的英文：**tilde**                         |

## 使用符号的习惯与约定

来自 [在数学环境中，\LaTeX 命令是否应该包在 \mathrm 中？ - Emrys 的回答 - 知乎](https://www.zhihu.com/question/389601732/answer/1170510919) 的参考，再结合我自己的习惯：

- 标量 $i$: `$i$`
- 向量 $\mathbf{x}$ 或 $\vec{x}$: `\mathbf{x}` 或 `\vec{x}`
- 矩阵 $\mathbf{R}$: `\mathbf{R}`
- 用文字表示的变量名 $\mathrm{Duration}$: `\mathrm{Duration}`
- 用文字表示的函数名 $\operatorname{Sigmoid}$: `\operatorname{Sigmoid}`

## 参考资料

- [MathJax 支持的 Latex 符号总结 (各种箭头符号)\_liyuanbhu 的博客-CSDN 博客](https://blog.csdn.net/liyuanbhu/article/details/51473886)
- [latex 公式语法\_ecy_uooki 的博客-CSDN 博客\_latex 公式语法](https://blog.csdn.net/erciyuan_/article/details/90273268)
- [latex 不等于符号\_Bagba 的博客-CSDN 博客\_latex 不等于](https://blog.csdn.net/bagba/article/details/123608562)
- [latex 补集怎么打 - 代码先锋网 (codeleading.com)](https://www.codeleading.com/article/36564801982/)
- [如何用 latex 编写上标、下标？ - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/262907455)
