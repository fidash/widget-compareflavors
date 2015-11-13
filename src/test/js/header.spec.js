"use strict";

import React from "react";
import TestUtils from "react-addons-test-utils";
import Header from "../../js/components/Header";

function setup(props) {
    const renderer = TestUtils.createRenderer();

    renderer.render(<Header {...props} />);
    const instance = renderer.getRenderOutput();

    return {
        props,
        instance
    };
}

describe("Header component", () => {
    function auxBtns(props, filterBsStyle, filterText, clearDisabled) {
        const {instance} = setup(props);

        const [filterbtn, clearbtn] = instance.props.children;

        expect(filterbtn.props.bsStyle).toEqual(filterBsStyle);
        const text = filterbtn.props.children;

        expect(text).toEqual(filterText);

        expect(props.onFilterClick).not.toHaveBeenCalled();
        filterbtn.props.onClick();
        expect(props.onFilterClick).toHaveBeenCalled();

        const spyMouseDown = jasmine.createSpy("Mouse Down");

        expect(spyMouseDown).not.toHaveBeenCalled();
        filterbtn.props.onMouseDown({preventDefault: spyMouseDown});
        expect(spyMouseDown).toHaveBeenCalled();
        spyMouseDown.calls.reset();

        expect(clearbtn.props.disabled).toEqual(clearDisabled);

        expect(props.onClearClick).not.toHaveBeenCalled();
        clearbtn.props.onClick();
        expect(props.onClearClick).toHaveBeenCalled();


        expect(spyMouseDown).not.toHaveBeenCalled();
        clearbtn.props.onMouseDown({preventDefault: spyMouseDown});
        expect(spyMouseDown).toHaveBeenCalled();
    }

    it("no clear, no filter", () => {
        const props = {
            canclear: false,
            filter: false,
            onClearClick: jasmine.createSpy("onClear"),
            onFilterClick: jasmine.createSpy("onFilter")
        };

        auxBtns(props, "success", "Hide equals", true);
    });

    it("clear, no filter", () => {
        const props = {
            canclear: true,
            filter: false,
            onClearClick: jasmine.createSpy("onClear"),
            onFilterClick: jasmine.createSpy("onFilter")
        };

        auxBtns(props, "success", "Hide equals", false);
    });

    it("no clear, filter", () => {
        const props = {
            canclear: false,
            filter: true,
            onClearClick: jasmine.createSpy("onClear"),
            onFilterClick: jasmine.createSpy("onFilter")
        };

        auxBtns(props, "danger", "Show equals", true);
    });

    it("clear, filter", () => {
        const props = {
            canclear: true,
            filter: true,
            onClearClick: jasmine.createSpy("onClear"),
            onFilterClick: jasmine.createSpy("onFilter")
        };

        auxBtns(props, "danger", "Show equals", false);
    });
});
