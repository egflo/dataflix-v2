import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';
//https://stackoverflow.com/questions/44897070/element-type-is-invalid-expected-a-string-for-built-in-components-or-a-class
import {useGetMovieMeta} from '../pages/api/Service'
import CardRow from '../components/CardRow'
import Background from '../components/Background'
import MovieCard from '../components/MovieCard'
import Navigation from '../components/Navbar'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";



const movies = ["tt0468569", "tt0435761", "tt1375666","tt2488496"];
const delay = 2500;

export default function Home() {

    const top_sellers = {title: 'Best Sellers', path: '/order/sellers'}
    const top_rated = {title: 'Top Rated', path: '/rating/rated'}
    const watchlist = {title: 'Your Watchlist', path: '/bookmark/'}

    const [index, setIndex] = React.useState(0);
    const timeoutRef = React.useRef(null);

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
        <div className='main-content'>
            <Navigation />
            
            <div className="background-content">
                <div
                    className="slideshowSlider"
                    style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
                >
                    {movies.map((id, index) => (
                        <Background key={index} movie_id={id}></Background>
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

            <CardRow meta={top_sellers}></CardRow>

            <CardRow meta={top_rated}></CardRow>

        </div>

      )
}