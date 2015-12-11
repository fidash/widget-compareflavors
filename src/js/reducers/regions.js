"use strict";

import {SET_REGIONS} from "../constants/ActionTypes";

const initialState = {
    regions: []
};

export default function regions(state = initialState, action) {
    switch(action.type) {
    case SET_REGIONS:
        return {
            regions: action.regions
        };
    default:
        return state;
    }
}
