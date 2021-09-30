import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  React, {useRef, useState, useEffect} from 'react';
import Image from 'next/image'
import OrderRow from '../components/OrderRow'
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Overlay, Popover } from 'react-bootstrap';
import  {formatCurrency, getUserId} from '../utils/helpers';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },

    orderContainer: {
        borderRadius: '5px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        minWidth: '1000px',
        maxWidth: '1000px',
        width: '1000px',
        paddingBottom: '10px',
        margin: '20px auto 0',
    },

    orderHeadline: {
        display: 'grid',
        borderTop: '5px',
        gridTemplateColumns: '200px 150px 100px auto',
        height: '60px',
        backgroundColor: 'whitesmoke',
        paddingLeft: '10px',
        paddingRight: '10px',
    },

    orderHeadlineColumn: {
        '& > p': {
            margin: '4px 4px 4px 0px',
        }
    },
    orderHeadlineColumnOrderNumber: {
        '& > p': {
            marginTop: '20px',
            float: 'right',
        }
    },

    orderContent: {
        display: 'grid',
        gridTemplateColumns: '700px auto',
        height: '100%',
        width: '100%',
        marginTop: '10px',
        marginBottom: '10px',
        paddingRight: '15px',
        paddingLeft: '15px',
    },


}));

export default function Order({content}) {
    
    const { id, saleDate, shipping, orders, subTotal, total, salesTax} = content;

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

    function formateDate() {
        const moment = require('moment'); // require

        const d = new Date(saleDate);

        return moment(d).format('YYYY-MM-DD');
    }


    return (
        <div className={classes.orderContainer}>
            <div className={classes.orderHeadline}>

                <div className={classes.orderHeadlineColumn}>
                    <p><small>ORDER PLACED </small></p>
                    <p>{formateDate()}</p>
                </div>
                <div className={classes.orderHeadlineColumn}>
                    <p><small>TOTAL </small></p>
                    <p>{formatCurrency(total)}</p>
                </div>

                <div className={classes.orderHeadlineColumn}>
                    <p><small>SHIP TO </small></p>
                    <div ref={ref}>
                        <button className="order-shipping" onClick={handleClick}>{shipping.firstName + " "  + shipping.lastName}</button>

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
                                    {shipping.address} <br></br>
                                    {shipping.city + ", " + shipping.state + " " + shipping.postcode } <br></br>
                                    United States
                                </Popover.Content>
                            </Popover>
                        </Overlay>
                    </div>
                </div>

                <div className={classes.orderHeadlineColumnOrderNumber}>
                    <p>ORDER # {id}</p>
                </div>

            </div>

            <div className={classes.orderContent}>
                <div className="order-rows">
                    {orders.map(order => (
                        <OrderRow key={order.id} content={order}/>
                    ))}
                </div>

                <div className="order-buttons">
                    <Button className="btn-block" variant="primary"  size="md" onClick={handleOrderClick}>
                        View Order Details
                    </Button>
                    <Button className="btn-block" variant="primary" size="md">
                        Return or replace items
                    </Button>
                    <Button className="btn-block" variant="primary"  size="md" >
                        Write a Review
                    </Button>
                </div>

            </div>
        </div>
    );
}
