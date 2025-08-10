---
abbrlink: a6f57fef
categories:
  - CS
  - AI
date: 2023-07-14 11:59:14
katex: true
mathjax: true
tags:
  - ai
  - machine-learning
  - coursera
  - note
  - python
  - octave
  - linear-regression
  - logistic-regression
title: Notes for Machine Learning
---

Here are my notes for course [Machine Learning](https://study.163.com/course/courseMain.htm?courseId=1210076550) taught by Andrew Ng.

About exercise: I didn't do the original version exercise which depends on Octave or Matlab, but a third-party Python version (See [nsoojin/coursera-ml-py](https://github.com/nsoojin/coursera-ml-py)).

<!--more-->

## Lesson 1

Spam: 垃圾邮件
Spam filter: 垃圾邮件过滤器

Examples:

- Database mining (Web click data, medical records, biology, engineering)
- Applications can't program by hand (Autonomous helicopter, handwriting recognition, most of Natural Language Processing(NLP), Computer Vision)
- Self-customizing programs (Amazon, Netflix product recommendations)
- Understanding human learning (brain, real AI)

## Lesson 2

### Machine Learning definition

- Arthur Samuel (1959). Machine Learning: Field of study that gives computers the ability to learn without being explicitly programmed.
- Tom Mitchell (1998) Well-posed Learning Problem: A computer program is said to learn from experience E with respect to some task T and some performance measure P, if its performance on T, as measured by P, improves with experience E. (如果一个计算机程序在任务 T 和性能指标 P 方面的性能指标随着经验 E 的增加而提高，则称该计算机程序从经验 E 中学习。)

### Machine learning algorithms

- Supervised learning (监督学习)
- Unsupervised learning (无监督学习)

Others:

- Reinforcement learning (强化学习)
- Recommender systems (推荐系统)

## Lesson 3

In supervised learning, "right answers" are given.

A regression (回归) problem: predict continuous valued output

A classification (分类) problem: discrete valued output

## Lesson 4

Given data set without labels, the machine finds some structures hiding in it.

Examples:

- Organize computing clusters (管理计算集群)
- Social network analysis
- Market segmentation
- Astronomical data analysis

Cocktail party problem (鸡尾酒会问题): extracting two audio from two audio sources

## Lesson 5

...

## Lesson 6

Linear Regression (线性回归)

Notation:

- $m$ = Number of training examples
- $x$'s = "input" variable / features
- $y$'s = "output" variable / "target" variable
- $(x, y)$ = one training example
- $(x^{(i)}, y^{(i)})$ = $i^{th}$ training example

How does supervised learning work?

![How does supervised learning work](https://webp.blocklune.cc/blog-imgs/cs/ai/notes-for-machine-learning/1.png)

$h$ is called hypothesis function (假设函数)。

How do we represent $h$?

$$
h_{\theta}(x) = \theta_{0}+\theta_{1}x
$$

where $h_{\theta}(x)$ can be shortened to $h(x)$.

This is Linear regression with one variable, or **Univariate linear regression (单变量线性回归)**.

## Lesson 7

Cost function (代价函数)

Hypothesis: $h_{\theta}(x) = \theta_{0}+\theta_{1}x$

$\theta_{i}$ 's: Parameters (参数)

How to choose $\theta_{i}$?

Idea: Choose $\theta_0$, $\theta_1$ so that $h_{\theta}(x)$ is close to $y$ for our training examples $(x,y)$.

Cost function (Square error cost function, 平方误差代价函数): $J(\theta_0, \theta_1)=\frac{1}{2m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})^2$.

We want to minimize the cost function.

## Lesson 8

Hypothesis: $h_{\theta}(x) = \theta_{0}+\theta_{1}x$

Parameters: $\theta_0, \theta_1$

Cost Function: $J(\theta_0, \theta_1)=\frac{1}{2m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})^2$

Goal: $minimize J(\theta_0, \theta_1)$

## Lesson 9

contour plots / contour figures (等高线图)

We use contour plots / contour figures to show $J(\theta_0, \theta_1)$.

## Lesson 10

Gradient Descent (梯度下降)

Here we use this algorithm to minimize the cost function.

Outline:

- Start with some $\theta_0$, $\theta_1$
- Keep changing $\theta_0$, $\theta_1$ to reduce $J(\theta_0, \theta_1)$ until we hopefully end up at a minimum

Gradient descent algorithm:

Repeat until convergence (收敛) {

$$
\theta_j := \theta_j - \alpha\frac{\partial}{\partial\theta_j}J(\theta_0, \theta_1)\enspace(for\enspace j = 0\enspace and\enspace j = 1)
$$

}

