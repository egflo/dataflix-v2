import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import {useRouter} from "next/router";
import  React, {useRef, useState,useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import ResultViewClassic from '../../components/results/ResultViewClassic';
import {useWindowDimensions} from "../../utils/useWindowDimensions.ts";
import ResultViewMobile from "../../components/results/ResultViewMobile";
import {DashboardLayout} from "../../components/navigation/DashboardLayout";
import {checkCookies, getCookies} from "cookies-next";
import Shipping from "../shipping";

function Results(props) {
    const router = useRouter();
    const { width, height } = useWindowDimensions();

    const type = router.query['type']
    const term = router.query['term']
    const page = router.query['page'] || 0
    const sort = router.query['sort'] || 0
    const query = {type, term, page, sort};

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
            return <ResultViewMobile {...props} query={query}></ResultViewMobile>

        }
        else{
            return <ResultViewClassic {...props} query={query}></ResultViewClassic>

        }
    }

    return (
        <>
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
Results.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

// This gets called on every request
export const getServerSideProps = ({ req, res }) => {
    // Fetch data from external API
    // Pass data to the page via props
    const cookies = getCookies({ res, req });
    const isLoggedInExists = checkCookies('isLoggedIn', {res, req});
    const isLoggedIn = isLoggedInExists ? cookies.isLoggedIn : false;

    if (!isLoggedIn) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    return { props: { } }
}

export default Results;