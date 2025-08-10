---
abbrlink: 9a8ff4a5
categories:
  - CS
  - Computing System
  - Nand2Tetris
date: 2023-07-12 11:57:51
katex: true
mathjax: true
tags:
  - nand2tetris
  - computer-architecture
  - hardware-design
  - assembly-language
  - coursera
  - note
title: "Notes for Nand2Tetris: Computer Architecture"
---

This is a note for Nand2Tetris Unit 5.

<!--more-->

## Unit 5.1

Same **Hardware** can run many different **Software** programs.

- Theory: Universal Turing Machine
- Practice: Von Neumann Architecture

Memory stores **Data** and **Program**. CPU is composed of **ALU** and **Registers**.

![Information Flows](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/1.png)

Registers store both Data and Addresses.

## Unit 5.2

The Fetch-Execute Cycle

### The basic CPU loop

- **Fetch** an instruction from the Program memory
- **Execute** it

### Fetching

- Put the location of the next instruction into the "address" of the program memory
- Get the instruction code itself by reading the memory contents at that location

Use program counter.

### Executing

...

### Fetch-Execute Clash

![Fetch-Execute Clash](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/2.png)

How to solve that? Do one after the other (Use `Mux`).

### Solution: Mux and Instruction register

![Solution](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/3.png)

### Simpler solution: Harvard Architecture

- Variant of Von Neumann Architecture
- Keep Program and Data in two separate memory modules
- Complication avoided

## Unit 5.3

### Abstraction of the Hack CPU

A 16-bit processor, designed to:

- Execute the current instruction
- Figure out which instruction to execute next (instructions written in the Hack language)

### The overall computer architecture

![The overall computer architecture](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/4.png)

### Hack CPU Interface

![Inputs](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/5.png)

![Outputs](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/6.png)

### Hack CPU Implementation

![Hack CPU Implementation](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/7.png)

### Instruction handling

When handling A-instruction (op-code is 0), the `Mux16` takes the input from instruction, while handling C-instruction (op-code is 1), it should be from the output of ALU.

CPU handling of an A-instruction:

- Decodes the instruction into op-code + 15-bit value
- Stores the value in the A-register
- Outputs the value

CPU handling of a C-instruction:

- Decodes the instruction into four parts (op-code, ALU control bits, Destination load bits and Jump bits)
- ...

### ALU operation

ALU data inputs:

- From the D-register
- From the A-register / M-register

ALU control inputs:

- Control bits (from the instruction)

ALU data output:

- Result of AlU calculation, fed simultaneously to: D-register, A-register, M-register
- Which register **actually** received the incoming value is determined by the instructions' destination bits

ALU control outputs:

- Negative output?
- Zero output?

### Jump

Program Counter abstraction:

Emits the address of the next instruction:

To start / restart the program's execution: `PC=0`

- no jump: `PC++`
- goto: `PC=A`
- conditional goto: if the condition is true `PC=A` else `PC++`

`PC` logic:

```python
if reset==1:
    PC=0
else:
    # current instruction
    load = f(jump_bits, ALU_control_outputs) # the load bit of PC
    if load==1:
        PC=A
    else:
        PC=PC+1
```

## Unit 5.4

### Hack CPU Operation

Sample Hack instructions:

```asm
D=D-A
@17
M=M+1
```

The CPU executes the **instruction** according to the Hack language specification:

- If the instruction includes D and A, the respective values are read from, and/or written to, the CPU-resident D-register and A-register;
- If the instruction is @x, then x is stored in the A-register; this value is emitted by `addressM`
- If the instruction's RHS includes M, this value is read from `inM`
- If the instruction's LHS includes M, then the ALU output is emitted by `outM`, and the `writeM` bit is asserted

```asm
@100
D=D-1;JEQ
```

**If (reset==0):**

The CPU logic uses the instruction's jump bits and the ALU's output to decide if there should be a jump.

- If there is a jump: `PC` is set to the value of the A-register
- Else (no jump): `PC++`

The updated `PC` value is emitted by `pc`

**If (reset==1):**

`PC` is set to 0, `pc` emits 0 (causing a program restart)

### Memory

We divide the memory to three segments.

Abstraction:

- Address 0 to 16383: data memory
- Address 16384 to 24575: screen memory map
- Address 24576: keyboard memory map

Implementation:

- RAM: 16-bit / 16K RAM chip
- Screen: 16-bit / 8K memory chip with a raster display (光栅显示) side-effect
- Keyboard: 16-bit register with a keyboard side-effect

Screen:

To turn pixel(row, col) on/off: $w=Screen(row\times32+col\div16)$

In the Hack Memory context: $w=Memory[16384+row\times32+col\div16]$. Set the $col \% 16$ bit of $w$ to 1 or to 0.

Keyboard:

To read the keyboard:

