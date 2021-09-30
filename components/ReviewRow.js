import { useRouter } from 'next/router'
import {useGetMovieReviews} from '../pages/api/Service'
import ReviewCard from '../components/ReviewCard'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    reviewContainer: {
        width: '800px',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        marginLeft: '5px',
    },

    reviewAlert: {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        borderRadius: '5px',
        width: '98%',
        height: '98%',
        margin: '0 auto',
        '& > *': {
            textAlign: 'center',
            color: 'lightgray',
            paddingTop: '18%',

        },
    },

}));

export default function ReviewRow({id}) {

    const router = useRouter();
    const classes = useStyles();
    const { data, error } = useGetMovieReviews(id);

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return (
        <div className="review-container">
            <div className="loading-container"><CircularProgress/></div>
        </div>
    );

    function Reviews() {
        const length = data.content.length

        if(length > 0) {
            return (
                <div className={classes.reviewContainer}>
                    {data.content.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            );
        }
        else {

            return (
                <div className={classes.reviewAlert}>
                    <h3>No Reviews Posted For This Film</h3>
                </div>
            );
        }
    }

    return <Reviews></Reviews>
}