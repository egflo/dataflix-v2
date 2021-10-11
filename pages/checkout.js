import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter, Link } from 'next/router'
import {useState} from 'react'
import Image from 'next/image'
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/LinearProgress';

import {useGetCheckOut} from '../pages/api/Service'
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";

import { Button, Navbar, Nav, NavDropdown, Form, FormControl, Container} from 'react-bootstrap';
import CartRow from'../components/CartRow'
import ShippingCard from'../components/ShippingCard'

import { loadStripe } from "@stripe/stripe-js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFilm} from '@fortawesome/free-solid-svg-icons'
import {formatRuntime,getUserId, formatCurrency} from '../utils/helpers'
import useSWR, { mutate } from 'swr'
import { makeStyles } from '@material-ui/core/styles';


const stripe = loadStripe("pk_test_51J3qCqBVPvYzs7uWw0nbrKwdIZWg0hmaYHEABbUirTZqQR2TftCxjMBRJhBlVIQbvYLTWDrUXt2WZnzVbY2BNfye0055McVHXT");

const useStyles = makeStyles((theme) => ({
    checkoutContainer: {
        minWidth: '800px',
        maxWidth: '800px',
        margin: '50px auto 0',
        padding: '10px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    },

    checkoutRow1: {
        display: 'grid',
        gridTemplateColumns: '65% 35%',
    },

    checkoutRow2: {

    },

    shippingContainer: {
        gridColumn: 1,
        marginBottom: '10px',
    },

    shippingContent: {
        display: 'grid',
        gridTemplateColumns: '85% 15%',
        padding: '10px',
        width: '500px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        '& > p': {
            margin: 0,
            gridColumn: 1,
        },
    },

    checkoutTotals: {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        gridColumn: 2,
        gridRow: '1/ span 2',
        paddingTop: '40px',
        paddingLeft: '7px',
        paddingRight: '7px',
        height: '215px',
        '& > *': {
            textAlign: 'right',
        },
    },

    checkoutTotalsDivider: {
        border: 'none',
        height: '2px',
        backgroundColor: 'lightgrey',

    },

}));


const CARD_ELEMENT_OPTIONS = {
    iconStyle: "solid",
    hidePostalCode: false,
    style: {
        base: {
            color: "black",
            fontSize: "16px",
            fontFamily: '"Open Sans", sans-serif',
            fontSmoothing: "antialiased",
            "::placeholder": {
                color: "lightgrey"
            }
        },
        invalid: {
            color: "#e5424d",
            ":focus": {
                color: "#9e2146"
            }
        }
    }
};

export default function Checkout() {
    return (
        <Elements stripe={stripe}>
            <CheckoutForm></CheckoutForm>
        </Elements>
    );
};

//https://www.valentinog.com/blog/await-react/

function CheckoutForm() {
    const router = useRouter()
    const stripe = useStripe();
    const elements = useElements();
    const classes = useStyles();

    const [isLoading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const { data, error } = useGetCheckOut(getUserId())

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div>
            <div className="cart-container">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const { total, address, subTotal, salesTax, cart } = data

    const processPayment = async (paymentIntent) => {
        //Get PaymentIntent Data
        const {id, amount, currency, secret, created} = paymentIntent

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        const response = await stripe.confirmCardPayment(secret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Test Test',
                    },
                },
            })

        return response;
    };


    async function CreatePaymentIntent(event) {
        // Block native form submission.
        event.preventDefault();
        setLoading(true)
        
        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: JSON.stringify({ amount: total, currency: "USD", description: "Test"})
        };
        const res = await fetch('http://localhost:8080/checkout/charge', requestOptions)
        const data = await  res.json()
        
        if(res.status < 300) {
            const response = await processPayment(data);
            if (response.error) {
                // Handle error here
                console.log("Error Processing Payment")

            } else if (response.paymentIntent && response.paymentIntent.status === 'succeeded') {
                // Handle successful payment here
                const form_object = JSON.stringify(response.paymentIntent, null, 2);
                processSale(response);

            }
            setLoading(false);
        }
        else {
            setLoading(false);
            console.log(res);
        }

    };

    async function processSale(payment) {
        const payment_intent = payment['paymentIntent'];

        const form_object = JSON.stringify(payment_intent, null, 2);
        //alert(form_object);
        //return
        //alert(object)

        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: JSON.stringify({
                total: total,
                subTotal: subTotal,
                salesTax: salesTax,
                customerId: getUserId(),
                stripeId: payment_intent['id'],
                shipping: {
                    customerId: getUserId(),
                    firstName: address.firstName,
                    lastName: address.lastName,
                    address: address.address,
                    unit: address.unit,
                    city: address.city,
                    state: address.state,
                    postcode: address.postcode
                }
            })
        };
        const res = await fetch('http://localhost:8080/sale/', requestOptions)
        const data = await  res.json()

        //.then(response => response.json())
        //.then(data => console.log(data));
        if(res.status < 300) {
            const form_object = JSON.stringify(data, null, 2);
            alert(form_object);
            console.log(data)
        }
        else {
            console.log(res)
        }

    };

    function handleClickHome() {
        router.push({
            pathname: '/'
        })
    }

    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg">
                    <Navbar.Brand href="#home" onClick={handleClickHome}>
                        <FontAwesomeIcon icon={faFilm} size="2x"/>
                    </Navbar.Brand>

                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <a href="/cart">Return To Cart</a>
                        </Navbar.Text>
                    </Navbar.Collapse>
            </Navbar>

            <div className={classes.checkoutContainer}>
                <div className={classes.checkoutRow1}>
                    <div className={classes.shippingContainer}>
                        <h4>1 Shipping Address</h4>
                        <div className={classes.shippingContent}>
                            <p>{address.firstName + " " + address.lastName}</p>
                            <p>{address.address}</p>
                            <p>{address.city + ", " + address.state + " " + address.postcode}</p>

                            <ShippingCard address={address}></ShippingCard>
                        </div>
                    </div>

                    <div className={classes.checkoutRow2}>
                        <h4>2 Payment Method</h4>
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>

                    <div className={classes.checkoutTotals}>
                        <h6>Subtotal: {formatCurrency(subTotal)}</h6>
                        <h6>Taxes: {formatCurrency(salesTax)}</h6>
                        <h6>Shipping: {formatCurrency(0.00)}</h6>

                        <hr className={classes.checkoutTotalsDivider}></hr>

                        <h5><b>Order Total: </b> {formatCurrency(total)}</h5>

                    </div>
                </div>

                <div className="checkout-cart">
                    <h4>3 Review Items</h4>
                    {cart.map(cartItem => (
                        <CartRow key={cartItem.id} content={cartItem}></CartRow>
                    ))}
                </div>
                
                <Button
                    onClick={CreatePaymentIntent}
                    className="btn-block"
                    variant="primary"
                    size="lg"
                    disabled={!stripe}>
                    {isLoading ? <LinearProgress color="secondary" /> : 'Pay'}
                </Button>
            </div>

        </>
    );
}