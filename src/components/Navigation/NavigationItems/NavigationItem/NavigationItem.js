import {NavLink} from 'react-router-dom';
import React from 'react';
import classes from './NavigationItem.module.css';

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
        <NavLink 
            exact
            activeClassName={classes.active}
            to={props.link}>{props.children}</NavLink>
    </li>
);

export default navigationItem;