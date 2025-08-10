---
abbrlink: 4eb7504e
categories:
  - CS
  - Languages
  - C & Cpp
date: 2023-06-01 14:57:37
tags:
  - const
  - cpp
  - cs106l
  - note
  - programming-language
  - software-engineering
  - stanford
title: Const Correctness in C++
---

This is a note for Lecture 8, [CS106L](https://web.stanford.edu/class/cs106l/index.html), Spring 2023.

<!--more-->

## Introduction

What's const?

**Def.**

- `const`: keyword indicating a variable, function or parameter can't be modified

`const` variables can be references or not.

**Ex.**

```cpp
std::vector<int> vec{1, 2, 3};
const std::vector<int> c_vec{7, 8};  // a const variable
std::vector<int>& ref = vec;         // a regular reference
const std::vector<int>& c_ref = vec; // a const reference

vec.push_back(3);    // OKAY
c_vec.push_back(3);  // BAD - const
ref.push_back(3);    // OKAY
c_ref.push_back(3);  // BAD - const
```

Why const?

It helps find out mistakes.

```cpp
void f(const int x, const int y) {
  if ((x==2 && y==3) || (x==1)) {
    cout << 'a' << endl;
  }
  if ((y==x-1) && (x==-1 || y=-1)) {
    cout << 'b' << endl;
  }
  if ((x==3) && (y==2*x)) {
    cout << 'c' << endl;
  }
}
```

Since the variable `y` is const, `y=-1` can be found by the compiler.

## Const and Classes

### Introduction of Const-Interface

Recall our `Student` class:

```cpp
// student.h
class Student {
 public:
  std::string getName();
  void setName(std::string name);
  int getAge();
  void setAge(int age);

 private:
  std::string name;
  std::string state;
  int age;
};
```

```cpp
// student.cpp
#include "student.h"
std::string Student::getName() {
  return name;
}
void Student::setName(string name) {
  this->name = name;
}
int Student::getAge() {
  return age;
}
void Student::setAge(int age) {
  if (age >= 0) {
    this->age = age;
  }
  else error("Age cannot be negative!");
}
```

What if we use a const `Student`?

```cpp
// main.cpp
std::string stringify(const Student& s) {
  return s.getName() + "is" + std::to_string(s.getAge()) + " years old.";
}
```

It causes compile error! The compiler doesn't know `getName` and `getAge` don't modify `s`! We need to promise that it doesn't by defining them as **const functions**, by adding `const` to the **end** of function.

```cpp
// student.h
class Student {
 public:
  std::string getName() const;
  void setName(std::string name);
  int getAge() const;
  void setAge(int age);

 private:
  std::string name;
  std::string state;
  int age;
};
```

```cpp
// student.cpp
#include "student.h"
std::string Student::getName() const {
  return name;
}
void Student::setName(string name) {
  this->name = name;
}
int Student::getAge() const {
  return age;
}
void Student::setAge(int age) {
  if (age >= 0) {
    this->age = age;
  }
  else error("Age cannot be negative!");
}
```

**Def.**

- **const-interface**: All member functions marked `const` in a class definition. Objects of type `const ClassName` may ONLY use the const-interface.

### Practice

Let's make `StrVector`'s const-interface!

> [!TIP]
> Questions to ask whether a function should be a const-interface:
>
> 1. Should this function be able available to a const object?
>    1.1. Can I mark the function const as is (i.e. the function doesn't modify the object)?
>    1.2. Otherwise, can I make a const version of the function?

```cpp
class StrVector {
 public:
  using iterator = std::string*;
  const size_t kInitialSize = 2;
  /*...*/
  size_t size() const;  // const-interface. Yes
  bool empty() const;   // const-interface. Yes
  void push_back(const std::string& elem);
  std::string& at(size_t indx); // like vec[] but with error checking

  iterator begin(); // const-interface?
  iterator end();   // const-interface?
  /*...*/
};

std::string& StrVector::at(size_t index) {
  if (index >= size()) {
    throw std::out_of_range("Index out of range in at.");
  }
  return operator[](index); // operator[] = return *(begin() + index)
}
```

`size()` and `empty()` should be const-interfaces. Of course. What about `at()`? Seems like `at` doesn't modify the vector... can we just mark `at` const like we did with the other functions?

**NO!**

The problem is that `at` returns a reference to an element in the vector. That element reference could be modified (thereby modifying the vector). For example:

```cpp
// StrVector my_vec = { "sarah", "haven" };
std::string& elem_ref = my_vec.at(1);
elem_ref = "Now I'm Different";
// my_vec = { "sarah", "Now I'm Different" }
```

The solution should be adding a const version `at` function.

```cpp
std::string& at(size_t indx);
const std::string& at(size_t indx) const;
```

And implement them like this:

```cpp
std::string& StrVector::at(size_t index) {
  if (index >= size()) {
    throw std::out_of_range("Index out of range in at.");
  }
  return *(begin() + index);
}

const std::string& StrVector::at(size_t index) const {
  return static_cast<const std::string&>(
      const_cast<StrVector*>(this)->at(index));
}
```

Learn more about `static_cast` and `const_cast` [here](/posts/f5746381)

Should `begin()` and `end()` be `const`?

Consider a function with const `StrVector` param:

```cpp
void printVec(const StrVector& vec) {
  cout << "{ ";
  for (auto it = vec.begin(); it != vec.end(); ++it) {
    *it = "dont mind me modifying a const vector :D";
  }
  cout << "}" << endl;
}
```

This code will compile! `begin()` and `end` don't explicitly change `vec`, but they give us an iterator that can! But, we also need a way to iterate through a const `vec` just to access it.

The solution is `const_iterator`:

```cpp
class StrVector {
 public:
  using iterator = std::string*;
  using const_iterator = const std::string*;
  /*...*/
  iterator begin();
  iterator end();
  const_iterator begin() const;
  const_iterator end() const;
  /*...*/
};
```

### Const Iterator vs Const_iterator

This is tricky!

| Iterator Type        | Increment Iterator? | Change underlying value? |
| -------------------- | ------------------- | ------------------------ |
| iterator             | ✅                  | ✅                       |
| const_iterator       | ✅                  | ❌                       |
| const iterator       | ❌                  | ✅                       |
| const const_iterator | ❌                  | ❌                       |

```cpp
using iterator = std::string*;
using const_iterator = const std::string*;

const iterator it_c = vec.begin(); // string * const, const ptr to non-const obj
*it_c = "hi"; // OK! it_c is a const pointer to non-const object
it_c++; // not ok! can't change where a const pointer points!

const_iterator c_it = vec.begin(); // const string*, a non-const ptr to const object
c_it++; // totally ok! The pointer itself is non-const
*c_it = "hi"; // not ok! Can't change underlying const object
cout << *it << endl; // allowed! Can always read a const object, just can't change

// const string * const, const ptr to const obj
const const_iterator c_it_c = vec.begin();
cout << c_it_c << " points to " << *c_it_c << endl; // only reads are allowed!
c_it_c++; // not ok! can't change where a const pointer points!
*c_it_c = "hi"; // not ok! can't change underlying const object
```

## Recap

- Use const parameters and variables wherever you can in application code
- Every member function of a class that doesn't change it member variables should be marked `const`
- **Don't reinvent the wheel! Use our fancy `static_cast`/`const_cast` trick to use the non-const version to implement a const version of a function**
- `auto` will drop all `const` and `&`, so be sure to specify
- Make iterators and const_iterators for all your classes!
