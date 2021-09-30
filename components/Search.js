
/* eslint-disable no-use-before-define */
import React from "react";
import { useEffect, useState } from "react";


import {useGetMovies} from '../pages/api/Service'
import { useRouter } from 'next/router'

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import NoSsr from '@material-ui/core/NoSsr';

import { makeStyles } from '@material-ui/core/styles';
import {Form, Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


export default function Search() {
    const router = useRouter()

    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const [typing, setTyping] = useState(false);

    const { data, error } = useGetMovies("/movie/autocomplete/" + inputValue);

    if (error) return <h1>Something went wrong!</h1>

    function handleOption(option, state) {
        return (
            <div className='list-box'>
                <img
                    src={option.poster}
                    onError={(e) => (e.target.onerror = null, e.target.src = '/no_image.jpg')}/>
                <div className='list-box-text'>
                    <h4>{option.title}</h4>
                    <p>{option.year} - {option.rated} - {option.runtime}</p>
                    <p>{option.director}</p>
                </div>
            </div>

        )
    }

    function handleSubmit() {
        //onSubmit={handleSubmit}

        console.log("SUBMIT")
        console.log(inputValue)
        router.push({
            pathname: '/results/[term]',
                 query: { term: inputValue, type: "title"},
        })
    }
    
    return (
            <div className="search-box">
                <NoSsr>
                    <Autocomplete
                        size="small"
                        style={{ width: 500 }}
                        options={!data ? []: data}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        getOptionLabel={(option) => option.title}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        onSubmit={() => console.log('hey')}
                        freeSolo
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderInput={
                            (params) => (
                                <div ref={params.InputProps.ref} className="search-input" >
                                    <input
                                        style={{
                                            width: 470,
                                            minWidth: 470,
                                            border: 0,
                                            paddingLeft: 5
                                        }}
                                        type="text"
                                        placeholder="Search Movies.."
                                        {...params.inputProps} />

                                    <button onClick={handleSubmit}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                </div>
                            )}
                        renderOption={handleOption}
                    />
                </NoSsr>
            </div>
    );
}

