'use strict';

let Parser = require('../../lib/parser');

let display = (regExp) => {
    let parser = new Parser();
    let tnfa = parser.parse(regExp);
    // console.log(tnfa.nfa.toDFA(tnfa.start).dfa);
};

describe('parser', () => {
    it('base', () => {
        display('a');
        display('ab');
        display('a|b');
        display('^[abc]');
        display('a*');
    });
});
