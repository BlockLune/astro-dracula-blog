---
abbrlink: f5746381
categories:
  - CS
  - Languages
  - C & Cpp
date: 2023-05-30 15:44:00
tags:
  - const
  - cpp
  - cs106l
  - note
  - programming-language
  - software-engineering
  - stanford
title: static_cast and const_cast in C++
---

This is a note for Lecture 8, [CS106L](https://web.stanford.edu/class/cs106l/index.html), Spring 2023.

<!--more-->

In a class like this:

```cpp
class StrVector {
 public:
  using iterator = std::string*;
  const size_t kInitialSize = 2;
  /*...*/
  size_t size() const;
  bool empty() const;
  void push_back(const std::string& elem);
  std::string& at(size_t indx);
  const std::string& at(size_t indx) const;

  iterator begin();
  iterator end();
  iterator cbegin() const;
  iterator cend() const;
  /*...*/
};
```

We implement the non-const `at` method like this:

```cpp
std::string& StrVector::at(size_t index) {
  if (index >= size()) {
    throw std::out_of_range("Index out of range in at.");
  }
  return *(begin() + index);
}
```

It is bad to reimplement the same logic when writing the const version of the `at` method.

```cpp
// bad
const std::string& StrVector::at(size_t index) const {
  if (index >= size()) {
    throw std::out_of_range("Index out of range in at.");
  }
  return *(cbegin() + index);
}
```

Instead, we should do this:

```cpp
const std::string& StrVector::at(size_t index) const {
  return static_cast<const std::string&>(
      const_cast<StrVector*>(this)->at(index));
}
```

So, what's `static_cast` and `const_cast`?

**static_cast\<new-type\>(expression)** is used to convert from one type to another. For example: `int my_int = static_cast<int>(3.1)`. Note that it CANNOT BE USED WHEN conversion would cast away constness.

Learn more [here](https://en.cppreference.com/w/cpp/language/static_cast)

**const_cast\<new-type\>(expression)** is used to cast away (remove) constness. It allows you to make non-const pointer or reference to const-object like this:

```cpp
const int const_int = 3;
int& my_int = const_cast<int&>(const_int);
```

Learn more [here](https://en.cppreference.com/w/cpp/language/const_cast)