$\alpha$: learning rate (学习率). It controls that how big a step we take downhill with gradient descent.

Notice that we need to update $\theta_0$ and $\theta_1$ simultaneously (同时):

$$
temp0 := \theta_0 - \alpha\frac{\partial}{\partial\theta_0}J(\theta_0, \theta_1)
$$

$$
temp1 := \theta_1 - \alpha\frac{\partial}{\partial\theta_1}J(\theta_0, \theta_1)
$$

$$
\theta_0 := temp0
$$

$$
\theta_1 := temp1
$$

## Lesson 11

- If $\alpha$ is too small, gradient descent can be slow;
- If $\alpha$ is too large, gradient descent can overshoot the minimum. It may fail to converge (收敛), or even diverge (发散).

Gradient descent can converge to a local minimum, even with the learning rate $\alpha$ **fixed**, since the derivative term (导数项) becomes smaller as we approach the local minimum.

## Lesson 12

$$
j=0:\frac{\partial}{\partial\theta_0}J(\theta_0, \theta_1)=\frac{1}{m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})
$$

$$
j=1:\frac{\partial}{\partial\theta_1}J(\theta_0, \theta_1)=\frac{1}{m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)}) \cdot x^{(i)}
$$

In linear regression, there is no local optimum except for a global optimum in its cost function.

"Batch" Gradient Descent (批量梯度下降): which means that each step of gradient descent uses all the training examples.

## Lesson 13

...

## Lesson 14 - 19

Matrix and Vector

Matrix Addition and Scalar Multiplication (标量乘法)

Matrix-vector multiplication

Matrix-matrix multiplication

Matrix multiplication properties

Identity Matrix (单位矩阵)

Matrix Inverse (逆) and Matrix Transpose (转置)

## Lesson 20 - 26

...

## Lesson 27

Multiple features (variables)

Notation:

- $n$ = number of features
- $x^{(i)}$ = input (features) of $i^{th}$ training example.
- $x^{(i)}_j$ = value of feature $j$ in $i^{th}$ training example.

Hypothesis:

$$
h_\theta(x) = \theta_0 + \theta_1 x_1 + \theta_2 x_2 + ...
$$

For convenience of notation, define $x_0 = 1$.

$$
x=[x_0, x_1, x_2, ..., x_n]^T \in R^{n+1}
$$

$$
\theta=[\theta_0, \theta_1, \theta_2, ..., \theta_n]^T \in R^{n+1}
$$

$$
h_\theta(x) = \theta_0 x_0 + \theta_1 x_1 + ... + \theta_n x_n = \theta^T x
$$

Multivariate linear regression (多元线性回归)

## Lesson 28

Multivariate gradient descent:

- Hypothesis: $h_\theta(x)=\theta^Tx=\theta_0 x_0 + \theta_1 x_1 + \theta_2 x_2 + ... + \theta_n x_n$
- Parameters: $\theta_0$, $\theta_1$, ..., $\theta_n$ or (n+1)-dimensioned vector
- Cost function: $J(\theta_0, \theta_1, ..., \theta_n) = \frac{1}{2m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})^2$

Gradient Descent:

Repeat: {

$$
\theta_j := \theta_j - \alpha\frac{1}{m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})\cdot x_j^{(i)}
$$

}

## Lesson 29

### Feature Scaling (特征缩放)

Idea: Make sure features are on a similar scale. (If you can make sure that the features are on a similar scale, by which I mean make sure that the different features take on similar ranges of values, then gradient descents can converge more quickly.)

Get every feature into approximately a $-1 \leq x_i \leq 1$ range.

### Mean normalization (均值归一化)

Replace $x_i$ with $x_i-\mu_i$ to make features have approximately zero mean (Do not apply to $x_0 = 1$).

## Lesson 30

### "Debugging": How to make sure gradient descent is working correctly

画图：纵轴为 $J(\theta)$，横轴为迭代次数，图像应单调递减

### How to choose learning rate $\alpha$

- If $\alpha$ is too small: slow convergence;
- If $\alpha$ is too large: $J(\theta)$ may not decrease on every iteration; may not converge.

To choose $\alpha$, try:

$$
...,0.001,0.003,0.01,0.03,0.1,0.3,1,...
$$

## Lesson 31

Polynomial regression (多项式回归)

$$
\theta_0 + \theta_1x + \theta_2 x^2 + \theta_3 x^3 + ...
$$

Use multivariate linear regression: $x_1 = x, x_2=x^2, x_3=x^3, ...$

## Lesson 32

Normal equation (正规方程)

