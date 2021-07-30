import 'bootstrap/dist/css/bootstrap.min.css'
import '@fontsource/roboto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@material-ui/lab/Rating';

import { useState } from 'react';
import { useRouter } from 'next/router'
import {useGetMovies} from '../api/Service'
import Navigation from '../components/Navbar'
import ResultRow from '../components/ResultRow'

import Pagination from '@material-ui/lab/Pagination';



export default function Results() {
    const router = useRouter()
    var term = router.query['term']
    var type = router.query['type']

    var [page, setPage] = useState(0)
    var [limit, setLimit] = useState(5)

    var path = "/movie/" + type + "/" + term + "?limit=" + limit + "&page=" + page
    var { data, error } = useGetMovies(path)

    if (error) return <h1>Something went wrong!</h1>
    if (!data) return <h1>Loading...</h1>

    const total_pages = data['totalPages']
    const current_page = data['number']
    const numOfElements = data['numberOfElements']

    const last = data['last']
    const first = data['first']
    const empty = data['empty']


    function handleClick() {
        console.log(id)
        router.push({
            pathname: '../components/Movie',
            query: { id: id },
        })
    }

    function handlePageClick(event, page) {
        console.log(page)
        setPage(page-1)

    }

    return (
        <body>
            <Navigation></Navigation>

            <h2 className="results-headline">Results for {router.query['term']} </h2>
            
            <div className="result-content">
                {data.content.map(movie => (
                    <ResultRow key={movie.id} content={movie}></ResultRow>
                ))}
            </div>

            <Pagination count={total_pages}
                        variant="outlined"
                        color="primary"
                        shape="rounded"
                        size='large'
                        page={page + 1}
                        onChange={handlePageClick}

            />


        </body>


    );
}