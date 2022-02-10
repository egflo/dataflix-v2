import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import {useGetCast} from '../../service/Service'
import Filmography from '../../components/cast/Filmography'
import Image from 'next/image'
import CircularProgress from '@material-ui/core/CircularProgress';
import NoImage from '../../public/NOIMAGE.png'
import validator from 'validator'
import Navigation from '../../components/nav/Navbar'
import { makeStyles } from '@material-ui/core/styles';
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import NoBackground from "../../public/BACKGROUND.png";
import Movie from "../movie/[movieId]";
import {DashboardLayout} from "../../components/nav/DashboardLayout";


const useStyles = makeStyles((theme) => ({

    castContainer: {

        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            transition: '0.3s',
            paddingTop: '10px',
            width: '100%',
        },

        [theme.breakpoints.up('md')]: {
            minWidth: '850px',
            maxWidth: '850px',
            display: 'grid',
            gridTemplateRows: '440px auto',
            margin: '20px auto',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            transition: '0.3s',
            borderRadius: '5px',
        },
    },

    cast: {
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },

        [theme.breakpoints.up('md')]: {
            display: 'grid',
            gridTemplateColumns: '300px auto',
            padding: '25px',
        },
    },

    films: {
        display: 'grid',
        gridTemplateRows: '50px auto',
    },

    castInformation: {
        display: 'grid',
        gridTemplateRows: '50px 30px auto',
        padding: '15px',

        [theme.breakpoints.up('md')]: {
            gridTemplateRows: '50px 30px 300px',
            paddingLeft: '10px',
        }
    },

    castImage: {

        [theme.breakpoints.down('sm')]: {
            width: '250px',
            height: '300px',
            position: 'relative',
            '& > * > img': {
                borderRadius: '5px',

            },
        },

        [theme.breakpoints.up('md')]: {
            width: '100%',
            height: '100%',
            position: 'relative',
            '& > * > img': {
                borderRadius: '5px',

            },
        },
    },

    castTitle: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '95%',
        margin: '0',

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
    },

    castSubheadline: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '95%',
        margin: '0',

        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
    },

    castBody: {
        textOverflow: 'ellipsis',
        overflow: 'auto',
        margin: '0',

        [theme.breakpoints.down('sm')]: {
            height: '200px',
        },
    },

}));

 function Cast(props) {
    const router = useRouter();
    const classes = useStyles();
    const { castId } = router.query;

    const { data, error } = useGetCast(castId);

    if (error) return(
        <>
            <div className={classes.castContainer}>
                <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                <h2>Unable to load cast information.</h2>
            </div>
        </>
    );

    if (!data) return(
        <>
            <div className={classes.castContainer}>
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </>
    );

    const { starId, name, birthYear, photo, bio, birthName, birthDetails, dob, place_of_birth, dod, movies} = data

    return (
        <>
            <div className={classes.castContainer}>
                <div className={classes.cast}>
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

                <div className={classes.films}>
                    <div className="bar">
                        <h4 style={{padding:10}}>Filmography</h4>
                    </div>

                    <Filmography {...props} id={starId}> </Filmography>
                </div>
            </div>
        </>
    );
}

Cast.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Cast;