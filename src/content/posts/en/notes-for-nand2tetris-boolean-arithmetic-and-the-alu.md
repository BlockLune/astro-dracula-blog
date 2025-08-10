---
abbrlink: f0f4eaec
categories:
  - CS
  - Computing System
  - Nand2Tetris
date: 2023-07-08 22:17:06
katex: true
mathjax: true
tags:
  - nand2tetris
  - algorithm
  - hardware-design
  - digital-logic
  - coursera
  - note
title: "Notes for Nand2Tetris: Boolean Arithmetic and the ALU"
---

This is a note for Nand2Tetris Unit 2.

<!--more-->

## Unit 2.2

### Half Adder

Truth table:

| a   | b   | sum | carry |
| --- | --- | --- | ----- |
| 0   | 0   | 0   | 0     |
| 0   | 1   | 1   | 0     |
| 1   | 0   | 1   | 0     |
| 1   | 1   | 0   | 1     |

Interface:

```hdl
CHIP HalfAdder {
    IN a, b;
    OUT sum,
        carry;

    PARTS:
    ...
}
```

Idea:

- `sum` is `a XOR b`
- `carry` is `a AND b`

### Full Adder

Interface:

```hdl
CHIP FullAdder {
    IN a, b, c;
    OUT sum,
        carry;

    PARTS:
    ...
}
```

## Unit 2.3

### 2's complement

2's complement represent negative number $-x$ using the positive number $2^{n}-x$.

- Range of positive numbers: $[0, 2^{n-1}-1]$
- Range of negative numbers: $[-2^{n-1}, -1]$

### How to compute -x

How to do this quickly?

$$
Input: x
$$

