import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import {useRouter} from "next/router";
import { makeStyles } from '@material-ui/core/styles';
import  React, {useRef, useState,useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Navigation from '../../components/Navbar'
import ResultViewClassic from '../../components/ResultViewClassic';
import {useWindowDimensions} from "../../utils/useWindowDimensions.ts";
import OrderViewMobile from "../../components/OrderViewMobile";
import OrderViewClassic from "../../components/OrderViewClassic";
import ResultViewMobile from "../../components/ResultViewMobile";



export default function Results() {
    const router = useRouter();
    const { width, height } = useWindowDimensions();

    const type = router.query['type']
    const term = router.query['term']
    const page = router.query['page'] || 0
    const sort = router.query['sort'] || 0
    const query = {type, term, page, sort};

    console.log(query)
    //const path = "/movie/" + type + "/" + term + "&page=" + page + "&sortBy=" + sort + "&orderBy=" + order
    //const { data, error } = useGetMovies(decoderPath())

    if (!type || !term) return (
        <div>
            <div className="result-content">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    function ResultView() {
        if(width <= 900){
            return <ResultViewMobile query={query}></ResultViewMobile>

        }
        else{
            return <ResultViewClassic query={query}></ResultViewClassic>

        }
    }

    return (
        <>
            <Navigation />
            <ResultView></ResultView>
        </>

    );
}

// this function only runs on the server by Next.js
//export const getServerSideProps = async ({params}) => {
//   const userId = params.userId;
//    return {
//        props: { userId }
//    }
//}
