/**
 * compare regular expression and cl-fsm
 */
const Benchmark = require('benchmark');

const {
    RegularExp
} = require('..');

const log = console.log; // eslint-disable-line

{
    // add tests
    new Benchmark.Suite().add('RegExp-iteral', function() {
        /[abc]ed*/.test('aeddddddd');
    }).add('RegExp-new reg', function() {
        new RegExp('[abc]ed*').test('aedddddd');
    }).add('RegularExp', function() {
        new RegularExp('[abc]ed*').test('aeddddddd');
    }).on('cycle', function(event) {
        log(String(event.target));
    }).on('complete', function() {
        log('Fastest is ' + this.filter('fastest').map('name'));
    }).run({
        'async': true
    });
}

{
    const regStr = '[abc]ed*';
    const reg1 = new RegExp(regStr);
    const reg2 = new RegularExp(regStr);

    new Benchmark.Suite().add('test: raw RegExp', function() {
        reg1.test('aedddddd');
    }).add('test: cl-fsm RegularExp', function() {
        reg2.test('aeddddddd');
    }).on('cycle', function(event) {
        log(String(event.target));
    }).on('complete', function() {
        log('Fastest is ' + this.filter('fastest').map('name'));
    }).run({
        'async': true
    });
}
