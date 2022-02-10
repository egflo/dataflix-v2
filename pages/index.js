import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


import React, { useState, useEffect } from 'react';
//https://stackoverflow.com/questions/44897070/element-type-is-invalid-expected-a-string-for-built-in-components-or-a-class
import CardRow from '../components/movie/CardRow'
import Background from '../components/movie/Background'
import { makeStyles } from '@material-ui/core/styles';
import {DashboardLayout} from "../components/nav/DashboardLayout";


const useStyles = makeStyles((theme) => ({
    backgroundContent: {
        borderRadius: '5px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        minWidth: '1200px',
        maxWidth: '1200px',
        overflow: 'hidden',
        position: 'relative',
        margin: '20px auto 0',
        marginBottom: '20px',

        [theme.breakpoints.down('sm')]: {
            display: 'none',
        }
    },

    slideshowSlider: {
        whiteSpace: 'nowrap',
        maxHeight: '500px',
        minHeight: '500px',
        transition: 'ease 1000ms',
        minWidth: '1200px',
        maxWidth: '1200px',
    },


}));

const movies = ["tt0468569", "tt4154756", "tt1375666","tt2488496"];
const delay = 2500;

function Home() {

    const top_sellers = {title: 'Best Sellers', path: '/order/sellers'}
    const top_rated = {title: 'Top Rated', path: '/rating/rated'}
    const watchlist = {title: 'Your Watchlist', path: '/bookmark/all'}

    const [index, setIndex] = React.useState(0);
    const timeoutRef = React.useRef(null);
    const classes = useStyles();

    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setIndex((prevIndex) =>
                    prevIndex === movies.length - 1 ? 0 : prevIndex + 1
                ),
            delay
        );

        return () => {
            resetTimeout();
        };
    }, [index]);

  return (
      <>
        <div className={classes.backgroundContent}>
            <div
                className={classes.slideshowSlider}
                style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
            >
                {movies.map((id, index) => (
                    <Background key={index} movieId={id}></Background>
                ))}

            </div>

            <div className="slideshowDots">
                {movies.map((_, idx) => (
                    <div
                        key={idx}
                        className={`slideshowDot${index === idx ? " active" : ""}`}
                        onClick={() => {
                            setIndex(idx);
                        }}
                    ></div>
                ))}
            </div>
        </div>

        <CardRow meta={watchlist}></CardRow>

        <CardRow meta={top_rated}></CardRow>

        <CardRow meta={top_sellers}></CardRow>
    </>

  )
}

Home.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Home;
