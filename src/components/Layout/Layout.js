import React, {Component} from 'react';

import SideDrawer from '../Navigation/SideDrawer/SideDrawer'
import Toolbar from '../Navigation/Toolbar/Toolbar';
import classes from './Layout.module.css';
import {connect} from 'react-redux';

class Layout extends Component {
    
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }
    
    sideDrawerToggledHandler = () => {
        this.setState((prevState) => {
           return { showSideDrawer:!prevState.showSideDrawer }
        });
    }
    
    render () {
        return (
            <React.Fragment>
                <div>
                    <Toolbar
                        isAuth={this.props.isAuthenticated}
                        drawerToggleClicked={this.sideDrawerToggledHandler} />
                    <SideDrawer
                        isAuth={this.props.isAuthenticated}
                        open={this.state.showSideDrawer} 
                        closed={this.sideDrawerClosedHandler}/>
                </div>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </React.Fragment>
        );
    }
} 

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(Layout);