---
abbrlink: 28d92424
categories:
  - CS
  - Computing System
  - Nand2Tetris
date: 2023-07-09 19:44:36
katex: true
mathjax: true
tags:
  - nand2tetris
  - note
  - computer-architecture
  - digital-logic
title: "Notes for Nand2Tetris: Memory"
---

This is a note for Nand2Tetris unit 3.

<!--more-->

So many pictures in this unit. Highly recommended to read the textbook.

## Unit 3.1

Combinatorial Logic vs Sequential Logic

- Combinatorial: $out[t]=function(in[t])$
- Sequential: $out[t]=function(in[t-1])$

## Unit 3.2

Flip Flops (触发器)

![Sequential Logic](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-memory/1.png)

The Clock Data Flip Flop (DFF):

![DFF](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-memory/2.png)

Implementation of the DFF:

- In this course, it's a primitive
- In many physical implementations, it may be built from actual Nand gates:
- 1. create a "loop" achieving an "un-clocked" flip flop
- 2. isolation across time steps using a "master-slave" step up

Bit (1-bit Register):

![Bit](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-memory/3.png)

```python
if load[t-1]:
    out[t] = in[t-1]
else:
    out[t] = out[t-1]
```

Register:

![Register](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-memory/4.png)

- w (word width): 16-bit, 32-bit, 64-bit ...
- Register's state: the value which is currently stored in the register

RAM unit:

A sequence of $n$ addressable registers, which addresses $0$ to $n-1$.

At any given point of time, only one register in the RAM is selected.

- k (width of address input): $k = log_{2}n$

![RAM](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-memory/5.png)

## Unit 3.3

Memory:

- Main memory: RAM ...
- Secondary memory: disks ...
- volatile / non-volatile

## Unit 3.4

Counter's three possible control settings:

- Reset: $PC=0$
- Next: $PC++$
- Goto: $PC=n$

![PC](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-memory/6.png)

```python
if reset[t] == 1:
    out[t+1] = 0
elif load[t] == 1:
    out[t+1] = in[t]
elif inc[t] ==1:
    out[t+1] = out[t] + 1
else:
    out[t+1] = out[t]
```

## Project 3

### Bit.hdl

Just follow the implementation given in the course, and build a `Bit` with a `Mux` and a `DFF`:

```hdl
/**
 * 1-bit register:
 * If load[t] == 1 then out[t+1] = in[t]
 *                 else out does not change (out[t+1] = out[t])
 */

CHIP Bit {
    IN in, load;
    OUT out;

    PARTS:
    Mux(a=dffout, b=in, sel=load, out=dffin);
    DFF(in=dffin, out=out, out=dffout);
}
```

### Register.hdl

A `Register` is 16 `Bit`s.

```hdl
/**
 * 16-bit register:
 * If load[t] == 1 then out[t+1] = in[t]
 * else out does not change
 */

CHIP Register {
    IN in[16], load;
    OUT out[16];

    PARTS:
    Bit(in=in[0], load=load, out=out[0]);
    Bit(in=in[1], load=load, out=out[1]);
    Bit(in=in[2], load=load, out=out[2]);
    Bit(in=in[3], load=load, out=out[3]);
    Bit(in=in[4], load=load, out=out[4]);
    Bit(in=in[5], load=load, out=out[5]);
    Bit(in=in[6], load=load, out=out[6]);
    Bit(in=in[7], load=load, out=out[7]);
    Bit(in=in[8], load=load, out=out[8]);
    Bit(in=in[9], load=load, out=out[9]);
    Bit(in=in[10], load=load, out=out[10]);
    Bit(in=in[11], load=load, out=out[11]);
    Bit(in=in[12], load=load, out=out[12]);
    Bit(in=in[13], load=load, out=out[13]);
    Bit(in=in[14], load=load, out=out[14]);
    Bit(in=in[15], load=load, out=out[15]);
}
```

### RAM8.hdl

Use `DMux` to choose which address to load, then use `Mux` to get the loaded values.

