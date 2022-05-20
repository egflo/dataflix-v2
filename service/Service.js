
import React from 'react'
import axios from "axios";
import useSWR, { useSWRConfig } from 'swr'
import * as setCookie from 'set-cookie-parser'
import {getCookie} from "cookies-next";


// Create a new axios instance
export let axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})

// Create a new axios request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        //const token = localStorage.getItem("accessToken")
        const token = getCookie('accessToken')

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    }
    , (error) => {
        // Do something with request error
        return Promise.reject(error)
    }
)


axiosInstance.interceptors.response.use( (response) => {
    return response
}, (error) => {
    const originalRequest = error.config;
    let url = originalRequest.url;

    if(error.response.status === 401 && url.includes("/user/refresh")) {
        console.log("Refresh token expired");
        return Promise.reject(error);
    }

    if (error.response.status === 401) {
        /*
         * When response code is 401, try to refresh the token.
         * Eject the interceptor so it doesn't loop in case
         * token refresh causes the 401 response
         */

        return axiosInstance.post('/user/refresh', {
            refreshToken: getCookie('refreshToken')
            }).then( (response) => {

                if (response.status === 200) {

                    let accessToken = response.data.accessToken;
                    let refreshToken = response.data.refreshToken;
                    let bearerType = response.data.bearerType;

                    /*
                     * Set the new token in the local storage
                     */
                    //localStorage.setItem('accessToken', accessToken);
                   // localStorage.setItem('refreshToken', refreshToken);
                    const options = {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7,
                        secure: true,
                        sameSite: 'lax',
                    };
                    setCookie('accessToken', accessToken, options);
                    setCookie('refreshToken', refreshToken, options);
                    /*
                     * Change the request's headers to include the new token
                     */
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                    /*
                     * Retry the request
                     */
                    return axios(originalRequest);
                }
            })
    }

    return Promise.reject(error)
})


const fetcher = (url) =>
    axiosInstance( url )
        //.get(process.env.NEXT_PUBLIC_API_URL + url)
        .then((res) => res.data)
        .catch((error) => {
            const status = new Error('An error occurred while fetching the data.')
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                status.info = error.response.data;
                status.status = error.response.status;

            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the
                // browser and an instance of
                // http.ClientRequest in node.js
                status.info = {"message": "Error connecting to Server"};
                status.status = 500
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }

            throw status;
        });

/*
 * Fetch the data from the API using GET method
 */
const options = { revalidateAll: true,}
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

    const url = "/cast/movie/" + id

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

    const url = "/cast/" + id

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