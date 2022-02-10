import {React, useEffect, useState} from 'react';
import jwt_decode from "jwt-decode";


export const decodeSort = (sort) => {
    let newSort, newOrder;

    if (sort == 0) {
        newSort = "price.price";
        newOrder = 0;
    }
    else if (sort == 1) {
        newSort = "price.price";
        newOrder = 1;
    }
    else if (sort == 2) {
        newSort = "year";
        newOrder = 1;
    }
    else if (sort == 3) {
        newSort = "year";
        newOrder = 0;
    }

    else if (sort == 4) {
        newSort = "title";
        newOrder = 1;
    }
    else  {
        newSort = "title";
        newOrder = 0;
    }

    //const path = "/movie/" + type + "/" + term + "?page=" + page + "&sortBy=" + newSort + "&orderBy=" + newOrder
    const path = "&sortBy=" + newSort + "&orderBy=" + newOrder;
    return path;
};

export const formatRuntime = runtime =>
{
    if(runtime == null || runtime == "N/A")
    {
        return "Runtime Unavailable";
    }

    const num = runtime.split(" ")[0]

    const hours = Math.floor(num / 60);
    const minutes = num % 60;
    return hours + "h " + minutes + " min";
}


export const numFormatter = num =>
{
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
    }else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
    }else if(num < 1000){
        return num; // if value < 1000, nothing to do
    }
}

export const formatCurrency = num =>
{
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(num)
}

export const getUserId = () => {

    // Update the document title using the browser API
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("token");
        let decodedToken = jwt_decode(token);

        const {sub, iss, iat} = decodedToken;
        const id = sub.split(',')[0];
        
        console.log(id)
        return id;
    }
}