import Head from 'next/head'
import Image from 'next/image'
import React from "react";

import styles from '../styles/Home.module.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import {useGetMovieMeta} from '../pages/api/Service'
import CardRow from '../pages/components/CardRow'
import Background from '../pages/components/Background'


//https://stackoverflow.com/questions/44897070/element-type-is-invalid-expected-a-string-for-built-in-components-or-a-class
import MovieCard from '../pages/components/MovieCard'
import Navigation from '../pages/components/Navbar'


export default function Home() {

    const top_sellers = {title: 'Best Sellers', path: '/order/sellers'}
    const top_rated = {title: 'Top Rated', path: '/rating/rated'}

      return (
        <div>
            <Navigation></Navigation>

            <Background></Background>
            
            <CardRow meta={top_sellers}></CardRow>

            <CardRow meta={top_rated}></CardRow>

        </div>
      )
}