不迭代，直接求解 $J(\theta)$ 的最小值。

$$
\theta=(X^TX)^{-1}X^Ty
$$

In Octave: `pinv(X'*X)*X'*y`

| Gradient Descent                 | Normal Equation                                                     |
| -------------------------------- | ------------------------------------------------------------------- |
| Need to choose $\alpha$          | No need to choose $\alpha$                                          |
| Need many iterations             | Don't need to iterate                                               |
| Work well even when $n$ is large | Need to compute $(X^TX)^{-1}$, slow if $n$ is very large ($O(n^3)$) |

## Lesson 33

Normal equation and non-invertibility (optional)

What if $X^TX$ is non-invertible? (singular (奇异) / degenerate (退化))

In Octave, there is two functions `pinv` (pseudo-inverse, 伪逆) and `inv` (inverse, 逆). The former will actually compute the answer you want even if $X^TX$ is non-invertible.

## Lesson 34 - 35

...

## Lesson 36

Basic operations of Octave

```octave
% comment stating with %
5+6  % plus
3-2  % minus
5*8  % multiply
1/2  % divide by
2^6  % pow

% logic operation
1 == 2  % equal
1 ~= 2  % not equal
1 && 0  % AND
1 || 0  % OR
xor(1, 0)  % XOR

% customize prompt
PS1('>> '); % change the prompt to '>> '

% variable and assignment
a=3;  % semicolon suppressing output
b='hi';
c=(3>=1);
a=pi;

a  % this print "a = 3.1416"
disp(a);  % this print "3.1416"
disp(sprintf('2 decimals: %0.2f', a))  % this print "2 decimals: 3.14"

format long  % display more decimal parts
format short % display less ...


% matrix
A=[1 2; 3 4; 5 6]

% vector
v=[1 2 3]  % row vector
v=[1;2;3]  % column vector
v=1:0.1:2  % v=[1.0000 1.1000, 1.2000, ..., 2.0000]
v=1:6      % v=[1, 2, 3, 4, 5, 6]

ones(2,3)  % [1, 1, 1; 1, 1, 1]
C=2*ones(2,3)  % C=[2, 2, 2; 2, 2, 2]
w=zeros(1,3)  % w=[0, 0, 0]
w=rand(1, 3)  % a 1*3 matrix with random numbers
w=randn(1, 3) % normal random variable (正态分布)

hist(w)  % plot a histogram (直方图)

eye(4)  % a 4*4 identity matrix (单位矩阵)

help eye  % show help
```

## Lesson 37

```octave
size(A)  % return the size of matrix A
size(A,1)  % return the size of the first dimension of A

length(v)  % return the size of vector v (actually the longest dimension)

pwd  % similar to linux pwd
ls  % similar to linux ls

load featuresX.dat  % load the featuresX.dat file
load('featuresX.dat')

who  % show all the variables in the current scope
whos  % more detailed who command

clear(featuresX)  % delete the variable featuresX
v=priceY(1:10)  % set v to be the first ten elements of priceY
save hello.mat v;  % save v to a file called hello.mat (in binary)
clear  % delete all the variables
save hello.txt v -ascii  % save v to a file called hello.txt with ascii characters

A(3,2)
A(2,:)  % colon means every element along that row / column
A([1 3], :)  % get all the elements from the first and the third row
A(:,2) = [10;11;12]  % replace the second column with [10;11;12]
A=[A,[100;101;102]]  % append another column vector to right
A(:)  % put all elements of A into a single vector

...
```

## Lesson 38 - 42

...

## Lesson 43 (Exercise 1)

### ex1-plotData.py

