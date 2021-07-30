
/* eslint-disable no-use-before-define */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {useGetMoviesTitle} from '../api/Service'
import { useEffect, useState } from "react";
import { Button, Form, FormControl} from 'react-bootstrap';
import { useRouter } from 'next/router'


export default function SearchBox() {
    var content = [];
    const router = useRouter()

    const [term, setTerm] = useState("T");
    const { data, error } = useGetMoviesTitle(term)

    try {
        content = data.content
    } catch (error) {
        console.log("Connot read content")
    }

    function handleChange(event, value) {
        //console.log(value);
        setTerm(value)
    }

    function handleClick() {
        console.log(term)
        router.push({
            pathname: '../components/Results',
            query: { term: term, type: "title"},
        })
    }
    
    return (
        <Form inline className="search-form">
            <Autocomplete
                id="search-box"
                options={content}
                style={{
                    width: 300,
                    marginRight: 5
                }}
               // getOptionLabel={(option) => option.title + " (" + option.year + ")"}
                getOptionLabel={(option) => option.title}
                onInputChange={handleChange}
                renderInput={params => (
                    <TextField {...params} label="Search" variant="outlined" fullWidth />
                )}
            />
            <Button onClick={handleClick} variant="outline-primary" className="button-search">Search</Button>
        </Form>

    );
}

