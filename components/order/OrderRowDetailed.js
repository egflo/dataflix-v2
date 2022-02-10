import { useRouter } from 'next/router'
import {useGetMovieId} from '../../service/Service'
import Image from 'next/image'
import CircularProgress from '@material-ui/core/CircularProgress'
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
        //marginTop: '20px',

        [theme.breakpoints.down('sm')]: {
            //border: '1px solid #e0e0e0',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            gridTemplateColumns: '115px auto',
            margin: '5px',
        },

        [theme.breakpoints.up('md')]: {
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            gridTemplateColumns: '115px 600px auto',
            marginBottom: '20px',

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
      paddingRight: '10px',
      paddingLeft: '10px',
      '& > *': {
          margin: '0px',
          marginBottom: '4px',
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
        height: '40px',
        margin: '10px',
    },

}));

export default function OrderRowDetailed(props) {

    const { id, orderId, movieId, quantity, listPrice} = props.content;

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
