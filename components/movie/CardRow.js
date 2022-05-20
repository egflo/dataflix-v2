
import MovieCard from './MovieCard'
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import  React, {useRef, useState, useEffect, useCallback} from 'react'
import GetMovies from "../results/InfiniteScroll";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    container: {
        [theme.breakpoints.down('sm')]: {
            height: '100%',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            position: 'relative'
        },

        [theme.breakpoints.up('md')]: {
            margin: '0 auto',
            maxWidth: '1200px',
            minWidth: '1200px',
            display: 'grid',
            gridTemplateRows: '50px auto',
        },
    },

    cardRow: {

        [theme.breakpoints.down('sm')]: {
            padding: '0px',

        },

        [theme.breakpoints.up('md')]: {
            position: 'relative',
            height: '100%',
            maxWidth: '1200px',
        },
    },

    cardContainer: {
        display: 'flex',
        flexWrap: 'no-wrap',
        overflowX: 'hidden',
        overflowY: 'hidden',
        scrollBehavior: 'smooth',
        paddingBottom: '1rem',

        [theme.breakpoints.down('sm')]: {
            overflowX: 'auto',
        }

    },

    chevronRight: {
        position: 'absolute',
        display: 'block',
        top: '40%',
        zIndex: '99',
        left: '96%',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        }
    },

    chevronHide: {
        display: "none",
    },

    chevronLeft: {
        position: 'absolute',
        display: "block",
        top: '40%',
        zIndex: '99',
        left: '0',

        [theme.breakpoints.down('sm')]: {
            display: 'none',
        }
    },

    chevronColor: {
        color: 'dodgerblue',
    },

    button: {
        //margin: theme.spacing(2),
        width: '50px',
        height: '70px',
        borderRadius: '5px',
        backgroundColor: '#f5f5f5',
        border: '0px'
    },

    title: {
        display: 'flex',
        //justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '5px',
        gap: '5px',
    },

    shape: {
        height: '50px',
        width: '10px',
        backgroundColor: 'dodgerblue',
    },
}));

export default function CardRow({meta}) {
    const {path,title} = meta;
    const classes = useStyles();
    const ref = useRef(null);

    const [page, setPage] = useState(0);
    const [right, setRight] = useState(false);
    const [left, setLeft] = useState(true);
    const [total, setTotal] = useState(5);
    const [movieList, setMovieList] = useState([]);

    const { loading, error, list, last} = GetMovies(path, page);

    function onScroll(event) {
        const { scrollHeight, scrollWidth, scrollTop, scrollLeft, clientWidth, clientHeight } = event.target;
        const scroll = scrollWidth - scrollLeft - clientWidth;

        if (scroll > 0) {
            // We are not at the bottom of the scroll content
            console.log("scrolling");
        }

        if(scrollLeft == 0){
            setLeft(true);
        }

        if(scrollLeft > 0) {
            setLeft(false);
        }

        if (scroll == 0 & !last){
            // We are at the bottom
            setPage(page+1);
            console.log("new page");
        }

        else if (scroll == 0 & last) {
            //If it is last then no more pages left to scroll
            setRight(true)
        }

        else {
            setRight(false)
        }

    }

    function handleRightClick() {
        ref.current.scrollLeft += 350
    }

    function handleLeftClick() {
        ref.current.scrollLeft -= 350
    }

    useEffect(() => {
        if(list.length > 0) {
            setMovieList(list);
        }
    }, [list]);

    if(list.length == 0) {
        return (<div></div>)
    }
    else {
        return (
            <div className={classes.container}>
                <div className={classes.title}>
                    <div className={classes.shape}></div>
                    <Typography variant="h4">{title}</Typography>
                </div>

                <div className={classes.cardRow}>
                    <div className={left ? classes.chevronHide : classes.chevronLeft}>
                        <button className={classes.button} style={{borderTopLeftRadius: 0, borderBottomLeftRadius:0,opacity: left ? '0.5': '0.9'}} onClick={handleLeftClick}>
                            <FontAwesomeIcon icon={faChevronLeft} size="3x" className={classes.chevronColor}/>
                        </button>
                    </div>
                    <div className={right ? classes.chevronHide : classes.chevronRight}>
                        <button className={classes.button} style={{borderTopRightRadius:0, borderBottomRightRadius:0, opacity: left ? '0.5': '0.9'}} onClick={handleRightClick}>
                            <FontAwesomeIcon icon={faChevronRight} size="3x" className={classes.chevronColor}/>
                        </button>
                    </div>

                    <div ref={ref} onScroll={onScroll} className={classes.cardContainer}>
                        {movieList.map((meta,index) => (
                            <MovieCard key={index} meta={meta} />
                        ))}
                    </div>
                </div>

            </div>
        )
    }

}