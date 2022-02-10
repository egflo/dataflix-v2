import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';
import ResultRow from './ResultRow.js';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import  React, {useRef, useState,useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useRouter} from "next/router";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import {decodeSort} from "../../utils/helpers";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100vw',
    },

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

export default function ResultViewMobile(...props) {
    const router = useRouter();
    const classes = useStyles();
    const ref = useRef(null);
    const {query} = props[0];
    const {type, term, sort} = query;

    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState(sort);

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastPage, setLastPage] = useState(false);

    useEffect(() => {
        setLoading(true);
        let url = process.env.NEXT_PUBLIC_API_URL + "/movie/" + type + "/" + term + "?page=" + page + decodeSort(sort);
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
        setPage(page + 1);
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

    return (
        <>
            <div className={classes.container}>
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
                            <MenuItem value={4}>Title: Z - A</MenuItem>
                            <MenuItem value={5}>Title: A - Z</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <InfiniteScroll
                    dataLength={list.length}
                    next={fetchMoreData}
                    hasMore={!lastPage}
                    loader={<h4>Loading...</h4>}
                >
                    {list.map((movie, index) => (
                        <ResultRow key={index} content={movie}></ResultRow>
                    ))}
                </InfiniteScroll>

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