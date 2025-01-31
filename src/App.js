import * as actions from './store/actions/index';

import React, {Component} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';

//import Auth from './containers/Auth/Auth';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
//import Checkout from './containers/Checkout/Checkout';
import Layout from './components/Layout/Layout';
import Logout from './containers/Auth/Logout/Logout';
//import Orders from './containers/Orders/Orders';
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import {connect} from 'react-redux';
import styles from './App.module.css';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

class App extends Component{
  
  componentDidMount(){    
    this.props.onTryAutoSignup();
  }

  render(){
    let routes =(
      <Switch>
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/"/>
      </Switch>
    );
    
    if(this.props.isAuthenticated){
      routes =(
      <Switch>
        <Route path="/checkout" component={asyncCheckout} />
        <Route path="/orders" component={asyncOrders} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" component={asyncAuth} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/"/>
      </Switch>
      );
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
        <p className={styles.hide}>test</p>        
      </div>
    );
  }  
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
