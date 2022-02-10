import { useRouter } from 'next/router'
import {useGetMovieReviews} from '../../service/Service'
import Review from './Review'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

    container: {
        [theme.breakpoints.down('sm')]: {
            width: '100vw',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '5px',

        },

        [theme.breakpoints.up('md')]: {
            width: '800px',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            //marginLeft: '5px',
        },
    },

    reviewAlert: {
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        borderRadius: '5px',


        [theme.breakpoints.down('sm')]: {
            width: '100vw',
            height: '280px',
            margin: '0 auto',
            '& > *': {
                textAlign: 'center',
                color: 'lightgray',
                paddingTop: '18%',

            },

        },

        [theme.breakpoints.up('md')]: {
            width: '98%',
            height: '98%',
            margin: '0 auto',
            '& > *': {
                textAlign: 'center',
                color: 'lightgray',
                paddingTop: '18%',

            },
        },
    },

}));

export default function ReviewRow({id}) {
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
                <div className={classes.container}>
                    {data.content.map(review => (
                        <Review key={review.id} review={review} />
                    ))}
                </div>
            );
        }
        else {

            return (
                <></>
            );
        }
    }

    return <Reviews></Reviews>
}