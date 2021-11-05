import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter } from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress';
import CartRow from'../components/CartRow'
import {useGetUserCart} from '../pages/api/Service'
import { Button } from 'react-bootstrap';
import  {formatCurrency} from '../utils/helpers'
import Navigation from '../components/Navbar'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    cartContainer: {
        minWidth: '800px',
        maxWidth: '800px',
        margin: '50px auto 0',
    },
}));

export default function Cart() {

    const router = useRouter();
    const classes = useStyles();
    const { data, error } = useGetUserCart("");

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div className={classes.cartContainer}>
            <div className="loading-container"><CircularProgress/></div>
        </div>
    );

    function calcSubtotal() {
        return data.map(li => li.quantity * li.movie.price).reduce((sum, val) => sum + val, 0)
    }

    function handleClick() {
        router.push({
            pathname: '/checkout',
        })
    }

    return (
        <>
            <Navigation />
            <div className={classes.cartContainer}>
                <h1>My Cart</h1>
                <h4>Subtotal: {formatCurrency(calcSubtotal())}</h4>
                {data.map(cartItem => (
                    <CartRow key={cartItem.id} content={cartItem}></CartRow>
                ))}

                    <Button onClick={handleClick} className="btn-block" variant="primary" size="lg">
                        Checkout
                    </Button>


            </div>
        </>
    );
}