```hdl
/**
 * Memory of 8 registers, each 16 bit-wide. Out holds the value
 * stored at the memory location specified by address. If load==1, then
 * the in value is loaded into the memory location specified by address
 * (the loaded value will be emitted to out from the next time step onward).
 */

CHIP RAM8 {
    IN in[16], load, address[3];
    OUT out[16];

    PARTS:
    DMux8Way(in=load, sel=address,
             a=reg0l, b=reg1l, c=reg2l, d=reg3l,
             e=reg4l, f=reg5l, g=reg6l, h=reg7l);
    Register(in=in, load=reg0l, out=reg0o);
    Register(in=in, load=reg1l, out=reg1o);
    Register(in=in, load=reg2l, out=reg2o);
    Register(in=in, load=reg3l, out=reg3o);
    Register(in=in, load=reg4l, out=reg4o);
    Register(in=in, load=reg5l, out=reg5o);
    Register(in=in, load=reg6l, out=reg6o);
    Register(in=in, load=reg7l, out=reg7o);
    Mux8Way16(a=reg0o, b=reg1o, c=reg2o, d=reg3o,
              e=reg4o, f=reg5o, g=reg6o, h=reg7o,
              sel=address, out=out);
}
```

### RAM64.hdl

Group the addresses.

Based on `RAM8`.

```hdl
/**
 * Memory of 64 registers, each 16 bit-wide. Out holds the value
 * stored at the memory location specified by address. If load==1, then
 * the in value is loaded into the memory location specified by address
 * (the loaded value will be emitted to out from the next time step onward).
 */

CHIP RAM64 {
    IN in[16], load, address[6];
    OUT out[16];

    PARTS:
    DMux8Way(in=load, sel=address[3..5],
             a=ram80l, b=ram81l, c=ram82l, d=ram83l,
             e=ram84l, f=ram85l, g=ram86l, h=ram87l);
    RAM8(in=in, load=ram80l, address=address[0..2], out=ram80o);
    RAM8(in=in, load=ram81l, address=address[0..2], out=ram81o);
    RAM8(in=in, load=ram82l, address=address[0..2], out=ram82o);
    RAM8(in=in, load=ram83l, address=address[0..2], out=ram83o);
    RAM8(in=in, load=ram84l, address=address[0..2], out=ram84o);
    RAM8(in=in, load=ram85l, address=address[0..2], out=ram85o);
    RAM8(in=in, load=ram86l, address=address[0..2], out=ram86o);
    RAM8(in=in, load=ram87l, address=address[0..2], out=ram87o);
    Mux8Way16(a=ram80o, b=ram81o, c=ram82o, d=ram83o,
              e=ram84o, f=ram85o, g=ram86o, h=ram87o,
              sel=address[3..5], out=out);
}
```

### RAM512.hdl

Based on `RAM64`.

```hdl
/**
 * Memory of 512 registers, each 16 bit-wide. Out holds the value
 * stored at the memory location specified by address. If load==1, then
 * the in value is loaded into the memory location specified by address
 * (the loaded value will be emitted to out from the next time step onward).
 */

CHIP RAM512 {
    IN in[16], load, address[9];
    OUT out[16];

    PARTS:
    DMux8Way(in=load, sel=address[6..8],
             a=ram640l, b=ram641l, c=ram642l, d=ram643l,
             e=ram644l, f=ram645l, g=ram646l, h=ram647l);
    RAM64(in=in, load=ram640l, address=address[0..5], out=ram640o);
    RAM64(in=in, load=ram641l, address=address[0..5], out=ram641o);
    RAM64(in=in, load=ram642l, address=address[0..5], out=ram642o);
    RAM64(in=in, load=ram643l, address=address[0..5], out=ram643o);
    RAM64(in=in, load=ram644l, address=address[0..5], out=ram644o);
    RAM64(in=in, load=ram645l, address=address[0..5], out=ram645o);
    RAM64(in=in, load=ram646l, address=address[0..5], out=ram646o);
    RAM64(in=in, load=ram647l, address=address[0..5], out=ram647o);
    Mux8Way16(a=ram640o, b=ram641o, c=ram642o, d=ram643o,
              e=ram644o, f=ram645o, g=ram646o, h=ram647o,
              sel=address[6..8], out=out);
}
```

### RAM4K.hdl

Based on `RAM512`.

