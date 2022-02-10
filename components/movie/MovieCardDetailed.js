
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import Image from 'next/image'
import { useRouter } from 'next/router'
import  React, {useRef, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating'
import Button from 'react-bootstrap/Button'
import NoImage from '../../public/NOIMAGE.png'
import {formatRuntime, numFormatter, getUserId, formatCurrency} from '../../utils/helpers'
import validator from 'validator'
import Bookmark from '../../components/movie/Bookmark'
import ReviewCard from '../../components/review/ReviewCard'
import NoBackground from '/public/BACKGROUND.png'
import { SeverityPill } from '/components/severity-pill'
import CriticsRow from "../../components/movie/CrticsRow";
import {Box} from "@mui/material";

const useStyles = makeStyles((theme) => ({
    background: {
        position: 'relative',
        height: '100%',
        width: '100%',

        //filter: 'blur(5px)',
        webkitFilter: 'blur(5px)',
        backdropFilter: 'blur(5px)',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '15px',

        },

        [theme.breakpoints.up('md')]: {
            '& > * > img': {
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
            },
        },
    },

    box: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    poster: {
        [theme.breakpoints.down('sm')]: {
            position: 'relative',
            height: '300px',
            width: '170px',
            '& > *': {
                borderRadius:'5px',
            },
        },

        [theme.breakpoints.up('md')]: {
            position: 'relative',
            height: '300px',
            width: '170px',
            //top: '30px',
            //left: '50px',
            '& > *': {
                borderRadius:'5px',
            },
        },
    },

    content: {

        height: '100%',

        [theme.breakpoints.down('sm')]: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
                margin: 0,
                color: 'white',
                textShadow: ' 1px 2px black',
            }
        },

        [theme.breakpoints.up('md')]: {
            zIndex: '1',
            //position: 'absolute',
            width: '525px',
            //top: '25px',
            //left: '225px',
            paddingLeft: '10px',
            '& > *': {
                margin: 0,
                color: 'white',
                textShadow: ' 1px 2px black',
            }
        },
    },

    starRating: {
        display: 'flex',
        alignItems: 'center',
        "& p": {
            margin: '0',
        },
    },

    title: {

        [theme.breakpoints.down('sm')]: {
            //fontSize: '25px',
            fontWeight: 'bold',
            textAlign: 'center',
            //margin: '0',
            //            margin: '10px',
            //textShadow: ' 1px 2px black',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },

        [theme.breakpoints.up('md')]: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        },
    },

    plot: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
        webkitLineClamp: 4, /* number of lines to show */
        lineClamp: 4,
        webkitBoxOrient: 'vertical',
        maxHeight: '100px',
        lineHeight: '1.5em',

        [theme.breakpoints.down('sm')]: {
            padding: '5px 0px 5px 0px;',
            width: '100%',
        },
    },

    backdrop: {
        position: 'relative',
        height: '100%',
        width: '100%',
        padding: '15px',
        zIndex: 1,
        '& > * > img': {
            filter: 'blur(5px)',
            webkitFilter: 'blur(5px)',
        }
    },

}));


export default function MovieCardDetailed(props) {
    const router = useRouter();
    const classes = useStyles();

    const { title, plot, id, poster, rated, runtime, year, ratings, inventory, genres, background} = props.content;

    function handleClick() {
        router.push({
            pathname: '/movie/[movieId]',
            query: {movieId: id},
        });
    }

    function handleGenreClick(event) {
        const genre_name = event.target.innerText

        router.push({
            pathname: '/results/[term]',
            query: {type: "genre", term: genre_name},
        })
    }

    function RatingRow() {
        let numVotes = 0;
        let rating = 0;

        try {
            numVotes = ratings['numVotes'];
            rating = ratings['rating'];
        }
        catch(err) {
            console.log(err)
        }

        return (
            <div className={classes.starRating}>
                <Rating
                    name="read-only"
                    value={rating * .5}
                    precision={0.5}
                    size="large"
                    readOnly />
                <p><b> ({numFormatter(numVotes)})</b></p>

            </div>
        );
    }

    return (
        <div className={classes.background} >
            <Image
                onClick={handleClick}
                src={background == null || !validator.isURL(background) ? NoBackground : background}
                layout='fill'
                objectFit="cover"
                alt="Not Found"
                placeholder="blur"
                blurDataURL= {background == null || !validator.isURL(background) ? NoBackground : background}
            >
            </Image>

            <div className={classes.box}>
                <div className={classes.poster}>
                    <Image
                        onClick={handleClick}
                        src={poster == null || !validator.isURL(poster) ? NoImage : poster}
                        alt="Not Found"
                        width={170}
                        height={260}
                    >
                    </Image>

                    <div style={{display:'flex',alignItems:'center',justifyContent:'center', height:'40px', backgroundColor:'rgba(60, 60, 60, 0.8)', paddingLeft: '20px'}}>
                        <Bookmark {...props} id={id} button={false}></Bookmark>
                        <ReviewCard {...props} id={id} button={false}></ReviewCard>
                    </div>
                </div>

                <div className={classes.content}>
                    <div className="parent" style={{ width: "100%", height: "50px" }}>
                        <h1 className={classes.title}>
                            {title}
                        </h1>
                    </div>

                    <SeverityPill
                        color={(inventory.status === 'in stock' && 'success')
                            || (inventory.status === 'out of stock' && 'error')
                            || 'warning'}
                    >
                        {inventory.status}
                    </SeverityPill>

                    <p style={{fontWeight:'bold'}}> {year} - {rated} - {formatRuntime(runtime)}</p>

                    <RatingRow></RatingRow>

                    <p className={classes.plot} style={{fontWeight:'bold'}}>
                        {plot}
                    </p>

                    <CriticsRow data={props.content}></CriticsRow>

                    <div className="genre-container">
                        {genres.map(genre => (
                            <Button key={genre.id} onClick={handleGenreClick} id={genre.name} className="btn btn-default ">
                                <h5>{genre.name}</h5>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}