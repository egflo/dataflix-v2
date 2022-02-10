
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import React, {useState} from 'react'
import NoBackground from "../../public/BACKGROUND.png";
import MovieCardDetailed from "../../components/movie/MovieCardDetailed";
import Button from "react-bootstrap/Button";
import {formatRuntime, numFormatter, getUserId, formatCurrency} from '/utils/helpers'
import {mutate} from "swr";


//https://blog.8bitzen.com/posts/01-11-2018-material-ui-dynamically-changing-styling-by-changing-property-in-classes/
const useStyles = makeStyles((theme) => ({
        container: {
            [theme.breakpoints.down('sm')]: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: '#fafafa',
                backgroundImage: `url(${NoBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: '0',
                margin: '0px',
                overflow: 'hidden',
                position: 'relative',

            },

            [theme.breakpoints.up('md')]: {
                display: 'grid',
                gridTemplateRows: '380px 50px',
                margin: '15px auto',
                position: 'relative',
                backgroundColor: 'white',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                transition: '0.3s',
                borderRadius: '5px', /* 5px rounded corners */
                minWidth: '805px',
                maxWidth: '805px',
            },
        },

}));


export default function ResultRowDetailed(props) {
    const router = useRouter()
    const [hover, setHover] = useState(false);
    const classes = useStyles();


    function handleClick() {
        router.push({
            pathname: '/movie/' + props.content.id,
            //query: { id: id },
        })
    }

    function MouseOver(event) {
        setHover(true)

    }
    function MouseOut(event){
        setHover(false)
    }

    async function handleAddCart() {
        const token = localStorage.getItem("token")
        // POST request using fetch with set headers
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'My-Custom-Header': 'dataflix'
            },
            body: JSON.stringify({
                userId: getUserId(),
                movieId:props.content.id,
                qty: 1 })
        };
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/cart/', requestOptions)
        if(res.status < 300) {
            await mutate('/cart/')

            props.setalert({
                open: true,
                type: 'success',
                message: 'Movie added to cart.'
            })

        }
        else if(res.status == 400) {
            props.setalert({
                open: true,
                type: 'error',
                message: 'Unable to add to cart. Product is out of stock'
            })
        }
        else {
            props.setalert({
                open: true,
                type: 'error',
                message: 'Error adding to cart'
            })
        }
    }

    return (
        <div className={classes.container}>
            <div onMouseOver={MouseOver} onMouseOut={MouseOut} className={classes.content}>
                <MovieCardDetailed {...props} content={props.content} hover={hover}/>
                <div style={{
                    backgroundColor:'dodgerblue',
                    borderBottomLeftRadius: '5px',
                    borderBottomRightRadius: '5px',
                }}>
                    <Button className="btn-block"  onClick={handleAddCart}>
                        <h3>Add to Bag for {formatCurrency(props.content.price)}</h3>
                    </Button>
                </div>
            </div>
        </div>
    );
}