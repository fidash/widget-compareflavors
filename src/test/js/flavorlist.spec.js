"use strict";

import React from "react";
import TestUtils from "react-addons-test-utils";
import FlavorList from "../../js/components/FlavorList";

function setup(props) {
    const renderer = TestUtils.createRenderer();

    renderer.render(<FlavorList {...props} />);
    const instance = renderer.getRenderOutput();

    return {
        props,
        instance
    };
}

describe("Flavor component", () => {
    const basictest = (instance, active, flavclick) => {
        expect(instance.props.activeKey).toEqual(active);

        expect(flavclick).not.toHaveBeenCalled();
        instance.props.onSelect("ID");
        expect(flavclick).toHaveBeenCalledWith("ID");
        flavclick.calls.reset();
    };

    const checkItem = (elem, classname, id, name) => {
        expect(elem.props.className).toEqual(classname);
        expect(elem.props.eventKey).toEqual(id);
        expect(elem.key).toEqual(id);
        expect(elem.props.children).toEqual(name);

        const fc = jasmine.createSpy("Callback");

        elem.props.onMouseDown({preventDefault: fc});
        expect(fc).toHaveBeenCalled();
    };

    it("Without children", () => {
        const props = {
            activeid: "",
            equallist: [],
            list: [],
            onFlavorClick: jasmine.createSpy("flavorclick")
        };
        const {instance} = setup(props);

        basictest(instance, props.activeid, props.onFlavorClick);

        expect(instance.props.children).toEqual([]);
    });

    it("Active id", () => {
        const props = {
            activeid: "theidactive",
            equallist: [],
            list: [],
            onFlavorClick: jasmine.createSpy("flavorclick")
        };
        const {instance} = setup(props);

        basictest(instance, props.activeid, props.onFlavorClick);

        expect(instance.props.children).toEqual([]);
    });

    it("One element", () => {
        const props = {
            activeid: "123",
            equallist: [],
            list: [{
                id: "1234",
                name: "MyFlavor"
            }],
            onFlavorClick: jasmine.createSpy("flavorclick")
        };
        const {instance} = setup(props);

        basictest(instance, props.activeid, props.onFlavorClick);

        expect(instance.props.children.length).toEqual(1);

        const [elem] = instance.props.children;

        checkItem(elem, "", "1234", "MyFlavor");
    });

    it("More elements element", () => {
        const props = {
            activeid: "123",
            equallist: ["123"],
            list: [{
                id: "1234",
                name: "MyFlavor"
            }, {
                id: "aoeui",
                name: "MyFlavor2"
            }
            ],
            onFlavorClick: jasmine.createSpy("flavorclick")
        };
        const {instance} = setup(props);

        basictest(instance, props.activeid, props.onFlavorClick);

        expect(instance.props.children.length).toEqual(2);

        const [elem1, elem2] = instance.props.children;

        checkItem(elem1, "", "1234", "MyFlavor");
        checkItem(elem2, "", "aoeui", "MyFlavor2");
    });

    it("Many elements elements, some in equal", () => {
        const props = {
            activeid: "123",
            equallist: ["123", "aoe", "test"],
            list: [{
                id: "1234",
                name: "MyFlavor"
            }, {
                id: "aoeui",
                name: "MyFlavor2"
            }, {
                id: "123",
                name: "ThisHaveIt"
            }, {
                id: "test",
                name: "TestName"
            }, {
                id: "9711",
                name: ":):)"
            }, {
                id: "aoe",
                name: "ThisHaveItToo"
            }, {
                id: "randomid",
                name: "NotReallyRandom"
            }, {
                id: "soidea",
                name: "DatMind"
            }
            ],
            onFlavorClick: jasmine.createSpy("flavorclick")
        };
        const {instance} = setup(props);

        basictest(instance, props.activeid, props.onFlavorClick);

        expect(instance.props.children.length).toEqual(8);

        let index;
        for (index; index < props.list.length; index++) {
            const elem = instance.props.children[index];
            const haveit = props.equallist.indexOf(elem.id) > -1;

            checkItem(elem, haveit ? "itemequal" : "", elem.id, elem.name);
        }
    });
});
