import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter } from 'next/router'
import  React, {useRef, useState, useEffect} from 'react';
import OrderRow from './OrderRow'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Overlay, Popover } from 'react-bootstrap';
import {formatCurrency, getUserId} from '../../utils/helpers';
import Link from 'next/link'
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },

    orderContainer: {

        [theme.breakpoints.down('sm')]: {
            width: '90vw',
        },

        [theme.breakpoints.up('md')]: {
            borderRadius: '5px',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            minWidth: '1000px',
            maxWidth: '1000px',
            width: '1000px',
            paddingBottom: '10px',
            margin: '20px auto 0',
        },
    },

    orderHeadline: {
        borderTop: '5px',
        height: '60px',
        backgroundColor: 'whitesmoke',
        paddingLeft: '10px',
        paddingRight: '10px',

        [theme.breakpoints.down('sm')]: {
            //display: 'flex',
            //alignItems: 'center',
            //gap: '50px',
            //display: 'grid',
            //gridTemplateColumns: '1fr 1fr 1fr',
            display: 'none',
        },

        [theme.breakpoints.up('md')]: {
            display: 'grid',
            gridTemplateColumns: '200px 150px 400px auto',
        },
    },

    headlineMobile: {
        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateColumns: '10px 1fr 1fr',
            border: '1px solid #f5f5f5',
            height: '50px',
            '&:hover': {
                backgroundColor: '#f5f5f5',
            },
            '& > div > *': {
                //backgroundColor: '#f5f5f5',
                margin: '0',
            },
        },

        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },

    date: {
        '& > p': {
            margin: '4px 4px 4px 0px',
        }
    },

    total: {
        '& > p': {
            margin: '4px 4px 4px 0px',
        }
    },

    shipping: {

        [theme.breakpoints.down('sm')]: {
            display: 'none',

        },

        [theme.breakpoints.up('md')]: {
            '& > p': {
                margin: '4px 4px 4px 0px',
            },
        },
    },

    orderNumber: {
        '& > div > *': {
           // marginTop: '20px',
            margin: '4px 4px 4px 0px',
        }
    },

    orderContent: {

        [theme.breakpoints.down('sm')]: {

        },

        [theme.breakpoints.up('md')]: {
            display: 'grid',
            gridTemplateColumns: 'auto',
            height: '100%',
            width: '100%',
            marginTop: '10px',
            marginBottom: '10px',
            paddingRight: '15px',
            paddingLeft: '15px',
        },
    },

    orderButtons: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
}));

export default function Order(props) {
    const { id, saleDate, shipping, orders, subTotal, total, salesTax} = props.content;

    const router = useRouter();
    const classes = useStyles();

    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };

    const handleOrderClick = () => {
        router.push("/account/order/" + id)
    };

    function formatDate() {
        const moment = require('moment'); // require

        const d = new Date(saleDate);

        return moment(d).format('YYYY-MM-DD');
    }


    return (
        <div className={classes.orderContainer}>
            <div className={classes.orderHeadline}>
                <div className={classes.date}>
                    <p><small>ORDER PLACED </small></p>
                    <p>{formatDate()}</p>
                </div>
                <div className={classes.total}>
                    <p><small>TOTAL </small></p>
                    <p>{formatCurrency(total)}</p>
                </div>

                <div className={classes.shipping}>
                    <p><small>SHIP TO </small></p>
                    <div ref={ref}>
                        <button className="order-shipping" onClick={handleClick}>{shipping.firstname + " "  + shipping.lastname}</button>

                        <Overlay
                            show={show}
                            target={target}
                            placement="bottom"
                            container={ref.current}
                            containerPadding={20}
                        >
                            <Popover id="popover-contained">
                                <Popover.Title as="h3">Address</Popover.Title>
                                <Popover.Content>
                                    {shipping.street} <br></br>
                                    {shipping.city + ", " + shipping.state + " " + shipping.postcode } <br></br>
                                    United States
                                </Popover.Content>
                            </Popover>
                        </Overlay>
                    </div>
                </div>
                <div className={classes.orderNumber}>
                    <div style={{float:"right"}}>
                        <p>ORDER #{id}</p>
                        <Link href={"/account/order/" + id}>Order Details</Link>
                    </div>
                </div>
            </div>

            <div className={classes.headlineMobile}>
                <div style={{backgroundColor:'dodgerblue'}}></div>
                <div className="" style={{paddingLeft:'10px'}}>
                    <p><small style={{fontWeight:'bold'}}>ORDER # </small></p>
                    <p>{id}</p>
                </div>
                <div className={classes.orderButtons}>
                    <Button variant="contained" color="primary" onClick={handleOrderClick}>
                        <FontAwesomeIcon icon={faChevronRight} size={"2x"} style={{color:'dodgerblue'}}/>
                    </Button>
                </div>
            </div>

            <div className={classes.orderContent}>
                <div className="order-rows">
                    {orders.map((order, index) => (
                        <OrderRow key={index} content={order}/>
                    ))}
                </div>

            </div>
        </div>
    );
}
