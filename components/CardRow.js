
import {useGetMovieMeta} from '../pages/api/Service'
import MovieCard from '../components/MovieCard'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import  React, {useRef, useState, useEffect, useCallback} from 'react'
import axios from "axios";
import getMovies from '../components/InfiniteScroll'

const useStyles = makeStyles((theme) => ({
    container: {
        margin: '0 auto',
        maxWidth: '1200px',
        minWidth: '1200px',
    },

    cardRow: {
        position: 'relative',
        height: '500px',

    },

    cardContainer: {
        display: 'flex',
        flexWrap: 'no-wrap',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollBehavior: 'smooth',
        height: '100%'
    },

    chevronRight: {
        position: 'absolute',
        display: "block",
        top: '40%',
        left: '94%',
        zIndex: '99',
    },

    chevronHide: {
        display: "none",
    },

    chevronLeft: {
        position: 'absolute',
        display: "block",
        top: '40%',
        left: '0',
        zIndex: '99',
    },

    chevronColor: {
        color: 'dodgerblue',
    },


    title: {
        display: 'flex',
    },

    shape: {
        height: '50px',
        width: '10px',
        backgroundColor: 'dodgerblue',
        marginRight: '5px',
    },
}));

export default function CardRow({meta}) {
    const {path,title} = meta;
    const classes = useStyles();
    const ref = useRef(null);

    const [page, setPage] = useState(0);
    const [right, setRight] = useState(false);
    const [left, setLeft] = useState(true);

    const [display, setDisplay] = useState("hidden");

    const { loading, error, list,last } = getMovies(path, page);

    function onScroll(event) {
        const { scrollHeight, scrollWidth, scrollTop, scrollLeft, clientWidth, clientHeight } = event.target;
        const scroll = scrollWidth - scrollLeft - clientWidth


        console.log(scrollWidth)
        console.log(scrollLeft)
        console.log(clientWidth)


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
            console.log("End of scroll");
            setPage(page+1);
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

   // if (totalElements == 0) return (<div></div>);
    return (
        <div className={classes.container}>
            <div className={classes.title}>
                <div className={classes.shape}></div>
                <h1> {title} </h1>
            </div>

            <div className={classes.cardRow}>
                {/* whenClicked is a property not an event, per se.

                                <div className={left ? classes.chevronHide : classes.chevronLeft}>
                    <IconButton onClick={handleLeftClick}>
                        <FontAwesomeIcon icon={faChevronLeft} size="3x" className={classes.chevronColor}/>
                    </IconButton>
                </div>
                <div className={right ? classes.chevronHide : classes.chevronRight}>
                    <IconButton onClick={handleRightClick}>
                        <FontAwesomeIcon icon={faChevronRight} size="3x" className={classes.chevronColor}/>
                    </IconButton>
                </div>

                */}

                <div ref={ref} onScroll={onScroll} className={classes.cardContainer}>
                    {list.map((meta,index) => (
                        <MovieCard key={index} meta={meta} />
                    ))}
                </div>
            </div>
        </div>

    )
}