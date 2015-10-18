"use strict";

import {combineReducers} from "redux";
import hider from "./hider";
import flavors from "./flavors";
import select from "./select";

const rootReducer = combineReducers({
    filter: hider,
    flavors,
    select
});

export default rootReducer;
