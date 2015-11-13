"use strict";
/* globals module, require */

import {createStore} from "redux";
import rootReducer from "../reducers";

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState);

    /* istanbul ignore next: hot reloading */
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept("../reducers", () => {
            const nextReducer = require("../reducers"); // eslint-disable-line global-require

            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
