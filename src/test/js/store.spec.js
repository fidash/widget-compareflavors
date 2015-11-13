"use strict";

import configureStore from "../../js/stores/configureStore";
import {toggleVisibility} from "../../js/actions/index";

describe("Store", () => {
    let store;
    const expectstate = (filter, publicflavors, privateflavors, left, right, region) => { // eslint-disable-line max-params
        expect(store.getState()).toEqual({
            filter,
            flavors: {
                publicflavors,
                privateflavors
            },
            select: {
                left,
                right,
                region
            }
        });
    };
    const initialvalue = () => {
        expectstate(false, [], [], "", "", "");
    };

    beforeEach(() => {
        store = configureStore();
    });

    it("initial state", () => {
        initialvalue();
    });

    it("State changed", () => {
        initialvalue();
        store.dispatch(toggleVisibility());

        expectstate(true, [], [], "", "", "");
    });
});
