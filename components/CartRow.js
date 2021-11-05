import { useRouter } from 'next/router'
import Image from 'next/image'
import NoImage from '../public/no_image.jpg'
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import {useState} from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Link from 'next/link'
import validator from 'validator'
import {formatRuntime,getUserId} from '../utils/helpers'
import useSWR, { mutate } from 'swr'
import {getBaseURL} from '../pages/api/Service'


import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

//https://egghead.io/lessons/react-optimistically-update-swr-s-cache-with-client-side-data
//https://stackoverflow.com/questions/64245201/revalidating-data-using-mutate-in-swr-which-should-i-use
export default function CartRow({content}) {
    const {id, userId, movieId, createdDate, price, quantity, movie} = content;
    const classes = useStyles();
    const [qty, setQty] = useState(quantity);
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const [alert, setAlert] = useState({
        type: 'success',
        message: 'Added to Cart!'
    });

    async function handleUpdate(event) {
        const name = event.target.name;
        const value = event.target.value;

        setQty(value);

        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: JSON.stringify({
                id: id, 
                userId:getUserId(),
                movieId:movieId, 
                qty: value })
        };
        const res = await fetch(getBaseURL() + '/cart/', requestOptions)
            //.then(response => response.json())
            //.then(data => console.log(data));
        if(res.status < 300) {
            await mutate('/cart/')
            await mutate('/checkout/')
            setAlert({
                type: 'success',
                message: 'Updated Cart'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});
        }
        else {
            setAlert({
                type: 'error',
                message: 'Unable to update Cart. Try again later.'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});
        }
    };

    async function handleRemove() {
        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: JSON.stringify({ id: id})
        };
        const res = await fetch(getBaseURL() + '/cart/', requestOptions)

        if(res.status < 300) {
            await mutate('/cart/')
            await mutate('/checkout/')
            setAlert({
                type: 'success',
                message: 'Removed from Cart'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});

        }
        else {
            setAlert({
                type: 'error',
                message: 'Unable to remove from Cart. Try again later.'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});
        }

    }

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    return (
        <>
            <div className="cart-content-row">
                <div className="cart-row-image">
                    <Image
                        src={movie.poster == null || !validator.isURL(movie.poster) ? NoImage:movie.poster}
                        layout='fill'
                        objectFit="fill"
                        alt="Not Found"
                    />
                </div>

                <div className="cart-column-1">
                    <h3 className="cart-row-title">
                        <Link href={"/movie/"+ movie.id} >
                            {movie.title}
                        </Link>
                    </h3>
                    <p className="cart-row-headline">
                        {movie.year} - {movie.rated} - {formatRuntime(movie.runtime)}
                    </p>

                </div>

                <div className="cart-qty">
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="qty-native">Qty</InputLabel>
                        <Select
                            native
                            value={qty}
                            onChange={handleUpdate}
                            inputProps={{
                                name: 'qty',
                                id: 'qty-native',
                            }}
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                        </Select>

                        <button onClick={handleRemove} className="remove-cart">Remove</button>
                    </FormControl>

                </div>

                <div className="cart-price">

                    <h4>${movie.price}</h4>

                </div>
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