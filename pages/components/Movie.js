
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@material-ui/lab/Rating';

import { useRouter } from 'next/router'
import {useGetMovieId} from '../api/Service'
import CastRow from '../components/CastRow'
import ReviewRow from '../components/ReviewRow'
import Navigation from '../components/Navbar'


export default function Movie() {
    //const { id, title, year, director, poster, plot, runtime, language, background } = movie
    const router = useRouter()
    console.log(router.query['id'])

    const { data, error } = useGetMovieId(router.query['id'])
    console.log(data)
   // const { data, error } = useGetMovieId("tt0468569")

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>

    const { id, title, year, director, poster, plot, runtime, language, background, rated, cast, ratings, genres, writer, production} = data

    function numFormatter(num) {
        if(num > 999 && num < 1000000){
            return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
        }else if(num > 1000000){
            return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
        }else if(num < 900){
            return num; // if value < 1000, nothing to do
        }
    }

    function rating () {
        var numVotes = ratings['numVotes'];
        var rating = ratings['rating'];

        return (
            <div className="movie_rating">
                <Rating
                    name="read-only"
                    value={rating * .5}
                    precision={0.5}
                    size="large"
                    readOnly />

                <p><small> ({numFormatter(numVotes)} votes)</small></p>
            </div>
        );
    }

    function imdb () {
        var rating = ratings['imdb'];

        if(rating != null) {
            const split = rating.split("/")
            rating = split[0]
        }

        else {
            rating = 0
        }

        return (
            <div className="imdb">
                <img id="imdb_image"  src='/imdb.png' alt="Not Found"/>
                <h4>{rating}<span>/10</span></h4>
            </div>
        );
    }

    function rotten_tomatoes () {
        var rating = ratings['rottenTomatoes']
        var type = "/rotten_none.png"

        if(rating != null) {
         rating = rating.replace("%", "");
        }

        else {
            rating = 0
        }

        if(rating >= 90) {
            type = "/rotten_fresh.png"
        }
        else if (rating >= 60) {
            type = "/rotten_fresh.png"
        }
        else if (rating >= 1) {
            type = "/rotten_rotten.png"
        }

        else {
            type = "/rotten_none.png"
        }

        return (
            <div className="rotten_tomatoes">
                <img id="rotten_image"  src={type} alt="Not Found"/>
                <h3><b>{rating}%</b></h3>
            </div>
        );
    }

    function metacritic () {
        var rating = ratings['metacritic'];
        var style = {backgroundColor: "#E8E8E8"}

        if(rating != null) {
            const split = rating.split("/")
            rating = split[0]
        }

        else {
            rating = 0
        }

        if(rating >= 61){
            style = {backgroundColor: "#6c3"}
        }
        else if(rating >= 40 && rating <= 60){
            style = {backgroundColor: "#fc3"}
        }
        else if(rating >= 1 && rating <= 39){
            style = {backgroundColor: "#f00"}
        }
        else {
            var style = {backgroundColor: "lightgrey"}
        }

        return (
            <div style={style} className="metacritic">
                <h2>{rating}</h2>
                <p><small>Metacritic</small></p>
            </div>
        );
    }

    function rating () {
        var numVotes = ratings['numVotes'];
        var rating = ratings['rating'];

        return (
            <div className="movie_rating">
                <Rating
                    name="read-only"
                    value={rating * .5}
                    precision={0.5}
                    size="large"
                    readOnly />

                <p><small> ({numFormatter(numVotes)} votes)</small></p>
            </div>
        );
    }

    function handleButtonClick(event) {
        const genre_name = event.target.innerText

        console.log(genre_name)
        router.push({
            pathname: '../components/Results',
            query: { term: genre_name , type: "genre"},
        })
    }

    return (
        <body>

        <Navigation></Navigation>
        <div className="movie-container">

            <div className="movie-row-1">
                <div className="movie-image">
                    <img src={poster} alt="Not Found" width="100%"></img>
                </div>

                <div className="movie-information">
                    <h1 className="movie-title">
                        {title}
                    </h1>

                    <p className="movie-headline-row1">
                        {year} - {rated} - {runtime}
                    </p>

                    <p className="movie-headline-row2">
                        <b>Director</b> {director}
                    </p>

                    <p className="movie-headline-row3">
                        <b>Writers</b> {writer}
                    </p>

                    <p className="movie-headline-row4">
                        <b>Synopsis</b> <br/>{plot}
                    </p>

                    <p className="movie-headline-row5">
                        <b>Production</b> {production}
                    </p>

                    <p className="movie-headline-row6">
                        <b>Language(s)</b> {language}
                    </p>

                    <div className="genre-container">
                        {genres.map(genre => (
                            <button onClick={handleButtonClick} id={genre.name} className="genre-button" >
                                <h3>{genre.name}</h3>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="movie-row-2">
                {rating()}

                {metacritic()}

                {rotten_tomatoes()}

                {imdb()}

            </div>

            <div className="movie-row-3">

                <CastRow id={id}></CastRow>

            </div>

            <div className="movie-row-4">
                <ReviewRow id={id}></ReviewRow>

            </div>

            <div className="movie-row-5">

                <button className="cart-button" >
                    <h3>Add to Bag</h3>
                </button>
            </div>


        </div>

        <div className="expandable-review">

        </div>

        </body>

    );
}