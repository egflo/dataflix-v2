
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import Image from 'next/image'
import { useRouter } from 'next/router'
import  React, {useRef, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp,  faChevronDown} from '@fortawesome/free-solid-svg-icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Rating from '@material-ui/lab/Rating'
import Button from 'react-bootstrap/Button'
import NoImage from '../../public/no_image.jpg'
import NoBackground from '../../public/movie_background.png'
import {useGetMovieId, getBaseURL} from '../api/Service'
import CastRow from '../../components/CastRow'
import ReviewRow from '../../components/ReviewRow'
import {formatRuntime, numFormatter, getUserId, formatCurrency} from '../../utils/helpers'
import validator from 'validator'
import Navigation from '../../components/Navbar'
import Bookmark from '../../components/Bookmark'
import ReviewCard from '../../components/ReviewCard'
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
            //filter: 'blur(5px)',
            //webkitFilter: 'blur(5px)',
        }
    },

    backgroundPoster: {
        position: 'relative',
        height: '300px',
        width: '170px',
        top: '65px',
        left: '50px',
        '& > *': {
            borderRadius:'5px',
        }
    },

    backgroundContent: {
        position: 'absolute',
        width: '525px',
        top: '58px',
        left: '225px',
        paddingLeft: '5px',
        '& > *': {
            margin: 0,
            color: 'white',
            textShadow: ' 1px 2px black',
        }
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


//https://medium.com/geekculture/how-to-use-react-router-useparams-436851fd5ef6
export default function Movie() {
    const router = useRouter();
    const classes = useStyles();
    const { movieId } = router.query;
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

    const [dropdown, setDropdown] = useState(false);
    const { data, error } = useGetMovieId(movieId)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return (
        <div>
            <div className="movie-container">
                    <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const { id, title, year, director, poster, plot, runtime, background, rated, cast, ratings, genres, language, writer, awards, boxOffice, production, country, price } = data

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
        var style = {display: 'block'}
        if(rating != null) {
            const split = rating.split("/")
            rating = split[0]
        }

        else {
            style = {display: 'none'}
        }

        return (
            <div style={style} className="imdb-container">
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
        var style = {display: 'grid'};

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
                style = {display: 'none'}
            }
            //rottenImage = "/rotten_none.png";
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
            style = {display: 'none'}
        }

        else {
            rottenTomatoes = rottenTomatoes + "%"
        }


        var rottenAudienceRow = ""
        if ((rottenTomatoesAudienceStatus != null && rottenTomatoesAudience != null) && (rottenTomatoesAudience.length > 0 && rottenTomatoesAudience.length > 0)){

            var rottenAudienceImage = "/rotten_upright.png"

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
            <div style={style} className={classes.rottenTomatoes}>
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
        var style = {display: 'grid'};

        if(rating == null || rating.length == 0) {
            style = {display: 'none'};
        }

        else {
            rating = parseInt(rating);
        }

        return (
            <div style={style} className={classes.metacritic}>
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
        const res = await fetch(getBaseURL() + '/cart/', requestOptions)
        if(res.status < 300) {
            await mutate('/cart/')

            setAlert({
                type: 'success',
                message: 'Added to Cart'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});

        }
        else {
            setAlert({
                type: 'error',
                message: 'Unable to Add to Cart'
            })
            setState({ open: true, vertical: 'top', horizontal: 'center'});
        }
    }

    function formatInformation(data) {
        if(data == null || data.length == 0) {
            return "No information available.";
        }
        else {
            return  data;
        }
    }

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const dropdownClick = () => {
        setDropdown(!dropdown);
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
                                        alt="Not Found"
                                        width={170}
                                        height={260}
                                    >
                                    </Image>

                                <div style={{display:'flex',alignItems:'center',justifyContent:'center', height:'35px', backgroundColor:'rgba(60, 60, 60, 0.8)', paddingLeft: '20px'}}>
                                    <Bookmark id={movieId} button={false}></Bookmark>
                                    <ReviewCard id={movieId}></ReviewCard>
                                </div>
                            </div>


                            <div className={classes.backgroundContent}>
                                <h1 className={classes.title}>
                                        {title}
                                </h1>


                                <p style={{fontWeight:'bold'}}> {year} - {rated} - {formatRuntime(runtime)}</p>

                                <RatingRow></RatingRow>

                                <p style={{fontWeight:'bold'}}>
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

                    <div className="dropdown">
                        <button onClick={dropdownClick} className="dropbtn">
                            More Details
                            <FontAwesomeIcon icon={dropdown ? faChevronUp: faChevronDown} size="1x" style={{color: "white", marginLeft: "10px"}} />
                        </button>
                        <div style={{display: dropdown ? 'block':'none'}} className="dropdown-content">
                            <p className="">
                                <b>Director: </b> {formatInformation(director)}
                            </p>

                            <p className="">
                                <b>Writers: </b> {formatInformation(writer)}
                            </p>

                            <p className="">
                                <b>Boxoffice: </b> {formatInformation(boxOffice)}
                            </p>

                            <p className="">
                                <b>Production: </b> {formatInformation(production)}
                            </p>

                            <p className="">
                                <b>Language(s): </b> {formatInformation(language)}
                            </p>

                            <p className="">
                                <b>Country(s): </b> {formatInformation(country)}
                            </p>

                        </div>
                    </div>

                    <div className="cast-row">
                        <CastRow id={id}></CastRow>
                    </div>

                    <div className="review-row">
                        <ReviewRow id={id}></ReviewRow>
                    </div>

                    <div className="button-row">
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