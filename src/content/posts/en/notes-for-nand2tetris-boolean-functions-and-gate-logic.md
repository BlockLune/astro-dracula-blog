---
abbrlink: 53a0b5ef
categories:
  - CS
  - Computing System
  - Nand2Tetris
date: 2023-07-08 15:06:35
tags:
  - nand2tetris
  - note
  - hardware-description
  - boolean-logic
  - digital-circuits
title: "Notes for Nand2Tetris: Boolean Functions and Gate Logic"
---

This is a note for Nand2Tetris Unit 1.

<!--more-->

## Unit 1.2

We can transform any boolean function to its **disjunctive normal formula (析取范式)**, which means we can represent any boolean function only with `NOT`, `AND` and `OR`.

Can we go further and use only two operations? The answer is YES! Since we can represent `OR` with `NOT` and `AND`:

```text
(x OR y) = NOT(NOT(x) AND NOT(y))
```

Can we go even further? The answer is also YES! Introducing `NAND`:

**Def.**

```text
(x NAND y) = NOT(x AND y)
```

We can represent `NOT` only with `NAND`:

```text
NOT(x) = (x NAND x)
```

And then we can represent `AND` with `NAND` and `NOT`:

```text
(x AND y) = NOT(x NAND y)
```

## Unit 1.3

### Categories of logic gates

Logic gates:

- Elementary (Nand, And, Or, Not, ...)
- Composite (复合的) (Mux, Adder, ...)

### Gate diagrams

![Some gate diagrams](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-boolean-functions-and-gate-logic/1.png)

### Gate interfaces and implements

![Interface vs Implementation](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-boolean-functions-and-gate-logic/2.png)

## Unit 1.4

HDL: Hardware Description Language

Common HDLs:

- VHDL
- Verilog
- ...

## Unit 1.6

bus (总线)

Buses can be composed from (and broken into) sub-buses.

```hdl
...
IN lsb[8], msb[8], ...
...
Add16(a[0..7]=lsb, a[8..15]=msb, b=..., out=...);
Add16(..., out[0...3]=t1, out[4..15]=t2);
```

Attention that `[x..x]` can only appear in the left of the equal sign. Something wrong like `in=a[0..7]` raises `sub bus of an internal node may not be used` error!

`a[0]`: right-most bit (the least significant bit, LSB)
`a[15]`: left-most bit (the most significant bit, MSB)

Attention! The index is **FROM RIGHT TO LEFT**!

`true`: each bit gets one
`false`: each bit gets zero

## Unit 1.7

![Mux and DMux](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-boolean-functions-and-gate-logic/3.png)

### Multiplexor (Mux, 复用器)

```python
if sel == 0:
    out = a
else:
    out = b
```

### Demultiplexor (DMux, 解复用器)

```python
if sel == 0:
    a, b = in, 0
else:
    a, b = 0, in
```

## Project 1

### Not.hdl

Note that `NOT(x) = x NAND x`.

```hdl
/**
 * Not gate:
 * out = not in
 */

CHIP Not {
    IN in;
    OUT out;

    PARTS:
    Nand(a=in, b=in, out=out);
}
```

### Not16.hdl

Just repeat `Not` for 16 times. I wrote a Python script to generate this:

```python
for i in range(16):
    print(f"Not(in=in[{i}], out=out[{i}]);")
```

```hdl
/**
 * 16-bit Not:
 * for i=0..15: out[i] = not in[i]
 */

CHIP Not16 {
    IN in[16];
    OUT out[16];

    PARTS:
    Not(in=in[0], out=out[0]);
    Not(in=in[1], out=out[1]);
    Not(in=in[2], out=out[2]);
    Not(in=in[3], out=out[3]);
    Not(in=in[4], out=out[4]);
    Not(in=in[5], out=out[5]);
    Not(in=in[6], out=out[6]);
    Not(in=in[7], out=out[7]);
    Not(in=in[8], out=out[8]);
    Not(in=in[9], out=out[9]);
    Not(in=in[10], out=out[10]);
    Not(in=in[11], out=out[11]);
    Not(in=in[12], out=out[12]);
    Not(in=in[13], out=out[13]);
    Not(in=in[14], out=out[14]);
    Not(in=in[15], out=out[15]);
}
```

### And.hdl

Note that `(x AND y) = NOT(x NAND y)`.

```hdl
/**
 * And gate:
 * out = 1 if (a == 1 and b == 1)
 *       0 otherwise
 */

CHIP And {
    IN a, b;
    OUT out;

    PARTS:
    Nand(a=a, b=b, out=aNandb);
    Not(in=aNandb, out=out);
}
```

### And16.hdl

Similarly, repeat `And` for 16 times.

