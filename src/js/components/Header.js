"use strict";

import React, {PropTypes} from "react";
import {Button, ButtonToolbar} from "react-bootstrap";

// Stateless component: https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html#stateless-function-components
const Header = props => {
    const {canclear, filter, onFilterClick, onClearClick} = props;

    return (
            <ButtonToolbar className="text-right myheader">
            <Button bsStyle={(filter) ? "danger" : "success"} onClick={onFilterClick} onMouseDown={ev => ev.preventDefault()}>
            {(filter) ? "Show equals" : "Hide equals"}</Button>
            <Button bsStyle="info" disabled={!canclear} onClick={onClearClick} onMouseDown={ev => ev.preventDefault()}><img className="imgicon" src="images/delete31.png"/></Button>
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
