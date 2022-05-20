
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
        marginRight: '1rem',

        [theme.breakpoints.down('sm')]: {
            display:'grid',
            gridTemplateRows: '70% 10% auto',
            height: '18rem',
            minWidth: '10rem',
        },

        [theme.breakpoints.up('md')]: {
            display:'grid',
            gridTemplateRows: '70% 10% auto',
            height: '25rem',
            minWidth: '12rem',
            '&:hover': {
                backgroundColor: '#fafafa'
            },
        },
    },

    content: {
        padding: '0.4rem',
    },

    cardImage: {
        overflow: 'hidden',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        position: 'relative',
        width: '100%',
        height: '100%',
    },

    cardRating: {
        height: '20px',
        color: 'gold',
        display: 'inline-block',
    },

    cardTitle: {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: '2',
        textOverflow: 'ellipsis',
        overflow: 'hidden',

        [theme.breakpoints.down('sm')]: {
            fontSize: '1rem',
            fontWeight: 'bold',
        },

        [theme.breakpoints.up('md')]: {
            fontSize: '1.3rem',
            fontWeight: 'bold',
        }
    },

    cardButton: {
        height: '50px',
        width: '95%',
        margin: '5px 5px 5px 5px',
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

}));


export default function MovieCard({ meta }) {
    const router = useRouter();
    const classes = useStyles();

    const { title, plot, id, poster, rated, runtime, year, ratings } = meta.movie;

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
                    alt="Not Found"
                    layout={'fill'}
                >
                </Image>
            </div>

            <div className={classes.content}>
                <div className={classes.cardRating}>
                    <FontAwesomeIcon icon={faStar} size="1x"/>
                    <b style={{color: 'grey', paddingLeft:'5px'}}>{ratings.imdb}</b>
                </div>

                <p className={classes.cardTitle}>
                    {title}
                </p>
            </div>


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