---
abbrlink: 9b4ad8c6
categories:
  - CS
  - Languages
  - Python
date: 2023-10-17 16:01:54
tags:
  - python
  - oop
  - getter-setter
  - property-decorator
  - translation
title: Python 中的 Getter 和 Setter（翻译）
license: none
---

_[Getter and Setter in Python](https://www.geeksforgeeks.org/getter-and-setter-in-python/)_ 的中文翻译，原作者是 [@adarsh_verma](https://www.geeksforgeeks.org/user/Adarsh_Verma/)。

<!--more-->

> 注意：翻译时间为 2023 年 10 月 17 日，一切以源网站最新版本文章为准。

Python 中访问器 (getters) 更改器 (setters) 与其他面向对象语言中的不太一样。基本上，在面向对象程序中使用 getters 和 setters 的主要目的是确保数据封装。[Python 中的私有变量](https://www.geeksforgeeks.org/private-variables-python/)实际上并不像在其他面向对象语言中那样隐藏字段。Python 中的 getters 和 setters 通常在以下情况中使用：

- 为了添加有关获取和更改一个值的验证逻辑 (validation logic).
- 为了避免直接访问一个类的私有字段，即那些没法被外部用户直接访问或修改的私有变量。

## 普通函数实现

定义普通的 `get()` 和 `set()` 方法是一种实现 getters 和 setters 的性质的非特殊实现方法。例如：

```python
# Python program showing a use
# of get() and set() method in
# normal function

class Geek:
    def __init__(self, age = 0):
        self._age = age

    # getter method
    def get_age(self):
        self._age

    # setter method
    def set_age(self, x):
        self._age = x

raj = Geek()

# setting the age using setter
raj.set_age(21)

# retrieving age using getter
print(raj.get_age())

print(raj._age)
```

输出：

```txt
21
21
```

在上面的代码中，函数 `get_age()` 和 `set_age()` 就像普通函数一样，不产生真正的 getters 和 setters 的影响。为了实现真正的 getters 和 setters 的功能，Python 提供了一个特殊的函数 `property()`。

## property() 函数实现

在 Python 中，`property()` 是一个内置函数，用于创建和返回属性对象。属性对象有三个方法：getter()、setter() 和 delete()。Python 中的 `property()` 函数有四个参数 `property(fget、fset、fdel、doc)`，其中 `fget` 是一个检索属性值的函数，`fset` 是一个设置属性值的函数，`fdel` 是一个删除属性值的函数，`doc` 为属性创建一个 docstring。属性对象有三个方法：`getter()`、`setter()` 和 `delete()`，分别用于指定 `fget`、`fset` 和 `fdel`。例如：

```python
# Python program showing a
# use of property() function

class Geeks:
    def __init__(self):
        self._age = 0

    # function to get value of _age
    def get_age(self):
        print("getter method called")
        return self._age

    # function to set value of _age
    def set_age(self, a):
        print("setter method called")
        self._age = a

    # function to delete _age attribute
    def del_age(self):
        del self._age

    age = property(get_age, set_age, del_age)


mark = Geeks()

mark.age = 10

print(mark.age)
```

输出：

```txt
setter method called
getter method called
10
```

在上面的代码中，第 25 行只有一条打印语句，但由于第 23 行调用了 setter 方法 set_age()，第 25 行调用了 getter 方法 get_age()，所以输出由三行组成。因此，age 是一个属性对象，它有助于保证对私有变量的访问安全。

## @property 修饰器实现

在前面的方法中，我们使用了 property() 函数来实现 getters 和 setters 行为。但是，正如本文章前面提到的，getters 和 setters 也用于验证属性值的获取和设置。还有一种实现属性函数的方法，即使用[修饰器](https://www.geeksforgeeks.org/decorators-in-python/)。Python @property 是内置的修饰器之一。任何修饰器的主要目的都是以这样一种方式改变类的方法或属性，这样类的用户就不需要在他们的代码中做任何改变。例如:

```python
# Python program showing the use of
# @property

class Geeks:
    def __init__(self):
        self._age = 0

    # using property decorator
    # a getter function
    @property
    def age(self):
        print("getter method called")
        return self._age

    # a setter function
    @age.setter
    def age(self, a):
        if (a < 18):
            raise ValueError("Sorry you age is below eligibility criteria")
        print("setter method called")
        self._age = a


mark = Geeks()

mark.age = 19

print(mark.age)
```

输出：

```txt
setter method called
getter method called
19
```

上述代码清楚地说明了如何使用 @property 修饰器以 Python 的方式创建获取器和设置器。第 15-16 行是验证代码，如果我们尝试将年龄初始化为小于 18 的值，就会引发 ValueError。
