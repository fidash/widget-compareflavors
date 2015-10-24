"use strict";

import React, {PropTypes} from "react";
import {Button, ButtonToolbar} from "react-bootstrap";

// Stateless component: https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html#stateless-function-components
const Header = props => {
    const {canclear, filter, onFilterClick, onClearClick} = props;

    return (
        <ButtonToolbar className="text-center myheader">
          <Button bsStyle={(filter) ? "danger" : "success"} onClick={onFilterClick} onMouseDown={ev => ev.preventDefault()}>
            {(filter) ? "Quit filter" : "Enable filter"}</Button>
          <Button bsStyle="info" disabled={!canclear} onClick={onClearClick} onMouseDown={ev => ev.preventDefault()}>Clear</Button>
        </ButtonToolbar>
    );
};

Header.propTypes = {
    canclear: PropTypes.bool.isRequired,
    filter: PropTypes.bool.isRequired,
    onClearClick: PropTypes.func.isRequired,
    onFilterClick: PropTypes.func.isRequired
};

export default Header;
