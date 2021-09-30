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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },

    reviewCard: {
        minWidth: '385px',
        height: '280px',
        margin: '5px',
        borderRadius: '5px',
        border: '2px solid white',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        '&:hover': {
            border: '2px solid dodgerblue',
        },
    },

}));

export default function OrderRowDetailed({content}) {

    const { id, orderId, movieId, quantity, listPrice} = content

    const router = useRouter()
    var { data, error } = useGetMovieId(movieId)

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
        <div className="order-view-content-row">
            <div className="order-view-row-image">
                <Image
                    src={poster == null || !validator.isURL(poster) ? NoImage:poster}
                    layout='fill'
                    objectFit="fill"
                    alt="Not Found"
                />
            </div>

            <div className="order-column-1">
                <h3 className="order-row-title">
                    <a href={"/movie/"+ movieId}>{title}</a>
                </h3>

                <p className="order-row-headline">
                    {year} - {rated} - {formatRuntime(runtime)}
                </p>

                <p className="order-row-headline1">
                    <b>SKU: {movieId} </b>
                </p>

                <p className="order-row-headline2">
                    <b>Qty: {quantity} </b>
                </p>

                <p className="order-row-headline3">
                    <b>Price: {formatCurrency(listPrice)} </b>
                </p>

                <div className="order-row-headline4">
                    <Button onClick= {handleBuyAgain} size="md">
                        <FontAwesomeIcon icon={faRedo} size="1x" /> Buy it Again
                    </Button>
                </div>
            </div>


            <div className="order-buttons">
                <Button className="btn-block" variant="primary" size="md">
                    Track Package
                </Button>
                <Button className="btn-block" variant="primary" size="md">
                    Return or replace items
                </Button>
                <Button className="btn-block" variant="primary" size="md">
                    Write a Review
                </Button>
            </div>

        </div>
    );
}
