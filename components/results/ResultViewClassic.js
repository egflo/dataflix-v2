import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';
import ResultRow from './ResultRow.js';
import ResultRowDetailed from './ResultRowDetailed.js';
import Pagination from '@material-ui/lab/Pagination';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import  React, {useRef, useState,useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useGetMovies}  from "../../service/Service";
import {useRouter} from "next/router";
import {decodeSort} from "../../utils/helpers";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '800px',
        margin: '0 auto',
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

export default function ResultViewClassic(props) {

    const {type, term, page, sort} = props.query;

    const router = useRouter();
    const classes = useStyles();

    const [current,setCurrent] = useState(parseInt(page) || 1);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    //const path = "/movie/" + type + "/" + term + "&page=" + page + "&sortBy=" + sort + "&orderBy=" + order
    const { data, error } = useGetMovies("/movie/" + type + "/" + term + "?page=" + current + decodeSort(sort));

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return (
        <div>
            <div className="result-content">
                <div className="loading-container"><CircularProgress/></div>
            </div>
        </div>
    );

    const total_pages = data['totalPages']

    function handlePageClick(event, page) {
        setCurrent(page);
        //router.push({
        //    pathname: '/results/' + term,
        //    query: {type: type, page: page, sort:sort},
        //})
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

                {data.content.map(movie => (
                    <ResultRowDetailed {...props} key={movie.id} content={movie}></ResultRowDetailed>
                ))}

                <div style={{paddingTop:'10px'}}>
                    <Pagination count={total_pages}
                                variant="outlined"
                                color="primary"
                                shape="rounded"
                                size='large'
                                page={current}
                                onChange={handlePageClick}
                    />
                </div>


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