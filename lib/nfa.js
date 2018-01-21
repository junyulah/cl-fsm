'use strict';

const DFA = require('./dfa');

const NFA = function() {
    // {state: {char: set<state>}}
    this.transitionGraph = {};
    // {state: set<state>}
    this.epsilonToTransitions = {};

    // cache for epsilon
    // {state: set<state>}
    this.epsilonClosureMap = {};
    this.epsilonFromTransitions = {};
};

NFA.prototype = {
    constructor: NFA,

    addTransition: function(from, letter, to) {
        this.transitionGraph[from] = this.transitionGraph[from] || {};
        this.transitionGraph[from][letter] = this.transitionGraph[from][letter] || {};
        this.transitionGraph[from][letter][to] = 1;

        this._initStateClosure(from);
        this._initStateClosure(to);
    },

    // init-closure(a) = {a}
    _initStateClosure: function(state) {
        if (!this.epsilonClosureMap[state]) {
            this.epsilonClosureMap[state] = {
                [state]: 1
            };
        }
    },

    addEpsilonTransition: function(from, to) {
        this.epsilonToTransitions[from] = this.epsilonToTransitions[from] || {};
        this.epsilonToTransitions[from][to] = 1;

        // record from
        this.epsilonFromTransitions[to] = this.epsilonFromTransitions[to] || {};
        this.epsilonFromTransitions[to][from] = 1;

        this._initStateClosure(from);
        this._initStateClosure(to);

        // delivery epsilon
        this._deliveryEpsilon(from, to, {});
    },

    _deliveryEpsilon: function(from, to, passSet) {
        let toClosure = this.epsilonClosureMap[to];
        let fromClosure = this.epsilonClosureMap[from];
        if (passSet[from] === undefined) {
            for (let name in toClosure) {
                fromClosure[name] = 1;
            }
            passSet[from] = 1;

            let prevs = this.epsilonFromTransitions[from];
            for (let state in prevs) {
                this._deliveryEpsilon(state, to, passSet);
            }
        }
    },

    transit: function(from, letter) {
        let transitionMap = this.transitionGraph[from];
        if (transitionMap) {
            return transitionMap[letter];
        }
    },

    epsilonClosure: function(nfaSet) {
        let result = {};
        for (let state in nfaSet) {
            let singleClosures = this.epsilonClosureMap[state];
            for (let s in singleClosures) {
                result[s] = 1;
            }
        }
        return result;
    },

    /**
     * generate a new DFA and record which nfa states composed to a new DFA state
     */
    toDFA: function(startState) {
        let dfa = new DFA();
        let stateMap = {};

        let epsilonNFASetCache = {}; // NFA-set -> NFA-set

        let startOrigin = {
            [startState]: 1
        };
        let start = this.epsilonClosure(startOrigin);
        epsilonNFASetCache[hashNFAStates(startOrigin)] = start;

        let dfaStates = {},
            newAdded = [];
        let last = 0,
            offset = 0; // distance between last state and current state
        dfaStates[hashNFAStates(start)] = 0; // default, the start state for DFA is 0
        stateMap[0] = start;
        newAdded.push(start);

        while (newAdded.length) {
            let newAddedTmp = [];

            for (let i = 0, n = newAdded.length; i < n; i++) {
                let stateSet = newAdded[i];
                let newMap = this._getNFASetTransitionMap(stateSet);

                let currentDFAState = i + offset;
                for (let letter in newMap) {
                    let toSet = newMap[letter];
                    let hashKey = hashNFAStates(toSet);
                    // find new state
                    let newItem = null;
                    if (epsilonNFASetCache[hashKey]) {
                        newItem = epsilonNFASetCache[hashKey];
                    } else {
                        newItem = this.epsilonClosure(newMap[letter]);
                    }
                    let newItemHashKey = hashNFAStates(newItem);
                    //
                    if (dfaStates[newItemHashKey] !== undefined) {
                        dfa.addTransition(currentDFAState, letter, dfaStates[newItemHashKey]);
                    } else {
                        // find new item
                        last++; // last + 1 as new DFA state
                        dfaStates[newItemHashKey] = last;
                        stateMap[last] = newItem;
                        newAddedTmp.push(newItem);

                        // build the connection from (index + offset) -> last
                        dfa.addTransition(currentDFAState, letter, last);
                    }
                }
            }

            offset += newAdded.length;
            newAdded = newAddedTmp;
        }

        return {
            dfa,
            stateMap
        };
    },

    _getNFASetTransitionMap: function(stateSet) {
        let newMap = {};
        for (let state in stateSet) {
            let map = this.transitionGraph[state] || {};
            for (let letter in map) {
                let toSet = map[letter];
                newMap[letter] = newMap[letter] || {};
                for (let toState in toSet) {
                    newMap[letter][toState] = 1;
                }
            }
        }

        return newMap;
    },

    mergeNFA: function(n) {
        let n2Graph = n.transitionGraph;
        let n2ToEps = n.epsilonToTransitions;

        // copy transitions
        for (let from in n2Graph) {
            let transitionMap = n2Graph[from];
            for (let letter in transitionMap) {
                let toSet = transitionMap[letter];
                for (let toState in toSet) {
                    this.addTransition(from, letter, toState);
                }
            }
        }

        // copy epsilon transitions
        for (let from in n2ToEps) {
            let toSet = n2ToEps[from];
            for (let toState in toSet) {
                this.addEpsilonTransition(from, toState);
            }

        }
    }
};

let hashNFAStates = (nfaStateSet) => {
    return Object.keys(nfaStateSet).sort().join(' ');
};

module.exports = NFA;
