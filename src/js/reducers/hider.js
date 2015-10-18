"use strict";

import {TOGGLE_VISIBILITY} from "../constants/ActionTypes";

const initialState = false;

export default function hider(state = initialState, action) {
    switch (action.type) {
    case TOGGLE_VISIBILITY:
        return !state;
    default:
        return state;
    }
}
