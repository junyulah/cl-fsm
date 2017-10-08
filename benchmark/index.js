/**
 * compare regular expression and cl-fsm
 */
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

let {
    RegularExp
} = require('..');

// add tests 
suite.add('RegExp', function() {
        /[abc]ed*/.test('aeddddddd');
    }).add('RegExp', function() {
        new RegExp('[abc]ed*').test('aedddddd');
    })
    .add('RegularExp', function() {
        new RegularExp('[abc]ed*').test('aeddddddd');
    })
    // add listeners 
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async 
    .run({
        'async': true
    });
