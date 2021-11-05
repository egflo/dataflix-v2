
import React from 'react'
import axios from "axios";
import useSWR, { useSWRConfig } from 'swr'

const baseUrl = "http://localhost:8080"
const fetcher = (url) =>
    axios
        .get(baseUrl + url, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } })
        .then((res) => res.data)
        .catch((error) => {

            const status = new Error('An error occurred while fetching the data.')

            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
                status.info = error.response.data;
                status.status = error.response.status;

            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the
                // browser and an instance of
                // http.ClientRequest in node.js
               // console.log(error.request);
                status.info = {"message": "Error connecting to Server"};
                status.status = 500
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }

            throw status;
        });

const options = { revalidateAll: true,}
//const fetcher = url => fetch(url).then(res => res.json())

export const getBaseURL = () => {
    return baseUrl;
}

export const useGetUser = () => {

    const url = "/customer/";
    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return {data, error}
}

export const useGetAddress = () => {

    const url = "/address/";
    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return {data, error}
}

export const useGetCheckOut = (path) => {

    const url = "/checkout" + path;
    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return {data, error}
}

export const useGetSales = (path) => {

    const url = "/sale/" + path

    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    console.log(url)
    console.log(data)
    return {data, error}
}

export const useGetUserCart = (path) => {
    const url = "/cart/" + path

    const { data, mutate, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return {data, mutate, error}
}

export const useGetMovies = path => {

    if (!path) {
        throw new Error("Path is required")
    }
    const url =  path

    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return {data, error}
}

export const useGetMovieId = id => {

    const url = "/movie/" + id

    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return { data, error }
}

export const useGetMovieMeta = path => {

    const url = path

    const { data, mutate, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return { data, mutate, error }
}

export const useGetMovieReviews = id => {

    const url = "/review/movie/" + id + "?limit=10"

    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return {data,error}
}

export const useGetMovieCast = id => {

    const url = "/star/movie/" + id

    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return {data,error}
}

export const useGetFilmography = id => {

    const url =  "/movie/star/" + id + "?limit=15"

    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return {data,error}
}


export const useGetCast = id => {

    const url = "/star/" + id

    const { data, error } = useSWR(url, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return

            // Never retry for a specific key.
            if (key === url) return

            // Only retry up to 10 times.
            if (retryCount >= 10) return

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
        }})

    return {data,error}
}