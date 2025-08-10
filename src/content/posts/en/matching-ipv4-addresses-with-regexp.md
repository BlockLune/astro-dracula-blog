---
abbrlink: 1d74bec6
categories:
  - CS
  - Tools
date: 2023-07-04 16:03:46
katex: true
mathjax: true
tags:
  - python
  - regex
  - software-engineering
  - programming-language
  - ipv4
title: Matching IPv4 addresses with RegExp
---

While solving [the NUM3RS problem of CS50P](https://cs50.harvard.edu/python/2022/psets/7/numb3rs/), I was asked to match IPv4 addresses with RegExp.

<!--more-->

A valid IPv4 address should be like this:

$$
a.b.c.d:e
$$

where

$$
a,b,c,d \in [0, 255]
\\
e \in [0, 65525]
$$

RegExp doesn't support the direct expression of a number range. We have to do it some other way.

## The 0-255 Part

After some analysis, we can easily see that we can do the 0-255 part this way:

![From https://c.runoob.com/front-end/7625/](https://webp.blocklune.cc/blog-imgs/cs/tools/matching-ipv4-addresses-with-regexp/1.png)

and the RegExp should be like this:

```text
[0-9]|([1-9][0-9])|(1[0-9][0-9])|(2[0-4][0-9])|25[0-5]
```

or

```text
\d|([1-9]\d)|(1\d\d)|(2[0-4]\d)|(25[0-5])
```

## The 0-65525 Part

With similar method, we can write the 0-65535 part like this:

```text
[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]
```

![From https://c.runoob.com/front-end/7625/](https://webp.blocklune.cc/blog-imgs/cs/tools/matching-ipv4-addresses-with-regexp/2.png)

## Concatenate Them

```text
^((([0-9]|([1-9][0-9])|(1[0-9][0-9])|(2[0-4][0-9])|25[0-5])\.){3}([0-9]|([1-9][0-9])|(1[0-9][0-9])|(2[0-4][0-9])|25[0-5]))((:([0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?)$
```
