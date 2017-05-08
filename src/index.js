'use strict';

let {
    QUIT, WAIT, MATCH
} = require('./const');

let stateGraphDSL = require('./stateGraphDSL');

const START_STATE = '__start__state__';

let fsm = (stateMap) => {
    // parse stateMap
    let {
        transitions, acceptStateMap
    } = stateGraphDSL.transitionMaper(
        stateGraphDSL.g(START_STATE,
            stateGraphDSL.c(null, stateMap)));

    let dfa = new DFA(transitions, acceptStateMap);

    // matching function
    return (letter) => {
        return dfa.transit(letter);
    };
};

let DFA = function(stateMap, acceptStateMap) {
    this.currentState = START_STATE;
    this.stateMap = stateMap;
    this.acceptStateMap = acceptStateMap;
};

let proto = DFA.prototype;

proto.transit = function(letter) {
    let subMap = this.stateMap[this.currentState];
    if (!subMap) return {
        type: QUIT,
        state: this.currentState
    };

    // transit to target state
    let targetState = subMap(letter);

    if (stateGraphDSL.isEpsilonTransition(targetState)) {
        this.currentState = targetState.state; // epsilon transition
        return this.transit(letter);
    }

    if (targetState === undefined) {
        return {
            type: QUIT,
            state: this.currentState
        };
    }

    this.currentState = targetState;
    if (this.acceptStateMap[targetState]) return {
        type: MATCH,
        state: this.currentState
    };

    return {
        type: WAIT,
        state: this.currentState
    };
};

module.exports = {
    fsm,
    stateGraphDSL,
    DFA,
    QUIT,
    WAIT,
    MATCH
};
