"use strict";

import * as Constants from "../../js/constants/ActionTypes";

describe("Constants", () => {
    it("all constants exist", () => {
        expect(Constants.TOGGLE_VISIBILITY).toEqual("TOGGLE_VISIBILITY");
        expect(Constants.SET_FLAVORS).toEqual("SET_FLAVORS");
        expect(Constants.MOVE_PUBLIC).toEqual("MOVE_PUBLIC");
        expect(Constants.MOVE_PRIVATE).toEqual("MOVE_PRIVATE");
        expect(Constants.SET_CHOOSE_LEFT).toEqual("SET_CHOOSE_LEFT");
        expect(Constants.SET_CHOOSE_RIGHT).toEqual("SET_CHOOSE_RIGHT");
        expect(Constants.CLEAR_LR).toEqual("CLEAR_LR");
    });
});
