

import React from 'react'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(res => res.json())
const baseUrl = "http://localhost:8080"

export const useGetMovieBackground = id => {

    const url = "http://webservice.fanart.tv/v3/movies/" + id + "?"

    const { data, error } = useSWR(url, fetcher)

    return { data, error }
}

export const useGetMovies = path => {
    if (!path) {
        throw new Error("Path is required")
    }

    const url = baseUrl + path

    console.log(url)
    
    const { data, error } = useSWR(url, fetcher)

    //console.log("Movie Data")
    //console.log(url)

    return { data, error }
}

export const useGetMovieId = id => {

    const url = baseUrl + "/movie/" + id

    const { data, error } = useSWR(url, fetcher)

    console.log("Movie Title " + id)
    console.log(url)

    return { data, error }
}


export const useGetMovieMeta = path => {

    const url = baseUrl + path

    const { data, error } = useSWR(url, fetcher)

    return { data, error }
}


export const useGetMoviesTitle= params => {

    const url = baseUrl + "/movie/title/" + params

    const { data, error } = useSWR(url, fetcher)

    //console.log("Movie Data Title")
    console.log(url)

    return {data,error}
}


export const useGetMovieReviews = id => {

    const url = baseUrl + "/review/movie/" + id + "?limit=2"

    const { data, error } = useSWR(url, fetcher)

    //console.log("Movie Data Review")
    //console.log(url)

    return {data,error}
}


export const useGetMovieCast = id => {

    const url = baseUrl + "/star/movie/" + id

    const { data, error } = useSWR(url, fetcher)

    //console.log("Movie Data Cast")
    //console.log(url)

    return {data,error}
}

export const useGetFilmography = id => {

    const url = baseUrl + "/movie/star/" + id

    const { data, error } = useSWR(url, fetcher)

    //console.log("Movie Data Cast")
    //console.log(url)

    return {data,error}
}


export const useGetCast = id => {

    const url = baseUrl + "/star/" + id

    const { data, error } = useSWR(url, fetcher)

    //console.log("Movie Data Cast")
    //console.log(url)

    return {data,error}
}