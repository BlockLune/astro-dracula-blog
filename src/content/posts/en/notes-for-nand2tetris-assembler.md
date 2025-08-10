---
abbrlink: 869cdee6
categories:
  - CS
  - Computing System
  - Nand2Tetris
date: 2023-07-17 20:28:42
katex: true
mathjax: true
tags:
  - nand2tetris
  - python
  - assembler
  - programming-language
  - software-engineering
  - note
title: "Notes for Nand2Tetris: Assembler"
---

This is a note for Nand2Tetris Unit 6.

<!--more-->

## Unit 6.1

Cross compiler: It's running on one computer and producing code intended for another computer.

### Basic Assembler Logic

Repeat:

- Read the next Assembly language command
- Break it into the different fields it is composed of
- Lookup the binary code for each field
- Combine these codes into a single machine language command
- Output this machine language command

Until end-of-file reached

### Symbols

Symbols are used for labels and variables.

Assembler must replace names with addresses.

Introducing... **Symbol table**.

#### Allocation of variables

First we look at the table. If the variable has already been in the table, we can just read its address. But if the variable is not there, we must allocate memory to it and record its address.

#### Labels

...

#### Forward references

Sometimes we can jump into a label before the label was actually defined.

Possible solutions:

- Leave blank until label appears, then fix
- In first pass just figure out all addresses

## Unit 6.2

Assembly program elements:

- White space
  - Empty lines / indentation
  - Line comments
  - In-line comments
- Instructions
  - A-instruction
  - C-instruction
- Symbols
  - References
  - Label declarations

## Unit 6.3

### Translating A-instruction

Translation to binary:

- If $value$ is a decimal constant, generate the equivalent 15-bit binary constant
- If $value$ is a symbol, later

### Translating C-instruction

...

### The overall assembly logic

For each instruction

- Parse the instruction: break it into its underlying fields
- A-instruction: translate the decimal value into a binary value
- C-instruction: for each field in the instruction, generate the corresponding binary code; assemble the translated binary codes into a complete 16-bit machine instruction
- Write the 16-bit instruction to the output file

## Unit 6.4

### Handling symbols

Symbols:

- **variable symbols**: represent memory locations where the programmer wants to maintain values
- **label symbols**: represent destinations of goto instructions
- **pre-defined symbols**: represent special memory locations

The Hack language specification describes 23 pre-defined symbols: ...

Translating @$preDefinedSymbol$:

Replace $preDefinedSymbol$ with its value

Translating @$label$:

...

Variable symbols:

- Any symbol XXX appearing in an assembly program which is not pre-defined and is not defined elsewhere using the (XXX) directive is treated as a $variable$
- Each variable is assigned a unique memory address, starting at 16 (specified by the Hack language)

Translating @$variableSymbol$:

- If you see it for the first time, assign a unique memory address
- Replace $variableSymbol$ with its value

### Symbol table

- Initialization: Add the pre-defined symbols
- First pass: Add the label symbols
- Second pass: Add var. symbols

To resolve a symbol, look up its value in the symbol table.

### The assembly process

- Initialization
  - Construct an empty symbol table
  - Add the pre-defined symbols to the symbol table
- First pass
  Scan the program;
  For each "instruction" of the form (XXX):
  - Add the pair (XXX, $address$) to the symbol table, where $address$ is the number of the instruction following (XXX)
- Second pass
  Set $n$ to 16
  Scan the entire program again; for each instruction:
  - If the instruction is @$symbol$, look up $symbol$ in the symbol table;
    - If ($symbol$, $value$) is found, use $value$ to complete the instruction's translation;
    - If not found:
      - Add ($symbol$, $n$) to the symbol table
      - Use $n$ to complete the instruction's translation
      - $n$++
  - If the instruction is a C-instruction, complete the instruction's translation
  - Write the translated instruction to the output file

## Project 6

My assembler for Hack computer written in Python:

