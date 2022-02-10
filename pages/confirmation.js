import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter } from 'next/router'
import React, {useState} from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Navbar, Nav, NavDropdown, Form, FormControl, Container} from 'react-bootstrap';
import {formatCurrency} from '../utils/helpers'
import {useGetSales} from '../service/Service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faFilm} from '@fortawesome/free-solid-svg-icons'
import Fireworks from '../components/order/Fireworks'
import {makeStyles} from "@material-ui/core/styles";


const canvasStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
}

const useStyles = makeStyles((theme) => ({
    container: {
        boxShadow: ' 0 4px 8px 0 rgba(0,0,0,0.2)',
        height: '260px',
        width: '625px',
        margin: '50px auto',
        padding: '15px',

    },
    title: {
        display:'flex',
        '& > h1': {
          paddingLeft: '5px',
        },
    },

    context: {
        height: '45px',
        width: '100%',
    },
}))

export default function Confirmation() {
    const router = useRouter();
    const classes = useStyles();

    console.log(router.query);

    const {sid} = router.query;

    console.log("CONFIRM" + sid)
    const { data, error } = useGetSales(sid);
     if (error) return <h1>Something went wrong!</h1>
     if (!data) return(
     <>
         <div className="loading-container"><CircularProgress/></div>
     </>
     );

    const{card, sale} = data;
    const {id, customerId, saleDate, salesTax, subTotal, total, shipping, orders} = sale;
    const {brand,exp_month,exp_year, last4} = card;

    function handleClickHome() {
        router.replace({
            pathname: '/'
        })
    }
    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg">
                <Navbar.Brand href="#home" onClick={handleClickHome}>
                    <FontAwesomeIcon icon={faFilm} size="2x"/>
                </Navbar.Brand>

            </Navbar>

            <div className={classes.container}>
                <div className={classes.title}>
                    <FontAwesomeIcon style={{color: 'green'}} icon={faCheckCircle} size="3x"/>
                    <h1>Order Placed!</h1>
                </div>

                <hr></hr>

                <h4>Your confirmation #{id}</h4>
                <h5>Thank You For Shopping at DataFlix!</h5>

                <h5>You have been charged {formatCurrency(total)} on the card ending x{last4}</h5>

                <div className={classes.context}>
                    <Button onClick={handleClickHome} className="btn-block" variant="primary" size="lg">
                        <h5>Continue Shopping</h5>
                    </Button>
                </div>
                <Fireworks></Fireworks>
            </div>
        </>
    );
}