```hdl
/**
 * Memory of 4K registers, each 16 bit-wide. Out holds the value
 * stored at the memory location specified by address. If load==1, then
 * the in value is loaded into the memory location specified by address
 * (the loaded value will be emitted to out from the next time step onward).
 */

CHIP RAM4K {
    IN in[16], load, address[12];
    OUT out[16];

    PARTS:
    DMux8Way(in=load, sel=address[9..11],
             a=ram5120l, b=ram5121l, c=ram5122l, d=ram5123l,
             e=ram5124l, f=ram5125l, g=ram5126l, h=ram5127l);
    RAM512(in=in, load=ram5120l, address=address[0..8], out=ram5120o);
    RAM512(in=in, load=ram5121l, address=address[0..8], out=ram5121o);
    RAM512(in=in, load=ram5122l, address=address[0..8], out=ram5122o);
    RAM512(in=in, load=ram5123l, address=address[0..8], out=ram5123o);
    RAM512(in=in, load=ram5124l, address=address[0..8], out=ram5124o);
    RAM512(in=in, load=ram5125l, address=address[0..8], out=ram5125o);
    RAM512(in=in, load=ram5126l, address=address[0..8], out=ram5126o);
    RAM512(in=in, load=ram5127l, address=address[0..8], out=ram5127o);
    Mux8Way16(a=ram5120o, b=ram5121o, c=ram5122o, d=ram5123o,
              e=ram5124o, f=ram5125o, g=ram5126o, h=ram5127o,
              sel=address[9..11], out=out);
}
```

### RAM16K.hdl

Based on `RAM4K`.

```hdl
/**
 * Memory of 16K registers, each 16 bit-wide. Out holds the value
 * stored at the memory location specified by address. If load==1, then
 * the in value is loaded into the memory location specified by address
 * (the loaded value will be emitted to out from the next time step onward).
 */

CHIP RAM16K {
    IN in[16], load, address[14];
    OUT out[16];

    PARTS:
    DMux4Way(in=load, sel=address[12..13],
             a=ram4K0l, b=ram4K1l, c=ram4K2l, d=ram4K3l);
    RAM4K(in=in, load=ram4K0l, address=address[0..11], out=ram4K0o);
    RAM4K(in=in, load=ram4K1l, address=address[0..11], out=ram4K1o);
    RAM4K(in=in, load=ram4K2l, address=address[0..11], out=ram4K2o);
    RAM4K(in=in, load=ram4K3l, address=address[0..11], out=ram4K3o);
    Mux4Way16(a=ram4K0o, b=ram4K1o, c=ram4K2o, d=ram4K3o,
              sel=address[12..13], out=out);
}
```

### PC.hdl

`PC` is Program Counter.

```hdl
/**
 * A 16-bit counter with load and reset control bits.
 * if      (reset[t] == 1) out[t+1] = 0
 * else if (load[t] == 1)  out[t+1] = in[t]
 * else if (inc[t] == 1)   out[t+1] = out[t] + 1  (integer addition)
 * else                    out[t+1] = out[t]
 */

CHIP PC {
    IN in[16], load, inc, reset;
    OUT out[16];

    PARTS:
    Inc16(in=original, out=increased);
    Mux16(a=original, b=increased, sel=inc, out=o1);
    Mux16(a=o1, b=in, sel=load, out=o2);
    Mux16(a=o2, b=false, sel=reset, out=o3);
    Register(in=o3, load=true, out=out, out=original);
}
```

My current understanding here is not yet complete. But as I understand it now, the thinking here should be as follows:

First, the idea about this one `Inc16` and three `Mux16`s. Let's split this four-branch conditional

```c
if      (reset[t] == 1) out[t+1] = 0
else if (load[t] == 1)  out[t+1] = in[t]
else if (inc[t] == 1)   out[t+1] = out[t] + 1  // (integer addition)
else                    out[t+1] = out[t]
```

into nested three-level if-else statements. Since `Mux` can only choose which state to keep, and cannot choose what state is needed before calculating that state, we have to analyze this nested if-else statement **from the innermost level outwards**. And, in terms of requirements, the top requirement will override the bottom requirement, i.e. the reset instruction will hide the load instruction, and the load instruction will hide the inc instruction. By working from the bottom up, we achieve exactly this override.

![From the innermost level outwards](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-memory/7.png)

In order to use `Mux`, it is logical to find out what the new state of the current state (`original`) should be after `reset`, `load` and `inc`. The new state after `reset` is `false`, and the new state after `load` is `in`, without any computation. Only the state after `inc` needs to be obtained using `Inc16`, in this case which is `increased`.

Next, the `original`. At first I thought this was `in`, but in fact, because of the sequential logic, all operations here should be done on the basis of the current state of the chip in the `PC`. So, here the current state is noted as `original` and this `original` is updated on the last line.
