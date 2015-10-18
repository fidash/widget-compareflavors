"use strict";

import {SET_FLAVORS} from "../constants/ActionTypes";

// const initialState = {
//     flavors: []
// };
const initialState = [];

export default function flavors(state = initialState, action) {
    switch (action.type) {
    case SET_FLAVORS: // Reset Left&Right
        return action.flavors;
    default:
        return state;
    }
}
