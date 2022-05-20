import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import  React, {useRef, useState, useRouter, useEffect} from 'react';;
import {useWindowDimensions} from "../../utils/useWindowDimensions.ts";
import OrderViewClassic from "../../components/order/OrderViewClassic";
import OrderViewMobile from "../../components/order/OrderViewMobile";
import {DashboardLayout} from "../../components/navigation/DashboardLayout";
import {checkCookies, getCookies} from "cookies-next";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({

    title: {
        textAlign: 'left',

        [theme.breakpoints.down('sm')]: {
        },

        [theme.breakpoints.up('md')]: {
        },
    },

    container: {
        [theme.breakpoints.down('sm')]: {
            width: '100vw',
        },

        [theme.breakpoints.up('md')]: {
            borderRadius: '5px',
            minWidth: '1000px',
            maxWidth: '1000px',
            width: '1000px',
            margin: '20px auto 0',

        },

        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

function Orders() {
    const classes = useStyles();
    const ref = useRef(null);
    const { width, height } = useWindowDimensions();

    function OrderView() {
        if (width > 768) {
            return <OrderViewClassic/>
        } else {
            return <OrderViewMobile/>
        }
    }

    return (
        <div className={classes.container}>
            <h1 className={classes.title}>My Orders</h1>
            <OrderViewMobile/>
        </div>
    );
}

// this function only runs on the server by Next.js
//export const getServerSideProps = async ({params}) => {
//   const userId = params.userId;
//    return {
//        props: { userId }
//    }
//}

Orders.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

// This gets called on every request
const getServerSideProps = ({ req, res }) => {
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

export default Orders;
