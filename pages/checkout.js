import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter} from 'next/router'
import Link from 'next/link'
import React, {useState, useEffect} from 'react'
import {axiosInstance, useGetCheckOut} from '../service/Service'
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { Button, Navbar} from 'react-bootstrap';
import CartRow from '../components/cart/CartRow'
import { loadStripe } from "@stripe/stripe-js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFilm, faPlus} from '@fortawesome/free-solid-svg-icons'
import {getUserId, formatCurrency} from '../utils/helpers'
import { makeStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddressCard from "../components/account/AddressCard";
import {Card, CardContent, CardHeader, Divider} from "@mui/material";
import {checkCookies, getCookies} from "cookies-next";


const useStyles = makeStyles((theme) => ({
    checkoutContainer: {

        [theme.breakpoints.up('md')]: {
            minWidth: '800px',
            maxWidth: '800px',
            margin: '50px auto 0',
            padding: '10px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        },

        [theme.breakpoints.down('sm')]: {
            minWidth: '100vw',
            maxWidth: '100vw',
            padding: '10px',
        },
    },

    checkoutRow1: {
        [theme.breakpoints.up('md')]: {
            display: 'grid',
            gridTemplateColumns: '65% 35%',
        },

        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },

    checkoutRow2: {

    },

    shippingContainer: {
        [theme.breakpoints.up('md')]: {
            gridColumn: 1,
            marginBottom: '10px',
            marginRight: '10px',

        },

        [theme.breakpoints.down('sm')]: {
            gridColumn: 1/2,
            marginBottom: '10px',
            marginRight: '10px',
        },
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

        [theme.breakpoints.up('md')]: {
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

        [theme.breakpoints.down('sm')]: {
            display:'none',
        },
    },

    totalMobile: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },


        [theme.breakpoints.down('sm')]: {
            border: '2px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
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

function Checkout(props) {
    const stripe = loadStripe(props.STRIPE_KEY);

    return (
        <Elements stripe={stripe}>
            <CheckoutForm {...props}></CheckoutForm>
        </Elements>
    );
};

//https://www.valentinog.com/blog/await-react/
//https://react-select.com/styles
function CheckoutForm(props) {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const classes = useStyles();

    const [isLoading, setLoading] = useState(false);
    const [checkout, setCheckout] = useState(null);
    const [enable, setEnable] = useState(true);
    const [intent, setIntent] = useState(null);

    const {data, error} = useGetCheckOut("/");

    useEffect(() => {
        if (data) {
            //Once we have the data, we can set the checkout state
            //Get a payment intent from the server and set the intent state
            createCharge()
        }
    }, [data]);


    if (error) return (
        <Card>
            <CardHeader
                title="Error"
                subheader={"Status Code: " + error.status}
            />
            <Divider/>
            <CardContent>
                <p>{error.message}</p>
            </CardContent>
        </Card>
    );

    if (!data) return (
        <div>
            <div className="loading-container"><CircularProgress/></div>
        </div>
    );

    const {total, addresses, defaultId, subTotal, salesTax, cart} = (checkout != null) ? checkout : data;

    if (addresses.length === 0) {
        router.push('/shipping');
    }

    function createCharge() {
        //Once we have the data, we can set the checkout state
        //Get a payment intent from the server and set the intent state
        setLoading(true);
        axiosInstance.post('/checkout/charge', {
            amount: total,
            currency: 'USD',
            description: 'Test Charge for user id: ' + getUserId(),
        })
            .then(response => {
                if (response.error) {
                    // Handle error here
                    props.setalert(
                        {
                            open: true,
                            message: response.error.message,
                            type: "error",
                        }
                    );

                }
                setIntent(response.data);
            })
            .catch(function (error) {
                props.setalert(
                    {
                        open: true,
                        message: error.message,
                        type: "error",
                    }
                );
            });

        setLoading(false);
    }

    async function handleAddressChange(address) {
        // POST request using fetch with set headers
        const options = {
            id: address.id,
            firstName: address.firstname,
            lastName: address.lastname,
            street: address.street,
            unit: address.unit,
            city: address.city,
            state: address.state,
            postcode: address.postcode
        }

        axiosInstance.post('/checkout/', options)
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    setCheckout(res.data);
                    createCharge()
                }
            })
            .catch(err => {
                props.setalert({
                    open: true,
                    type: 'error',
                    message: err.data ? err.data.message : err.message
                })
            })
    }

    function processPayment() {
        //Get PaymentIntent Data
        if (!stripe || !elements || intent === null) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        const {id, amount, currency, secret, created} = intent;

        setEnable(false);
        setLoading(true);

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        stripe.confirmCardPayment(secret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: 'Test Test',
                },
            },
        }).then(function (result) {

            if(result.paymentIntent && result.paymentIntent.status === 'succeeded'){

                processSale(result)

            }
            else if(result.error){
                //Payment Failed
                props.setalert(
                    {
                        open: true,
                        message: result.error.message,
                        type: "error",
                    }
                );
            }
        }) .catch( function (error) {
            props.setalert(
                {
                    open: true,
                    message: error.message,
                    type: "error",
                }
            );
        });

        setLoading(false);
        setEnable(true);

    };

    function processSale(payment) {
        const payment_intent = payment['paymentIntent'];

        const defaultIndex = (element) => element.id == defaultId;
        const defaultAddress = addresses.find(defaultIndex);


        let values = {
            total: total,
            subTotal: subTotal,
            salesTax: salesTax,
            customerId: getUserId(),
            stripeId: payment_intent['id'],
            shipping: {
                customerId: getUserId(),
                firstname: defaultAddress.firstname,
                lastname: defaultAddress.lastname,
                street: defaultAddress.street,
                unit: defaultAddress.unit,
                city: defaultAddress.city,
                state: defaultAddress.state,
                postcode: defaultAddress.postcode
            },
            device: 'browser'
        }

        //alert(JSON.stringify(values, null, 2));
        //return

        axiosInstance.post('/sale/', values)
            .then(res => {
                if (res.status === 200 || res.status === 201) {

                    const data = res.data;
                    router.push({
                        pathname: '/confirmation',
                        query: {sid: data.id },
                    }, '/success');

                }
                else {
                    props.setalert({
                        open: true,
                        type: 'error',
                        message: 'Unable to process sale. Try again later.'
                    })
                }
            })
            .catch(error => {
                props.setalert({
                    open: true,
                    type: 'error',
                    message: error.message
                })
            });
    }


    function calcSubtotal(data) {
        return data.map(li => li.quantity * li.movie.price).reduce((sum, val) => sum + val, 0)
    };

    function Totals() {
        if(addresses.length === 0) {

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
        if(addresses.length === 0) {
            setEnable(false);
            return (
                <div className={classes.shippingContainer}>
                    <h4>1 Shipping Address</h4>
                    <div className={classes.add}>
                        <FontAwesomeIcon style={{color:'lightgray', position: 'absolute', marginLeft: '28%',marginTop:'8%'}} icon={faPlus} size="2x" />
                        <AddressCard insert={true}/>
                    </div>
                </div>
            );
        }
        else {
            const options = [];
            for (let i = 0; i < addresses.length; i++) {
                let address = addresses[i];
                let value = address.id;
                let label =
                    <div className={classes.shippingRow}>
                        <p>{address.firstname + " " + address.lastname}</p>
                        <p>{address.street}</p>
                        <p>{address.city + ", " + address.state + " " + address.postcode}</p>
                    </div>;

                options.push({value:value,label: label});
            }

            const defaultIndex = (element) => element.value == defaultId;
            const defaultAddressIndex = options.findIndex(defaultIndex)

            return (
                <div className={classes.shippingContainer}>
                    <h4>1 Shipping Address</h4>
                    <Select
                        defaultValue={options[defaultAddressIndex]}
                        options={options}
                        isSearchable={false}
                        onChange={handleChangeSelect}
                    />
                </div>
            );
        }
    }

    function handleClickHome() {
        router.push({
            pathname: '/'
        })
    }

    function handleChangeSelect(selectedOptions) {
        const selectedAddress = (element) => element.id == selectedOptions.value;
        const selectedAddressIndex = addresses.findIndex(selectedAddress);
        const address = addresses[selectedAddressIndex];
        handleAddressChange(address);
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

                <div className={classes.totalMobile}>
                    <Totals></Totals>
                </div>

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
                        <CartRow {...props} key={cartItem.id} content={cartItem}></CartRow>
                    ))}
                </div>
                
                <Button
                    onClick={processPayment}
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
        </>
    );
}

// This gets called on every request
export const getServerSideProps = ({ req, res }) => {
    // Fetch data from external API
    // Pass data to the page via props
    const cookies = getCookies({ res, req });
    const isLoggedInExists = checkCookies('isLoggedIn', {res, req});
    const isLoggedIn = isLoggedInExists ? cookies.isLoggedIn : false;

    if (!isLoggedIn) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return { props: {
            STRIPE_KEY: process.env.STRIPE_KEY
        },
    }
}

export default Checkout;