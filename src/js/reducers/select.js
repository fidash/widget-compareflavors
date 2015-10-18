"use strict";

import {SET_CHOOSE_LEFT, SET_CHOOSE_RIGHT, CLEAR_LR} from "../constants/ActionTypes";

const initialState = {
    left: "",
    right: ""
};

export default function select(state = initialState, action) {
    switch (action.type) {
    case SET_CHOOSE_LEFT:
        return {
            left: action.left,
            right: state.right
        };
    case SET_CHOOSE_RIGHT:
        return {
            left: state.left,
            right: action.right
        };
    case CLEAR_LR:
        return {
            left: "",
            right: ""
        };
    default:
        return state;
    }
}