```text
/**
 * 16-bit bitwise And:
 * for i = 0..15: out[i] = (a[i] and b[i])
 */

CHIP And16 {
    IN a[16], b[16];
    OUT out[16];

    PARTS:
    And(a=a[0], b=b[0], out=out[0]);
    And(a=a[1], b=b[1], out=out[1]);
    And(a=a[2], b=b[2], out=out[2]);
    And(a=a[3], b=b[3], out=out[3]);
    And(a=a[4], b=b[4], out=out[4]);
    And(a=a[5], b=b[5], out=out[5]);
    And(a=a[6], b=b[6], out=out[6]);
    And(a=a[7], b=b[7], out=out[7]);
    And(a=a[8], b=b[8], out=out[8]);
    And(a=a[9], b=b[9], out=out[9]);
    And(a=a[10], b=b[10], out=out[10]);
    And(a=a[11], b=b[11], out=out[11]);
    And(a=a[12], b=b[12], out=out[12]);
    And(a=a[13], b=b[13], out=out[13]);
    And(a=a[14], b=b[14], out=out[14]);
    And(a=a[15], b=b[15], out=out[15]);
}
```

### Or.hdl

Note that `(x Or y) = NOT(NOT(x) AND NOT(y))`.

```hdl
 /**
 * Or gate:
 * out = 1 if (a == 1 or b == 1)
 *       0 otherwise
 */

CHIP Or {
    IN a, b;
    OUT out;

    PARTS:
    Not(in=a, out=Nota);
    Not(in=b, out=Notb);
    And(a=Nota, b=Notb, out=NotaAndNotb);
    Not(in=NotaAndNotb, out=out);
}
```

### Or16.hdl

```hdl
/**
 * 16-bit bitwise Or:
 * for i = 0..15 out[i] = (a[i] or b[i])
 */

CHIP Or16 {
    IN a[16], b[16];
    OUT out[16];

    PARTS:
    Or(a=a[0], b=b[0], out=out[0]);
    Or(a=a[1], b=b[1], out=out[1]);
    Or(a=a[2], b=b[2], out=out[2]);
    Or(a=a[3], b=b[3], out=out[3]);
    Or(a=a[4], b=b[4], out=out[4]);
    Or(a=a[5], b=b[5], out=out[5]);
    Or(a=a[6], b=b[6], out=out[6]);
    Or(a=a[7], b=b[7], out=out[7]);
    Or(a=a[8], b=b[8], out=out[8]);
    Or(a=a[9], b=b[9], out=out[9]);
    Or(a=a[10], b=b[10], out=out[10]);
    Or(a=a[11], b=b[11], out=out[11]);
    Or(a=a[12], b=b[12], out=out[12]);
    Or(a=a[13], b=b[13], out=out[13]);
    Or(a=a[14], b=b[14], out=out[14]);
    Or(a=a[15], b=b[15], out=out[15]);
}
```

### Or8Way.hdl

Connect all the eight inputs together end to end with `Or`.

```hdl
/**
 * 8-way Or:
 * out = (in[0] or in[1] or ... or in[7])
 */

CHIP Or8Way {
    IN in[8];
    OUT out;

    PARTS:
    Or(a=in[0], b=in[1], out=or1);
    Or(a=or1, b=in[2], out=or2);
    Or(a=or2, b=in[3], out=or3);
    Or(a=or3, b=in[4], out=or4);
    Or(a=or4, b=in[5], out=or5);
    Or(a=or5, b=in[6], out=or6);
    Or(a=or6, b=in[7], out=out);
}
```

### Xor.hdl

List the truth table of `XOR`, and then you will find that `(x XOR y) = (NOT(x) AND y) OR (x AND NOT(y))`.

```hdl
/**
 * Exclusive-or gate:
 * out = not (a == b)
 */

CHIP Xor {
    IN a, b;
    OUT out;

    PARTS:
    Not(in=a, out=Nota);
    Not(in=b, out=Notb);
    And(a=Nota, b=b, out=NotaAndb);
    And(a=a, b=Notb, out=aAndNotb);
    Or(a=NotaAndb, b=aAndNotb, out=out);
}
```

### Mux.hdl

List the truth table, and find the disjunctive normal formula:

```text
MUX(a, b, sel) = (NOT(a) AND b AND sel)
              OR (a AND NOT(b) AND NOT(sel))
              OR (a AND b AND NOT(sel))
              OR (a AND b AND sel)
```

```hdl
/**
 * Multiplexor:
 * out = a if sel == 0
 *       b otherwise
 */

CHIP Mux {
    IN a, b, sel;
    OUT out;

    PARTS:
    Not(in=a, out=Nota);
    Not(in=b, out=Notb);
    Not(in=sel, out=Notsel);
    And(a=Nota, b=b, out=p1p);
    And(a=p1p, b=sel, out=p1);
    And(a=a, b=Notb, out=p2p);
    And(a=p2p, b=Notsel, out=p2);
    And(a=a, b=b, out=p34p);
    And(a=p34p, b=Notsel, out=p3);
    And(a=p34p, b=sel, out=p4);
    Or(a=p1, b=p2, out=o1);
    Or(a=o1, b=p3, out=o2);
    Or(a=o2, b=p4, out=out);
}
```

