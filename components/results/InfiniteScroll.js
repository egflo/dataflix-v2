import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import  React, {useRef, useState, useEffect, useCallback} from 'react'
import {axiosInstance} from "../../service/Service";

function GetMovies(path, page) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [list, setList] = useState([]);
    const [last, setLast] = useState(false);
    const [total, setTotal] = useState(0);

     //setLoading({ loading: true });
    const url = process.env.NEXT_PUBLIC_API_URL + path + "?page=" + page + "&limit=8";
    const sendQuery = useCallback(async() => {
        try {
            await setLoading(true);
            await setError(false);
            const res = await axiosInstance.get(url);
            //const data = {content, totalElements, empty, last}
            //await setList((prev) => [...prev, ...res.data.content]);
            await setList((prev) => {
                return [...new Set([...prev, ...res.data.content])];
            });
            //const ids = await list.map(o => o.movieId)
            //await setList(list.filter(({id}, index) => !ids.includes(id, index + 1)))
            //setTotal(res.data.totalElements);
            setLast(res.data.last);
            setLoading(false);
        } catch(error) {
            setError(error);
        }
    }, [page]);

    useEffect(() => {
        sendQuery(page);
    }, [sendQuery, page]);

    return {loading, error, list, last, total};
    //  .then(res => {
    //     setMovies({ photos: [...movies, ...res.data.content] });
    //      setLoading(false);
    // });
}

export default GetMovies;