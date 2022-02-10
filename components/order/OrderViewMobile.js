import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  React, {useRef, useState, useRouter, useEffect} from 'react';
import {useGetSales} from '../../service/Service'
import Image from 'next/image'
import Order from './Order'
import { makeStyles } from '@material-ui/core/styles';
import {faBox, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },

    mobile: {
        //border: '1px solid black',
    },

    orderHeadline: {
        width: '100vw',
    },

    orderEmpty: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        padding: '25px 55px 25px 55px',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
    },

    orderContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
        marginBottom: '20px',
        width: '100%',
        height: '100%',
        //backgroundColor: '#f5f5f5',
        //borderRadius: '10px',
        //boxShadow: '0px 0px 10px #00000029'
    },
}));


function OrderViewMobile() {
    const ref = useRef(null);
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastPage, setLastPage] = useState(false);

    //const { data, error } = useGetSales("/customer" + getUserId() +"?page=" + page)
    const { data, error } = useGetSales("?page=" + page)

    useEffect(() => {
        setLoading(true);
        let url = process.env.NEXT_PUBLIC_API_URL + "/sale/?page=" + page;
        axios
            .get( url, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
            .then((res) => {
                const data = res.data;
                const {content, totalPages, totalElements, size, last} = data;
                setList(list.concat(content));
                setLastPage(last);
                setLoading(false);
            })
            .catch((error) => {
                const status = new Error('An error occurred while fetching the data.');
                setLoading(false);
            });


    }, [page])

    function fetchMoreData() {
        console.log("fetchMoreData");
        setPage(page + 1);
    }

    function OrderData() {
        if(list.length === 0 && loading) {
            return (
            <div>
                <div className={classes.orderContainer}>
                    <div className="loading-container"><CircularProgress/></div>
                </div>
            </div>)
        }

        else if(list.length === 0) {
            return(
                <div className={classes.orderEmpty}>
                    <FontAwesomeIcon icon={faBox} size="6x" style={{color:"black"}} />
                    <div style={{paddingLeft:'15px'}}>
                        <h2>You have no orders.</h2>
                        <p>You have no order in your account. To purchase items, click on the &quot;Add to Cart&quot; button next to the movie you want to purchase.</p>
                    </div>
                </div>
            )
        }
        else {
            return(

                <div className={classes.mobile}>
                    <h1>My Orders</h1>
                    <InfiniteScroll
                        dataLength={list.length}
                        next={fetchMoreData}
                        hasMore={!lastPage}
                        loader={<h4>Loading...</h4>}
                        endMessage={
                            <p style={{textAlign: 'center'}}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                    >
                        {list.map((sale, index) => (
                            <Order key={sale.id} content={sale}></Order>
                        ))}
                    </InfiniteScroll>
                </div>

            )
        }
    }

    return (
        <>
            <div className={classes.orderContainer}>
                <OrderData />
            </div>
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

export default OrderViewMobile;