- Probe the output of the Keyboard register
- In the Hack Memory context: probe memory register 24576

### Instruction Memory (ROM)

To run a program on the Hack computer:

- Load the program into the ROM
- Press "reset"
- The program starts running

Hardware implementation: plug-and-play ROM chips

Hardware simulation: programs are stored in text files; program loading is emulated by the built-in ROM chip

### Hack Computer implementation

![Hack Computer implementation](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/8.png)

## Unit 5.5

...

## Project 5

### CPU.hdl

~~吐槽：一开始我想的是，连设计图都给我了，我还能做不出来吗？前人已经载好了树，我这乘凉还不容易吗？实际上手才发现，CPU 不愧是 CPU，即使是这样一个非常简化的版本，也是相当复杂的。这凉，还真不是那么好乘。:x~~

记录一下制作这个 CPU 的思考过程：

首先，按照设计图，把 `ALU`、`ARegister`、`DRegister`、`PC` 和两个 `Mux16` 摆出来；

接着，接线，把一些能连起来的 PIN 口连起来，为了搞清楚输入输出，我在图上将变量名都标出了（例如 ALU output 标记为 aluo，A Register 的输出标记为 ao 等等）；

最后，最复杂的一步，填入 control bits（包括 sel bits, load bits 等等）。

![设计图](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/9.png)
![指令表](https://webp.blocklune.cc/blog-imgs/cs/computing%20system/nand2tetris/notes-for-nand2tetris-computer-architecture/10.png)

在构造这些 control bits 之前，我们需要明确：这个 CPU 将处理 A-instruction 和 C-instruction 两类指令，这意味着 control bits 与指令类型有关。并且，分析这两类指令可以发现：

- A-instruction 必然改变并且只改变 `ARegister` 的值；
- C-instruction 可以改变 `ARegister`、`DRegister`、M Register 和 `PC` 的值，具体是否改变取决于 instruction。

明确这点后，让我们来构造第一个 control bit: 第一个 `Mux16` 的 sel。这个 `Mux16` 接受 instruction 和 ALU output，并且将结果（我这里的标记是 mo1，Mux output 1）传给 `ARegister`。[Unit 5.3 Instruction handling](#instruction-handling) 部分说的很清楚，当处理 op-code（也就是 instruction[15]）是 0 的 A-instruction 时，这个 `Mux16` 读入 instruction，否则，读入 ALU output。所以，我们的一号 `Mux16` 长这样：

```hdl
Mux16(a=instruction, b=aluo, sel=instruction[15], out=mo1); // Mux 1
```

我构造的第二个 control bit 是第二个 `Mux16` 的 sel。观察指令表的 comp 部分，可以发现：指令中的 a=0 和 a=1（这个 a 也就是 instruction[12]）决定了传入 `ALU` 的是 A 还是 M，这与这二号 `Mux16` 的接线相符合。所以，二号 `Mux16` 长这样：

```hdl
Mux16(a=ao, b=inM, sel=instruction[12], out=mo2); // Mux 2
```

接下来来构造 `ARegister` 的 load bit，`DRegister` 的 load bit 和 控制 writeM 的这三个 control bits。其中 writeM 其实就是控制是否写入内存的 control bit，也就是控制 M Register 的 load bit。观察指令表的 dest 部分，我们可以发现 d1 (instruction[5])，d2 (instruction[4])，d3 (instruction[3]) 分别控制着是否写入 `ARegister`，是否写入 `DRegister` 和是否写入 `MRegister`（也就是 writeM 是否为真）。所以这三个 control bits 是不是就分别是 instruction[5]，instruction[4] 和 instruction[3] 呢？一开始我就是这么想的，但是，回想前面分析过的两类 instructions 的区别，只有当指令是 C-instruction 时，instruction[5]、[4]、[3] 才分别是 d1、d2、d3（A-instruction 时这几个 bits 都只是 地址的一部分嘛）。所以，这三个 control bits 还需要一些加工：

- 当且仅当指令是 A-instruction 或标记了写入 `ARegister` 的 C-instruction 时，loadA 为真
- 当且仅当指令为标记了写入 `DRegister` 的 C-instruction 时，loadD 为真
- 当且仅当指令为标记了写入 `MRegister` 的 C-instruction 时，writeM 为真

```hdl
// loadA (a-instruction or c-instruction)
Not(in=instruction[15], out=ainst); // ainst: a-instruction
Or(a=instruction[5], b=ainst, out=loadA);
// loadD (c-instruction)
And(a=instruction[4], b=instruction[15], out=loadD);
// writeM (c-instruction)
And(a=instruction[3], b=instruction[15], out=writeM);
```

然后让我们来构建 `ALU` 的 zx, nx, zy, ny, f, no 这几个 control bits。判断的方法应该是观察指令表的 comp 部分。这里其实我只判断了 c5 (instruction[7])、c6 (instruction[6]) 分别表示 f 和 no，然后猜测了一下前面的 c1 到 c4 分别表示 zx、nx、zy、ny。这样，`ALU` 长这样（注意这里的 zr、ng，后边有大用场）：

```hdl
ALU(x=do, y=mo2,
    zx=instruction[11], nx=instruction[10],
    zy=instruction[9], ny=instruction[8],
    f=instruction[7], no=instruction[6],
    out=aluo, out=outM, zr=zr, ng=ng);
```

最后是 `PC` 的 control bit。这个 control bit 我觉得是最复杂的一个。回顾 [Unit 5.3 Jump](#jump) 部分，我们可以看到，这个 control bit（我把它叫做 loadPC）由 jump_bits 和 ALU_control_outputs 共同决定：

```python
load = f(jump_bits, ALU_control_outputs) # the load bit of PC
```

jump_bits 指的就是 j1、j2、j3，也就是 instruction[2]、instruction[1]、instruction[0]；ALU_control_outputs 也就是 zr、ng。

观察指令表的 jump 部分，可以发现：j1、j2、j3 分别为真就分别表示这条指令要求 comp 部分指令的结果（也就是 ALU output）分别满足 <0, =0 和 >0。如何判断 ALU output 是否满足 <0、=0、>0 呢？zr、ng 就派上了用场，它们就分别表示 =0 和 <0，而表示 >0 的 ps（positive 的简写）则可以用 zr 和 ng 构造：`ps = NOT(ng OR zr) = NOT(zr) and NOT(ng)`。将 ng, zr, ps 分别与 j1, j2, j3 进行与操作，就可以得出计算结果是否满足指令要求的 <0、=0、>0 了，将这些与的结果（jlt、jeq、jgt）两两拼接，就可以得到 jle、jne、jge 了。不跳跃就是永假，无条件跳跃的 jmp 则是三路或运算，可以使用 `Or8Way` 中的前三路进行，后边用不到的全部置为 false 就行了：

```hdl
// null: false
And(a=ps, b=instruction[0], out=jgt);
And(a=zr, b=instruction[1], out=jeq);
And(a=ng, b=instruction[2], out=jlt);
Or(a=jgt, b=jeq, out=jge); // great than OR equal to
Or(a=jgt, b=jlt, out=jne); // great than OR less than
Or(a=jeq, b=jlt, out=jle); // less than OR equal to
// jmp:
Or8Way(in[0]=jgt, in[1]=jeq, in[2]=jlt, in[3..7]=false, out=jmp);
```

最后，只要这 8 个中的任一个为真（当然第一个不跳跃为永假，所以事实上其实是后 7 个中的任一个为真），那就是要跳跃的（jump 为真）。但 jump 还不是最后的 loadPC —— 当且仅当指令是 C-instruction 时，jump 才是 loadPC。而 inc 则与 loadPC 的真值相反，因为不跳跃的话，就是执行下一条指令嘛：

```hdl
// jump or increase
Or8Way(in[0]=false, in[1]=jgt, in[2]=jeq, in[3]=jge,
        in[4]=jlt, in[5]=jne, in[6]=jle, in[7]=jmp, out=jump);
// loadPC (c-instruction)
And(a=jump, b=instruction[15], out=loadPC);
Not(in=loadPC, out=increase);
```

最后，完整的代码如下：

```hdl
/**
 * The Hack CPU (Central Processing unit), consisting of an ALU,
 * two registers named A and D, and a program counter named PC.
 * The CPU is designed to fetch and execute instructions written in
 * the Hack machine language. In particular, functions as follows:
 * Executes the inputted instruction according to the Hack machine
 * language specification. The D and A in the language specification
 * refer to CPU-resident registers, while M refers to the external
 * memory location addressed by A, i.e. to Memory[A]. The inM input
 * holds the value of this location. If the current instruction needs
 * to write a value to M, the value is placed in outM, the address
 * of the target location is placed in the addressM output, and the
 * writeM control bit is asserted. (When writeM==0, any value may
 * appear in outM). The outM and writeM outputs are combinational:
 * they are affected instantaneously by the execution of the current
 * instruction. The addressM and pc outputs are clocked: although they
 * are affected by the execution of the current instruction, they commit
 * to their new values only in the next time step. If reset==1 then the
 * CPU jumps to address 0 (i.e. pc is set to 0 in next time step) rather
 * than to the address resulting from executing the current instruction.
 */

CHIP CPU {
    IN  inM[16],         // M value input  (M = contents of RAM[A])
        instruction[16], // Instruction for execution
        reset;           // Signals whether to re-start the current
                         // program (reset==1) or continue executing
                         // the current program (reset==0).

    OUT outM[16],        // M value output
        writeM,          // Write to M?
        addressM[15],    // Address in data memory (of M)
        pc[15];          // address of next instruction

    PARTS:
    ALU(x=do, y=mo2,
        zx=instruction[11], nx=instruction[10],
        zy=instruction[9], ny=instruction[8],
        f=instruction[7], no=instruction[6],
        out=aluo, out=outM, zr=zr, ng=ng);
    ARegister(in=mo1, load=loadA, out=ao, out[0..14]=addressM);
    DRegister(in=aluo, load=loadD, out=do);
    PC(in=ao, load=loadPC, inc=increase, reset=reset, out[0..14]=pc);

    Mux16(a=instruction, b=aluo, sel=instruction[15], out=mo1); // Mux 1
    Mux16(a=ao, b=inM, sel=instruction[12], out=mo2); // Mux 2

    // loadA (a-instruction or c-instruction)
    Not(in=instruction[15], out=ainst); // ainst: a-instruction
    Or(a=instruction[5], b=ainst, out=loadA);
    // loadD (c-instruction)
    And(a=instruction[4], b=instruction[15], out=loadD);
    // writeM (c-instruction)
    And(a=instruction[3], b=instruction[15], out=writeM);

    // use `zr` and `ng` to implement conditional jump
    // make a `ps` (positive)
    Not(in=ng, out=notng);
    Not(in=zr, out=notzr);
    And(a=notng, b=notzr, out=ps);

    // null: false
    And(a=ps, b=instruction[0], out=jgt);
    And(a=zr, b=instruction[1], out=jeq);
    And(a=ng, b=instruction[2], out=jlt);
    Or(a=jgt, b=jeq, out=jge); // great than OR equal to
    Or(a=jgt, b=jlt, out=jne); // great than OR less than
    Or(a=jeq, b=jlt, out=jle); // less than OR equal to
    // jmp:
    Or8Way(in[0]=jgt, in[1]=jeq, in[2]=jlt, in[3..7]=false, out=jmp);

    // jump or increase
    Or8Way(in[0]=false, in[1]=jgt, in[2]=jeq, in[3]=jge,
           in[4]=jlt, in[5]=jne, in[6]=jle, in[7]=jmp, out=jump);
    // loadPC (c-instruction)
    And(a=jump, b=instruction[15], out=loadPC);
    Not(in=loadPC, out=increase);
}
```

### Memory.hdl

核心思想：内存的前几位决定了这片内存是 RAM16K、Screen 还是 Keyboard。

```hdl
/**
 * The complete address space of the Hack computer's memory,
 * including RAM and memory-mapped I/O.
 * The chip facilitates read and write operations, as follows:
 *     Read:  out(t) = Memory[address(t)](t)
 *     Write: if load(t-1) then Memory[address(t-1)](t) = in(t-1)
 * In words: the chip always outputs the value stored at the memory
 * location specified by address. If load==1, the in value is loaded
 * into the memory location specified by address. This value becomes
 * available through the out output from the next time step onward.
 * Address space rules:
 * Only the upper 16K+8K+1 words of the Memory chip are used.
 * Access to address>0x6000 is invalid. Access to any address in
 * the range 0x4000-0x5FFF results in accessing the screen memory
 * map. Access to address 0x6000 results in accessing the keyboard
 * memory map. The behavior in these addresses is described in the
 * Screen and Keyboard chip specifications given in the book.
 */

CHIP Memory {
    IN in[16], load, address[15];
    OUT out[16];

    PARTS:
    DMux4Way(in=load, sel=address[13..14], a=loadram1, b=loadram2, c=loadscr, d=loadkbd);
    Or(a=loadram1, b=loadram2, out=loadram);
    RAM16K(in=in, load=loadram, address=address[0..13], out=ramo);
    Screen(in=in, load=loadscr, address=address[0..12], out=scro);
    Keyboard(out=kbdo);
    Mux4Way16(a=ramo, b=ramo, c=scro, d=kbdo, sel=address[13..14], out=out);
}
```

### Computer.hdl

Just follow the diagram.

```hdl
/**
 * The HACK computer, including CPU, ROM and RAM.
 * When reset is 0, the program stored in the computer's ROM executes.
 * When reset is 1, the execution of the program restarts.
 * Thus, to start a program's execution, reset must be pushed "up" (1)
 * and "down" (0). From this point onward the user is at the mercy of
 * the software. In particular, depending on the program's code, the
 * screen may show some output and the user may be able to interact
 * with the computer via the keyboard.
 */

CHIP Computer {
    IN reset;

    PARTS:
    ROM32K(address=pco, out=next);
    // memory output, ... , outM output, writeM output, addressM output, pc output
    CPU(inM=memo, instruction=next, reset=reset, outM=outmo, writeM=writemo, addressM=addrmo, pc=pco);
    Memory(in=outmo, load=writemo, address=addrmo, out=memo);
}
```
