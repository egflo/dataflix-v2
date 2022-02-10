
import { useGetFilmography} from '../../service/Service'
import ResultRow from '../results/ResultRow'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Image from "next/image";
import validator from "validator";
import NoImage from "../../public/NOIMAGE.png";
import {formatCurrency, formatRuntime, getUserId, numFormatter} from "../../utils/helpers";
import {Button, Card} from "@mui/material";
import Rating from "@material-ui/lab/Rating";
import {mutate} from "swr";
import {useRouter} from "next/router";

const useStyles = makeStyles((theme) => ({

    filmography: {
        [theme.breakpoints.down('sm')]: {
            width: 0,
            margin: 0,
        },

        [theme.breakpoints.up('md')]: {
            width: 0,
            marginTop: '15px',
            marginLeft: '25px',
        },
    },

    container: {
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
            //borderBottom: '2px solid dodgerblue',
            width: '100%',
            maxWidth: '100%',
        },

        [theme.breakpoints.up('md')]: {
            gridArea: '1 / 1 / 2 / 2',
            borderRadius: '5px',
            display: 'grid',
            gridTemplateColumns: '120px 640px auto',
            //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        },
    },

    title: {
        fontSize: '1.4rem',
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
        height: '80px',
        margin: '0',
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

export default function Filmography(props) {
    const router = useRouter();
    const classes = useStyles();
    const { data, error } = useGetFilmography(props.id);

    if (!data || error) return <div className="loading-container"><CircularProgress/></div>

    function FormatRating (ratings) {
        let value;
        let numVotes;
        try {
            numVotes = ratings['numVotes'];
            value = ratings['rating'];
        } catch (error) {
            console.error(props.id);
        }

        if(numVotes == null) {
            numVotes = 0
            value = 0
        }

        return (
            <div>
                <Rating
                    name="read-only"
                    value={value * .5}
                    precision={0.5}
                    size="medium"
                    readOnly />

                <p> ({numFormatter(numVotes)} votes)</p>
            </div>
        );
    }

    function findCast(cast, id) {
        let data = cast.find(cast => cast.starId === id);
        const characters = data.characters;

        if (characters.length > 0) {
            const json = JSON.parse(characters);
            return `(${json})`;
        }
        return '';

    }

    async function handleAddCart(id) {
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

    return (
        <div className={classes.filmography}>
            {data.content.map((movie,index) => (
                <Card id={movie} className={classes.container}>
                    <div className={classes.content} onClick={()=> {router.push("/movie/"+movie.id)}}>
                        <div className={classes.image}>
                            <Image
                                src={movie.poster == null || !validator.isURL(movie.poster) ? NoImage:movie.poster}
                                layout='fill'
                                objectFit="cover"
                                alt="Not Found"
                            >
                            </Image>
                        </div>

                        <div className={classes.column}>
                            <p className={classes.title}>
                                {`${movie.title} ${findCast(movie.cast, props.id)}`}
                            </p>

                            <p className="movie-row-subheadline">
                                {movie.year} - {movie.rated} - {formatRuntime(movie.runtime)}
                            </p>

                            {FormatRating(movie.ratings)}

                            <p className={classes.plot}>
                                {movie.plot}
                            </p>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddCart(movie.id)}
                            >
                                Buy Now for {formatCurrency(movie.price)}
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}

        </div>
    );

}