
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import Image from 'next/image'
import { useRouter } from 'next/router'
import  React, {useRef, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronUp, faChevronDown, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Rating from '@material-ui/lab/Rating'
import Button from 'react-bootstrap/Button'
import NoImage from '../../public/no_image.jpg'
import {useGetMovieId, getBaseURL} from '../api/Service'
import CastRow from '../../components/CastRow'
import ReviewRow from '../../components/ReviewRow'
import {formatRuntime, numFormatter, getUserId, formatCurrency} from '../../utils/helpers'
import validator from 'validator'
import Navigation from '../../components/Navbar'
import Bookmark from '../../components/Bookmark'
import ReviewCard from '../../components/ReviewCard'
import NoBackground from '/public/movie_background.png'
import useSWR, { mutate } from 'swr'

const useStyles = makeStyles((theme) => ({
    container: {
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#fafafa',
            backgroundImage: `url(${NoBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '0',
            margin: '0px',
            overflow: 'hidden',
            position: 'relative',

        },

        [theme.breakpoints.up('md')]: {
            display: 'grid',
            gridTemplateRows: '380px 50px 280px 320px auto',
            margin: '15px auto',
            zIndex: 50,
            position: 'relative',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            transition: '0.3s',
            borderRadius: '5px', /* 5px rounded corners */
            minWidth: '805px',
            maxWidth: '805px',
        },
    },

    background: {
        position: 'relative',
        height: '100%',
        width: '100%',

        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            //filter: 'blur(5px)',
            //webkitFilter: 'blur(5px)',
            backdropFilter: 'blur(5px)',
            padding: '15px',

        },

        [theme.breakpoints.up('md')]: {
            '& > * > img': {
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
            },
        },
    },

    poster: {
        zIndex: 99,

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
            top: '65px',
            left: '50px',
            '& > *': {
                borderRadius:'5px',
            },
        },
    },

    backgroundContent: {
        zIndex: 99,
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
    },

    starRating: {
        display: 'flex',
        alignItems: 'center',
        "& p": {
            margin: '0',
        },
    },

    rottenTomatoes: {
        //display: 'grid',
        //gridTemplateColumns: '25% 20% 25% 20%',
        //gridTemplateColumns: '50% 50%',
        alignItems:'center',
        justifyContent:'center',
        height: '100%',
    },

    rottenImages: {
        position: 'relative',
        width: '30px',
        height: '30px',
        //height: '80%',
        //width: '70%',
        //top: '50%',
        //left: '50%',
        //transform: 'translate(-50%, -50%)',
    },

    rottenText: {
        fontSize: '22px',
        //margin: '0 auto',
        //marginTop: '5px',
        padding:'0',
        paddingLeft: '5px',
        margin:'0',
    },

    metacritic: {
        //display: 'grid',
        //gridTemplateColumns: '60% 40%',
        //height: '40px',
        //width: '80px',
        alignItems:'center',
        justifyContent:'center',
        height: '100%',
    },

    metacriticImage: {
        position: 'relative',
        width: '30px',
        height: '30px',
        flex: '1',
        //height: '75%',
        //width: '80%',
        //top: '50%',
        //left: '50%',
        //transform: 'translate(-50%, -50%)',
    },

    metacriticText: {
        fontSize: '22px',
        padding:'0',
        paddingLeft: '5px',
        margin:'0',
        flex: '1',
        //margin: '0 auto',
        //marginTop: '2px',
    },

    imdb: {
        display: 'grid',
        gridTemplateColumns: '60% 40%',
        height: '100%',
        width: '115px',
        border: '2px solid #F0C514',
        borderRadius: '5px',
        //backgroundColor: 'white',
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

    dropdown: {
        position: 'relative',
        display: 'inline-block',
        width: '100%',
        webkitTransition: 'all 150ms ease',
        transition: 'all 150ms ease',
        backgroundColor: '#0d6efd',
        color: 'white',
        fontSize: '20px',
        border: 'none',

        [theme.breakpoints.down('sm')]: {
            height: '50px',
        },
        [theme.breakpoints.up('md')]: {
            height: '100%',
        },
    },

    dropdownContent: {
        [theme.breakpoints.down('sm')]: {
            backgroundColor: '#f9f9f9',
            width: '100%',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            padding: '10px',
            webkitTransition: 'all 150ms ease',
            transition: 'all 150ms ease',
        },
        [theme.breakpoints.up('md')]: {
            position: 'absolute',
            backgroundColor: '#f9f9f9',
            width: '100%',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            zIndex: '99',
            padding: '10px',
            webkitTransition: 'all 150ms ease',
            transition: 'all 150ms ease',
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

    if (error) return (
        <>
            <Navigation />
            <div className="movie-container">
                <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                <h2>Unable to load movie.</h2>
            </div>
        </>
    );

    if (!data) return (
        <>
            <Navigation />
            <div className="movie-container">
                    <div className="loading-container"><CircularProgress/></div>
            </div>
        </>
    );

    const { id, title, year, director, poster, plot, runtime, background, rated, cast, ratings, genres, language, writer, awards, boxOffice, production, country, price } = data

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

    function IMDB () {
        let rating = ratings['imdb'];
        let style = {display: 'flex', alignItems: 'center', justifyContent: 'center'};
        if(rating != null) {
            const split = rating.split("/")
            rating = split[0]
        }

        else {
            style = {display: 'none'}
        }

        return (
            <div style={style}>
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
        let rottenTomatoes = ratings['rottenTomatoes'];
        const rottenTomatoesAudience = ratings['rottenTomatoesAudience'];
        const rottenTomatoesStatus = ratings['rottenTomatoesStatus'];
        const rottenTomatoesAudienceStatus = ratings['rottenTomatoesAudienceStatus'];

        let rottenImage = "/rotten_none.png";
        let style = {display: 'flex'};

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
                <div className="audienceScore" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
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

                </div>

        }

        return (
            <div style={style} className={classes.rottenTomatoes}>
                <div className="rottenScore" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
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
                </div>

                {rottenAudienceRow.length == 0? <div></div> : rottenAudienceRow}
            </div>
        );
    }

    function Metacritic() {
        let rating = ratings['metacritic'];
        let style = {display: 'flex'};

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

                <p className={classes.metacriticText}>
                    <b>{rating}</b>
                </p>
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

        return (
            <>
                <div className={classes.background}>
                    <Image
                        src={background == null || !validator.isURL(background) ? NoBackground : background}
                        layout='fill'
                        objectFit="cover"
                        alt="Not Found"
                        placeholder="blur"
                        blurDataURL= '/public/movie_background.png'
                    >
                    </Image>

                    <div className={classes.poster}>
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
                        <div className="parent" style={{ width: "100%", height: "50px" }}>
                            <h1 className={classes.title}>
                                {title}
                            </h1>
                        </div>

                        <p style={{fontWeight:'bold'}}> {year} - {rated} - {formatRuntime(runtime)}</p>

                        <RatingRow></RatingRow>

                        <p className={classes.plot} style={{fontWeight:'bold'}}>
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

    return (
        <>

                <Navigation />

                <div className={classes.container}>

                    <Background></Background>

                    <div className="dropdown">
                        <button onClick={dropdownClick} className={classes.dropdown}>
                            More Details
                            <FontAwesomeIcon icon={dropdown ? faChevronUp: faChevronDown} size="1x" style={{color: "white", marginLeft: "10px"}} />
                        </button>
                        <div style={{display: dropdown ? 'block':'none'}} className={classes.dropdownContent}>
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

                    <div className="button-row" style={{width:'100%'}}>
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