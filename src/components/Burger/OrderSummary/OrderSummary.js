import React, {Component} from 'react';

import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
    
componentWillUpdate(){
    console.log('[OrderSummary] componentWillUpdate');
}

    render(){
        const ingredientSummary = Object.keys(this.props.ingredients)
            .map(igKey => {
                return (
                    <li key={igKey}>
                        <span>{igKey}</span>: {this.props.ingredients[igKey]}
                    </li>);
            });

        return (
            <React.Fragment>
                <h3>Your Order</h3>
                <p>Ingredients:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p>Total Price: <strong>{this.props.price.toFixed(2)}</strong></p>
                <p>Continue to Checkout?</p>
                <Button btnType='Danger' clicked={this.props.purchaseCancelled}>CANCEL</Button>
                <Button btnType='Success' clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </React.Fragment>
        );
    }
}

export default OrderSummary;