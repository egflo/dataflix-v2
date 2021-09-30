import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter } from 'next/router'
import {useState} from 'react'
import Image from 'next/image'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Navbar, Nav, NavDropdown, Form, FormControl, Container} from 'react-bootstrap';


import CartRow from'../components/CartRow'
import {useGetSales} from '../pages/api/Service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFilm} from '@fortawesome/free-solid-svg-icons'

import validator from 'validator'
import NoImage from '../public/no_image.jpg'
import Fireworks from '../components/Fireworks'
import ReactCanvasConfetti from 'react-canvas-confetti';

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

const canvasStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
}


export default function Confirmation() {
    const router = useRouter()
    //const { userId } = router.query
    //const [subtotal, setSubTotal] = useState(0)

    const { data, error } = useGetSales("13644")

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div>
            <div className="cart-container">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const{Card, Sale} = data;
    const {id, customerId, saleDate, salesTax, subTotal, total, shipping, orders} = Sale;
    const {brand,exp_month,exp_year, last4} = Card;


    console.log(data)
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

            </Navbar>

            <div className="confirmation-container">
                <h1>Order Placed!</h1>
                <h4>Your confirmation #{id}</h4>
                <h5>Thank You For Shopping at DataFlix!</h5>

                <hr></hr>

                <div className="confirmation-row">
                </div>
                <Fireworks></Fireworks>
            </div>
        </>
    );
}