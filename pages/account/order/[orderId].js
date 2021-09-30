import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  React, {useRef, useState, useRouter, useEffect} from 'react';
import {useGetSales} from '../../api/Service'
import Image from 'next/image'
import CircularProgress from '@material-ui/core/CircularProgress'

import visa from '../../../public/payment/visa.svg'
import amex from '../../../public/payment/amex.svg'
import discover from '../../../public/payment/discover.svg'
import mastercard from '../../../public/payment/mastercard.svg'


import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from 'react-bootstrap';
import {getUserId,formatCurrency} from '../../../utils/helpers'
import moment from 'moment';
import OrderRowDetailed from '../../../components/OrderRowDetailed'
import Navigation from '../../../components/Navbar'


const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));

function OrderDetails({orderId}) {

    const { data, error } = useGetSales(orderId);

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div>
            <div className="order-container">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const{card, sale} = data;
    const {id, customerId, saleDate, salesTax, subTotal, total, shipping, orders} = sale;
    const {brand,exp_month,exp_year, last4} = card;

    function CardImage() {
        var card = visa;
        if(brand == "mastercard") {
            card = mastercard;
        }
        else if(brand == "amex") {
            card = amex;
        }
        else if(brand == "discover") {
            card = discover;
        }
        return (
            <div className="order-view-payment-card">
                <Image
                    src={card}
                    layout='fill'
                    objectFit="fill"
                    alt="Not Found"
                />
            </div>
        );
    }

    function formatDate() {
        const moment = require('moment'); // require
        const d = new Date(saleDate);
        const date =  moment(d).format('MMMM DD, YYYY');
        return date;
    }

    return (
        <>
            <Navigation />
            <div className="order-detail-view-content">
                <h2>Order Details</h2>
                <p>{formatDate()} | {"Order# " + orderId}</p>
                <div className="order-detail-view">
                    <div className="order-header-view">
                        <div className="order-shipping-view">
                            <h5>Shipping</h5>
                            <p>{shipping.firstName + " " + shipping.lastName}</p>
                            <p>{shipping.address}</p>
                            <p>{shipping.city + ", " + shipping.state + " " + shipping.postcode}</p>
                            United States
                        </div>

                        <div className="order-payment-view">
                            <h5>Payment Method</h5>
                            <div className="card-display">
                                <CardImage/>
                                <p>{"**** " + last4}</p>
                            </div>

                        </div>

                        <div className="order-summary-view">
                            <h5>Order Summary</h5>
                            <p>item(s) Subtotal: {formatCurrency(subTotal)}</p>
                            <p>Shipping & Handling: $0.00</p>
                            <p>Total before tax: {formatCurrency(subTotal)}</p>
                            <p>Estimated tax to be collected: {formatCurrency(salesTax)}</p>
                            <p><b>Grand Total: {formatCurrency(total)} </b></p>
                        </div>
                    </div>

                </div>

                <div className="order-content-view">
                    {orders.map(order => (
                        <OrderRowDetailed key={order.id} content={order}/>
                    ))}
                </div>

            </div>
        </>

    );
}


// this function only runs on the server by Next.js
export const getServerSideProps = async ({params}) => {
   const orderId = params.orderId;
    return {
        props: { orderId }
    }
}

export default OrderDetails;