$$
Output: -x (in 2's complement)
$$

The idea is:

$$
2^{n}-x = 1+(2^{n}-1)-x
$$

where $(2^{n}-1)$ is $n$ bits of ones, and using it to minus $x$ equals to flipping every bit of $x$.

So, the steps to compute -x is:

1. Flip every bit of x;
2. Plus one.

## Unit 2.4

ALU: Arithmetic Logic Unit

![alu](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-boolean-arithmetic-and-the-alu/1.png)

## Project 2

### HalfAdder.hdl

```hdl
CHIP HalfAdder {
    IN a, b;    // 1-bit inputs
    OUT sum,    // Right bit of a + b
        carry;  // Left bit of a + b

    PARTS:
    Xor(a=a, b=b, out=sum);
    And(a=a, b=b, out=carry);
}
```

### FullAdder.hdl

Use two `HalfAdder`s and a `OR` to combine a `FullAdder`, per [here](https://www.zhihu.com/question/39925519/answer/1996568103).

```hdl
CHIP FullAdder {
    IN a, b, c;  // 1-bit inputs
    OUT sum,     // Right bit of a + b + c
        carry;   // Left bit of a + b + c

    PARTS:
    HalfAdder(a=a, b=b, sum=ab, carry=c1);
    HalfAdder(a=ab, b=c, sum=sum, carry=c2);
    Or(a=c1, b=c2, out=carry);
}
```

### Add16.hdl

```hdl
CHIP Add16 {
    IN a[16], b[16];
    OUT out[16];

    PARTS:
    HalfAdder(a=a[0], b=b[0], sum=out[0], carry=c0);
    FullAdder(a=a[1], b=b[1], c=c0, sum=out[1], carry=c1);
    FullAdder(a=a[2], b=b[2], c=c1, sum=out[2], carry=c2);
    FullAdder(a=a[3], b=b[3], c=c2, sum=out[3], carry=c3);
    FullAdder(a=a[4], b=b[4], c=c3, sum=out[4], carry=c4);
    FullAdder(a=a[5], b=b[5], c=c4, sum=out[5], carry=c5);
    FullAdder(a=a[6], b=b[6], c=c5, sum=out[6], carry=c6);
    FullAdder(a=a[7], b=b[7], c=c6, sum=out[7], carry=c7);
    FullAdder(a=a[8], b=b[8], c=c7, sum=out[8], carry=c8);
    FullAdder(a=a[9], b=b[9], c=c8, sum=out[9], carry=c9);
    FullAdder(a=a[10], b=b[10], c=c9, sum=out[10], carry=c10);
    FullAdder(a=a[11], b=b[11], c=c10, sum=out[11], carry=c11);
    FullAdder(a=a[12], b=b[12], c=c11, sum=out[12], carry=c12);
    FullAdder(a=a[13], b=b[13], c=c12, sum=out[13], carry=c13);
    FullAdder(a=a[14], b=b[14], c=c13, sum=out[14], carry=c14);
    FullAdder(a=a[15], b=b[15], c=c14, sum=out[15], carry=null); // null means deprecated
}
```

### Inc16.hdl

This is a little tricky.

```hdl
CHIP Inc16 {
    IN in[16];
    OUT out[16];

    PARTS:
    Add16(a=in, b[0]=true, out=out);
}
```

### ALU.hdl

There are so many conditionals in this chip. How to make them? The idea is make all the results first, then choose the result we what using `Mux`.

```hdl
/**
 * The ALU (Arithmetic Logic Unit).
 * Computes one of the following functions:
 * x+y, x-y, y-x, 0, 1, -1, x, y, -x, -y, !x, !y,
 * x+1, y+1, x-1, y-1, x&y, x|y on two 16-bit inputs,
 * according to 6 input bits denoted zx,nx,zy,ny,f,no.
 * In addition, the ALU computes two 1-bit outputs:
 * if the ALU output == 0, zr is set to 1; otherwise zr is set to 0;
 * if the ALU output < 0, ng is set to 1; otherwise ng is set to 0.
 */

// Implementation: the ALU logic manipulates the x and y inputs
// and operates on the resulting values, as follows:
// if (zx == 1) set x = 0        // 16-bit constant
// if (nx == 1) set x = !x       // bitwise not
// if (zy == 1) set y = 0        // 16-bit constant
// if (ny == 1) set y = !y       // bitwise not
// if (f == 1)  set out = x + y  // integer 2's complement addition
// if (f == 0)  set out = x & y  // bitwise and
// if (no == 1) set out = !out   // bitwise not
// if (out == 0) set zr = 1
// if (out < 0) set ng = 1

CHIP ALU {
    IN
        x[16], y[16],  // 16-bit inputs
        zx, // zero the x input?
        nx, // negate the x input?
        zy, // zero the y input?
        ny, // negate the y input?
        f,  // compute out = x + y (if 1) or x & y (if 0)
        no; // negate the out output?

    OUT
        out[16], // 16-bit output
        zr, // 1 if (out == 0), 0 otherwise
        ng; // 1 if (out < 0),  0 otherwise

    PARTS:

    // zero the x input?
    Mux16(a=x, b=false, sel=zx, out=zeroStepProcessedX);
    // negate the x input?
    Not16(in=zeroStepProcessedX, out=negateStepProcessedX);
    Mux16(a=zeroStepProcessedX, b=negateStepProcessedX, sel=nx, out=newX);


    // zero the y input?
    Mux16(a=y, b=false, sel=zy, out=zeroStepProcessedY);
    // negate the x input?
    Not16(in=zeroStepProcessedY, out=negateStepProcessedY);
    Mux16(a=zeroStepProcessedY, b=negateStepProcessedY, sel=ny, out=newY);

    // (x + y) or (x & y)
    Add16(a=newX, b=newY, out=xAddY);
    And16(a=newX, b=newY, out=xAndY);
    Mux16(a=xAndY, b=xAddY, sel=f, out=fxy);

    // negate the out output?
    Not16(in=fxy, out=notFxy);
    Mux16(a=fxy, b=notFxy, sel=no, out=out, out[0..7]=leftOut, out[8..15]=rightOut, out[15]=negFlag);

    // zr
    // use two Or8Ways to transform 16 bits to 1 bits
    Or8Way(in=leftOut, out=lnzr);  // left not zr
    Or8Way(in=rightOut, out=rnzr); // right not zr
    Or(a=lnzr, b=rnzr, out=nzr);
    Not(in=nzr, out=zr);

    // ng
    Or(a=negFlag, b=false, out=ng);
}
```
