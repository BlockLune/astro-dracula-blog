---
abbrlink: f96b3358
categories:
  - CS
  - Languages
  - C & Cpp
date: 2023-03-25 20:12:40
tags:
  - cpp
  - c
  - input-validation
  - std-cin
title: Use std::cin.ignore() to keep the user typing until the input meets the requirements
---

I used to control users' input by making the input a string and process it later. But today, my friend posed this question to me: Can we control input without a char array or string class?

<!--more-->

On _[cppreference.com](https://en.cppreference.com/w/cpp/io/basic_istream/ignore)_, I found `std::cin.ignore()`. This function can help us solve the previous question. Here is an example:

```cpp
#include <iostream>
#include <limits>

int main() {
  int n = 0;
  while (true) {
    std::cout << "Please input a number: ";
    std::cin >> n;
    if (!std::cin.good()) {
      std::cerr << "Error input." << std::endl;
      std::cin.clear();
      std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
      continue;
    } else {
      break;
    }
  }
  std::cout << "Your input is: " << n << std::endl;
  return 0;
}
```
