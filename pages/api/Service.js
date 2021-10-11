
import React from 'react'
import axios from "axios";
import useSWR, { useSWRConfig } from 'swr'
import  {getUserId} from '../../utils/helpers';

const baseUrl = "http://localhost:8080"
const fetcher = (url) =>
    axios
        .get(baseUrl + url, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
        .then((res) => res.data);

const options = { revalidateAll: true }

//const fetcher = url => fetch(url).then(res => res.json())

export const useGetUser = () => {

    const url = "/customer/";

    console.log(url)
    const { data, error } = useSWR(url, fetcher, options)

    return {data, error}
}

export const useGetCheckOut = (id) => {

    const url = "/checkout/" + id;

    console.log(url)
    const { data, error } = useSWR(url, fetcher, options)
    
    return {data, error}
}

export const useGetSales = (path) => {

    const url = "/sale/" + path

    const { data, error } = useSWR(url, fetcher, options)

    return {data, error}
}
export const useGetUserOrders = (path) => {

    const url = "/sale/customer/" + path
    

    const { data, error } = useSWR(url, fetcher, options)

    return {data, error}
}

export const useGetUserCart = (path) => {
    const url = "/cart/" + path

    const { data, mutate, error } = useSWR(url, fetcher, options)

    return {data, mutate, error}
}


export const useGetMovieBackground = id => {

    const url = "http://webservice.fanart.tv/v3/movies/" + id + "?"

    const { data, error } = useSWR(url, fetcher)

    return { data, error }
}

export const useGetMovies = path => {

    if (!path) {
        throw new Error("Path is required")
    }

    const url =  path
    const { data, error} = useSWR(url, fetcher, options)

    return {data, error}
}

export const useGetMovieId = id => {

    const url = "/movie/" + id

    const { data, error } = useSWR(url, fetcher, options)

    return { data, error }
}


export const useGetMovieMeta = path => {

    const url = path
    
    const { data, mutate, error } = useSWR(url, fetcher, options)

    return { data, mutate, error }
}


export const useGetMoviesTitle= params => {

    const url = "/movie/title/" + params

    const { data, error } = useSWR(url, fetcher, options)

    return {data,error}
}


export const useGetMovieReviews = id => {

    const url = "/review/movie/" + id + "?limit=10"

    const { data, error } = useSWR(url, fetcher)


    return {data,error}
}


export const useGetMovieCast = id => {

    const url = "/star/movie/" + id

    const { data, error } = useSWR(url, fetcher, options)

    return {data,error}
}

export const useGetFilmography = id => {

    const url =  "/movie/star/" + id + "?limit=15"

    const { data, error } = useSWR(url, fetcher)


    return {data,error}
}


export const useGetCast = id => {

    const url = "/star/" + id

    const { data, error } = useSWR(url, fetcher)

    return {data,error}
}