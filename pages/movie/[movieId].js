
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { useRouter } from 'next/router'
import  React, {useRef, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronUp, faChevronDown, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Rating from '@material-ui/lab/Rating'
import Button from 'react-bootstrap/Button'
import NoImage from '../../public/NOIMAGE.png'
import {useGetMovieId} from '../../service/Service'
import CastRow from '../../components/cast/CastRow'
import ReviewRow from '../../components/review/ReviewRow'
import {formatRuntime, numFormatter, getUserId, formatCurrency} from '../../utils/helpers'
import NoBackground from '/public/BACKGROUND.png'
import useSWR, { mutate } from 'swr'
import {DashboardLayout} from "../../components/nav/DashboardLayout";
import MovieCardDetailed from "../../components/movie/MovieCardDetailed";


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
            gridTemplateRows: '380px 50px auto',
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
 function Movie(props) {
    const router = useRouter();
    const classes = useStyles();
    const { movieId } = router.query;

    const [dropdown, setDropdown] = useState(false);
    const { data, error } = useGetMovieId(movieId)

    if (error) return (
        <>
            <div className="movie-container">
                <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
                <h2>Unable to load movie.</h2>
            </div>
        </>
    );

    if (!data) return (
        <>
            <div className="movie-container">
                    <div className="loading-container"><CircularProgress/></div>
            </div>
        </>
    );

    const { id, title, year, director, poster, plot, runtime, background, rated, cast, ratings, genres, language, writer, awards, boxOffice, production, country, price, inventory} = data


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
            method: 'PUT',
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
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/cart/', requestOptions)
        if(res.status < 300) {
            await mutate('/cart/')

            props.setalert({
                open: true,
                type: 'success',
                message: 'Movie added to cart.'
            })

        }
        else if(res.status == 400) {
            props.setalert({
                open: true,
                type: 'error',
                message: 'Unable to add to cart. Product is out of stock'
            })
        }
        else {
            props.setalert({
                open: true,
                type: 'error',
                message: 'Error adding to cart'
            })
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


    const dropdownClick = () => {
        setDropdown(!dropdown);
    };

    return (
        <>

                <div className={classes.container}>

                    <MovieCardDetailed {...props} content={data}></MovieCardDetailed>

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
                                <b>Box Office: </b> {formatInformation(boxOffice)}
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
                                <h3>Buy Now For {formatCurrency(price)}</h3>
                            </Button>
                        </div>
                    </div>

                </div>

        </>
    );
}

Movie.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Movie;