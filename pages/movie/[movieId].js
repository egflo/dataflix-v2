
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import Image from 'next/image'
import { useRouter } from 'next/router'
import  React, {useRef, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import IconButton from '@material-ui/core/IconButton';

import CircularProgress from '@material-ui/core/CircularProgress'
import Rating from '@material-ui/lab/Rating'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Overlay from 'react-bootstrap/Overlay'
import Button from 'react-bootstrap/Button'
import NoImage from '../../public/no_image.jpg'
import NoBackground from '../../public/movie_background.png'


import {useGetMovieId} from '../api/Service'
import CastRow from '../../components/CastRow'
import ReviewRow from '../../components/ReviewRow'
import {formatRuntime, numFormatter, getUserId, formatCurrency} from '../../utils/helpers'
import validator from 'validator'
import Navigation from '../../components/Navbar'
import Bookmark from '../../components/Bookmark'
import useSWR, { mutate } from 'swr'


const useStyles = makeStyles((theme) => ({
    starRating: {
        display: 'flex',
        alignItems: 'center',
        "& p": {
            margin: '0',
        },
    },

    rottenTomatoes: {
        display: 'grid',
        gridTemplateColumns: '25% 20% 25% 20%',
        height: '40px',
        width: '195px',
    },

    rottenImages: {
        position: 'relative',
        height: '80%',
        width: '70%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },

    rottenText: {
        fontSize: '20px',
        margin: '0 auto',
        marginTop: '5px',
    },

    metacritic: {
        display: 'grid',
        gridTemplateColumns: '60% 40%',
        height: '40px',
        width: '80px',
    },

    metacriticImage: {
        position: 'relative',
        height: '75%',
        width: '80%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },

    metacriticText: {
        fontSize: '22px',
        margin: '0 auto',
        marginTop: '2px',
    },

    imdb: {
        display: 'grid',
        gridTemplateColumns: '60% 40%',
        height: '100%',
        width: '120px',
        border: '2px solid #F0C514',
        borderRadius: '5px',
    },

    imdbImage: {
        position: 'relative',
        height: '100%'

    },

    imdbText: {
        "& span": {
            color: 'grey',
            fontSize: '10px',
        },
        fontSize: '15px',
        margin: '0 auto',
    },

    title: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },

    background: {
        position: 'relative',
        height: '100%',
        width: '100%',
        '& > * > img': {
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            filter: 'blur(5px)',
            webkitFilter: 'blur(5px)',
        }
    },

    backgroundPoster: {
        position: 'absolute',
        height: '260px',
        width: '170px',
        top: '65px',
        left: '50px',
        zIndex: 99,
    },

    backgroundContent: {
        position: 'absolute',
        width: '525px',
        top: '58px',
        left: '225px',
        zIndex: 99,
        paddingLeft: '5px',
        '& > *': {
            margin: 0,
            color: 'white',
            textShadow: ' 1px 2px black',
        }
    },

    
}));


//https://medium.com/geekculture/how-to-use-react-router-useparams-436851fd5ef6
export default function Movie() {
    const router = useRouter()
    const classes = useStyles();

    const { movieId } = router.query

    const ref = useRef(null);
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const [alert, setAlert] = useState({
        type: 'success',
        message: 'Added to Cart!'
    });

    const { data, error } = useGetMovieId(movieId)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return (
        <div>
            <div className="movie-container">
                    <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const { id, title, year, director, poster, plot, runtime, language, background, rated, cast, ratings, genres, writer, production, price } = data

    function RatingRow() {
        var numVotes = 0;
        var rating = 0;

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

    function IMDB () {
        var rating = ratings['imdb'];

        if(rating != null) {
            const split = rating.split("/")
            rating = split[0]
        }

        else {
            rating = "N/A"
        }

        return (
            <div className="imdb-container">
                <div className={classes.imdb}>
                    <div className={classes.imdbImage}>
                        <Image
                            src="/imdb.png"
                            layout='fill'
                            objectFit="fit"
                            alt="Not Found"
                        ></Image>
                    </div>

                    <p className={classes.imdbText}>
                        <b>{rating}</b>
                        <span>/10</span>
                    </p>
                </div>
            </div>
        );
    }

    function RottenTomatoes () {
        var rottenTomatoes = ratings['rottenTomatoes'];
        var rottenTomatoesAudience = ratings['rottenTomatoesAudience'];
        var rottenTomatoesStatus = ratings['rottenTomatoesStatus'];
        var rottenTomatoesAudienceStatus = ratings['rottenTomatoesAudienceStatus'];

        var rottenImage = "/rotten_none.png";

        if (rottenTomatoes != null){

            if(rottenTomatoes >= 90) {
                rottenImage = "/rotten_fresh.png";
            }
            else if (rottenTomatoes >= 60) {
                rottenImage = "/rotten_fresh.png";
            }
            else if (rottenTomatoes >= 1) {
                rottenImage = "/rotten_rotten.png";
            }

            else {
                rottenImage = "/rotten_none.png";
            }
        }

        if (rottenTomatoesStatus != null){
            if(rottenTomatoesStatus == "Certified-Fresh") {

                rottenImage = "/rotten_cert.png";
            }

            if(rottenTomatoesStatus == "Fresh") {
                rottenImage = "/rotten_fresh.png";

            }

            if(rottenTomatoesStatus == "Rotten") {
                rottenImage = "/rotten_rotten.png";
            }

        }

        if(rottenTomatoes == null) {
            rottenTomatoes = "N/A";
        }

        else {
            rottenTomatoes = rottenTomatoes + "%"
        }


        var rottenAudienceRow = ""
        if (rottenTomatoesAudienceStatus != null && rottenTomatoesAudience != null){

            var rottenAudienceImage = ""

            if(rottenTomatoesAudienceStatus == "Upright") {

                rottenAudienceImage = "/rotten_upright.png"
            }

            if(rottenTomatoesAudienceStatus == "Spilled") {

                rottenAudienceImage = "/rotten_spilled.png"

            }

            rottenAudienceRow =
                <>
                    <div className={classes.rottenImages}>
                        <Image
                            src={rottenAudienceImage}
                            layout='fill'
                            objectFit="fit"
                            alt="Not Found"
                        ></Image>
                    </div>

                    <p className={classes.rottenText}>
                        <b>{rottenTomatoesAudience}%</b>
                    </p>

                </>

        }

        return (
            <div className={classes.rottenTomatoes}>
                <div className={classes.rottenImages}>
                    <Image
                        src={rottenImage}
                        layout='fill'
                        objectFit="fit"
                        alt="Not Found"
                    ></Image>
                </div>
                <p className={classes.rottenText}>
                    <b>{rottenTomatoes}</b>
                </p>
                {rottenAudienceRow.length == 0? <div></div> : rottenAudienceRow}

            </div>
        );
    }

    function Metacritic() {
        var rating = ratings['metacritic'];
        if(rating == null || isNaN(rating) || rating.length == 0) {
            rating = "N/A"
        }

        else {
            rating = parseInt(rating)
        }

        return (
            <div className={classes.metacritic}>
                <div className={classes.metacriticImage}>
                    <Image
                        src="/metacritic.png"
                        layout='fill'
                        objectFit="fit"
                        alt="Not Found"
                    ></Image>
                </div>

                <p className={classes.metacriticText}><b>{rating}</b></p>
            </div>
        );
    }

    function movie_rated() {
        console.log(rated)
        var image = '/NOTRATED.svg'
        var width = 80
        var height = 40

        if(rated == 'R') {
            image = '/RATED_R.svg'
            width = 22
            height = 22
        }

        if(rated == 'G') {
            image = '/RATED_G.svg'
            width = 22
            height = 22
        }

        if(rated == 'PG') {
            image = '/RATED_PG.svg'
            width = 22
            height = 22
        }

        if(rated == 'PG-13') {
            image = '/RATED_PG-13.svg'
            width = 45
            height = 22
        }

        return (

            <span>
              <Image
                  src={image}
                  width={width}
                  height={height}
                  alt={rated}
              >
                </Image>
            </span>

        );
    }


    function handleButtonClick(event) {
        const genre_name = event.target.innerText

        router.push({
            pathname: '/results/[term]',
            query: {type: "genre", term: genre_name},
        })
    }

    async function handleAddCart() {
        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: JSON.stringify({
                userId: getUserId(),
                movieId:id,
                qty: 1 })
        };
        const res = await fetch('http://localhost:8080/cart/add', requestOptions)
        if(res.status < 300) {
            console.log(mutate('/cart/'+ getUserId()))
            setAlert({
                type: 'success',
                message: 'Added to Cart'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});

        }
        else {
            console.log(res)
            setAlert({
                type: 'error',
                message: 'Unable to Add to Cart'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});
        }
    }


    const handleClose = () => {
        setState({ ...state, open: false });
    };

    function Background() {
        if(true) {
            return (
                    <>
                        <div className={classes.background}>
                            <Image
                                src={background == null || !validator.isURL(background) ? NoBackground : background}
                                layout='fill'
                                objectFit="cover"
                                alt="Not Found"

                            >
                            </Image>


                            <div className={classes.backgroundPoster}>
                                <Image
                                    src={poster == null || !validator.isURL(poster) ? NoImage : poster}
                                    layout='fill'
                                    objectFit="cover"
                                    alt="Not Found"
                                >
                                </Image>

                                <Bookmark id={movieId}></Bookmark>
                            </div>


                            <div className={classes.backgroundContent}>
                                <h1 className={classes.title}>
                                        {title}
                                </h1>


                                <p> {year} - {rated} - {formatRuntime(runtime)}</p>

                                <RatingRow></RatingRow>

                                <p>
                                    {plot}
                                </p>

                                <div className="ratings-row">

                                    <IMDB></IMDB>
                                    <Metacritic></Metacritic>
                                    <RottenTomatoes></RottenTomatoes>

                                </div>

                                <div className="genre-container">
                                    {genres.map(genre => (
                                        <Button key={genre.id} onClick={handleButtonClick} id={genre.name} className="btn btn-default ">
                                            <h5>{genre.name}</h5>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </>

            );
        }

        else {
            return (
                <>
                    <div className="movie-row-1">
                        <div className="movie-image">
                            <Image
                                src={poster == null || !validator.isURL(poster) ? NoImage:poster}
                                layout='fill'
                                objectFit="cover"
                                alt="Not Found"
                            >
                            </Image>

                            <Bookmark id={movieId}></Bookmark>
                        </div>

                        <div className="movie-information">
                            <h1 className="movie-title">
                                {title}
                            </h1>

                            <div className="movie-headline-row1">
                                {year} - {movie_rated()} - {formatRuntime(runtime)}
                            </div>

                            <div className="movie-content-text">

                                <RatingRow></RatingRow>

                                <div className="ratings-row">

                                    <IMDB></IMDB>
                                    <Metacritic></Metacritic>
                                    <RottenTomatoes></RottenTomatoes>

                                </div>

                                <p className="movie-headline-row2">
                                    <b>Synopsis</b> <br/>{plot}
                                </p>


                                <p className="movie-headline-row3">
                                    <b>Director</b> {director}
                                </p>

                                <p className="movie-headline-row4">
                                    <b>Writers</b> {writer}
                                </p>

                                <p className="movie-headline-row5">
                                    <b>Production</b> {production}
                                </p>

                                <p className="movie-headline-row6">
                                    <b>Language(s)</b> {language}
                                </p>

                            </div>

                            <div className="genre-container">
                                {genres.map(genre => (
                                    <Button key={genre.id} onClick={handleButtonClick} id={genre.name} className="btn btn-default ">
                                        <h5>{genre.name}</h5>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                </>

            );
        }
    }

    return (
        <>
            <Navigation />

            <div className="movie-container">

                <Background></Background>

                <div className="movie-row-2">
                    <CastRow id={id}></CastRow>
                </div>

                <div className="movie-row-3">
                    <ReviewRow id={id}></ReviewRow>
                </div>

                <div className="movie-row-4">
                    <div className="buy-button">
                        <Button onClick={handleAddCart} className="btn-block" >
                            <h3>Add to Bag for {formatCurrency(price)}</h3>
                        </Button>
                    </div>
                </div>

            </div>

            <Snackbar
                open={open}
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={6000}
                key={vertical + horizontal}
                onClose={handleClose}>

                <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    );
}