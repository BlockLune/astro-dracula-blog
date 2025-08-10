---
abbrlink: a4422da3
categories:
  - CS
  - Computing System
  - Nand2Tetris
date: 2023-07-11 16:49:01
tags:
  - nand2tetris
  - programming-language
  - assembly
  - software-engineering
  - algorithm
  - note
title: "Notes for Nand2Tetris: Machine Language"
---

This is a note for Nand2Tetris unit 4.

<!--more-->

![The Hack Machine Language](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-machine-language/1.png)

## Project 4

### Mult.asm

```asm
// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
//
// This program only needs to handle arguments that satisfy
// R0 >= 0, R1 >= 0, and R0*R1 < 32768.

  // i = 0
  @i
  M=0

  // RAM[2] = 0
  @R2
  M=0

(LOOP)
  // if (i >= RAM[1]) goto END
  @i
  D=M
  @R1
  D=D-M
  @END
  D;JGE
  // RAM[2] = RAM[2] + RAM[0]
  @R2
  D=M
  @R0
  D=D+M
  @R2
  M=D
  // i = i + 1
  @i
  M=M+1
  // goto LOOP
  @LOOP
  0;JMP
(END)
  @END
  0;JMP
```

### Fill.asm

The size of the screen is 512 \* 256, which is made of 8192 16-bit registers.

Notice that here something as follows is NOT supported:

```asm
@total
M=8192
```

The right side of the equals sign can only be 0, 1, -1, or a value from another register.

Note that we can't make two loops to completely draw the screen and then listen the next input! If do that, since it doesn't listen during the loop, the program will never hear the input!

```asm
// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed.
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

(RESET)
  @8192
  D=A
  @i
  M=D
  @MAINLOOP
  0;JMP

(MAINLOOP)
  // i=i-1
  @i
  M=M-1
  D=M
  // if (i < 0) goto RESET
  @RESET
  D?JLT
  // listen
  @KBD
  D=M
  @WHITE
  D;JEQ
  @BLACK
  0;JMP

(WHITE)
  @SCREEN
  D=A
  @i
  A=D+M
  M=0  // white
  @MAINLOOP
  0;JMP

(BLACK)
  @SCREEN
  D=A
  @i
  A=D+M
  M=-1  // black
  @MAINLOOP
  0;JMP
```
