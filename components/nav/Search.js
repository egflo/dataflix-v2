
/* eslint-disable no-use-before-define */
import React from "react";
import { useEffect, useState } from "react";
import NoImage from '../../public/NOIMAGE.png'
import Image from 'next/image'
import validator from 'validator'
import {useGetMovies} from '../../service/Service'
import { useRouter } from 'next/router'
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from '@material-ui/core/CircularProgress';
import NoSsr from '@material-ui/core/NoSsr';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import {formatRuntime} from '../../utils/helpers'
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const useStyles = makeStyles((theme) => ({
    listBox: {
        display: 'grid',
        gridTemplateColumns: '50px auto',
        '& > * > img': {
            borderRadius: '5px',
        },
    },

    listBoxText: {
        marginLeft: '5px',
        marginRight: '4px',
        '& > h4': {
            fontSize:'18px',
            marginBottom:'1px',
        },
        '& > p': {
            color:'18px',
            marginTop: '1px',
            marginBottom:'1px',
        },
    },
}));


const SearchBox = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({

    '& .MuiFilledInput-root': {

        [theme.breakpoints.down('sm')]: {
            minWidth: '85vw',
            width: '85vw',
        },

        [theme.breakpoints.up('sm')]: {
            minWidth: '470px',
        },

       // border: '1px solid #e2e2e1',
        border: '0px',
        overflow: 'hidden',
        borderTopLeftRadius: '5px',
        borderBottomLeftRadius: '5px',
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px',
        //backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
        backgroundColor: 'white',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&.Mui-focused': {
            backgroundColor: 'white',
            //boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
           // borderColor: theme.palette.primary.main,
        },
    },
}));


export default function Search() {
    const router = useRouter();
    const classes = useStyles();
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const [typing, setTyping] = useState(false);

    const { data, error } = useGetMovies("/movie/autocomplete/" + inputValue);

    if (error) return <></>

    function handleOption(option, state) {
        return (
            <div className={classes.listBox}>
                <Image
                    src={option.poster == null || !validator.isURL(option.poster) ? NoImage : option.poster}
                    width={50}
                    height={50}
                    objectFit="cover"
                    alt="Not Found"
                >
                </Image>
                <div className={classes.listBoxText}>
                    <h4>{option.title}</h4>
                    <p>{option.year} - {option.rated} - {formatRuntime(option.runtime)}</p>
                    <p>{option.director}</p>
                </div>
            </div>

        )
    }

    function handleSubmit() {
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
                        //style={{ width: 500 }}
                        options={!data || error ? []: data}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        getOptionLabel={(option) => option.title || ""}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        loading={open&&!data}
                        freeSolo
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                console.log('Enter key pressed');
                                handleSubmit();
                            }
                        }}
                        renderInput={
                            (params) => (
                                <div ref={params.InputProps.ref} className="search-input" >
                                    <SearchBox
                                        {...params}
                                        label="Search Movies"
                                        variant="filled"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {open&&!data ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />

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

