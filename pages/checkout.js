import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter} from 'next/router'
import Link from 'next/link'
import React, {useState, useEffect} from 'react'
import {useGetCheckOut, useGetAddress, getBaseURL} from '../pages/api/Service'
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { Button, Navbar} from 'react-bootstrap';
import CartRow from'../components/CartRow'
import { loadStripe } from "@stripe/stripe-js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFilm, faPlus} from '@fortawesome/free-solid-svg-icons'
import {getUserId, formatCurrency} from '../utils/helpers'
import { makeStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ShippingCard from "../components/ShippingCard";

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
        marginRight: '10px',
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

    shippingRow: {
        display: 'grid',
        gridTemplateColumns: '85% 15%',
        padding: '10px',
        width: '450px',
        '& > p': {
            margin: 0,
            gridColumn: 1,
        },
    },

    checkoutTotals: {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        gridColumn: 2,
        gridRow: '1/ span 2',
        marginTop: '36px',
        paddingTop: '40px',
        paddingLeft: '7px',
        paddingRight: '7px',
        height: '185px',
        '& > *': {
            textAlign: 'right',
        },
    },

    checkoutTotalsDivider: {
        border: 'none',
        height: '2px',
        backgroundColor: 'lightgrey',

    },

    add: {
        position: 'relative',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        width: '500px',
        height: '100px',
        '& > button': {
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '25px',
            color: 'gray',
            marginTop: '5px',
        },
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
//https://react-select.com/styles
function AddressSelect({checkout, onChange}) {
    const classes = useStyles();
    const { data, error } = useGetAddress();

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div>
            <div className="loading-container"><CircularProgress/></div>
        </div>
    );

    function handleChange(selectedOptions) {
        const selectedAddress = (element) => element.id == selectedOptions.value;
        const selectedAddressIndex = data.findIndex(selectedAddress);
        const address = data[selectedAddressIndex];
        handleAddressChange(address).then(r => onChange(r) );
    }

    async function handleAddressChange(address) {
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
                id: address.id,
                firstName: address.firstName,
                lastName: address.lastName,
                address: address.address,
                unit: address.unit,
                city: address.city,
                state: address.state,
                postcode: address.postcode
            })
        };
        const res = await fetch( getBaseURL() + '/checkout/', requestOptions)
        const data = await  res.json()

        if(res.status < 300) {
            return data;
        }
        else {
            console.log(res)
        }
    }

    const options = [];
    for (let i = 0; i < data.length; i++) {
        let address = data[i];
        let value = address.id;
        let label =
            <div className={classes.shippingRow}>
                <p>{address.firstName + " " + address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.city + ", " + address.state + " " + address.postcode}</p>
            </div>;

        options.push({value:value,label: label});
    }

    const defaultAddress = checkout['address']
    const defaultIndex = (element) => element.value == defaultAddress.id;
    const defaultAddressIndex = options.findIndex(defaultIndex)

    return (
        <Select
            defaultValue={options[defaultAddressIndex]}
            options={options}
            isSearchable={false}
            onChange={handleChange}
        />
    );
}

function CheckoutForm() {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const classes = useStyles();

    const [isLoading, setLoading] = useState(false);
    const [checkout, setCheckout] = useState( null);
    const [enable, setEnable] = useState( false);

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const [alert, setAlert] = useState({
        type: 'success',
        message: 'Payment Processed'
    });


    const { data, error } = useGetCheckOut("/");

    useEffect(() => {
        if(data){
            setCheckout(data);
        }
    }, [data]);

    function handleChange(newValue) {
        setCheckout(newValue);
    }

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div>
            <div className="loading-container"><CircularProgress/></div>
        </div>
    );
    const { total, address, subTotal, salesTax, cart } = (checkout !=null) ? checkout:data;

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
        const res = await fetch(getBaseURL() + '/checkout/charge', requestOptions)
        const data = await res.json()
        
        if(res.status < 300) {
            const response = await processPayment(data);
            if (response.error) {
                // Handle error here
                console.log("Error Processing Payment")

            } else if (response.paymentIntent && response.paymentIntent.status === 'succeeded') {
                // Handle successful payment here
                const form_object = JSON.stringify(response.paymentIntent, null, 2);
                await processSale(response);

            }
            setLoading(false);
        }
        else {
            setLoading(false);
            setAlert({
                type: 'error',
                message: 'Unable to process sale. Try again later.'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});
        }

    };

    async function processSale(payment) {
        const payment_intent = payment['paymentIntent'];
        const token = localStorage.getItem("token");

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
        const res = await fetch(getBaseURL() + '/sale/', requestOptions)
        const data = await res.json()

        //.then(response => response.json())
        //.then(data => console.log(data));
        if(res.status < 300) {
            await router.push({
                pathname: '/confirmation',
                query: {sid: data.id},
            }, '/success');
        }
        else {
            setAlert({
                type: 'error',
                message: 'Unable to process sale. Try again later.'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});
        }

    };

    function calcSubtotal(data) {
        return data.map(li => li.quantity * li.movie.price).reduce((sum, val) => sum + val, 0)
    };

    function Totals() {
        if(address == null) {

            return (
                <>
                    <h6>Subtotal: {formatCurrency(calcSubtotal(cart))}</h6>
                    <h6>Taxes: {formatCurrency(0.00)}</h6>
                    <h6>Shipping: {formatCurrency(0.00)}</h6>

                    <hr className={classes.checkoutTotalsDivider}></hr>

                    <h5><b>Order Total: </b> {formatCurrency(calcSubtotal(cart))}</h5>
                </>
            );

        }
        else {

            return (
                <>
                    <h6>Subtotal: {formatCurrency(subTotal)}</h6>
                    <h6>Taxes: {formatCurrency(salesTax)}</h6>
                    <h6>Shipping: {formatCurrency(0.00)}</h6>

                    <hr className={classes.checkoutTotalsDivider}></hr>

                    <h5><b>Order Total: </b> {formatCurrency(total)}</h5>
                </>
            );
        }
    }

    function Address() {
        if(address == null) {
            return (
                <div className={classes.shippingContainer}>
                    <h4>1 Shipping Address</h4>
                    <div className={classes.add}>
                        <FontAwesomeIcon style={{color:'lightgray', position: 'absolute', marginLeft: '28%',marginTop:'8%'}} icon={faPlus} size="2x" />
                        <ShippingCard insert={true}/>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className={classes.shippingContainer}>
                    <h4>1 Shipping Address</h4>
                    <AddressSelect checkout={checkout} onChange={handleChange}></AddressSelect>
                </div>
            );
        }
    }

    const handleClose = () => {
        setState({ ...state, open: false });
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
                            <Link href={"/cart"}>
                                <a>Return To Cart</a>
                            </Link>
                        </Navbar.Text>
                    </Navbar.Collapse>
            </Navbar>

            <div className={classes.checkoutContainer}>
                <div className={classes.checkoutRow1}>

                    <Address></Address>

                    <div className={classes.checkoutRow2}>
                        <h4>2 Payment Method</h4>
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>

                    <div className={classes.checkoutTotals}>
                        <Totals></Totals>
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
                    disabled={!stripe || !enable}>
                     Pay
                </Button>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>

            <Snackbar
                open={open}
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={6000}
                key={vertical + horizontal}
                onClose={handleClose}>

                <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}