import { useRouter } from 'next/router'
import Image from 'next/image'
import NoImage from '../../public/NOIMAGE.png'
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import {useState} from 'react'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Link from 'next/link'
import validator from 'validator'
import {formatRuntime,getUserId} from '../../utils/helpers'
import useSWR, { mutate } from 'swr'
import {axiosInstance} from "../../service/Service.js";


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

    container: {
        transition: 'all 0.3s ease-in-out',

        [theme.breakpoints.down('sm')]: {
            width: '100vw',
            height: '200px',
            display: 'grid',
            gridTemplateColumns: '140px auto',
            marginBottom: '10px',
        },

        [theme.breakpoints.up('md')]: {
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',

            borderRadius: '5px',
            height: '130px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '90px 500px 80px auto',
            marginBottom: '10px',
        },
    },

    image: {
        position: 'relative',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '200px',

            '& > *': {
                borderRadius: '5px',
            },

            '&:hover': {
                cursor: 'pointer',
            },

            gridColumn: '1',
        },

        [theme.breakpoints.up('md')]: {
            width: '100%',
            height: '100%',

            '& > *': {
                borderTopLeftRadius: '5px',
                borderBottomLeftRadius: '5px',
            },

            '&:hover': {
                cursor: 'pointer',
            },
        },
    },

    content: {

        [theme.breakpoints.up('md')]: {
            paddingLeft: '10px',
            paddingTop: '10px',
        },

        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },

    contentMobile: {

        [theme.breakpoints.up('md')]: {
            display: 'none',

        },

        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateRows: '35px 25px 35px',
            width: '100%',
            padding: '10px',
        },

    },

    qty: {

        [theme.breakpoints.up('md')]: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },

        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },

    },

    qtyMobile: {

        [theme.breakpoints.up('md')]: {
            display: 'none',

        },

        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            alignItems: 'center',
            "& > *": {
                marginRight: '10px',
            },
        },

    },

    price: {

        [theme.breakpoints.up('md')]: {
            display:'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },

        [theme.breakpoints.down('sm')]: {
            display: 'none',

        },
    },

    remove: {

        textDecoration: 'none',
        background: "none",
        border: "none",

        [theme.breakpoints.up('md')]: {
            padding: "0",
            cursor: 'pointer',
            fontFamily: 'arial, sans-serif',
            color: "#069",
        },

        [theme.breakpoints.down('sm')]: {
            background: 'dodgerblue',
            borderRadius: '5px',
            color: 'white',
            padding: '5px',
            marginLeft: '20px',

        },
    },

}));

//https://egghead.io/lessons/react-optimistically-update-swr-s-cache-with-client-side-data
//https://stackoverflow.com/questions/64245201/revalidating-data-using-mutate-in-swr-which-should-i-use
export default function CartRow(props) {
    const {id, userId, movieId, createdDate, price, quantity, movie} = props.content;
    const classes = useStyles();
    const [qty, setQty] = useState(quantity);

    async function handleUpdate(event) {
        const name = event.target.name;
        const value = event.target.value;

        setQty(value);

        axiosInstance.post('/cart/', {
            id: id,
            userId:userId,
            movieId:movieId,
            qty: value
        }).then(response => {
            if (response.status === 200) {
                mutate('/cart/')
                mutate('/checkout/')
                props.setalert({
                    open: true,
                    type: 'success',
                    message: 'Cart updated successfully'
                })
            }

        }).catch(error => {

            if (error.response.data !== undefined) {
                props.setalert({
                    open: true,
                    type: 'error',
                    message: error.response.data.message
                })
            }
            else {
                props.setalert({
                    open: true,
                    type: 'error',
                    message: error.message
                })
            }
        });

    };

    async function handleRemove() {

        axiosInstance.delete('/cart/' + id).then(response => {
            if (response.status === 200) {
                mutate('/cart/')
                mutate('/checkout/')
                props.setalert({
                    open: true,
                    type: 'success',
                    message: 'Item removed from Cart'
                })
            }

        }).catch(error => {
            props.setalert({
                open: true,
                type: 'error',
                message: error.message
            })
        });

    }

    return (
        <>
            <div className={classes.container}>
                <div className={classes.image}>
                    <Image
                        src={movie.poster == null || !validator.isURL(movie.poster) ? NoImage:movie.poster}
                        layout='fill'
                        objectFit="fill"
                        alt="Not Found"
                    />
                </div>

                <div className={classes.content}>
                    <h3 className="title">
                        <Link href={"/movie/"+ movie.id} >
                            {movie.title}
                        </Link>
                    </h3>
                    <p className="subheadline">
                        {movie.year} - {movie.rated} - {formatRuntime(movie.runtime)}
                    </p>
                </div>

                <div className={classes.contentMobile}>
                    <h3 className="title">
                        <Link href={"/movie/"+ movie.id} >
                            {movie.title}
                        </Link>
                    </h3>
                    <p className="subheadline">
                        {movie.year} - {movie.rated} - {formatRuntime(movie.runtime)}
                    </p>

                    <h4>${movie.price}</h4>

                    <div className={classes.qtyMobile}>
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

                        </FormControl>

                        <button onClick={handleRemove} className={classes.remove}>Remove</button>

                    </div>

                </div>

                <div className={classes.qty}>
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

                        <button onClick={handleRemove} className={classes.remove}>Remove</button>
                    </FormControl>
                </div>

                <div className={classes.price}>

                    <h4>${movie.price}</h4>

                </div>
            </div>
        </>

    );

}