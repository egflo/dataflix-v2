import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  React, {useRef, useState, useRouter, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {getUserId} from '../../utils/helpers'
import Navigation from '../../components/Navbar'
import {faBox, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {useWindowDimensions} from "../../utils/useWindowDimensions.ts";
import OrderViewClassic from "../../components/OrderViewClassic";
import OrderViewMobile from "../../components/OrderViewMobile";



function Orders() {
    const ref = useRef(null);
    const { width, height } = useWindowDimensions();

    function OrderView() {
        if(width <= 900){
            return <OrderViewMobile></OrderViewMobile>
        }
        else{
            return <OrderViewClassic></OrderViewClassic>
        }

    }
    return (
        <>
            <Navigation />
            <OrderView />
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

export default Orders;
