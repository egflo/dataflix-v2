import { useRouter } from 'next/router'
import {useGetMovieId} from '../pages/api/Service'
import Image from 'next/image'
import CircularProgress from '@material-ui/core/CircularProgress'
import NoImage from '../public/no_image.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';
import {formatRuntime,formatCurrency} from '../utils/helpers'
import validator from 'validator'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({

    orderRow: {
        height: '180px',
        display: 'grid',
        gridTemplateColumns: '120px auto',
        marginBottom: '10px',
    },

    orderImage: {
        position: 'relative',

    },

    orderContent: {
        paddingLeft: '10px',
        '& > *': {
            margin: '0',
            textAlign: 'left',
        },
    },

}));

export default function OrderRow({content}) {

    const { id, orderId, movieId, quantity, listPrice} = content;

    const router = useRouter();
    const classes = useStyles();
    var { data, error } = useGetMovieId(movieId);

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div className="movie_card">
            <div className="loading-container"><CircularProgress/></div>
        </div>
    );

    const { title, poster, rated, runtime, year } = data

    
    function handleBuyAgain() {
        router.push({
            pathname: '/movie/' + movieId,
        })
    }

    return (
        <div className={classes.orderRow}>
            <div className={classes.orderImage}>
                <Image
                    src={poster == null || !validator.isURL(poster) ? NoImage:poster}
                    layout='fill'
                    objectFit="fill"
                    alt="Not Found"
                />
            </div>

            <div className={classes.orderContent}>
                <h3 className="order-row-title">
                    <a href={"/movie/"+movieId}>{title}</a>
                </h3>

                <p className="order-row-headline">
                    {year} - {rated} - {formatRuntime(runtime)}
                </p>

                <p className="order-row-headline1">
                    <b>Qty: {quantity} </b>
                </p>

                <p className="order-row-headline2">
                    <b>Price: {formatCurrency(listPrice)} </b>
                </p>

                <p className="order-row-headline3">
                    <b>SKU: {movieId} </b>
                </p>

                <div className="order-row-headline4">
                    <Button onClick= {handleBuyAgain} size="md">
                        <FontAwesomeIcon icon={faRedo} size="1x" /> Buy it Again
                    </Button>
                </div>
            </div>

        </div>
    );
}
