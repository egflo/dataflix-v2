
import { useRouter } from 'next/router'
import Rating from '@material-ui/lab/Rating';
import Image from 'next/image'
import NoImage from '../public/no_image.jpg'
import validator from 'validator'
import {formatRuntime, numFormatter, formatCurrency} from '../utils/helpers'
import { Button } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import {useState} from 'react'

//https://blog.8bitzen.com/posts/01-11-2018-material-ui-dynamically-changing-styling-by-changing-property-in-classes/
const useStyles = makeStyles((theme) => ({
    slider: {
        height: '100%',
        background: 'dodgerblue',
        float: 'right',
        transition: '0.3s',
        borderBottomRightRadius: "5px",
        borderTopRightRadius: "5px",

        width: '15px',
    },

    sliderExpand: {
        height: '100%',
        background: 'dodgerblue',
        float: 'right',
        transition: '0.3s',
        borderBottomRightRadius: "5px",
        borderTopRightRadius: "5px",

        width: '100%',
    },
    
    sliderText: {
        writingMode: 'vertical-lr',
        textOrientation: 'mixed',
        color: 'white',
        display: 'none',
    },

    sliderTextExpand: {
        writingMode: 'vertical-lr',
        textOrientation: 'mixed',
        margin: '0',
        color: 'white',
        display: 'block',
    }
}));


export default function ResultRow({content}) {

    const { id, title, year, director, poster, plot, runtime, language, background, rated, cast, ratings, genres, writer, production, price} = content

    const router = useRouter()
    const [hover, setHover] = useState(false);
    const classes = useStyles();


    function handleClick() {
        router.push({
            pathname: '/movie/' + id,
            //query: { id: id },
        })
    }

    function rating () {
        try {
            var numVotes = ratings['numVotes'];
            var rating = ratings['rating'];
        } catch (error) {
            console.error(id);
        }
        
        if(numVotes == null) {
            numVotes = 0
            rating = 0
        }

        return (
            <div className="movie_rating-row">
                <Rating
                    name="read-only"
                    value={rating * .5}
                    precision={0.5}
                    size="medium"
                    readOnly />

                <p> ({numFormatter(numVotes)} votes)</p>
            </div>
        );
    }

    function MouseOver(event) {
        setHover(true)

    }
    function MouseOut(event){
        setHover(false)
    }

    return (
        <div className="border-row">
            <div onMouseOver={MouseOver} onMouseOut={MouseOut} onClick={handleClick} className="content-row">
                <div className="movie-row-image">
                    <Image
                        src={poster == null || !validator.isURL(poster) ? NoImage:poster}
                        layout='fill'
                        objectFit="cover"
                        alt="Not Found"
                    >
                    </Image>
                </div>

                <div className="movie-column-1">
                    <h2 className="movie-row-title">
                        {title}
                    </h2>

                    <p className="movie-row-subheadline">
                        {year} - {rated} - {formatRuntime(runtime)}
                    </p>

                    {rating()}

                    <p className="movie-row-plot">
                        {plot}
                    </p>

                </div>

                <div className="movie-column-2">
                    <div className={hover ? classes.sliderExpand : classes.slider}>
                        <h4 className={hover ? classes.sliderTextExpand : classes.sliderText}>
                            {formatCurrency(price)}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}