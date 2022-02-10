import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter } from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress';
import CartRow from '../components/cart/CartRow'
import {useGetUserCart} from '../service/Service'
import { Button } from 'react-bootstrap';
import  {formatCurrency} from '../utils/helpers'
import { makeStyles } from '@material-ui/core/styles';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {DashboardLayout} from "../components/nav/DashboardLayout";



const useStyles = makeStyles((theme) => ({
    cartContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
        marginBottom: '20px',
        width: '100%',
        height: '100%',

        [theme.breakpoints.down('sm')]: {
            minWidth: '100vw',
            maxWidth: '100vw',
            marginTop: '0px',
        },
    },

    cartEmpty: {
        display: 'flex',
        height: '100vh',
        width: '620px',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginTop: '10%',
        //color: '#828282',
    },

    cart: {
        minWidth: '800px',
        maxWidth: '800px',
        margin: '0 auto',

        [theme.breakpoints.down('sm')]: {
            minWidth: '100vw',
            maxWidth: '100vw',
            padding: '10px',

        },
    },

}));

function Cart(props) {
    const router = useRouter();
    const classes = useStyles();
    const { data, error } = useGetUserCart("");

    if (error) return(
        <>
            <div className={classes.cartContainer}>
                <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                <h2>Unable to load cart data.</h2>
            </div>
        </>
    );

    if (!data) return(
        <>
            <div className={classes.cartContainer}>
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </>
    );

    function calcSubtotal() {
        return data.map(li => li.quantity * li.movie.price).reduce((sum, val) => sum + val, 0)
    }

    function handleClick() {
        router.push({
            pathname: '/checkout',
        })
    }
    function calculateItems() {
        return data.map(li => li.quantity).reduce((sum, val) => sum + val, 0)
    }

    function CartData() {
        if(data.length === 0) {
            return (
                <div className={classes.cartEmpty}>
                    <FontAwesomeIcon icon={faShoppingCart} size="7x" />
                    <div style={{padding:'7px'}}>
                        <h1>Your Cart is Empty</h1>
                        <p>You have no items in your cart. To add items to your cart, click on the &quot;Add to Cart&quot; button next to the movie you want to purchase.</p>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className={classes.cart}>
                    <div className="cart-header">
                        <h1>Your Cart</h1>
                        <p>You have {calculateItems()} item(s) in your cart.</p>
                    </div>
                    <div className="cart-body">
                        {data.map(cartItem => (
                            <CartRow key={cartItem.id} content={cartItem} alert={props.alert} setalert={props.setalert}></CartRow>
                        ))}
                    </div>
                    <div className="cart-footer">
                        <div className="cart-subtotal">
                            <h3>Subtotal: {formatCurrency(calcSubtotal())}</h3>
                        </div>
                        <div className="cart-checkout">
                            <Button onClick={handleClick} className="btn-block" variant="primary" size="lg">
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <>
            <div className={classes.cartContainer}>
                <CartData />
            </div>
        </>
    );
}

Cart.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Cart;