### Mux16.hdl

```hdl
/**
 * 16-bit multiplexor:
 * for i = 0..15 out[i] = a[i] if sel == 0
 *                        b[i] if sel == 1
 */

CHIP Mux16 {
    IN a[16], b[16], sel;
    OUT out[16];

    PARTS:
    Mux(a=a[0], b=b[0], sel=sel, out=out[0]);
    Mux(a=a[1], b=b[1], sel=sel, out=out[1]);
    Mux(a=a[2], b=b[2], sel=sel, out=out[2]);
    Mux(a=a[3], b=b[3], sel=sel, out=out[3]);
    Mux(a=a[4], b=b[4], sel=sel, out=out[4]);
    Mux(a=a[5], b=b[5], sel=sel, out=out[5]);
    Mux(a=a[6], b=b[6], sel=sel, out=out[6]);
    Mux(a=a[7], b=b[7], sel=sel, out=out[7]);
    Mux(a=a[8], b=b[8], sel=sel, out=out[8]);
    Mux(a=a[9], b=b[9], sel=sel, out=out[9]);
    Mux(a=a[10], b=b[10], sel=sel, out=out[10]);
    Mux(a=a[11], b=b[11], sel=sel, out=out[11]);
    Mux(a=a[12], b=b[12], sel=sel, out=out[12]);
    Mux(a=a[13], b=b[13], sel=sel, out=out[13]);
    Mux(a=a[14], b=b[14], sel=sel, out=out[14]);
    Mux(a=a[15], b=b[15], sel=sel, out=out[15]);
}
```

### Mux4Way16.hdl

The idea of the implementation is classify the four inputs into two groups, and use two layers of `Mux16`;

![Mux4Way](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-boolean-functions-and-gate-logic/4.png)

```hdl
/**
 * 4-way 16-bit multiplexor:
 * out = a if sel == 00
 *       b if sel == 01
 *       c if sel == 10
 *       d if sel == 11
 */

CHIP Mux4Way16 {
    IN a[16], b[16], c[16], d[16], sel[2];
    OUT out[16];

    PARTS:
    Mux16(a=a, b=b, sel=sel[0], out=ab);
    Mux16(a=c, b=d, sel=sel[0], out=cd);
    Mux16(a=ab, b=cd, sel=sel[1], out=out);
}
```

### Mux8Way16.hdl

```hdl
/**
 * 8-way 16-bit multiplexor:
 * out = a if sel == 000
 *       b if sel == 001
 *       etc.
 *       h if sel == 111
 */

CHIP Mux8Way16 {
    IN a[16], b[16], c[16], d[16],
       e[16], f[16], g[16], h[16],
       sel[3];
    OUT out[16];

    PARTS:
    Mux4Way16(a=a, b=b, c=c, d=d, sel=sel[0..1], out=abcd);
    Mux4Way16(a=e, b=f, c=g, d=h, sel=sel[0..1], out=efgh);
    Mux16(a=abcd, b=efgh, sel=sel[2], out=out);
}
```

### DMux.hdl

```hdl
/**
 * Demultiplexor:
 * {a, b} = {in, 0} if sel == 0
 *          {0, in} if sel == 1
 */

CHIP DMux {
    IN in, sel;
    OUT a, b;

    PARTS:
    Not(in=sel, out=Notsel);
    And(a=in, b=Notsel, out=a);
    And(a=in, b=sel, out=b);
}
```

### DMux4Way.hdl

![DMux4Way](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-boolean-functions-and-gate-logic/5.png)

```hdl
/**
 * 4-way demultiplexor:
 * {a, b, c, d} = {in, 0, 0, 0} if sel == 00
 *                {0, in, 0, 0} if sel == 01
 *                {0, 0, in, 0} if sel == 10
 *                {0, 0, 0, in} if sel == 11
 */

CHIP DMux4Way {
    IN in, sel[2];
    OUT a, b, c, d;

    PARTS:
    DMux(in=in, sel=sel[1], a=ab, b=cd);
    DMux(in=ab, sel=sel[0], a=a, b=b);
    DMux(in=cd, sel=sel[0], a=c, b=d);
}
```

### DMux8Way.hdl

```hdl
/**
 * 8-way demultiplexor:
 * {a, b, c, d, e, f, g, h} = {in, 0, 0, 0, 0, 0, 0, 0} if sel == 000
 *                            {0, in, 0, 0, 0, 0, 0, 0} if sel == 001
 *                            etc.
 *                            {0, 0, 0, 0, 0, 0, 0, in} if sel == 111
 */

CHIP DMux8Way {
    IN in, sel[3];
    OUT a, b, c, d, e, f, g, h;

    PARTS:
    DMux(in=in, sel=sel[2], a=abcd, b=efgh);
    DMux4Way(in=abcd, sel=sel[0..1], a=a, b=b, c=c, d=d);
    DMux4Way(in=efgh, sel=sel[0..1], a=e, b=f, c=g, d=h);
}
```
