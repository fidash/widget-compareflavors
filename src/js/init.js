"use strict";

// import BurnDown from "./BurnDown";
import React from "react";
import ReactDOM from "react-dom";

import {Provider} from "react-redux";
import App from "./containers/App";
import configureStore from "./stores/configureStore";

window.onload = () => {
    const store = configureStore();

    ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById("main"));
    /* ReactDOM.render(<MainUI/>, document.getElementById("main")); */
};
