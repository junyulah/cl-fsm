# cl-fsm

[中文文档](./README_zh.md)   [document](./README.md)

Simple FSM DSL
- [install](#install)
- [usage](#usage)
  * [API quick run](#api-quick-run)
- [develop](#develop)
  * [file structure](#file-structure)
  * [run tests](#run-tests)
- [license](#license)

## install

`npm i cl-fsm --save` or `npm i cl-fsm --save-dev`

Install on global, using `npm i cl-fsm -g`



## usage








### API quick run



```js
let FSM = require('cl-fsm')
let {RegularExp} = FSM;

let reg = new RegularExp('[ab]c*');

console.log(reg.test('a'));
console.log(reg.test('b'));
console.log(reg.test('acccccc'));
console.log(reg.test('efff'));
```

```
output

    true
    true
    true
    false

```


## develop

### file structure

```
.    
│──LICENSE    
│──README.md    
│──README_zh.md    
│──TODO.md    
│──benchmark    
│   └──index.js    
│──index.js    
│──lib    
│   │──commonTokenReg.js    
│   │──dfa.js    
│   │──index.js    
│   │──nfa.js    
│   │──parser.js    
│   │──regularExp.js    
│   │──thompsonConstruction.js    
│   └──thompsonNFA.js    
│──package.json    
└──test    
    └──function    
        │──dfa_nfa.js    
        │──parser.js    
        │──regularExp.js    
        └──thompson.js     
```


### run tests

`npm test`

## license

MIT License

Copyright (c) 2017 chenjunyu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
