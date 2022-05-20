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


const useStyles = makeStyles((theme) => ({

    orderRow: {
        height: '180px',
        display: 'grid',
        gridTemplateColumns: '120px auto',
        marginBottom: '0.5rem',
        marginLeft: '0.5rem',
        marginRight: '0.5rem',

    },

    orderImage: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '5px',
        width: '100%',
        height: '100%',
    },

    orderContentRow: {
        margin: '0',
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },

    orderContent: {
        paddingLeft: '0.5rem',
        '& > *': {
            margin: '0px',
            marginBottom: '0.1rem',
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '65vw',
        },

    },

}));

export default function OrderRow({content}) {

    const { id, orderId, movieId, quantity, listPrice, movie} = content;

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

            <div className={classes.orderContent}>
                <h3>
                    <a href={"/movie/"+movieId}>{movie.title}</a>
                </h3>

                <p className={classes.orderContentRow}>
                    {movie.year} - {movie.rated} - {formatRuntime(movie.runtime)}
                </p>

                <p className={classes.orderContentRow}>
                    <b>Qty: {quantity} </b>
                </p>

                <p className={classes.orderContentRow}>
                    <b>Price: {formatCurrency(listPrice)} </b>
                </p>

                <p className={classes.orderContentRow}>
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
