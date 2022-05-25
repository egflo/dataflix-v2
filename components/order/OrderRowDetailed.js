import { useRouter } from 'next/router'
import Image from 'next/image'
import NoImage from '../../public/NOIMAGE.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';
import {formatRuntime,formatCurrency} from '../../utils/helpers'
import validator from 'validator'
import { makeStyles } from '@material-ui/core/styles';
import ReviewCard from "../review/ReviewCard";

const useStyles = makeStyles((theme) => ({
    orderRow: {
        display: 'grid',
        borderRadius: '5px',

        [theme.breakpoints.down('sm')]: {
            //border: '1px solid #e0e0e0',
            gridTemplateColumns: '25vw auto',
            backgroundColor: '#fafafa',
            marginBottom: '1rem',
        },

        [theme.breakpoints.up('md')]: {
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            gridTemplateColumns: '10rem 35rem auto',
            marginBottom: '2vh',
        },
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
      paddingRight: '1rem',
      paddingLeft: '1rem',
      '& > *': {
          margin: '0px',
          marginBottom: '0.1rem',
          textAlign: 'left',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '68vw',
      },
    },

    orderButtons : {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },

        [theme.breakpoints.up('md')]: {
            paddingTop: '18px',

        },
    },

    buttonContainer: {
        position: 'relative',
        height: '2.5rem',
        margin: '0.8rem',
    },

}));

export default function OrderRowDetailed(props) {
    const { id, orderId, movieId, quantity, listPrice, movie} = props.content;

    const router = useRouter();
    const classes = useStyles();


    function handleBuyAgain() {
        router.push({
            pathname: '/movie/' + movieId,
        })
    }

    return (
        <div className={classes.orderRow}>
            <div className={classes.orderImage}>
                <Image
                    src={movie.poster == null || !validator.isURL(movie.poster) ? NoImage:movie.poster}
                    layout='fill'
                    objectFit="fill"
                    alt="Not Found"
                />
            </div>

            <div className={classes.orderInformation}>
                <h4 className="order-row-title">
                    <a href={"/movie/"+ movieId}>{movie.title}</a>
                </h4>

                <p className="order-row-subheadline">
                    {movie.year} - {movie.rated} - {formatRuntime(movie.runtime)}
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
                        Contact Support
                    </Button>
                </div>

                <div className={classes.buttonContainer}>
                    <ReviewCard {...props} id={movieId} button={true}/>
                </div>
            </div>

        </div>
    );
}
