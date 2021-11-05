import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@material-ui/lab/Rating';

import { useRouter } from 'next/router'
import {useGetMovies} from '../api/Service'
import ResultRow from '../../components/ResultRow'
import Pagination from '@material-ui/lab/Pagination';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';

import  React, {useRef, useState,useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Navigation from '../../components/Navbar'


const useStyles = makeStyles((theme) => ({
    button: {
        display: 'block',
        marginTop: theme.spacing(2)
    },
    formControl: {
        marginBottom: theme.spacing(4),
        float: 'right',
        textAlign: 'center',
        minWidth: 120
    },

}));

export default function Results() {

    const classes = useStyles();
    const ref = useRef(null);
    const router = useRouter();

    const type = router.query['type']
    const term = router.query['term']
    const page = router.query['page'] || 0
    const sort = router.query['sort'] || 0

    if(!type || !term) {
        return (
            <div>
                <div className="result-content">
                    <div className="loading-container"><CircularProgress/></div>
                </div>
            </div>
        );
    }

    var [open, setOpen] = useState(false);

    //const path = "/movie/" + type + "/" + term + "&page=" + page + "&sortBy=" + sort + "&orderBy=" + order
    var { data, error } = useGetMovies(decoderPath())

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return (

        <div>
            <div className="result-content">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const total_pages = data['totalPages']

    function handleClick() {
        router.push({
            pathname: '/movie/' + id,
            //query: { id: id }
        })
    }

    function handlePageClick(event, page) {
        router.push({
            pathname: '/results/' + term,
            query: {type: type, page: page, sort:sort},
        })
    }

    function handleSelectChange(event) {
        const value = event.target.value;
        router.push({
            pathname: '/results/' + term,
            query: {type: type, page: page, sort:value},
        })
    }

    function handleClose() {
        setOpen(false);
    }

    function handleOpen() {
        setOpen(true);
    }

    function decoderPath() {
        var newSort, newOrder;

        if (sort == 0) {
            newSort = "price"
            newOrder = 1
        }
        else if (sort == 1) {
            newSort = "price"
            newOrder = 0
        }
        else if (sort == 2) {
            newSort = "year"
            newOrder = 1
        }
        else if (sort == 3) {
            newSort = "year"
            newOrder = 0
        }

        else if (sort == 4) {
            newSort = "title"
            newOrder = 1
        }
        else  {
            newSort = "title"
            newOrder = 0
        }

        const path = "/movie/" + type + "/" + term + "?page=" + page + "&sortBy=" + newSort + "&orderBy=" + newOrder

        return path;
    }


    return (
        <>
            <Navigation />
            <div className="result-content">
                <h2 className="results-headline">Results for {term} </h2>

                <div ref={ref}>
                    <FormControl className={classes.formControl} >
                        <InputLabel id="demo-simple-select-filled-label">Sort By</InputLabel>
                        <Select
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={sort}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={0}>Price: Low to High</MenuItem>
                            <MenuItem value={1}>Price: High to Low</MenuItem>
                            <MenuItem value={2}>Year: Newest to Oldest</MenuItem>
                            <MenuItem value={3}>Year: Oldest to Newest</MenuItem>
                            <MenuItem value={4}>Title: A - Z</MenuItem>
                            <MenuItem value={5}>Title: Z - A</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {data.content.map(movie => (
                    <ResultRow key={movie.id} content={movie}></ResultRow>
                ))}

                <Pagination count={total_pages}
                            variant="outlined"
                            color="primary"
                            shape="rounded"
                            size='large'
                            page={parseInt(page) == 0? 1:parseInt(page)}
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
