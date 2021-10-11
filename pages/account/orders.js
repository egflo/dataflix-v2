import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import  React, {useRef, useState, useRouter, useEffect} from 'react';
import {useGetSales} from '../api/Service'
import Image from 'next/image'
import Order from '../../components/Order'
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from 'react-bootstrap';
import {getUserId} from '../../utils/helpers'
import Navigation from '../../components/Navbar'


const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));

function Orders() {

    const ref = useRef(null);
    var [page, setPage] = useState(0);

   // const { data, error } = useGetSales("/customer" + getUserId() +"?page=" + page)
    const { data, error } = useGetSales("?page=" + page)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return(
        <div>
            <div className="order-container">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );
    
    const total_pages = data['totalPages']

    function handlePageClick(event, page) {
        setPage(page - 1)
        // router.push({
        //     pathname: '/results/' + term,
        //     query: {type: type, page: page, order: order},
        // })
    }

    return (
        <>
            <Navigation />
            {data.content.map(sale => (
                <Order key={sale.id} content={sale}></Order>
            ))}

            <div className="order-pagination">
                <Pagination count={total_pages}
                            variant="outlined"
                            color="primary"
                            shape="rounded"
                            size='large'
                            page={page + 1}
                            onChange={handlePageClick}
                />
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

export default Orders;
