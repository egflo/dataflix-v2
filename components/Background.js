import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@material-ui/lab/Rating';
import Image from 'next/image'
import {formatRuntime} from '../utils/helpers'
import { useRouter } from 'next/router'
import {useGetMovieId} from '../pages/api/Service'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    movieBackground: {
        transition: '0.3s',
        display: 'inline-block',
        '& > p' : {
          color: 'white',
          position: 'absolute',
          zIndex: 1,
          textShadow: '2px 2px black',
        },
    },

    backgroundHeadline: {
        top: '70%',
        marginLeft: '20px',
        fontSize: '50px',
    },

    backgroundSubheadline: {
        top: '84%',
        marginLeft: '20px',
        fontSize: '20px',
    },

}));

export default function Background({movieId}) {
    const router = useRouter();
    const classes = useStyles();
    const { data, error } = useGetMovieId(movieId);

    if (error) return <h1>{error.info.message}</h1>

    if (!data) return  <div className="loading-container"><CircularProgress/></div>

    const { id, title, year, runtime, rated, background } = data

    return (
        <div className={classes.movieBackground}>
            <Image
                src={background}
                width={1200}
                height={500}
                objectFit="cover"
                alt="Not Found"
            >
            </Image>

            <p className={classes.backgroundHeadline}>{title}</p>
            <p className={classes.backgroundSubheadline}>{year} - {rated} - {formatRuntime(runtime)}</p>
        </div>

    );
}