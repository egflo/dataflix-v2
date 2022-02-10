
import { useRouter } from 'next/router'
import Rating from '@material-ui/lab/Rating';
import Image from 'next/image'
import NoImage from '../../public/NOIMAGE.png'
import validator from 'validator'
import {formatRuntime, numFormatter, formatCurrency} from '../../utils/helpers'
import { makeStyles } from '@material-ui/core/styles';
import {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';


//https://blog.8bitzen.com/posts/01-11-2018-material-ui-dynamically-changing-styling-by-changing-property-in-classes/
const useStyles = makeStyles((theme) => ({
    container: {
        //minHeight: '205px',
        //maxHeight: '200px',

        [theme.breakpoints.down('sm')]: {
            width: '100vw',
            overflowY: 'auto',

        },

        [theme.breakpoints.up('md')]: {
            transition: 'all 0.5s ease-in-out',
            borderRadius: '5px',
            minWidth: '800px',
            maxWidth: '800px',
            margin: '0 auto 20px',
            boxSizing: 'border-box',
            //border: '2px solid transparent',
            '&:hover': {
                border: '2px solid #dodgerblue',
                cursor: 'pointer'
            },
        },
    },

    content: {
        [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gridTemplateColumns : '120px auto',
            //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
            borderBottom: '2px solid dodgerblue',
            width: '100%',
            maxWidth: '100%',
        },

        [theme.breakpoints.up('md')]: {
            gridArea: '1 / 1 / 2 / 2',
            borderRadius: '5px',
            display: 'grid',
            gridTemplateColumns: '120px 600px auto',
            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        },
    },

    slider: {

        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },

        [theme.breakpoints.up('md')]: {
            height: '100%',
            background: 'dodgerblue',
            float: 'right',
            transition: '0.3s',
            borderBottomRightRadius: "5px",
            borderTopRightRadius: "5px",
            width: '15px',
        },
    },

    sliderExpand: {

        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },

        [theme.breakpoints.up('md')]: {
            height: '100%',
            background: 'dodgerblue',
            float: 'right',
            transition: '0.3s',
            borderBottomRightRadius: "5px",
            borderTopRightRadius: "5px",
            width: '100%',
        },
    },

    title: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        margin: '0',
        padding: '0',
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.5rem',
        },
    },

    plot: {
        display: '-webkit-box',
        webkitLineClamp: '3',
        webkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: '100px',
        margin: '0',
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

        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },

    image: {
        position:'relative',
        width: '100%',
        height: '100%',

        [theme.breakpoints.up('md')]: {
            '& > * > img' : {
                borderBottomLeftRadius: '5px',
                borderTopLeftRadius: '5px',
            },
        },

    },

    column: {
        height: '100%',
        padding: '5px',
        '& > div': {
            display: 'flex',
            height: '25px',
        },
    },

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
        let rating;
        let numVotes;
        try {
            numVotes = ratings['numVotes'];
            rating = ratings['rating'];
        } catch (error) {
            console.error(id);
        }
        
        if(numVotes == null) {
            numVotes = 0
            rating = 0
        }

        return (
            <div className="">
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
        <div className={classes.container}>
            <div onMouseOver={MouseOver} onMouseOut={MouseOut} onClick={handleClick} className={classes.content}>
                <div className={classes.image}>
                    <Image
                        src={poster == null || !validator.isURL(poster) ? NoImage:poster}
                        layout='fill'
                        objectFit="cover"
                        alt="Not Found"
                    >
                    </Image>
                </div>

                <div className={classes.column}>
                    <p className={classes.title}>
                        {title}
                    </p>

                    <p className="movie-row-subheadline">
                        {year} - {rated} - {formatRuntime(runtime)}
                    </p>

                    {rating()}

                    <p className={classes.plot}>
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