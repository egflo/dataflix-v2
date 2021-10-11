import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import {useGetCast} from '../api/Service'
import ResultRow from '../../components/ResultRow'
import {useGetFilmography} from '../api/Service'
import Filmography from '../../components/Filmography'
import Image from 'next/image'
import CircularProgress from '@material-ui/core/CircularProgress';
import NoImage from '../../public/no_image.jpg'
import validator from 'validator'
import Navigation from '../../components/Navbar'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({

    castContainer: {
        minWidth: '850px',
        maxWidth: '850px',
        display: 'grid',
        gridTemplateRows: '380px auto',
        margin: '20px auto',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        borderRadius: '5px',
    },

    castRow1: {
        display: 'grid',
        gridTemplateColumns: '300px auto',
        padding: '25px',
    },

    castRow2: {
        paddingTop: '20px',
    },

    castInformation: {
        display: 'grid',
        gridTemplateRows: '50px 30px 300px',
        paddingLeft: '10px',
    },

    castImage: {
        width: '100%',
        height: '100%',
        position: 'relative',
        '& > * > img': {
            borderRadius: '5px',

        }
    },

    castTitle: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '95%',
        margin: '0',
    },

    castSubheadline: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '95%',
        margin: '0',
    },

    castBody: {
        textOverflow: 'ellipsis',
        overflow: 'auto',
        margin: '0',
    },

}));

export default function Cast() {

    const router = useRouter();
    const classes = useStyles();
    const { castId } = router.query;

    const { data, error } = useGetCast(castId);

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div>
            <div className={classes.castContainer}>
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const { starId, name, birthYear, photo, bio, birthName, birthDetails, dob, place_of_birth, dod, movies} = data

    return (
        <>
            <Navigation/>
            
            <div className={classes.castContainer}>
                <div className={classes.castRow1}>
                    <div className={classes.castImage}>
                        <Image
                            src={photo == null || !validator.isURL(photo) ? NoImage:photo}
                            layout='fill'
                            objectFit="cover"
                            alt="Not Found"
                        >
                        </Image>
                    </div>

                    <div className={classes.castInformation}>
                        <h2 className={classes.castTitle}>
                            {name}  <small>{(birthYear == null || birthYear.length < 4) ? '' : '(' + birthYear + ')'}</small>
                        </h2>

                        <p className={classes.castSubheadline}>
                            {(birthDetails == null || birthDetails.length == 0) ? 'No information avaliable for ' + name : 'Born ' + birthDetails}
                        </p>

                        <p className={classes.castBody}>
                            {bio}
                        </p>

                    </div>
                </div>

                <div className={classes.castRow2}>
                    <Filmography id={starId}> </Filmography>
                </div>
            </div>


        </>

    );
}