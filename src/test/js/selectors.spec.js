"use strict";

import {flavorSelectors} from "../../js/selectors/flavorSelectors";
import {toggleVisibility, setFlavors, setLeft, setRight} from "../../js/actions/index";
import configureStore from "../../js/stores/configureStore";

describe("Selectors", () => {
    let store;
    const expecstate = (state, filter, publicflavors, privateflavors, left, right, equalleft, equalright) => { // eslint-disable-line max-params
        expect(state).toEqual({
            filter,
            publicflavors,
            privateflavors,
            left,
            right,
            equalleft,
            equalright
        });
    };

    beforeEach(() => {
        store = configureStore();
    });

    it("initial state is correct", () => {
        const state = flavorSelectors(store.getState());

        expecstate(state, false, [], [], "", "", [], []);
    });

    it("filter public", () => {
        const publicflavors = [{
            public: true,
            disk: 3,
            ram: 2,
            vcpus: 1
        }, {
            public: true,
            disk: 4,
            ram: 5,
            vcpus: 8
        }];
        const privateflavors = [{
            public: false,
            disk: 3,
            ram: 2,
            vcpus: 1
        }];

        store.dispatch(toggleVisibility());
        store.dispatch(setFlavors(publicflavors, privateflavors));

        const state = flavorSelectors(store.getState());

        expecstate(state, true, [{public: true, disk: 4, ram: 5, vcpus: 8}], privateflavors, "", "", [], []);
    });

    it("select with non exist id return empty", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1
        }];

        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(setLeft("9711"));
        store.dispatch(setRight("9711"));

        const state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, privateflavors, "", "", [], []);
    });

    it("select with exist left id", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1
        }];

        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(setLeft("123"));
        store.dispatch(setRight("9711"));

        const state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, privateflavors, "123", "", [], ["285"]);
    });

    it("select with exist right id", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1
        }];

        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(setLeft("9711"));
        store.dispatch(setRight("285"));

        const state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, privateflavors, "", "285", ["123"], []);
    });

    it("when both selected, no equal returns", () => {
        const publicflavors = [{
            public: true,
            id: "123",
            disk: 3,
            ram: 2,
            vcpus: 1
        }, {
            public: true,
            id: "345",
            disk: 4,
            ram: 5,
            vcpus: 8
        }];
        const privateflavors = [{
            public: false,
            id: "285",
            disk: 3,
            ram: 2,
            vcpus: 1
        }, {
            public: false,
            id: "543",
            disk: 4,
            ram: 5,
            vcpus: 8
        }];

        store.dispatch(setFlavors(publicflavors, privateflavors));
        store.dispatch(setLeft("345"));
        store.dispatch(setRight("285"));

        const state = flavorSelectors(store.getState());

        expecstate(state, false, publicflavors, privateflavors, "345", "285", [], []);
    });
});
