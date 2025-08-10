---
abbrlink: d5786049
categories:
  - CS
  - Languages
  - C & Cpp
date: 2023-05-30 22:14:00
tags:
  - cpp
  - cs106l
  - move-semantics
  - note
  - programming-language
  - r-value-reference
  - special-member-functions
  - stanford
title: Move Semantics in C++
---

This is a note for Lecture 13, [CS106L](https://web.stanford.edu/class/cs106l/index.html), Spring 2023.

<!--more-->

## Definition

### L-Value

**l-value** can appear on the **left** or **right** of an `=`.

For example, here `x` is an l-value:

```cpp
int x = 3;
int y = x;
```

- l-values have names
- l-values are **not temporary**
- l-values live until the end of the **scope**

### R-Value

**r-value** can ONLY appear on the **right** of an `=`

For example, here `3` is an r-value:

```cpp
int x = 3;
int y = x;
```

- r-values don't have names
- r-values are **temporary**
- r-values live until the end of the **line**

### Examples

```cpp
int x = 3;                       // 3 is an r-value
int *ptr = 0x02248837;           // 0x02248837 is an r-value
vector<int> v1{1, 2, 3};         // {1, 2, 3} is an r-value, v1 is an l-value
auto v4 = v1 + v2;               // v1 + v2 is an r-value
size_t size = v.size();          // v.size() is an r-value
v1[1] = 4 * i;                   // 4 * i is an r-value, v1[1] is an l-value
ptr = &x;                        // &x is an r-value
v1[2] = *ptr;                    // *ptr is an l-value
MyClass obj;                     // obj is an l-value
x = obj.public_member_variable;  // obj.public_member_variable is l-value
```

## Move Semantics

In our generic `vector` class, we have a vector copy assignment operator like this:

```cpp
template <typename T>
vector<T>& vector<T>::operator=(const vector<T>& other) {
  if (&other == this) return *this;
  _size = other._size;
  _capacity = other._capacity;
  delete[] _elems;
  _elems = new T[other._capacity];
  std::copy(other._elems, other._elems + other._size, _elems);
  return *this;
}
```

_Aside: `std::copy` is a generic copy function used to copy a range of elements from one container to another._

And in the code fragment below:

```cpp
int main() {
  vector<int> vec;
  vec = make_me_a_vec(123);
}
```

- `vec` is created using the **default constructor**
- `make_me_a_vec` creates a vector using the **default constructor**
- `vec` is reassigned to a **copy** of that return value using **copy assignment**
- **copy assignment** creates a new array and **copies** the contents of the old one
- The original return value's lifetime ends and it calls its **destructor**
- `vec`'s lifetime ends and it calls its **destructor**

Here is a problem: `make_me_a_vec(123)` is an r-value, and in `vector<T>::operator=(const vector<T>& other)`, `other` should be an l-value (referenced using &). Can r-values be bound to `const &`?

The answer is Yes.

Another problem is that, we creates a vector, copies its content to another and deleted it. Can we do better?

We can use **move assignment** like this:

```cpp
template <typename T>
vector<T>& vector<T>::operator=(const vector<T>& other) {
  if (&other == this) return *this;
  _size = other._size;
  _capacity = other._capacity;
  _elems = other._elems; // we don't copy in this version
  return *this;
}
```

But what about this?

```cpp
int main() {
  vector<string> vec1 = {"hello", "world"};
  vector<string> vec2;
  vec2 = vec1;
  vec1.push_back("Sure hope vec2 doesn't see this!");
} // BAD!
```

A problem occurs here!**We need both a copy assignment AND a move assignment.**

How do we know when to use move assignment and when to use copy assignment?

**When the item on the right of the = is an r-value we should use move assignment.**

Why? r-values are always about to die, so we can steal their resources.

```cpp
int main() {
  vector<int> vec;
  vec = make_me_a_vec(123); // using move assignment
}
```

```cpp
int main() {
  vector<string> vec1 = {"hello", "world"};
  vector<string> vec2;
  vec2 = vec1; // using copy assignment
  vec1.push_back("Sure hope vec2 doesn't see this!");
} // and vec2 never saw a thing
```

And now the question is: how to make two different assignment operator?

Answer: Overload `vector::operator=`!

Introducing... the r-value reference using `&&`

## R-Value Reference

By using r-value reference, we can do this:

```cpp
int main() {
  int x = 1;
  change(x); // this will call version 2
  change(7); // this will call version 1
}
void change(int&& num) {...} // version 1 takes r-values
void change(int& num) {...}  // version 2 takes l-values
// num is a reference to int
```

So, we should keep our copy assignment:

```cpp
vector<T>& operator=(const vector<T>& other) {
  if (&other == this) return *this;
  _size = other._size;
  _capacity = other._capacity;

  // must **copy** entire array
  delete[] _elems;
  _elems = new T[other._capacity];
  std::copy(other._elems, other._elems + other.size, _elems);
  return *this;
}
```

And overload `vector::operator=` (move assignment) like this:

```cpp
vector<T>& operator=(vector<T>&& other) {
  if (&other == this) return *this;
  _size = other._size;
  _capacity = other._capacity;

  // we can **steal** the array
  delete[] _elems;
  _elems = other._elems;
  return *this;
}
```

But actually, we still copy `_size` and `_capacity`, etc.

Introducing...`std::move`!

## std::move

- `std::move(x)` **doesn't do anything** except **cast x as an r-value**
- It is a way to force C++ to choose the `&&` version of a function

```cpp
int main() {
  int x = 1;
  change(x);             // this will call version 2
  change(std::move(x));  // this will call version 1
}
void change(int&& num) {...} // version 1 takes r-values
void change(int& num) {...}  // version 2 takes l-values
```

We can modify our move assignment like this:

```cpp
vector<T>& operator=(vector<T>&& other) {
  if (&other == this) return *this;
  _size = std::move(other._size);          // force move assignment
  _capacity = std::move(other._capacity);  // force move assignment

  // we can **steal** the array
  delete[] _elems;
  _elems = std::move(other._elems);        // force move assignment
  return *this;
}
```

This works!

```cpp
int main() {
  vector<int> vec;
  vec = make_me_a_vec(123); // this will use move assignment
  vector<string> vec1 = {"hello", "world"};
  vector<string> vec2;
  vec2 = vec1; // this will use copy assignment
  vec1.push_back("Sure hope vec2 doesn't see this!");
}
```

However, what if we wanted to declare and initialize a vec on the same line?

```cpp
int main() {
  vector<int> vec;
  vec = make_me_a_vec(123); // this will use move assignment
  vector<string> vec1 = {"hello", "world"};
  vector<string> vec2 = vec1; // this will use copy constructor
  vec1.push_back("Sure hope vec2 doesn't see this!");
}
```

Similarly, `vector<string> vec1 = {"hello", "world"};` will use **move constructor**.

```cpp
vector<T>(vector<T>&& other) {
  if (&other == this) return *this;
  _size = std::move(other._size);
  _capacity = std::move(other._capacity);

  // we can steal the array
  delete[] _elems;
  _elems = std::move(other._elems);
  return *this;
}
```

Where else should we use `std::move`?

> Rule of Thumb:
> Wherever we take in a `const &` parameter in a class member function and assign it to something else in our function
> (TO BE CONTINUED)

For example:

```cpp
// copy push_back
void push_back(const T& element) {
  elems[_size++] = element;
  // this is copy assignment
}

// move push_back
void push_back(T&& element) {
  elems[_size++] = std::move(element);
  // this forces T's move assignment
}
```

Be careful with `std::move`

```cpp
int main() {
  vector<string> vec1 = {"hello", "world"};
  vector<string> vec2 = std::move(vec1);
  vec1.push_back("Sure hope vec2 doesn't see this!"); // WRONG
}
```

> Rule of Thumb:
> Wherever we take in a `const &` parameter in a class member function and assign it to something else in our function
> Don't use `std::move` outside of class definitions, never use it in application code!

## TLDR

- If your class has **copy constructor** and **copy assignment** defined, you should also define a **move constructor** and **move assignment**
- Define these by overloading your copy constructor and assignment to be defined for `Type&& other` as well as `Type& other`

- Use `std::move` to force the use of other types' move assignments and constructors
- All `std::move(x)` does is cast `x` as an r-value
- By wary of `std::move(x)` in main function code!

## Philosophy About SMFs

### The 6 Special Member Functions

1. **Default constructor**: Initializes an object to a default state
2. **Copy constructor**: Creates a new object by copying an existing object
3. **Move constructor**: Creates a new object by moving the resources of an existing object
4. **Copy Assignment Operator**: Assigns the contents of one object to another object
5. **Move Assignment Operator**: Moves the resources of one object to another object
6. **Destructor**: Frees any dynamically allocated resources owned by an object when it is destroyed

### Some Philosophy about SMFs

There are three guiding rules:

#### Rule of Zero

- **If you can avoid defining default operations, do**
- **Why?** It's the simplest and gives the cleanest semantic
- **Example:** Since `std::map` and `std::string` have all the special functions, no further work is needed.

```cpp
Class Named_map {
 public:
  // ...no default operations declared
 private:
  std::string name;
  std::map<int, int> rep;
};

Named_map nm;      // default construct
Named_map nm2{nm}; // copy construct
```

#### Rule of Three

- **If you need to implement a custom destructor, you almost certainly need to define a copy constructor and copy assignment operator**
- **Why?** You are probably managing your own memory somehow, so the shallow copies provided by the default operations won't work correctly

#### Rule of Five

- **If you define custom copy constructor/assignment operator, you should define move constructor/assignment operator as well**
- **Why?** This is about efficiency rather than correctness. It's inefficient to make extra copies (although it's "correct")
