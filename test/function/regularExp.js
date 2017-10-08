'use strict';

let RegularExp = require('../../lib/regularExp');
let assert = require('assert');

let {
    jsonStringExpStr,
    jsonNumberExpStr
} = require('../../lib/commonTokenReg');

let testRegularExp = (testData) => {
    for (let caseName in testData) {
        let caseData = testData[caseName];
        for (let regExpStr in caseData) {
            it(caseName + ': ' + regExpStr, () => {
                let [matchs, notMatchs = []] = caseData[regExpStr];
                let reg = new RegularExp(regExpStr);
                matchs.forEach((item) => {
                    assert(reg.test(item), item);
                });

                notMatchs.forEach((item) => {
                    assert(!reg.test(item), item);
                });
            });
        }
    }
};

describe('regularExp', () => {
    testRegularExp({
        'base': {
            'a': [
                ['a'],
                ['b', 'aa']
            ],

            'ab': [
                ['ab'],
                ['a', 'b', 'abc']
            ],

            'a?': [
                ['', 'a'],
                ['b', 'aa']
            ],

            '\\|': [
                ['|'],
                ['\\|']
            ],

            '\\\\': [
                ['\\']
            ],

            'a|b': [
                ['a', 'b'],
                ['ab']
            ],

            'a*': [
                ['', 'a', 'aa', 'aaa'],
                ['aba', 'b']
            ],

            '[abcd]': [
                ['a', 'b', 'c', 'd'],
                ['aa', '[', ']']
            ],

            '[0-4]': [
                ['0', '1', '2', '3', '4'],
                ['5', 'a', '[', ']']
            ],

            '[0-9a-f]': [
                ['0', '4', '9', 'a', 'e', 'f'],
                ['A', 'B', '@']
            ],

            '^a': [
                ['b', '1', 'c', '@', '/'],
                ['a']
            ],

            '^[0-4]': [
                ['5', '7'],
                ['0', '1', '2', '3', '4']
            ]
        },

        'compose': {
            'ca?b': [
                ['cb', 'cab'],
                ['c', 'b', 'ca']
            ],

            'a(b|c)d': [
                ['abd', 'acd'],
                ['abcd', 'ad']
            ],

            'ba*': [
                ['b', 'ba', 'baa'],
                ['bb']
            ],

            'b^[ab]*c': [
                ['bc', 'bfc']
            ],

            'a[0-9](b|c)': [
                ['a2b', 'a3c'],
                ['asb', 'a3d']
            ],

            'c^a(e|f)': [
                ['ccf', 'c1f'],
                ['ca1', 'caf']
            ],

            '^[\"\\\\]': [
                ['h']
            ],

            [jsonStringExpStr]: [
                ['""', '"hello world!"', '"1234"', '"one line \\n next line"', '"\\n \\r \\b \\u1234"'],
                ['"\\u12"', '"\\"', '"\\a"', 'abc']
            ],

            [jsonNumberExpStr]: [
                ["1", "0", "123", "0.12", "0.467e10", "-100.23"],
                ['a', '0000']
            ]
        }
    });
});
