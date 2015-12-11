"use strict";

import {combineReducers} from "redux";
import hider from "./hider";
import flavors from "./flavors";
import select from "./select";
import regions from "./regions";

const rootReducer = combineReducers({
    filter: hider,
    flavors,
    select,
    regions
});

export default rootReducer;
