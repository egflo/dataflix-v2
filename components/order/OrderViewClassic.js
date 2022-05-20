import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  React, {useRef, useState, useRouter, useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import {faBox, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {useGetSales} from "../../service/Service";
import Order from '../../components/order/Order';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },

    classic: {

    },
    orderHeadline: {
        minWidth: '1000px',
        maxWidth: '1000px',
        width: '1000px',
    },

    orderEmpty: {
        display: 'flex',
        height: '100vh',
        width: '600px',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        marginTop: '10%',
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

function OrderViewClassic() {
    const ref = useRef(null);
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [list, setList] = useState([]);

    const { data, error } = useGetSales("?page=" + page)

    if (error) return(

        <div className={classes.orderContainer}>
            <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
            <h2>Unable to load Order Information.</h2>
        </div>
    )
    if (!data) return(
        <div className={classes.orderContainer}><CircularProgress /></div>
    );


    const {totalPages, totalElements, size, last} = data;

    function handlePageClick(event, page) {
        setPage(page - 1)
    }

    function fetchMoreData() {
        setPage(page + 1);
    }

    function OrderData() {
        if(totalElements === 0) {
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
                <div className={classes.classic}>
                    <h1 className={classes.orderHeadline}>Your Orders</h1>

                    {data.content.map(sale => (
                        <Order key={sale.id} content={sale}></Order>
                    ))}

                    <div className="order-pagination">
                        <Pagination count={totalPages}
                                    variant="outlined"
                                    color="primary"
                                    shape="rounded"
                                    size='large'
                                    page={page + 1}
                                    onChange={handlePageClick}
                        />
                    </div>
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

export default OrderViewClassic;
