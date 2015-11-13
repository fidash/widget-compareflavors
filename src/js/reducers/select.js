"use strict";

import {SET_CHOOSE_LEFT, SET_CHOOSE_RIGHT, SET_REGION, CLEAR_LR} from "../constants/ActionTypes";

const initialState = {
    left: "",
    right: "",
    region: ""
};

export default function select(state = initialState, action) {
    switch (action.type) {
    case SET_CHOOSE_LEFT:
        return {
            left: action.left,
            right: state.right,
            region: state.region
        };
    case SET_CHOOSE_RIGHT:
        return {
            left: state.left,
            right: action.right,
            region: state.region
        };
    case CLEAR_LR:
        return {
            left: "",
            right: "",
            region: state.region
        };
    case SET_REGION:
        return {
            left: state.left,
            right: state.right,
            region: action.region
        };
    default:
        return state;
    }
}