See [scatter](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.scatter.html#matplotlib.axes.Axes.scatter)

```python
import matplotlib.pyplot as plt


def plot_data(x, y):
    # ===================== Your Code Here =====================
    # Instructions : Plot the training data into a figure using the matplotlib.pyplot
    #                using the "plt.scatter" function. Set the axis labels using
    #                "plt.xlabel" and "plt.ylabel". Assume the population and revenue data
    #                have been passed in as the x and y.

    # Hint : You can use the 'marker' parameter in the "plt.scatter" function to change the marker type (e.g. "x", "o").
    #        Furthermore, you can change the color of markers with 'c' parameter.

    plt.scatter(x, y, marker='x', c='r')
    plt.xlabel("Population")
    plt.ylabel("Revenue")
    # ===========================================================

    plt.show()
```

### ex1-computeCost.py

I'm a green hand to numpy, so I used a loop.

```python
import numpy as np


def compute_cost(X, y, theta):
    # Initialize some useful values
    m = y.size
    cost = 0

    # ===================== Your Code Here =====================
    # Instructions : Compute the cost of a particular choice of theta.
    #                You should set the variable "cost" to the correct value.

    for i in range(m):
        h_theta = np.dot(X[i, :], theta)
        cost += (h_theta - y[i]) ** 2
    cost /= (2 * m)
    # ==========================================================

    return cost
```

Learn [the elegant code from nsoojin](https://github.com/nsoojin/coursera-ml-py-sj/blob/master/machine-learning-ex1/computeCost.py)!

### ex1-gradientDescent.py

This code is from [nsoojin](https://github.com/nsoojin/coursera-ml-py-sj/blob/master/machine-learning-ex1/gradientDescent.py), which is so elegant! I spent a long time to understand the most important two lines.

```python
import numpy as np
from computeCost import *

def gradient_descent_multi(X, y, theta, alpha, num_iters):
    # Initialize some useful values
    m = y.size
    J_history = np.zeros(num_iters)

    for i in range(0, num_iters):
        # ===================== Your Code Here =====================
        # Instructions : Perform a single gradient step on the parameter vector theta
        #
        error = np.dot(X, theta).flatten() - y  # 误差
        theta -= alpha / m * np.sum(X * error[:, np.newaxis], 0)
        # ===========================================================
        # Save the cost every iteration
        J_history[i] = compute_cost(X, y, theta)

    return theta, J_history
```

![gradientDescent.py](https://webp.blocklune.cc/blog-imgs/cs/ai/notes-for-machine-learning/2.png)

### ex1-featureNormalize.py

`numpy.std` compute the standard deviation (标准差) along the specified axis. (See [Doc](https://numpy.org/doc/stable/reference/generated/numpy.std.html))

The hint says that:

> To get the same result as Octave 'std', use np.std(X, 0, ddof=1)

where `ddof` means Delta Degrees of Freedom. The divisor used in calculation is `N - ddof`, where `N` represents the number of elements. By default `ddof` is zero.

> [!Note]
> 这实际上就是总体标准差和样本标准差的区别：
>
> 总体标准差：
>
> $$
> \sigma = \sqrt{\frac{\sum^n_{i=1}(x_i-\bar{x})^2}{n}}
> $$
>
> 样本标准差：
>
> $$
> S = \sqrt{\frac{\sum^n_{i=1}(x_i-\bar{x})^2}{n-1}}
> $$

```python
import numpy as np


def feature_normalize(X):
    # You need to set these values correctly
    n = X.shape[1]  # the number of features
    X_norm = X
    mu = np.zeros(n)
    sigma = np.zeros(n)

    # ===================== Your Code Here =====================
    # Instructions : First, for each feature dimension, compute the mean
    #                of the feature and subtract it from the dataset,
    #                storing the mean value in mu. Next, compute the
    #                standard deviation of each feature and divide
    #                each feature by its standard deviation, storing
    #                the standard deviation in sigma
    #
    #                Note that X is a 2D array where each column is a
    #                feature and each row is an example. You need
    #                to perform the normalization separately for
    #                each feature.
    #
    # Hint: You might find the 'np.mean' and 'np.std' functions useful.
    #       To get the same result as Octave 'std', use np.std(X, 0, ddof=1)
    #
    mu = np.mean(X, axis=0)
    sigma = np.std(X, axis=0, ddof=1)
    X_norm = (X - mu) / sigma

    # ===========================================================

    return X_norm, mu, sigma

```

### ex1-normalEqn.py

Compute pseudo inverse with `numpy.linalg.pinv()`:

```python
import numpy as np

def normal_eqn(X, y):
    theta = np.zeros((X.shape[1], 1))

    # ===================== Your Code Here =====================
    # Instructions : Complete the code to compute the closed form solution
    #                to linear regression and put the result in theta
    #
    theta = np.linalg.pinv(X.T.dot(X)).dot(X.T).dot(y)
    return theta
```

## Lesson 44

Examples of classification problem:

- Email: Spam / Not Spam?
- Online Transactions (在线交易): Fraudulent (欺诈) (Yes / No)?
- Tumor (肿瘤): Malignant (恶性的) / Benign (良性的) ?

Binary classification problem:

$$
y \in {0, 1}
$$

$0$: "Negative Class" (e.g. benign tumor)
$1$: "Positive Class" (e.g. malignant tumor)

Logistic Regression is a classification algorithm though it has "regression" in its name.

## Lesson 45

### Logistic Regression Model

Want $0\leq h_\theta(x) \leq 1$

$h_\theta(x) = g(\theta^Tx)$

Sigmoid function / Logistic function: $g(z) = \frac{1}{1+e^{-z}}$

And we get:

$$
h_\theta(x) = \frac{1}{1+e^{-\theta^Tx}}
$$

### Interpretation of Hypothesis Output

$h_\theta(x)$ = estimated probability that $y=1$ on input $x$

Example: If

$$
x=
\left[
\begin{matrix}
x_0 \\\\
x_1
\end{matrix}
\right]=
\left[
\begin{matrix}
1 \\\\
tumorSize
\end{matrix}
\right]
$$

$h_\theta(x)=0.7$ tells patient that 70% chance of tumor being malignant.

"Probability that $y=1$, given $x$, parameterized by $\theta$":

$$
h_\theta(x)=P(y=1|x;\theta)
$$

$$
P(y=0|x;\theta) + P(y=1|x;\theta) = 1
$$

$$
P(y=0|x;\theta) = 1 - P(y=1|x;\theta)
$$

## Lesson 46

### Logistic regression

$$
h_\theta(x) = g(\theta^Tx)
$$

$$
g(z) = \frac{1}{1+e^{-z}}
$$

Suppose

- predict "$y=1$" if $h_\theta(x)\geq 0.5$
- predict "$y=0$" if $h_\theta(x) < 0.5$

Since we know that:

$$
z=0, g(z)=g(0)=0.5
$$

So:

- predict "$y=1$" if $\theta^Tx \geq 0$
- predict "$y=0$" if $\theta^Tx < 0$

### Decision Boundary (决策界限)

...

## Lesson 47

Cost function:

- Linear regression: $J(\theta)=\frac{1}{m}\sum_{i=1}^m\frac{1}{2}(h_\theta(x^{(i)})-y^{(i)})^2$

- $Cost(h_\theta(x), y)=\frac{1}{2}(h_\theta(x)-y)^2$

Logistic regression cost function:

$$
Cost(h_\theta(x), y)=
\begin{cases}
-log(h_\theta(x)) & \text{if }y=1 \\\\
-log(1-h_\theta(x)) & \text{if }y=0 \\\\
\end{cases}
$$

$Cost=0$ if $y=1, h_\theta(x)=1$, but as $h_\theta(x) \to 0$, $Cost \to \infty$

Captures intuition that if $h_\theta(x)=0$, (predict $P(y=1|x;\theta)$), but $y=1$, we'll penalize learning algorithm by a very large cost.

(When $y=0$) ...

## Lesson 48

Logistic regression cost function:

$$
J(\theta)=\frac{1}{m}\sum^m_{i=1}Cost(h_\theta(x^{(i)}), y^{(i)})
$$

$$
Cost(h_\theta(x), y)=
\begin{cases}
-log(h_\theta(x)) & \text{if }y=1 \\\\
-log(1-h_\theta(x)) & \text{if }y=0 \\\\
\end{cases}
$$

Since that $y=0$ or $1$ always:

$$
Cost(h_\theta(x), y)=-y log(h_\theta(x))-(1-y)log(1-h_\theta(x))
$$

$$
\begin{aligned}
J(\theta)
&=\frac{1}{m}\sum^m_{i=1}Cost(h_\theta(x^{(i)}), y^{(i)})\\\\
&=-\frac{1}{m}\sum^m_{i=1}
\left[y^{(i)}log h_\theta(x^{(i)})+(1-y^{(i)})log(1-h_\theta(x^{(i)}))
\right]\\\\
\end{aligned}
$$

To fit parameters $\theta$:

$$
\underset{\theta}{min}J(\theta)
$$

To make a prediction given new $x$:

Output $h_\theta(x)=\frac{1}{1+e^{\theta^Tx}}$

Want $\underset{\theta}{min}J(\theta)$:

Repeat {

$$
\theta_j := \theta_j-\alpha\frac{\partial}{\partial\theta_j}J(\theta)
$$

}

in which

$$
\frac{\partial}{\partial\theta_j}J(\theta)=\frac{1}{m}\sum_{i=1}^m(h_\theta(x^{(i)})-y^{(i)})x^{(i)}_j
$$

Algorithm looks identical to linear regression!

But attention that, there are two **different** $h_\theta(x)$ functions in linear regression and logistic regression.

## Lesson 49

Optimization algorithms:

- Conjugate gradient (共轭梯度)
- BFGS
- L-BFGS

Advantages:

- No need to manually pick $\alpha$
- Often faster than gradient descent

Disadvantages:

- More complex

> In particular, you probably should not implement these algorithms (conjugate gradient, L-BFGS, BFGS) yourself, unless you're an expert in numerical computing.

## Lesson 50

### Multiclass classification (多类别分类)

Ex.

- Email foldering / tagging: Work, Friends, Family, Hobby
- Medical diagrams: Not ill, Cold, Flu
- Weather: Sunny, Cloudy, Rain, Snow

### One-vs-all (one-vs-rest)

Train a logistic regression classifier $h_\theta^{(i)}(x)$ for each class $i$ to predict the probability that $y=i$.

On a new input $x$, to make a prediction, pick the class $i$ that maximizes $\underset{i}{max}h_\theta^{(i)}(x)$

## Lesson 51

...

## Lesson 52

The problem of overfitting (过拟合问题)

### What's overfitting?

![Overfitting](https://webp.blocklune.cc/blog-imgs/cs/ai/notes-for-machine-learning/3.png)

- Underfit: 欠拟合
- High bias: 高偏差
- Overfit: 过拟合
- High variance: 高方差
- generalize: 泛化

### Addressing overfitting

Options:

- Reduce number of features
  - Manually select which features to keep
  - Model selection algorithm (later in course)
- Regularization (正则化)
  - Keep all the features, but reduce magnitude (量级) / values of parameters $\theta_j$
  - Works well when we have a lot of features, each of which contributes a bit to predicting $y$

## Lesson 53

Regularization.

Small values for parameters $\theta_0, \theta_1, ... \theta_n$

- "Simpler" hypothesis
- Less prone to overfitting

$$
J(\theta) = \frac{1}{2m} \left[ \sum_{i=1}^m (h_\theta(x^{(i)}) - y^{(i)})^2 + \lambda \sum_{j=1}^n \theta_j^2 \right]
$$

Notice that usually we regularize only $\theta_1$ through $\theta_n$ ($\theta_0$ exclusive). (约定俗成的规定)

- Regularization term: $\lambda\sum_{i=1}^n\theta_j^2$
- Regularization parameter (正则化参数): $\lambda$ controls a trade off between two different goals:
  - Fit the training data well
  - Keep the parameters small

What if $\lambda$ is set to an extremely large value?

Underfitting!

## Lesson 54

Regularized linear regression

### Gradient descent

Repeat {

$$
\begin{aligned}
\theta_0 &:= \theta_0 - \alpha\frac{1}{m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})\cdot x_0^{(i)}\\\\
\theta_j &:= \theta_j - \alpha[\frac{1}{m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})\cdot x_j^{(i)}+\frac{\lambda}{m}\theta_j]\\\\
&=\theta_j(1-\alpha\frac{\lambda}{m})-\alpha\frac{1}{m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})\cdot x_0^{(i)}
\end{aligned}
$$

}

### Normal equation

$$
\theta = (X^TX + \lambda
\left[
\begin{matrix}
0      &0      &0      &\cdots &0      \\\\
0      &1      &0      &\cdots &0      \\\\
0      &0      &1      &\cdots &0      \\\\
\vdots &\vdots &\vdots &\ddots &\vdots \\\\
0      &0      &0      &\cdots &1
\end{matrix}
\right]_{n+1}
)^{-1}X^Ty
$$

Non-invertibility (optional / advanced)

...

## Lesson 55

...

## Lesson 56 (Exercise 2)

### ex2-plotData.py

Use `edgecolors=` in `numpy.scatter` to customize the color of edges.

```python
import matplotlib.pyplot as plt
import numpy as np


def plot_data(X, y):
    plt.figure()

    # ===================== Your Code Here =====================
    # Instructions : Plot the positive and negative examples on a
    #                2D plot, using the marker="+" for the positive
    #                examples and marker="o" for the negative examples
    #
    plt.scatter(x=X[y == 1, 0], y=X[y == 1, 1], marker='+', c="black")
    plt.scatter(x=X[y == 0, 0], y=X[y == 0, 1],
                marker='o', c="yellow", edgecolors="black")
```

### ex2-sigmoid.py

```python
import numpy as np

def sigmoid(z):
    g = np.zeros(z.size)

    # ===================== Your Code Here =====================
    # Instructions : Compute the sigmoid of each value of z (z can be a matrix,
    #                vector or scalar
    #
    # Hint : Do not import math
    g = 1 / (1 + np.exp(-z))
    return g
```

### ex2-constFunction.py

Cost function:

$$
\begin{aligned}
J(\theta)
&=-\frac{1}{m}\sum^m_{i=1}
\left[y^{(i)}log h_\theta(x^{(i)})+(1-y^{(i)})log(1-h_\theta(x^{(i)}))
\right]\\\\
&=\frac{1}{m}\sum^m_{i=1}
\left[-y^{(i)}log h_\theta(x^{(i)})-(1-y^{(i)})log(1-h_\theta(x^{(i)}))
\right]
\end{aligned}
$$

grad:

$$
\frac{\partial}{\partial\theta_j}J(\theta)=\frac{1}{m}\sum_{i=1}^m(h_\theta(x^{(i)})-y^{(i)})x^{(i)}_j
$$

```python
import numpy as np
from sigmoid import *


def cost_function(theta, X, y):
    m = y.size

    # You need to return the following values correctly
    cost = 0
    grad = np.zeros(theta.shape)

    # ===================== Your Code Here =====================
    # Instructions : Compute the cost of a particular choice of theta
    #                You should set cost and grad correctly.
    #
    h_theta = sigmoid(X @ theta)
    cost = 1 / m * np.sum(-y*np.log(h_theta)-(1-y)*np.log(1-h_theta), axis=0)
    grad = 1 / m * np.sum((h_theta-y)[:, np.newaxis]*X, axis=0)
    # ===========================================================

    return cost, grad

```

### ex2-predict.py

```python
import numpy as np
from sigmoid import *


def predict(theta, X):
    m = X.shape[0]

    # Return the following variable correctly
    p = np.zeros(m)

    # ===================== Your Code Here =====================
    # Instructions : Complete the following code to make predictions using
    #                your learned logistic regression parameters.
    #                You should set p to a 1D-array of 0's and 1's
    #
    h_theta = sigmoid(X @ theta)
    p[h_theta >= 0.5] = 1
    p[h_theta < 0.5] = 0
    # ===========================================================

    return p

```

### ex2-costFunctionReg.py

Cost function:

$$
J(\theta)=\frac{1}{m}\sum^m_{i=1}
\left[-y^{(i)}log h_\theta(x^{(i)})-(1-y^{(i)})log(1-h_\theta(x^{(i)}))
\right] + \frac{\lambda}{2m}\sum^n_{j=1}\theta_j^2
$$

grad:

For $j=0$:

$$
\frac{\partial}{\partial\theta_0}J(\theta)=\frac{1}{m}\sum_{i=1}^m(h_\theta(x^{(i)})-y^{(i)})x^{(i)}_j
$$

For $j\geq1$:

$$
\frac{\partial}{\partial\theta_j}J(\theta)=\left(\frac{1}{m}\sum_{i=1}^m(h_\theta(x^{(i)})-y^{(i)})x^{(i)}_j\right)+\frac{\lambda}{m}\theta_j
$$

```python
import numpy as np
from sigmoid import *


def cost_function_reg(theta, X, y, lmd):
    m = y.size

    # You need to return the following values correctly
    cost = 0
    grad = np.zeros(theta.shape)

    # ===================== Your Code Here =====================
    # Instructions : Compute the cost of a particular choice of theta
    #                You should set cost and grad correctly.
    #
    h_theta = sigmoid(X @ theta)
    cost = 1 / m * np.sum((-y*np.log(h_theta)-(1-y) *
                          np.log(1-h_theta)), axis=0) + lmd / (2 * m) * (np.sum(np.power(theta, 2))-theta[0]**2)
    # let theta[0]=0 temporarily. This is helpful to calculation.
    theta_0 = theta[0]
    theta[0] = 0
    grad = (1 / m * np.sum((h_theta-y)
            [:, np.newaxis]*X, axis=0)) + lmd / m * theta
    theta[0] = theta_0

    # ===========================================================

    return cost, grad

```

## Lesson 57

Regularized logistic regression

Gradient descent:

Repeat {

$$
\begin{aligned}
\theta_0 &:= \theta_0 - \alpha\frac{1}{m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})\cdot x_0^{(i)}\\\\
\theta_j &:= \theta_j - \alpha[\frac{1}{m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})\cdot x_j^{(i)}+\frac{\lambda}{m}\theta_j]\\\\
&=\theta_j(1-\alpha\frac{\lambda}{m})-\alpha\frac{1}{m}\sum^m_{i=1}(h_\theta(x^{(i)})-y^{(i)})\cdot x_0^{(i)}
\end{aligned}
$$

}

(看上去就和上边线性回归的一摸一样，但是使用了不同的 $h_\theta$(假设函数))

## Lesson 58

Non-linear hypotheses

When $n$ is large, the classifiers we have learn have too many features to compute, but large $n$ is common.

## Lesson 59

Neurons and the brain

### Neural Networks

Origins:

Algorithms that try to mimic (模仿) the brain.

Was very widely used in 80s and early 90s; popularity diminished in late 90s.

Recent resurgence (兴起): State-of-the-art technique for many applications

### The "one learning algorithm" hypothesis

...

## Lesson 60

### Neural Network

![Neural Network](https://webp.blocklune.cc/blog-imgs/cs/ai/notes-for-machine-learning/4.png)

- The input layer: the first layer
- The output layer: the last layer
- The hidden layer: the layer(s) between the first and the last layer

bias unit: 偏置单元

Notations:

- $a_i^{(j)}$ = "activation" of unit $i$ in layer $j$ (activation 的意思是由一个具体神经元计算并输出的值)
- $\Theta^{(j)}$ = matrix of weights controlling function mapping from layer $j$ to layer $j+1$ (权重矩阵)

![An example](https://webp.blocklune.cc/blog-imgs/cs/ai/notes-for-machine-learning/5.png)

If network has $s_j$ units in layer $j$, $s_{j+1}$ units in layer $j+1$, then $\Theta^{j}$ will be of dimension $s_{j+1} \times (s_j + 1)$.

## Lesson 61

### Forward propagation (前向传播): Vectorized implementation

![Forward propagation: vectorized implementation](https://webp.blocklune.cc/blog-imgs/cs/ai/notes-for-machine-learning/6.png)

## Lesson 62 (Exercise 3)

(Not yet completed)

## Lesson 63 - 64

...

## Lesson 65

![Example](https://webp.blocklune.cc/blog-imgs/cs/ai/notes-for-machine-learning/7.png)

## Lesson 66

...

## Lesson 67

Cost function in Neural network:

$$
h_\Theta(x) \in \mathbb{R}^K
$$

$$
(h_\Theta(x))_i = i^{th} output
$$

$$
J(\Theta)=-\frac{1}{m}\left[\sum_{i=1}^m\sum_{k=1}^Ky_k^{(i)}log(h_\Theta(x^{(i)}))_k+(1-y_k^{(i)})log(1-(h_\Theta(x^{(i)}))_k)\right]+\frac{\lambda}{2m}\sum_{l=1}^{L-1}\sum_{i=1}^{s_l}\sum_{j=1}^{s_{l+1}}(\Theta_{ji}^{(l)})^2
$$

## Lesson 68

### Gradient computation: Backpropagation algorithm (反向传播算法)

Intuition: $\delta_j^{l}$ = "error" (误差) of node $j$ in layer $l$.

For each output unit (layer L = 4)

$$
\begin{aligned}
\delta^{(4)} &= a^{(4)} - y  \\\\
\delta^{(3)} &= (\Theta^{(3)})^T\delta^{(4)} \cdot g'(z^{(3)})\\\\
\delta^{(2)} &= (\Theta^{(2)})^T\delta^{(3)} \cdot g'(z^{(2)})
\end{aligned}
$$

where

$$
g'(z^{(3)})=a^{(3)}\cdot(1-a^{(3)}) \\\\
g'(z^{(2)})=a^{(2)}\cdot(1-a^{(2)}) \\\\
$$

And then we can get:

$$
\frac{\partial}{\partial\Theta_{ij}^{(l)}}J(\Theta)=a_j^{(l)}\delta_i^{l+1}\text{ , ignore }\lambda
$$

### Backpropagation algorithm

- Training set: $\{(x^{(1)}, y^{(1)}), ..., (x^{(m)}, y^{(m)})\}$
- Set $\Delta_{ij}^{(l)}=0$ for all $l, i, j$ (used to compute $\frac{\partial}{\partial\Theta_{ij}^{(l)}}J(\Theta)$)
- For $i=1$ to $m$
  - Set $a^{(1)}=x^{(i)}$
  - Perform forward propagation to compute $a^{(l)}$ for $l=2, 3, ..., L$
  - Using $y^{(i)}$, compute $\delta^{(L)}=a^{(L)}-y^{(i)}$
  - Compute $\delta^{(L-1)},\delta^{(L-2)},...,\delta^{(2)}$
  - $\Delta_{ij}^{l}:=\Delta_{ij}^{l}+a_j^{(l)}\delta_i^{(l+1)}$ (Vectorized: $\Delta^{(l)}:=\Delta^{(l)}+\delta^{(l+1)}(a^{(l)})^T$)
- $D_{ij}^{(l)}:=\frac{1}{m}\Delta_{ij}^{(l)}+\lambda\Theta_{ij}^{(l)}\text{ if } j \neq 0$
  $D_{ij}^{(l)}:=\frac{1}{m}\Delta_{ij}^{(l)}\text{ if } j = 0$
