---
abbrlink: ab76f233
categories:
  - CS
  - Languages
  - C & Cpp
date: 2023-05-31 11:35:00
tags:
  - const
  - cpp
  - cs106l
  - note
  - programming-language
  - software-engineering
  - stanford
  - type-safety
title: Type Safety and std::optional in C++
---

This is a note for Lecture 14, [CS106L](https://web.stanford.edu/class/cs106l/index.html), Spring 2023.

<!--more-->

## Recap: Const-Correctness

- We pass big pieces of data **by reference** into helper functions by to avoid making copies of that data
- If this function accidentally or sneakily changes that piece of data, it can lead to hard to find bugs!
- **Solution**: mark those reference parameters `const` to guarantee they won't be changed in function

How does the compiler know when it's safe to call member functions of `const` variables?

**Def.**

- **const-interface**: All member functions marked `const` in a class definition. Objects of type `const ClassName` may only use the const-interface.

**Ex.**

`RealVector`'s const-interface

```cpp
template<class ValueType>
class RealVector {
 public:
  using iterator = ValueType*;
  using const_iterator = const ValueType*;
  /*...*/
  size_t size() const;  // const-interface
  bool empty() const;   // const-interface
  /*...*/
  void push_back(const ValueType& elem);
  iterator begin();
  iterator end();
  const_iterator cbegin() const; // const-interface
  const_iterator cend() const;   // const-interface
  /*...*/
};
```

**KeyIdea.**

> Sometimes **less** functionality is **better** functionality

- Technically, adding a const-interface only **limits** what `RealVector` objects marked `const` can do
- Using types to enforce assumptions we make about function calls help us prevent programmer errors!

## Type Safety

**Def.**

- **Type Safety**: The extent to which a language prevents typing errors and **guarantees the behavior of programs**

### Introduction

Let's look at the code below:

```cpp
void removeOddsFromEnd(vector<int>& vec) {
  while (vec.back() % 2 == 1) {
    vec.pop_back();
  }
}
```

_Aside:_
_`vector::back()` returns a reference to the last element in the vector_
_`vector::pop_back()` is like the opposite of `vector::push_back(elem)`. It removes the last element from the vector_

What happens when input is {}? It causes **undefined behavior**. Function could crash, could give us garbage, could accidentally give us some actual value.

We can make NO guarantees about this function does!

One solution to the issue above is:

```cpp
void removeOddsFromEnd(vector<int>& vec) {
  while (!vec.empty() && vec.back() % 2 == 1) {
    vec.pop_back();
  }
}
```

**KeyIdea.**

It's the **programmers' job** to enforce the **precondition** that `vec` be non-empty, otherwise we get undefined behavior!

### Go Deep

The problem here is, there may or may not be a "last element" in `vec`. How can `vec.back()` have deterministic behavior in either case?

Can this work?

```cpp
// WRONG
valueType& vector<valueType>::back() {
  return *(begin() + size() - 1);
}
```

NO! Dereferencing a pointer without verifying it points to real memory is undefined behavior!

A solution is:

```cpp
valueType& vector<valueType>::back() {
  if (empty()) throw std::out_of_range(); // check if empty first
  return *(begin() + size() - 1);
}
```

Now, we will at least reliably error and stop the program **or** return the last element whenever `back()` is called.

Can we do better? Can `vec.back()` **warn us** if there may not be a "last element" when we call it?

**Def.**

- **Type Safety**: The extent to which a **function signature** guarantees the behavior of a **function**

A solution is:

```cpp
std::pair<bool, valueType&> vector<valueType>::back() {
  if (empty()) return { false, valueType() };
  return { true, *(begin() + size() - 1) };
}
```

`back()` now advertises that there may or may not be a last element.

But this solution causes other problems:

- `valueType` may not have a default constructor
- Even if it does, calling constructors is **expensive**

What should `back()` return?

Introducing...`std::optional`

### std::optional

What is `std::optional<T>`?

- `std::optional` is a template class which will either contain a value of type T or contain nothing (expressed as `nullopt`)

> [!WARNING]
> Pay attention to `nullopt`! That's NOT `nullptr`!
>
> - `nullptr`: an object that can be converted to a value of any **pointer** type
> - `nullopt`: an object that can be converted to a value of any **optional** type

Look at the code below:

```cpp
void main() {
  std::optional<int> num1 = {};  // num1 does not have a value
  num1 = 1;                      // now it does!
  num1 = std::nullopt;           // now it doesn't anymore
}

// {} and std::nullopt can be used interchangeable
```

With `std::optional`, we can make `back()` return an optional:

```cpp
std::optional<valueType> vector<valueType>::back() {
  if (empty()) {
    return {};
  }
  return *(begin() + size() - 1);
}
```

To use this version of `back()`, let's first look at some of `std::optional`'s interfaces:

- `.value()` returns the contained value or throws `bad_optional_access` error
- `.value_or(valueType val)` returns the contained value or default value, parameter `val`
- `.has_value()` returns `true` if contained value exists, `false` otherwise

We can do it like this:

```cpp
void removeOddsFromEnd(vector<int>& vec) {
  while (vec.back().has_value() && vec.back().value() % 2 == 1) {
    vec.pop_back();
  }
}
```

This will no longer error, but it is pretty unwieldy :/

Let's do this:

```cpp
void removeOddsFromEnd(vector<int>& vec) {
  while (vec.back() && vec.back().value() % 2 == 1) {
    vec.pop_back();
  }
}
```

Is this...good?

Pros of using `std::optional` returns:

- Function signatures create more informative contracts
- Class function calls have guaranteed and usable behavior

Cons:

- You will need to use `.value()` EVERYWHERE
- (In cpp) It's still possible to do a `bad_optional_access`
- (In cpp) optionals can have undefined behavior too (\*optional does same thing as `.value()` with no error checking)
- In a lot of cases we want `std::optional<T&>`... which we don't have

Why even bother with optionals?

Introducing... `std::optional` "monadic" interface (C++23)

- `.and_then(function f)` returns the result of calling `f(value)` if contained value exists, otherwise `nullopt` (`f` must return `optional`)
- `.transform(function f)` returns the result of calling `f(value)` if contained value exists, otherwise `nullopt` (`f` must return `optional<valueType>`)
- `.or_else(function f)` returns value if it exists, otherwise returns result of calling `f`

**Def.**

- **Monadic**: a software design pattern with a structure that combines program fragments (functions) and wraps their return values in a type with additional computation

- These all let you try a function and will either return the result of the computation or some default value.

**Ex.**

```cpp
void removeOddsFromEnd(vector<int>& vec) {
  auto isOdd = [](optional<int> num) {
    return num ? (num % 2 == 1) : {};
  };
  while (vec.back().and_then(isOdd)) {
    vec.pop_back();
  }
}
```

**Disclaimer:** `std::vector::back()` doesn't actually return an optional (and probably never will)
