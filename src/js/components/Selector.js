"use strict";

import React, {PropTypes} from "react";
import Dropdown from "react-dropdown";

const Selector = props => {
    const {options, onChange, selected} = props;
    const sel = {value: selected, label: selected};
    const formatOptions = options.map(o => {
        return {value: o, label: o};
    });

    return (
            <Dropdown onChange={onChange} options={formatOptions} value={sel} />
    );

};

Selector.propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    selected: PropTypes.string
};

export default Selector;
