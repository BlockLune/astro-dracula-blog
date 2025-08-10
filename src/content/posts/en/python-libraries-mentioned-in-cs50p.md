---
abbrlink: 22098b25
categories:
  - CS
  - Languages
  - Python
date: 2023-07-07 11:27:54
tags:
  - python
  - programming-language
  - software-engineering
  - tool
  - cs50p
title: Python libraries mentioned in CS50P
---

This is a list of some Python libraries mentioned in CS50P 2022.

<!--more-->

## WEEK 4: Libraries

### random

See **[Random](https://cs50.harvard.edu/python/2022/notes/4/#random)**

Ex.

```python
import random

coin = random.choice(["heads", "tails"])
print(coin)

number = random.randint(1, 10)
print(number)

cards = ["jack", "queen", "king"]
random.shuffle(cards)
for card in cards:
  print(card)
```

### statistics

See **[Statistics](https://cs50.harvard.edu/python/2022/notes/4/#statistics)**

Ex.

The `mean` function takes a list of values and print the average of these values.

```python
import statistics

print(statistics.mean([100, 90]))
```

### sys

See **[Command-Line Arguments](https://cs50.harvard.edu/python/2022/notes/4/#command-line-arguments)**

### cowsay

This library generates ascii arts like this:

```text
  ___________
< Hello World >
  ===========
                \
                 \
                   ^__^
                   (oo)\_______
                   (__)\       )\/\
                       ||----w |
                       ||     ||


```

See **[Packages](https://cs50.harvard.edu/python/2022/notes/4/#packages)**

### emoji

This library can convert some specified words to emoji. For instance, `:thumbsup:` can be converted to 👍.

See **[emojize](https://cs50.harvard.edu/python/2022/psets/4/emojize/)**

Ex.

```python
import emoji

words = input("Input: ")
print(f"Output: {emoji.emojize(words)}")
```

### pyfiglet

This library can make large letters out of ordinary text:

```text
 _ _ _          _   _     _
| (_) | _____  | |_| |__ (_)___
| | | |/ / _ \ | __| '_ \| / __|
| | |   <  __/ | |_| | | | \__ \
|_|_|_|\_\___|  \__|_| |_|_|___/
```

See **[Frank, lan and Glen's Letters](https://cs50.harvard.edu/python/2022/psets/4/figlet/)**

### inflect

This library can correctly generate plurals, singular nouns, ordinals, indefinite articles; convert numbers to words.

See **[Adieu, Adieu](https://cs50.harvard.edu/python/2022/psets/4/adieu/)**

### requests

See **[Bitcoin Price Index](https://cs50.harvard.edu/python/2022/psets/4/bitcoin/)**

### pylint

See **[Style](https://cs50.harvard.edu/python/2022/shorts/style/)**

### black

See **[Style](https://cs50.harvard.edu/python/2022/shorts/style/)**

## WEEK 5: Unit Tests

### pytest

See **[Pytest](https://cs50.harvard.edu/python/2022/notes/5/#pytest)**

Ex.1.

```python
# fuel.py
def main():
    while True:
        fraction = input("Fraction: ")
        try:
            percentage = convert(fraction)
            break
        except ValueError:
            pass
        except ZeroDivisionError:
            pass
    print(gauge(percentage))


def convert(fraction):
    x, y = [int(bit) for bit in fraction.split("/")]
    if x > y and y != 0:
        raise ValueError
    if y == 0:
        raise ZeroDivisionError
    return int(x / y * 100)

def gauge(percentage):
    if percentage <= 1:
        return "E"
    elif percentage >= 99:
        return "F"
    else:
        return f"{percentage}%"


if __name__ == "__main__":
    main()
```

```python
# test_fuel.py
from fuel import convert, gauge
import pytest

def test_covert():
    assert convert("0/4") == 0
    assert convert("1/4") == 25
    assert convert("3/4") == 75
    assert convert("4/4") == 100
    with pytest.raises(ValueError):
        assert convert("cat/dog")
        assert convert("three/four")
        assert convert("1.5/3")
        assert convert("4/3")
    with pytest.raises(ZeroDivisionError):
        assert convert("4/0")

def test_guage():
    assert gauge(0) == "E"
    assert gauge(1) == "E"
    assert gauge(25) == "25%"
    assert gauge(99) == "F"
    assert gauge(100) == "F"
```

Ex.2.

```python
# seasons.py
from datetime import date
import re
import sys
import inflect


DATE_REGEXP = r"^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$"


def main():
    date_str = input("Date of Birth: ")
    print(get_ans(date_str))


def get_ans(date_str):
    if is_valid_date(date_str):
        birthday = date.fromisoformat(date_str)
    else:
        print("Invalid date")
        sys.exit(1)
    today = date.today()
    days = (today - birthday).days
    p = inflect.engine()
    return (p.number_to_words(days * 24 * 60, andword="")).capitalize() + " minutes"


def is_valid_date(s):
    return re.search(DATE_REGEXP, s)


if __name__ == "__main__":
    main()
```

```python
# test_seasons.py
from seasons import get_ans
import pytest

def test_correctness():
    assert get_ans("2022-07-05") == "Five hundred twenty-five thousand, six hundred minutes"
    assert get_ans("2021-07-05") == "One million, fifty-one thousand, two hundred minutes"

def test_invalid_input():
    with pytest.raises(SystemExit):
        get_ans("January 1, 1999")
```

## WEEK 6: File I/O

### csv

See **[csv](https://cs50.harvard.edu/python/2022/notes/6/#csv)**

### pillow

This is a popular Python library that works well with image files.

See **[Binary Files and PIL](https://cs50.harvard.edu/python/2022/notes/6/#binary-files-and-pil)**

## WEEK 7: Regular Expressions

### re

See **[Notes](https://cs50.harvard.edu/python/2022/notes/7/)**

## WEEK 8: Object-Oriented Programming

### fpdf2

See **[CS50 Shirtificate](https://cs50.harvard.edu/python/2022/psets/8/shirtificate/)**

## WEEK 9: Et Cetera

### mypy

See **[Type Hints](https://cs50.harvard.edu/python/2022/notes/9/#type-hints)**

### argparse

See **[argparse](https://cs50.harvard.edu/python/2022/notes/9/#argparse)**

### pyttsx3

See **[This was CS50!](https://cs50.harvard.edu/python/2022/notes/9/#this-was-cs50)**
