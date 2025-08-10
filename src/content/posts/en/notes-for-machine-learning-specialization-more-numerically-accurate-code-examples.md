---
abbrlink: "44801878"
categories:
  - CS
  - AI
date: 2023-08-14 11:03:44
tags:
  - ai
  - machine-learning
  - tensorflow
  - coursera
  - softmax
  - note
title:
  "Notes for Machine Learning Specialization: More numerically accurate code
  examples"
---

This is a note for the [Machine Learning Specialization](https://www.coursera.org/specializations/machine-learning-introduction).

<!--more-->

From:

- _[P59 7.1 TensorFlow 实现](https://www.bilibili.com/video/BV19B4y1W76i?p=59)_
- _[P66 9.3 神经网络的 softmax 输出](https://www.bilibili.com/video/BV19B4y1W76i?p=66)_
- _[P67 9.4 softmax 的改进实现](https://www.bilibili.com/video/BV19B4y1W76i?p=67)_

## MNIST

Original:

```python
# model
import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense
model = Sequential([
    Dense(units=25, activation='relu')
    Dense(units=15, activation='relu')
    Dense(units=10, activation='softmax')
])
# loss and cost
from tensorflow.keras.losses import SparseCategoricalCrossentropy
model.compile(loss=SparseCategoricalCrossentropy())
# training
model.fit(X, Y, epochs=100)
```

More numerically accurate:

```python
# model
import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense
model = Sequential([
    Dense(units=25, activation='relu')
    Dense(units=15, activation='relu')
    Dense(units=10, activation='linear')  # the final layer no longer outputs
                                          # these probabilities a_1 through a_10
                                          # it's instead outputting z_1 through z_10
])
# loss
from tensorflow.keras.losses import SparseCategoricalCrossentropy
model.compile(...,loss=SparseCategoricalCrossentropy(from_logits=True))  # from_logits is the key
# fit
model.fit(X, Y, epochs=100)
# predict
logits = model(X)  # not a_1...a_10, is z_1...z_10
f_x = tf.nn.softmax(logits)
```

## Logistic regression

Original:

```python
import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense
model = Sequential([
    Dense(units=25, activation='sigmoid')
    Dense(units=15, activation='sigmoid')
    Dense(units=1, activation='sigmoid')
])
from tensorflow.keras.losses import BinaryCrossentropy
model.compile(loss=BinaryCrossentropy())
model.fit(X, Y, epochs=100)
```

More numerically accurate:

```python
# model
model = Sequential([
    Dense(units=25, activation='sigmoid')
    Dense(units=15, activation='sigmoid')
    Dense(units=1, activation='linear')
])
# loss
from tensorflow.keras.losses import BinaryCrossentropy
model.compile(..., loss=BinaryCrossentropy(from_logits=True))
# fit
model.fit(X, Y, epochs=100)
# predict
logit = model(X)
f_x = tf.nn.sigmoid(logit)
```
