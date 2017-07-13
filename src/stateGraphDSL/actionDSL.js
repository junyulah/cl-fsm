'use strict';

let {
    isObject
} = require('basetype');

/**
 * basic action types and compose actions
 *
 * action = {
 *   actionType
 * }
 */

const __basic_action_type__ = 'action_type_specified';

const LEFT_TYPE = 'left',
    RANGE_TYPE = 'range',
    UNION_TYPE = 'union',
    NORMAL_TYPE = 'normal',
    EPSILON_TYPE = 'epsilon';

let toAction = (v) => {
    if (isAction(v)) return v;
    if (v === null) return {
        content: v,
        actionType: EPSILON_TYPE,
        __basic_action_type__

    };
    return {
        content: v,
        actionType: NORMAL_TYPE,
        __basic_action_type__
    };
};

let left = () => {
    return {
        actionType: LEFT_TYPE,
        __basic_action_type__
    };
};

let range = (start, end) => {
    return {
        actionType: RANGE_TYPE,
        start,
        end,
        __basic_action_type__
    };
};

// union two actions to get a new action
let union = (...actions) => {
    for (let i = 0; i < actions.length; i++) {
        let action = actions[i];
        if (!isAction(action)) {
            actions[i] = toAction(action);
        }
    }

    return {
        actionType: UNION_TYPE,
        actions,
        __basic_action_type__
    };
};

let isAction = (v) => {
    return isObject(v) && v.__basic_action_type__ === __basic_action_type__;
};

let isLeftAction = (v) => isAction(v) && v.actionType === LEFT_TYPE;

let isRangeAction = (v) => isAction(v) && v.actionType === RANGE_TYPE;

let isUnionAction = (v) => isAction(v) && v.actionType === UNION_TYPE;

let isNormalAction = (v) => isAction(v) && v.actionType === NORMAL_TYPE;

let isEpsilonAction = (v) => isAction(v) && v.actionType === EPSILON_TYPE;

module.exports = {
    isAction,
    isLeftAction,
    isRangeAction,
    isUnionAction,
    isNormalAction,
    isEpsilonAction,

    left,
    range,
    toAction,
    union
};
