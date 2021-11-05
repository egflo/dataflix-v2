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
import ReviewCard from "./ReviewCard";

const useStyles = makeStyles((theme) => ({

    orderRow: {
        display: 'grid',
        gridTemplateColumns: '115px 600px auto',
        //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        //marginTop: '20px',
    },

    orderImage: {
        position:'relative',
        width: '100%',
        height: '100%',
        '& > * > img' : {
            borderBottomLeftRadius: '5px',
            borderTopLeftRadius: '5px',

        }
    },

    orderInformation: {
      paddingRight: '10px',
      paddingLeft: '10px',
      '& > *': {
          marginBottom: '4px',
      },
    },

    orderButtons : {
        paddingTop: '18px',
    },

    buttonContainer: {
        position: 'relative',
        height: '40px',
        margin: '10px',
    },

}));

export default function OrderRowDetailed({content}) {

    const { id, orderId, movieId, quantity, listPrice} = content

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

            <div className={classes.orderInformation}>
                <h3 className="order-row-title">
                    <a href={"/movie/"+ movieId}>{title}</a>
                </h3>

                <p className="order-row-subheadline">
                    {year} - {rated} - {formatRuntime(runtime)}
                </p>

                <p className="order-row-sku">
                    <b>SKU: {movieId} </b>
                </p>

                <p className="order-row-qty">
                    <b>Qty: {quantity} </b>
                </p>

                <p className="order-row-price">
                    <b>Price: {formatCurrency(listPrice)} </b>
                </p>

                <div className="order-row-button">
                    <Button onClick= {handleBuyAgain} size="md">
                        <FontAwesomeIcon icon={faRedo} size="1x" /> Buy it Again
                    </Button>
                </div>
            </div>


            <div className={classes.orderButtons}>
                <div className={classes.buttonContainer}>
                    <Button className="btn-block" variant="primary" size="md">
                        Track Package
                    </Button>
                </div>

                <div className={classes.buttonContainer}>
                    <Button className="btn-block" variant="primary" size="md">
                        Return or replace items
                    </Button>
                </div>

                <div className={classes.buttonContainer}>
                    <ReviewCard id={movieId} button={true}/>
                </div>
            </div>

        </div>
    );
}