```python
import argparse
import re


symbol_table = {
    "R0": 0,
    "R1": 1,
    "R2": 2,
    "R3": 3,
    "R4": 4,
    "R5": 5,
    "R6": 6,
    "R7": 7,
    "R8": 8,
    "R9": 9,
    "R10": 10,
    "R11": 11,
    "R12": 12,
    "R13": 13,
    "R14": 14,
    "R15": 15,
    "SCREEN": 16384,
    "KBD": 24576,
    "SP": 0,
    "LCL": 1,
    "ARG": 2,
    "THIS": 3,
    "THAT": 4,
}


def main():
    filename = get_filename()
    if not filename.endswith(".asm"):
        raise ValueError("Invalid file")
    with open(filename[:-4] + ".hack", "w") as file:
        lines = (line + "\n" for line in second_pass(first_pass(filename)))
        file.writelines(lines)


def get_filename() -> str:
    parser = argparse.ArgumentParser(
        prog="assembler.py",
        description="An assembler for Hack computer.",
    )
    parser.add_argument("filename", help="the asm file to be processed")
    args = parser.parse_args()
    return args.filename


def first_pass(filename: str) -> list:
    global symbol_table
    instructions = []
    with open(filename) as file:
        for line in file:
            if re.search(r"^//", line.strip()):
                # comments
                continue
            elif line.strip() == "":
                # blank line
                continue
            elif match := re.search(r"^\((.+)\)", line.strip()):
                if match:
                    label = match.group(1)
                    symbol_table[label] = len(instructions)
            else:
                instruction = re.sub(r"//.*", "", line).strip()
                instructions.append(instruction)
    return instructions


def second_pass(instructions: list) -> list:
    global symbol_table
    binary_instructions = []
    n = 16
    for instruction in instructions:
        if match := re.search(r"^@(.*)$", instruction):
            if match:
                value = match.group(1)
                if value.isdigit():
                    binary_instructions.append(
                        "0" + str(bin(int(value))[2:]).zfill(15))
                    continue
                else:
                    symbol = value
                if symbol not in symbol_table:
                    symbol_table[symbol] = n
                    n = n + 1
                binary_instructions.append(
                    "0" + str(bin(symbol_table[symbol])[2:]).zfill(15)
                )
        else:
            binary_instructions.append(parse_c_instruction(instruction))
    return binary_instructions


def parse_c_instruction(instruction: str) -> str:
    cccccc = {
        "0": "101010",
        "1": "111111",
        "-1": "111010",
        "D": "001100",
        "A": "110000",
        "M": "110000",
        "!D": "001101",
        "!A": "110001",
        "!M": "110001",
        "-D": "001111",
        "-A": "110011",
        "-M": "110011",
        "D+1": "011111",
        "A+1": "110111",
        "M+1": "110111",
        "D-1": "001110",
        "A-1": "110010",
        "M-1": "110010",
        "D+A": "000010",
        "D+M": "000010",
        "D-A": "010011",
        "D-M": "010011",
        "A-D": "000111",
        "M-D": "000111",
        "D&A": "000000",
        "D&M": "000000",
        "D|A": "010101",
        "D|M": "010101",
    }
    jjj = {
        None: "000",
        "JGT": "001",
        "JEQ": "010",
        "JGE": "011",
        "JLT": "100",
        "JNE": "101",
        "JLE": "110",
        "JMP": "111",
    }
    binary_instruction = "111"
    match = re.search(
        r"^(?:((?:A|D|M){1,3})=)?((?:0|1|\+|-|!|&|\||D|A|M)+)(?:;(JGT|JEQ|JGE|JLT|JNE|JLE|JMP))?$",
        instruction,
    )
    if match:
        dest = match.group(1)
        comp = match.group(2)
        jump = match.group(3)
        # a
        if "M" in comp:
            binary_instruction += "1"
        else:
            binary_instruction += "0"
        # cccccc
        binary_instruction += cccccc[comp]
        # ddd
        binary_instruction += get_ddd(dest)
        # jjj
        binary_instruction += jjj[jump]
        return binary_instruction
    else:
        raise ValueError("Invalid C-instruction")


def get_ddd(dest: str) -> str:
    if dest == None:
        return "000"
    d = ["0", "0", "0"]
    if "M" in dest:
        d[2] = "1"
    if "D" in dest:
        d[1] = "1"
    if "A" in dest:
        d[0] = "1"
    return d[0] + d[1] + d[2]


if __name__ == "__main__":
    main()

```
