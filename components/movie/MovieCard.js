
import { useRouter } from 'next/router'
import {useGetMovieId} from '../../service/Service'
import Image from 'next/image'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'
import { faStar} from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import React from "react";
import NoImage from "../../public/NOIMAGE.png";
import validator from 'validator'

const useStyles = makeStyles((theme) => ({
    card: {
        boxShadow: ' 0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        borderRadius: '5px',

        minWidth: '220px',
        maxWidth: '220px',
        //height: '450px',
        margin: '10px',
        '&:hover': {
            backgroundColor: '#fafafa'
        },
    },

    cardStatus: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: ' 0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        borderRadius: '5px',
        marginRight: '15px',
        minWidth: '220px',
        maxWidth: '220px',
        height: '480px',
    },

    cardImage: {
        overflow: 'hidden',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',

    },

    cardRating: {
        width: '95%',
        margin: '5px 5px 5px 5px',
        height: '20px',
        color: 'gold',
        display: 'inline-block',
    },

    cardTitle: {
        //height: '50px',
        padding: '10px',
        //width: '95%',
        //margin: '5px 5px 5px 5px',
        textAlign: 'left',
        fontSize: '15px',
        //display: 'flex',
        //justifyContent: 'center',
       // alignItems: 'center',
    },

    cardButton: {
        height: '50px',
        width: '95%',
        margin: '5px 5px 5px 5px',
    }
}));


export default function MovieCard({ meta }) {
    const router = useRouter();
    const classes = useStyles();
    const {data, error} = useGetMovieId(meta['movieId']);

    if (error) return (
        <div className={classes.cardStatus}>
            <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
        </div>
    );

    if (!data) return(
        <div className={classes.cardStatus}>
            <div className="loading-container"><CircularProgress/></div>
        </div>
    );

    const { title, plot, id, poster, rated, runtime, year, ratings } = data;
    
    function handleClick() {
        router.push({
            pathname: '/movie/[movieId]',
            query: {movieId: id},
        });
    }

    return (
        <div className={classes.card} onClick={handleClick}>
            <div className={classes.cardImage}>
                <Image
                    src={poster == null || !validator.isURL(poster) ? NoImage : poster}
                    width={220}
                    height={330}
                    alt="Not Found"
                >
                </Image>
            </div>

            <div className={classes.cardRating}>
                <FontAwesomeIcon icon={faStar} size="1x"/>
                <b style={{color: 'grey', paddingLeft:'5px'}}>{ratings.rating}</b>
            </div>

            <p className={classes.cardTitle}
               style={{
                   display: '-webkit-box',
                   WebkitBoxOrient: 'vertical',
                   WebkitLineClamp: '2',
                   textOverflow: 'ellipsis',
                   overflow: 'hidden',
                   fontSize: '17px',
                   fontWeight: 'bold',
               }}
            >
                {title}
            </p>

            {/* A JSX comment

                        <div className={classes.cardButton }>
                <Button onClick={handleClick} className="btn-block" >
                    View Details
                </Button>
            </div>

            <p className="card-body">
                {year} - {rated} - {runtime}
            </p>

            */}

        </div>
    );
}