import * as burgerBuilderAction from '../../store/actions/index';

import React, {Component} from 'react';

import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from  '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import {connect} from 'react-redux';
import withErrorHandler from '../../components/withErrorHandler/withErrorHandler';

class BurgerBuilder extends Component{

    state = {
        purchasing: false
    }
    
    componentDidMount(){
        console.log("[BurgerBuilder] componentDidMount");
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients){        
        const sum = Object.keys(ingredients)
                    .map(igKey => {
                        return ingredients[igKey]
                    })
                    .reduce((sum,el) => {
                        return sum + el;
                    }, 0);
                    
        return sum > 0;
    }

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing: true})
        }
        else {
            console.log('seting redirect to checkout');
            this.props.onSetRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
        
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render(){
        const disabledInfo = {
            ...this.props.ings
        }
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        
        if(this.props.ings){
        orderSummary = <OrderSummary
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            price={this.props.price}
            ingredients={this.props.ings} />;
        }
        // if(this.state.loading){
        //     orderSummary = <Spinner/>
        // }

        let burger = this.props.error ? <p>Error Happened</p> : <Spinner/>;
        if(this.props.ings){
            burger = (
            <React.Fragment>
                <Burger ingredients={this.props.ings} />
                <BuildControls 
                    ingredientAdded={this.props.onIngredientAdded} 
                    ingredientRemoved={this.props.onIngredientRemoved} 
                    disabled={disabledInfo}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    price={this.props.price}
                    isAuth={this.props.isAuthenticated}
                    ordered={this.purchaseHandler}/>
            </React.Fragment>
            );
        }
        
        return (
            <React.Fragment>
                <Modal 
                    show={this.state.purchasing} 
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}  
                </Modal>                
                {burger}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(burgerBuilderAction.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(burgerBuilderAction.removeIngredient(ingredientName)),
        onInitIngredients: () => dispatch(burgerBuilderAction.initIngredients()),
        onInitPurchase: () => dispatch(burgerBuilderAction.purchaseInit()),
        onSetRedirectPath: (path) => dispatch(burgerBuilderAction.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));